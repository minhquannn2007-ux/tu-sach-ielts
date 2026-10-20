import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root=path.resolve('dist'),catalog=JSON.parse(fs.readFileSync(path.join(root,'lesson-catalog.json'))),overrides=JSON.parse(fs.readFileSync(path.join(root,'cover-overrides.json'))),withdrawals=JSON.parse(fs.readFileSync(path.join(root,'content-withdrawals.json')));
const entries=catalog.map(d=>({id:d.id,asset:d.cover.asset}));
for(const article of fs.readFileSync(path.join(root,'index.html'),'utf8').match(/<article\b[\s\S]*?<\/article>/g)||[]){
 const id=article.match(/class="open-lesson" href="([^"]+)"/)?.[1],asset=article.match(/<img[^>]+src="([^"]+)"/)?.[1];assert(id&&asset,'Missing legacy card');entries.push({id,asset:overrides[id]?.asset||asset});
}
const seen=new Map(),ids=new Set(entries.map(d=>d.id));
for(const d of entries){assert(!withdrawals[d.id],'Withdrawn lesson in catalog: '+d.id);const bytes=d.asset.startsWith('data:')?Buffer.from(d.asset.split(',')[1],'base64'):fs.readFileSync(path.join(root,d.asset)),hash=crypto.createHash('sha256').update(bytes).digest('hex');assert(!seen.has(hash),`Repeated cover: ${seen.get(hash)} / ${d.id}`);seen.set(hash,d.id);}
for(const [id,c] of Object.entries(overrides)){assert(ids.has(id),'Orphan cover: '+id);assert(c.credit&&c.source&&c.license&&c.licenseUrl,'Incomplete photo attribution: '+id);assert(/^https:\/\/commons.wikimedia.org\//.test(c.source),'Unexpected cover source: '+id);}
for(const id of Object.keys(withdrawals))assert(!fs.existsSync(path.join(root,'lessons',id+'.json')),'Withdrawn JSON still accessible: '+id);
console.log(`PASS ${entries.length} active cards with ${seen.size} distinct cover images; ${Object.keys(withdrawals).length} withdrawn lessons excluded.`);
