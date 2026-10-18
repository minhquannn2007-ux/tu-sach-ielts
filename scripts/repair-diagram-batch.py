"""Explicitly source-reviewed diagram imports. No inferred arrows or answer keys."""
import argparse,json,hashlib,importlib.util,re
from pathlib import Path
import fitz
from functools import lru_cache
from PIL import Image,ImageDraw,ImageOps,ImageFilter
import numpy as np
sp=importlib.util.spec_from_file_location('h',Path(__file__).with_name('reviewed-ocr.py'));h=importlib.util.module_from_spec(sp);sp.loader.exec_module(h);m=h.m
p=argparse.ArgumentParser();p.add_argument('--cache',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();b=h.DraftBatch(a.cache,a.output)
layouts=json.load(open(h.ROOT/'import/diagram-layouts.json'));jobs={j['id']:j for j in json.load(open(h.ROOT/'import/jobs.json'))};fitz.TOOLS.mupdf_display_errors(False);fitz.TOOLS.mupdf_display_warnings(False)
def bank(text):return [{'value':chr(65+i),'text':t} for i,t in enumerate(text)]
def ocr(sid):
 raw=json.load(open(h.ROOT/'import/prepared'/(sid+'.json')));assert raw['sha256']==hashlib.sha256((a.cache/(sid+'.pdf')).read_bytes()).hexdigest();return raw,[p['text'] for p in raw['pages']]
def paras(text,starts,fix=(),labels=False):
 text=h.fixes(text,fix);text=text[text.index(starts[0]):];out=h.split(text,starts)
 return [{'text':re.sub(r'^[A-I]\s+','',t),**({'label':chr(65+i)} if labels else {})} for i,t in enumerate(out)]
def inp(start,end,text,word='ONE WORD ONLY',task='summary',title=None,page=4):
 g=h.summary(start,end,title,text,page);g.update(wordLimit=word,task=task);g['sourceInstructions']=g['sourceInstructions'].replace('ONE WORD ONLY',word).replace('Complete the summary','Complete the '+task);return g
def info(start,texts,letters,part,page):
 count={8:'eight',9:'nine'}[len(letters)];return {'type':'matching-info','questions':h.qs(start,texts),'letters':list(letters),'paragraphCount':len(letters),'reuse':False,'sourcePages':[page],'sourceInstructions':f'Questions {start} – {start+len(texts)-1} Reading Passage {part} has {count} paragraphs, A-{letters[-1]}. Which paragraph contains the following information? Write the correct letter on your answer sheet.'}
def short(start,texts,word,page):return {'type':'short-answer','questions':h.qs(start,texts),'wordLimit':word,'sourcePages':[page],'sourceInstructions':f'Questions {start} – {start+len(texts)-1} Answer the questions below. Choose {word} from the passage for each answer. Write your answers on your answer sheet.'}
def mc(start,texts,opts,page):return {'type':'mc-one','questions':[{'n':start+i,'prompt':t,'options':bank(o)} for i,(t,o) in enumerate(zip(texts,opts))],'sourcePages':[page],'sourceInstructions':f'Questions {start} – {start+len(texts)-1} Choose the correct letter, A, B, C or D. Write the correct letter on your answer sheet.'}
@lru_cache(maxsize=None)
def diagram(job):
 c=layouts[job];source=a.cache/(c['source']+'.pdf');doc=fitz.open(source);page=doc[c['page']-1];crop=fitz.Rect(c['crop']);scale=1800/crop.width
 pix=page.get_pixmap(matrix=fitz.Matrix(scale,scale),clip=crop);im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
 # Paper scans are cleaned without replacing diagram geometry. The original
 # arrow linework is retained pixel-for-pixel apart from tonal normalization.
 im=ImageOps.grayscale(im)
 if job=='p1-the-olympic-torch-chua-rep':
  gray=np.asarray(im,dtype=float);background=np.asarray(im.filter(ImageFilter.GaussianBlur(40)),dtype=float);clean=np.minimum(255,gray*255/np.maximum(1,background));clean[clean>240]=255;im=Image.fromarray(clean.astype('uint8'))
 im=ImageOps.autocontrast(im,cutoff=.2);draw=ImageDraw.Draw(im)
 for r in c.get('masks',[]):draw.rectangle([(r[0]-crop.x0)*scale,(r[1]-crop.y0)*scale,(r[2]-crop.x0)*scale,(r[3]-crop.y0)*scale],fill=255)
 pad=round(im.width*.18);im=ImageOps.expand(im,border=(pad,0,pad,0),fill=255)
 name='assets/diagram-'+job+'-reviewed.png';im.save(h.ROOT/'dist'/name,optimize=True)
 captions=[]
 for label in c['labels']:
  x0,y0,x1,y1=label['rect'];captions.append({'x':round(((x0-crop.x0)/crop.width+.18)/1.36*100,4),'y':round((y0-crop.y0)/crop.height*100,4),'width':round((x1-x0)/crop.width/1.36*100,4),'text':label['text']})
 nums=sorted(set(int(n) for n in re.findall(r'\{\{(\d+)',str(captions))));g={'type':'diagram','sourcePages':[c['page']],'questions':[{'n':n,**({'slots':2} if job=='p1-the-olympic-torch-chua-rep' and n==13 else {})} for n in nums],'sourceInstructions':f'Questions {nums[0]} – {nums[-1]} Label the diagram below.','diagram':{'asset':name,'width':round(crop.width*1.36,3),'height':round(crop.height,3),'alt':'Original diagram for '+jobs[job]['title'],'captions':captions,'sourceLayoutChecked':True,'sourceId':c['source'],'sourceSHA256':hashlib.sha256(source.read_bytes()).hexdigest(),'sourcePage':c['page'],'sourceCrop':c['crop'],'minWidth':1000 if job in ['p1-the-olympic-torch-chua-rep','p3-movement-underwater'] else 900}}
 if c.get('title'):g['title']=c['title']
 if c.get('wordBank'):
  g.update(bank=bank(c['wordBank']),reuse=False);g['sourceInstructions']+=' Label the diagram with the list of words, A-G, below. Write the correct letter, A-G, in boxes 5-8 on your answer sheet.'
 else:g['wordLimit']=c['wordLimit'];g['sourceInstructions']+=' Choose '+g['wordLimit']+' from the passage for each answer. Write your answers on your answer sheet.'
 return g

def native(job,sid):
 j=jobs[job];src=next(s for s in j['sources'] if s['id']==sid);doc=fitz.open(a.cache/(sid+'.pdf'));title,ps,chunks,sub,foot=m.collect(doc,{**src,'title':j['title'].split('(CH')[0].strip()+'.pdf'});gs=[]
 for c in chunks:
  if c['start']==diagram(job)['questions'][0]['n']:g=diagram(job)
  elif job=='p1-tikopia' and c['start']==10:
   g={'type':'notes','task':'table','sourcePages':[4],'sourceInstructions':m.source_instructions(c['text'],10,13),'questions':[{'n':n} for n in range(10,14)],'wordLimit':'NO MORE THAN TWO WORDS','tableHeader':True,'table':[['Location of Tattoo','Design of Tattoo','Ages/Types of adults who wear it','Meaning of Tattoo'],['Men’s face','Fish on {{10}}','All ages','Shows their job'],['Women’s face','Line from chin to ear','Only {{11}}','Decoration'],['Men’s chest','{{12}} placed on grid','Older man','Celebrates most important organs'],['Men’s back','{{13}} running from shoulder blades to waist','Middle-aged and older','Represents long sticks used to get food']],'columnWidths':[22,30,24,24]}
  elif job=='p1-the-origins-of-cinema' and c['start']==5:
   g={'type':'notes','task':'table','sourcePages':[4],'sourceInstructions':m.source_instructions(c['text'],5,8),'questions':[{'n':n} for n in range(5,9)],'wordLimit':'ONE WORD ONLY','tableHeader':True,'table':[['Year','Invention','Features'],['1861','Kinematoscope','displayed 3D images on plates made of glass'],['1870','Phasmatrope','showed an audience images of {{5}} appearing to move'],['1877','Praxinoscope','an improved version of the Zoetrope that contained {{6}}'],['1879','Zoopraxiscope','projected pictures from a rotating {{7}} onto a {{8}}'],['1890','Kinetograph','a motion-picture camera with a unique mechanism for moving a film thorough it']],'columnWidths':[15,27,58]}
  elif job=='p1-the-olympic-torch-chua-rep' and c['start']==5:
   g=m.parse_group({**c,'text':c['text']+'\nG Athens Olympics (2004)'},ps,doc)
  else:g=m.parse_group(c,ps,doc)
  if g.get('noteLayout'):g['noteLayout']['sourceVerified']=True
  if job=='p3-movement-underwater' and g.get('table'):g['tableHeader']=True
  gs.append(g)
 if job=='p1-the-history-of-cakes-at-wedding':
  g=gs[1];g.pop('noteLayout');g.pop('content');g.update(task='table',tableHeader=True,columnWidths=[50,50],table=[['17th century – Britain','Now – United States'],['Bride Cake\n\n• expensive ingredients were a sign of wealth\n\n• less expensive round cakes were made of {{7}}\n\n• they were baked on a hearth stone because not all homes had {{8}}','Groom’s Cake\n\n• guest receive pieces of the groom’s cake\n\n• cakes may represent the {{9}}']],tableCellBoldText=[{'row':1,'col':0,'text':'Bride Cake'},{'row':1,'col':1,'text':'Groom’s Cake'}])
 if job=='p1-practical-action':
  text=ps[5]['text'];mark='Case Study: The Practical Action Bicycle Ambulance';before,after=text.split(mark);ps[5:6]=[{'text':before.strip()},{'text':mark,'heading':True},{'text':after.strip()}]
 if job=='p1-ancient-greek-coins':
  titles=['What is a coin?','How were coins manufactured in ancient Greece?','How did coinage spread throughout the ancient world?','Why do we study coins?'];new=[]
  for par in ps:
   t=next((t for t in titles if par['text'].startswith(t)),None)
   if t:new.append({'text':t,'heading':True});par={**par,'text':par['text'][len(t):].strip()}
   new.append(par)
  ps=new
 if job=='p2-roller-coaster-the-great-fairground-attraction':
  new=[]
  for par in ps:
   t=next((t for t in ['How they move','Coasting through history'] if par['text'].startswith(t)),None)
   if t:new.append({'text':t,'heading':True});par={**par,'text':par['text'][len(t):].strip()}
   new.append(par)
  ps=new
 raw={'sha256':hashlib.sha256((a.cache/(sid+'.pdf')).read_bytes()).hexdigest(),'pages':list(doc)}
 b.save(job,sid,title,j['part'],ps,gs,raw,['All diagram labels and original arrows checked; paper-only instructions adapted by shared CBT template','All reading/task pages checked; preserved source headings, tables and note indentation'],m.normalize_subtitle(' '.join(sub)) if sub else None,foot or None)

for job,sid in [('p1-practical-action','18DjcKb1FkgLp8iWbOA-LY0Z4e_b5nkHE'),('p1-tikopia','1g0X26MDPKdqrZQNGeACeocPLm_vIFLZA'),('p1-the-origins-of-cinema','1UtVQ-IBzhIYO2RZrly2pwvl6O1QW6mkZ'),('p1-the-olympic-torch-chua-rep','1iuotk1qL0EtHH8r8EvqWW8di3OIDQ-Dv'),('p1-the-history-of-cakes-at-wedding','1EE7CJfXm6bqGRkVQJHvSv9PptXNmfott'),('p1-ancient-greek-coins','1M5aU9jjdsFn-A19HsymivqlERG_jLtFk'),('p1-the-tyne-bridge','1vXRiyEMeTkQ0UKNcRWvwZPh_7Vj8EpkY'),('p2-roller-coaster-the-great-fairground-attraction','1kwNrfZWRZ6F2neOTTeU2QwwkL-LWRuc3'),('p3-patterns-of-nature','1yuO_2mvbvQoeOPM6J9MJdJzpd2TMb8fE'),('p3-movement-underwater','1G4leBrFHGqSLoiRyK3Dw5JEY9DBaTpJ6')]:native(job,sid)

# Scanned sources: explicit reading boundaries and checked OCR corrections.
sid='1T6fWm1s67Dwzr7edvonrVYiMQTzfM57Z';raw,pages=ocr(sid);text='\n'.join(pages[:2]);foot=['* Bronze Age: approximately 3000 BC–800 BC','** staves: lengths of wood'];text=text.replace('* Bronze Age: approximately 3000 BC-800 BC','').replace('** staves: lengths of wood','')
ps=paras(text,['The barrel is','Constructing a barrel','Acquiring barrel-making','It is thought','Through the centuries','At the time,','Unlike shipping'],[('Bronze Age’','Bronze Age*'),('staves”','staves**'),('modem-day','modern-day'),('fish sauce,','fish sauce.'),('that | knew. | was','that I knew. I was'),("‘\'head\'","‘head’")])
g=h.notes(1,3,'Barrels',[h.row('Probably first made during the {{1}}'),h.row('Clever engineering – no nails or glue needed'),h.row('Advantages:',bold=True,space=1),h.row('are watertight so can transport liquids',1.5,'–'),h.row('are very tough',1.5,'–'),h.row('can be rolled using only {{2}}',1.5,'–'),h.row('can alter the {{3}} of its contents',1.5,'–')],3);g['wordLimit']='NO MORE THAN TWO WORDS AND/OR A NUMBER';g['sourceInstructions']=g['sourceInstructions'].replace('ONE WORD ONLY',g['wordLimit'])
b.save('p1-barrels',sid,'Barrels',1,ps,[g,diagram('p1-barrels'),h.tf(7,['Coopers use specialised instruments for calculating thickness and length.','The design of barrels has changed considerably since the Celts produced them.','Evidence of barrels in Roman times can be found in images cut into stone.','In 18th-century London, there was a plentiful supply of wood for producing barrels.','Many children were working as coopers at the same time as William Hart.','London’s docks expanded rapidly at the beginning of the 19th century.','Coopers like Hart had to regularly check barrels that had been filled with liquid.'],4,1)],raw,['Seven reading paragraphs; footnotes separated; original diagram three controls; notes indentation source checked'],footnotes=foot)
sid='1RKRGE0k9mcfhxGbT2_Ol1Na6SM7RIuz7';raw,pages=ocr(sid);ps=paras('\n'.join(pages[:2]),['Until now,','Abdul Rahman,','A simple device','Basic treadle','Developed in','Abdul heard','Bangladesh is'],[('rice fields, In','rice fields. In'),('high-\nyield','high-yield')]);qs=['The building of dams and reservoirs takes more time in developing countries than elsewhere.','The Green Revolution has failed to increase global farm yields.','To improve local living standards, small-scale projects may be more successful than large-scale ones.','In 1981, levels of rice production in Bangladesh were falling.','Abdul Rahman knew what he required to increase his crop production.','The treadle pump was initially created for large-scale farming.'];gs=[h.tf(1,qs,3,1),diagram('p1-the-treadle-pump'),short(11,['Approximately what area of land can be watered daily using a treadle pump?','What material was Abdul’s new roof made of?','In the early 1980s, how much money did Bangladeshi farmers put into the treadle pump campaign?'],'NO MORE THAN THREE WORDS AND/OR A NUMBER',4)]
b.save('p1-the-treadle-pump',sid,'The treadle pump',1,ps,gs,raw,['Two-column reading and Abdul paragraph page continuation retained; all diagram labels restored'],'With the help of affordable irrigation and access to markets, farmers in the developing world can grow more food and climb out of poverty')
sid='1KSGRUlIvekRr07QfY9pMF8_btdkSLr1q';raw,pages=ocr(sid);text='\n'.join(pages[:2]).split('Turn over')[0];fix=[('C_ The','C The'),('\nbe\nbridges','\nbridges'),('H Acommercial','H A commercial'),('| Tim Darling','I Tim Darling'),('‘Ina decade','‘In a decade'),('does,”','does,’'),('frequencies,”','frequencies,’'),('energy.”','energy.’'),('solar-\npowered','solar-powered')];ps=paras(text,['A Most','B ‘The','C The','D After','E ‘We','F The','G ‘When','H A commercial','I Tim Darling'],fix,True)
g=mc(1,['Currently the majority of bridges','The device developed by research scientists at Los Alamos','What happened to the Interstate 40 bridge?','A basic analysis of the Interstate 40 bridge’s behaviour only detected the damage done to'],[['show clear signs of damage on inspection.','are not inspected for signs of damage.','are regularly monitored by microwave sensors.','are regularly checked for early signs of damage.'],['helps to induce displacement in bridges.','measures the distance between two points.','uses microwaves to estimate a load.','monitors the movement of traffic.'],['It collapsed because of a design fault.','It was deliberately damaged by researchers.','It had several faulty girders.','It was demolished by researchers.'],['the mid-point of the girder.','the bottom half of the girder.','the flange.','the road surface.']],3)
b.save('p1-a-watchful-eye-on-bridges',sid,'A watchful eye on bridges',1,ps,[g,diagram('p1-a-watchful-eye-on-bridges'),info(9,['how pressure was applied','how the damage was created','reference to a wonderful chance for research','the situation ten years on','how the microwave sensor works'],'ABCDEFGHI',1,4)],raw,['Nine lettered paragraphs retained across two columns/pages; original seven-item diagram bank, four drag targets, no visible answer letters'])
sid='1qsScgycPZfu84W66MXihya2TUs52y4SP';raw,pages=ocr(sid);text='\n'.join(pages[:2]).split('Turn over')[0];ps=paras(text,['A new project,','Equally important','Before the researchers','In mid-January,','Team members','Lake Bosumtwi,','Much of the data','Preliminary analysis'])
g=inp(22,26,['The name of the technique used to gather information about the lake subsurface is {{22}}.','The boat moves across the lake in a {{23}}.','The researchers had to avoid the {{24}} on top of the lake.','Computers record signals which are sent to the {{25}} for analysis.','The information is being used to create a {{26}} image of the bottom of the lake.'],'NO MORE THAN THREE WORDS','sentences')
b.save('p2-lake-bosumtwi-the-secrets-of-a-crater-lake',sid,'Lake Bosumtwi – the secrets of a crater lake',2,ps,[h.tf(14,['The only causes of variation in water level in Lake Bosumtwi are precipitation and evaporation.','Historical climate changes can be detected in the sediment of the lake.','Scientists can predict how the climate will change by studying sediment.','Travel on Lake Bosumtwi is influenced by local religious beliefs.','The size of the meteor affected the structure of the crater at Lake Bosumtwi.'],3,2),diagram('p2-lake-bosumtwi-the-secrets-of-a-crater-lake'),g],raw,['All eight source reading paragraphs; three boat diagram arrows preserved; task-specific TWO vs THREE word limits'],'A university project is helping to unlock the mysteries hidden below the lake bottom')
sid='1ZW2AOGCoOV9BP9HOUZ5jL_ZfFII0-if-';raw,pages=ocr(sid);text='\n'.join(pages[:2]);text=re.sub(r'\n11\n','\n',text);fix=[('sucha rare —\nevent','such a rare\nevent'),('by-\nproducts','by-products'),('O’Connell-\nRodwell','O’Connell-Rodwell')];ps=paras(text,['A Ecologist','B African','C In 2003','D Scientists','Breeding herds','Reacting to a signal','An experiment in 2004','Although still'],fix,True)
gs=[diagram('p3-the-secret-sounds-of-elephants'),inp(31,35,['In 2003, Caitlin O’Connell-Rodwell was working in Namibia’s Etosha National Park on an elephant research project to help local {{31}}. She observed that groups of elephants would often suddenly stand motionless, and that some would lay their {{32}} down, as if they were listening for vibrations coming from the {{33}}. She was struck by the similarity between this behaviour and that of planthoppers, the species of {{34}} she had been studying at the University of Hawaii. This led O’Connell-Rodwell to wonder whether the elephants were perhaps receiving some form of {{35}} communication.']),info(36,['how human awareness of seismic transmissions might benefit elephants','an example of how some elephants attract other elephants through infrasonic signals','evidence that elephants can distinguish between different patterns of seismic vibrations'],'ABCDEFGH',3,4),mc(39,['O’Connell-Rodwell could not tell from the results of the 2002 study whether the elephants were','What was O’Connell-Rodwell’s reaction to the results of the 2004 study?'],[['hearing the signal in the air.','interpreting the transmission accurately.','responding to messages from each other.','being distracted by stimuli such as passing vehicles.'],['She was pleased that the elephants’ responses to various signals seemed so distinct.','She was disappointed by the differences between the elephants’ responses.','She was frustrated by the inconclusive nature of the elephants’ responses.','She was surprised at the quick departure of the elephants.']],5)]
b.save('p3-the-secret-sounds-of-elephants',sid,'The secret sounds of elephants',3,ps,gs,raw,['Restored E-H source paragraph labels missed by OCR; D crosses page break; diagram four captions and all MCQ options visually checked'])
# Termite reading: corrected against original PAPER rather than accepting retype omissions.
sid='1j7RzKzBoMDj0zOCABsGQTMhGKMfJ8vyU';job='p3-termite-mounds';src=jobs[job]['sources'][0];doc=fitz.open(a.cache/(sid+'.pdf'));title,ps,chunks,sub,foot=m.collect(doc,{**src,'title':'Termite Mounds.pdf'});corr=json.load(open(h.ROOT/'import/termite-reading-corrections.json'))
for old,new in corr['correctionsNativeRetype']:
 for par in ps:
  if old in par['text']:par['text']=par['text'].replace(old,new);break
 else:raise AssertionError(old)
for par in ps:
 if par['label'] in corr['replaceParagraphs']:par['text']=corr['replaceParagraphs'][par['label']]
gs=[diagram(job) if c['start']==34 else m.parse_group(c,ps,doc) for c in chunks];raw={'sha256':hashlib.sha256((a.cache/(sid+'.pdf')).read_bytes()).hexdigest(),'pages':list(doc)}
b.save(job,sid,title,3,ps,gs,raw,['Original PAPER source repairs substantive retype omissions in E-G; original diagram retained; duplicate source coalesced'],corr['subtitle'])
aux={'p1-the-olympic-torch-chua-rep':'1EknzSuQY-9hRWpSwwj9m4Zi-Da_aEeqq','p1-tikopia':'1H6X8dK4bh-5cwRJTJ4qgN7p5E7Z7NHSv','p3-termite-mounds':'1-iQAexQHXof0A1JHHRBdPaAalewuRRUj'}
for result in b.results:
 path=a.output/result['draft'];data=json.load(open(path));sid=aux.get(result['job'])
 if sid:data['sources'].append({'id':sid,'role':'original-paper-cross-check','sha256':hashlib.sha256((a.cache/(sid+'.pdf')).read_bytes()).hexdigest()})
 path.write_text(json.dumps(data,ensure_ascii=False,indent=2))
b.finish()

# A checked diagram must also pass final image refinement and measured layout.
import subprocess,sys
subprocess.run([sys.executable,str(h.ROOT/'scripts/refine-diagram-assets.py'),'--cache',str(a.cache)],check=True)
subprocess.run([sys.executable,str(h.ROOT/'scripts/layout-reviewed-diagrams.py'),'--lessons',str(a.output/'drafts')],check=True)
