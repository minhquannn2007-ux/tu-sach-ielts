/* PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs CHROMIUM_EXECUTABLE=/path/to/chromium node scripts/tests/summary-states-browser.mjs */
import fs from 'node:fs';import path from 'node:path';import http from 'node:http';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE));const root=path.resolve('dist'),out=process.env.OPTIONS_SCREENSHOTS||'/tmp/exam-options-check';fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{let file=path.join(root,decodeURIComponent(new URL(req.url,'http://x').pathname));if(file.endsWith('/'))file+='index.html';if(!fs.existsSync(file)){res.writeHead(404);res.end();return}const types={'.js':'application/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE,args:['--no-sandbox','--disable-gpu']}),context=await browser.newContext({viewport:{width:1920,height:946}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
async function enter(url){await page.goto(base+url);await page.locator('#duration-minutes').fill('10');await page.locator('.duration-form button').click();await page.locator('.exam-submit').first().waitFor();if(!url.includes('full-test'))await page.locator('style#ielts-question-template').waitFor({state:'attached'})}
async function choose(label){await page.locator('[data-exam-options]').click();await page.getByRole('button',{name:'Contrast',exact:true}).click();await page.getByRole('radio',{name:label,exact:true}).click();await page.getByRole('button',{name:'Close options'}).click()}


const palette=[['Black on white','rgb(65, 142, 200)'],['White on black','rgb(189, 112, 57)'],['Yellow on black','rgb(0, 255, 255)']];
async function states(scope=page){
 const headings=scope.locator('.mh-heading:not(.used)'),gap=scope.locator('.mh-gap:not(.filled)').first();
 for(const [contrast,accent] of palette){
 await choose(contrast);await page.mouse.move(1900,1);
 for(const g of await scope.locator('.mh-gap:not(.filled)').all())assert.equal(await g.evaluate(e=>getComputedStyle(e).borderTopColor),'rgb(65, 142, 200)','idle '+contrast);
 const h=headings.nth(0),other=headings.nth(1);await h.click();await other.hover();
 for(const token of [h,other]){assert.equal(await token.evaluate(e=>getComputedStyle(e).borderTopColor),accent,'hover/focus '+contrast);assert.equal(await token.evaluate(e=>getComputedStyle(e).outlineStyle),'none')}
 if(contrast==='Yellow on black')assert.equal(await other.evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(41, 41, 41)');
 const all=await headings.evaluateAll(es=>es.filter(e=>e.matches(':hover,:focus')).length);assert(all<=2);assert(all===2);
 await h.scrollIntoViewIfNeeded();const a=await h.boundingBox();await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();await page.mouse.move(a.x+a.width/2+12,a.y+a.height/2,{steps:3});
 assert.equal(await scope.locator('body').evaluate(e=>e.classList.contains('exam-heading-dragging')),true);
 for(const g of await scope.locator('.mh-gap:not(.filled)').all()){assert.equal(await g.evaluate(e=>getComputedStyle(e).borderTopColor),accent,'all drag targets '+contrast);assert.equal(await g.evaluate(e=>getComputedStyle(e).borderTopStyle),'dashed')}
 await gap.scrollIntoViewIfNeeded();const targetId=await gap.getAttribute('data-q');const placedGap=scope.locator('.mh-gap[data-q="'+targetId+'"]');const b=await gap.boundingBox();await page.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:12});assert.equal(await placedGap.evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(51, 51, 51)','hovered target fill');await page.mouse.up();
 assert(await placedGap.evaluate(e=>e.classList.contains('filled')));assert.equal(await placedGap.evaluate(e=>getComputedStyle(e).borderTopColor),accent,'placed '+contrast);assert.equal(await placedGap.evaluate(e=>getComputedStyle(e).borderTopStyle),'solid');
 const placed=scope.locator('.mh-gap.filled').first();await placed.scrollIntoViewIfNeeded();const c=await placed.boundingBox();await page.mouse.move(c.x+c.width/2,c.y+c.height/2);await page.mouse.down();await page.mouse.move(c.x+c.width/2+12,c.y+c.height/2,{steps:3});const bank=scope.locator('.mh-bank');await bank.scrollIntoViewIfNeeded();const d=await bank.boundingBox();await page.mouse.move(d.x+d.width/2,d.y+d.height/2,{steps:12});await page.mouse.up();assert.equal(await scope.locator('.mh-gap.filled').count(),0);
 }
}
async function summaryStates(scope=page){
 const headings=scope.locator('.dnd-word:not(.used)'),gap=scope.locator('.dnd-drop:not(.filled)').first();
 for(const [contrast,accent] of palette){
 await choose(contrast);await page.mouse.move(1900,1);
 const dimensions=await gap.evaluate(e=>{const r=e.getBoundingClientRect();e.style.setProperty('border','1px solid #888','important');const old=e.getBoundingClientRect();e.style.removeProperty('border');return [r.width,r.height,old.width,old.height]});assert.equal(dimensions[0],dimensions[2]);assert.equal(dimensions[1],dimensions[3]);
 for(const g of await scope.locator('.dnd-drop:not(.filled)').all())assert.equal(await g.evaluate(e=>getComputedStyle(e).borderTopColor),'rgb(65, 142, 200)','idle '+contrast);
 const h=headings.nth(0),other=headings.nth(1);await h.click();await other.hover();
 for(const token of [h,other]){assert.equal(await token.evaluate(e=>getComputedStyle(e).borderTopColor),accent,'hover/focus '+contrast);assert.equal(await token.evaluate(e=>getComputedStyle(e).outlineStyle),'none')}
 if(contrast==='Yellow on black')assert.equal(await other.evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(41, 41, 41)');
 const all=await headings.evaluateAll(es=>es.filter(e=>e.matches(':hover,:focus')).length);assert(all<=2);assert(all===2);
 await h.scrollIntoViewIfNeeded();const a=await h.boundingBox();await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();await page.mouse.move(a.x+a.width/2+12,a.y+a.height/2,{steps:3});
 assert.equal(await scope.locator('body').evaluate(e=>e.classList.contains('exam-summary-dragging')),true);
 for(const g of await scope.locator('.dnd-drop:not(.filled)').all()){assert.equal(await g.evaluate(e=>getComputedStyle(e).borderTopColor),accent,'all drag targets '+contrast);assert.equal(await g.evaluate(e=>getComputedStyle(e).borderTopStyle),'dashed')}
 await gap.scrollIntoViewIfNeeded();const targetId=await gap.getAttribute('data-q');const placedGap=scope.locator('.dnd-drop[data-q="'+targetId+'"]');const b=await gap.boundingBox();await page.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:12});assert.equal(await placedGap.evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(51, 51, 51)','hovered target fill');await page.mouse.up();
 assert(await placedGap.evaluate(e=>e.classList.contains('filled')));assert.equal(await placedGap.evaluate(e=>getComputedStyle(e).borderTopColor),accent,'placed '+contrast);assert.equal(await placedGap.evaluate(e=>getComputedStyle(e).borderTopStyle),'solid');
 const placed=scope.locator('.dnd-drop.filled').first();await placed.scrollIntoViewIfNeeded();const c=await placed.boundingBox();await page.mouse.move(c.x+c.width/2,c.y+c.height/2);await page.mouse.down();await page.mouse.move(c.x+c.width/2+12,c.y+c.height/2,{steps:3});const bank=scope.locator('.dnd-wordbank');await bank.scrollIntoViewIfNeeded();const d=await bank.boundingBox();await page.mouse.move(d.x+d.width/2,d.y+d.height/2,{steps:12});await page.mouse.up();assert.equal(await scope.locator('.dnd-drop.filled').count(),0);
 }
}
try{
 await enter('/exam.html?lesson=p2-arctic-foxes');await states();console.log('PASS shared headings, three contrasts');
 await enter('/bai/john_ray_study_of_plants_matching_headings.html');await states();console.log('PASS original HTML headings, three contrasts');
 await enter('/full-test.html?mode=manual&p1=p1-the-treadle-pump&p2=p2-arctic-foxes&p3=p3-travelling-plants');await page.locator('#full-loading').waitFor({state:'hidden'});await page.locator('.bb-part[data-part="2"]').click();await states(page.frames().find(f=>f.url().includes('lesson=p2-arctic-foxes')));console.log('PASS Full Test headings, three contrasts');
 await enter('/exam.html?lesson=p3-the-antikythera-mechanism');await summaryStates();console.log('PASS shared summary, all contrasts and preserved dimensions');
 for(const file of ['green_fingers_and_green_thoughts_ielts.html','ielts_p3_body_clock.html']){await enter('/bai/'+file);await summaryStates();console.log('PASS legacy summary '+file)}
 await enter('/full-test.html?mode=manual&p1=p1-the-treadle-pump&p2=p2-arctic-foxes&p3=p3-the-antikythera-mechanism');await page.locator('#full-loading').waitFor({state:'hidden'});await page.locator('.bb-part[data-part="3"]').click();await summaryStates(page.frames().find(f=>f.url().includes('lesson=p3-the-antikythera-mechanism')));console.log('PASS Full Test summary, all contrasts');
 assert(!errors.length,errors.join('\n'));
}finally{await browser.close();server.close()}
