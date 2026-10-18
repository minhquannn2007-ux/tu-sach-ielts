/* Automatically list reviewed data lessons alongside the original HTML lessons. */
(async()=>{
 const root=document.getElementById('reading-home'),grid=root?.querySelector('.grid');if(!grid)return;
 try{
  const response=await fetch('lesson-catalog.json',{cache:'no-cache'});if(!response.ok)return;const lessons=await response.json();
  for(const item of [...lessons].reverse()){
   const card=document.createElement('article');card.dataset.part=item.part;card.dataset.lessonId=item.id;
   const cover=document.createElement('div');cover.className='cover';const image=document.createElement('img');image.src=item.cover.asset;image.alt=item.cover.alt;image.loading='lazy';cover.append(image);
   const label=document.createElement('span');label.className='label';label.textContent='PASSAGE '+item.part+' | '+item.count+' CÂU';
   const title=document.createElement('h3');title.textContent=item.title;const meta=document.createElement('span');meta.className='meta';meta.textContent=item.types.join(' — ');
   const state=document.createElement('span');state.className='state';let history=[];try{history=JSON.parse(localStorage.getItem('reading-'+item.id+'-history')||'[]')}catch{}state.textContent=history.some(x=>x.completed)?'Đã làm':'Chưa làm';
   const link=document.createElement('a');link.className='open-lesson';link.href='exam.html?lesson='+item.id;link.textContent='Vào làm bài';
   card.append(cover,label,title,meta,state,link);
   if(item.cover.credit){const credit=document.createElement('small');credit.style.cssText='display:block;font:11px Arial;color:#777;margin-top:6px';credit.append(document.createTextNode('Photo: '));const source=document.createElement('a');source.href=item.cover.source;source.textContent=item.cover.credit;const license=document.createElement('a');license.href=item.cover.licenseUrl;license.textContent=item.cover.license;credit.append(source,document.createTextNode(' / '),license);card.append(credit)}
   grid.prepend(card);
  }
  window.ReadingHome?.sort();window.ReadingHome?.filter();
 }catch{/* Existing lessons remain usable if the catalog cannot be loaded. */}
})();
