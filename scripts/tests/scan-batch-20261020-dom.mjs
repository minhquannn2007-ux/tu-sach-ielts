import fs from 'node:fs';
import assert from 'node:assert/strict';
const {Window}=await import(process.env.HAPPY_DOM_MODULE);
const ids=["p1-the-health-benefits-of-singing", "p1-the-development-of-the-bicycle", "p2-the-problem-with-aiming-for-average", "p3-business-innovation", "p3-yawning", "p1-deep-sea-discovery", "p1-the-great-tit", "p1-book-review-triumph-of-the-city"];
for(const full of [false,true])for(const id of ids){
 const w=new Window({url:'https://test.example/exam.html'+(full?'?full=1':''),settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true,disableJavaScriptEvaluation:true}});
 if(full)Object.defineProperty(w,'parent',{value:{postMessage(){}},configurable:true});w.confirm=()=>true;w.HTMLElement.prototype.scrollIntoView=function(){};
 const d=w.document;d.write(fs.readFileSync('dist/exam.html','utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''));w.eval(fs.readFileSync('dist/exam-data.js','utf8'));w.eval(fs.readFileSync('dist/exam-engine.js','utf8'));
 const data=JSON.parse(fs.readFileSync('dist/lessons/'+id+'.json'));await w.IELTSExam.boot(data,{utilities:false});const count=data.part===3?14:13,start=data.part===1?1:data.part===2?14:27;
 assert.equal(w.IELTSExam.values().length,count,id);assert.deepEqual([...d.querySelectorAll('#bb-dots button')].flatMap(b=>b.dataset.examQuestions.split(',').map(Number)),Array.from({length:count},(_,i)=>start+i),id);
 if(id==='p2-no-title-bees-and-plants'){assert.equal(d.querySelectorAll('.mh-gap').length,5);assert.equal(d.querySelectorAll('.passage-example-heading').length,1);assert.equal(d.querySelectorAll('.sample-token').length,7);assert.equal(d.querySelectorAll('.choice-gap').length,7);assert.equal(d.querySelectorAll('.mh-gap[data-q=\"16\"]').length,1);assert.equal(data.groups[0].questions[2].paragraph,3);assert(!data.title.includes('Ecological'));}
 if(id==='p3-living-dunes'){assert.equal(d.querySelectorAll('.mh-gap').length,7);assert.equal(d.querySelectorAll('.sample-token').length,9);assert.equal(data.groups[2].content.length,2);assert(!data.paragraphs[0].text.includes('coastal'));assert(data.paragraphs[2].text.includes('says Giles Wiggs'));}
 for(const g of data.groups){
  for(const n of w.IELTSData.numbers(g))assert(d.querySelector('input[name=q'+n+'],.sample-drop[data-q="'+n+'"],input[name=two'+g.numbers?.[0]+']'),'Missing answer control '+id+' '+n);
  if(g.noteLayout)assert.equal(d.querySelectorAll('.source-note-row').length,g.noteLayout.rows.length,id);
 }
 for(const i of d.querySelectorAll('#qpanel input.choice-gap')){i.value='sample';i.dispatchEvent(new w.Event('input',{bubbles:true}));}
 for(const group of data.groups.filter(g=>['tfng','ynng','mc-one','matching-info','matching-features'].includes(g.type)))for(const q of group.questions)d.querySelector('input[name=q'+q.n+']')?.click();
 for(const group of data.groups.filter(g=>g.type==='mc-two'))[...d.querySelectorAll('input[name=two'+group.numbers[0]+']')].slice(0,group.selectionCount||2).forEach(i=>i.click());
 const snapshot=w.IELTSExam.snapshot(),values=Array.from(w.IELTSExam.values());assert(values.filter(Boolean).length>5,'Completion threshold '+id);w.IELTSExam.restore(snapshot);assert.deepEqual(Array.from(w.IELTSExam.values()),values,id);
 w.IELTSExam.finishFull();assert([...d.querySelectorAll('#qpanel input')].every(i=>i.disabled),id);w.happyDOM.abort();
}
console.log('PASS 8 source-reviewed scan lessons in single and full modes: complete numbering, answer controls, notes, multi-select, restore and submission.');
