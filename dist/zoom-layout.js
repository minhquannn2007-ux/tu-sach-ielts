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
   ratio=Math.min(1,Math.max(0,(x-bounds.left)/available));if(ratio<.025)ratio=0;if(ratio>.975)ratio=1;
   main.classList.toggle('pane-passage-collapsed',ratio===0);main.classList.toggle('pane-questions-collapsed',ratio===1);
   // Interpolate outer margins on every move, rather than only at collapse.
   const readingWidth=available-18,readingEdge=Math.max(22,(readingWidth-1000)/2),readingExpansion=Math.max(0,ratio*2-1),questionExpansion=Math.max(0,1-ratio*2);
   const setPadding=(pane,left,right)=>{pane.style.paddingLeft=left+'px';pane.style.paddingRight=right+'px'};
   setPadding(passage,22+(readingEdge-22)*readingExpansion,24+(readingEdge-24)*readingExpansion);
   setPadding(panel,16+17*questionExpansion,16+(Math.max(24,readingWidth-1210-33)-16)*questionExpansion);
   const basis=r=>r===0?'18px':r===1?'calc(100% - 20px)':'calc('+(r*100)+'% - '+(divider.offsetWidth*r)+'px)';
   passage.style.flex='0 0 '+basis(ratio);passage.style.width='';
   panel.style.flex='0 0 '+basis(1-ratio);panel.style.width='';
   handle.setAttribute('aria-valuenow',String(Math.round(ratio*100)));
  }
  handle.setAttribute('role','separator');handle.setAttribute('aria-orientation','vertical');handle.tabIndex=0;
  handle.setAttribute('aria-label','Resize reading and question panes');handle.setAttribute('aria-valuemin','0');handle.setAttribute('aria-valuemax','100');
  divider.addEventListener('mousedown',e=>{e.preventDefault();e.stopImmediatePropagation()},true);
  divider.addEventListener('pointerdown',e=>{if(e.isPrimary===false||pointer!==null||(e.pointerType==='mouse'&&e.button!==undefined&&e.button!==0))return;
   e.preventDefault();pointer=e.pointerId;oldSelect=document.body.style.userSelect;oldCursor=document.body.style.cursor;
   document.body.style.userSelect='none';document.body.style.cursor='col-resize';divider.classList.add('touch-resizing');
   divider.setPointerCapture?.(pointer);
   apply(e.clientX);
  });
  divider.addEventListener('pointermove',e=>{if(e.pointerId!==pointer)return;e.preventDefault();apply(e.clientX)});
  function stop(e){if(pointer===null||e&&e.pointerId!==pointer)return;const id=pointer;pointer=null;
   if(divider.hasPointerCapture?.(id))divider.releasePointerCapture(id);
   document.body.style.userSelect=oldSelect;document.body.style.cursor=oldCursor;divider.classList.remove('touch-resizing');
  }
  divider.addEventListener('pointerup',stop);divider.addEventListener('pointercancel',stop);divider.addEventListener('lostpointercapture',stop);window.addEventListener('blur',()=>stop());
  window.addEventListener('resize',()=>{if(ratio!==null)queueMicrotask(()=>{const b=main.getBoundingClientRect();apply(b.left+(b.width-divider.offsetWidth)*ratio)})});
  handle.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();
   const bounds=main.getBoundingClientRect(),available=bounds.width-divider.offsetWidth;
   const current=ratio??passage.getBoundingClientRect().width/available;
   apply(bounds.left+available*(e.key==='Home'?.5:e.key==='End'?1:current+(e.key==='ArrowRight'?.025:-.025)));
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
