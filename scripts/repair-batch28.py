"""Reviewed native source adapters. Reorder only verified PDF text banks.

PDFs remain unchanged. PageProxy changes plain-text object order for question
collection; original styled blocks and all source verification use real pages.
"""
import argparse,json,hashlib,importlib.util,re
from pathlib import Path
import fitz
p=argparse.ArgumentParser();p.add_argument('--cache',type=Path,required=True);p.add_argument('--batch',type=Path,required=True);a=p.parse_args()
root=Path(__file__).resolve().parents[1];sp=importlib.util.spec_from_file_location('parser',root/'scripts/parse-practice.py');m=importlib.util.module_from_spec(sp);sp.loader.exec_module(m)
class PageProxy:
 def __init__(self,page,text):self.page=page;self.text=text
 def __getattr__(self,key):return getattr(self.page,key)
 def get_text(self,option='text',*args,**kwargs):return self.text if option=='text' else self.page.get_text(option,*args,**kwargs)
class DocProxy:
 def __init__(self,doc,texts):self.doc=doc;self.texts=texts
 def __len__(self):return len(self.doc)
 def __iter__(self):return (self[i] for i in range(len(self.doc)))
 def __getitem__(self,i):return PageProxy(self.doc[i],self.texts.get(i,self.doc[i].get_text()))
selected=[
 ('p3-a-new-voyage-round-the-world','1_LKGjWGg4qPlCs73ykLrEGLQJAM7g8Jj','A New Voyage Round the World',3,'Questions 36',r'(?m)^A detailed illustrations\s*$',list('ABCDEFGHI'),['detailed illustrations','traveller','nature','editor','writer','scientific observations','the crew','artist','plain language']),
 ('p3-rights-for-apes','1gGCRaaxWBBvJ38CChJcSELuFmMPLGz9u','Rights for apes',2,'Questions 32',r'(?m)^\s*A experience\s*$',list('ABCDEFGHIJ'),['experience','well-being','knowledge','regulations','charities','research','dolphins','needs','work','species']),
 ('p3-no-title-charles-darwin','1YMNvrPerQzeiiG7WndTeWyn854yM_oOO','No title – Charles Darwin',None,None,None,None,None),
 ('p3-psychological-responses-to-mirror-images','1zD3JGOrNXZwkdshFbeHPqPql_7mJ9zN8','No title – Mirrors',None,None,None,None,None)
]
report=json.load(open(a.batch/'batch-report.json'));reviews=[];complete=[]
for job,sid,label,pn,before,pattern,codes,expected in selected:
 doc=fitz.open(a.cache/(sid+'.pdf'));texts={};untitled=pn is None
 if not untitled:
  text=doc[pn].get_text();matches=list(re.finditer(pattern,text));assert len(matches)==1;start=matches[0].start();banktext=text[start:];bank=m.options(banktext,expected=codes);assert [o['text'] for o in bank]==expected
  insertion=text.index(before);assert insertion<start
  texts[pn]=text[:insertion]+banktext+'\n'+text[insertion:start]
 title,paras,chunks,sub,foot=m.collect(DocProxy(doc,texts),{'title':label,**({'visualTitle':label} if untitled else {})})
 groups=[m.parse_group(c,paras,doc) for c in chunks];m.check_duplicate_prompts(groups)
 d={'id':job,'title':title,'part':3,'status':'draft','mode':'practice','paragraphs':paras,'groups':groups,'displayParagraphLabels':m.paragraph_labels_visible(groups),'sources':[{'id':sid,'role':'passage-and-questions','sha256':hashlib.sha256((a.cache/(sid+'.pdf')).read_bytes()).hexdigest()}],'conversion':{'version':m.VERSION,'jobId':job,'method':'native-pdf-with-reviewed-layout-adapter','requiresReview':True,'sourceParagraphCount':len(paras)}}
 if sub:d['subtitle']=m.normalize_subtitle(' '.join(sub))
 if foot:d['footnotes']=foot
 if untitled:d['conversion'].update(sourceTitleAbsent=True,neutralUiTitleVerified=True)
 raw='\n'.join(m.strip_page_number(p) for p in doc);raw='\n'.join(line for line in raw.splitlines() if m.norm(line)!=m.norm(title));nr=m.norm(raw)
 ps=''.join(m.norm(p['text']) for p in paras);start=nr.find(ps[:80]);end=nr.find(ps[-80:],start)+80;assert start>=0 and ps==nr[start:end],job
 complete.append({'job':job,'fullReadingSpanMatches':True,'paragraphs':len(paras)})
 draft='drafts/'+job+'.json';(a.batch/draft).write_text(json.dumps(d,ensure_ascii=False,indent=2));r=next(r for r in report['results'] if r['job']==job);r.update(status='ready-for-review',draft=draft,lessonId=job,sourceId=sid,sourceHash=d['sources'][0]['sha256']);r['attempts'].append({'code':'reviewed-adapter','message':'Verified native bank object order or neutral label for genuinely untitled source'})
 reviews.append({'job':job,'sourceHash':d['sources'][0]['sha256'],'allSourcePages':list(range(1,len(doc)+1)),'titleAbsent':untitled,'neutralUiTitleVerified':untitled,'bankVerified':not untitled,'fullReadingText':True,'allTasks':True})
report['counts']={k:sum(r['status']==k for r in report['results']) for k in ['ready-for-review','held','error']};(a.batch/'batch-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));(a.batch/'source-review.json').write_text(json.dumps(reviews,ensure_ascii=False,indent=2));(a.batch/'reading-completeness.json').write_text(json.dumps(complete,indent=2));print(report['counts'])
