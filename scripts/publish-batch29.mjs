// Exact reviewed source scans; duplicate, source hash and schema gates.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import vm from 'node:vm';
const [source,cache]=process.argv.slice(2),report=JSON.parse(fs.readFileSync(path.join(source,'batch-report.json'))),review=JSON.parse(fs.readFileSync(path.join(source,'source-review.json')));
const ctx={};vm.runInNewContext(fs.readFileSync('dist/exam-data.js','utf8'),ctx);
const covers=Object.assign({},...['mass-cover-sources','batch2-cover-sources','batch3-cover-sources','batch4-cover-sources'].map(n=>JSON.parse(fs.readFileSync('import/'+n+'.json'))));
const selected={'p1-looking-skyward':'plane','p1-what-is-the-secret-of-a-long-life':'lab','p1-traditional-maori-medicine':'orchid','p1-sydney-opera-house':'opera','p1-investing-in-the-future':'math','p1-gobekli-tepe-a-remarkable-discovery':'ruins','p1-the-importance-of-business-cards':'code','p1-an-important-language-development':'map','p1-the-extinction-of-the-cave-bear':'dinosaur','p1-developmental-tasks-of-normal-adolescence':'speech'},prepared=[];
const norm=s=>s.toLowerCase().replace(/[^a-z0-9]/g,''),existing=fs.readdirSync('dist/lessons').filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync('dist/lessons/'+f)));
for(const [job,cover] of Object.entries(selected)){
 const r=report.results.find(r=>r.job===job),v=review.find(v=>v.job===job);if(r?.status!=='ready-for-review'||!v?.reviewed||!v.allReadingParagraphs||!v.allTaskPages||!v.titleSubtitle)throw Error('Review gate: '+job);
 const d=JSON.parse(fs.readFileSync(path.join(source,r.draft))),hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(cache,r.sourceId+'.pdf'))).digest('hex');if(hash!==v.sourceHash||hash!==d.sources[0].sha256)throw Error('Source changed');
 if(existing.some(e=>e.id===d.id||e.part===d.part&&norm(e.title)===norm(d.title))||prepared.some(p=>p.d.id===d.id))throw Error('Duplicate: '+d.id);
 d.status='reviewed';d.cover=covers[cover];if(!d.cover)throw Error('Missing real photo');d.conversion.review={sourceText:true,titleSubtitle:true,taskPages:true,ocrCorrections:true,footnotes:true,date:'2026-10-15'};
 const errors=ctx.IELTSData.validate(d);if(errors.length)throw Error(job+': '+errors.join('; '));prepared.push({r,d});
}
fs.cpSync(source,'import/mass-batch-29',{recursive:true});for(const {d} of prepared)fs.writeFileSync('dist/lessons/'+d.id+'.json',JSON.stringify(d,null,2));
const jobs=JSON.parse(fs.readFileSync('import/jobs.json'));for(const j of jobs){const p=prepared.find(p=>p.r.job===j.id);if(p){Object.assign(j,{status:'reviewed',lesson_id:p.d.id,mode:'practice'});delete j.holdReason;}}
fs.writeFileSync('import/jobs.json',JSON.stringify(jobs,null,2));
const lessons=prepared.map(({r,d})=>({job:r.job,lessonId:d.id,title:d.title,part:d.part,sourceId:r.sourceId}));fs.writeFileSync('import/mass-published-29.json',JSON.stringify({count:lessons.length,parts:{1:10,2:0,3:0},lessons},null,2));console.log('Prepared',lessons.length);
