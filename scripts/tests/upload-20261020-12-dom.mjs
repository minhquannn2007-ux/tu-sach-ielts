import fs from 'node:fs';
import assert from 'node:assert/strict';
const {Window}=await import(process.env.HAPPY_DOM_MODULE);
const ids=["p3-filming-the-natural-world-with-time-warp-photography", "p3-british-woodlands", "p3-why-don-t-adverts-work-any-more", "p3-what-do-babies-know", "p1-dugongs", "p1-te-papa", "p2-society-and-culture-in-west-africa", "p1-optimism-and-health", "p3-message-in-a-coral", "p1-case-study-schuit-sustainable-development-project-on-stavos", "p2-the-function-of-dreams"];
for(const full of [false,true])for(const id of ids){
 const w=new Window({url:'https://test.example/exam.html'+(full?'?full=1':''),settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true,disableJavaScriptEvaluation:true}});
 if(full)Object.defineProperty(w,'parent',{value:{postMessage(){}},configurable:true});w.confirm=()=>true;w.HTMLElement.prototype.scrollIntoView=function(){};
 const d=w.document;d.write(fs.readFileSync('dist/exam.html','utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''));w.eval(fs.readFileSync('dist/exam-data.js','utf8'));w.eval(fs.readFileSync('dist/exam-engine.js','utf8'));
 const data=JSON.parse(fs.readFileSync('dist/lessons/'+id+'.json'));await w.IELTSExam.boot(data,{utilities:false});const count=data.part===3?14:13,start=data.part===1?1:data.part===2?14:27;
 assert.equal(w.IELTSExam.values().length,count,id);assert.deepEqual([...d.querySelectorAll('#bb-dots button')].flatMap(b=>b.dataset.examQuestions.split(',').map(Number)),Array.from({length:count},(_,i)=>start+i),id);
 if(id==='p3-british-woodlands'){assert.equal(d.querySelectorAll('.sample-token').length,15);assert.equal(data.groups[0].reuse,true);}
 if(id==='p3-what-do-babies-know'){assert.equal(data.groups[1].bank.length,7);assert.equal(d.querySelectorAll('.sample-token').length,7);assert.equal(data.paragraphs.length,8);assert.equal(data.groups[2].questions[2].n,40);}
 if(id==='p3-why-don-t-adverts-work-any-more'){assert.equal(data.paragraphs.length,6);assert.equal(d.querySelectorAll('.mh-gap.sample-drop').length,6);assert.equal(d.querySelectorAll('.para-lbl').length,0);}
 if(id==='p1-te-papa'){assert.equal(d.querySelectorAll('.source-footnote').length,1);assert(data.groups[0].noteLayout.rows.filter(r=>r.indent===3).length===2);assert(d.querySelector('input[name=q13]'));}
 if(id==='p1-case-study-schuit-sustainable-development-project-on-stavos'){assert.equal(d.querySelectorAll('.passage-section-title').length,7);assert.equal(d.querySelectorAll('.source-footnote').length,1);assert.equal(d.querySelectorAll('input[name=two12]').length,6);}
 if(id==='p2-the-function-of-dreams')assert(!d.querySelector('#passage').textContent.includes('Answer Key'));

 for(const g of data.groups.filter(g=>['matching-headings','summary-drag','matching-endings'].includes(g.type))){const q=g.questions[0],v=g.bank[0].value;w.IELTSExam.restore({drops:[{n:q.n,value:v}]});assert.equal(w.IELTSExam.values()[q.n-start],v);}
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
console.log('PASS 11 uploaded lessons in single and full modes: complete numbering, answer controls, notes, multi-select, restore and submission.');
