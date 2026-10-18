#!/usr/bin/env python3
"""Free, resumable Drive-source inventory and local PDF/OCR preparation.

Drive files are fetched by the authenticated connector into --cache/<file-id>.pdf.
No keys, paid API calls or unchecked publication. Reviewed lesson JSON is a
separate step: OCR is not an answer key.
"""
import argparse, concurrent.futures, csv, hashlib, io, json, re, subprocess, time, unicodedata
from pathlib import Path
import fitz

ROOT = Path(__file__).resolve().parents[1]
EXTRACTOR_VERSION = 3
def transcript_quality(pages):
    short = [p['page'] for p in pages if len(p.get('text','').strip()) < 100]
    low = [p['page'] for p in pages if p.get('confidence') is not None and p['confidence'] < 85]
    return {'emptyDocument':not bool(pages),'shortTextPages':short,'lowConfidencePages':low,
            'needsRepair':not bool(pages) or bool(short or low),
            'requiresVisualReview':not bool(pages) or any(p.get('method')=='ocr' for p in pages)}
def slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')[:120]

def inventory():
    data = json.loads((ROOT/'import/drive-inventory.json').read_text())
    jobs = {}
    for item in data['roots']:
        title = re.sub(r'\.pdf$', '', item['title'], flags=re.I).strip()
        key = (item['part'], re.sub(r'\s+', ' ', title.lower()))
        job = jobs.setdefault(key, {'id': f"p{item['part']}-{slug(title)}", 'part': item['part'], 'title': title, 'sources': [], 'flags': [], 'status': 'queued'})
        if re.search(r'sai|missing|thiếu', title, re.I):
            job['flags'] = ['source-name-requires-comparison']
        candidates = item.get('children') or ([item] if item['type'] != 'application/vnd.google-apps.folder' else [])
        for source in candidates:
            job['sources'].append({k: source.get(k) for k in ('id', 'title', 'type', 'url', 'size')})
    result = list(jobs.values())
    (ROOT/'import/jobs.json').write_text(json.dumps(result, ensure_ascii=False, indent=2))
    print(json.dumps({'jobs':len(result), 'source_files':sum(len(j['sources']) for j in result), 'flagged_titles':sum(bool(j['flags']) for j in result)}))
    return result

def extract(source, cache, out):
    filename = cache/(source['id']+'.pdf')
    target = out/(source['id']+'.json')
    sha = hashlib.sha256(filename.read_bytes()).hexdigest()
    if target.exists():
        previous=json.loads(target.read_text())
        if previous.get('sha256') == sha and previous.get('extractor_version') in (2, EXTRACTOR_VERSION):
            # Version 3 adds quality metadata only; reuse version 2 OCR verbatim.
            previous.update(extractor_version=EXTRACTOR_VERSION,quality=transcript_quality(previous['pages']))
            previous['requires_review']=previous['quality']['requiresVisualReview'] or previous['quality']['needsRepair']
            target.write_text(json.dumps(previous,ensure_ascii=False))
            return {'id':source['id'], 'status':'cached','pages':len(previous['pages']),'quality':previous['quality']}
    started=time.monotonic(); doc=fitz.open(filename); pages=[]
    for n,page in enumerate(doc):
        text=page.get_text('text'); method='text'; confidence=None; boxes=[]
        if len(text.strip()) < 100:
            method='ocr'; pix=page.get_pixmap(matrix=fitz.Matrix(2400/max(page.rect.width,page.rect.height),2400/max(page.rect.width,page.rect.height)), alpha=False)
            image=out/(source['id']+f'-page-{n+1}.png'); pix.save(image)
            # One CPU thread per worker prevents nested OCR oversubscription.
            import os
            env={**os.environ,'OMP_THREAD_LIMIT':'1'}
            result=subprocess.run(['tesseract',str(image),'stdout','-l','eng','--psm','3','tsv'],env=env,capture_output=True,text=True,check=True)
            rows=list(csv.DictReader(io.StringIO(result.stdout),delimiter='\t',quoting=csv.QUOTE_NONE)); words=[r for r in rows if r.get('text','').strip()]
            lines={}
            for r in words:
                key=(r['block_num'],r['par_num'],r['line_num']); lines.setdefault(key,[]).append(r['text'])
                boxes.append({'text':r['text'],'confidence':float(r['conf']),'box':[int(r[k]) for k in ('left','top','width','height')]})
            text='\n'.join(' '.join(w) for w in lines.values())
            confidence=round(sum(float(r['conf']) for r in words)/max(1,len(words)),1)
        pages.append({'page':n+1,'text':text,'method':method,'confidence':confidence,'word_boxes':boxes,'width':page.rect.width,'height':page.rect.height})
    quality=transcript_quality(pages)
    result={'extractor_version':EXTRACTOR_VERSION,'id':source['id'],'title':source['title'],'sha256':sha,'pages':pages,'elapsed_seconds':round(time.monotonic()-started,2),'quality':quality,'requires_review':quality['requiresVisualReview'] or quality['needsRepair']}
    target.write_text(json.dumps(result,ensure_ascii=False));(out/(source['id']+'.txt')).write_text('\n\n'.join(f"--- PAGE {p['page']} ---\n{p['text']}" for p in pages))
    return {'id':source['id'],'status':'extracted','pages':len(pages),'seconds':result['elapsed_seconds'],'requires_review':result['requires_review']}

def main():
    parser=argparse.ArgumentParser();parser.add_argument('command',choices=['inventory','extract']);parser.add_argument('--cache',type=Path);parser.add_argument('--output',type=Path);parser.add_argument('--workers',type=int,default=6);args=parser.parse_args()
    if args.command=='inventory':inventory();return
    if not args.cache or not args.output:parser.error('extract requires --cache and --output')
    args.output.mkdir(parents=True,exist_ok=True);jobs=json.loads((ROOT/'import/jobs.json').read_text());sources={s['id']:s for j in jobs for s in j['sources'] if s['type']=='application/pdf' and (args.cache/(s['id']+'.pdf')).exists()}
    results=[]
    with concurrent.futures.ProcessPoolExecutor(max_workers=max(1,min(args.workers,8))) as pool:
        pending={pool.submit(extract,s,args.cache,args.output):s for s in sources.values()}
        for future in concurrent.futures.as_completed(pending):
            try: result=future.result()
            except Exception as e:result={'id':pending[future]['id'],'status':'error','error':str(e)}
            results.append(result);print(json.dumps(result),flush=True)
    (args.output/'run-summary.json').write_text(json.dumps(results,indent=2))
    print(json.dumps({'prepared':len(results),'errors':sum(x['status']=='error' for x in results)}))

if __name__=='__main__':main()
