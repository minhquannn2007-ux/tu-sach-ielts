// Individually reviewed source scans; OCR confidence alone never approves data.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import vm from 'node:vm';
const [source,cache]=process.argv.slice(2),report=JSON.parse(fs.readFileSync(path.join(source,'batch-report.json'))),review=JSON.parse(fs.readFileSync(path.join(source,'source-review.json')));
const context={};vm.runInNewContext(fs.readFileSync('dist/exam-data.js','utf8'),context);
const covers=Object.assign({},...['mass-cover-sources','batch2-cover-sources'].map(n=>JSON.parse(fs.readFileSync('import/'+n+'.json'))));
covers.toad={asset:'assets/cane-toad-source-cover.png',alt:'Cane toad',credit:'Ảnh trong đề gốc',source:'https://drive.google.com/file/d/1UefYbSx5yIqc5N3HNJzSzIBfUnpc-P8K/view',license:'User-provided source PDF'};
const selected={'p1-the-baobaps-of-madagascar':'baobab','p1-australia-s-cane-toad-problem':'toad','p1-the-world-s-first-cities':'mesoamerica','p2-the-conquest-of-malaria-in-italy':'lab','p3-images-and-places':'trail'},prepared=[];
covers.lab=JSON.parse(fs.readFileSync('import/batch4-cover-sources.json')).lab;
for(const [job,cover] of Object.entries(selected)){
 const r=report.results.find(r=>r.job===job),v=review.find(v=>v.job===job);if(r?.status!=='ready-for-review'||!v?.reviewed||!v.allReadingParagraphs||!v.allTaskPages||!v.titleSubtitle)throw Error('Review gate: '+job);
 const d=JSON.parse(fs.readFileSync(path.join(source,r.draft))),hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(cache,r.sourceId+'.pdf'))).digest('hex');if(hash!==v.sourceHash||hash!==d.sources[0].sha256)throw Error('Source changed');
 if(fs.existsSync('dist/lessons/'+d.id+'.json')){
  if(job!=='p1-the-baobaps-of-madagascar')throw Error('Duplicate: '+d.id);
  const old=JSON.parse(fs.readFileSync('dist/lessons/'+d.id+'.json'));if(old.footnotes?.length)throw Error('Footnote already exists');
  old.footnotes=d.footnotes;old.paragraphs[0].text=old.paragraphs[0].text.replace('local Malagasy language','local Malagasy* language');old.sources.push({...d.sources[0],role:'footnote-source'});old.conversion.footnoteReview={sourceId:r.sourceId,date:'2026-10-15'};
  const errors=context.IELTSData.validate(old);if(errors.length)throw Error(errors.join('; '));prepared.push({r,d:old,updated:true});continue;
 }
 d.status='reviewed';d.cover=covers[cover];if(!d.cover)throw Error('Missing real photo');d.conversion.review={sourceText:true,titleSubtitle:true,taskPages:true,ocrCorrections:true,noteLayout:true,footnotes:true,date:'2026-10-15'};
 const errors=context.IELTSData.validate(d);if(errors.length)throw Error(job+': '+errors.join('; '));prepared.push({r,d});
}
fs.cpSync(source,'import/mass-batch-25',{recursive:true});for(const {d} of prepared)fs.writeFileSync('dist/lessons/'+d.id+'.json',JSON.stringify(d,null,2));
const jobs=JSON.parse(fs.readFileSync('import/jobs.json'));for(const j of jobs){const p=prepared.find(p=>p.r.job===j.id);if(p){Object.assign(j,{status:'reviewed',lesson_id:p.d.id,mode:'practice'});if(p.updated)j.duplicate_of=p.d.id;delete j.holdReason;}}
fs.writeFileSync('import/jobs.json',JSON.stringify(jobs,null,2));
const metadata=({r,d})=>({job:r.job,lessonId:d.id,title:d.title,part:d.part,sourceId:r.sourceId}),lessons=prepared.filter(p=>!p.updated).map(metadata),updatedLessons=prepared.filter(p=>p.updated).map(metadata);fs.writeFileSync('import/mass-published-25.json',JSON.stringify({count:lessons.length,parts:{1:2,2:1,3:1},lessons,updatedLessons},null,2));console.log('Prepared',lessons.length,'new;',updatedLessons.length,'footnote repair');
