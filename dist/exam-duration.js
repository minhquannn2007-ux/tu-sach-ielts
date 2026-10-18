/* Whole-minute setup shared by single passages and Full Tests. */
(()=>{
 const embedded=new URLSearchParams(location.search).get('full')==='1'&&parent!==window;
 const valid=value=>/^\d+$/.test(String(value))&&Number(value)>=1&&Number(value)<=120;
 const label=ms=>{const n=Math.ceil(Math.max(0,ms)/60000);return n+' '+(n===1?'minute':'minutes')+' remaining'};
 if(!embedded)document.documentElement.classList.add('duration-pending');
 function reveal(){document.documentElement.classList.remove('duration-pending')}
 function choose(){
  return new Promise(resolve=>{
   const screen=document.createElement('section');screen.className='duration-screen';screen.setAttribute('role','dialog');screen.setAttribute('aria-modal','true');screen.setAttribute('aria-labelledby','duration-question');
   screen.innerHTML='<form class="duration-form" novalidate><h1 id="duration-question">Bạn muốn làm trong vòng bao nhiêu phút?</h1><label for="duration-minutes">Số phút (1–120)</label><input id="duration-minutes" type="number" min="1" max="120" step="1" inputmode="numeric" autocomplete="off" required aria-describedby="duration-error"><p id="duration-error" role="alert"></p><button type="submit">Bắt đầu làm bài</button><a class="duration-back" href="'+(location.pathname.includes('/bai/')?'../':'')+'index.html">Về thư viện</a></form>';
   const form=screen.querySelector('form'),input=screen.querySelector('input'),error=screen.querySelector('[role=alert]');
   form.onsubmit=e=>{e.preventDefault();if(!valid(input.value)){error.textContent='Vui lòng nhập số phút nguyên từ 1 đến 120.';input.setAttribute('aria-invalid','true');input.focus();return}const minutes=Number(input.value);screen.remove();reveal();resolve(minutes)};
   input.oninput=()=>{error.textContent='';input.removeAttribute('aria-invalid')};
   screen.addEventListener('keydown',e=>{if(e.key==='Tab'){const items=[input,form.querySelector('button'),form.querySelector('a')],first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
   document.body.append(screen);input.focus();
  });
 }
 let stop=()=>{};
 async function single({submit,isSubmitted}){
  if(embedded)return;
  document.querySelectorAll('.exam-home,a[href="../index.html"]').forEach(a=>a.remove());
  const taker=document.querySelector('.nav-taker');if(!taker)return;
  let block=taker.closest('.nav-taker-block');if(!block){block=document.createElement('div');block.className='nav-taker-block';taker.before(block);block.append(taker)}
  const clock=document.createElement('span');clock.className='nav-timer';clock.id='exam-countdown';block.append(clock);
  const minutes=await choose();clock.textContent=label(minutes*60000);
  // Restoring answers is part of setup; it must not consume exam time.
  if(document.getElementById('resume-choice'))await new Promise(resolve=>{const observer=new MutationObserver(()=>{if(!document.getElementById('resume-choice')){observer.disconnect();resolve()}});observer.observe(document.body,{childList:true})});
  let remainingMs=minutes*60000,last=Date.now(),running=true,finished=false;
  const remaining=()=>Math.max(0,remainingMs-(running?Date.now()-last:0));
  const tick=()=>{if(finished||!running)return;if(isSubmitted()){stop();return}const ms=remaining();clock.textContent=label(ms);clock.classList.toggle('urgent',ms<=300000);if(ms===0){stop();submit()}};
  const timer=setInterval(tick,1000);
  const pause=()=>{if(finished||!running)return;remainingMs=remaining();running=false};
  const resume=()=>{if(finished||running)return;last=Date.now();running=true;tick()};
  const visible=()=>tick();
  stop=()=>{if(finished)return;remainingMs=remaining();finished=true;running=false;clearInterval(timer);window.removeEventListener('pagehide',pause);window.removeEventListener('pageshow',resume);document.removeEventListener('visibilitychange',visible)};
  window.addEventListener('pagehide',pause);window.addEventListener('pageshow',resume);document.addEventListener('visibilitychange',visible);tick();
 }
 window.IELTSDuration={valid,label,choose,reveal,single,stop:()=>stop()};
})();
