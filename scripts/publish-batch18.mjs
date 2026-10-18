// Only the six PDF-reviewed lessons below are eligible for this batch.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const source=process.argv[2],cache=process.argv[3];
if(!source||!cache)throw Error('Provide private batch and PDF cache directories');
const report=JSON.parse(fs.readFileSync(path.join(source,'batch-report.json')));
const audit=JSON.parse(fs.readFileSync(path.join(source,'source-audit.json')));
const covers=Object.assign({},...['mass-cover-sources','batch2-cover-sources','batch4-cover-sources'].map(n=>JSON.parse(fs.readFileSync('import/'+n+'.json'))));
const selected={
 'p3-a-history-of-pirates':'sail',
 'p3-an-introduction-to-a-new-collection-of-ted-hughes-s-poem':'map',
 'p3-beauty':'ballet',
 'p3-new-zealand-short-stories':'map',
 'p3-self-perceptions':'lab',
 'p3-what-makes-us-human':'lab'
};
const prepared=[];
for(const [job,cover] of Object.entries(selected)){
 const r=report.results.find(r=>r.job===job);
 if(r?.status!=='ready-for-review'||!audit.find(a=>a.job===job)?.sourceEquivalent)throw Error('Source gate failed: '+job);
 const d=JSON.parse(fs.readFileSync(path.join(source,r.draft)));
 const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(cache,r.sourceId+'.pdf'))).digest('hex');
 if(hash!==d.sources[0].sha256)throw Error('Changed source: '+job);
 if(job==='p3-an-introduction-to-a-new-collection-of-ted-hughes-s-poem'){
  d.title='An introduction to a new collection of Ted Hughes’s* poems';
  d.id='p3-an-introduction-to-a-new-collection-of-ted-hughes-s-poems';delete d.subtitle;
 }
 if(fs.existsSync('dist/lessons/'+d.id+'.json'))throw Error('Duplicate: '+d.id);
 d.status='reviewed';d.cover=covers[cover];d.conversion.review={sourceText:true,titleSubtitle:true,taskPages:true,date:'2026-10-15'};
 prepared.push({r,d});
}
fs.cpSync(source,'import/mass-batch-18',{recursive:true});
for(const {r,d} of prepared)fs.writeFileSync('dist/lessons/'+d.id+'.json',JSON.stringify(d,null,2));
const jobs=JSON.parse(fs.readFileSync('import/jobs.json'));
for(const j of jobs){const p=prepared.find(p=>p.r.job===j.id);if(p)Object.assign(j,{status:'reviewed',lesson_id:p.d.id,mode:'practice'});}
fs.writeFileSync('import/jobs.json',JSON.stringify(jobs,null,2));
const lessons=prepared.map(({r,d})=>({job:r.job,lessonId:d.id,title:d.title,part:3,sourceId:r.sourceId}));
fs.writeFileSync('import/mass-published-18.json',JSON.stringify({count:lessons.length,lessons,parts:{3:lessons.length}},null,2));
console.log('Published data prepared for '+lessons.length+' Passage 3 lessons.');
