import fs from 'node:fs';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
const {Window}=await import(pathToFileURL(process.env.HAPPY_DOM_MODULE));const read=p=>fs.readFileSync('dist/'+p,'utf8');
const eligible=g=>g.type==='mc-two'&&(g.selectionCount??2)===2&&g.options.length===5;
function runs(data){const result=[];let run=[];for(const g of [...data.groups,{}]){if(eligible(g)){if(run.length&&g.numbers[0]!==run.at(-1).numbers.at(-1)+1){if(run.length>1)result.push(run);run=[]}run.push(g)}else{if(run.length>1)result.push(run);run=[]}}return result}
const lessons=fs.readdirSync('dist/lessons').map(f=>JSON.parse(read('lessons/'+f))).filter(d=>runs(d).length);
// Three consecutive pairs, as in the supplied Questions 18–23 example.
const example=structuredClone(lessons[0]);const pair=example.groups.find(eligible);example.groups=[18,20,22].map(n=>({...structuredClone(pair),numbers:[n,n+1]}));const filler=ns=>({type:'tfng',sourceInstructions:'Do the following statements agree with the information in the text?',questions:ns.map(n=>({n,prompt:'Fixture statement '+n}))});example.groups=[filler([14,15,16,17]),...example.groups,filler([24,25,26])];example.id='p2-three-pair-example';example.key=undefined;example.mode='practice';
for(const data of [...lessons,example])for(const full of [false,true]){
 const w=new Window({url:'https://test.example/exam.html'+(full?'?full=1':''),settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true,disableJavaScriptEvaluation:true}});w.HTMLElement.prototype.scrollIntoView=function(){};if(full)Object.defineProperty(w,'parent',{value:{postMessage(){}}});w.document.write(read('exam.html').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''));w.eval(read('exam-data.js'));w.eval(read('exam-engine.js'));await w.IELTSExam.boot(data,{utilities:false});
 for(const run of runs(data)){
  const start=run[0].numbers[0],end=run.at(-1).numbers.at(-1),section=w.document.querySelector('input[name="two'+start+'"]').closest('section');assert.equal(section.querySelectorAll('.sec-hdr').length,1);assert.equal(section.querySelector('.sec-hdr').textContent,'Questions '+start+'–'+end);assert.equal(section.querySelectorAll('.sec-inst').length,1);assert.equal(section.querySelectorAll('.tif-question').length,run.length);
  for(const g of run){const inputs=[...section.querySelectorAll('input[name="two'+g.numbers[0]+'"]')];assert.equal(inputs.length,5);assert.equal(inputs[0].closest('.tif-question').querySelector('.order-number').textContent,g.numbers.join('–'));inputs[0].click();inputs[1].click();assert(inputs.slice(2).every(i=>i.disabled));assert.equal(inputs.filter(i=>i.checked).length,2)}
  const snap=w.IELTSExam.snapshot();w.IELTSExam.restore(snap);for(const g of run)assert.equal(section.querySelectorAll('input[name="two'+g.numbers[0]+'"]:checked').length,2);
 }
 await w.happyDOM.abort();
}
const goya=new Window();goya.document.write(read('bai/ielts_p2_goya.html').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''));const titles=[...goya.document.querySelectorAll('#qpanel .sec-hdr')].map(e=>e.textContent);assert(titles.includes('Questions 19–22'));assert(!titles.some(t=>t==='Questions 21 and 22'||t==='Questions 19 and 20'));assert.equal([...goya.document.querySelectorAll('#qpanel .sec-inst')].filter(e=>e.textContent==='Choose TWO correct answers.').length,1);await goya.happyDOM.abort();
console.log('PASS '+lessons.length+' lessons in standalone and Full Test, three-pair example, independent answer caps, restore and legacy Goya');
