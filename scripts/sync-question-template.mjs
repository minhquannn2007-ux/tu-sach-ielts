import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
// Paper positioning words are not part of CBT instructions. Limit the edit to
// instruction containers so reading passages and question prompts stay intact.
function cbtInstructions(html){
 return html.replace(/<(div|p)\b[^>]*class="[^"]*\bsec-inst\b[^"]*"[^>]*>[\s\S]*?<\/\1>/gi,
  block=>block.replace(/Do the following statements agree\b[^?]*\?\s*/gi,'').replace(/(?:,\s*)?\s*\bbelow\b/gi,''));
}
const samplePath=path.join(root,'dist/reading-sample.html');
const sample=cbtInstructions(fs.readFileSync(samplePath,'utf8'));
fs.writeFileSync(samplePath,sample);
const css=sample.match(/<style\s+id="ielts-question-template">([\s\S]*?)<\/style>/)?.[1];
if(!css?.trim())throw new Error('Missing canonical question styles in reading-sample.html');
const types=[...sample.matchAll(/data-question-type="([^"]+)"/g)].map(m=>m[1]);
if(new Set(types).size!==14)throw new Error('The sample must contain all 14 question variants');
fs.writeFileSync(path.join(root,'dist/question-template.css'),'/* Generated from reading-sample.html. Edit the sample, not this file. */\n'+css.trim()+'\n');
for(const name of fs.readdirSync(path.join(root,'dist/bai'))){
 if(!name.endsWith('.html'))continue;
 const filename=path.join(root,'dist/bai',name);let html=cbtInstructions(fs.readFileSync(filename,'utf8'));
 if(!/href="\.\.\/question-template\.css(?:\?[^"]*)?"/.test(html))html=html.replace('</head>','<link rel="stylesheet" href="../question-template.css">\n</head>');
 if(!html.includes('src="../question-template.js"'))html=html.replace('</body>','<script src="../question-template.js"></script>\n</body>');
 fs.writeFileSync(filename,html);
}
console.log('Synced 14 sample variants and all lesson HTML files.');
