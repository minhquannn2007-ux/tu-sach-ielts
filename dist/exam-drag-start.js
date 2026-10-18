/* Original HTML drag controllers start only after actual movement. */
(()=>{
 window.IELTSDragInBank=(e,bank)=>{const r=bank.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top-12&&e.clientY<=r.bottom+12};
 window.IELTSDragStart=(e,start)=>{
  if(e.ieltsDragStarted)return true;
  if(e.button!==0)return false;
  e.preventDefault();
  const move=ev=>{if(Math.hypot(ev.clientX-e.clientX,ev.clientY-e.clientY)<5)return;cleanup();e.ieltsDragStarted=true;document.body.classList.add('exam-answer-dragging');start(e);};
  const cleanup=()=>{document.removeEventListener('mousemove',move);document.removeEventListener('mouseup',cleanup)};
  document.addEventListener('mousemove',move);document.addEventListener('mouseup',cleanup);return false;
 };
 document.addEventListener('mouseup',()=>document.body.classList.remove('exam-answer-dragging'));
})();
