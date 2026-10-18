/* The two original pages with their own footer controllers. */
(()=>{
 const button=document.querySelector('.exam-submit'),panel=document.getElementById('qpanel');
 if(!button)return;
 async function finish(automatic=false){
  if(button.disabled)return;
  if(automatic)window.IELTSConfirmSubmit?.close(false);
  else if(window.IELTSConfirmSubmit){const approved=await window.IELTSConfirmSubmit({parts:[{part:2,total:ALL_Q.length,answered:ALL_Q.filter(n=>answered.has(n)).length}]});if(!approved||button.disabled)return}
  if(window.finishCamouflage){window.IELTSSubmitApproved=true;try{window.finishCamouflage()}finally{window.IELTSSubmitApproved=false}}
  else{
   const responses=ALL_Q.map(n=>n<19?(meDropState['medrop'+n]?.text||''):(document.querySelector('input[name="mc'+n+'"]:checked,input[name="q'+n+'"]:checked')?.value||''));
   button.disabled=true;panel.inert=true;panel.querySelectorAll('input,button').forEach(e=>e.disabled=true);
   const result=document.createElement('p');result.className='legacy-submit-result';result.textContent='Đã nộp bài. Đã trả lời '+responses.filter(Boolean).length+'/'+ALL_Q.length+' câu.';panel.append(result);
   const key='reading-p2-on-the-trail-of-the-artist-history';let history=[];try{history=JSON.parse(localStorage.getItem(key)||'[]')}catch{}history.push({at:new Date().toISOString(),values:responses,completed:responses.filter(Boolean).length>5,automatic,mode:'practice'});localStorage.setItem(key,JSON.stringify(history));
  }
  if(button.disabled)window.IELTSDuration.stop();
 }
 button.setAttribute('aria-label','Nộp bài');button.onclick=()=>finish(false);
 window.IELTSDuration.single({submit:()=>finish(true),isSubmitted:()=>button.disabled});
})();
