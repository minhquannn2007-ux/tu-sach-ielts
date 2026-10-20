"""Publish only the eight page-reviewed lessons; verify cached original source bytes."""
import json,pathlib,hashlib
R=pathlib.Path(__file__).resolve().parents[1];O=R/'import/scan-batch-20261020';reviews=json.load(open(O/'source-review.json'));covers=json.load(open(O/'cover-sources.json'));jobs=json.load(open(R/'import/jobs.json'));holds=json.load(open(R/'import/source-content-holds.json'))['lessons'];blocked={x['job']for x in holds if x.get('publicationBlocked')};mapping={'p3-yawning':'p3-yawning-chua-rep'}
for a in reviews:
 assert all(a[k] for k in ['reviewed','allReadingParagraphs','allTaskPages','titleSubtitle','footnotes'])
 id=a['lessonId'];p=O/(id+'.json');d=json.loads(p.read_text());job=mapping.get(id,id);assert job not in blocked and id not in blocked;assert not (R/'dist/lessons'/(id+'.json')).exists(),id
 for s in d['sources']:assert s['sha256']==hashlib.sha256((R.parent/'pdf-cache'/(s['id']+'.pdf')).read_bytes()).hexdigest()
 x=covers[id];d['cover']={'asset':'assets/'+id+'-cover.jpg','alt':x['title'].removeprefix('File:'),'source':x['source'],'credit':x['credit'],'license':x['license'],'licenseUrl':x['licenseUrl']};d['conversion']['jobId']=job
 # Named experimental variants in the source are separate headings above their text.
 if id=='p3-yawning':
  ps=[]
  for q in d['paragraphs']:
   if q['text'].startswith(('i) ','ii) ','iii) ')):
    a1,b=q['text'].split('\n',1);ps.extend([{'text':a1,'heading':True},{'text':b}])
   else:ps.append(q)
  d['paragraphs']=ps;d['conversion']['sourceParagraphCount']=len(ps)
  d['review']['sourceNote']='The original source marks contagion response with an asterisk but supplies no explanatory footnote on any of its five pages; no definition has been invented.'
 (R/'dist/lessons'/(id+'.json')).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
 j=next(j for j in jobs if j['id']==job);j.update(status='reviewed',lesson_id=id,mode='practice');j.pop('holdReason',None)
 a['publishedSha256']=hashlib.sha256((R/'dist/lessons'/(id+'.json')).read_bytes()).hexdigest()
json.dump(jobs,open(R/'import/jobs.json','w'),ensure_ascii=False,indent=2);(O/'source-review.json').write_text(json.dumps(reviews,ensure_ascii=False,indent=2)+'\n');(O/'manifest.json').write_text(json.dumps({'count':len(reviews),'parts':{'1':5,'2':1,'3':2},'lessons':[{'id':a['lessonId'],'sha256':a['publishedSha256']}for a in reviews]},indent=2)+'\n')
print('Published locally',len(reviews),'page-reviewed lessons')
