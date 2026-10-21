// HAPPY_DOM_MODULE=/path/to/happy-dom/lib/index.js node scripts/tests/passage-titles-dom.mjs
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const {Window}=await import(pathToFileURL(process.env.HAPPY_DOM_MODULE));
const read=f=>fs.readFileSync('dist/'+f,'utf8');
const audit=JSON.parse(fs.readFileSync('import/passage-title-audit/2026-10-21.json'));
const selected=audit.lessons.filter(r=>['confirmed-absent','corrected-printed-wording'].includes(r.status));
selected.push({id:'p1-the-chemical-element-phosphorus'});
for(const mode of ['single','full'])for(const r of selected){
 const d=JSON.parse(read('lessons/'+r.id+'.json'));
 const w=new Window({url:'https://test.example/exam.html',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true,disableJavaScriptEvaluation:true}});
 w.HTMLElement.prototype.scrollIntoView=function(){};w.HTMLElement.prototype.scrollTo=function(){};
 w.document.write(read('exam.html').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''));
 for(const f of ['exam-data.js','exam-engine.js'])w.eval(read(f));
 await w.IELTSExam.boot(d,{utilities:false,fullMode:mode==='full'});
 const title=w.document.querySelector('#passage .passage-title');
 const expected=Object.hasOwn(d,'passageTitle')?d.passageTitle:d.title;
 assert.equal(title?.textContent??null,expected,r.id+' '+mode);
 assert.equal(w.document.querySelectorAll('#passage .passage-para').length,d.paragraphs.length);
 assert(w.document.title.includes(d.title),'Catalog label remains available in browser title');
 const plain=structuredClone(d);delete plain.passageTitle;if(plain.review){delete plain.review.printedTitleChecked;delete plain.review.printedTitleSource;}
 assert.equal(w.IELTSGrading.sourceText(d),w.IELTSGrading.sourceText(plain),'Presentation must not invalidate reviewed answers');
 for(const value of ['',42,{}]){const bad=structuredClone(d);bad.passageTitle=value;assert(w.IELTSData.validate(bad).includes('Invalid printed passage title'));}
 if(d.passageTitle===null){const old=structuredClone(d);delete old.passageTitle;old.conversion.sourceTitleAbsent=true;await w.IELTSExam.boot(old,{utilities:false});assert.equal(w.document.querySelector('#passage .passage-title'),null,'Legacy no-title flag honored');}
 await w.happyDOM.close();
}
assert(read('full-test.js').includes("f.src='exam.html?lesson='"),'Full Test uses shared passage renderer');
assert(read('bai/ielts_p2_goya.html').includes('<div class="passage-title">From princes to paupers: how Goya\'s portraits tell the story of Spain</div>'));
console.log('PASS source titles: all six untitled lessons, two corrected titles, ordinary titled passage, single/Full Test, no blank title block, stable grading hashes, legacy flags and Goya');
