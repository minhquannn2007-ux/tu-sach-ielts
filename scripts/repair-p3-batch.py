#!/usr/bin/env python3
"""Replay PDF-verified Passage 3 repairs; drafts only, never approval."""
import argparse,json
from pathlib import Path

p=argparse.ArgumentParser();p.add_argument('--batch',type=Path,required=True);a=p.parse_args()
report=json.load(open(a.batch/'batch-report.json'))
for r in report['results']:
 if r.get('status')!='ready-for-review' or not r.get('draft'):continue
 path=a.batch/r['draft'];d=json.load(open(path));job=r['job']
 if job=='p3-reducing-exposure-to-indoor-air-pollution-in-developing-countries':
  d['id']='p3-reducing-exposure-to-indoor-air-pollution-in-developing-countries'
  d['title']='Reducing exposure to indoor air pollution in developing countries'
  d['subtitle']='In a review of ways of reducing smoke levels, interventions were considered in three areas: the source of smoke, the living environment and the user'
  headings=[
   'Cooking on a cleaner fuel','Getting smoke out of the house',
   'Cutting smoke volumes in improved biomass stoves','Reducing the need for fire',
   'Changing patterns of behaviour','Identifying appropriate solutions'
  ]
  rows=[]
  for para in d['paragraphs']:
   text=para['text'];heading=next((h for h in headings if text==h or text.startswith(h+' ')),None)
   if heading:
    rows.append({'text':heading,'heading':True});text=text[len(heading):].strip()
   if text:rows.append({'text':text})
  d['paragraphs']=rows;d['conversion']['sourceParagraphCount']=len(rows)
 if job=='p3-expansion-of-the-worlds-deserts':
  d['conversion']['visualTitleVerified']=True
 path.write_text(json.dumps(d,ensure_ascii=False,indent=2));r['lessonId']=d['id'];r['title']=d['title']
(a.batch/'batch-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
