(()=>{
 const embedded=parent!==window&&new URLSearchParams(location.search).has('full');
 if(embedded)document.documentElement.classList.add('listening-full-frame');
 window.initListeningFrame=function(api){
  const panel=document.getElementById('qpanel');
  panel.querySelectorAll('.sample-drop.me-drop').forEach(d=>{const width=d.getBoundingClientRect().width||parseFloat(getComputedStyle(d).width)||124;d.style.setProperty('--listening-drop-min',Math.max(124,width)+'px')});
  if(!embedded)return;
  function snapshot(){return {...api.snapshot(),audioTime:api.audio.currentTime||0}}
  async function restore(saved){
   for(const [q,value] of Object.entries(saved?.answers||{})){
    const el=panel.querySelector('[data-q="'+Number(q)+'"]');if(!el)continue;
    if(el.matches('.sample-drop'))api.assign(el,{kind:el.dataset.kind,value:String(value)});
    else if(el.type==='radio'){const input=[...panel.querySelectorAll('input[type=radio][data-q="'+Number(q)+'"]')].find(x=>x.value===value);if(input){input.checked=true;input.dispatchEvent(new Event('change',{bubbles:true}))}}
    else if(el.matches('input')){el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}))}
   }
   if(Number.isFinite(saved?.audioTime)&&saved.audioTime>0){const audio=api.audio;if(audio.readyState<1)await new Promise((resolve,reject)=>{const clean=()=>{audio.removeEventListener('loadedmetadata',ok);audio.removeEventListener('error',bad);clearTimeout(timeout)};const ok=()=>{clean();resolve()},bad=()=>{clean();reject(Error('Audio could not be loaded'))},timeout=setTimeout(bad,20000);audio.addEventListener('loadedmetadata',ok,{once:true});audio.addEventListener('error',bad,{once:true});audio.load()});audio.currentTime=Math.min(saved.audioTime,audio.duration||api.duration)}
  }
  window.ListeningFrame={snapshot,restore,start:()=>api.start(),finish:()=>api.finish(),focus:n=>api.focusQuestion(n),get audio(){return api.audio},duration:api.duration,answers:()=>Array.from({length:10},(_,i)=>api.firstQ+i).map(n=>({n,text:api.displayAnswer(n)})),get state(){return api.state}};
 };
})();

/* Align progress to the actual number buttons, as in the Reading footer. */
(()=>{
 function init(){
  const footer=document.getElementById('footer');if(!footer||footer.dataset.listeningProgress)return;
  footer.dataset.listeningProgress='';let pending=false;
  function align(){
   for(const part of footer.querySelectorAll('.part-nav')){
    const active=part.classList.contains('active'),complete=part.classList.contains('complete');
    let strip=part.querySelector('.listening-progress');
    if(!strip){strip=document.createElement('div');strip.className='listening-progress';strip.setAttribute('aria-hidden','true');part.prepend(strip)}
    strip.hidden=!active&&!complete;
    if(!active){if(strip.childNodes.length)strip.replaceChildren();continue}
    const bounds=part.getBoundingClientRect(),dots=[...part.querySelectorAll('.dot')];
    const segments=[{left:2,width:Math.max(0,(dots[0]?.getBoundingClientRect().left??bounds.left)-bounds.left-4),done:complete}];
    for(const dot of dots){
     const selected=dot.classList.contains('current');
     if(selected)dot.setAttribute('aria-current','step');else dot.removeAttribute('aria-current');
     const r=dot.getBoundingClientRect();segments.push({q:dot.dataset.go,left:r.left-bounds.left+1,width:Math.max(0,r.width-2),done:dot.classList.contains('answered')});
    }
    const nodes=segments.map(s=>{const span=document.createElement('span');if(s.q)span.dataset.progressQ=s.q;span.classList.toggle('done',s.done);span.style.left=s.left+'px';span.style.width=s.width+'px';return span});strip.replaceChildren(...nodes);
   }
  }
  function update(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;align()})}
  new MutationObserver(records=>{
   if(records.some(r=>!r.target.closest?.('.listening-progress')&&!(r.type==='childList'&&r.removedNodes.length===0&&r.addedNodes.length>0&&[...r.addedNodes].every(n=>n.nodeType===1&&n.matches('.listening-progress')))))update();
  }).observe(footer,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(update).observe(footer);
  window.addEventListener('resize',update);document.fonts?.ready.then(update);
  window.IELTSListeningProgress={align,update};update();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
