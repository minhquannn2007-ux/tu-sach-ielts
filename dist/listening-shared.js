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
