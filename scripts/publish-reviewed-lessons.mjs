import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const holds=JSON.parse(fs.readFileSync(path.join(root,'import/source-content-holds.json'),'utf8')).lessons.filter(x=>x.publicationBlocked);
const blockedSourceIds=new Set(holds.map(x=>x.sourceId).filter(Boolean));
const heldSources=new Set(JSON.parse(fs.readFileSync(path.join(root,'import/source-content-holds.json'),'utf8')).lessons.filter(x=>x.publicationBlocked).map(x=>x.job));
const ctx={};vm.runInNewContext(fs.readFileSync(path.join(root,'dist/exam-data.js'),'utf8'),ctx);
const lessons=[];
for(const name of fs.readdirSync(path.join(root,'dist/lessons')).filter(f=>f.endsWith('.json'))){
 const data=JSON.parse(fs.readFileSync(path.join(root,'dist/lessons',name),'utf8'));
 if(heldSources.has(data.conversion?.jobId)||heldSources.has(data.id))throw new Error('Source PDF content hold: '+name);
 if((data.sources||[]).some(s=>blockedSourceIds.has(s.id)))throw new Error('User-rejected source: '+name);
 const errors=ctx.IELTSData.validate(data);if(errors.length)throw new Error(name+': '+errors.join('; '));
 if(name!==data.id+'.json')throw new Error('Filename/id mismatch: '+name);
 if(!data.cover?.asset||!fs.existsSync(path.join(root,'dist',data.cover.asset)))throw new Error('Missing topic cover: '+name);
 lessons.push({id:data.id,title:data.title,part:data.part,count:data.part===3?14:13,types:data.groups.map(g=>g.task==='table'?'Table Completion':({'tfng':'True / False / Not Given','ynng':'Yes / No / Not Given','mc-one':'Multiple Choice — Choose ONE','mc-two':'Multiple Choice — Choose '+(g.selectionCount===3?'THREE':'TWO'),'matching-info':'Matching Information','matching-headings':'Matching Headings','matching-endings':'Matching Sentence Endings','summary-input':g.task==='sentences'?'Sentence Completion':'Summary Completion','summary-drag':'Summary Completion','notes':g.task==='summary'?'Summary Completion':'Note Completion','diagram':'Diagram Labelling','flow-chart':'Flow-chart Completion','short-answer':'Short Answer Questions','matching-features':g.targetName==='statement'?'Matching Statements':g.targetName==='organisation'?'Matching Features':'Matching Names'})[g.type]).filter((v,i,a)=>a.indexOf(v)===i),cover:data.cover});
}
lessons.sort((a,b)=>a.title.localeCompare(b.title,'en',{sensitivity:'base',numeric:true}));
fs.writeFileSync(path.join(root,'dist/lesson-catalog.json'),JSON.stringify(lessons,null,2));
console.log('Validated and indexed '+lessons.length+' reviewed lessons.');
