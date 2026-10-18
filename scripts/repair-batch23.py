"""Source-checked native adapters; never publish automatically."""
import json, hashlib, importlib.util, argparse
from pathlib import Path
import fitz
p=argparse.ArgumentParser();p.add_argument('--batch',type=Path,required=True);p.add_argument('--cache',type=Path,required=True);a=p.parse_args()
root=Path(__file__).resolve().parents[1];spec=importlib.util.spec_from_file_location('parser',root/'scripts/parse-practice.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
jobs=json.load(open(root/'import/jobs.json'));report=json.load(open(a.batch/'batch-report.json'))
selected=[('p1-undergraduate-students-guidelines-to-students-on-literature-courses-check-em-dash-toan-bai','1_2CTiE41vfw71crr9vHtZR9mLiYizD9x','Undergraduate students:'),('p3-travelling-plants','1ixA7GPGZvbbBYBLxZyrirOzw-9kTKeoC','Travelling Plants')]
for job,sid,hint in selected:
 j=next(j for j in jobs if j['id']==job);doc=fitz.open(a.cache/(sid+'.pdf'));title,paras,chunks,sub,foot=m.collect(doc,{'title':hint})
 if j['part']==1:
  assert sub==['Guidelines to students on literature courses'];title+=' '+sub[0];sub=[]
 groups=[]
 for c in chunks:
  inst=m.source_instructions(c['text'],c['start'],c['end'])
  if j['part']==1 and c['start']==5:
   t=doc[c['page']].find_tables().tables[0];raw=t.extract();assert raw[6]==['Period','Audience','Features of\ntheatres','Features of drama']
   rows=[[m.notes_module.normalize_table_cell(m.slots(v)) for v in row] for row in raw[6:11]]
   widths=[cell[2]-cell[0] for cell in t.rows[6].cells]
   g={'sourceInstructions':inst,'sourcePages':[c['page']+1],'type':'notes','task':'table','title':raw[5][0],'wordLimit':m.word_limit(inst),'questions':[{'n':n} for n in range(5,14)],'tableHeader':True,'table':rows,'columnWidths':[round(w*100/sum(widths),2) for w in widths]}
  elif j['part']==3 and c['start']==40:
   # PDF object order emits all four letter labels before their text. The
   # printed rows were checked visually; associate each text by its baseline.
   page=doc[c['page']];lines=[l for b in page.get_text('dict')['blocks'] for l in b.get('lines',[])]
   opts=[]
   for code in 'ABCD':
    labels=[l for l in lines if ''.join(s['text'] for s in l['spans']).strip()==code];assert len(labels)==1
    label=labels[0];texts=[l for l in lines if l['bbox'][0]>label['bbox'][2]+5 and abs(l['bbox'][1]-label['bbox'][1])<2];assert len(texts)==1
    opts.append({'value':code,'text':m.clean(''.join(s['text'] for s in texts[0]['spans']))})
   g={'sourceInstructions':inst,'sourcePages':[c['page']+1],'type':'mc-one','questions':[{'n':40,'prompt':'Which of the following best summarises Reading Passage 3?','options':opts}]}
  else:g=m.parse_group(c,paras,doc)
  groups.append(g)
 d={'id':f'p{j["part"]}-{m.slug(title)}','part':j['part'],'title':title,'mode':'practice','status':'draft','paragraphs':paras,'groups':groups,'sources':[{'id':sid,'role':'passage-and-questions','sha256':hashlib.sha256((a.cache/(sid+'.pdf')).read_bytes()).hexdigest()}],'conversion':{'version':m.VERSION,'jobId':job,'method':'native-pdf-with-reviewed-layout-adapter','requiresReview':True,'sourceParagraphCount':len(paras)},'displayParagraphLabels':m.paragraph_labels_visible(groups)}
 if sub:d['subtitle']=m.normalize_subtitle(' '.join(sub))
 if foot:d['footnotes']=foot
 draft='drafts/'+job+'.json';(a.batch/draft).write_text(json.dumps(d,ensure_ascii=False,indent=2));r=next((r for r in report['results'] if r['job']==job),None)
 if r is None:r={'job':job,'attempts':[]};report['results'].append(r)
 r.update(status='ready-for-review',draft=draft,lessonId=d['id'],sourceId=sid,sourceHash=d['sources'][0]['sha256']);r['attempts'].append({'code':'reviewed-adapter','message':'Exact table region or baseline-aligned MCQ options checked against source PDF'})
report['counts']={k:sum(r['status']==k for r in report['results']) for k in ['ready-for-review','held','error']};(a.batch/'batch-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(report['counts'])
