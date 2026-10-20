#!/usr/bin/env python3
"""Concurrent/resumable free conversion, reports and an explicit review queue.
Writes private drafts only. Does not touch the website, original PDFs or Drive.
"""
import argparse,collections,concurrent.futures,hashlib,importlib.util,json,os,re,subprocess,sys,time
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path(__file__).resolve().parents[1]
OCR_SPEC=importlib.util.spec_from_file_location('source_ocr',ROOT/'scripts/bulk-import.py')
ocr=importlib.util.module_from_spec(OCR_SPEC);OCR_SPEC.loader.exec_module(ocr)
SPEC=importlib.util.spec_from_file_location('practice_parser',ROOT/'scripts/parse-practice.py')
parser=importlib.util.module_from_spec(SPEC);SPEC.loader.exec_module(parser)
def atomic_json(path,data):
 path.parent.mkdir(parents=True,exist_ok=True);temp=path.with_suffix(path.suffix+'.tmp');temp.write_text(json.dumps(data,ensure_ascii=False,indent=2));temp.replace(path)
def fingerprint(job,cache,native_only=False):
 h=hashlib.sha256(json.dumps({'id':job['id'],'title':job['title'],'part':job['part'],'sources':job['sources'],'flags':job.get('flags',[]),'converter':parser.VERSION,'nativeOnly':native_only},sort_keys=True).encode())
 for code in ['parse-practice.py','source-notes.py','source-emphasis.py','convert-batch.py']:
  h.update((ROOT/'scripts'/code).read_bytes())
 h.update((ROOT/'dist/exam-data.js').read_bytes())
 for source in job['sources']:
  p=cache/(source['id']+'.pdf')
  if p.exists():h.update(p.read_bytes())
 return h.hexdigest()
