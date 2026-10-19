#!/usr/bin/env python3
"""Word-assisted draft converter. Never publishes or approves its own output.
Read the original PDF first, match the exact source version, and review every
Word paragraph/task against it. Missing/contradictory questions remain held.
Note layout overrides require an explicit source-specific review.
"""
import pathlib,json,re,hashlib,importlib.util,sys,argparse
from word_source_scope import require_word
from docx import Document
from docx.text.paragraph import Paragraph
from docx.oxml.ns import qn
import fitz
ap=argparse.ArgumentParser(description='Build unapproved practice drafts from paired Word and original PDF sources.');ap.add_argument('--selection',type=pathlib.Path,nargs='+',required=True);ap.add_argument('--word-cache',type=pathlib.Path,required=True);ap.add_argument('--pdf-cache',type=pathlib.Path,required=True);ap.add_argument('--output',type=pathlib.Path,required=True);ap.add_argument('--note-overrides',type=pathlib.Path);args=ap.parse_args();root=pathlib.Path(__file__).resolve().parents[1];spec=importlib.util.spec_from_file_location('parser',root/'scripts/parse-practice.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
out=args.output;out.mkdir(exist_ok=True)
selection=[x for p in args.selection for x in json.load(open(p))]
report=[]
notes_overrides=json.load(open(args.note_overrides))if args.note_overrides else{}
for x in selection:
 j=x['job'];w=require_word(x['words'][0],j['part']);doc=Document(args.word_cache/(w['id']+'.docx'));ps=[]
 for e in doc.element.body:
  if e.tag==qn('w:p'):ps.append(Paragraph(e,doc))
  elif e.tag==qn('w:tbl'):
   for row in e.findall(qn('w:tr')):
    for cell in row.findall(qn('w:tc')):ps.extend(Paragraph(p,doc) for p in cell.findall('.//'+qn('w:p')))
 # Text runs, paragraphs and source formatting remain available alongside drafts.
 rec=[]
 for p in ps:
  if not p.text.strip():continue
  rec.append({'text':p.text,'bold':bool(p.runs and all(r.bold for r in p.runs if r.text.strip())),'italic':bool(p.runs and all(r.italic for r in p.runs if r.text.strip())),'indent':p.paragraph_format.left_indent.pt if p.paragraph_format.left_indent else 0,'runs':[{'text':r.text,**({'bold':True}if r.bold else{}),**({'italic':True}if r.italic else{})}for r in p.runs if r.text]})
 (out/(j['id']+'-source.json')).write_text(json.dumps(rec,ensure_ascii=False,indent=2))
 try:
  # Search actual standalone source title, including two-line titles. No fuzzy adoption.
  at=next((i for i,r in enumerate(rec)if m.norm(r['text'])==m.norm(j['title'])),None);titlen=1
  if at is None:
   at=next((i for i in range(len(rec)-1)if m.norm(rec[i]['text']+' '+rec[i+1]['text'])==m.norm(j['title'])),None);titlen=2
  if at is None:raise ValueError('Title absent from Word text; inspect source artwork')
  title=m.clean(' '.join(r['text']for r in rec[at:at+titlen]));end=next((i for i in range(at+titlen,len(rec))if re.match(r'^Questions?\s+\d',rec[i]['text'])),len(rec))
  reading=rec[at+titlen:end];subtitle=None
  if reading and reading[0]['italic'] and len(reading[0]['text'].split())<60:subtitle=m.clean(reading.pop(0)['text'])
  paras=[];label=None
  for r in reading:
   t=m.clean(r['text'])
   if re.fullmatch('[A-Z]',t):label=t;continue
   if label:
    paras.append({'label':label,'text':t});label=None
   elif paras and paras[-1].get('label'):
    p=paras[-1];p.setdefault('blocks',[p['text']]).append(t);p['text']=' '.join(p['blocks'])
   else:paras.append({'text':t})
  # Heading tasks can appear before the reading; reading must never contaminate the last heading prompt.
  qrec=rec[:at]+rec[end:];text='\n'.join(r['text']for r in qrec)
  text=re.sub(r'(Questions?\s+\d+\s*(?:[-–—]|and|&)\s*\d+)\s*(?=[A-Za-z])',r'\1\n',text)
  text=re.sub(r'(Questions?\s+\d+)\s*(?=[A-Z][a-z])',r'\1\n',text)
  text=re.sub(r'(?<=[.?])(?=(?:In boxes|Write (?:your|the)|Choose |Complete |Do the following))','\n',text)
  markers=list(m.HEADER.finditer(text));groups=[]
  pdf=fitz.open(args.pdf_cache/(j['sources'][0]['id']+'.pdf'))
  original_title=m.printed_summary_title
  def wordtitle(doc,page,body):
   first=m.clean(body.split('\n',1)[0]);r=next((r for r in rec if m.clean(r['text'])==first),None)
   return first if r and r['bold'] and '{{'not in m.slots(first) else None
  m.printed_summary_title=wordtitle
  for i,h in enumerate(markers):
   chunk=text[h.start():markers[i+1].start()if i+1<len(markers)else len(text)].strip();a,b=int(h[1]),int(h[2]or h[1]);chunk=re.sub(r'\nREADING PASSAGE[\s\S]*','',chunk)
   # Questions ownership is grounded below during original PDF review.
   page=next((pi for pi,p in enumerate(pdf)if re.search(r'Questions?\s+'+str(a)+r'\b',p.get_text())),2)
   if 'complete the notes' in chunk.lower():
    if j['id']not in notes_overrides:raise ValueError('Word notes require reviewed rich layout adapter')
    m.notes_module.extract_notes=lambda *unused:json.loads(json.dumps(notes_overrides[j['id']]))
   g=m.parse_group({'start':a,'end':b,'text':chunk,'page':min(page,len(pdf)-1)},paras,pdf);groups.append(g)
  m.printed_summary_title=original_title
  m.check_duplicate_prompts(groups)
  ns=[n for g in groups for n in g.get('numbers',[q['n']for q in g.get('questions',[])])];start={1:1,2:14,3:27}[j['part']];count=14 if j['part']==3 else 13
  if sorted(ns)!=list(range(start,start+count)):raise ValueError('Question numbering incomplete '+str(ns))
  if sum(len(p['text'].split())for p in paras)<200:raise ValueError('Reading incomplete')
  d={'id':j['id'],'part':j['part'],'title':title,'mode':'practice','status':'draft','paragraphs':paras,'groups':groups,'displayParagraphLabels':m.paragraph_labels_visible(groups),'sources':[{'id':w['id'],'role':'word-transcription','sha256':hashlib.sha256(pathlib.Path(args.word_cache/(w['id']+'.docx')).read_bytes()).hexdigest()},{'id':j['sources'][0]['id'],'role':'original-pdf','sha256':hashlib.sha256(pathlib.Path(args.pdf_cache/(j['sources'][0]['id']+'.pdf')).read_bytes()).hexdigest()}],'conversion':{'version':'3.25-word','jobId':j['id'],'method':'word-with-original-pdf-review','requiresReview':True,'sourceParagraphCount':len(paras)}}
  if subtitle:d['subtitle']=subtitle
  (out/(j['id']+'.json')).write_text(json.dumps(d,ensure_ascii=False,indent=2));report.append({'job':j['id'],'status':'draft','paragraphs':len(paras),'groups':[g['type']for g in groups]})
 except Exception as e:report.append({'job':j['id'],'status':'held','reason':str(e)})
print(json.dumps(report,ensure_ascii=False,indent=2));(out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
