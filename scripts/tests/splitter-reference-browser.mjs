/* PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs CHROMIUM_EXECUTABLE=/path/to/chromium node scripts/tests/exam-options-browser.mjs */
import fs from 'node:fs';import path from 'node:path';import http from 'node:http';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE));const root=path.resolve('dist'),out=process.env.OPTIONS_SCREENSHOTS||'/tmp/exam-options-check';fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{let file=path.join(root,decodeURIComponent(new URL(req.url,'http://x').pathname));if(file.endsWith('/'))file+='index.html';if(!fs.existsSync(file)){res.writeHead(404);res.end();return}const types={'.js':'application/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE,args:['--no-sandbox','--disable-gpu']}),context=await browser.newContext({viewport:{width:1920,height:946}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
const color=(selector,property='backgroundColor')=>page.locator(selector).first().evaluate((e,p)=>getComputedStyle(e)[p],property);
async function enter(url){await page.goto(base+url);await page.locator('#duration-minutes').fill('10');await page.locator('.duration-form button').click();await page.locator('.exam-submit').first().waitFor();if(!url.includes('full-test'))await page.locator('style#ielts-question-template').waitFor({state:'attached'})}
async function choose(label){await page.locator('[data-exam-options]').click();await page.getByRole('button',{name:'Contrast',exact:true}).click();await page.getByRole('radio',{name:label,exact:true}).click();await page.getByRole('button',{name:'Close options'}).click()}

async function check(scope=page){
 for(const [label,edge,fill,glyph] of [['Black on white','rgb(42, 108, 150)','rgb(225, 225, 225)','rgb(255, 255, 255)'],['White on black','rgb(213, 147, 105)','rgb(30, 30, 30)','rgb(0, 0, 0)'],['Yellow on black','rgb(42, 108, 150)','rgb(225, 225, 225)','rgb(255, 255, 255)']]){
 await choose(label);const handle=scope.locator('.resize-btn').first(),divider=scope.locator('#divider');await handle.hover();assert((await handle.evaluate(e=>getComputedStyle(e).cursor)).includes('data:image/svg+xml'));
 if(edge){
 for(const sel of ['#passage','#qpanel']){assert.equal(await scope.locator(sel).evaluate(e=>getComputedStyle(e).scrollbarColor),'auto');assert.equal(await scope.locator(sel).evaluate(e=>getComputedStyle(e,'::-webkit-scrollbar-button').display),'none');if(label!=='Black on white')assert.equal(await scope.locator(sel).evaluate(e=>getComputedStyle(e,'::-webkit-scrollbar').width),'17.5px')}
 assert.equal(await handle.evaluate(e=>getComputedStyle(e).borderTopColor),edge);assert.equal(await handle.evaluate(e=>getComputedStyle(e).backgroundColor),fill);const glyphEl=handle.locator('svg polygon,.fa').first();if(await glyphEl.count())assert.equal(await glyphEl.evaluate(e=>getComputedStyle(e)[e.tagName.toLowerCase()==='polygon'?'fill':'color']),edge);
 const r=await divider.boundingBox();await page.mouse.move(r.x+r.width+8,r.y+100);assert.equal(await divider.evaluate(e=>e.classList.contains('splitter-right-hover')),true);assert.equal(await divider.evaluate(e=>getComputedStyle(e,'::after').backgroundColor),label==='Black on white'?'rgb(229, 229, 229)':'rgb(26, 26, 26)');
 await handle.hover();const a=await handle.boundingBox();await page.mouse.down();assert.equal(await handle.evaluate(e=>getComputedStyle(e).backgroundColor),edge);assert.equal(await handle.evaluate(e=>getComputedStyle(e).color),glyph);
 if(await glyphEl.count())assert.equal(await glyphEl.evaluate(e=>getComputedStyle(e)[e.tagName.toLowerCase()==='polygon'?'fill':'color']),glyph);
 const before=await scope.locator('#passage').evaluate(e=>e.getBoundingClientRect().width);await page.mouse.move(a.x+a.width/2+70,a.y+a.height/2,{steps:8});await page.mouse.up();const after=await scope.locator('#passage').evaluate(e=>e.getBoundingClientRect().width);assert(after>before+50,'drag still resizes');assert.equal(await scope.locator('body').evaluate(e=>e.classList.contains('pane-resizing')),false);
 }
 await page.mouse.move(1900,1);assert.equal(await divider.evaluate(e=>e.classList.contains('splitter-right-hover')),false);
 }
 // Both panes keep normal native wheel scrolling.
 for(const sel of ['#passage','#qpanel']){const p=scope.locator(sel);await p.evaluate(e=>e.scrollTop=0);await p.hover();await page.mouse.wheel(0,250);await page.waitForTimeout(120);if(await p.evaluate(e=>e.scrollHeight>e.clientHeight+5))assert((await p.evaluate(e=>e.scrollTop))>0)}
}
try{
 await enter('/exam.html?lesson=p1-the-treadle-pump');await check();console.log('PASS standalone scrollbar, splitter hover/right strip/press, cursor, drag and wheel');
 for(const file of fs.readdirSync('dist/bai').filter(f=>f.endsWith('.html'))){await enter('/bai/'+file);await check();console.log('PASS legacy '+file)}
 await enter('/full-test.html?mode=manual&p1=p1-the-treadle-pump&p2=p2-arctic-foxes&p3=p3-travelling-plants');await page.locator('#full-loading').waitFor({state:'hidden'});await check(page.frames().find(f=>f.url().includes('lesson=p1-the-treadle-pump')));console.log('PASS Full Test');assert(!errors.length,errors.join('\n'));
}finally{await browser.close();server.close()}
