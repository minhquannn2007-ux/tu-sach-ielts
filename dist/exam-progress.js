/* Shared by standalone exams, sample and Full Test. No equally spaced guesses. */
(()=>{
 function questionNumbers(button){const text=(button.querySelector('.tif-dot-label,.bb-q-num')||button).textContent;const range=text.match(/(\d+)\s*[–−-]\s*(\d+)/);if(range){const a=Number(range[1]),b=Number(range[2]);return Array.from({length:b-a+1},(_,i)=>a+i)}const n=Number(button.dataset.examQ||(button.id.match(/^dot(\d+)$/)||[])[1]||text.match(/\d+/)?.[0]);return n?[n]:[]}
 function align(part){const strip=part.querySelector('.exam-part-progress');if(!strip||!part.classList.contains('bb-active-part'))return;const bounds=part.getBoundingClientRect();
  let label=strip.querySelector('.exam-label-progress');
  if(!label){label=document.createElement('span');label.className='exam-label-progress';strip.prepend(label)}if(!strip.classList.contains('exam-progress-aligned'))strip.classList.add('exam-progress-aligned');const targets=new Map();for(const b of part.querySelectorAll('#bb-dots button,.tif-dot,.subQuestion.scorable-item')){const ns=questionNumbers(b);b.classList.toggle('exam-grouped-dot',ns.length>1);const r=(b.querySelector('.tif-dot-label,.bb-q-num')||b).getBoundingClientRect(),viewport=b.closest('.bb-numbers-row')?.getBoundingClientRect();ns.forEach((n,i)=>targets.set(n,{left:r.left+r.width*i/ns.length,right:r.left+r.width*(i+1)/ns.length,clipLeft:Math.max(bounds.left,viewport?.left??bounds.left),clipRight:Math.min(bounds.right,viewport?.right??bounds.right)}))}
  const first=[...targets.values()].sort((a,b)=>a.left-b.left)[0];
  label.classList.toggle('done',part.classList.contains('exam-all-answered'));label.style.left='3px';label.style.width=Math.max(0,(first?.left??bounds.left)-bounds.left-6)+'px';
  label.style.display=first&&first.left>first.clipLeft?'block':'none';
  for(const seg of strip.querySelectorAll('[data-progress-q]')){const t=targets.get(Number(seg.dataset.progressQ));if(!t){seg.style.display='none';continue}const left=Math.max(t.left,t.clipLeft),right=Math.min(t.right,t.clipRight);seg.style.display=right>left?'block':'none';seg.style.left=(left-bounds.left)+'px';seg.style.width=Math.max(0,right-left)+'px'}
 }
 let pending=false;function update(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;document.querySelectorAll('.bottom-bar .bb-active-part').forEach(align)})}
 const footer=document.querySelector('.bottom-bar');if(!footer)return;
 new MutationObserver(update).observe(footer,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
 if(typeof ResizeObserver!=='undefined')new ResizeObserver(update).observe(footer);
 footer.addEventListener('scroll',update,true);window.addEventListener('resize',update);window.visualViewport?.addEventListener('resize',update);document.fonts?.ready.then(update);
 window.IELTSProgress={align,update};update();
})();
