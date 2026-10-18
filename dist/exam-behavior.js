(()=>{
const panel=document.getElementById('qpanel');
const isChoice=!!document.getElementById('submit-choice');
const startNumber=isChoice?(DATA.start||1):null;
const nums=isChoice?Array.from({length:DATA.answers.length},(_,i)=>i+startNumber):ALL_Q;
let current=nums[0],hovered=null;
const paired=[];document.querySelectorAll('.tif-num,.order-number').forEach(e=>{const m=e.textContent.match(/(\d+)\s*[–−-]\s*(\d+)/);if(m)paired.push([Number(m[1]),Number(m[2]),e])});
function representative(n){const pair=paired.find(([a,b])=>n>=a&&n<=b);return pair?pair[0]:n}
const navigationNums=nums.filter(n=>representative(n)===n);
function questionNumber(el){
 if(!el)return null;
 if(el.dataset.q)return Number(el.dataset.q);
 const name=el.name||'';const m=name.match(/^(?:q|mc|ync)(\d+)$/);if(m)return Number(m[1]);
 const id=(el.id||'').match(/(?:inp|a|qbox|drop|mhgap|dot|mc-num-|ync-num-|tfng-num-)(\d+)$/);if(id)return Number(id[1]);
 const group=el.closest('.choice-question,.mc-question,.ync-question,.tfng-question,.tif-question,.two-question,.scorableItem,.scorable-item,.interaction,.matching-question');
 if(group){if(group.dataset.q)return Number(group.dataset.q);const head=group.querySelector('.choice-number,.mc-num,.ync-num,.tfng-num,.tif-num,.qnum,.questionNumber');const h=head?.textContent.match(/\d+/);if(h)return Number(h[0]);const order=group.querySelector('.order-number');if(order)return Number(order.textContent.match(/\d+/)?.[0])}
 const label=el.closest('label');if(label?.htmlFor){const input=document.getElementById(label.htmlFor);if(input)return questionNumber(input)}
 const scoped=el.closest('.tif-opt');if(scoped){const h=scoped.closest('.tif-question')?.querySelector('.tif-num')?.textContent.match(/\d+/);if(h)return Number(h[0])}
 return null;
}
function dotNumber(el){const m=(el.id||'').match(/^dot(\d+)$/);if(m)return Number(m[1]);if(el.dataset.examQ)return Number(el.dataset.examQ);const t=el.textContent.match(/\d+/);return t?Number(t[0]):null}
function targetFor(n){const heading=document.querySelector('.mh-gap[data-q="'+n+'"]');if(heading)return heading;const pair=paired.find(([a,b])=>n>=a&&n<=b);if(pair)return pair[2];return document.getElementById('q'+n)||document.getElementById('mc-num-'+n)||document.getElementById('ync-num-'+n)||document.getElementById('tfng-num-'+n)||document.getElementById('qbox'+n)||document.getElementById('inp'+n)||document.getElementById('a'+n)||document.getElementById('drop'+n)||document.getElementById('mhgap'+n)||document.getElementById('twoQ'+n)}
function inputFor(n){return document.getElementById('inp'+n)||document.getElementById('a'+n)}
const dots=[...document.querySelectorAll('#bb-dots button,.tif-dot')];
if(isChoice)dots.forEach(b=>{b.classList.add('video-plain-dot');b.dataset.examQ=String(dotNumber(b)||Number(b.textContent.match(/\d+/)?.[0]))});
function paint(){
 const shown=hovered??current;
 dots.forEach(d=>{d.classList.toggle('video-current',dotNumber(d)===representative(current))});
 document.querySelectorAll('.mh-gap').forEach(g=>g.classList.toggle('video-current',Number(g.dataset.q)===shown));
 document.querySelectorAll('.choice-number,.mc-num,.ync-num,.tfng-num,.qnum').forEach(e=>e.classList.toggle('video-current',Number(e.textContent)===shown));
 document.querySelectorAll('.choice-current').forEach(e=>e.classList.remove('choice-current'));
 const prev=document.getElementById('nav-prev'),next=document.getElementById('nav-next');const idx=navigationNums.indexOf(current);
 prev.disabled=idx<=0;next.disabled=!!document.querySelector('.exam-submit')?.disabled;next.style.visibility='visible';
}
function select(n){if(!nums.includes(n))return;n=representative(n);current=n;activeQ=n;hovered=null;paint()}
function navigate(n){
 select(n);const target=targetFor(n);if(!target)return;
 const diagramScroll=target.closest('.perfume-diagram-scroll');if(diagramScroll){const r=target.getBoundingClientRect(),v=diagramScroll.getBoundingClientRect();if(r.left<v.left||r.right>v.right)diagramScroll.scrollLeft=Math.max(0,diagramScroll.scrollLeft+r.left-v.left-12);}

 // Scroll only the relevant pane; preserve the reader's location on the other side.
 const scroller=target.closest('.qpanel,.passage');
 if(scroller){const r=target.getBoundingClientRect(),v=scroller.getBoundingClientRect();if(r.top<v.top+8||r.bottom>v.bottom-70){const top=Math.max(0,scroller.scrollTop+r.top-v.top-24);scroller.scrollTo({top,behavior:'auto'})}}
 const input=inputFor(n);if(input&&!input.disabled)input.focus({preventScroll:true});
 if(isChoice&&submitted)explain(n);
}
// Replace arrow listeners so there is one navigation step for each click.
for(const id of ['nav-prev','nav-next']){const old=document.getElementById(id);const b=old.cloneNode(true);old.replaceWith(b);b.onclick=()=>{const i=navigationNums.indexOf(current);if(id==='nav-next'&&i===navigationNums.length-1){document.querySelector('.exam-submit')?.click();return}navigate(navigationNums[Math.max(0,Math.min(navigationNums.length-1,i+(id==='nav-prev'?-1:1)))])}}
dots.forEach(d=>d.addEventListener('click',e=>{e.stopImmediatePropagation();navigate(dotNumber(d))},true));
panel.addEventListener('focusin',e=>{const n=questionNumber(e.target);if(n)select(n)});
panel.addEventListener('click',e=>{const n=questionNumber(e.target)||questionNumber(e.target.closest('.tif-opt'));if(n)select(n);queueMicrotask(paint)});
panel.addEventListener('input',e=>{const n=questionNumber(e.target);if(n)select(n);queueMicrotask(paint)});
document.querySelectorAll('.mh-gap').forEach(g=>{g.addEventListener('focus',()=>select(Number(g.dataset.q)));g.addEventListener('click',()=>select(Number(g.dataset.q)));g.addEventListener('mouseenter',()=>{hovered=Number(g.dataset.q);paint()});g.addEventListener('mouseleave',()=>{hovered=null;paint()})});
panel.addEventListener('change',()=>queueMicrotask(()=>{refreshLimits();paint()}));
const groups=[...panel.querySelectorAll('.choice-question,.mc-question,.ync-question,.tfng-question,.tif-question,.matching-question')];
groups.forEach(group=>{group.addEventListener('mouseenter',()=>{const h=group.querySelector('.choice-number,.mc-num,.ync-num,.tfng-num,.tif-num,.qnum');const m=h?.textContent.match(/\d+/);if(m){hovered=Number(m[0]);paint()}});group.addEventListener('mouseleave',()=>{hovered=null;paint()})});
panel.querySelectorAll('.ans-wrap input,.choice-gap').forEach(input=>{input.style.textAlign='left';input.addEventListener('mouseenter',()=>{hovered=questionNumber(input);paint()});input.addEventListener('mouseleave',()=>{hovered=null;paint()})});
function refreshLimits(){
 panel.querySelectorAll('.tif-options').forEach(g=>{const selected=g.querySelectorAll('.tif-opt.selected').length;g.querySelectorAll('.tif-opt').forEach(o=>{const disabled=selected>=2&&!o.classList.contains('selected');o.setAttribute('aria-disabled',String(disabled));o.style.opacity=disabled?'.38':'1';o.style.cursor=disabled?'default':'pointer';o.setAttribute('role','checkbox');o.setAttribute('aria-checked',String(o.classList.contains('selected')));o.tabIndex=disabled?-1:0})});
 panel.querySelectorAll('input[type=checkbox]').forEach(input=>{const peers=[...panel.querySelectorAll('input[type=checkbox]')].filter(p=>p.name===input.name);const range=input.closest('.tif-question,.two-question')?.querySelector('.order-number,.tif-num')?.textContent.match(/(\d+)\s*[–−-]\s*(\d+)/);const limit=range?Number(range[2])-Number(range[1])+1:2;input.disabled=peers.filter(p=>p.checked).length>=limit&&!input.checked;const li=input.closest('li');if(li)li.style.opacity=input.disabled?'.38':'1'});
}
panel.querySelectorAll('.tif-opt').forEach(o=>{o.addEventListener('click',()=>queueMicrotask(()=>{refreshLimits();paint()}));o.addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&o.getAttribute('aria-disabled')!=='true'){e.preventDefault();o.click()}})});
// Retain the active question after answering, including already answered questions.
if(typeof onAnswer==='function'){const previous=onAnswer;onAnswer=function(n){previous(n);select(n)}}
if(typeof setActive==='function'){const previous=setActive;setActive=function(n){previous(n);select(n)}}
if(isChoice)go=navigate;
const submit=document.createElement('button');submit.className='exam-submit';submit.innerHTML='<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false"><path d="M3 10l4 4L17 4" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter"/></svg>';submit.type='button';submit.setAttribute('aria-label','Nộp bài');submit.title='Nộp bài';submit.onclick=async()=>{if(submit.disabled)return;if(window.IELTSConfirmSubmit){const responses=typeof currentValues==='function'?currentValues():typeof values==='function'?values():typeof answered!=='undefined'?nums.map(n=>answered.has(n)?'answered':''):[];const approved=await window.IELTSConfirmSubmit({parts:[{part:activePartNumber,total:nums.length,answered:responses.filter(Boolean).length}]});if(!approved)return}if(isChoice){const action=document.getElementById('submit-choice');window.IELTSSubmitApproved=!!window.IELTSConfirmSubmit;try{if(!action.disabled)action.click()}finally{window.IELTSSubmitApproved=false}submit.disabled=action.disabled;return}if(!window.IELTSConfirmSubmit&&!confirm('Nộp bài và kết thúc lượt làm bài?'))return;submit.disabled=true;const count=typeof answered!=='undefined'?nums.filter(n=>answered.has(n)).length:panel.querySelectorAll('input:checked').length;panel.inert=true;const result=document.createElement('p');result.className='legacy-submit-result';result.setAttribute('role','status');result.textContent='Đã nộp bài. Đã trả lời '+count+'/'+nums.length+' câu.';panel.append(result);result.scrollIntoView({block:'center'});};document.querySelector('.bb-top-row').append(submit);
const activePart=document.querySelector('.bb-active-part');
const activePartNumber=isChoice?(DATA.part||1):(nums[0]<27?2:3);
activePart.dataset.part=activePartNumber;
const footerRow=activePart.parentElement;
footerRow.querySelectorAll('.bb-part:not(.bb-active-part)').forEach(p=>p.remove());
for(const n of [1,2,3]){if(n===activePartNumber)continue;const part=document.createElement('div');part.className='bb-part';part.id='bbpart'+n;part.dataset.part=n;part.innerHTML='<div class="bb-inactive-view"><span class="bb-inactive-label">Part '+n+'</span><span class="bb-inactive-progress">0 of '+(n===3?14:13)+'</span></div>';footerRow.insertBefore(part,n<activePartNumber?activePart:submit);}