def run_job(job,cache,output,force=False,prepared=None,native_only=False):
 started=time.monotonic();report_path=output/'reports'/(job.get('storageKey',job['id'])+'.json');fp=fingerprint(job,cache,native_only)
 if not force and report_path.exists():
  previous=json.loads(report_path.read_text())
  draft=output/previous.get('draft','__none__')
  if previous.get('fingerprint')==fp and (previous.get('status')!='ready-for-review' or draft.exists()):return {**previous,'cached':True}
 report={'job':job['id'],'title':job['title'],'part':job['part'],'fingerprint':fp,'converterVersion':parser.VERSION,'attempts':[],'status':'held','requiresReview':True}
 if job.get('flags'):report['attempts'].append({'code':'source-flag','message':'; '.join(job['flags'])})
 else:
  sources=[s for s in job['sources'] if s['type']=='application/pdf' and (cache/(s['id']+'.pdf')).exists()]
  # Native/more complete PDFs first; a bad variant never hides another cached variant.
  def rank(s):
   import fitz
   try:
    with fitz.open(cache/(s['id']+'.pdf')) as d:return sum(len(p.get_text()) for p in d)
   except Exception:return 0
  sources.sort(key=rank,reverse=True)
  (output/'ocr').mkdir(parents=True,exist_ok=True)
  if not sources:report.update(status='waiting-for-download');report['attempts'].append({'code':'not-cached','message':'Fetch the source through connected Drive first'})
  for source in sources:
   try:
    data=parser.parse({**source,'title':job['title']+'.pdf' if source['title'].upper() in ['PDF','PAPER','PAPER + PDF'] else source['title']},job['part'],cache)
    # Preserve the actual source filename in provenance.
    data['sources'][0]['name']=source['title'];data['conversion']['jobId']=job['id']
    draft=Path('drafts')/(job.get('storageKey',job['id'])+'.json');atomic_json(output/draft,data)
    report.update(status='ready-for-review',draft=str(draft),lessonId=data['id'],sourceId=source['id'],questionCount=sum(len(g.get('numbers') or g['questions']) for g in data['groups']),types=[g['type'] for g in data['groups']],sourceHash=data['sources'][0]['sha256'],checks=data['conversion']['checks'])
    report['attempts'].append({'sourceId':source['id'],'code':'converted','message':'Structural checks passed; passage/layout still require review'})
    break
   except parser.Hold as e:
    attempt={'sourceId':source['id'],'code':e.code,'message':str(e)}
    if e.code=='scan-review' and not native_only:
     transcript=prepared/(source['id']+'.json') if prepared else None
     try:
      if transcript and transcript.exists() and json.loads(transcript.read_text()).get('sha256')==hashlib.sha256((cache/(source['id']+'.pdf')).read_bytes()).hexdigest():native=json.loads(transcript.read_text())
      else:
       ocr.extract(source,cache,output/'ocr');native=json.loads((output/'ocr'/(source['id']+'.json')).read_text())
      local=Path('transcripts')/(source['id']+'.json');atomic_json(output/local,native);attempt['transcript']=str(local);attempt['ocrConfidence']=[p.get('confidence') for p in native['pages'] if p['method']=='ocr'];attempt['message']+='; free OCR transcript prepared, typography/arrows still need source review'
     except Exception as err:attempt['ocrError']=type(err).__name__+': '+str(err)
    report['attempts'].append(attempt)
   except (ValueError,KeyError,IndexError) as e:report['attempts'].append({'sourceId':source['id'],'code':'source-layout','message':str(e)})
   except Exception as e:report['attempts'].append({'sourceId':source['id'],'code':'converter-error','message':type(e).__name__+': '+str(e)});report['status']='error'
 if report['status']!='ready-for-review':
  # A stale successful draft must not survive a newly detected error.
  old=output/'drafts'/(job.get('storageKey',job['id'])+'.json')
  if old.exists():old.unlink()
 report['seconds']=round(time.monotonic()-started,3);atomic_json(report_path,report);return report

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--cache',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--jobs',type=Path,default=ROOT/'import/jobs.json');p.add_argument('--workers',type=int,default=6);p.add_argument('--max-jobs',type=int);p.add_argument('--include-reviewed',action='store_true');p.add_argument('--force',action='store_true');p.add_argument('--native-only',action='store_true',help='Hold scan sources without repeating OCR in a fast native-text batch');p.add_argument('--prepared',type=Path,default=ROOT/'import/prepared');a=p.parse_args()
 if a.max_jobs is not None and a.max_jobs<1:p.error('--max-jobs must be positive')
 if a.output.resolve()==(ROOT/'dist').resolve() or (ROOT/'dist').resolve() in a.output.resolve().parents:p.error('Drafts must stay outside public dist')
 jobs=json.loads(a.jobs.read_text());
 counts=collections.Counter(j['id'] for j in jobs)
 for j in jobs:
  if not re.fullmatch(r'[a-z0-9-]+',j['id']) or j['part'] not in [1,2,3]:p.error('Invalid job id/passage')
  if counts[j['id']]>1:
   j['storageKey']=j['id']+'-'+hashlib.sha256(json.dumps(j,sort_keys=True).encode()).hexdigest()[:12]
   j['flags']=[*j.get('flags',[]),'duplicate-title: compare the source versions before choosing a lesson']
 jobs=[j for j in jobs if a.include_reviewed or j['status']!='reviewed'];selected=[]
 for j in jobs:
  if any((a.cache/(s['id']+'.pdf')).exists() for s in j['sources']):selected.append(j)
 if a.max_jobs:selected=selected[:a.max_jobs]
 a.output.mkdir(parents=True,exist_ok=True);start=time.monotonic();results=[]
 with concurrent.futures.ProcessPoolExecutor(max_workers=max(1,min(a.workers,8))) as pool:
  tasks={pool.submit(run_job,j,a.cache,a.output,a.force,a.prepared,a.native_only):j for j in selected}
  for f in concurrent.futures.as_completed(tasks):
   r=f.result();results.append(r);print(json.dumps({'job':r['job'],'status':r['status'],'cached':r.get('cached',False),'reasons':[t['code'] for t in r['attempts'] if t['code']!='converted']},ensure_ascii=False),flush=True)
 # Use the exact website validator once per batch, not one Node process per PDF.
 draft_dir=a.output/'drafts';draft_dir.mkdir(exist_ok=True)
 check=subprocess.run(['node',str(ROOT/'scripts/validate-conversion.mjs'),str(draft_dir)],capture_output=True,text=True)
 if check.returncode not in [0,1]:raise RuntimeError('Structural validator could not run: '+check.stderr[:500])
 validation=json.loads(check.stdout)
 bad={r['file']:r['errors'] for r in validation['reports'] if r['errors']}
 for r in results:
  if r.get('draft') and Path(r['draft']).name in bad:
   r['status']='held';r['attempts'].append({'code':'schema','message':'; '.join(bad[Path(r['draft']).name])});(a.output/r['draft']).unlink(missing_ok=True)
   atomic_json(a.output/'reports'/(r['job']+'.json'),r)
 results.sort(key=lambda r:r['job']);counts={s:sum(r['status']==s for r in results) for s in ['ready-for-review','held','error','waiting-for-download']}
 hashes={}
 for r in results:
  if r.get('sourceHash'):hashes.setdefault(r['sourceHash'],[]).append(r['job'])
 summary={'converterVersion':parser.VERSION,'selected':len(selected),'cachedSources':sum((a.cache/(s['id']+'.pdf')).exists() for j in jobs for s in j['sources']),'remainingUncachedJobs':sum(not any((a.cache/(s['id']+'.pdf')).exists() for s in j['sources']) for j in jobs),'counts':counts,'seconds':round(time.monotonic()-start,3),'cachedJobs':sum(r.get('cached',False) for r in results),'duplicateSources':[v for v in hashes.values() if len(v)>1],'results':results,'published':0}
 atomic_json(a.output/'batch-report.json',summary);atomic_json(a.output/'review-queue.json',[{'job':r['job'],'status':r['status'],'draft':r.get('draft'),'reasons':r['attempts']} for r in results]);print(json.dumps({k:v for k,v in summary.items() if k!='results'},ensure_ascii=False))
 if counts['error']:return 1
 return 0
if __name__=='__main__':raise SystemExit(main())
