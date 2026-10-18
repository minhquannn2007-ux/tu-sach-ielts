import fs from 'node:fs';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const {Window}=await import(pathToFileURL(process.env.HAPPY_DOM_MODULE));
const ids=fs.readdirSync('dist/lessons').filter(f=>f.endsWith('.json')).filter(f=>JSON.parse(fs.readFileSync('dist/lessons/'+f)).groups.some(g=>g.type==='matching-headings'&&g.examples?.length)).map(f=>f.replace(/\.json$/,''));
for(const id of ids){
 const data=JSON.parse(fs.readFileSync('dist/lessons/'+id+'.json'));
 const w=new Window({url:'https://test.example/exam.html',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true,disableJavaScriptEvaluation:true}});
 w.HTMLElement.prototype.scrollIntoView=function(){};
 w.document.write(fs.readFileSync('dist/exam.html','utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''));
 w.eval(fs.readFileSync('dist/exam-data.js','utf8'));w.eval(fs.readFileSync('dist/exam-engine.js','utf8'));
 await w.IELTSExam.boot(data,{utilities:false});
 const g=data.groups.find(g=>g.type==='matching-headings'),example=g.examples[0],d=w.document;
 assert.equal(d.querySelectorAll('.mh-gap.sample-drop').length,g.questions.length);
 const heading=g.bank.find(o=>o.value===example.value),fixed=d.getElementById('para'+example.paragraph).previousElementSibling;
 assert.equal(fixed.tagName,'H3');assert.equal(fixed.className,'passage-example-heading');assert.equal(fixed.textContent,heading.text);
 assert(!d.querySelector('.sample-token[data-value="'+example.value+'"]'));
 assert.equal(d.querySelectorAll('.mh-bank .sample-token').length,g.bank.length-g.examples.length);
 const gap=d.querySelector('.mh-gap.sample-drop'),token=d.querySelector('.sample-token:not(:disabled)');
 token.click();gap.click();assert(gap.classList.contains('filled'));
 gap.click();assert(!gap.classList.contains('filled'));assert.equal(fixed.textContent,heading.text);
 assert.equal(w.IELTSData.numbers(g).length,g.questions.length);
 await w.happyDOM.abort();console.log('PASS fixed heading example, movable answers, unchanged question count:',id);
}
