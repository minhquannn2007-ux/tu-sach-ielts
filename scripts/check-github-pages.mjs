import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve('dist');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'lesson-catalog.json')));
const norm=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
const ids=new Set();
for(const c of catalog){
 assert(!ids.has(c.id),'Duplicate catalog ID '+c.id);ids.add(c.id);
 const lesson=JSON.parse(fs.readFileSync(path.join(root,'lessons',c.id+'.json')));
 assert.equal(c.title,lesson.title);assert.equal(c.part,lesson.part);
 assert.equal(c.count,c.part===3?14:13);
 assert(fs.existsSync(path.join(root,c.cover.asset)),'Missing cover '+c.id);
 for(const group of lesson.groups){
  if(group.diagram?.asset)assert(fs.existsSync(path.join(root,group.diagram.asset)),'Missing diagram '+c.id);
  if(group.flow?.arrow)assert(fs.existsSync(path.join(root,group.flow.arrow)),'Missing linear flow arrow '+c.id);
  for(const arrow of Object.values(group.flow?.arrows||{}))if(typeof arrow==='string'&&arrow.startsWith('assets/'))assert(fs.existsSync(path.join(root,arrow)));
 }
}
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const links=[...index.matchAll(/class="open-lesson" href="([^"]+)"/g)].map(m=>m[1]);
for(const url of links)assert(fs.existsSync(path.join(root,url)),'Missing legacy page '+url);
for(const f of ['index.html','exam.html','full-test.html','reading-sample.html','question-template.css','zoom-layout.css'])assert(fs.existsSync(path.join(root,f)));
console.log(`PASS GitHub Pages: ${catalog.length} structured + ${links.length} legacy lessons, catalog and local assets.`);
