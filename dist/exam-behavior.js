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
const syncProgress=()=>{const all=nums.every(n=>isChoice?!!values()[n-startNumber]:answered.has(n));activePart.classList.toggle('exam-all-answered',all);let tick=partLabel.querySelector('.exam-part-complete');if(all&&!tick){tick=document.createElement('span');tick.className='exam-part-complete';tick.textContent='✓';tick.setAttribute('aria-label','All questions answered');partLabel.prepend(tick)}if(!all)tick?.remove();strip.querySelectorAll('[data-progress-q]').forEach(seg=>{const n=Number(seg.dataset.progressQ);const done=isChoice?!!values()[n-startNumber]:answered.has(n);seg.classList.toggle('done',done)})};
const footerObserver=new MutationObserver(syncProgress);syncProgress();
for(const event of ['input','change'])panel.addEventListener(event,()=>queueMicrotask(syncProgress));
footerObserver.observe(document.getElementById('bb-dots'),{subtree:true,attributes:true,attributeFilter:['class']});
// The strip tracks each answer independently, even when two questions share one button.
// The return link belongs in the header, without covering the exam controls.
document.querySelectorAll('a[href="../index.html"]').forEach(a=>{a.removeAttribute('style');a.className='exam-home';a.textContent='Tủ Sách IELTS';document.querySelector('.nav-left')?.append(a)});
// Shared annotation controls; Full Test sidebars live beside the outer exam shell.
const notes=[];let counter=0,annotationRange=null,highlightTarget=null,editingNote=null;
const host=window.parent!==window&&document.documentElement.classList.contains('full-test-frame')?parent.document:document;
const sidebar=host.createElement('aside');sidebar.className='exam-notes';sidebar.hidden=true;sidebar.setAttribute('aria-label','Notes');sidebar.innerHTML='<div class="exam-notes-head"><span>Notes</span><button type="button" aria-label="Close notes">×</button></div><div class="exam-notes-list"></div>';host.body.append(sidebar);
const popup=document.getElementById('selection-popup'),context=document.getElementById('context-menu');
const noteIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h18v18H3z" fill="currentColor" stroke="none"/><path d="M9 8H7v4h3v-2H8m9-2h-2v4h3v-2h-2" stroke="white" stroke-width="1.4" fill="none"/></svg>';
const highlightIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 3h4l-1 12h-4zM4 20h16" stroke="currentColor" stroke-width="2" fill="none"/></svg>';
const trashIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M9 3h6M6 6l2 15h8l2-15" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
function hideAnnotationMenus(){popup.style.display='none';context.style.display='none'}
function closeNotes(){sidebar.hidden=true;host.body.classList.remove('exam-notes-open')}
function openNotes(id){editingNote=id||null;host.querySelectorAll('.exam-notes').forEach(s=>s.hidden=s!==sidebar);sidebar.hidden=false;host.body.classList.add('exam-notes-open');renderNotes();if(id){const card=sidebar.querySelector('[data-note-card="'+id+'"]');card?.scrollIntoView({block:'nearest'});card?.querySelector('textarea')?.focus({preventScroll:true})}}
sidebar.querySelector('button').onclick=closeNotes;
function finishNoteEditing(e){if(sidebar.hidden||!editingNote||e.target.closest('.exam-note-card,[data-exam-note]'))return;editingNote=null;sidebar.querySelectorAll('.exam-note-card').forEach(c=>c.classList.remove('editing'));sidebar.querySelector('textarea:focus')?.blur()}
host.addEventListener('pointerdown',finishNoteEditing,true);if(host!==document)document.addEventListener('pointerdown',finishNoteEditing,true);
function unwrap(mark){mark.replaceWith(...mark.childNodes)}
function renderNotes(){const list=sidebar.querySelector('.exam-notes-list');list.replaceChildren();if(!notes.length){list.innerHTML='<div class="exam-notes-empty">Your private notes will show here<p>Select text to highlight or create a note.</p></div>';return}
 for(const note of notes){const card=host.createElement('div');card.className='exam-note-card'+(editingNote===note.id?' editing':'');card.dataset.noteCard=note.id;const title=host.createElement('p'),part=host.createElement('strong'),quote=host.createElement('em');part.textContent=note.part;quote.textContent=note.quote;title.append(part,quote);const input=host.createElement('textarea');input.placeholder='Start typing your note';input.setAttribute('aria-label','Note on '+note.quote);input.value=note.text;input.oninput=()=>note.text=input.value;input.onfocus=()=>{editingNote=note.id;sidebar.querySelectorAll('.exam-note-card').forEach(c=>c.classList.toggle('editing',Number(c.dataset.noteCard)===note.id))};const actions=host.createElement('div');actions.className='exam-note-actions';const del=host.createElement('button');del.type='button';del.textContent='Delete';del.onclick=()=>{actions.replaceChildren();const message=host.createElement('p');message.className='exam-note-delete-message';message.textContent='You are about to delete a note from '+note.part;const cancel=host.createElement('button');cancel.type='button';cancel.textContent='Cancel';cancel.onclick=renderNotes;const yes=host.createElement('button');yes.type='button';yes.textContent='Confirm deleting';yes.onclick=()=>{notes.splice(notes.indexOf(note),1);document.querySelectorAll('[data-exam-note="'+note.id+'"]').forEach(unwrap);renderNotes()};card.insertBefore(message,actions);actions.append(cancel,yes)};actions.append(del);card.append(title,input,actions);list.append(card)}}
