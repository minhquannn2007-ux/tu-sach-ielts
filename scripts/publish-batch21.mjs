// Only the eleven PDF-reviewed lessons below may enter the public catalog.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const [source,cache]=process.argv.slice(2);if(!source||!cache)throw Error('Provide batch and source cache');
const report=JSON.parse(fs.readFileSync(path.join(source,'batch-report.json'))),audit=JSON.parse(fs.readFileSync(path.join(source,'source-audit.json')));
const covers=Object.assign({},...['mass-cover-sources','batch2-cover-sources','batch4-cover-sources'].map(n=>JSON.parse(fs.readFileSync('import/'+n+'.json'))));
covers.library=JSON.parse(fs.readFileSync('dist/lessons/p2-childrens-literature.json')).cover;
const selected={
 'p1-conquering-the-south-pole':'ice',
 'p1-the-history-of-the-guitar-chua-rep':'piano',
 'p1-the-slow-food-organization':'cook',
 'p1-the-story-of-the-railroad':'rail',
 'p2-how-dental-health-is-threatened':'lab',
 'p2-japanese-bizen-art-that-rose-from-the-ashes':'glass',
 'p2-the-humble-houseplant-an-aid-for-health-and-cleanliness':'orchid',
 'p2-the-origins-of-scottish-brochs':'ruins',
 'p3-a-digital-cinema-of-the-mind':'ballet',
 'p3-how-should-reading-be-taught':'library',
 'p3-the-accidental-scientist':'lab'
};
const prepared=[];
for(const [job,cover] of Object.entries(selected)){
 const r=report.results.find(r=>r.job===job);if(r?.status!=='ready-for-review'||!audit.find(a=>a.job===job)?.sourceEquivalent)throw Error('Source gate: '+job);
 const d=JSON.parse(fs.readFileSync(path.join(source,r.draft)));
 const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(cache,r.sourceId+'.pdf'))).digest('hex');if(hash!==d.sources[0].sha256)throw Error('Changed source: '+job);
 if(fs.existsSync('dist/lessons/'+d.id+'.json'))throw Error('Duplicate: '+d.id);
 if(job==='p1-the-story-of-the-railroad'){
  const headings=['Early Developments','Modern Train Systems'];d.paragraphs=d.paragraphs.flatMap(p=>{const h=headings.find(h=>p.text.startsWith(h+' '));return h?[{text:h,heading:true},{text:p.text.slice(h.length+1)}]:[p]});
 }
 d.status='reviewed';d.cover=covers[cover];d.conversion.sourceParagraphCount=d.paragraphs.length;d.conversion.review={sourceText:true,titleSubtitle:true,taskPages:true,tableLayout:true,date:'2026-10-15'};prepared.push({r,d});
}
fs.cpSync(source,'import/mass-batch-21',{recursive:true});
for(const {d} of prepared)fs.writeFileSync('dist/lessons/'+d.id+'.json',JSON.stringify(d,null,2));
const jobs=JSON.parse(fs.readFileSync('import/jobs.json'));
for(const j of jobs){const p=prepared.find(p=>p.r.job===j.id);if(p){Object.assign(j,{status:'reviewed',lesson_id:p.d.id,mode:'practice'});delete j.holdReason;}}
fs.writeFileSync('import/jobs.json',JSON.stringify(jobs,null,2));
const lessons=prepared.map(({r,d})=>({job:r.job,lessonId:d.id,title:d.title,part:d.part,sourceId:r.sourceId})),parts=Object.fromEntries([1,2,3].map(p=>[p,lessons.filter(d=>d.part===p).length]));
fs.writeFileSync('import/mass-published-21.json',JSON.stringify({count:lessons.length,parts,lessons},null,2));console.log(JSON.stringify({prepared:lessons.length,parts}));
