import fs from 'node:fs';import vm from 'node:vm';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const ctx={};vm.runInNewContext(fs.readFileSync('dist/exam-data.js','utf8'),ctx);let count=0;
const keys=JSON.parse(fs.readFileSync('dist/answer-keys.json'));const catalog=new Set(JSON.parse(fs.readFileSync('dist/lesson-catalog.json')).map(d=>d.id));
for(const [id,s] of Object.entries(keys)){
 assert(catalog.has(id),'Unknown published lesson '+id);const d=JSON.parse(fs.readFileSync('dist/lessons/'+id+'.json'));
 assert.deepEqual(Array.from(ctx.IELTSGrading.validate(d,s)),[],id);
 assert.equal(crypto.createHash('sha256').update(ctx.IELTSGrading.sourceText(d)).digest('hex'),s.lessonSha256,'Stale key '+id);
 for(const [asset,hash] of Object.entries(s.assetHashes||{}))assert.equal(crypto.createHash('sha256').update(fs.readFileSync('dist/'+asset)).digest('hex'),hash,'Stale diagram key '+id);
 count+=Object.keys(s.answers).length;
}
console.log('PASS '+Object.keys(keys).length+' version-bound keys / '+count+' answers with passage evidence.');
