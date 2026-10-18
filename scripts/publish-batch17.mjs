// Explicit source-reviewed batch; never approve other converter drafts.
import fs from 'node:fs';
import crypto from 'node:crypto';
const batch='import/converter-3.17';
const covers=Object.assign({},...['mass-cover-sources','batch2-cover-sources','batch3-cover-sources','batch4-cover-sources'].map(n=>JSON.parse(fs.readFileSync('import/'+n+'.json'))));
const selection={
 'p3-a-most-unusual-theatre':'opera',
 'p3-art-based-training-for-engineers':'lab',
 'p3-brain-makeover':'lab',
 'p3-can-business-learn-from-computer-games':'code',
 'p3-children-s-literature-studies-today':'speech',
 'p3-how-scientists-see-science':'lab',
 'p3-linguistic-diversity':'speech',
 'p3-mark-sumner-of-the-university-of-leeds-explains-the-challenges-facing-the-fashion-industry':'clothes',
 'p3-new-insights-into-keeping-our-brains-agile-with-age':'lab',
 'p3-science-and-filmmaking':'opera',
 'p3-the-booming-business-of-nation-branding-chua-rep':'map',
 'p3-the-long-road-to-artificial-intelligence':'code',
 'p3-the-wooden-huts-of-antarctica':'ice',
 'p3-there-s-no-place-like-home':'tennis'
};
const reports=JSON.parse(fs.readFileSync(batch+'/batch-report.json')).results;
const audits=JSON.parse(fs.readFileSync(batch+'/source-audit.json'));
const lessons=[];
for(const [job,cover] of Object.entries(selection)){
 const r=reports.find(r=>r.job===job);
 if(r?.status!=='ready-for-review'||!audits.find(a=>a.job===job)?.sourceEquivalent)throw Error('Missing source gate: '+job);
 const d=JSON.parse(fs.readFileSync(batch+'/'+r.draft));
 const bytes=fs.readFileSync('/workspace/scratch/319b467ab6bd/bulk-cache/'+r.sourceId+'.pdf');
 if(crypto.createHash('sha256').update(bytes).digest('hex')!==d.sources[0].sha256)throw Error('Changed source: '+job);
 const destination='dist/lessons/'+d.id+'.json';
 if(fs.existsSync(destination))throw Error('Already published: '+d.id);
 d.cover=covers[cover];d.status='reviewed';
 d.conversion.review={sourceText:true,titleSubtitle:true,taskPages:true,layout:true,date:'2026-10-14'};
 fs.writeFileSync(destination,JSON.stringify(d,null,2));
 lessons.push({job,lessonId:d.id,title:d.title,part:3,sourceId:r.sourceId});
}
const jobs=JSON.parse(fs.readFileSync('import/jobs.json'));
for(const j of jobs){const r=lessons.find(r=>r.job===j.id);if(r)Object.assign(j,{status:'reviewed',lesson_id:r.lessonId,mode:'practice'});}
fs.writeFileSync('import/jobs.json',JSON.stringify(jobs,null,2));
fs.writeFileSync('import/mass-published-17.json',JSON.stringify({count:lessons.length,lessons,parts:{3:lessons.length}},null,2));
console.log('Added '+lessons.length+' source-reviewed Passage 3 lessons.');
