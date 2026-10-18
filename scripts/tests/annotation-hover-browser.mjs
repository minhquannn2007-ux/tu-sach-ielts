/* PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs CHROMIUM_EXECUTABLE=/path/to/chromium node scripts/tests/exam-options-browser.mjs */
import fs from 'node:fs';import path from 'node:path';import http from 'node:http';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE));const root=path.resolve('dist'),out=process.env.OPTIONS_SCREENSHOTS||'/tmp/exam-options-check';fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{let file=path.join(root,decodeURIComponent(new URL(req.url,'http://x').pathname));if(file.endsWith('/'))file+='index.html';if(!fs.existsSync(file)){res.writeHead(404);res.end();return}const types={'.js':'application/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE,args:['--no-sandbox','--disable-gpu']}),context=await browser.newContext({viewport:{width:1920,height:946}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
const color=(selector,property='backgroundColor')=>page.locator(selector).first().evaluate((e,p)=>getComputedStyle(e)[p],property);
async function enter(url){await page.goto(base+url);await page.locator('#duration-minutes').fill('10');await page.locator('.duration-form button').click();await page.locator('.exam-submit').first().waitFor();if(!url.includes('full-test'))await page.locator('style#ielts-question-template').waitFor({state:'attached'})}
async function choose(label){await page.locator('[data-exam-options]').click();await page.getByRole('button',{name:'Contrast',exact:true}).click();await page.getByRole('radio',{name:label,exact:true}).click();await page.getByRole('button',{name:'Close options'}).click()}

const modes=[['Black on white','rgb(115, 115, 115)','rgb(32, 32, 32)','rgb(255, 255, 255)','247, 247, 247',null],['White on black','rgb(140, 140, 140)','rgb(223, 223, 223)','rgb(0, 0, 0)','20, 20, 20','rgb(255, 255, 153)'],['Yellow on black','rgb(179, 179, 0)','rgb(255, 255, 0)','rgb(0, 0, 0)','20, 20, 0','rgb(179, 179, 179)']];
async function check(scope=page){
 for(const [label,idle,hover,base,sibling,highlight] of modes){
 await choose(label);
 const passage=scope.locator('.passage-para').first();
 if(highlight){assert.equal(await passage.evaluate(e=>getComputedStyle(e,'::selection').backgroundColor),'rgb(227, 140, 8)');assert.equal(await passage.evaluate(e=>getComputedStyle(e,'::selection').color),'rgb(0, 0, 0)')}
 await scope.evaluate(()=>{const p=document.getElementById('selection-popup');Object.assign(p.style,{display:'flex',left:'300px',top:'200px'});});
 const note=scope.locator('#sel-note-btn'),mark=scope.locator('#sel-highlight-btn');await page.mouse.move(1900,1);
 for(const b of [note,mark])assert.equal(await b.evaluate(e=>getComputedStyle(e).color),idle);
 for(const [active,other] of [[note,mark],[mark,note]]){
 await active.hover();assert.equal(await active.evaluate(e=>getComputedStyle(e).color),hover);assert.equal(await active.locator('svg').evaluate(e=>getComputedStyle(e).color),hover);assert.equal(await active.evaluate(e=>getComputedStyle(e).backgroundColor),base);assert.equal(await active.evaluate(e=>getComputedStyle(e).backgroundImage),'none');assert.equal(await other.evaluate(e=>getComputedStyle(e).color),idle);assert((await other.evaluate(e=>getComputedStyle(e).backgroundImage)).includes(sibling));
 }
 await page.mouse.move(1900,1);assert.equal(await note.evaluate(e=>getComputedStyle(e).backgroundImage),'none');
 await scope.evaluate(()=>{const p=document.querySelector('.passage-para'),text=[...p.childNodes].find(n=>n.nodeType===3&&n.length>25),r=document.createRange();r.setStart(text,0);r.setEnd(text,20);IELTSAnnotations.highlight(r);});
 const saved=scope.locator('.hl:not([data-exam-note])').first();if(highlight)assert.equal(await saved.evaluate(e=>getComputedStyle(e).backgroundColor),highlight);
 await saved.click();const del=scope.locator('#context-menu .annotation-delete');await del.waitFor({state:'visible'});await del.hover();assert.equal(await del.evaluate(e=>getComputedStyle(e).color),hover);assert.equal(await del.locator('svg').evaluate(e=>getComputedStyle(e).stroke),hover);assert.equal(await del.evaluate(e=>getComputedStyle(e).backgroundColor),base);await del.click();assert.equal(await scope.locator('.hl:not([data-exam-note])').count(),0);
 if(label==='Yellow on black'){
 const number=scope.locator('.tfng-num,.qnum,.ync-num,.mc-num,.choice-number,.tif-num,.order-number').first();await number.click();assert.equal(await number.evaluate(e=>getComputedStyle(e).borderTopColor),'rgb(0, 255, 255)');
 if(scope===page)assert.equal(await page.locator('#bb-dots button.video-current').first().evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(128, 128, 0)');
 }
 }
}
try{
 await enter('/exam.html?lesson=p1-the-treadle-pump');await check();console.log('PASS standalone selection, saved highlights, all tool hover states, cyan questions and unchanged footer');
 for(const file of fs.readdirSync('dist/bai').filter(f=>f.endsWith('.html'))){await enter('/bai/'+file);await check();console.log('PASS legacy '+file)}
 await enter('/full-test.html?mode=manual&p1=p1-the-treadle-pump&p2=p2-arctic-foxes&p3=p3-travelling-plants');await page.locator('#full-loading').waitFor({state:'hidden'});await check(page.frames().find(f=>f.url().includes('lesson=p1-the-treadle-pump')));assert.equal(await page.locator('#bb-dots button.video-current').first().evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(128, 128, 0)');console.log('PASS Full Test');
 assert(!errors.length,errors.join('\n'));
}finally{await browser.close();server.close()}
