#!/usr/bin/env python3
"""Select next Drive source metadata for the assistant's authenticated batch fetch.
This contains canonical Drive URLs only; never credentials or download bearer URLs.
"""
import argparse,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def main():
 p=argparse.ArgumentParser();p.add_argument('--cache',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--max-jobs',type=int,default=100);a=p.parse_args()
 if a.max_jobs<1:p.error('max-jobs must be positive')
 chosen=[]
 for job in json.loads((ROOT/'import/jobs.json').read_text()):
  if job['status']=='reviewed' or job.get('flags') or job.get('holdReason'):continue
  sources=[s for s in job['sources'] if s['type']=='application/pdf']
  if any((a.cache/(s['id']+'.pdf')).exists() for s in sources):continue
  # Fetch one source first; the converter records when a variant must be compared.
  sources.sort(key=lambda s:(not s['title'].lower().endswith('.pdf'),s['title'].upper()=='PAPER'))
  if sources:
   s=sources[0];chosen.append({'job':job['id'],'part':job['part'],'title':job['title'],'source':s})
  if len(chosen)>=a.max_jobs:break
 if (ROOT/'dist').resolve() in a.output.resolve().parents:p.error('Download manifests must stay private')
 a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps(chosen,ensure_ascii=False,indent=2));print(json.dumps({'selected':len(chosen),'manifest':str(a.output)}))
if __name__=='__main__':main()