function markRange(range,kind,id){const root=range.commonAncestorContainer,walker=document.createTreeWalker(root.nodeType===3?root.parentNode:root,NodeFilter.SHOW_TEXT),nodes=[];let node;while(node=walker.nextNode()){if(node.textContent&&range.intersectsNode(node)&&!node.parentElement.closest('textarea,input,script,style'))nodes.push(node)}
 for(const node of nodes){const start=node===range.startContainer?range.startOffset:0,end=node===range.endContainer?range.endOffset:node.length;if(end<=start)continue;if(end<node.length)node.splitText(end);const selected=start?node.splitText(start):node;const mark=document.createElement('span');if(kind==='note'){mark.className='exam-note-anchor';mark.dataset.examNote=id;mark.tabIndex=0;mark.setAttribute('role','button');mark.setAttribute('aria-label','Open note')}else mark.className='hl hl-active-part';selected.replaceWith(mark);mark.append(selected)}
 window.getSelection()?.removeAllRanges();hideAnnotationMenus();
}
function addNote(range){if(!range||range.collapsed)return;const note={id:++counter,quote:range.toString(),part:document.querySelector('.part-box h2').textContent,text:''};notes.push(note);markRange(range,'note',note.id);openNotes(note.id)}
function positionMenu(menu,range,event){const r=range?.getBoundingClientRect?.()||event?.target?.getBoundingClientRect?.()||{left:event?.clientX||0,right:event?.clientX||0,bottom:event?.clientY||0};const width=menu===popup?114:68;menu.style.left=Math.max(6,Math.min((r.left+r.right-width)/2,window.innerWidth-width-6))+'px';menu.style.top=Math.min(r.bottom+7,window.innerHeight-80)+'px';menu.style.display='flex'}
const noteButton=document.getElementById('sel-note-btn'),highlightButton=document.getElementById('sel-highlight-btn');noteButton.innerHTML=noteIcon+'<span>Note</span>';highlightButton.innerHTML=highlightIcon+'<span>Highlight</span>';
for(const [button,action] of [[noteButton,()=>addNote(annotationRange)],[highlightButton,()=>{if(annotationRange&&!annotationRange.collapsed)markRange(annotationRange,'highlight')}]])button.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();action()},true);
for(const menu of [popup,context])menu.addEventListener('mousedown',e=>e.preventDefault());
function showDelete(mark,event,range){hideAnnotationMenus();highlightTarget=mark;context.replaceChildren();const button=document.createElement('button');button.type='button';button.className='annotation-delete';button.innerHTML=trashIcon+'<span>Delete<br>Highlight</span>';button.onclick=()=>{if(highlightTarget?.isConnected)unwrap(highlightTarget);highlightTarget=null;window.getSelection()?.removeAllRanges();hideAnnotationMenus()};context.append(button);positionMenu(context,range,event)}
document.addEventListener('mouseup',e=>{if(e.target.closest('#selection-popup,#context-menu,#note-panel,.exam-notes'))return;const mark=e.target.closest('[data-exam-note]');if(mark){e.stopImmediatePropagation();window.getSelection()?.removeAllRanges();hideAnnotationMenus();openNotes(Number(mark.dataset.examNote));return}const selection=window.getSelection(),range=selection&&!selection.isCollapsed?selection.getRangeAt(0):null,area=range?(range.commonAncestorContainer.nodeType===3?range.commonAncestorContainer.parentElement:range.commonAncestorContainer):null;
 if(range&&area?.closest('#passage,#qpanel')&&selection.toString().trim()){e.stopImmediatePropagation();annotationRange=range.cloneRange();const hl=area.closest('.hl');if(hl)showDelete(hl,e,range);else{hideAnnotationMenus();positionMenu(popup,range,e)}return}const hl=e.target.closest('.hl');if(hl){e.stopImmediatePropagation();showDelete(hl,e);return}hideAnnotationMenus();},true);