const partLabel=isChoice?activePart.querySelector(':scope > span'):activePart.querySelector('.footer__questionNo');
partLabel.classList.add('exam-part-label');
if(isChoice){partLabel.textContent='Part '+activePartNumber;partLabel.style.cssText='';}
const strip=document.createElement('div');strip.className='exam-part-progress';strip.setAttribute('aria-hidden','true');
for(const n of nums){const seg=document.createElement('span');seg.dataset.progressQ=n;strip.append(seg)}activePart.prepend(strip);
const syncProgress=()=>{strip.querySelectorAll('[data-progress-q]').forEach(seg=>{const n=Number(seg.dataset.progressQ);const done=isChoice?!!values()[n-startNumber]:answered.has(n);seg.classList.toggle('done',done)})};
const footerObserver=new MutationObserver(syncProgress);syncProgress();
for(const event of ['input','change'])panel.addEventListener(event,()=>queueMicrotask(syncProgress));
footerObserver.observe(document.getElementById('bb-dots'),{subtree:true,attributes:true,attributeFilter:['class']});
// The strip tracks each answer independently, even when two questions share one button.
// The return link belongs in the header, without covering the exam controls.
document.querySelectorAll('a[href="../index.html"]').forEach(a=>{a.removeAttribute('style');a.className='exam-home';a.textContent='Tủ Sách IELTS';document.querySelector('.nav-left')?.append(a)});
// Notes are session-only here, as requested; opening the sidebar reflows both panes.
const notes=[];let counter=0;
const sidebar=document.createElement('aside');sidebar.className='exam-notes';sidebar.setAttribute('aria-label','Notes');sidebar.innerHTML='<div class="exam-notes-head"><span>Notes</span><button type="button" aria-label="Close notes">×</button></div><div class="exam-notes-list"></div>';document.body.append(sidebar);sidebar.querySelector('button').onclick=()=>document.body.classList.remove('exam-notes-open');
function renderNotes(){const list=sidebar.querySelector('.exam-notes-list');list.replaceChildren();if(!notes.length){list.innerHTML='<div class="exam-notes-empty">Your private notes will show here<p>Select text to highlight or create a note.</p></div>';return}
 notes.forEach(note=>{const card=document.createElement('div');card.className='exam-note-card';const title=document.createElement('p');title.textContent=document.querySelector('.part-box h2').textContent+'  '+note.quote;const input=document.createElement('textarea');input.placeholder='Start typing your note';input.value=note.text;input.oninput=()=>note.text=input.value;const actions=document.createElement('div');actions.className='exam-note-actions';const del=document.createElement('button');del.textContent='Delete';del.onclick=()=>{actions.replaceChildren();const message=document.createElement('p');message.textContent='You are about to delete a note from '+document.querySelector('.part-box h2').textContent;const cancel=document.createElement('button');cancel.textContent='Cancel';cancel.onclick=renderNotes;const yes=document.createElement('button');yes.textContent='Confirm deleting';yes.onclick=()=>{notes.splice(notes.indexOf(note),1);document.querySelectorAll('[data-exam-note="'+note.id+'"]').forEach(e=>e.replaceWith(...e.childNodes));renderNotes()};card.append(message);actions.append(cancel,yes)};actions.append(del);card.append(title,input,actions);list.append(card)})}
