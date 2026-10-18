import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const {Window}=await import(pathToFileURL(process.env.HAPPY_DOM_MODULE));
const ctx={};vm.runInNewContext(fs.readFileSync('dist/exam-data.js','utf8'),ctx);
let groups=0,sourceBelow=0;
for(const f of fs.readdirSync('dist/lessons').filter(f=>f.endsWith('.json'))){
 const d=JSON.parse(fs.readFileSync('dist/lessons/'+f));
 for(const g of d.groups){
  const original=g.sourceInstructions;
  const text=ctx.IELTSData.instructions(g,d);
  assert(text,`${f}: missing instruction`);
  assert(!/\bbelow\b/i.test(text),`${f}: paper positioning word`);
  assert(!/Do the following statements agree/i.test(text),`${f}: paper truth-task opening`);
  if(['tfng','ynng'].includes(g.type))assert.match(text,/^Choose <strong>(TRUE|YES)<\/strong>/);
  assert.equal(g.sourceInstructions,original,'Rendering must preserve source provenance');
  if(/\bbelow\b/i.test(original||''))sourceBelow++;
  groups++;
 }
}
let pages=0;
for(const f of ['dist/reading-sample.html',...fs.readdirSync('dist/bai').filter(f=>f.endsWith('.html')).map(f=>'dist/bai/'+f)]){
 const w=new Window({settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true,disableJavaScriptEvaluation:true}});
 w.document.write(fs.readFileSync(f,'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''));
 const instructions=w.document.querySelectorAll('.sec-inst');assert(instructions.length,f);
 for(const el of instructions){assert(!/\bbelow\b/i.test(el.textContent),f);assert(!/Do the following statements agree/i.test(el.textContent),f);assert(!/,\s*\./.test(el.textContent),f);}
 if(f.endsWith('seeing_in_the_sea_ielts.html'))assert(/\bbelow\b/i.test(w.document.querySelector('.passage-para').parentElement.textContent),'Reading vocabulary must remain intact');
 await w.happyDOM.abort();pages++;
}
assert(sourceBelow>0,'Original paper instructions must remain available for source validation');
console.log(`PASS ${groups} generated instruction groups and ${pages} sample/legacy pages; source wording and reading vocabulary preserved`);
