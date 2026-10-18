// Exact reviewed source scans; duplicate, source hash and schema gates.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import vm from 'node:vm';
const [source,cache]=process.argv.slice(2),report=JSON.parse(fs.readFileSync(path.join(source,'batch-report.json'))),review=JSON.parse(fs.readFileSync(path.join(source,'source-review.json')));
const ctx={};vm.runInNewContext(fs.readFileSync('dist/exam-data.js','utf8'),ctx);
const covers=Object.assign({},...['mass-cover-sources','batch2-cover-sources','batch3-cover-sources','batch4-cover-sources'].map(n=>JSON.parse(fs.readFileSync('import/'+n+'.json'))));
const selected={"p1-barrels": "wood", "p1-the-treadle-pump": "corn", "p1-a-watchful-eye-on-bridges": "concrete", "p1-practical-action": "rail", "p1-tikopia": "palm", "p1-the-origins-of-cinema": "code", "p1-ancient-greek-coins": "ruins", "p1-the-history-of-cakes-at-wedding": "doughnut", "p1-the-olympic-torch-chua-rep": "tennis", "p1-the-tyne-bridge": "concrete", "p2-lake-bosumtwi-the-secrets-of-a-crater-lake": "canyon", "p2-roller-coaster-the-great-fairground-attraction": "rail", "p3-patterns-of-nature": "ants", "p3-movement-underwater": "seaweed", "p3-termite-mounds": "ants", "p3-the-secret-sounds-of-elephants": "giraffe"},prepared=[];
for(const d of JSON.parse(fs.readFileSync('dist/lesson-catalog.json')))if(d.cover?.asset?.includes('giraffe'))covers.giraffe=d.cover;
const norm=s=>s.toLowerCase().replace(/[^a-z0-9]/g,''),existing=fs.readdirSync('dist/lessons').filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync('dist/lessons/'+f)));
for(const [job,cover] of Object.entries(selected)){
 const r=report.results.find(r=>r.job===job),v=review.find(v=>v.job===job);if(r?.status!=='ready-for-review'||!v?.reviewed||!v.allReadingParagraphs||!v.allTaskPages||!v.titleSubtitle)throw Error('Review gate: '+job);
 const d=JSON.parse(fs.readFileSync(path.join(source,r.draft))),hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(cache,r.sourceId+'.pdf'))).digest('hex');if(hash!==v.sourceHash||hash!==d.sources[0].sha256)throw Error('Source changed');
 if(existing.some(e=>e.id===d.id||e.part===d.part&&norm(e.title)===norm(d.title))||prepared.some(p=>p.d.id===d.id))throw Error('Duplicate: '+d.id);
 for(const s of d.sources){const bytes=fs.readFileSync(path.join(cache,s.id+'.pdf'));if(crypto.createHash('sha256').update(bytes).digest('hex')!==s.sha256)throw Error('Auxiliary source changed: '+s.id)}
 d.status='reviewed';d.cover=covers[cover];if(!d.cover)throw Error('Missing real photo');d.conversion.review={sourceText:true,titleSubtitle:true,taskPages:true,ocrCorrections:true,footnotes:true,date:'2026-10-15'};
 const errors=ctx.IELTSData.validate(d);if(errors.length)throw Error(job+': '+errors.join('; '));prepared.push({r,d});
}
fs.cpSync(source,'import/mass-batch-33',{recursive:true});for(const {d} of prepared)fs.writeFileSync('dist/lessons/'+d.id+'.json',JSON.stringify(d,null,2));
const jobs=JSON.parse(fs.readFileSync('import/jobs.json'));for(const j of jobs){const p=prepared.find(p=>p.r.job===j.id);if(p){Object.assign(j,{status:'reviewed',lesson_id:p.d.id,mode:'practice'});delete j.holdReason;}}
const alias=jobs.find(j=>j.id==='p3-termite-mounds-chua-rep');if(alias){Object.assign(alias,{status:'reviewed',lesson_id:'p3-termite-mounds',mode:'practice',duplicateOf:'p3-termite-mounds'});delete alias.holdReason;}
fs.writeFileSync('import/jobs.json',JSON.stringify(jobs,null,2));
const lessons=prepared.map(({r,d})=>({job:r.job,lessonId:d.id,title:d.title,part:d.part,sourceId:r.sourceId}));fs.writeFileSync('import/mass-published-33.json',JSON.stringify({count:lessons.length,parts:{1:10,2:2,3:4},lessons},null,2));console.log('Prepared',lessons.length);
