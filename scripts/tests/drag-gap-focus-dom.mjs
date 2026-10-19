// HAPPY_DOM_MODULE=/path/to/happy-dom/lib/index.js node scripts/tests/drag-gap-focus-dom.mjs
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const {Window}=await import(pathToFileURL(process.env.HAPPY_DOM_MODULE));
const read=f=>fs.readFileSync('dist/'+f,'utf8');
const css=read('reading-sample.html').match(/<style id="ielts-question-template">([\s\S]*?)<\/style>/)[1];
assert.equal(read('question-template.css').trim().split('\n').slice(1).join('\n'),css.trim());
const palette=[['black-on-white','#000','#418ec8'],['white-on-black','#fff','#bd7039'],['yellow-on-black','#ff0','#00ffff']];
const cases=[['matching-headings','.mh-gap'],['summary-drag','.dnd-drop'],['matching-endings','.me-drop']];
const lessons=fs.readdirSync('dist/lessons').map(f=>JSON.parse(read('lessons/'+f)));
let count=0;
for(const [type,selector] of cases){
 const data=lessons.find(d=>d.groups.some(g=>g.type===type&&g.questions?.length>=2));
 // Summary questions are represented by slots rather than a questions array.
 const lesson=data||lessons.find(d=>d.groups.some(g=>g.type===type));assert(lesson,type);
 const w=new Window({url:'https://test.example/exam.html',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true,disableJavaScriptEvaluation:true}});
 w.HTMLElement.prototype.scrollIntoView=function(){};w.HTMLElement.prototype.scrollTo=function(){};
 w.document.write(read('exam.html').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''));
 const style=w.document.createElement('style');style.textContent=css;w.document.head.append(style);
 w.eval(read('exam-data.js'));w.eval(read('exam-engine.js'));await w.IELTSExam.boot(lesson,{utilities:false});
 w.eval(read('exam-question-focus.js'));w.eval(read('exam-tools.js'));w.eval(read('exam-behavior.js'));
 const gaps=[...w.document.querySelectorAll(selector)];assert(gaps.length>=2,type+' has multiple gaps');
 const ns=gaps.map(g=>Number(g.dataset.q));
 for(const [contrast,fg,accent] of palette){
  w.document.documentElement.dataset.examContrast=contrast;
  w.document.documentElement.style.setProperty('--exam-fg',fg);
  w.document.documentElement.toggleAttribute('data-exam-dark',contrast!=='black-on-white');
  const check=()=>gaps.forEach(g=>{const s=w.getComputedStyle(g),active=g.classList.contains('exam-question-active');assert.equal(s.borderTopColor,g.classList.contains('filled')||active?accent:fg,`${type} ${contrast} q${g.dataset.q}`);assert.equal(s.outlineStyle,'none')});
  w.IELTSExam.navigate(ns[0]);check();assert.equal(gaps.filter(g=>g.classList.contains('exam-question-active')).length,1);
  gaps[1].dispatchEvent(new w.MouseEvent('mouseenter'));check();
  for(const cls of ['exam-heading-dragging','exam-summary-dragging','exam-answer-dragging']){w.document.body.classList.add(cls);check();w.document.body.classList.remove(cls)}
  gaps[1].click();await new Promise(r=>setTimeout(r,0));check();assert.equal(w.IELTSQuestionFocus.current,ns[1]);
  w.document.getElementById('nav-prev').click();check();assert.equal(w.IELTSQuestionFocus.current,ns[0]);
  w.document.getElementById('nav-next').click();check();assert.equal(w.IELTSQuestionFocus.current,ns[1]);
  const group=lesson.groups.find(g=>g.kind===gaps[0].dataset.kind),value=group.bank[0].value;
  w.IELTSExam.restore({drops:[{n:ns[0],value}]});check();
  assert(gaps[0].classList.contains('filled'));assert.equal(w.getComputedStyle(gaps[0]).borderTopStyle,'solid');
  w.IELTSExam.navigate(ns[0]);check();w.IELTSExam.navigate(ns[1]);check();
  w.IELTSExam.restore({drops:[{n:ns[0],value:''}]});
  // Restore does not clear absent tokens: reset through the existing Delete action.
  gaps[0].dispatchEvent(new w.KeyboardEvent('keydown',{key:'Delete',bubbles:true}));
  assert(!gaps[0].classList.contains('filled'));count++;
 }
 await w.happyDOM.close();console.log('PASS active/idle/drag/filled borders and click/arrow focus:',type,lesson.id);
}
// Every legacy page uses the same canonical CSS and activation controller.
for(const file of fs.readdirSync('dist/bai').filter(f=>f.endsWith('.html'))){const html=read('bai/'+file);assert(html.includes('question-template.js'),file);assert(html.includes('exam-question-focus.js'),file)}
assert(read('full-test.html').includes('exam.html')||read('full-test.js').includes("f.src='exam.html?lesson='"));
console.log('PASS',count,'type/palette combinations; shared links on all 11 legacy lessons and Full Test frames');
