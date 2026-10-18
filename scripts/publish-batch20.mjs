// Explicit PDF-reviewed import; structural success alone never approves a draft.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const [source,cache]=process.argv.slice(2);
if(!source||!cache)throw Error('Provide batch and PDF cache');
const report=JSON.parse(fs.readFileSync(path.join(source,'batch-report.json')));
const audit=JSON.parse(fs.readFileSync(path.join(source,'source-audit.json')));
const covers=Object.assign({},...['mass-cover-sources','batch2-cover-sources','batch4-cover-sources'].map(n=>JSON.parse(fs.readFileSync('import/'+n+'.json'))));
covers.library=JSON.parse(fs.readFileSync('dist/lessons/p2-childrens-literature.json')).cover;
const selected={
 'p1-a-brome-lives-on-how-a-british-grass-escaped-extinction':'corn',
 'p1-buried-cities-of-the-amazon-rainforest-chua-rep':'ruins',
 'p1-sweet-trouble-list-of-people-chua-center-so-cau-mcq-chua-thang-hang':'corn',
 'p1-temperature-rising':'ice',
 'p1-transport-and-transport-systems-during-the-roman-empire':'ruins',
 'p1-under-the-skin-of-a-great-violin':'piano',
 'p1-what-do-managers-really-do':'speech',
 'p2-brains-trust-learning-about-ourselves':'lab',
 'p2-surviving-the-winter-hibernation-and-other-resting-states':'dream',
 'p2-the-fascinating-world-of-attine-ants-chua-rep':'ants',
 'p3-changes-to-the-soviet-union-s-working-week':'concrete',
 'p3-does-class-size-matter':'library',
 'p3-insect-inspired-robots':'ants',
 'p3-saving-languages':'speech'
};
const prepared=[];
for(const [job,cover] of Object.entries(selected)){
 const r=report.results.find(r=>r.job===job);
 if(r?.status!=='ready-for-review'||!audit.find(a=>a.job===job)?.sourceEquivalent)throw Error('Source gate: '+job);
 const d=JSON.parse(fs.readFileSync(path.join(source,r.draft)));
 const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(cache,r.sourceId+'.pdf'))).digest('hex');
 if(hash!==d.sources[0].sha256)throw Error('Changed source: '+job);
 if(job==='p1-temperature-rising'){
  d.subtitle=d.title;d.title='TEMPERATURE RISING';d.id='p1-temperature-rising';
  d.paragraphs=d.paragraphs.map(p=>({...p,text:p.text.replace(/^TEMPERATURE RISING\s+/,'')}));
  d.conversion.visualTitleVerified=true;
 }
 if(fs.existsSync('dist/lessons/'+d.id+'.json'))throw Error('Duplicate '+d.id);
 for(const g of d.groups)if(g.noteLayout)g.noteLayout.sourceVerified=true;
 d.cover=covers[cover];d.status='reviewed';d.conversion.sourceParagraphCount=d.paragraphs.length;
 d.conversion.review={sourceText:true,titleSubtitle:true,taskPages:true,noteLayout:true,date:'2026-10-15'};
 prepared.push({r,d});
}
fs.cpSync(source,'import/mass-batch-20',{recursive:true});
for(const {d} of prepared)fs.writeFileSync('dist/lessons/'+d.id+'.json',JSON.stringify(d,null,2));
const jobs=JSON.parse(fs.readFileSync('import/jobs.json'));
for(const j of jobs){const p=prepared.find(p=>p.r.job===j.id);if(p){Object.assign(j,{status:'reviewed',lesson_id:p.d.id,mode:'practice'});delete j.holdReason;}if(j.id==='p1-the-life-of-louis-braille')j.holdReason='Source notes are headed The characteristics of the camel, unrelated to the Louis Braille content; requires corrected source title.';}
fs.writeFileSync('import/jobs.json',JSON.stringify(jobs,null,2));
const lessons=prepared.map(({r,d})=>({job:r.job,lessonId:d.id,title:d.title,part:d.part,sourceId:r.sourceId}));
const parts=Object.fromEntries([1,2,3].map(p=>[p,lessons.filter(d=>d.part===p).length]));
fs.writeFileSync('import/mass-published-20.json',JSON.stringify({count:lessons.length,parts,lessons},null,2));
console.log(JSON.stringify({prepared:lessons.length,parts}));
