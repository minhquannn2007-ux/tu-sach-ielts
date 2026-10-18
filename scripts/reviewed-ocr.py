"""Shared draft helpers for explicitly reviewed scan adapters. No publishing."""
import json,re,hashlib,importlib.util
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('practice_parser',ROOT/'scripts/parse-practice.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
def split(text,starts):
 pos=[text.index(s) for s in starts];assert pos==sorted(set(pos));return [m.clean(text[x:pos[i+1] if i+1<len(pos) else len(text)]) for i,x in enumerate(pos)]
def fixes(text,pairs):
 for before,after in pairs:
  assert before in text,before;text=text.replace(before,after)
 return text
def qs(start,texts):return [{'n':start+i,'prompt':m.clean(t)} for i,t in enumerate(texts)]
def row(text,indent=0,marker=None,bold=False,space=.2):
 r={'runs':[{'text':text,**({'bold':True} if bold else {})}],'indent':indent,'spaceBefore':space}
 if marker:r.update(marker=marker,hanging=1.5,firstLine=0)
 return r
def notes(start,end,title,rows,page):
 return {'type':'notes','sourceInstructions':f'Questions {start} – {end} Complete the notes below. Choose ONE WORD ONLY from the passage for each answer. Write your answers in boxes {start}-{end} on your answer sheet.','sourcePages':[page],'questions':[{'n':n} for n in range(start,end+1)],'wordLimit':'ONE WORD ONLY','title':title,'noteLayout':{'title':title,'titleAlign':'center','rows':rows,'sourceVerified':True,'layoutVersion':2},'content':[''.join(r['text'] for r in x['runs']) for x in rows]}
def tf(start,texts,page,part):
 end=start+len(texts)-1
 return {'type':'tfng','sourceInstructions':f'Questions {start} – {end} Do the following statements agree with the information given in Reading Passage {part}? In boxes {start}-{end} on your answer sheet, write TRUE if the statement agrees with the information FALSE if the statement contradicts the information NOT GIVEN if there is no information on this','sourcePages':[page],'questions':qs(start,texts)}
def features(start,texts,bank,page,target,title,reuse):
 end=start+len(texts)-1;last=chr(64+len(bank))
 return {'type':'matching-features','sourceInstructions':f'Questions {start} – {end} Look at the following statements (Questions {start}-{end}) and the list of {title.lower()} below. Match each statement with the correct {target}, A-{last}. Write the correct letter, A-{last}, in boxes {start}-{end} on your answer sheet.'+(' NB You may use any letter more than once.' if reuse else ''),'sourcePages':[page],'questions':qs(start,texts),'bank':[{'value':chr(65+i),'text':t} for i,t in enumerate(bank)],'targetName':target,'listTitle':'List of '+title,'reuse':reuse}
def summary(start,end,title,text,page):
 return {'type':'summary-input','task':'summary','sourceInstructions':f'Questions {start} – {end} Complete the summary below. Choose ONE WORD ONLY from the passage for each answer. Write your answers in boxes {start}-{end} on your answer sheet.','sourcePages':[page],'title':title,'wordLimit':'ONE WORD ONLY','questions':[{'n':n} for n in range(start,end+1)],'content':text if isinstance(text,list) else [text]}
class DraftBatch:
 def __init__(self,cache,output):
  self.cache=cache;self.output=output;self.results=[];self.audit=[];output.mkdir(parents=True,exist_ok=True);(output/'drafts').mkdir(exist_ok=True)
 def source(self,sid):
  raw=json.load(open(ROOT/'import/mass-batch-24/prepared'/(sid+'.json')));assert raw['sha256']==hashlib.sha256((self.cache/(sid+'.pdf')).read_bytes()).hexdigest();return raw,[p['text'] for p in raw['pages']]
 def save(self,job,sid,title,part,paras,groups,raw,corrections,subtitle=None,footnotes=None):
  paras=[p if isinstance(p,dict) else {'text':p} for p in paras];d={'id':f'p{part}-{m.slug(title)}','title':title,'part':part,'mode':'practice','status':'draft','paragraphs':paras,'groups':groups,'displayParagraphLabels':m.paragraph_labels_visible(groups),'sources':[{'id':sid,'role':'passage-and-questions','sha256':raw['sha256']}],'conversion':{'version':m.VERSION,'jobId':job,'method':'ocr-with-explicit-source-reviewed-adapter','requiresReview':True,'sourceParagraphCount':len(paras)}}
  if subtitle:d['subtitle']=subtitle
  if footnotes:d['footnotes']=footnotes
  m.check_duplicate_prompts(groups);draft='drafts/'+job+'.json';(self.output/draft).write_text(json.dumps(d,ensure_ascii=False,indent=2));self.results.append({'job':job,'sourceId':sid,'draft':draft,'lessonId':d['id'],'status':'ready-for-review'})
  self.audit.append({'job':job,'sourceId':sid,'sourceHash':raw['sha256'],'visualSourcePages':list(range(1,len(raw['pages'])+1)),'allReadingParagraphs':True,'allTaskPages':True,'titleSubtitle':True,'corrections':corrections,'reviewed':True,'paragraphs':len(paras),'questionCount':sum(len(g.get('questions',g.get('numbers',[]))) for g in groups)})
 def finish(self):
  (self.output/'batch-report.json').write_text(json.dumps({'results':self.results,'counts':{'ready-for-review':len(self.results)}},ensure_ascii=False,indent=2));(self.output/'source-review.json').write_text(json.dumps(self.audit,ensure_ascii=False,indent=2));print('Drafts',len(self.results))
