#!/usr/bin/env python3
"""Replay exact PDF-verified repairs for alternate source versions; drafts only."""
import argparse,json,re
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--batch',type=Path,required=True);a=p.parse_args();report=json.load(open(a.batch/'batch-report.json'))
for r in report['results']:
 if r['status']!='ready-for-review':continue
 path=a.batch/r['draft'];d=json.load(open(path));job=r['job']
 if job=='p1-copy-your-neighbour':
  d['subtitle']='Pretending to be protects you from predators. But why don’t neighbouring mimics all look alike? Adrian Barnett investigates';d['title']='Copy Your Neighbour';d['id']='p1-copy-your-neighbour';d['conversion']['visualTitleVerified']=True
 split={'p1-saving-the-kiwi':'Protection for kiwi comes in various forms.','p1-the-history-of-the-car-industry':'Another woman played a major role'}
 if job in split:
  rows=[]
  for para in d['paragraphs']:
   needle=' '+split[job]
   if needle in para['text']:
    before,after=para['text'].split(needle,1);rows.extend([{'text':before},{'text':split[job]+after}])
   else:rows.append(para)
  d['paragraphs']=rows
 if job=='p1-the-history-of-the-car-industry':
  g=next(g for g in d['groups'] if g['type']=='notes');labelwidth=9.344
  labels={0:'1887',1:'1890',2:'1894',3:'1894–1904',4:'1914',5:'1970s',7:'1980s–1990s',8:'Current trends'}
  for index,row in enumerate(g['noteLayout']['rows']):
   runs=row['runs'];label=labels.get(index)
   if label and runs[0].get('bold') and runs[0]['text'].strip()==label:row['runs']=runs[1:]
   row['labelRuns']=[{'text':label,'bold':True}] if label else []
   row['labelWidthEm']=labelwidth;row['indent']=0
 if job=='p3-a-closer-examination-of-a-study-on-verbal-and-non-verbal-messages-chua-rep':
  d['title']=d['title'].replace('non- verbal','non-verbal');rows=[]
  headings=['Description of the Study','Methodological Issues','Lessons to consider','Conclusion']
  for para in d['paragraphs']:
   if para['text'] in headings:rows.append({'text':para['text'],'heading':True});continue
   h=next((h for h in headings if para['text'].startswith(h+' ')),None)
   if h:rows.append({'text':h,'heading':True});para={'text':para['text'][len(h)+1:]}
   text=para['text'].replace('1 UCLA: University of California at Los Angeles ', '')
   for boundary in ['Please remember that all my findings','To be fair, many textbook writers']:
    if ' '+boundary in text:
     before,after=text.split(' '+boundary,1);rows.append({'text':before});text=boundary+after
   rows.append({'text':text})
  d['paragraphs']=rows;d['footnotes']=['1 UCLA: University of California at Los Angeles']
 d['conversion']['sourceParagraphCount']=len(d['paragraphs']);path.write_text(json.dumps(d,ensure_ascii=False,indent=2));r['lessonId']=d['id'];r['title']=d['title']
(a.batch/'batch-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
