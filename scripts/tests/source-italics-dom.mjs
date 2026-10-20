import fs from 'node:fs';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
const {Window}=await import(pathToFileURL(process.env.HAPPY_DOM_MODULE));
const ids=fs.readdirSync('dist/lessons').filter(n=>n.endsWith('.json')).map(n=>JSON.parse(fs.readFileSync('dist/lessons/'+n))).filter(d=>d.paragraphs.some(p=>p.italicRanges?.length));
assert(ids.length>0);
for(const full of [false,true])for(const data of ids){
 const w=new Window({url:'https://test.example/exam.html'+(full?'?full=1':''),settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true,disableJavaScriptEvaluation:true}});
 if(full)Object.defineProperty(w,'parent',{value:{postMessage(){}},configurable:true});w.HTMLElement.prototype.scrollIntoView=function(){};
 const d=w.document;d.write(fs.readFileSync('dist/exam.html','utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''));w.eval(fs.readFileSync('dist/exam-data.js','utf8'));w.eval(fs.readFileSync('dist/exam-engine.js','utf8'));await w.IELTSExam.boot(data,{utilities:false});
 data.paragraphs.forEach((p,i)=>{const row=d.getElementById('para'+i);const copy=row.cloneNode(true);copy.querySelectorAll('.para-lbl').forEach(e=>e.remove());const content=p.blocks?.length>1?[...copy.children].map(e=>e.textContent).join(' '):copy.textContent;assert.equal(content,p.text,data.id+' text '+i);for(const r of p.italicRanges||[]){const expected=p.text.slice(r.start,r.end);assert([...row.querySelectorAll('em.source-italic')].some(e=>expected.includes(e.textContent)),data.id+' italic '+expected)}});
 const plain=structuredClone(data);plain.paragraphs.forEach(p=>delete p.italicRanges);assert.equal(w.IELTSGrading.sourceText(data),w.IELTSGrading.sourceText(plain),'Formatting must not invalidate evidence-bound answer keys');
 const bad=structuredClone(data);bad.paragraphs[0].italicRanges=[{start:0,end:bad.paragraphs[0].text.length+1}];assert(w.IELTSData.validate(bad).includes('Invalid source italic ranges'));
 const overlap=structuredClone(data);overlap.paragraphs[0].italicRanges=[{start:0,end:5},{start:2,end:6}];assert(w.IELTSData.validate(overlap).includes('Invalid source italic ranges'));
 await w.happyDOM.abort();
}
console.log('PASS source italics for '+ids.length+' lessons in single and Full Test, exact text, block offsets, invalid range rejection and stable grading fingerprint');
// Evidence spanning plain/italic nodes and annotation deletion preserve style.
{
 const w=new Window({url:'https://test.example/exam.html',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true,disableJavaScriptEvaluation:true}});w.HTMLElement.prototype.scrollIntoView=function(){};w.HTMLElement.prototype.scrollTo=function(){};const d=w.document;
 d.write(fs.readFileSync('dist/exam.html','utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''));for(const name of ['exam-data.js','exam-engine.js'])w.eval(fs.readFileSync('dist/'+name,'utf8'));
 const data=JSON.parse(fs.readFileSync('dist/lessons/p1-the-chemical-element-phosphorus.json'));const quote=data.key['1'].evidence[0].quote,at=data.paragraphs[0].text.indexOf(quote);data.paragraphs[0].italicRanges=[{start:at+8,end:at+20}];await w.IELTSExam.boot(data,{utilities:false});
 const paragraph=d.getElementById('para0'),plain=paragraph.textContent,italicText=[...paragraph.querySelectorAll('em')].map(e=>e.textContent).join('');
 for(const name of ['exam-tools.js','exam-behavior.js'])w.eval(fs.readFileSync('dist/'+name,'utf8'));
 const selectionStart=plain.indexOf(quote)+2,selectionEnd=selectionStart+30,walker=d.createTreeWalker(paragraph,w.NodeFilter.SHOW_TEXT),range=d.createRange();let node,cursor=0,started=false;
 while(node=walker.nextNode()){const next=cursor+node.textContent.length;if(!started&&selectionStart<next){range.setStart(node,selectionStart-cursor);started=true}if(started&&selectionEnd<=next){range.setEnd(node,selectionEnd-cursor);break}cursor=next}
 w.getSelection().removeAllRanges();w.getSelection().addRange(range);paragraph.dispatchEvent(new w.MouseEvent('mouseup',{bubbles:true,clientX:100,clientY:100}));d.getElementById('sel-highlight-btn').click();const hl=paragraph.querySelector('.hl');assert(hl);hl.dispatchEvent(new w.MouseEvent('mouseup',{bubbles:true}));d.querySelector('.annotation-delete').click();assert.equal(paragraph.textContent,plain);assert.equal([...paragraph.querySelectorAll('em')].map(e=>e.textContent).join(''),italicText);
 w.IELTSExam.finishFull();w.IELTSExam.explain(1);const hit=d.querySelector('#para0 .evidence-hit');assert(hit);assert.equal(hit.textContent,quote);assert(hit.querySelector('em.source-italic'));assert.equal(d.getElementById('para0').textContent,plain);await w.happyDOM.abort();
}
console.log('PASS evidence highlights across nested inline italics');
