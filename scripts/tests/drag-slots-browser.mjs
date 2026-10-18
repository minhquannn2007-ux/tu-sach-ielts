/* PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs CHROMIUM_EXECUTABLE=/path/to/chromium node scripts/tests/drag-slots-browser.mjs */
import fs from 'node:fs';import path from 'node:path';import http from 'node:http';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE));const root=path.resolve('dist'),out=process.env.OPTIONS_SCREENSHOTS||'/tmp/exam-options-check';fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{let file=path.join(root,decodeURIComponent(new URL(req.url,'http://x').pathname));if(file.endsWith('/'))file+='index.html';if(!fs.existsSync(file)){res.writeHead(404);res.end();return}const types={'.js':'application/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE,args:['--no-sandbox','--disable-gpu']}),context=await browser.newContext({viewport:{width:1920,height:946}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
async function enter(url){await page.goto(base+url);await page.locator('#duration-minutes').fill('10');await page.locator('.duration-form button').click();await page.locator('.exam-submit').first().waitFor();if(!url.includes('full-test'))await page.locator('style#ielts-question-template').waitFor({state:'attached'})}
async function choose(label){await page.locator('[data-exam-options]').click();await page.getByRole('button',{name:'Contrast',exact:true}).click();await page.getByRole('radio',{name:label,exact:true}).click();await page.getByRole('button',{name:'Close options'}).click()}

async function drag(from,to){await from.scrollIntoViewIfNeeded();const a=await from.boundingBox();assert(a);await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();await page.mouse.move(a.x+a.width/2+6,a.y+a.height/2,{steps:2});await to.scrollIntoViewIfNeeded();const b=await to.boundingBox();assert(b);await page.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:15});await page.mouse.up();await page.waitForTimeout(40)}

async function check(bankSel,tokenSel,dropSel,scope=page){
 const bank=scope.locator(bankSel).first(),tokens=scope.locator(tokenSel),token=tokens.first(),drop=scope.locator(dropSel).first();
 await bank.scrollIntoViewIfNeeded();const before=await tokens.nth(1).evaluate(e=>{const a=e.getBoundingClientRect(),b=e.parentElement.getBoundingClientRect();return [a.x-b.x,a.y-b.y]});assert.equal(await token.evaluate(e=>getComputedStyle(e).cursor),'move');
 await drag(token,drop);assert(await drop.evaluate(e=>e.classList.contains('filled')),'placed');
 await bank.scrollIntoViewIfNeeded();const after=await tokens.nth(1).evaluate(e=>{const a=e.getBoundingClientRect(),b=e.parentElement.getBoundingClientRect();return [a.x-b.x,a.y-b.y]});assert(before.every((v,i)=>Math.abs(v-after[i])<1),'next bank item must keep position');
 await drop.click();assert(await drop.evaluate(e=>e.classList.contains('filled')),'click must retain answer');assert.equal(await drop.evaluate(e=>getComputedStyle(e).cursor),'move');
 if(await scope.locator(dropSel).count()>1){const next=scope.locator(dropSel).nth(1);await drag(drop,next);assert(!(await drop.evaluate(e=>e.classList.contains('filled'))));assert(await next.evaluate(e=>e.classList.contains('filled')));await drag(next,drop);}
 // Invalid destination keeps the answer; only a return to its bank removes it.
 await drag(drop,scope.locator('.passage-para').first());assert(await drop.evaluate(e=>e.classList.contains('filled')),'invalid drag retains answer');
 await drag(drop,bank);assert(!(await drop.evaluate(e=>e.classList.contains('filled'))),'drag back clears answer');assert.equal(await token.evaluate(e=>getComputedStyle(e).visibility),'visible');
}
try{
 await page.goto(base+'/reading-sample.html');
 
 for(const bank of await page.locator('.sample-bank').all()){const kind=await bank.getAttribute('data-kind');if(await page.locator('.sample-drop[data-kind="'+kind+'"]').count())await check('.sample-bank[data-kind="'+kind+'"]','.sample-token[data-kind="'+kind+'"]','.sample-drop[data-kind="'+kind+'"]')}
 for(const [file,bank,token,drop] of [
 ['ielts_p2_trail_artist.html','.me-endingbank','.me-ending','.me-drop'],
 ['green_fingers_and_green_thoughts_ielts.html','.dnd-wordbank','.dnd-word','.dnd-drop'],
 ['ielts_p3_body_clock.html','.dnd-wordbank','.dnd-word','.dnd-drop'],
 ['john_ray_study_of_plants_matching_headings.html','.mh-bank','.mh-heading','.mh-gap']]){
 await enter('/bai/'+file);console.log('legacy',file);await check(bank,token,drop);
 }
 for(const id of ['p2-arctic-foxes','p3-travelling-plants','p3-the-antikythera-mechanism']){
 await enter('/exam.html?lesson='+id);console.log('shared',id);for(const contrast of ['Black on white','White on black','Yellow on black']){await choose(contrast);await check('.sample-bank','.sample-token','.sample-drop');}
 }
 await enter('/full-test.html?mode=manual&p1=p1-the-treadle-pump&p2=p2-arctic-foxes&p3=p3-travelling-plants');await page.locator('#full-loading').waitFor({state:'hidden'});
 for(const [part,id] of [[2,'p2-arctic-foxes'],[3,'p3-travelling-plants']]){
 await page.locator('.bb-part[data-part="'+part+'"]').click();const frame=page.frames().find(f=>f.url().includes('lesson='+id));console.log('full',id);await check('.sample-bank','.sample-token','.sample-drop',frame);
 }
 assert(!errors.length,errors.join('\n'));console.log('PASS stable slots, move cursor, click retention, invalid drag and drag back');
}finally{await browser.close();server.close()}
