/* Shared, reversible submission screen for standalone passages and Full Tests. */
(()=>{
 let pending=null;
 const counts=[13,13,14];
 function close(value=false){if(!pending)return;const {resolve,screen,focus}=pending;pending=null;screen.remove();document.body.classList.remove('submission-review-open');focus?.focus?.({preventScroll:true});resolve(value)}
 function open({parts=[]}={}){
  if(pending)return pending.promise;
  const focus=document.activeElement,screen=document.createElement('section');screen.className='submission-review';screen.setAttribute('role','dialog');screen.setAttribute('aria-modal','true');screen.setAttribute('aria-label','Submit your answers');
  screen.innerHTML='<div class="submission-review-stage"><div class="submission-review-row"><p>Click next to continue</p><button class="submission-review-next"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11L21 3l-6 18-4-7-8-3zm8 3L21 3"/></svg><span>Next</span></button></div></div><div class="submission-review-arrows"><button class="nav-btn nav-prev" aria-label="Return to questions"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7-7l-7 7 7 7"/></svg></button><button class="nav-btn nav-next" aria-label="Next question" disabled><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-7-7l7 7-7 7"/></svg></button></div><div class="submission-review-footer"></div>';
  const footer=screen.querySelector('.submission-review-footer');
  for(let part=1;part<=3;part++){const info=parts.find(p=>p.part===part),item=document.createElement('div');item.className='submission-review-part';const title=document.createElement('span');title.textContent='Part '+part;const progress=document.createElement('span');progress.textContent=(info?.answered||0)+' of '+(info?.total||counts[part-1]);item.append(title,progress);footer.append(item)}
  const tick=document.createElement('button');tick.className='submission-review-tick';tick.setAttribute('aria-label','Submit answers');tick.innerHTML='<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10l4 4L17 4"/></svg>';footer.append(tick);
  screen.querySelector('.submission-review-next').onclick=()=>close(true);tick.onclick=()=>close(true);screen.querySelector('.nav-prev').onclick=()=>close(false);
  screen.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close(false)}if(e.key==='Tab'){const buttons=[...screen.querySelectorAll('button:not(:disabled)')],first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
  const promise=new Promise(resolve=>pending={resolve,screen,focus});pending.promise=promise;document.body.append(screen);document.body.classList.add('submission-review-open');screen.querySelector('.submission-review-next').focus();return promise;
 }
 open.close=close;window.IELTSConfirmSubmit=open;
})();
