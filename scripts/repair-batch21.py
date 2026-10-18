"""Exact source-reviewed table regions and subtitle adapters; drafts only."""
import argparse,json,hashlib,importlib.util,re
from pathlib import Path
import fitz
p=argparse.ArgumentParser();p.add_argument('--batch',type=Path,required=True);p.add_argument('--cache',type=Path,required=True);p.add_argument('--jobs',type=Path,required=True);a=p.parse_args()
root=Path(__file__).resolve().parents[1];s=importlib.util.spec_from_file_location('parser',root/'scripts/parse-practice.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
report=json.load(open(a.batch/'batch-report.json'));jobs={j['id']:j for j in json.load(open(a.jobs))}
tables={
 'p1-the-history-of-the-guitar-chua-rep':('1vwUz30zGYBtM8ZwUErGc1pNCP-VMEwIA',6,11,[1,2,3],4),
 'p1-the-story-of-the-railroad':('1NyE0nGAuH74lvP6lQTx5RTV3LLaSj1w_',5,8,[0,1,2,3,4],4),
 'p1-conquering-the-south-pole':('1zjxiBJgoRafWibF36esqWeFQU3IGumDo',4,8,[0,1,2],None),
 'p1-the-slow-food-organization':('1HdU-qqI1rTRWcDVQsM8ZDrNQIZgFyF_h',5,8,[0,2,3,4],None)
}
subtitles={
 'p2-how-dental-health-is-threatened':('1XOvNTZpvecwY8_BhiHTnITu9pkrPpshu','Scientists are looking for ways to reduce tooth decay in New Zealand children'),
 'p2-the-humble-houseplant-an-aid-for-health-and-cleanliness':('17SiTutSqftb9Uyufg5ERk6Wx4sAEbXIL','Building on NASA experiments for air purification in space, scientists are pinpointing plant species that are skillful at cleaning indoor air of pollutants that can cause a range of health problems.')
}
for r in report['results']:
 job=r['job']
 if job not in tables and job not in subtitles:continue
 j=jobs[job];sid=(tables.get(job) or subtitles[job])[0];source=next(s for s in j['sources'] if s['id']==sid);doc=fitz.open(a.cache/(sid+'.pdf'))
 title,paras,chunks,sub,foot=m.collect(doc,{**source,'title':j['title'].split(' (')[0]+'.pdf'})
 if job in subtitles:
  subtitle=subtitles[job][1];assert paras[0]['text'].startswith(subtitle)
  paras[0]['text']=paras[0]['text'][len(subtitle):].strip();sub=[subtitle];rows=[]
  for p in paras:
   if not p['text']:continue
   match=re.match(r'^([A-Z])\s+(.+)',p['text'])
   if match and (not rows or ord(match[1])==ord(rows[-1]['label'])+1):rows.append({'label':match[1],'text':match[2]})
   else:
    assert rows;rows[-1]['text']+=' '+p['text']
  paras=rows
 groups=[]
 for c in chunks:
  inst=m.source_instructions(c['text'],c['start'],c['end'])
  if job in tables and 'complete the table' in inst.lower():
   _,start,end,cols,title_row=tables[job];tab=doc[c['page']].find_tables().tables[0];raw=tab.extract();rows=[]
   for ri in range(start,end):
    row=[]
    for ci in cols:
     value=raw[ri][ci]
     if value is None:assert job=='p1-the-history-of-the-guitar-chua-rep' and ri==9 and ci==1;value=''
     row.append(m.notes_module.normalize_table_cell(m.slots(value)))
    rows.append(row)
   cells=[tab.rows[start].cells[ci] for ci in cols];widths=[cell[2]-cell[0] for cell in cells];total=sum(widths)
   g={'sourceInstructions':inst,'sourcePages':[c['page']+1],'questions':[{'n':n} for n in range(c['start'],c['end']+1)],'type':'notes','task':'table','wordLimit':m.word_limit(inst),'tableHeader':True,'table':rows,'columnWidths':[round(w*100/total,2) for w in widths]}
   if title_row is not None:g['title']=m.clean(raw[title_row][0])
   if job=='p1-the-history-of-the-guitar-chua-rep':g['tableSpans']=[{'row':2,'col':0,'rows':2,'cols':1}];g['tableCellItalicText']=[{'row':1,'col':1,'text':'Chitarra'}]
   if job in ['p1-conquering-the-south-pole','p1-the-story-of-the-railroad','p1-the-slow-food-organization']:g['tableCellBold']=[str(i)+':0' for i in range(1,len(rows))]
  else:g=m.parse_group(c,paras,doc)
  if job=='p2-how-dental-health-is-threatened' and g['type']=='matching-features':g['targetName']='professional'
  groups.append(g)
 m.check_duplicate_prompts(groups)
 d={'id':f'p{j["part"]}-{m.slug(title)}','part':j['part'],'title':title,'mode':'practice','status':'draft','paragraphs':paras,'groups':groups,'sources':[{'id':sid,'name':source['title'],'role':'passage-and-questions','sha256':hashlib.sha256((a.cache/(sid+'.pdf')).read_bytes()).hexdigest()}],'conversion':{'version':m.VERSION,'jobId':job,'sourceParagraphCount':len(paras),'method':'native-pdf-with-reviewed-layout-adapter','requiresReview':True},'displayParagraphLabels':m.paragraph_labels_visible(groups)}
 if sub:d['subtitle']=m.normalize_subtitle(' '.join(sub))
 if foot:d['footnotes']=foot
 draft=Path('drafts')/(job+'.json');(a.batch/draft).write_text(json.dumps(d,ensure_ascii=False,indent=2))
 r.update(status='ready-for-review',draft=str(draft),lessonId=d['id'],sourceId=sid,sourceHash=d['sources'][0]['sha256'],types=[g['type'] for g in groups]);r['attempts'].append({'code':'reviewed-adapter','message':'Source-checked table boundaries or subtitle/paragraph labels'})
report['counts']={k:sum(r['status']==k for r in report['results']) for k in ['ready-for-review','held','error']};(a.batch/'batch-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(report['counts'])
