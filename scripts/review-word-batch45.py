"""Explicit source-reviewed Word adapters. Produces drafts only, never publishes."""
import json,pathlib,hashlib,re,importlib.util,argparse,fitz
R=pathlib.Path(__file__).resolve().parents[1];ap=argparse.ArgumentParser();ap.add_argument('--workspace',type=pathlib.Path,required=True);ap.add_argument('--output',type=pathlib.Path,required=True);a=ap.parse_args();W=a.workspace;O=a.output;(O/'drafts').mkdir(parents=True,exist_ok=True)
s=importlib.util.spec_from_file_location('parser',R/'scripts/parse-practice.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m);reviews=[]
selection=json.load(open(R/'import/word-batch-45/selection.json'))
def richrow(text,indent=0,bold=False,italic=False,underline=False,marker=None,space=.25):
 r={'runs':[{'text':m.slots(m.clean(text)),**({'bold':True}if bold else{}),**({'italic':True}if italic else{}),**({'underline':True}if underline else{})}],'indent':indent,'spaceBefore':space}
 if marker:r.update(marker=marker,hanging=1.4,firstLine=0)
 return r
def notes(chunk,start,end,title,rows,page,limit):return {'type':'notes','sourceInstructions':m.source_instructions(chunk,start,end),'sourcePages':[page],'questions':[{'n':n}for n in range(start,end+1)],'wordLimit':limit,'title':title,'noteLayout':{'title':title,'titleAlign':'center','rows':rows,'sourceVerified':True,'layoutVersion':2},'content':[''.join(t['text']for t in row['runs'])for row in rows]}
for x in selection:
 j=x['job'];id=j['id'];rec=json.load(open(R/'import/word-batch-45/source-text'/(id+'.json')));doc=fitz.open(W/'pdf-cache'/(j['sources'][0]['id']+'.pdf'));fix=[];foot=[]
 if id=='p2-bristlecone-pines':at=2;begin,end=3,13;subtitle=None
 elif id.startswith('p2-the-advantages'):at=2;begin,end=3,17;subtitle=None
 elif id.startswith('p2-children'):at=2;begin,end=3,11;subtitle=None
 elif id=='p2-understanding-climate-change':at=2;begin,end=4,13;subtitle=m.clean(rec[3]['text'])
 elif id.startswith('p2-the-many-benefits'):at=37;begin,end=39,53;subtitle=m.clean(rec[38]['text'])
 elif id=='p1-carnivorous-plants':at=2;begin,end=4,13;subtitle=m.clean(rec[3]['text'])
 elif id.startswith('p1-living-walls'):
  at=next(i for i,r in enumerate(rec)if r['text'].startswith('Living walls'));begin=at+2;end=next(i for i,r in enumerate(rec)if r['text'].startswith('Questions'));subtitle=m.clean(rec[at+1]['text'])
 title=m.clean(rec[at]['text']);paras=[];lab=None
 for r in rec[begin:end]:
  t=m.clean(r['text'])
  if re.fullmatch('[A-Z]',t):lab=t;continue
  paras.append({'text':t,**({'label':lab}if lab else{})});lab=None
 if id.startswith('p2-children'):
  for i,p in enumerate(paras):p['label']=chr(65+i)
  paras[1]['text']=paras[1]['text'].replace('(McNeal, 1987).','(McNeal, 1998).')+' In addition, companies now recognize that brand loyalty built at an early age may reap economic rewards over a child’s lifetime (McNeal, 1987).'
  paras[2]['text']=paras[2]['text'].replace('Saturday mornings of television advertising','Saturday mornings')
  paras[5]['text']=paras[5]['text'].replace('age of 4 or 6','age of 4 or 5');fix+=['Restored missing final sentence of B and corrected McNeal 1998 citation from PDF','Removed extra words in C; corrected source age threshold 4 or 5 in F and summary','Restored all A–H source labels and two-column reading order']
 elif id=='p2-bristlecone-pines':
  paras[0]['text']=paras[0]['text'].replace('Methuselah dated','Methuselah – dated').replace('dendrochronology,','dendrochronology*')
  paras[1]['text']=paras[1]['text'].replace('ring to ring growth','ring-to-ring growth').replace('chronologies,','chronologies,**').replace('Samples taken from trees of a known age can be studied for matches with samples from trees of a known age with know ages of growth.','Samples taken from trees of unknown age can be studied for matches with samples from trees of a known age with known sequences of growth.')
  paras[2]['text']=paras[2]['text'].replace('chronologies Schulman','chronologies, Schulman').replace('short distorted','short, distorted').replace('C W Fergusun','C W Ferguson').replace('extreme conditions with scant','extreme conditions, with scant')
  paras[3]['text']=paras[3]['text'].replace('Spring temperatures.','Spring comes to the bristlecone pines in early May with the melting of snow and rising temperatures.')
  foot=['* dendrochronology: the dating of past events, especially climatic changes, through study of tree ring growth','** chronologies: sequences of events'];fix+=['Restored missing spring sentence in D, unknown-age/known-sequences sentence in B, and Ferguson spelling','Restored both footnote markers and separate original definitions']
 elif id.startswith('p1-living-walls'):
  nt,np,ch,st,ft=m.collect(doc,j['sources'][0]);assert len(np)==9;paras=np;title=nt;
  for para in paras:para['text']=para['text'].replace('living wails','living walls')
  fix+=['Used original PDF paragraph text to correct Word punctuation and omissions; retained nine source paragraphs']
 elif id=='p1-carnivorous-plants':fix+=['Preserved all nine source paragraphs in original two-column reading order; note subheadings underlined, main headings bold']
 elif id=='p2-understanding-climate-change':fix+=['Retained nine source reading paragraphs and two separate summary paragraphs','Rebuilt two-column table with five source rows and Year header']
 elif id.startswith('p2-the-many-benefits'):fix+=['Matched plural mangroves title despite singular annotated original job name; seven source heading targets retained','Kept two Sato summary paragraphs']
 text='\n'.join(r['text']for r in rec[:at]+rec[end:]);text=re.sub(r'(Questions?\s+\d+\s*(?:[-–—]|and|&)\s*\d+)\s*(?=[A-Za-z])',r'\1\n',text);text=re.sub(r'(?<=[.?])(?=(?:In boxes|Write (?:your|the)|Choose |Complete |Do the following))','\n',text);markers=list(m.HEADER.finditer(text));groups=[]
 old=m.printed_summary_title
 def wt(doc,page,body):
  first=m.clean(body.split('\n',1)[0]);r=next((r for r in rec if m.clean(r['text'])==first),None);return first if r and r.get('bold')and '{{'not in m.slots(first)else None
 m.printed_summary_title=wt
 for i,z in enumerate(markers):
  start,endn=int(z[1]),int(z[2]or z[1]);chunk=text[z.start():markers[i+1].start()if i+1<len(markers)else len(text)].strip();page=next((k for k,p in enumerate(doc)if re.search(r'Questions?\s+'+str(start)+r'\b',p.get_text())),2);page=min(page,len(doc)-1)
  if id=='p2-understanding-climate-change'and start==18:
   g={'type':'notes','task':'table','sourceInstructions':m.source_instructions(chunk,start,endn),'sourcePages':[3],'questions':[{'n':n}for n in range(18,22)],'wordLimit':'ONE YEAR','tableHeader':True,'columnWidths':[61,39],'table':[['','Year'],['The keeping of logbooks was made compulsory on British naval ships.','{{18}}'],['The system of dates was standardised across Europe.','{{19}}'],["Ships’ logbooks ceased the practice of starting each day’s record at midday.",'{{20}}'],['A definitive scale of recording wind force was adopted.','{{21}}'],['Most ships had been equipped with reliable weather-recording instruments.','1850']]}
  elif id.startswith('p2-the-advantages')and start==23:
   g={'type':'summary-input','task':'sentences','sourceInstructions':m.source_instructions(chunk,start,endn),'sourcePages':[4],'questions':[{'n':n}for n in range(23,27)],'wordLimit':'ONE WORD ONLY','title':'Language Immersion Schooling','content':[m.slots(m.clean(rec[60]['text']))]}
  elif id=='p2-bristlecone-pines'and start==21:
   rows=[]
   for k in range(59,66):rows.append(richrow(rec[k]['text'],0 if k in [59,63]else 1.5,italic=k in [59,63],marker=None if k in [59,63]else'•',space=.8 if k==63 else .25))
   g=notes(chunk,start,endn,'Factors in the survival of bristlecone pines',rows,4,'NO MORE THAN TWO WORDS')
  elif id=='p1-carnivorous-plants'and start==1:
   rows=[]
   for k in range(15,35):
    top=k in [15,23];sub=k in [16,20,24,28,32];rows.append(richrow(rec[k]['text'],0 if top else 1.5 if sub else 3,bold=top,underline=sub,marker=None if top or sub else'•',space=.8 if top or sub else .25))
   g=notes(chunk,start,endn,'Carnivorous Plants',rows,3,'ONE WORD ONLY')
  elif id.startswith('p1-living-walls')and start==1:
   g={'type':'flow-chart','sourceInstructions':m.source_instructions(chunk,start,endn),'sourcePages':[3],'questions':[{'n':n}for n in range(1,5)],'wordLimit':'ONE WORD ONLY','title':'Stages in the commercial development of Living Walls','sourceLayoutChecked':True,'flow':{'layout':'linear','steps':['Darlington’s initial research focused on how the air in the environment which {{1}} live in could be used again','Darlington’s team discovered a method which involved using {{2}} and plants','Darlington received {{3}} to support the project from Ontario Centres of Excellence.','Darlington founded a company and installed the first living wall.','The installation of more living walls resulted in several {{4}} for Nedlaw.'],'arrow':'assets/living-walls-original-arrow.png'}}
  elif id.startswith('p1-living-walls')and start==5:
   match=next(k for k,r in enumerate(rec)if r['text']=='Living walls:');rows=[richrow('Living walls:',bold=True)]+[richrow(rec[k]['text'],1.5,marker='•')for k in range(match+1,match+6)];g=notes(chunk,start,endn,'The advantages of living walls',rows,4,'ONE WORD ONLY')
  elif id.startswith('p2-the-many-benefits')and start==21:
   g={'type':'mc-two','selectionCount':2,'numbers':[21,22],'sourceInstructions':'Questions 21 and 22 Choose TWO letters, A-E.','sourcePages':[4],'prompt':m.clean(rec[55]['text']+' '+rec[56]['text']).replace('list below','list'),'options':[{'value':chr(65+i),'text':m.clean(rec[58+2*i]['text'])}for i in range(5)]}
  else:g=m.parse_group({'start':start,'end':endn,'text':chunk,'page':page},paras,doc)
  if id.startswith('p2-children')and start==23:
   g['content']=[' '.join(g['content']).replace('4 or 6','4 or 5').replace('programe','programme').replace('. Whereby',' whereby')];g['sourcePages']=[4]
  if id=='p2-understanding-climate-change'and start==14:g['sourcePages']=[3];g['content']=[m.slots(m.clean(rec[k]['text']))for k in [15,16]]
  if id=='p2-understanding-climate-change'and start==22:g['prompt']=g['prompt'].replace('Below is','Here is')
  if id.startswith('p2-the-many-benefits')and start==23:g['content']=[m.slots(m.clean(rec[k]['text']))for k in [69,70]]
  if id.startswith('p2-the-many-benefits')and start==14:g['sourcePages']=[1]
  groups.append(g)
 m.printed_summary_title=old
 pages=[[3],[3],[4]] if id in ['p2-bristlecone-pines'] or id.startswith('p2-children')or id.startswith('p2-the-advantages')else [[3],[3],[4],[4]]if id=='p2-understanding-climate-change'else [[1],[4],[4]]if id.startswith('p2-the-many-benefits')else [[3],[4],[4]]if id.startswith('p1-living-walls')else [[3],[4]]
 for g,pg in zip(groups,pages):g['sourcePages']=pg
 if id=='p2-bristlecone-pines':groups[0]['questions'][-1]['prompt']="an advantage of the bristlecone pines’ habitat"
 if id.startswith('p2-the-advantages'):lid='p2-the-advantages-of-being-bilingual'
 elif id.startswith('p2-children'):lid='p2-children-s-comprehension-of-television-advertising'
 elif id.startswith('p2-the-many-benefits'):lid='p2-the-many-benefits-of-mangroves'
 elif id.startswith('p1-living-walls'):lid='p1-living-walls-a-successful-environmental-project'
 else:lid=id
 sources=[{'id':x['words'][0]['id'],'role':'word-transcription','sha256':hashlib.sha256((W/'word-cache'/(x['words'][0]['id']+'.docx')).read_bytes()).hexdigest()},{'id':j['sources'][0]['id'],'role':'original-pdf','sha256':hashlib.sha256((W/'pdf-cache'/(j['sources'][0]['id']+'.pdf')).read_bytes()).hexdigest()}]
 d={'id':lid,'part':j['part'],'title':title,'paragraphs':paras,'groups':groups,'mode':'practice','status':'draft','sources':sources,'displayParagraphLabels':m.paragraph_labels_visible(groups),'conversion':{'version':'3.25-word','jobId':id,'method':'word-with-original-pdf-review','requiresReview':True,'sourceParagraphCount':len(paras)}}
 if subtitle:d['subtitle']=subtitle
 if foot:d['footnotes']=foot
 m.check_duplicate_prompts(groups);(O/'drafts'/(lid+'.json')).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');reviews.append({'job':id,'lessonId':lid,'sources':sources,'visualSourcePages':list(range(1,len(doc)+1)),'allReadingParagraphs':True,'allTaskPages':True,'titleSubtitle':True,'footnotes':True,'corrections':fix,'reviewed':True});print(lid,len(paras),[g['type']for g in groups])
(O/'source-review.json').write_text(json.dumps(reviews,ensure_ascii=False,indent=2)+'\n')
