/* HAPPY_DOM_MODULE=/path/to/happy-dom/lib/index.js node scripts/tests/exam-duration-dom.mjs */
import fs from 'node:fs';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
const {Window}=await import(pathToFileURL(process.env.HAPPY_DOM_MODULE));
const read=p=>fs.readFileSync('dist/'+p,'utf8'),strip=s=>s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''),flush=()=>new Promise(r=>setTimeout(r,0));
function setup(path){const w=new Window({url:'https://test.example/'+path,settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true,disableJavaScriptEvaluation:true}});w.HTMLElement.prototype.scrollIntoView=function(){};w.HTMLElement.prototype.scrollTo=function(){};w.confirm=()=>{throw Error('Unexpected confirmation')};let now=1000000,id=0;const intervals=new Map();w.Date.now=()=>now;w.setInterval=fn=>{intervals.set(++id,fn);return id};w.clearInterval=n=>intervals.delete(n);w.document.write(strip(read(path)));w.eval(read('exam-duration.js'));return {w,advance:ms=>{now+=ms;for(const fn of [...intervals.values()])fn()}}}
function choose(w,value){const input=w.document.getElementById('duration-minutes');input.value=value;w.document.querySelector('.duration-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}))}
{const {w}=setup('exam.html');for(const [ms,text] of [[300001,'6 minutes remaining'],[300000,'5 minutes 0 seconds remaining'],[299001,'5 minutes 0 seconds remaining'],[299000,'4 minutes 59 seconds remaining'],[63000,'1 minute 3 seconds remaining'],[61000,'1 minute 1 second remaining'],[60000,'1 minute 0 seconds remaining'],[59000,'59 seconds remaining'],[1000,'1 second remaining'],[1,'1 second remaining'],[0,'0 seconds remaining'],[-1,'0 seconds remaining']])assert.equal(w.IELTSDuration.label(ms),text);await w.happyDOM.abort()}
const data=JSON.parse(read('lessons/p1-energy-from-the-oceans.json'));
for(const manual of [false,true]){
 const {w,advance}=setup('exam.html');w.eval(read('exam-data.js'));w.eval(read('exam-engine.js'));await w.IELTSExam.boot(data,{utilities:false});w.eval(read('exam-tools.js'));w.eval(read('submit-review.js'));w.eval(read('exam-behavior.js'));
 assert(w.document.querySelector('.duration-screen'));assert(w.document.documentElement.classList.contains('duration-pending'));
 for(const invalid of ['', '0','121','1.5','-1','2e1']){choose(w,invalid);assert(w.document.querySelector('.duration-screen'),'reject '+invalid);assert(w.document.querySelector('[aria-invalid=true]'))}
 choose(w,manual?'120':'1');await flush();assert(!w.document.querySelector('.duration-screen'));const clock=w.document.getElementById('exam-countdown');assert.equal(clock.textContent,manual?'120 minutes remaining':'1 minute 0 seconds remaining');assert.equal(clock.previousElementSibling.textContent,'Test taker ID');assert(!w.document.querySelector('.exam-home'));
 const inputs=[...w.document.querySelectorAll('#qpanel input')];if(['radio','checkbox'].includes(inputs[0].type))inputs[0].checked=true;else inputs[0].value='saved response';const expectedResponse=inputs[0].value;inputs[0].dispatchEvent(new w.Event('input',{bubbles:true}));
 if(manual){w.document.querySelector('.exam-submit').click();w.document.querySelector('.submission-review-next').click();await flush();const shown=clock.textContent;advance(7200001);assert.equal(clock.textContent,shown,'manual submit stops timer')}
 else{advance(59999);assert(!w.document.getElementById('submit-choice').disabled);w.document.querySelector('.exam-submit').click();assert(w.document.querySelector('.submission-review'));advance(1);await flush();assert.equal(clock.textContent,'0 seconds remaining');assert(!w.document.querySelector('.submission-review'));assert(w.document.getElementById('submit-choice').disabled);advance(100000)}
 const history=JSON.parse(w.localStorage.getItem('reading-'+data.id+'-history'));assert.equal(history.length,1);assert.equal(history[0].values[0],expectedResponse);assert.equal(history[0].automatic,!manual);assert.equal(history[0].completed,false);await w.happyDOM.abort();
}
// Every original standalone page must enter setup and force-submit without a prompt.
for(const file of fs.readdirSync('dist/bai').filter(p=>p.endsWith('.html'))){
 const path='bai/'+file,{w,advance}=setup(path),html=read(path);w.confirm=()=>false;
 const scripts=[];for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
  const src=m[1].match(/src="([^"?]+)/)?.[1];
  if(src){if(/(?:exam-behavior|legacy-duration)\.js$/.test(src))scripts.push(read(src.replace('../','')))}else if(m[2].trim()&&!/application\/json/.test(m[1]))scripts.push(m[2]);
 }
 w.eval(scripts.join('\n;\n'));assert(w.document.querySelector('.duration-screen'),file+' setup');choose(w,'1');await flush();assert.equal(w.document.getElementById('exam-countdown').textContent,'1 minute 0 seconds remaining');advance(60000);await flush();assert(w.document.querySelector('.exam-submit').disabled,file+' forced submit');assert(!w.document.querySelector('.exam-home'),file+' no header home link');await w.happyDOM.abort();console.log('PASS timed legacy:',file);
}
// No extra setup or clock inside the three Full Test frames.
{const w=new Window({url:'https://test.example/exam.html?full=1'});Object.defineProperty(w,'parent',{value:{}});w.document.write(strip(read('exam.html')));w.eval(read('exam-duration.js'));assert(!w.document.documentElement.classList.contains('duration-pending'));await w.IELTSDuration.single({});assert(!w.document.querySelector('.duration-screen'));await w.happyDOM.abort()}
console.log('PASS integer bounds, 120-minute start, exact expiry, saved answers, pending review, manual stop and all standalone paths');
