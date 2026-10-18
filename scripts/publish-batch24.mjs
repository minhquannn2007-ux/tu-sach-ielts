// Explicitly reviewed scan sources only. Never treats OCR confidence as approval.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import vm from 'node:vm';
const [source,cache]=process.argv.slice(2),report=JSON.parse(fs.readFileSync(path.join(source,'batch-report.json'))),review=JSON.parse(fs.readFileSync(path.join(source,'source-review.json')));
const context={};vm.runInNewContext(fs.readFileSync('dist/exam-data.js','utf8'),context);
const covers=Object.assign({},...['mass-cover-sources','batch2-cover-sources'].map(n=>JSON.parse(fs.readFileSync('import/'+n+'.json'))));
const selected={'p1-advertising-needs-attention':'clothes','p1-bondi-chua-go':'sail','p1-using-video-diaries-to-collect-data-from-children':'speech','p3-child-s-play-in-medieval-england':'ballet'},prepared=[];
for(const [job,cover] of Object.entries(selected)){
 const r=report.results.find(r=>r.job===job),v=review.find(v=>v.job===job);if(r?.status!=='ready-for-review'||!v?.reviewed||!v.allReadingParagraphs||!v.allTaskPages||!v.titleSubtitle)throw Error('Review gate: '+job);
 const d=JSON.parse(fs.readFileSync(path.join(source,r.draft))),hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(cache,r.sourceId+'.pdf'))).digest('hex');if(hash!==v.sourceHash||hash!==d.sources[0].sha256)throw Error('Source changed');
 if(fs.existsSync('dist/lessons/'+d.id+'.json'))throw Error('Duplicate: '+d.id);
 d.status='reviewed';d.cover=covers[cover];if(!d.cover)throw Error('Missing real photo');d.conversion.review={sourceText:true,titleSubtitle:true,taskPages:true,ocrCorrections:true,noteLayout:true,date:'2026-10-15'};
 const errors=context.IELTSData.validate(d);if(errors.length)throw Error(job+': '+errors.join('; '));prepared.push({r,d});
}
fs.cpSync(source,'import/mass-batch-24',{recursive:true});for(const {d} of prepared)fs.writeFileSync('dist/lessons/'+d.id+'.json',JSON.stringify(d,null,2));
const jobs=JSON.parse(fs.readFileSync('import/jobs.json'));for(const j of jobs){const p=prepared.find(p=>p.r.job===j.id);if(p){Object.assign(j,{status:'reviewed',lesson_id:p.d.id,mode:'practice'});delete j.holdReason;}}
fs.writeFileSync('import/jobs.json',JSON.stringify(jobs,null,2));
const lessons=prepared.map(({r,d})=>({job:r.job,lessonId:d.id,title:d.title,part:d.part,sourceId:r.sourceId}));fs.writeFileSync('import/mass-published-24.json',JSON.stringify({count:lessons.length,parts:{1:3,2:0,3:1},lessons},null,2));console.log('Prepared',lessons.length);
