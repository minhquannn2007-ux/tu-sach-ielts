import fs from 'node:fs';
import assert from 'node:assert/strict';
const {Window}=await import(process.env.HAPPY_DOM_MODULE);
const w=new Window({url:'https://example.com/',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true,disableJavaScriptEvaluation:true}}),d=w.document;
d.write(fs.readFileSync('dist/index.html','utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''));
w.HTMLDialogElement.prototype.showModal=function(){this.open=true};
const catalog=JSON.parse(fs.readFileSync('dist/lesson-catalog.json')),covers=JSON.parse(fs.readFileSync('dist/cover-overrides.json')),withdrawals=JSON.parse(fs.readFileSync('dist/content-withdrawals.json'));
w.fetch=async url=>({ok:true,json:async()=>String(url).includes('cover-overrides')?covers:catalog});
w.eval(fs.readFileSync('dist/full-test-core.js','utf8'));w.eval(fs.readFileSync('dist/bookshelf-home.js','utf8')+';window.testBooks=()=>DATA;');
await new Promise(r=>setTimeout(r,30));
const data=w.testBooks();assert.equal(data.length,catalog.length+11);assert.equal(new Set(data.map(x=>x.image)).size,data.length);
for(const [id,c]of Object.entries(covers)){const item=data.find(x=>x.id===id||x.url===id);assert(item,'Missing book '+id);assert.equal(item.image,c.asset);assert.equal(item.cover.source,c.source)}
for(const id of Object.keys(withdrawals))assert(!data.some(x=>x.id===id));
d.getElementById('search').value='Norman Rockwell';d.getElementById('search').dispatchEvent(new w.Event('input'));d.querySelector('.book').click();assert(d.querySelector('.cover-credit a[href="'+covers['p2-norman-rockwell'].source+'"]'));
d.getElementById('full').click();d.getElementById('manual').click();for(const option of d.querySelectorAll('.pick option'))assert(!withdrawals[option.value]);
console.log('PASS bookshelf catalogs, unique photographs, original HTML overrides, attribution and complete Full Test selections.');w.happyDOM.abort();
