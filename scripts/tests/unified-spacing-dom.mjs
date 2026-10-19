// HAPPY_DOM_MODULE=/path/to/happy-dom/lib/index.js node scripts/tests/unified-spacing-dom.mjs
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const {Window}=await import(pathToFileURL(process.env.HAPPY_DOM_MODULE));
const read=f=>fs.readFileSync('dist/'+f,'utf8');
const css=read('reading-sample.html').match(/<style id="ielts-question-template">([\s\S]*?)<\/style>/)[1];
const generated=read('question-template.css').trim().split('\n').slice(1).join('\n');assert.equal(generated,css.trim());
for(const file of ['exam.html',...fs.readdirSync('dist/bai').filter(f=>f.endsWith('.html')).map(f=>'bai/'+f)]){
 const html=read(file);assert(!/mh-help|mh-close|Matching Headings help/.test(html),file+' removes Help completely');
 for(const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))if(script[1].trim())new vm.Script(script[1],{filename:file});
 const w=new Window({settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true,disableJavaScriptEvaluation:true}});
 w.document.write(html);const style=w.document.createElement('style');style.textContent=css;w.document.head.append(style);
 w.document.documentElement.dataset.examTextSize='regular';w.document.documentElement.style.setProperty('--exam-text-scale','1');
 const title=w.document.querySelector('#passage>.passage-title');
 if(title){assert.equal(title.previousElementSibling,null,file+' title starts passage');assert(['24px','calc(24px * 1)'].includes(w.getComputedStyle(title).marginTop),file+' title top spacing')}
 for(const sep of w.document.querySelectorAll('#qpanel>.sep')){const s=w.getComputedStyle(sep);assert.equal(s.marginTop,'36px');assert.equal(s.marginBottom,'36px');assert.equal(s.height,'0px')}
 const group=w.document.createElement('section');group.className='exam-group';w.document.querySelector('#qpanel').append(group);assert.equal(w.getComputedStyle(group).marginBottom,'72px',file+' shared group spacing');
 await w.happyDOM.close();console.log('PASS unified title/group spacing and no Help:',file);
}
assert(!read('exam-engine.css').includes('margin-bottom:34px'),'no conflicting engine group margin');
assert(read('full-test.js').includes("f.src='exam.html?lesson='"),'Full Test uses shared exam layout');
