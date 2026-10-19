// HAPPY_DOM_MODULE=/path/to/happy-dom/lib/index.js node scripts/tests/task-titles-dom.mjs
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const {Window}=await import(pathToFileURL(process.env.HAPPY_DOM_MODULE));
const read=f=>fs.readFileSync('dist/'+f,'utf8');
const css=read('reading-sample.html').match(/<style id="ielts-question-template">([\s\S]*?)<\/style>/)[1];
const titles='.passage-title,.passage-section-title,.summ-title,.choice-notes-title,.flow-chart-title,.diagram-title,.perfume-diagram-title,.mh-bank-title,.researchers-hdr,.sec-hdr,.summ-sec-hdr,.diagram-label[role="heading"]';
const lessons=fs.readdirSync('dist/lessons').map(f=>JSON.parse(read('lessons/'+f)));
const selected=new Map();for(const type of ['summary-input','summary-drag','notes','diagram','flow-chart']){const d=lessons.find(d=>d.groups.some(g=>g.type===type&&(g.title||g.noteLayout?.title)));assert(d,type+' fixture');selected.set(d.id,d)}
function fontPx(value){const m=value.match(/^calc\(([\d.]+)px \* ([\d.]+)\)$/);return m?Number(m[1])*Number(m[2]):parseFloat(value)}
async function check(w,label){
 const style=w.document.createElement('style');style.textContent=css;w.document.head.append(style);
 for(const [size,scale] of [['regular',1],['large',1.2],['extra-large',1.4]]){
  w.document.documentElement.dataset.examTextSize=size;w.document.documentElement.style.setProperty('--exam-text-scale',scale);
  for(const contrast of ['black-on-white','white-on-black','yellow-on-black']){
   w.document.documentElement.dataset.examContrast=contrast;w.document.documentElement.toggleAttribute('data-exam-dark',contrast!=='black-on-white');
   for(const e of w.document.querySelectorAll(titles)){assert.equal(w.getComputedStyle(e).textAlign,'left',label+' '+e.className+' '+size+' '+contrast)}
   for(const e of w.document.querySelectorAll('.summ-title,.choice-notes-title')){const s=w.getComputedStyle(e);assert(Math.abs(fontPx(s.fontSize)-18*scale)<.001,label+' completion title size '+s.fontSize);assert.equal(s.fontWeight,'700',label+' bold completion title')}
  }
 }
 await w.happyDOM.close();console.log('PASS left titles and matching summary/note size at all sizes/contrasts:',label);
}
const options={url:'https://test.example/exam.html',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true,disableJavaScriptEvaluation:true}};
for(const d of selected.values()){
 const w=new Window(options);w.document.write(read('exam.html').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''));w.eval(read('exam-data.js'));w.eval(read('exam-engine.js'));await w.IELTSExam.boot(d,{utilities:false});await check(w,d.id);
}
for(const file of fs.readdirSync('dist/bai').filter(f=>f.endsWith('.html'))){const w=new Window(options);w.document.write(read('bai/'+file));await check(w,file)}
assert(read('full-test.js').includes("f.src='exam.html?lesson='"));
console.log('PASS shared renderer and all 11 HTML lessons; Full Test loads the shared renderer');
