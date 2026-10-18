import fs from 'node:fs';import assert from 'node:assert/strict';
const {Window}=await import(process.env.HAPPY_DOM_MODULE||'happy-dom');
const w=new Window({url:'https://test.example/exam.html',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true,disableJavaScriptEvaluation:true}});w.confirm=()=>true;w.HTMLElement.prototype.scrollIntoView=function(){};w.document.write(fs.readFileSync('dist/exam.html','utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''));w.eval(fs.readFileSync('dist/exam-data.js','utf8'));w.eval(fs.readFileSync('dist/exam-engine.js','utf8'));
let data=JSON.parse(fs.readFileSync('dist/lessons/p1-a-watchful-eye-on-bridges.json'));await w.IELTSExam.boot(data,{utilities:false});let d=w.document,group=d.querySelector('[data-question-type=diagram]');assert.equal(group.querySelectorAll('.sample-token').length,7);assert.equal(group.querySelectorAll('input').length,0);const token=group.querySelector('[data-value=G]'),a=group.querySelector('[data-q="5"]'),b=group.querySelector('[data-q="6"]');token.click();a.click();assert.equal(w.IELTSExam.values()[4],'G');assert(a.textContent.includes('microwave dish'));a.click();assert.equal(w.IELTSExam.values()[4],'');assert(!token.classList.contains('used'));token.click();b.click();assert.equal(w.IELTSExam.values()[5],'G');assert(!/^[A-G]\s/.test(token.textContent));
data=JSON.parse(fs.readFileSync('dist/lessons/p1-the-olympic-torch.json'));await w.IELTSExam.boot(data,{utilities:false});d=w.document;const inputs=d.querySelectorAll('input[name=q13]');assert.equal(inputs.length,2);inputs[0].value='first';inputs[1].value='second';assert.equal(w.IELTSExam.values()[12],'first second');assert.equal(d.querySelectorAll('.res-row').length,7);assert(d.querySelector('.researchers').textContent.includes('Athens Olympics (2004)'));const broken=structuredClone(data);broken.groups.find(g=>g.type==='diagram').diagram.captions[0].x=-1;assert(w.IELTSData.validate(broken).includes('Invalid diagram label coordinates'));
data=JSON.parse(fs.readFileSync('dist/lessons/p1-the-history-of-cakes-at-weddings.json'));await w.IELTSExam.boot(data,{utilities:false});assert.equal(d.querySelectorAll('.note-comp-table tr').length,2);assert.equal(d.querySelectorAll('.note-comp-table td strong').length,2);assert.equal(d.querySelectorAll('.note-comp-table th').length,2);w.happyDOM.abort();console.log('PASS diagram word-bank return/move, multi-blank answer, source bank repair, label coordinates and two-column note styling.');
// Geometry is checked in the fixed design canvas; no browser word wrapping is
// permitted to change these source-specific caption lines.
for(const l of JSON.parse(fs.readFileSync('import/mass-published-33.json')).lessons){
 const data=JSON.parse(fs.readFileSync('dist/lessons/'+l.lessonId+'.json'));await w.IELTSExam.boot(data,{utilities:false});
 const g=data.groups.find(g=>g.type==='diagram'),r=g.diagram,figure=w.document.querySelector('.reviewed-diagram-figure');
 assert.equal(r.layoutVersion,2);assert.equal(figure.style.width,r.width+'px');assert.equal(figure.querySelector('.shared-diagram').style.aspectRatio.replace(/\s/g,''),r.width+'/'+r.height);assert.equal(figure.querySelectorAll('.diagram-label').length,r.captions.length);
 if(g.title)assert.equal(figure.querySelector('.diagram-title').textContent,g.title);
 if(data.id==='p1-tikopia'){
  assert.equal(figure.querySelector('.diagram-title').textContent,'Pigment production');
  const chisel=figure.querySelector('.diagram-label[role="heading"]');
  assert.equal(chisel.textContent,'Chisel');assert.equal(chisel.style.getPropertyPriority('font'),'important');assert.match(chisel.style.getPropertyValue('font'),/700 18px/);
  assert.equal(figure.querySelectorAll('input[name=q5]').length,1);assert.equal(figure.querySelectorAll('input[name=q9]').length,1);
 }

 const boxes=r.captions.map(c=>({x:c.x*r.width/100,y:c.y*r.height/100,w:c.width*r.width/100,h:c.lineCount*30}));
 for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j],ix=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x),iy=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y);assert(ix<=1||iy<=1,'Caption overlap in '+data.id)}
 if(data.id.includes('lake-bosumtwi'))assert(!r.captions.some(c=>/R\/V|CENTRAL UPLIFT/.test(c.text)));
 const wrong=structuredClone(data);wrong.groups.find(g=>g.type==='diagram').diagram.image.height=200;assert(w.IELTSData.validate(wrong).includes('Invalid measured diagram canvas'));
}
w.happyDOM.abort();console.log('PASS 16 measured canvas boundaries, caption separation, centred-title containers and retained Lake raster labels.');
