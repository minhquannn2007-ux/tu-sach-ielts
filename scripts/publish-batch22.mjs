// Reviewed native PDFs with blank end sheets; exclude corrupted source pages.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const [source,cache]=process.argv.slice(2);if(!source||!cache)throw Error('Provide batch and source cache');
const report=JSON.parse(fs.readFileSync(path.join(source,'batch-report.json'))),audit=JSON.parse(fs.readFileSync(path.join(source,'source-audit.json')));
const covers=Object.assign({},...['mass-cover-sources','batch2-cover-sources','batch3-cover-sources','batch4-cover-sources'].map(n=>JSON.parse(fs.readFileSync('import/'+n+'.json'))));covers.library=JSON.parse(fs.readFileSync('dist/lessons/p2-childrens-literature.json')).cover;
const selected={
 'p1-hormones':'lab','p1-mystery-drawing':'ballet','p1-the-origins-of-rodeo-a-competitive-sport':'horse',
 'p2-capability-brown':'orchid','p2-teamwork':'speech','p2-the-impact-of-sports-tourism-on-urban-areas':'tennis',
 'p3-animals-predicting-earthquakes-chua-rep':'horse','p3-architecture-in-britain':'concrete',
 'p3-bright-sparks':'library','p3-crossing-the-threshold':'ballet','p3-decisions-decisions':'lab',
 'p3-how-did-music-begin':'piano','p3-lets-all-be-friends':'speech','p3-manage-your-energy-not-your-time':'lab',
 'p3-multi-purpose-meeting-spaces':'concrete','p3-rebranding-art-museums':'ballet','p3-the-animal-connection-chua-rep':'horse',
 'p3-the-costs-of-brand-loyalty':'cook','p3-the-dark-side-of-the-technological-boom':'code',
 'p3-the-geography-of-taste-buds':'cook','p3-the-new-zealand-writer-margaret-mahy':'library',
 'p3-the-strange-world-of-sight':'lab','p3-what-is-social-history':'map'
};
const prepared=[];
for(const [job,cover] of Object.entries(selected)){
 const r=report.results.find(r=>r.job===job);if(r?.status!=='ready-for-review'||!audit.find(a=>a.job===job)?.sourceEquivalent)throw Error('Source gate: '+job);
 const d=JSON.parse(fs.readFileSync(path.join(source,r.draft)));
 const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(cache,r.sourceId+'.pdf'))).digest('hex');if(hash!==d.sources[0].sha256)throw Error('Changed source: '+job);
 if(job==='p3-the-costs-of-brand-loyalty'){d.title='The cost of brand loyalty';d.id='p3-the-cost-of-brand-loyalty';d.conversion.visualTitleVerified=true;}
 if(job==='p3-manage-your-energy-not-your-time'){
  const headings=['The Body','The Emotions','The Mind','The Spirit','A New Focus'];
  d.paragraphs=d.paragraphs.flatMap(p=>{const h=headings.find(h=>p.text.startsWith(h+' '));return h?[{text:h,heading:true},{text:p.text.slice(h.length+1)}]:[p]});
 }
 if(fs.existsSync('dist/lessons/'+d.id+'.json'))throw Error('Duplicate: '+d.id);
 for(const g of d.groups)if(g.noteLayout)g.noteLayout.sourceVerified=true;
 d.cover=covers[cover];d.status='reviewed';d.conversion.sourceParagraphCount=d.paragraphs.length;
 d.conversion.review={sourceText:true,titleSubtitle:true,taskPages:true,noteLayout:true,blankFinalSheet:true,date:'2026-10-15'};prepared.push({r,d});
}
fs.cpSync(source,'import/mass-batch-22',{recursive:true});
for(const {d} of prepared)fs.writeFileSync('dist/lessons/'+d.id+'.json',JSON.stringify(d,null,2));
const jobs=JSON.parse(fs.readFileSync('import/jobs.json'));
for(const j of jobs){const p=prepared.find(p=>p.r.job===j.id);if(p){Object.assign(j,{status:'reviewed',lesson_id:p.d.id,mode:'practice'});delete j.holdReason;}if(j.id==='p2-what-kind-of-structure-will-make-living-in-space-comfortable-for-us')j.holdReason='Source PDF has broken font/xref objects on both question pages; readable text extraction is not sufficient evidence of correct question content. Hold for a readable alternate source.';}
fs.writeFileSync('import/jobs.json',JSON.stringify(jobs,null,2));
const lessons=prepared.map(({r,d})=>({job:r.job,lessonId:d.id,title:d.title,part:d.part,sourceId:r.sourceId})),parts=Object.fromEntries([1,2,3].map(p=>[p,lessons.filter(d=>d.part===p).length]));
fs.writeFileSync('import/mass-published-22.json',JSON.stringify({count:lessons.length,parts,lessons},null,2));console.log(JSON.stringify({prepared:lessons.length,parts}));