const noteButton=document.getElementById('sel-note-btn');noteButton.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();const range=typeof savedRange!=='undefined'?savedRange:null;if(!range||range.collapsed)return;const note={id:++counter,quote:range.toString(),text:''};notes.push(note);try{const mark=document.createElement('span');mark.dataset.examNote=note.id;mark.style.background='#2842b6';mark.style.color='white';mark.append(range.extractContents());range.insertNode(mark)}catch{}window.getSelection().removeAllRanges();document.getElementById('selection-popup').style.display='none';document.getElementById('note-panel').style.display='none';document.body.classList.add('exam-notes-open');renderNotes();[...sidebar.querySelectorAll('textarea')].at(-1)?.focus()},true);
const navIcons=document.querySelector('.nav-icons');const icons=navIcons?.querySelectorAll('svg');const notesToggle=icons?.[icons.length-1];if(notesToggle){notesToggle.setAttribute('role','button');notesToggle.setAttribute('aria-label','Notes');notesToggle.setAttribute('tabindex','0');notesToggle.addEventListener('click',()=>{document.body.classList.toggle('exam-notes-open');renderNotes()});notesToggle.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();notesToggle.dispatchEvent(new MouseEvent('click'))}})}
// The artwork fits the pane; HTML labels retain browser-zoomed font sizes.
const diagramViewport=document.querySelector('.perfume-diagram-scroll');
if(diagramViewport&&!diagramViewport.querySelector('.shared-diagram')){const diagram=diagramViewport.querySelector('.perfume-diagram,.jenny-diagram');const fitDiagram=()=>{const width=diagramViewport.getBoundingClientRect().width;if(width<=0)return;let height=width*(diagram.classList.contains('jenny-diagram')?1050/1000:710/1120);diagram.querySelectorAll('.diagram-label,.diagram-glass-label,.diagram-fixed').forEach(label=>{const r=label.getBoundingClientRect(),frame=diagram.getBoundingClientRect();height=Math.max(height,r.bottom-frame.top)});diagramViewport.style.minHeight=(height+18)+'px';};const diagramObserver=new ResizeObserver(fitDiagram);diagramObserver.observe(diagram);diagram.querySelectorAll('.diagram-label,.diagram-glass-label,.diagram-fixed').forEach(label=>diagramObserver.observe(label));window.addEventListener('resize',fitDiagram);window.visualViewport?.addEventListener('resize',fitDiagram);fitDiagram();}
refreshLimits();paint();renderNotes();
})();
