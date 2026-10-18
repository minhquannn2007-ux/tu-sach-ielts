/* Shared validation: malformed or unreviewed imports never become playable exams. */
(function(root){
 const types=new Set(['tfng','ynng','mc-one','mc-two','matching-info','matching-headings','matching-endings','summary-input','summary-drag','notes','diagram','short-answer','matching-features','flow-chart']);
 function listTitle(title){const suffix=String(title||'List of Researchers').trim().replace(/^list\s+of\s+/i,'');return 'List of '+suffix.split(/\s+/).map(word=>word.charAt(0).toUpperCase()+word.slice(1).toLowerCase()).join(' ')}
 function numbers(g){return g.type==='mc-two'?(g.numbers||[]):(g.questions||[]).map(q=>q.n)}
 function validate(d){
  const errors=[];if(!d||typeof d!=='object')return ['Invalid lesson data'];
  if(!/^[a-z0-9-]+$/.test(d.id||''))errors.push('Invalid lesson id');
  if(![1,2,3].includes(d.part))errors.push('Invalid passage');
  if(d.mode&& !['practice','graded'].includes(d.mode))errors.push('Invalid lesson mode');
  if(!d.title?.trim()||!d.paragraphs?.length)errors.push('Missing passage');
  if(d.footnotes!==undefined&&(!Array.isArray(d.footnotes)||d.footnotes.some(f=>typeof f!=='string'||!f.trim()||/\s+[*†‡]+\s*[A-Za-z]/.test(f))))errors.push('Each footnote must be a separate entry');
  if(d.subtitle!==undefined&&(typeof d.subtitle!=='string'||/[\r\n]/.test(d.subtitle)))errors.push('Subtitle must be a single paragraph without source line breaks');
  if(!Array.isArray(d.paragraphs)||d.paragraphs.some(p=>!p||typeof p.text!=='string'||!p.text.trim()))return [...errors,'Missing or empty passage paragraph'];
  const sourceParagraphCount=d.review?.sourceParagraphCount??d.conversion?.sourceParagraphCount;if(sourceParagraphCount!==undefined&&sourceParagraphCount!==d.paragraphs.length)errors.push('Passage paragraph count differs from source review');
  if(d.status!=='reviewed')errors.push('Lesson is awaiting review');
  if(!Array.isArray(d.groups)||!d.groups.length)return [...errors,'Missing questions'];
  const actual=[];for(const g of d.groups){
   if(!g||typeof g!=='object'){errors.push('Invalid question group');continue}
   if(g.questions!==undefined&&(!Array.isArray(g.questions)||g.questions.some(q=>!q||typeof q!=='object'))){errors.push('Invalid question list');continue}
   if([g.bank,g.options,...(g.questions||[]).map(q=>q.options)].filter(v=>v!==undefined).some(b=>!Array.isArray(b)||b.some(o=>!o||typeof o!=='object'))){errors.push('Invalid option bank');continue}
   if(g.content!==undefined&&!Array.isArray(g.content)){errors.push('Invalid completion content');continue}
   if(g.noteLayout&&(!Array.isArray(g.noteLayout.rows)||g.noteLayout.rows.some(r=>!r||!Array.isArray(r.runs)||r.runs.some(t=>!t||typeof t.text!=='string')))){errors.push('Invalid source note layout');continue}
   if(typeof g.sourceInstructions!=='string'){errors.push('Missing source instructions');continue}
   if(!types.has(g.type))errors.push('Unsupported type '+g.type);if(!g.sourceInstructions?.trim())errors.push('Missing source instructions');
   if(g.type==='matching-info'&&(!g.letters?.length||g.paragraphCount!==d.paragraphs.length||g.letters.length!==g.paragraphCount))errors.push('Paragraph count/letters mismatch');
if(g.type==='matching-info'&&typeof g.reuse!=='boolean')errors.push('Answer reuse must be explicit');
   if(g.reuse&&!(/more than once/i.test(g.sourceInstructions)||/you may (?:use|choose) any letter more than one\b/i.test(g.sourceInstructions)))errors.push('Reuse rule is absent from source');
   if(['summary-input','notes','short-answer','diagram','flow-chart'].includes(g.type)&&!g.wordLimit&&!(g.type==='diagram'&&g.bank))errors.push('Missing source word limit');
   if(g.wordLimit&&!g.sourceInstructions.toUpperCase().includes(g.wordLimit))errors.push('Word limit differs from source');
   const scope=g.sourceInstructions.match(/from (?:the )?paragraphs?\s+([A-Z](?:\s*[-–]\s*[A-Z]|(?:\s*,\s*|\s+(?:and|or)\s+)[A-Z])*)/);
   if(scope&&['summary-input','notes','short-answer','diagram','flow-chart'].includes(g.type)&&!g.sourceParagraphs)errors.push('Source paragraph restriction is missing');
   if(scope&&g.sourceParagraphs){let expected=scope[1].match(/[A-Z]/g)||[];if(/[-–]/.test(scope[1])&&expected.length===2)expected=Array.from({length:expected[1].charCodeAt(0)-expected[0].charCodeAt(0)+1},(_,i)=>String.fromCharCode(expected[0].charCodeAt(0)+i));if(JSON.stringify(expected)!==JSON.stringify(g.sourceParagraphs)||((g.sourceParagraphJoiner||'and')!==(/\bor\b/.test(scope[1])?'or':'and')))errors.push('Paragraph restriction differs from source');}
   if(g.sourceParagraphs&&(!Array.isArray(g.sourceParagraphs)||!g.sourceParagraphs.length||!scope||g.sourceParagraphs.some(l=>!(/^[A-Z]$/.test(l))||!d.paragraphs.some(p=>p.label===l))||!['and','or'].includes(g.sourceParagraphJoiner||'and')))errors.push('Invalid source paragraph restriction');
   if(g.type==='notes'&&d.part===1&&!g.table&&!g.noteLayout?.sourceVerified)errors.push('Note layout must be checked against the source PDF');
   if(g.type==='matching-features'&&(!g.bank?.length||typeof g.reuse!=='boolean'))errors.push('Matching name bank/reuse missing');
   if(g.type==='mc-two'&&(![2,3].includes(g.selectionCount??2)||g.numbers?.length!==(g.selectionCount??2)))errors.push('Multiple-answer count differs from question numbers');
   if(g.type==='mc-two'&&g.selectionCount&&!(new RegExp('choose\\s+'+(g.selectionCount===3?'three':'two')+'\\s+(?:letters|answers)','i')).test(g.sourceInstructions))errors.push('Selected-answer count differs from source');
   for(const bank of [g.bank,g.options,...(g.questions||[]).map(q=>q.options)].filter(Boolean)){if(bank.length&&bank.every(o=>/^[A-Z]$/.test(o.value))&&bank.some((o,i)=>o.value!==String.fromCharCode(65+i)))errors.push('Missing or misordered option code');}
   const ns=numbers(g);const banks=[g.bank,g.options,...(g.questions||[]).map(q=>q.options)].filter(Boolean);
   for(const bank of banks){if(!Array.isArray(bank)||!bank.length||bank.some(o=>typeof o.value!=='string'||!o.value.trim()||typeof o.text!=='string'||!o.text.trim())||new Set(bank.map(o=>o.value)).size!==bank.length)errors.push('Invalid option contents');}
   if(g.type==='mc-one'&&(g.questions||[]).some(q=>!q.prompt?.trim()||q.options?.length!==4))errors.push('MC ONE requires a prompt and four options');
   if(g.type==='mc-two'&&(!g.prompt?.trim()||g.options?.length<(g.selectionCount??2)+1||g.options?.length>10||(!g.selectionCount&&g.options?.length!==5)))errors.push('Invalid multiple-answer prompt/options');
   if(g.type==='mc-two'&&!Array.isArray(g.options))errors.push('Missing multiple-answer options');
   if(['tfng','ynng','matching-info','matching-features','matching-endings','short-answer'].includes(g.type)&&(g.questions||[]).some(q=>!q.prompt?.trim()))errors.push('Missing question prompt');
   if(['summary-drag','matching-headings','matching-endings','matching-features'].includes(g.type)&&!g.bank?.length)errors.push('Missing option bank');
   const range=g.sourceInstructions?.match(/\bA\s*[-–—]\s*([A-Z])/),listed=g.sourceInstructions?.match(/\bA\s*,\s*B(?:\s*,\s*[A-Z])*(?:\s*,?\s*(?:or|and)\s*[A-Z])?/);
   const codes=range?Array.from({length:range[1].charCodeAt(0)-64},(_,i)=>String.fromCharCode(65+i)):listed?[...listed[0].matchAll(/[A-Z]/g)].map(m=>m[0]):null;
   if(codes&&g.type==='mc-two'&&g.selectionCount&&g.options&&(g.options.length!==codes.length||g.options.some((o,i)=>o.value!==codes[i])))errors.push('Multiple-answer options differ from source range');
   if(codes&&g.bank&&g.type!=='matching-headings'&&(g.bank.length!==codes.length||g.bank.some((o,i)=>o.value!==codes[i])))errors.push('Option bank differs from source range');
   if(g.type==='matching-headings'&&(g.questions||[]).some(q=>!Number.isInteger(q.paragraph)||!d.paragraphs[q.paragraph]))errors.push('Invalid heading paragraph');
   if(g.type==='matching-headings'&&(g.examples||[]).some(e=>!Number.isInteger(e.paragraph)||!d.paragraphs[e.paragraph]||!g.bank?.some(o=>o.value===e.value)||g.questions?.some(q=>q.paragraph===e.paragraph)))errors.push('Invalid heading example');
   if(g.tableCellItalicText&&(!Array.isArray(g.tableCellItalicText)||g.tableCellItalicText.some(c=>!Number.isInteger(c.row)||!Number.isInteger(c.col)||typeof c.text!=='string'||!c.text||!g.table?.[c.row]?.[c.col]?.includes(c.text))))errors.push('Invalid italic table text');
   if(g.tableCellBold&&(!Array.isArray(g.tableCellBold)||g.tableCellBold.some(c=>{const [r,col]=String(c).split(':').map(Number);return !Number.isInteger(r)||!Number.isInteger(col)||!g.table?.[r]||col<0||col>=g.table[r].length})))errors.push('Invalid bold table cell');
   if(g.type==='notes'&&g.noteLayout){if(!Array.isArray(g.noteLayout.rows)||!g.noteLayout.rows.length||g.noteLayout.rows.some(r=>!Number.isFinite(r.indent)||r.indent<0||!Array.isArray(r.runs)||r.runs.some(run=>typeof run.text!=='string')))errors.push('Invalid source note layout');}
   if(['summary-input','summary-drag','notes','diagram','flow-chart'].includes(g.type)){
    const fields=g.type==='flow-chart'?(g.flow?.layout==='linear'?(Array.isArray(g.flow.steps)?g.flow.steps:[]):[g.flow?.start,...(Array.isArray(g.flow?.rows)?g.flow.rows:[]).flatMap(r=>[r?.left,r?.right].filter(Boolean))]):g.table?g.table.flat():g.noteLayout?g.noteLayout.rows.flatMap(r=>r.runs.map(run=>run.text)):g.type==='diagram'?(g.diagram?.captions||[]).map(c=>c.text):g.content||[];
    const slots=fields.flatMap(t=>[...String(t).matchAll(/\{\{(\d+)(?::(\d+))?\}\}/g)].map(m=>[Number(m[1]),Number(m[2]||0)]));
    const expected=(g.questions||[]).flatMap(q=>Array.from({length:q.slots||1},(_,i)=>q.n+':'+i)).sort();const found=slots.map(([n,i])=>n+':'+i).sort();
    if(expected.join(',')!==found.join(','))errors.push('Gap/control numbering mismatch');
   }
   for(const n of ns||[])actual.push(n);
   if(g.type==='flow-chart'){const linear=g.flow?.layout==='linear',valid=linear?(Array.isArray(g.flow.steps)&&g.flow.steps.length>=2&&g.flow.steps.every(s=>typeof s==='string'&&s.trim())&&typeof g.flow.arrow==='string'&&g.flow.arrow.startsWith('assets/')):(typeof g.flow?.start==='string'&&Array.isArray(g.flow?.rows)&&g.flow.rows.length&&g.flow.rows.every(r=>r&&typeof r.left==='string'&&(r.right===undefined||typeof r.right==='string')));if(!g.sourceLayoutChecked||!valid)errors.push('Flow chart requires reviewed stages and branches');}
   if(g.type==='diagram'&&(!g.diagram?.asset||!g.diagram?.captions?.length))errors.push('Diagram must have reviewed image and coordinates');
   if(g.type==='diagram'&&g.diagram?.captions?.some(c=>!Number.isFinite(c.x)||!Number.isFinite(c.y)||!Number.isFinite(c.width)||c.x<0||c.y<0||c.x>100||c.y>100||c.width<=0||c.x+c.width>101||typeof c.text!=='string'))errors.push('Invalid diagram label coordinates');
   if(g.type==='diagram'&&g.bank&&typeof g.reuse!=='boolean')errors.push('Diagram bank reuse must be explicit');
   if(g.type==='diagram'&&g.diagram?.layoutVersion===2){
    const d=g.diagram,r=d.image;
    if(!Number.isFinite(d.width)||!Number.isFinite(d.height)||d.width<=0||d.height<=0||d.minWidth!==d.width||d.lineHeight!==30||d.inputWidth!==180||!r||['x','y','width','height'].some(k=>!Number.isFinite(r[k]))||r.x<0||r.y<0||r.width<=0||r.height<=0||r.x+r.width>100.01||r.y+r.height>100.01)errors.push('Invalid measured diagram canvas');
    if(d.captions?.some(c=>c.lineCount!==c.text.split('\n').length||c.y/100*d.height+c.lineCount*d.lineHeight>d.height+1))errors.push('Diagram caption exceeds canvas');
   }
  }
  const start=d.part===1?1:d.part===2?14:27,count=d.part===3?14:13;
  if(actual.length!==count||new Set(actual).size!==count||actual.some(n=>!Number.isInteger(n)||n<start||n>=start+count))errors.push('Question numbering/count mismatch');
  if(d.mode!=='practice')for(const n of actual){const k=d.key?.[n];if(!k?.accepted?.length||!k.explanation?.trim())errors.push('Missing answer/explanation '+n);if(!k?.evidence?.length)errors.push('Missing evidence '+n);for(const e of k?.evidence||[]){if(!d.paragraphs[e.paragraph])errors.push('Invalid evidence paragraph '+n);else if(e.quote&&!d.paragraphs[e.paragraph].text.includes(e.quote))errors.push('Evidence quote missing from passage '+n)}}
  return errors;
 }
 function normalize(s){return String(s||'').trim().toLowerCase().replace(/\s+/g,' ')}
 function instructions(g,d){
  const countWords=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty','twenty-one','twenty-two','twenty-three','twenty-four','twenty-five','twenty-six'];
  const word=g.wordLimit?'<strong>'+g.wordLimit+'</strong>':'';
  const scopeLetters=g.sourceParagraphs||[];const scopeText=scopeLetters.length>1?scopeLetters.slice(0,-1).join(', ')+' '+(g.sourceParagraphJoiner||'and')+' '+scopeLetters.at(-1):scopeLetters[0];const from=scopeLetters.length?' from paragraph'+(scopeLetters.length>1?'s':'')+' <strong>'+scopeText+'</strong>':' from the passage';
  const stance=/views/i.test(g.sourceInstructions)?'views':'claims';
  const common={
   tfng:'Choose <strong>TRUE</strong> if the statement agrees with the information, choose <strong>FALSE</strong> if the statement contradicts the information, or choose <strong>NOT GIVEN</strong> if there is no information on this.',
   ynng:'Choose <strong>YES</strong> if the statement agrees with the '+stance+' of the writer, choose <strong>NO</strong> if the statement contradicts the '+stance+' of the writer, or choose <strong>NOT GIVEN</strong> if it is impossible to say what the writer thinks about this.',
   'mc-one':'Choose the correct answer.','mc-two':'Choose <strong>'+(g.selectionCount===3?'THREE':'TWO')+'</strong> correct answers.',
   'matching-info':'The text has '+(countWords[g.paragraphCount]||g.paragraphCount)+' paragraphs, <strong>'+(g.letters?.[0]||'')+'–'+(g.letters?.at(-1)||'')+'</strong>. Which paragraph contains the following information?'+(g.reuse?' You may choose any letter more than once.':''),
   'matching-features':'Choose the correct '+(g.targetName||'researcher')+'.'+(g.reuse?' You may choose any '+(g.targetName||'researcher')+' more than once.':''),
   'matching-headings':'Choose the correct heading for each paragraph from the list of headings and move it into the gap.',
   'matching-endings':'Complete each sentence with the correct ending. Choose the correct answer and move it into the gap.',
   'summary-input':'Complete the '+(g.task||'summary')+'. Write '+word+from+' for each answer.',
   'summary-drag':'Complete the summary'+(g.summaryScope?' of '+g.summaryScope:'')+' using the list of words. Choose the correct answer and move it into the gap.',
   notes:'Complete the '+(g.task||'notes')+'. Write '+word+from+' for each answer.',
   diagram:g.bank?'Label the diagram using the list of words. Choose the correct answer and move it into the gap.':'Label the diagram. Write '+word+from+' for each answer.',
   'flow-chart':'Complete the flow-chart. Write '+word+from+' for each answer.',
   'short-answer':'Answer the questions. Write '+word+from+' for each answer.'
  };return common[g.type];
 }
 root.IELTSData={validate,normalize,instructions,numbers,listTitle};
})(globalThis);
