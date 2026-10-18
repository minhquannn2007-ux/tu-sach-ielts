import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const [source,cache]=process.argv.slice(2);
const report=JSON.parse(fs.readFileSync(path.join(source,'batch-report.json'))),audit=JSON.parse(fs.readFileSync(path.join(source,'source-audit.json'))),complete=JSON.parse(fs.readFileSync(path.join(source,'reading-completeness.json')));
const covers=JSON.parse(fs.readFileSync('import/mass-cover-sources.json'));covers.library=JSON.parse(fs.readFileSync('dist/lessons/p2-childrens-literature.json')).cover;
const selected={'p1-undergraduate-students-guidelines-to-students-on-literature-courses-check-em-dash-toan-bai':'library','p3-travelling-plants':'wood'},prepared=[];
for(const [job,cover] of Object.entries(selected)){
 const r=report.results.find(r=>r.job===job);if(r?.status!=='ready-for-review'||!audit.find(a=>a.job===job)?.sourceEquivalent||!complete.find(a=>a.job===job)?.fullReadingSpanMatches)throw Error('Source gate: '+job);
 const d=JSON.parse(fs.readFileSync(path.join(source,r.draft))),hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(cache,r.sourceId+'.pdf'))).digest('hex');if(hash!==d.sources[0].sha256)throw Error('Changed source');
 if(fs.existsSync('dist/lessons/'+d.id+'.json'))throw Error('Duplicate');d.cover=covers[cover];d.status='reviewed';d.conversion.review={sourceText:true,titleSubtitle:true,taskPages:true,tableLayout:true,mcqBaselines:true,date:'2026-10-15'};prepared.push({r,d});
}
fs.cpSync(source,'import/mass-batch-23',{recursive:true});
for(const {d} of prepared)fs.writeFileSync('dist/lessons/'+d.id+'.json',JSON.stringify(d,null,2));
const jobs=JSON.parse(fs.readFileSync('import/jobs.json'));for(const j of jobs){const p=prepared.find(p=>p.r.job===j.id);if(p){Object.assign(j,{status:'reviewed',lesson_id:p.d.id,mode:'practice'});delete j.holdReason;}}
fs.writeFileSync('import/jobs.json',JSON.stringify(jobs,null,2));
const lessons=prepared.map(({r,d})=>({job:r.job,lessonId:d.id,title:d.title,part:d.part,sourceId:r.sourceId}));fs.writeFileSync('import/mass-published-23.json',JSON.stringify({count:lessons.length,parts:{1:1,2:0,3:1},lessons},null,2));console.log('Prepared',lessons.length);
