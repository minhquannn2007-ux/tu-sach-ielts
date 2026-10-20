import fs from 'node:fs';
import assert from 'node:assert/strict';
const {Window}=await import(process.env.HAPPY_DOM_MODULE);
const ids=["p2-mechanical-computing", "p1-nutrition-and-human-growth-in-north-america-and-europe-18th-20th-century", "p3-online-social-networking-sites", "p3-optimism-a-very-human-characteristic", "p2-the-art-and-science-of-facial-reconstruction-a-history", "p1-recent-developments-in-pea-growing", "p2-the-workplace-is-changing", "p3-the-ornithopter-a-new-way-to-fly", "p3-what-is-art-tolstoy-s-criteria", "p1-the-london-bus-museum"];
for(const full of [false,true])for(const id of ids){
 const w=new Window({url:'https://test.example/exam.html'+(full?'?full=1':''),settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true,disableJavaScriptEvaluation:true}});
 if(full)Object.defineProperty(w,'parent',{value:{postMessage(){}},configurable:true});w.confirm=()=>true;w.HTMLElement.prototype.scrollIntoView=function(){};
 const d=w.document;d.write(fs.readFileSync('dist/exam.html','utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''));w.eval(fs.readFileSync('dist/exam-data.js','utf8'));w.eval(fs.readFileSync('dist/exam-engine.js','utf8'));
 const data=JSON.parse(fs.readFileSync('dist/lessons/'+id+'.json'));await w.IELTSExam.boot(data,{utilities:false});const count=data.part===3?14:13,start=data.part===1?1:data.part===2?14:27;
 assert.equal(w.IELTSExam.values().length,count,id);assert.deepEqual([...d.querySelectorAll('#bb-dots button')].flatMap(b=>b.dataset.examQuestions.split(',').map(Number)),Array.from({length:count},(_,i)=>start+i),id);
 if(id==='p2-mechanical-computing'){assert.equal(d.querySelectorAll('input[name=q18]').length,2);assert.equal(d.querySelectorAll('.import-table tr').length,3);assert.equal(d.querySelectorAll('.import-table th').length,3);}
 if(id==='p3-the-ornithopter-a-new-way-to-fly')assert.equal(d.querySelectorAll('input[name=q30]').length,2);
 if(id==='p1-the-london-bus-museum'){assert.equal([...d.querySelectorAll('.source-note-row strong')].filter(e=>/^(1929|1940s|1950s|1960s|1972|1980s–1990s|2000s)$/.test(e.textContent)).length,7);}
 if(id==='p1-recent-developments-in-pea-growing'){assert.equal(d.querySelectorAll('.flow-chart-box').length,5);assert.equal(d.querySelectorAll('.flow-chart-linear-arrow img').length,4);assert.equal(d.querySelectorAll('.flow-chart-box input').length,3);}
 if(id==='p2-the-art-and-science-of-facial-reconstruction-a-history'){assert.equal(d.querySelectorAll('input[name=two14]').length,7);assert.equal(data.groups[0].selectionCount,3);}

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
console.log('PASS 10 uploaded lessons in single and full modes: complete numbering, answer controls, notes, multi-select, restore and submission.');
