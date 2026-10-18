import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),ctx={};
vm.runInNewContext(fs.readFileSync(path.join(root,'dist/exam-data.js'),'utf8'),ctx);
const lessons=fs.readdirSync(path.join(root,'dist/lessons')).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync(path.join(root,'dist/lessons',f),'utf8')));
for(const lesson of lessons){
 assert.equal(ctx.IELTSData.validate(lesson).join('; '),'');
 const empty=structuredClone(lesson);empty.paragraphs[0].text='';assert(ctx.IELTSData.validate(empty).includes('Missing or empty passage paragraph'));
 const pending=structuredClone(lesson);pending.status='queued';assert(ctx.IELTSData.validate(pending).includes('Lesson is awaiting review'));
 const malformed=structuredClone(lesson);malformed.groups[0].bank='bad';assert(ctx.IELTSData.validate(malformed).includes('Invalid option bank'));
 const first=lesson.part===1?1:lesson.part===2?14:27;
 if(lesson.mode!=='practice'){
 const badQuote=structuredClone(lesson);badQuote.key[first].evidence[0].quote='A fabricated quote that the passage does not contain';assert(ctx.IELTSData.validate(badQuote).includes('Evidence quote missing from passage '+first));
 const missing=structuredClone(lesson);delete missing.key[first];assert(ctx.IELTSData.validate(missing).includes('Missing answer/explanation '+first));
 }
 const numbered=structuredClone(lesson);if(numbered.groups[0].numbers)numbered.groups[0].numbers[0]=100;else numbered.groups[0].questions[0].n=100;assert(ctx.IELTSData.validate(numbered).includes('Question numbering/count mismatch'));
 for(const group of lesson.groups){
  if(group.bank?.length>2&&group.bank.every(o=>/^[A-Z]$/.test(o.value))){const broken=structuredClone(lesson),bank=broken.groups.find(g=>g.type===group.type).bank;bank.splice(1,1);assert(ctx.IELTSData.validate(broken).includes('Missing or misordered option code'))}
  const instructions=ctx.IELTSData.instructions(group,lesson);
  assert(!/answer sheet|in boxes/i.test(instructions));
  if(group.type==='matching-info'){const wrong=structuredClone(lesson),g=wrong.groups.find(x=>x.type==='matching-info');g.reuse=true;g.sourceInstructions=g.sourceInstructions.replace(/(?:NB\s+)?You may[^.]*more than (?:once|one)\.?/i,'');assert(ctx.IELTSData.validate(wrong).includes('Reuse rule is absent from source'));assert.equal(instructions.includes('more than once'),group.reuse)}
  if(group.wordLimit){const wrong=structuredClone(lesson),g=wrong.groups.find(x=>x.wordLimit);g.wordLimit='FOUR WORDS ONLY';assert(ctx.IELTSData.validate(wrong).includes('Word limit differs from source'))}
 }
}
console.log('PASS '+lessons.length+' real lessons: source rules, numbering, answer/evidence completeness, pending gate.');
