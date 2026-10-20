/* Automatically list reviewed data lessons alongside the original HTML lessons. */
(async()=>{
 function appendCredit(card,cover){if(!cover.credit)return;const credit=document.createElement('small');credit.style.cssText='display:block;font:11px Arial;color:#777;margin-top:6px';credit.append(document.createTextNode('Photo: '));const source=document.createElement('a');source.href=cover.source;source.textContent=cover.credit;const license=document.createElement('a');license.href=cover.licenseUrl;license.textContent=cover.license;credit.append(source,document.createTextNode(' / '),license);card.append(credit)}
 const root=document.getElementById('reading-home'),grid=root?.querySelector('.grid');if(!grid)return;
 try{
  const [overrides,response]=await Promise.all([fetch('cover-overrides.json',{cache:'no-cache'}).then(r=>r.ok?r.json():{}).catch(()=>({})),fetch('lesson-catalog.json',{cache:'no-cache'})]);
  for(const card of grid.querySelectorAll('article')){
   const href=card.querySelector('a.open-lesson')?.getAttribute('href'),cover=overrides[href];if(!cover)continue;
   const image=card.querySelector('.cover img');if(image){image.src=cover.asset;image.alt=cover.alt}
   const oldCredit=card.querySelector('small');if(oldCredit)oldCredit.remove();
   appendCredit(card,cover);
  }
  if(!response.ok)return;const lessons=await response.json();
  for(const item of [...lessons].reverse()){
   const card=document.createElement('article');card.dataset.part=item.part;card.dataset.lessonId=item.id;
   const cover=document.createElement('div');cover.className='cover';const image=document.createElement('img');image.src=item.cover.asset;image.alt=item.cover.alt;image.loading='lazy';cover.append(image);
   const label=document.createElement('span');label.className='label';label.textContent='PASSAGE '+item.part+' | '+item.count+' CÂU';
   const title=document.createElement('h3');title.textContent=item.title;const meta=document.createElement('span');meta.className='meta';meta.textContent=item.types.join(' — ');
   const state=document.createElement('span');state.className='state';let history=[];try{history=JSON.parse(localStorage.getItem('reading-'+item.id+'-history')||'[]')}catch{}state.textContent=history.some(x=>x.completed)?'Đã làm':'Chưa làm';
   const link=document.createElement('a');link.className='open-lesson';link.href='exam.html?lesson='+item.id;link.textContent='Vào làm bài';
   card.append(cover,label,title,meta,state,link);
   appendCredit(card,item.cover);
   grid.prepend(card);
  }
  window.ReadingHome?.sort();window.ReadingHome?.filter();
 }catch{/* Existing lessons remain usable if the catalog cannot be loaded. */}
})();
