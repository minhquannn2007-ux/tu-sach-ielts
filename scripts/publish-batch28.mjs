// Reviewed native adapters. Untitled-source UI labels are explicit exceptions.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import vm from 'node:vm';
const [source,cache]=process.argv.slice(2),report=JSON.parse(fs.readFileSync(path.join(source,'batch-report.json'))),review=JSON.parse(fs.readFileSync(path.join(source,'source-review.json'))),audit=JSON.parse(fs.readFileSync(path.join(source,'source-audit.json'))),complete=JSON.parse(fs.readFileSync(path.join(source,'reading-completeness.json')));
const ctx={};vm.runInNewContext(fs.readFileSync('dist/exam-data.js','utf8'),ctx);
const covers=Object.assign({},...['mass-cover-sources','batch2-cover-sources','batch3-cover-sources','batch4-cover-sources'].map(n=>JSON.parse(fs.readFileSync('import/'+n+'.json'))));
const selected={'p3-a-new-voyage-round-the-world':'sail','p3-rights-for-apes':'lab','p3-no-title-charles-darwin':'speech','p3-psychological-responses-to-mirror-images':'lab'},prepared=[];
const untitled=new Set(['p3-no-title-charles-darwin','p3-psychological-responses-to-mirror-images']);
const norm=s=>s.toLowerCase().replace(/[^a-z0-9]/g,''),existing=fs.readdirSync('dist/lessons').filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync('dist/lessons/'+f)));
for(const [job,cover] of Object.entries(selected)){
 const r=report.results.find(r=>r.job===job),v=review.find(v=>v.job===job),au=audit.find(v=>v.job===job);if(r?.status!=='ready-for-review'||!v?.fullReadingText||!v.allTasks||!complete.find(v=>v.job===job)?.fullReadingSpanMatches)throw Error('Review gate: '+job);
 const d=JSON.parse(fs.readFileSync(path.join(source,r.draft))),hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(cache,r.sourceId+'.pdf'))).digest('hex');if(hash!==v.sourceHash||hash!==d.sources[0].sha256)throw Error('Source changed');
 if(!au?.sourceEquivalent){if(!untitled.has(job)||!v.titleAbsent||!v.neutralUiTitleVerified||!d.conversion.sourceTitleAbsent||d.subtitle||d.footnotes?.length||au.issues.length!==1||au.issues[0]!=='title/subtitle/footnote')throw Error('Unexpected source mismatch: '+job);}
 if(existing.some(e=>e.id===d.id||e.part===d.part&&norm(e.title)===norm(d.title))||prepared.some(p=>p.d.id===d.id))throw Error('Duplicate: '+d.id);
 d.status='reviewed';d.cover=covers[cover];if(!d.cover)throw Error('Missing real photo');d.conversion.review={sourceText:true,titleSubtitle:true,taskPages:true,bankObjectOrder:true,date:'2026-10-15'};
 const errors=ctx.IELTSData.validate(d);if(errors.length)throw Error(job+': '+errors.join('; '));prepared.push({r,d});
}
fs.cpSync(source,'import/mass-batch-28',{recursive:true});for(const {d} of prepared)fs.writeFileSync('dist/lessons/'+d.id+'.json',JSON.stringify(d,null,2));
const reasons={'p3-flower-power':'Printed heading range says 27–32 but lists 27–33; hold for source instruction review.','p3-the-lost-animals-of-australia':'Printed MCQ range says 27–31 but includes question 32; hold for source instruction review.','p3-refraction':'Printed completion range says 36–40 but actual blanks are 33–40; hold for source instruction review.','p3-green-fingers-and-green-thoughts':'Already available as legacy bai/green_fingers_and_green_thoughts_ielts.html; do not create a duplicate structured card.'};
const jobs=JSON.parse(fs.readFileSync('import/jobs.json'));for(const j of jobs){const p=prepared.find(p=>p.r.job===j.id);if(p){Object.assign(j,{status:'reviewed',lesson_id:p.d.id,mode:'practice'});delete j.holdReason;}else if(reasons[j.id])j.holdReason=reasons[j.id];}
fs.writeFileSync('import/jobs.json',JSON.stringify(jobs,null,2));
const lessons=prepared.map(({r,d})=>({job:r.job,lessonId:d.id,title:d.title,part:d.part,sourceId:r.sourceId}));fs.writeFileSync('import/mass-published-28.json',JSON.stringify({count:lessons.length,parts:{1:0,2:0,3:4},lessons},null,2));console.log('Prepared',lessons.length);
