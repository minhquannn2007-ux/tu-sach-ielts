(()=>{
 const main=document.querySelector('.main'),panel=document.getElementById('qpanel');
 if(!main||!panel)return;
 document.body.classList.add('zoom-exam');
 // Pointer capture keeps a touch drag alive across panes and iframe contents.
 const divider=document.getElementById('divider'),passage=document.getElementById('passage');
 if(divider&&passage){
  const handle=divider.querySelector('.resize-btn')||divider;
  let pointer=null,ratio=null,oldSelect='',oldCursor='';
  function apply(x){const bounds=main.getBoundingClientRect(),available=bounds.width-divider.offsetWidth;if(available<=0)return;
   ratio=Math.min(.85,Math.max(.15,(x-bounds.left)/available));
   passage.style.flex=(ratio*100)+' 1 0';passage.style.width='';
   panel.style.flexBasis=((1-ratio)*100)+'%';panel.style.flexGrow='0';panel.style.flexShrink='1';panel.style.width='';
   handle.setAttribute('aria-valuenow',String(Math.round(ratio*100)));
  }
  handle.setAttribute('role','separator');handle.setAttribute('aria-orientation','vertical');handle.tabIndex=0;
  handle.setAttribute('aria-label','Resize reading and question panes');handle.setAttribute('aria-valuemin','15');handle.setAttribute('aria-valuemax','85');
  divider.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'||e.isPrimary===false||pointer!==null)return;
   e.preventDefault();pointer=e.pointerId;oldSelect=document.body.style.userSelect;oldCursor=document.body.style.cursor;
   document.body.style.userSelect='none';document.body.style.cursor='col-resize';divider.classList.add('touch-resizing');
   divider.setPointerCapture?.(pointer);
  });
  divider.addEventListener('pointermove',e=>{if(e.pointerId!==pointer)return;e.preventDefault();apply(e.clientX)});
  function stop(e){if(pointer===null||e&&e.pointerId!==pointer)return;const id=pointer;pointer=null;
   if(divider.hasPointerCapture?.(id))divider.releasePointerCapture(id);
   document.body.style.userSelect=oldSelect;document.body.style.cursor=oldCursor;divider.classList.remove('touch-resizing');
  }
  divider.addEventListener('pointerup',stop);divider.addEventListener('pointercancel',stop);divider.addEventListener('lostpointercapture',stop);window.addEventListener('blur',()=>stop());
  handle.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home'].includes(e.key))return;e.preventDefault();
   const bounds=main.getBoundingClientRect(),available=bounds.width-divider.offsetWidth;
   const current=ratio??passage.getBoundingClientRect().width/available;
   apply(bounds.left+available*(e.key==='Home'?.5:current+(e.key==='ArrowRight'?.025:-.025)));
  });
 }
 document.querySelectorAll('.perfume-diagram-scroll').forEach(viewport=>{
  viewport.classList.add('diagram-viewport');viewport.tabIndex=0;
  viewport.setAttribute('role','region');viewport.setAttribute('aria-label','Diagram — scroll horizontally to view the entire figure');
 });
 document.querySelectorAll('.grid-outer,table.note-comp-table').forEach(grid=>{
  const parent=grid.parentElement;
  if(parent.classList.contains('zoom-table-viewport'))return;
  if(parent.classList.contains('perfume-grid-scroll')){parent.classList.add('zoom-table-viewport');parent.tabIndex=0;return;}
  const wrapper=document.createElement('div');wrapper.className='zoom-table-viewport';wrapper.tabIndex=0;wrapper.setAttribute('role','region');wrapper.setAttribute('aria-label','Answer table — scroll horizontally for all columns');grid.before(wrapper);wrapper.append(grid);
 });
 // In the one-column view the document, rather than either pane, scrolls.
 // Existing answer/drag handlers and desktop split ratios remain unchanged.
 function scrollOnNarrow(el){if(window.innerWidth<600&&el)el.scrollIntoView({block:'center',behavior:'auto'});}
 function target(n){return document.querySelector('.mh-gap[data-q="'+n+'"]')||document.getElementById('q'+n)||document.getElementById('medrop'+n)||document.getElementById('mc-num-'+n)||document.getElementById('ync-num-'+n)||document.getElementById('tfng-num-'+n)||document.getElementById('qbox'+n)||document.getElementById('inp'+n)||document.getElementById('a'+n);}
 // Capture listeners also run on lessons whose footer listeners stop propagation.
 document.querySelectorAll('#bb-dots button,.tif-dot').forEach(dot=>dot.addEventListener('click',()=>{const n=Number(dot.dataset.examQ||dot.id.match(/\d+/)?.[0]||dot.textContent.match(/\d+/)?.[0]);queueMicrotask(()=>scrollOnNarrow(target(n)));},true));
 document.querySelectorAll('#nav-prev,#nav-next').forEach(button=>button.addEventListener('click',()=>{queueMicrotask(()=>{const dot=document.querySelector('#bb-dots .video-current,#bb-dots .active');if(dot){const n=Number(dot.dataset.examQ||dot.id.match(/\d+/)?.[0]||dot.textContent.match(/\d+/)?.[0]);scrollOnNarrow(target(n));}});}));
})();
