/* Original HTML drag controllers start only after actual movement. */
(()=>{
 document.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('.mh-heading,.dnd-word').forEach(e=>e.tabIndex=0),{once:true});
 window.IELTSDragInBank=(e,bank)=>{const r=bank.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top-12&&e.clientY<=r.bottom+12};
 window.IELTSDragStart=(e,start)=>{
  if(e.ieltsDragStarted)return true;
  if(e.button!==0)return false;
  e.target.closest('.mh-heading,.dnd-word')?.focus({preventScroll:true});
  e.preventDefault();
  const move=ev=>{if(Math.hypot(ev.clientX-e.clientX,ev.clientY-e.clientY)<5)return;cleanup();e.ieltsDragStarted=true;document.body.classList.add('exam-answer-dragging');document.body.classList.toggle('exam-heading-dragging',!!e.target.closest('.mh-heading,.mh-gap'));document.body.classList.toggle('exam-summary-dragging',!!e.target.closest('.dnd-word,.dnd-drop'));start(e);};
  const cleanup=()=>{document.removeEventListener('mousemove',move);document.removeEventListener('mouseup',cleanup)};
  document.addEventListener('mousemove',move);document.addEventListener('mouseup',cleanup);return false;
 };
 document.addEventListener('mouseup',()=>document.body.classList.remove('exam-answer-dragging','exam-heading-dragging','exam-summary-dragging'));
})();
