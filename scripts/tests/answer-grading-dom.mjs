import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {pathToFileURL} from 'node:url';
const {Window}=await import(pathToFileURL(process.env.HAPPY_DOM_MODULE));const read=f=>fs.readFileSync('dist/'+f,'utf8'),keys=JSON.parse(read('answer-keys.json'));
const ids=Object.keys(keys);
for(const id of ids)for(const full of [false,true]){
 const data=JSON.parse(read('lessons/'+id+'.json')),key=keys[id]?.answers||data.key;
 const w=new Window({url:'https://test.example/exam.html'+(full?'?full=1':''),settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true,disableJavaScriptEvaluation:true}});w.TextEncoder=TextEncoder;Object.defineProperty(w.crypto,'subtle',{value:crypto.webcrypto.subtle});w.confirm=()=>true;w.HTMLElement.prototype.scrollIntoView=function(){};w.HTMLElement.prototype.scrollTo=function(){};if(full)Object.defineProperty(w,'parent',{value:{postMessage(){}}});w.document.write(read('exam.html').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''));w.eval(read('exam-data.js'));w.eval(read('exam-engine.js'));await w.IELTSExam.boot(data,{utilities:false,answerKey:keys[id]});
 assert(w.document.getElementById('choice-result').hidden);assert.equal(w.document.querySelector('.answer-results'),null,'no answers before submit');
 const controls=[],drops=[];
 for(const g of data.groups){if(g.type==='mc-two'){for(const input of w.document.querySelectorAll('[name="two'+g.numbers[0]+'"]'))controls.push({id:input.id,checked:g.numbers.some(n=>key[n].accepted.includes(input.value))});continue}
  for(const q of g.questions){const val=key[q.n].accepted[0],drop=w.document.querySelector('.sample-drop[data-q="'+q.n+'"]');if(drop){drops.push({n:q.n,value:val});continue}for(const input of w.document.querySelectorAll('[name="q'+q.n+'"]'))controls.push(input.type==='radio'?{name:input.name,value:input.value,checked:input.value===val}:{id:input.id,value:q.slots>1?val.split(' ')[Number(input.dataset.slot||0)]:val})}
 }
 w.IELTSExam.restore({controls,drops});const preview=w.IELTSExam.evaluation();assert.equal(preview.score,preview.total,id+' all correct');assert(w.document.getElementById('choice-result').hidden);
 if(id==='p1-australias-airborne-dentists'){const a=w.document.querySelector('[name="q11"]'),b=w.document.querySelector('[name="q12"]');a.value='toothbrushes';b.value='toothpaste';assert.equal(w.IELTSExam.evaluation().score,preview.total,'reversed completion items');a.value='toothpaste';const duplicate=w.IELTSExam.evaluation();assert.equal(duplicate.score,preview.total-1,'duplicate item cannot count twice');assert.equal(duplicate.rows.find(r=>!r.correct).answer,'toothbrushes');w.IELTSExam.restore({controls,drops})}
 // An unanswered response and a distinct incorrect response must both show corrections.
 const textInputs=[...w.document.querySelectorAll('#qpanel input')].filter(i=>!['radio','checkbox'].includes(i.type));if(textInputs.length>1){textInputs[0].value='';textInputs[1].value='definitely incorrect'}
 if(full)w.IELTSExam.finishFull();else w.document.getElementById('submit-choice').click();
 const result=w.IELTSExam.result(),table=w.document.querySelector('.answer-results');assert(table);assert.equal(table.querySelectorAll('tbody tr').length,result.total);assert.equal(table.querySelectorAll('thead th').length,3);
 assert.equal([...table.querySelectorAll('tbody tr')].filter(r=>r.cells[2].textContent==='✅').length,result.score);
 for(const row of result.rows){const tr=table.querySelector('[data-question="'+row.n+'"]');assert.equal(tr.cells[1].textContent,row.response);assert.equal(tr.cells[2].textContent,row.correct?'✅':'❌ Đáp án đúng: '+row.answer)}
 assert(w.document.getElementById('submit-choice').disabled);if(full){assert.equal(w.localStorage.getItem('reading-'+id+'-history'),null,'full test shell owns history')}else{const history=JSON.parse(w.localStorage.getItem('reading-'+id+'-history'));assert.equal(history.length,1);assert.equal(history[0].score,result.score);w.document.getElementById('submit-choice').click();assert.equal(JSON.parse(w.localStorage.getItem('reading-'+id+'-history')).length,1)}
 await w.happyDOM.abort();
}
console.log('PASS '+ids.length+' lessons in standalone/Full Test: hidden keys, correct/wrong/unanswered table, controls, score and single history.');
