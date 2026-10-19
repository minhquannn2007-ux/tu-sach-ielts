// Explicit source-reviewed allowlist; no automatic approval of OCR output.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import vm from 'node:vm';
const cache=process.argv[2];if(!cache)throw Error('Pass original PDF cache path');
const source='import/mass-batch-44',approved=JSON.parse(fs.readFileSync(source+'/approved.json')),ctx={};vm.runInNewContext(fs.readFileSync('dist/exam-data.js','utf8'),ctx);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),existing=fs.readdirSync('dist/lessons').filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync('dist/lessons/'+f))),norm=s=>s.toLowerCase().replace(/[^a-z0-9]/g,''),prepared=[];
for(const a of approved){
 if(!a.reviewed||!a.allReadingParagraphs||!a.allTaskPages||!a.titleSubtitle||!a.footnotes)throw Error('Incomplete review '+a.job);
 const bytes=fs.readFileSync(source+'/drafts/'+a.job+'.json');if(hash(bytes)!==a.draftSha256)throw Error('Draft changed '+a.job);const d=JSON.parse(bytes);
 if(d.mode!=='practice'||d.key||d.id!==a.job||d.sources[0].id!==a.sourceId)throw Error('Identity/mode differs');
 if(hash(fs.readFileSync(path.join(cache,a.sourceId+'.pdf')))!==a.sourceHash||d.sources[0].sha256!==a.sourceHash)throw Error('Source changed '+a.job);
 if(a.sourceFigure&&hash(fs.readFileSync('dist/assets/discovery-of-slowness-reading-map.png'))!==a.sourceFigure.assetSha256)throw Error('Source map changed');
 if(existing.some(e=>e.id===d.id||e.part===d.part&&norm(e.title)===norm(d.title)))throw Error('Duplicate '+d.id);
 d.cover=JSON.parse(fs.readFileSync('dist/lessons/'+a.coverLesson+'.json')).cover;d.status='reviewed';d.conversion.requiresReview=false;d.conversion.review={sourceText:true,titleSubtitle:true,taskPages:true,ocrCorrections:true,footnotes:true,date:'2026-10-19'};
 const errors=ctx.IELTSData.validate(d);if(errors.length)throw Error(d.id+': '+errors.join('; '));prepared.push(d);
}
const jobs=JSON.parse(fs.readFileSync('import/jobs.json'));for(const d of prepared){const j=jobs.find(j=>j.id===d.id);if(!j)throw Error('Missing job '+d.id);Object.assign(j,{status:'reviewed',lesson_id:d.id,mode:'practice'});delete j.holdReason;fs.writeFileSync('dist/lessons/'+d.id+'.json',JSON.stringify(d,null,2)+'\n')}
fs.writeFileSync('import/jobs.json',JSON.stringify(jobs,null,2));const lessons=prepared.map(d=>({job:d.conversion.jobId,lessonId:d.id,title:d.title,part:d.part,sourceId:d.sources[0].id}));fs.writeFileSync('import/mass-published-44.json',JSON.stringify({count:lessons.length,parts:{1:0,2:5,3:3},lessons},null,2)+'\n');console.log('Prepared '+lessons.length+' approved lessons');
