// Explicit source-reviewed selection; never publish all structurally valid drafts.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const [source,cache]=process.argv.slice(2);
if(!source||!cache)throw Error('Provide private batch and PDF cache directories');
const report=JSON.parse(fs.readFileSync(path.join(source,'batch-report.json')));
const audit=JSON.parse(fs.readFileSync(path.join(source,'source-audit.json')));
const covers=Object.assign({},...['mass-cover-sources','batch2-cover-sources','batch4-cover-sources'].map(n=>JSON.parse(fs.readFileSync('import/'+n+'.json'))));
covers.library=JSON.parse(fs.readFileSync('dist/lessons/p2-childrens-literature.json')).cover;
const selected={
 'p1-back-to-their-roots':'orchid',
 'p1-food-flavor':'canned',
 'p1-john-st-clair-kilby-inventor-of-the-integrated-circuit':'lab',
 'p1-rags-to-riches':'lab',
 'p2-emotional-development-in-babies':'library',
 'p2-growing-food-in-cities':'cabbage',
 'p2-how-do-plants-talk-to-each-other':'orchid',
 'p2-how-well-do-people-concentrate':'lab',
 'p2-new-businesses-in-new-zealand':'concrete',
 'p2-parental-involvement-programmes-in-education-a-review-of-the-literature':'library',
 'p2-the-development-of-humour-in-children':'library',
 'p3-research-into-the-effects-of-different-teaching-styles':'library',
 'p3-the-hazards-of-multitasking':'lab',
 'p3-youth-homelessness':'concrete'
};
const prepared=[];
for(const [job,cover] of Object.entries(selected)){
 const r=report.results.find(r=>r.job===job);
 if(r?.status!=='ready-for-review'||!audit.find(a=>a.job===job)?.sourceEquivalent)throw Error('Source gate failed: '+job);
 const d=JSON.parse(fs.readFileSync(path.join(source,r.draft)));
 const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(cache,r.sourceId+'.pdf'))).digest('hex');
 if(hash!==d.sources[0].sha256)throw Error('Changed source: '+job);
 if(fs.existsSync('dist/lessons/'+d.id+'.json'))throw Error('Duplicate: '+d.id);
 if(job==='p1-food-flavor'){
  const headings=['Sense of taste','Flavor in previous centuries','Humans versus machines','Color and taste','Food ingredients','The North American flavor industry'];
  d.paragraphs=d.paragraphs.flatMap(p=>{
   const h=headings.find(h=>p.text.startsWith(h+' '));
   return h?[{text:h,heading:true},{text:p.text.slice(h.length+1)}]:[p];
  });
 }
 if(job==='p2-parental-involvement-programmes-in-education-a-review-of-the-literature'){
  d.paragraphs=d.paragraphs.flatMap(p=>{
   if(!p.text.startsWith('Parental participation might take place through:'))return [p];
   const boundary='The business of enhancing parental participation';
   const pos=p.text.indexOf(boundary);if(pos<0)throw Error('Missing reviewed bullet boundary');
   return [...p.text.slice(0,pos).split('•').map((t,i)=>({text:(i?'• ':'')+t.trim()})),{text:p.text.slice(pos)}];
  });
 }
 for(const g of d.groups)if(g.noteLayout)g.noteLayout.sourceVerified=true;
 d.status='reviewed';d.cover=covers[cover];d.conversion.sourceParagraphCount=d.paragraphs.length;
 d.conversion.review={sourceText:true,titleSubtitle:true,taskPages:true,noteLayout:true,date:'2026-10-15'};
 prepared.push({r,d});
}
fs.cpSync(source,'import/mass-batch-19',{recursive:true});
for(const {d} of prepared)fs.writeFileSync('dist/lessons/'+d.id+'.json',JSON.stringify(d,null,2));
const jobs=JSON.parse(fs.readFileSync('import/jobs.json'));
for(const j of jobs){
 const p=prepared.find(p=>p.r.job===j.id);
 if(p){Object.assign(j,{status:'reviewed',lesson_id:p.d.id,mode:'practice'});delete j.holdReason;}
 if(j.id==='p2-public-art-programs-research-update')j.holdReason='Source Q20–23 concern willpower/self-control experiments, unrelated to the art participation reading; compare alternate corrected source before publication.';
}
fs.writeFileSync('import/jobs.json',JSON.stringify(jobs,null,2));
const lessons=prepared.map(({r,d})=>({job:r.job,lessonId:d.id,title:d.title,part:d.part,sourceId:r.sourceId}));
const parts=Object.fromEntries([1,2,3].map(p=>[p,lessons.filter(d=>d.part===p).length]));
fs.writeFileSync('import/mass-published-19.json',JSON.stringify({count:lessons.length,lessons,parts},null,2));
console.log(JSON.stringify({prepared:lessons.length,parts}));
