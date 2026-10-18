#!/usr/bin/env python3
"""Evidence-based scheduling only. Never approves or edits a lesson/job."""
import collections, glob, hashlib, html, json, pathlib, re, unicodedata
ROOT=pathlib.Path(__file__).resolve().parents[1]
def norm(s):
 s=unicodedata.normalize('NFKD',html.unescape(s)).lower()
 return ''.join(c for c in s if c.isalnum())
def classify(job, duplicate, prepared):
 reason=job.get('holdReason',''); r=reason.lower()
 if duplicate: return 'published-match-check'
 if re.search(r'diagram|flow.chart|arrows|label positions',r): return 'visual-layout'
 if re.search(r'duplicate|legacy',r): return 'version-comparison'
 if re.search(r'source-content|damaged sentence|missing|repeated|duplicate|unordered|conflict|differs|number|needs 14|incomplete|unrelated|corrupt|mismatch',r): return 'source-conflict'
 if 'source-name-requires-comparison' in job.get('flags',[]): return 'source-comparison'
 if re.search(r'ambiguous|boundary|unknown source task|parallel|adapter',r): return 'adapter-review'
 variants=[prepared[s['id']] for s in job['sources'] if s['id'] in prepared]
 if variants:
  task_text=' '.join(p.get('text','') for v in variants for p in v.get('pages',[]))
  if re.search(r'(?:complete|label) the (?:following )?(?:flow.chart|diagram)',task_text,re.I): return 'visual-layout'
  complete=any(v.get('pages') and all(len(p.get('text','').strip())>=100 and (p.get('confidence') is None or p['confidence']>=85) for p in v['pages']) for v in variants)
  if complete: return 'transcript-review-candidates'
  return 'ocr-repair-or-alternate'
 if re.search(r'ocr|scan|image',r): return 'ocr-needed'
 return 'preflight-needed'
def build(root=ROOT):
 jobs=json.loads((root/'import/jobs.json').read_text()); catalog=json.loads((root/'dist/lesson-catalog.json').read_text())
 published=collections.defaultdict(list)
 for lesson in catalog: published[norm(lesson['title'])].append(lesson['id'])
 for a in re.findall(r'<article\b.*?</article>',(root/'dist/index.html').read_text(),re.S):
  titles=re.findall(r'<h[23][^>]*>(.*?)</h[23]>',a,re.S); href=re.findall(r'href="([^"]+)"',a)
  if titles and href: published[norm(re.sub('<[^>]+>','',titles[0]))].append(href[0])
 source_matches=collections.defaultdict(list)
 for j in jobs:
  if j.get('status')=='reviewed':
   for s in j['sources']: source_matches[s['id']].append(j.get('lesson_id',j['id']))
 prepared={}
 for p in sorted(set(root.glob('import/prepared/*.json'))|set(root.glob('import/mass-batch-*/prepared/*.json'))):
  try: d=json.loads(p.read_text())
  except (ValueError,OSError): continue
  if isinstance(d,dict) and 'pages' in d and 'id' in d: prepared[d['id']]=d
 rows=[]; occurrences=collections.Counter()
 for j in jobs:
  if j.get('status')=='reviewed': continue
  signature=j['id']+':'+','.join(sorted(s['id'] for s in j['sources']))
  occurrences[signature]+=1
  key=hashlib.sha256(signature.encode()).hexdigest()[:16]+f'-{occurrences[signature]}'
  matches=set(published.get(norm(j['title']),[]))
  for s in j['sources']: matches.update(source_matches.get(s['id'],[]))
  evidence=[]
  for s in j['sources']:
   if s['id'] in prepared:
    d=prepared[s['id']]; pages=d['pages']
    evidence.append({'sourceId':s['id'],'sha256':d.get('sha256'),'pages':len(pages),'shortTextPages':[p.get('page') for p in pages if len(p.get('text','').strip())<100],'methods':dict(collections.Counter(p.get('method','unknown') for p in pages))})
  rows.append({'key':key,'id':j['id'],'title':j['title'],'part':j['part'],'category':classify(j,matches,prepared),'status':j['status'],'holdReason':j.get('holdReason',''),'flags':j.get('flags',[]),'publishedMatches':sorted(matches),'preparedEvidence':evidence,'sources':j['sources'],'approved':False})
 assert len(rows)==sum(j.get('status')!='reviewed' for j in jobs)
 assert len({r['key'] for r in rows})==len(rows)
 return rows
if __name__=='__main__':
 rows=build(); out=ROOT/'import/backlog-queues';out.mkdir(exist_ok=True)
 categories=sorted({r['category'] for r in rows});counts={}
 for category in categories:
  group=[r for r in rows if r['category']==category];counts[category]={'total':len(group),'parts':dict(collections.Counter(r['part'] for r in group))}
  (out/(category+'.json')).write_text(json.dumps(group,ensure_ascii=False,indent=2)+'\n')
 report={'scope':'Scheduling metadata and persisted transcript evidence; not visual approval','total':len(rows),'categories':counts,'approved':0}
 (out/'summary.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(report,ensure_ascii=False,indent=2))
