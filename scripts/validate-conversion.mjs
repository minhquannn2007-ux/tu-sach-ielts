/* Structural validation for private converter drafts. Does not approve source review. */
import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');const dir=process.argv[2];if(!dir)throw new Error('Pass the private drafts directory');
const ctx={};vm.runInNewContext(fs.readFileSync(path.join(root,'dist/exam-data.js'),'utf8'),ctx);let invalid=0;const reports=[];
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.json'))){const original=JSON.parse(fs.readFileSync(path.join(dir,f))),d=structuredClone(original);d.status='reviewed';for(const g of d.groups)if(g.noteLayout)g.noteLayout.sourceVerified=true;const errors=ctx.IELTSData.validate(d);if(errors.length)invalid++;reports.push({file:f,lessonId:d.id,errors,approved:false});}
console.log(JSON.stringify({checked:reports.length,invalid,approved:0,reports}));if(invalid)process.exitCode=1;
