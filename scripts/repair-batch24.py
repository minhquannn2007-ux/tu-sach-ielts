"""Reviewed OCR adapters. Explicit source corrections; no inferred answers.

Original scans and unmodified OCR are retained separately. Every selected page
must be visually reviewed before this output is eligible for publication.
"""
import argparse,json,re,hashlib,importlib.util
from pathlib import Path
import fitz
p=argparse.ArgumentParser();p.add_argument('--ocr',type=Path,required=True);p.add_argument('--cache',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();a.output.mkdir(parents=True,exist_ok=True);(a.output/'drafts').mkdir(exist_ok=True);(a.output/'ocr').mkdir(exist_ok=True)
root=Path(__file__).resolve().parents[1];sp=importlib.util.spec_from_file_location('parser',root/'scripts/parse-practice.py');m=importlib.util.module_from_spec(sp);sp.loader.exec_module(m)
results=[];audits=[]
def split_at(text,starts):
 positions=[text.index(s) for s in starts];assert positions==sorted(positions) and len(set(positions))==len(positions)
 return [m.clean(text[x:positions[i+1] if i+1<len(positions) else len(text)]) for i,x in enumerate(positions)]
def group(text,start,end,page,paras,doc):
 text=text[text.index('Questions'):]
 return m.parse_group({'text':text,'start':start,'end':end,'page':page},paras,doc)
def source(sid):
 d=json.load(open(a.ocr/(sid+'.json')));assert d['sha256']==hashlib.sha256((a.cache/(sid+'.pdf')).read_bytes()).hexdigest();(a.output/'ocr'/(sid+'.json')).write_text(json.dumps(d,ensure_ascii=False));return d,[p['text'] for p in d['pages']]
def save(job,sid,title,part,paras,groups,raw,corrections,subtitle=None):
 d={'id':f'p{part}-{m.slug(title)}','part':part,'title':title,'status':'draft','mode':'practice','paragraphs':[p if isinstance(p,dict) else {'text':p} for p in paras],'groups':groups,'displayParagraphLabels':m.paragraph_labels_visible(groups),'sources':[{'id':sid,'role':'passage-and-questions','sha256':raw['sha256']}],'conversion':{'version':m.VERSION,'jobId':job,'method':'ocr-with-explicit-source-reviewed-adapter','requiresReview':True,'sourceParagraphCount':len(paras)}}
 if subtitle:d['subtitle']=subtitle
 m.check_duplicate_prompts(groups);draft='drafts/'+job+'.json';(a.output/draft).write_text(json.dumps(d,ensure_ascii=False,indent=2));results.append({'job':job,'status':'ready-for-review','sourceId':sid,'draft':draft,'lessonId':d['id']})
 audits.append({'job':job,'sourceId':sid,'sourceHash':raw['sha256'],'visualSourcePages':list(range(1,len(raw['pages'])+1)),'titleSubtitle':True,'allReadingParagraphs':True,'allTaskPages':True,'corrections':corrections,'paragraphs':len(paras),'questionCount':sum(len(g.get('questions',g.get('numbers',[]))) for g in groups),'reviewed':True})

# Two-column passage, eight original paragraphs. OCR's tiny QR-code fragments
# are removed explicitly, never by deleting arbitrary short reading words.
sid='1E92trwsR_PWWaIcJGkR9D_9nVcMTeGZY';raw,pages=source(sid);doc=fitz.open(a.cache/(sid+'.pdf'))
text='\n'.join(pages[:2]);text=text[text.index('Jane Raymond,'):];text=text.replace('\not\nexecutives.','\nexecutives.').replace('\neA\nthey think','\nthey think');text=text.split('Turn over')[0]
starts=['Jane Raymond,','In today’s fast-paced','Nine out of 10','Raymond thinks','So what does this mean','Raymond says advertisers','After her research','This contradicts the'];paras=split_at(text,starts)
qt=pages[2].replace('\nz Jane Raymond','\n7 Jane Raymond');pos=qt.index('Questions 8');groups=[group(qt[:pos],1,7,2,paras,doc),group(qt[pos:],8,13,2,paras,doc)]
save('p1-advertising-needs-attention',sid,'Advertising needs attention',1,paras,groups,raw,['Removed OCR-only QR fragments ot/eA','Recovered printed question number 7 from OCR z','Retained eight paragraph boundaries and both column continuations'],'The harder advertisers try to get your attention, the more your brain ignores them')

# Bondi: recover question numbers omitted by OCR from their printed rows.
sid='19eaUkXDsWJFBMobFyEiz6scwt3ymSl5q';raw,pages=source(sid);text='\n'.join(pages[:2]);text=text[text.index('Australians have'):].split('Turn over')[0]
fixes={'colonia]':'colonial','Cattle vast':'cattle vast','wasa cultural':'was a cultural','in tur,':'in turn,','fammly':'family','rent-\nPaying':'rent-\npaying','surf\ncamival':'surf\ncarnival','Bondi asa':'Bondi as a','preparations fOr':'preparations for','weregood':'were good'}
for before,after in fixes.items():assert before in text,before;text=text.replace(before,after)
paras=split_at(text,['Australians have','Before the British','At the end of the 19th century, the','In Britain,','By the end of the 19th century,','The suburb of Bondi','With tram access','Bondi\'s identity','In the preparations'])
questions=["Bondi beach has been popular since the arrival of the first British settlers in Australia.","Aborigines in the centre of Australia had a different culture from those on the coast.","Contemporary Australian beach culture reflects Aboriginal traditions.","At the end of the 19th century, some parts of Australia were associated with a difficult life.","Sydney's beach suburbs were influenced by a seaside town in England.","At the end of the 19th century, Sydney's beaches were regarded as unhealthy places to be."]
short=["What form of public transport could people use to get to the beach at the end of the 19th century?","Which beachside suburb was popular with people from rural areas?","Which suburb helped to meet the needs of Sydney's accommodation shortage?","When did British royalty visit Bondi?","Which industry is Bondi now associated with?","What sporting event at the 2000 Olympic Games was held at Bondi?","What did people think could be damaged by building a stadium on Bondi Beach?"]
inst=m.clean(pages[2].split('Bondi beach has been')[0]).replace('wnte','write');inst2='Questions 7 – 13 Answer the questions below. Choose NO MORE THAN THREE WORDS AND/OR A NUMBER from the passage for each answer. Write your answers in boxes 7-13 on your answer sheet.'
groups=[{'type':'tfng','sourceInstructions':inst,'sourcePages':[3],'questions':[{'n':i+1,'prompt':t} for i,t in enumerate(questions)]},{'type':'short-answer','wordLimit':'NO MORE THAN THREE WORDS AND/OR A NUMBER','sourceInstructions':inst2,'sourcePages':[3],'questions':[{'n':i+7,'prompt':t} for i,t in enumerate(short)]}]
save('p1-bondi-chua-go',sid,'Bondi',1,paras,groups,raw,[*list(fixes),'Printed question numbers 1–13 recovered by visual row review','Nine original paragraph boundaries; both columns retained'],'Bondi is Australia’s most famous beach, but how did this come about?')

# Video diary note hierarchy is transcribed from the scan, including its bold
# section headings, title and bullet indents. No plain OCR flattening of notes.
sid='1A-fkPy8Qx5fzKug0OkSSgXMmPNsjnAD2';raw,pages=source(sid);doc=fitz.open(a.cache/(sid+'.pdf'));text='\n'.join(pages[:2]);text=text[text.index('Gaining knowledge'):].replace('because | have','because I have').replace('Ifa child','If a child').replace('In addition.\nbecause','In addition,\nbecause')
paras=split_at(text,['Gaining knowledge','We feel that','Compared with','In our project,','However, the use','To address this problem'])
rows=[]
def heading(t):rows.append({'runs':[{'text':t,'bold':True}],'indent':0,'spaceBefore':1.8 if rows else 0})
def bullet(t):rows.append({'runs':[{'text':t}],'indent':1.5,'marker':'•','hanging':1.5,'firstLine':0,'spaceBefore':0.3})
heading('Problems with traditional research methods');bullet('the adult interviewer has more {{1}} than the child');bullet('the child may lack language skills and sometimes find concentration difficult')
heading('Advantages of video diaries');bullet('video diaries provide research data for a project over an extended {{2}}');bullet('children are {{3}} with this medium and good at using it');bullet('children may start to regard the camera as a {{4}}');bullet('researchers can study {{5}} communication');bullet('the replaying of parts of the video diary is possible')
heading('Limitations of video diaries');bullet('children may not make regular recordings');bullet('researchers are unable to further {{6}} what the children say at the time of the recording')
title='Using video diaries for research with children';inst=m.clean(pages[2].split(title)[0]);notes={'type':'notes','sourceInstructions':inst,'sourcePages':[3],'wordLimit':'ONE WORD ONLY','questions':[{'n':n} for n in range(1,7)],'title':title,'noteLayout':{'title':title,'titleAlign':'center','rows':rows,'sourceVerified':True,'layoutVersion':2},'content':[''.join(r['text'] for r in row['runs']) for row in rows]}
qt=pages[3].replace('Questions 7 -— 13','Questions 7 – 13');groups=[notes,group(qt,7,13,3,paras,doc)]
save('p1-using-video-diaries-to-collect-data-from-children',sid,'Using video diaries to collect research data from children',1,paras,groups,raw,['OCR |→I, Ifa→If a; comma in In addition','Restored note gaps 3, 4, 5 and bullet markers from scan','Six reading paragraphs; continuation across pages preserved','Bold note headings, centered title and indented bullets checked'])

# Child’s Play: OCR damage near skewed page edges is replaced only from the
# visible source text. All eight paragraph labels and ten events are checked.
sid='1vzQ8wwwt0ffQ8mtUE86fiegO44eA2xM5';raw,pages=source(sid);doc=fitz.open(a.cache/(sid+'.pdf'));text='\n'.join(pages[:2]);text=text[text.index('‘Play up!'):];text=re.sub(r'(?m)^11\s*$','',text)
parts=split_at(text,['‘Play up!','Forty years ago,','In this debate','We know, for example,','Active games were','However, by no means','This willingness','It is clear from'])
parts[0]='‘Play up! Play up! And play the game!’ The ringing chorus of Sir Henry Newbolt’s celebrated cricket poem ‘Vitai Lampada’ (1908) sums up views about play in 19th- and early 20th-century Britain. Children’s play was important, and adults should regulate and direct it. Games promoted endurance, self-discipline and team spirit — qualities needed for the health of society and government. Newbolt was one in a long line of people who thought in this way. The notion that children’s play should be used for educational and social purposes goes back at least to the ancient Greeks and the toys and games of medieval England tell us much about how adults then saw childhood. But they also reveal a good deal about children themselves, and cast light on what has recently become a controversial issue.'
parts[3]='We know, for example, that adults gave children toys from infancy onwards. In 1398 the writer John Trevisa describes babies playing with ‘a child’s brooch’, an object similar in function to the bright plastic toys given to babies today to bite and handle. William Horman, 16th-century author of a Latin textbook, talks of buying a rattle to stop a baby crying. Indeed, by 1300 it appears there was a toy industry in England. Boys’ toys often took military forms, such as the two metal soldiers of that date found in London, and made from a mould. Girls had dolls, known before the 17th century as ‘poppets’ or ‘puppets’, commercially manufactured, imported and, in 1582, taxed at a halfpenny each. Not that children were by any means dependent on things that were bought for them. Gerald of Wales recalls how he and his brothers built towns, palaces, churches, and monasteries from sand at Manorbier Castle in about 1150 (perhaps on the nearby beach).'
parts[2]=parts[2].replace('cven','even');start=parts[2].index('We know not only');parts[2]=parts[2][:start]+'We know not only how medieval English children played but what their elders thought on the subject.'
paras=[]
for i,t in enumerate(parts):
 t=re.sub(r'\s+[A-Hc]\s*$','',t).replace('Philippe Anés','Philippe Ariès').replace('a modem one','a modern one').replace('Ariés’s thesis','Ariès’s thesis').replace('died’. ‘The new king','died’. The new king')
 paras.append({'label':chr(65+i),'text':m.clean(t)})
qt=pages[2].replace('Ki) the origin','31 the origin');pos=qt.index('Questions 32');info=group(qt[:pos],27,31,2,paras,doc)
events=['invention of cricket','children picking grapes','poem about value of games','early toy manufacturing in England','puppets first imported into England','dolls taxed in England','death of Adam of Usk','children playing tennis',"children’s gang warfare",'a description of seasonal activities']
inst=m.clean(qt[pos:qt.index('32 1400')]);features={'type':'matching-features','sourceInstructions':inst,'sourcePages':[3],'questions':[{'n':n,'prompt':t} for n,t in zip(range(32,36),['1400','1518','1582','1908'])],'bank':[{'value':chr(65+i),'text':t} for i,t in enumerate(events)],'targetName':'event','listTitle':'List of Events','reuse':False}
groups=[info,features,group(pages[3],36,40,3,paras,doc)]
save('p3-child-s-play-in-medieval-england',sid,'Child’s Play in Medieval England',3,paras,groups,raw,['Paragraph A and D damaged OCR replaced from visible scan','Paragraph C final sentence restored from scan','Recovered printed paragraph E and question 31; Ariès/modern OCR corrected','Ten event options mapped to printed A–J rows; no extra reuse instruction'],'Professor Nicholas Orme investigates childhood in the Middle Ages')

(a.output/'batch-report.json').write_text(json.dumps({'results':results,'counts':{'ready-for-review':len(results)}},ensure_ascii=False,indent=2));(a.output/'source-review.json').write_text(json.dumps(audits,ensure_ascii=False,indent=2));print('Drafts',len(results))
