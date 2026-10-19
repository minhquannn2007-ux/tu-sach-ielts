"""Replay four source-specific batch41 draft adapters after source hash verification. Never approves or publishes. Usage: python scripts/prepare-word-batch41.py WORKSPACE (contains word41-selection.json and source caches)."""
import pathlib,json,re,hashlib,importlib.util,fitz
import sys
root=pathlib.Path(sys.argv[1]).resolve();repo=pathlib.Path(__file__).resolve().parents[1];spec=importlib.util.spec_from_file_location('p',repo/'scripts/parse-practice.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
sel={x['job']['id']:x for x in json.load(open(root/'word41-selection.json'))};out=root/'word41-reviewed';out.mkdir(exist_ok=True)
for id in ['p1-scented-plants','p2-the-importance-of-the-human-urge-to-move','p2-the-beginning-of-the-consumer-age','p3-asian-space-return-of-an-asian-invention']:
 x=sel[id];j=x['job'];approved=next(v for v in json.load(open(repo/'import/word-batch-41/source-review.json')) if v['job']==id)
 for src in approved['sources']:
  file=root/('word-cache' if src['role']=='word-transcription' else 'pdf-cache')/(src['id']+('.docx' if src['role']=='word-transcription' else '.pdf'))
  assert hashlib.sha256(file.read_bytes()).hexdigest()==src['sha256'],'Source changed; review again'
 rec=json.load(open(root/'word41-build'/(id+'-source.json')))
 if id=='p1-scented-plants':rec.insert(2,{'text':'Scented Plants','bold':True})
 if id=='p2-the-importance-of-the-human-urge-to-move':rec.pop(51)
 if id=='p2-the-beginning-of-the-consumer-age':rec[3]['text']+=' '+rec.pop(4)['text'];rec[3]['italic']=True
 if id=='p3-asian-space-return-of-an-asian-invention':
  rec[52]['text']='Asian countries are interested in advances in medical treatment using satellite technology because'
  begin=36;items=rec[begin:46];new=[];pos=0
  for lab,n in zip('ABCDEF',[1,1,2,1,3,2]):new+=[{'text':lab}]+items[pos:pos+n];pos+=n
  rec[begin:46]=new
 at=next(i for i,r in enumerate(rec)if m.norm(r['text'])==m.norm(j['title']));end=next(i for i in range(at+1,len(rec))if re.match(r'^Questions?\s+\d',rec[i]['text']));reading=rec[at+1:end];sub=None
 if reading[0].get('italic'):sub=m.clean(reading.pop(0)['text'])
 paras=[];label=None
 for r in reading:
  t=m.clean(r['text'])
  if re.fullmatch('[A-Z]',t):label=t;continue
  if label:paras.append({'label':label,'text':t});label=None
  elif paras and paras[-1].get('label'):
   p=paras[-1];p.setdefault('blocks',[p['text']]).append(t);p['text']=' '.join(p['blocks'])
  else:paras.append({'text':t})
 text='\n'.join(r['text']for r in rec[:at]+rec[end:]);text=re.sub(r'(Questions?\s+\d+\s*(?:[-–—]|and|&)\s*\d+)\s*(?=[A-Za-z])',r'\1\n',text);text=re.sub(r'(Questions?\s+\d+)\s*(?=[A-Z][a-z])',r'\1\n',text);text=re.sub(r'(?<=[.?])(?=(?:In boxes|Write (?:your|the)|Choose |Complete |Do the following))','\n',text)
 pdf=fitz.open(root/'pdf-cache'/(j['sources'][0]['id']+'.pdf'));orig=m.printed_summary_title
 def wt(doc,page,body):
  first=m.clean(body.split('\n',1)[0]);r=next((r for r in rec if m.clean(r['text'])==first),None);return first if r and r.get('bold') and '{{'not in m.slots(first)else None
 m.printed_summary_title=wt;markers=list(m.HEADER.finditer(text));groups=[]
 for i,h in enumerate(markers):
  chunk=text[h.start():markers[i+1].start()if i+1<len(markers)else len(text)].strip();chunk=re.sub(r'\nREADING PASSAGE[\s\S]*','',chunk);a,b=int(h[1]),int(h[2]or h[1]);groups.append(m.parse_group({'start':a,'end':b,'text':chunk,'page':2},paras,pdf))
 m.printed_summary_title=orig
 sources=[{'id':x['words'][0]['id'],'role':'word-transcription','sha256':hashlib.sha256((root/'word-cache'/(x['words'][0]['id']+'.docx')).read_bytes()).hexdigest()},{'id':j['sources'][0]['id'],'role':'original-pdf','sha256':hashlib.sha256((root/'pdf-cache'/(j['sources'][0]['id']+'.pdf')).read_bytes()).hexdigest()}]
 d={'id':id,'part':j['part'],'title':m.clean(rec[at]['text']),'paragraphs':paras,'groups':groups,'mode':'practice','status':'draft','sources':sources,'displayParagraphLabels':m.paragraph_labels_visible(groups),'conversion':{'version':'3.25-word','jobId':id,'method':'word-with-original-pdf-review','requiresReview':True,'sourceParagraphCount':len(paras)}}
 if sub:d['subtitle']=sub
 (out/(id+'.json')).write_text(json.dumps(d,ensure_ascii=False,indent=2))
 print(id,len(paras))
