import fs from 'node:fs';import vm from 'node:vm';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const ctx={crypto:crypto.webcrypto,TextEncoder,Uint8Array};vm.runInNewContext(fs.readFileSync('dist/exam-data.js','utf8'),ctx);const G=ctx.IELTSGrading;
const keys=JSON.parse(fs.readFileSync('dist/answer-keys.json'));
for(const [id,s] of Object.entries(keys)){
 const d=JSON.parse(fs.readFileSync('dist/lessons/'+id+'.json')),ns=d.groups.flatMap(ctx.IELTSData.numbers).sort((a,b)=>a-b),v=ns.map(n=>s.answers[n].accepted[0]);
 assert(await G.verify(d,s));const slots={};for(const g of d.groups)for(const q of g.questions||[])if(q.slots>1)slots[q.n]=s.answers[q.n].accepted[0].split(' ');const result=G.grade(d,v,s.answers,slots);assert.equal(result.score,ns.length,id);assert.equal(G.grade(d,ns.map(()=>''),s.answers).score,0);
 const changed=structuredClone(d);changed.paragraphs[0].text+=' Changed.';assert.equal(await G.verify(changed,s),false,'changed passage must disable grading');
 const changedTask=structuredClone(d);changedTask.groups[0].sourceInstructions+=' Changed.';assert.equal(await G.verify(changedTask,s),false,'changed question must disable grading');
 const noEvidence=structuredClone(s);noEvidence.answers[ns[0]].evidence[0].quote='Invented evidence';assert(G.validate(d,noEvidence).length);
}
const id='p2-the-problem-with-aiming-for-average',d=JSON.parse(fs.readFileSync('dist/lessons/'+id+'.json')),key=keys[id].answers,start=14;
function trial(a,b){const v=Array(13).fill('');v[21-start]=a;v[22-start]=b;return G.grade(d,v,key).rows.filter(r=>r.n===21||r.n===22)}
assert.equal(trial('E','B').filter(r=>r.correct).length,2,'order independent');
assert.equal(trial('B','B').filter(r=>r.correct).length,1,'no duplicate credit');
let rows=trial('D','B');assert.equal(rows.filter(r=>r.correct).length,1);assert.equal(rows.find(r=>!r.correct).answer,d.groups[1].options.find(o=>o.value==='E').text,'show only the missing correct choice');
assert(trial('','').every(r=>!r.correct));
assert.equal(G.normal('  HELLO   World '),'hello world');assert.notEqual(G.normal('word!'),G.normal('word'),'do not erase meaningful spelling differences');
const fixture={id:'fixture',part:1,groups:[{type:'notes',questions:[{n:1,slots:2}]}]},pair={1:{accepted:['red green'],slots:[['red'],['green']]}};
assert.equal(G.grade(fixture,['red green'],pair,{1:['red','green']}).score,1);
assert.equal(G.grade(fixture,['red green'],pair,{1:['red green','']}).score,0,'each blank is separately checked');
assert.equal(G.grade(d,Array(13).fill(''),null).marked,0,'no invented key or wrong marks for unreviewed answers');
console.log('PASS correct/wrong/unanswered, all reviewed keys, evidence/hash gates, unordered selections, partial credit, per-slot answers and no-key fallback.');

{const d=JSON.parse(fs.readFileSync('dist/lessons/p2-conserving-plastic.json')),s=keys[d.id],v=Array(13).fill('');v[10]='transparent transparent';assert.equal(G.grade(d,v,s.answers,{24:['transparent','transparent']}).rows.find(r=>r.n===24).correct,false,'two correct words still require a valid combination')}

{const d={id:'list-fixture',part:1,groups:[{type:'notes',questions:[{n:1},{n:2}]}]},key={1:{accepted:['toothpaste'],unorderedGroup:[1,2]},2:{accepted:['toothbrushes'],unorderedGroup:[1,2]}};
 assert.equal(G.grade(d,['toothbrushes','toothpaste'],key).score,2,'completion list allows either order');
 const duplicate=G.grade(d,['toothpaste','toothpaste'],key);assert.equal(duplicate.score,1,'duplicate text receives credit once');assert.equal(duplicate.rows.find(r=>!r.correct).answer,'toothbrushes','wrong row shows the missing item');
 assert.equal(G.grade(d,['toothbrushes',''],key).score,1,'partial list receives partial credit');}
{const s=structuredClone(keys['p1-a-brief-history-of-ballet']),d=JSON.parse(fs.readFileSync('dist/lessons/'+s.lessonId+'.json'));s.answers[8].unorderedGroup=[8,9];assert(G.validate(d,s).some(e=>e.includes('unordered')),'all members must share valid group metadata');}
