/* Index explicit passage-reviewed solutions; never create answers automatically. */
import fs from 'node:fs';import vm from 'node:vm';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const ctx={};vm.runInNewContext(fs.readFileSync('dist/exam-data.js','utf8'),ctx);const output={};
for(const file of fs.readdirSync('import/answer-review').filter(f=>/^batch-\d+\.json$/.test(f))){
 const batch=JSON.parse(fs.readFileSync('import/answer-review/'+file));
 for(const [id,s] of Object.entries(batch)){
  assert(!output[id],'Duplicate solution '+id);const d=JSON.parse(fs.readFileSync('dist/lessons/'+id+'.json'));
  assert.equal(s.lessonSha256,crypto.createHash('sha256').update(ctx.IELTSGrading.sourceText(d)).digest('hex'),'Source changed; re-review before indexing '+id);
  for(const [asset,hash] of Object.entries(s.assetHashes||{}))assert.equal(crypto.createHash('sha256').update(fs.readFileSync('dist/'+asset)).digest('hex'),hash,'Diagram changed; re-review '+id);
  assert.deepEqual(Array.from(ctx.IELTSGrading.validate(d,s)),[],id);output[id]=s;
 }
}
fs.writeFileSync('dist/answer-keys.json',JSON.stringify(output,null,2)+'\n');
console.log('Indexed '+Object.keys(output).length+' complete reviewed answer keys.');
