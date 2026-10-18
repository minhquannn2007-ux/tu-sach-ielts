import fs from 'node:fs';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
const {Window}=await import(pathToFileURL(process.env.HAPPY_DOM_MODULE));const read=f=>fs.readFileSync('dist/'+f,'utf8');
for(const id of ['p3-the-peopling-of-patagonia','p3-managing-the-language-barrier-in-international-business','p3-risk-taking']){
 const data=JSON.parse(read('lessons/'+id+'.json')),w=new Window({url:'https://test.example/exam.html',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true,disableJavaScriptEvaluation:true}});w.HTMLElement.prototype.scrollIntoView=function(){};w.document.write(read('exam.html').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''));for(const s of ['exam-data.js','exam-engine.js'])w.eval(read(s));await w.IELTSExam.boot(data,{utilities:false});const d=w.document;
 if(id.includes('patagonia')){assert.equal(d.querySelector('#para0 img').getAttribute('src'),'assets/patagonia-reading-map.png');assert.equal(d.querySelectorAll('.source-footnote').length,1);assert.equal(d.querySelectorAll('.passage-para').length,8);assert(![...d.querySelectorAll('.passage-para')].some(p=>p.textContent.includes('finding out the age')))}
 if(id.includes('language')){assert.equal(d.querySelectorAll('.source-footnote').length,1);assert(!d.querySelector('#para3').textContent.includes('language that is adopted'));assert.equal(d.querySelectorAll('.dnd-word').length,15);assert(![...d.querySelectorAll('.dnd-word')].some(t=>/^[A-O]\s/.test(t.textContent)))}
 if(id.includes('risk')){assert.equal(d.querySelectorAll('.para-lbl').length,8);const g=data.groups.find(g=>g.type==='matching-info');assert(g.reuse);assert.equal(g.paragraphCount,8);assert(w.IELTSData.instructions(g,data).includes('eight paragraphs'))}
 await w.happyDOM.abort();
}
console.log('PASS new source map, footnote separation, 15 drag tokens and eight labelled sections/reuse');
