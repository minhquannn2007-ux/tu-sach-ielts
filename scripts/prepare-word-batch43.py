"""Replay three reviewed source-reading adapters. Drafts only. Usage: python scripts/prepare-word-batch43.py WORKSPACE."""
import json,pathlib,re,hashlib,importlib.util,fitz
import sys
root=pathlib.Path(sys.argv[1]).resolve();repo=pathlib.Path(__file__).resolve().parents[1];spec=importlib.util.spec_from_file_location('p',repo/'scripts/parse-practice.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);out=root/'word43-adapted';out.mkdir(exist_ok=True)
sel={x['job']['id']:x for f in ['word43-selection.json','word43-new.json']for x in json.load(open(root/f))}
for id in ['p2-orientation-of-birds','p2-australian-parrots','p2-redwoods-a-d-22-rep-sai']:
 x=sel[id];j=x['job'];approved=next(v for v in json.load(open(repo/'import/word-batch-43/source-review.json'))if v['job']==id)
 for src in approved['draftSources']:
  p=root/('word-cache'if src['role']=='word-transcription'else'pdf-cache')/(src['id']+('.docx'if src['role']=='word-transcription'else'.pdf'))
  assert hashlib.sha256(p.read_bytes()).hexdigest()==src['sha256'],'Source changed; review again'
 folder='word43-new-build'if 'redwoods'in id else'word43-build';rec=json.load(open(root/folder/(id+'-source.json')))
 if id=='p2-redwoods-a-d-22-rep-sai':
  rec[34]['text']+=' '+rec.pop(35)['text'];rec[34]['italic']=True;start,end,labs=35,41,'ABCDEF'
 elif id=='p2-australian-parrots':rec[3]['italic']=True;start,end,labs=4,14,'ABCDEFGHIJ'
 else:start,end,labs=3,11,'ABCDEFGH'
 items=rec[start:end];rec[start:end]=[r for lab,item in zip(labs,items)for r in [{'text':lab},item]]
 at=next(i for i,r in enumerate(rec)if m.norm(r['text'])==m.norm(j['title']));end=next(i for i in range(at+1,len(rec))if re.match(r'^Questions?\s+\d',rec[i]['text']));reading=rec[at+1:end];sub=None
 if reading[0].get('italic'):sub=m.clean(reading.pop(0)['text'])
 paras=[];lab=None
 for r in reading:
  t=m.clean(r['text'])
  if re.fullmatch('[A-Z]',t):lab=t;continue
  paras.append({'label':lab,'text':t});lab=None
 text='\n'.join(r['text']for r in rec[:at]+rec[end:]);text=re.sub(r'(Questions?\s+\d+\s*(?:[-–—]|and|&)\s*\d+)\s*(?=[A-Za-z])',r'\1\n',text);text=re.sub(r'(Questions?\s+\d+)\s*(?=[A-Z][a-z])',r'\1\n',text);text=re.sub(r'(?<=[.?])(?=(?:In boxes|Write (?:your|the)|Choose |Complete |Do the following))','\n',text)
 pdf=fitz.open(root/'pdf-cache'/(j['sources'][0]['id']+'.pdf'));orig=m.printed_summary_title
 def wt(doc,page,body):
  first=m.clean(body.split('\n',1)[0]);r=next((r for r in rec if m.clean(r['text'])==first),None);return first if r and r.get('bold') and '{{'not in m.slots(first)else None
 m.printed_summary_title=wt;markers=list(m.HEADER.finditer(text));groups=[]
 for i,h in enumerate(markers):
  chunk=text[h.start():markers[i+1].start()if i+1<len(markers)else len(text)].strip();chunk=re.sub(r'\nREADING PASSAGE[\s\S]*','',chunk);a,b=int(h[1]),int(h[2]or h[1])
  if id=='p2-orientation-of-birds'and a==23:
   bank=['an ability to orientate without previous training','the speed at which birds can fly','the ability to remember things seen previously','the effect of age on homing ability','the strength required to fly a great distance','a high success rate in finding nests','the importance of seasonal cues for migrating birds'];g={'type':'matching-features','sourceInstructions':m.source_instructions(chunk,a,b),'sourcePages':[4],'questions':[{'n':n,'prompt':t}for n,t in zip(range(23,27),['domestic pigeon','alpine swift','European stork','starling'])],'bank':[{'value':chr(65+i),'text':t}for i,t in enumerate(bank)],'targetName':'point','listTitle':'List of Points','reuse':False}
  else:g=m.parse_group({'start':a,'end':b,'text':chunk,'page':2},paras,pdf)
  groups.append(g)
 m.printed_summary_title=orig
 sources=[{'id':x['words'][0]['id'],'role':'word-transcription','sha256':hashlib.sha256((root/'word-cache'/(x['words'][0]['id']+'.docx')).read_bytes()).hexdigest()},{'id':j['sources'][0]['id'],'role':'original-pdf','sha256':hashlib.sha256((root/'pdf-cache'/(j['sources'][0]['id']+'.pdf')).read_bytes()).hexdigest()}]
 d={'id':id,'part':j['part'],'title':m.clean(rec[at]['text']),'paragraphs':paras,'groups':groups,'mode':'practice','status':'draft','sources':sources,'displayParagraphLabels':m.paragraph_labels_visible(groups),'conversion':{'version':'3.25-word','jobId':id,'method':'word-with-original-pdf-review','requiresReview':True,'sourceParagraphCount':len(paras)}}
 if sub:d['subtitle']=sub
 (out/(id+'.json')).write_text(json.dumps(d,ensure_ascii=False,indent=2));print(id,len(paras))
