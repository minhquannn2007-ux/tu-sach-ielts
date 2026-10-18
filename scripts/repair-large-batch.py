#!/usr/bin/env python3
"""Exact, source-reviewed reading-title/subheading repairs. Draft output only."""
import argparse,json,importlib.util
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--batch',type=Path,required=True);p.add_argument('--cache',type=Path,required=True);a=p.parse_args();root=Path(__file__).resolve().parents[1];s=importlib.util.spec_from_file_location('parser',root/'scripts/parse-practice.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
rs=json.load(open(a.batch/'batch-report.json'))['results']
for r in rs:
 if r['job']=='p1-mungo-lady-and-mungo-man' and r['status']=='ready-for-review':
  old=json.load(open(a.batch/r['draft']));source={'id':r['sourceId'],'title':'Controversies in Australian Prehistory.pdf'};d=m.parse(source,1,a.cache);d['sources'][0]['name']=old['sources'][0]['name'];d['conversion']['jobId']=r['job'];rows=[]
  for para in d['paragraphs']:
   h='Mungo Lady and Mungo Man'
   if para['text'].startswith(h+' '):rows.extend([{'text':h,'heading':True},{'text':para['text'][len(h)+1:]}])
   else:rows.append(para)
  d['paragraphs']=rows;d['conversion']['sourceParagraphCount']=len(rows);(a.batch/r['draft']).write_text(json.dumps(d,ensure_ascii=False,indent=2));r['lessonId']=d['id'];r['title']=d['title']
 if r['job']=='p1-work-and-family-a-balancing-act' and r['status']=='ready-for-review':
  path=a.batch/r['draft'];d=json.load(open(path));rows=[];headings=['Introduction','Aim of the Study','Methodology','Conclusion']
  for para in d['paragraphs']:
   h=next((h for h in headings if para['text'].startswith(h+' ')),None)
   if h:rows.extend([{'text':h,'heading':True},{'text':para['text'][len(h)+1:]}])
   else:rows.append(para)
  d['paragraphs']=rows;d['conversion']['sourceParagraphCount']=len(rows);path.write_text(json.dumps(d,ensure_ascii=False,indent=2))
(a.batch/'batch-report.json').write_text(json.dumps({'results':rs,'converterVersion':m.VERSION,'selected':193},ensure_ascii=False,indent=2))