document.addEventListener('keydown',e=>{const mark=e.target.closest?.('[data-exam-note]');if(mark&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openNotes(Number(mark.dataset.examNote))}if(e.key==='Escape')hideAnnotationMenus()});
const navIcons=document.querySelector('.nav-icons'),icons=navIcons?.querySelectorAll('svg'),notesToggle=icons?.[icons.length-1];if(notesToggle){notesToggle.setAttribute('role','button');notesToggle.setAttribute('aria-label','Notes');notesToggle.tabIndex=0;const toggle=()=>{if(!sidebar.hidden&&host.body.classList.contains('exam-notes-open'))closeNotes();else openNotes()};notesToggle.addEventListener('click',toggle);notesToggle.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}})}
const navItems=[...(navIcons?.children||[])].filter(e=>e.matches('svg,img'));if(navItems.length>4)navItems[3].classList.add('exam-chat-icon');
window.IELTSAnnotations={open:openNotes,close:closeNotes,toggle:()=>sidebar.hidden?openNotes():closeNotes(),highlight:range=>markRange(range,'highlight'),note:addNote};
// The artwork fits the pane; HTML labels retain browser-zoomed font sizes.
const diagramViewport=document.querySelector('.perfume-diagram-scroll');
if(diagramViewport&&!diagramViewport.querySelector('.shared-diagram')){const diagram=diagramViewport.querySelector('.perfume-diagram,.jenny-diagram');const fitDiagram=()=>{const width=diagramViewport.getBoundingClientRect().width;if(width<=0)return;let height=width*(diagram.classList.contains('jenny-diagram')?1050/1000:710/1120);diagram.querySelectorAll('.diagram-label,.diagram-glass-label,.diagram-fixed').forEach(label=>{const r=label.getBoundingClientRect(),frame=diagram.getBoundingClientRect();height=Math.max(height,r.bottom-frame.top)});diagramViewport.style.minHeight=(height+18)+'px';};const diagramObserver=new ResizeObserver(fitDiagram);diagramObserver.observe(diagram);diagram.querySelectorAll('.diagram-label,.diagram-glass-label,.diagram-fixed').forEach(label=>diagramObserver.observe(label));window.addEventListener('resize',fitDiagram);window.visualViewport?.addEventListener('resize',fitDiagram);fitDiagram();}
refreshLimits();paint();renderNotes();
})();
