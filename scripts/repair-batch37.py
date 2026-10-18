"""Source-specific corrections for six visually reviewed Passage 3 scans.
Never approves or publishes drafts; all corrections are tied to source hashes.
"""
import json,pathlib,re,importlib.util,fitz,argparse
ROOT=pathlib.Path(__file__).resolve().parents[1];OUT=ROOT/'import/mass-batch-37'
spec=importlib.util.spec_from_file_location('parser',ROOT/'scripts/parse-practice.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
SELECTED=['p3-the-tuatara-past-and-future','p3-managing-the-language-barrier-in-international-business','p3-what-makes-organisations-successful','p3-risk-taking','p3-the-peopling-of-patagonia','p3-the-fluoridation-controversy']
ap=argparse.ArgumentParser();ap.add_argument('--cache',type=pathlib.Path,required=True);args=ap.parse_args()
reports=json.load(open(OUT/'build-report.json'));fixes={}
def apply(text,pairs):
 for before,after in pairs:
  if before not in text:continue
  text=text.replace(before,after)
 return text
for lessonid in SELECTED:
 p=OUT/'drafts'/(lessonid+'.json');d=json.load(open(OUT/'raw-drafts'/p.name));sid=d['sources'][0]['id'];raw=json.load(open(OUT/'fresh-ocr'/(sid+'.json')));body=d['paragraphs'];corrections=[]
 if 'tuatara' in lessonid:
  pairs=[('Giinther','Günther'),('Glinther','Günther'),('Gunther','Günther'),('non-mammailian','non-mammalian')]
  body=[{**p,'text':apply(p['text'],pairs)}for p in body];corrections+=pairs
 elif 'language-barrier' in lessonid:
  pairs=[('Ina social context','In a social context'),('lingua franca”','lingua franca*'),('* lingua franca: a language that is adopted as a common language between speakers whose native languages are different. ','')]
  body=[{**p,'text':apply(p['text'],pairs)}for p in body];d['footnotes']=['* lingua franca: a language that is adopted as a common language between speakers whose native languages are different.'];corrections+=pairs
 elif 'organisations' in lessonid:
  pairs=[('what makes Bai organisations','what makes organisations'),('7rue Blue','True Blue')];body=[{**p,'text':apply(p['text'],pairs)}for p in body];corrections+=pairs
 elif lessonid=='p3-risk-taking':
  text='\n\n'.join(x['text']for x in raw['pages'][:2]);text=text[text.index('A We run risks.'):];text=re.sub(r'(?m)^10\s*$','',text);text=text.replace('\nc Perhaps','\nC Perhaps').replace(' | understand',' I understand').replace(' | confess',' I confess')
  starts=['A We run risks.','B When society','C Perhaps more important','D In her book','Organizations face','Likewise, at the national','More complicated are decisions','Nevertheless, I confess'];pos=[text.index(s)for s in starts];body=[]
  for i,at in enumerate(pos):
   t=m.clean(text[at:pos[i+1]if i+1<len(pos)else len(text)]);t=re.sub(r'^[A-D]\s+','',t)if i<4 else t;body.append({'label':chr(65+i),'text':t})
  corrections+=['Restored printed labels C and E–H from source page images; OCR missed them','Corrected I misread as a vertical bar']
 elif 'patagonia' in lessonid:
  d['footnotes']=[body.pop()['text']];pairs=[('The ate’ model','The ‘late’ model'),('the ate model’','the ‘late model’'),(' wa ” v ',' ')];body=[{**p,'text':apply(p['text'],pairs)}for p in body]
  merged=body[3]['text'];at=merged.index('We can speculate then');body[3:4]=[{'text':merged[:at].strip()},{'text':merged[at:]}];body[0]['figure']={'asset':'assets/patagonia-reading-map.png','alt':'Map showing Patagonia in southern South America'};corrections+=pairs+['Restored paragraph break before We can speculate; separated radiocarbon footnote']
 elif 'fluoridation' in lessonid:
  pairs=[('tooth decay, The fluorine','tooth decay. The fluorine'),('standard | milligram','standard 1 milligram'),('wisdom of ad allowing','wisdom of allowing'),('Turn over >» ',' '),('social Processes','social processes'),('also be involved, In the same way','also be involved. In the same way'),('Therefore | oppose','Therefore I oppose')];body=[{**p,'text':apply(p['text'],pairs)}for p in body];t=body[5]['text'];at=t.index('In the same way');body[5:6]=[{'text':t[:at].strip()},{'text':t[at:]}];corrections+=pairs+['Restored paragraph break before In the same way']
 d['paragraphs']=body;d['conversion']['sourceParagraphCount']=len(body)
 qtext='\n\n'.join(p['text']for p in raw['pages'][2:]);qtext=re.sub(r'(?m)^\s*\d{1,2}\s*$','',qtext);qtext=re.sub(r'(?m)^\s*[|]\s*','',qtext);qtext=re.sub(r'(?m)^[. ]*Cc\s+','C ',qtext);qtext=re.sub(r'(?m)^c\s+','C ',qtext);qtext=qtext.replace('White the correct','Write the correct');qtext=re.sub(r'(?m)^27[.‘]+\s*','27 ',qtext);qtext=re.sub(r'(?m)^t\s+33','33',qtext);qtext=re.sub(r'\bI documents','I documents',qtext)
 qtext=qtext.replace('G_ long-term H_ accurate | documents','G long-term H accurate I documents').replace('G_ theatre goers H_ freedom | programme','G theatre goers H freedom I programme').replace('H__ reliable connection | — skilled preservation','H reliable connection I skilled preservation')
 qtext=apply(qtext,[('Albert Gunther','Albert Günther'),('Albert Giinther','Albert Günther'),('lan Crook','Ian Crook'),('Inthe','In the')])
 if 'language-barrier' in lessonid:
  qtext=qtext.replace('D persuasive E temporary F local','A short-term B assumptions C transactions\nD persuasive E temporary F local')
 elif 'organisations' in lessonid:
  qtext=qtext.replace('a great deal Of 37 veeeeeeee- -','a great deal of 37 ............ .').replace('AO ..........--','40 ............')
 elif 'fluoridation' in lessonid:
  a=qtext.index('Questions 27');b=qtext.index('Questions 32');qtext='''Questions 27 – 31
Choose the correct letter, A, B, C or D.
Write the correct letter in boxes 27-31 on your answer sheet.
27 The optimum amount of fluorine in fluoridated water is calculated partly according to
A how hot the area is.
B how warm the water is.
C how many dental problems there are in the community.
D how much fluorine the community chooses to have in its water.
28 One reason given by the writer for opposing fluoridation is that
A it may contribute to tooth decay.
B it will be unacceptably expensive for the public.
C obligatory fluoridation takes away personal freedom.
D excessive fluoride could be added to the water by mistake.
29 The writer mentions Kuhn in order to
A provide a contrast with the view of Collins.
B support the rational nature of scientific inquiry.
C demonstrate that Kuhn did not argue his case adequately.
D show that science can be influenced by non-scientific considerations.
30 What did Sutton’s research discover about earlier studies in North America?
A There were failings in the way they were carried out.
B The scientists involved had achieved unique results.
C Proponents of fluoridation had not understood its long-term effects.
D Fluoridation had a greater effect on tooth decay than previously believed.
31 In the last paragraph, what does the writer say about scientists?
A They should reveal their true motivations.
B They should not decide the fluoridation policy.
C They are solely concerned with scientific truths.
D They cannot reach agreement on the fluoridation issue.

'''+qtext[b:]
  qtext=re.sub(r'(?m)^33\.\s*','33 ',qtext);qtext=re.sub(r'34 ee findings.*?rica\.','34 Sutton’s findings have been given insufficient attention by scientists outside of North America.',qtext,flags=re.S);qtext=qtext.replace('36 _—','36').replace('approach. _','approach.')
 banks={
 'p3-managing-the-language-barrier-in-international-business':('A short-term',['short-term','assumptions','transactions','persuasive','temporary','local','long-term','accurate','documents','gestures','clients','costly','outcomes','errors','specialists']),
 'p3-what-makes-organisations-successful':('A time',['time','performers','bold print','play','managers','assistance','theatre goers','freedom','programme','annual report']),
 'p3-the-tuatara-past-and-future':('A natural evolution',['natural evolution','creative thought','indigenous plants','trout','pollution','restoration','native fish','extinction']),
 'p3-the-peopling-of-patagonia':('A fixed date',['fixed date','random collection','similar properties','good condition','scientific evaluation','huge quantities','new samples','reliable connection','skilled preservation','immediate surroundings'])}
 if lessonid in banks:
  bankstart,values=banks[lessonid];a=qtext.index(bankstart);nextq=re.search(r'(?m)^Questions?\s+\d+',qtext[a:]);b=a+nextq.start()if nextq else len(qtext);qtext=qtext[:a]+'\n'.join(chr(65+i)+'  '+v for i,v in enumerate(values))+'\n\n'+qtext[b:]
 qtext=re.sub(r'\b([A-O])_+\s*',r'\1 ',qtext)
 markers=list(re.finditer(r'(?im)^Questions?\s+(\d+)\s*(?:[-–—~]\s*(\d+))?\s*$',qtext));groups=[]
 for i,x in enumerate(markers):
  chunk=qtext[x.start():markers[i+1].start()if i+1<len(markers)else len(qtext)].strip();start,end=int(x[1]),int(x[2]or x[1]);page=next((pg['page']for pg in raw['pages'][2:]if re.search(r'Questions?\s+'+str(start)+r'\b',pg['text'])),3)-1
  g=m.parse_group({'start':start,'end':end,'text':chunk,'page':page},body,fitz.open(args.cache/(sid+'.pdf')))
  if g['type']=='summary-drag' and g.get('content'):
   text=g['content'][0];titles={'p3-the-tuatara-past-and-future':'What conclusions can we draw?','p3-managing-the-language-barrier-in-international-business':'Managing language resources in multinational companies','p3-what-makes-organisations-successful':'The theatre','p3-the-peopling-of-patagonia':'The archaeological evidence from Patagonia'};title=titles.get(lessonid)
   if title and text.startswith(title):g['title']=title;g['content'][0]=text[len(title):].strip();g['content']=[p for p in g['content']if p]
  groups.append(g)
 if 'patagonia' in lessonid:
  groups[0]['questions'][-1]['options'][-1]['text']='Streams exposed the site, making new research possible.'
 if 'organisations' in lessonid:
  groups[-1]['content']=[t.replace('person Is mentioned','person is mentioned')for t in groups[-1]['content']]
 if 'language-barrier' in lessonid:
  groups[0]['content']=[t.replace('{{31}} At','{{31}}. At').replace('{{33}} Furthermore','{{33}}. Furthermore')for t in groups[0]['content']]
  groups[1]['content']=[t.replace('as a{{36}}','as a {{36}}')for t in groups[1]['content']]
 d['groups']=groups;d['displayParagraphLabels']=m.paragraph_labels_visible(groups);p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');fixes[lessonid]={'sourceId':sid,'sha256':d['sources'][0]['sha256'],'corrections':corrections,'questionPages':list(range(3,len(raw['pages'])+1))};print('Draft repaired',lessonid,len(body),[g['type']for g in groups])
(OUT/'correction-audit.json').write_text(json.dumps(fixes,ensure_ascii=False,indent=2)+'\n')
