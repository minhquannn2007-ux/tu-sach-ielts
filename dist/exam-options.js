/* Exam-only display preferences, shared with Full Test frames. */
(()=>{
 const key='ielts-exam-display-preferences',contrasts=['black-on-white','white-on-black','yellow-on-black'],sizes=['regular','large','extra-large'];
 const embedded=parent!==window&&new URLSearchParams(location.search).get('full')==='1';
 const clean=value=>({contrast:contrasts.includes(value?.contrast)?value.contrast:contrasts[0],textSize:sizes.includes(value?.textSize)?value.textSize:sizes[0]});
 function read(){try{return clean(JSON.parse(localStorage.getItem(key)||'null'))}catch{return clean(null)}}
 let settings=clean(embedded&&parent.IELTSOptions?parent.IELTSOptions.settings:read()),screen=null,view='options',trigger=null,previousFocus=null,blocked=[];
 function apply(next,{save=false,propagate=true}={}){
  settings=clean(next);const root=document.documentElement;root.dataset.examContrast=settings.contrast;root.dataset.examTextSize=settings.textSize;root.toggleAttribute('data-exam-dark',settings.contrast!==contrasts[0]);root.style.setProperty('--exam-text-scale',settings.textSize==='large'?'1.25':settings.textSize==='extra-large'?'1.5':'1');
  if(save)try{localStorage.setItem(key,JSON.stringify(settings))}catch{}
  if(propagate)for(const frame of document.querySelectorAll('#full-frames iframe'))try{frame.contentWindow.IELTSOptions?.apply(settings,{propagate:false})}catch{}
  if(screen)paintChecks();window.dispatchEvent(new Event('resize'));
 }
 function paintChecks(){for(const button of screen.querySelectorAll('[data-preference]')){const checked=settings[button.dataset.preference]===button.dataset.value;button.setAttribute('aria-checked',String(checked));button.querySelector('.options-check').textContent=checked?'✓':''}}
 const arrow='<svg class="options-arrow" viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 6 6-6 6"/></svg>';
 const contrastIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none"/></svg>';
 const sizeIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6M10 6v8M6 10h8"/></svg>';
 const swatch=mode=>'<span class="options-swatch '+mode+'" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
 function render(nextView='options'){
  view=nextView;const title=view==='options'?'Options':view==='contrast'?'Contrast':'Text size';
  screen.innerHTML='<header class="options-heading"><button class="options-back" type="button"'+(view==='options'?' hidden':'')+'><span aria-hidden="true">❮</span> Options</button><h1 id="options-title">'+title+'</h1><button class="options-close" aria-label="Close options" type="button">×</button></header><div class="options-content'+(view==='options'?'':' options-subpage')+'"></div>';
  const content=screen.querySelector('.options-content');
  if(view==='options'){
   content.innerHTML='<button class="options-submit" type="button" disabled aria-disabled="true"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 18-8-6 20-4-8-8-4zm8 4L21 2"/></svg><span>Go to submission page</span>'+arrow+'</button><div class="options-list"><button class="options-row" data-page="contrast" type="button"><span class="options-icon">'+contrastIcon+'</span><span>Contrast</span>'+arrow+'</button><button class="options-row" data-page="size" type="button"><span class="options-icon">'+sizeIcon+'</span><span>Text size</span>'+arrow+'</button></div>';
   content.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>render(b.dataset.page));
  }else{
   const values=view==='contrast'?contrasts:sizes,labels=view==='contrast'?['Black on white','White on black','Yellow on black']:['Regular','Large','Extra large'],property=view==='contrast'?'contrast':'textSize';
   const list=document.createElement('div');list.className='options-list';list.setAttribute('role','radiogroup');list.setAttribute('aria-label',title);
   values.forEach((value,i)=>{const b=document.createElement('button');b.className='options-row';b.type='button';b.setAttribute('role','radio');b.dataset.preference=property;b.dataset.value=value;b.innerHTML='<span class="options-check" aria-hidden="true"></span><span>'+labels[i]+'</span>'+(view==='contrast'?swatch(value):'');b.onclick=()=>{apply({...settings,[property]:value},{save:true});b.focus()};list.append(b)});content.append(list);paintChecks();
  }
  screen.querySelector('.options-close').onclick=close;screen.querySelector('.options-back').onclick=()=>render();screen.querySelector(view==='options'?'[data-page]':'[aria-checked="true"]')?.focus();
 }
 function open(){if(embedded){parent.IELTSOptions?.open();return}if(screen){close();return}previousFocus=document.activeElement;blocked=[...document.body.children].filter(e=>!e.matches('script,style')).map(e=>[e,e.inert]);blocked.forEach(([e])=>e.inert=true);screen=document.createElement('section');screen.className='exam-options-screen';screen.setAttribute('role','dialog');screen.setAttribute('aria-modal','true');screen.setAttribute('aria-labelledby','options-title');screen.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close()}if(e.key==='Tab'){const buttons=[...screen.querySelectorAll('button:not(:disabled):not([hidden])')],first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});document.body.append(screen);document.body.classList.add('exam-options-open');render()}
 function close(){if(!screen)return;screen.remove();screen=null;blocked.forEach(([e,inert])=>e.inert=inert);blocked=[];document.body.classList.remove('exam-options-open');previousFocus?.focus?.({preventScroll:true})}
 function init(){
  if(embedded)return;
  const icons=[...document.querySelectorAll('.top-nav .nav-icons>svg,.top-nav .nav-icons>img')];trigger=icons.find(e=>e.tagName.toLowerCase()==='svg'&&e.querySelectorAll('line').length===3)||icons[2];
  if(trigger){trigger.dataset.examOptions='';trigger.setAttribute('role','button');trigger.setAttribute('aria-label','Options');trigger.setAttribute('aria-haspopup','dialog');trigger.tabIndex=0;trigger.addEventListener('click',open);trigger.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})}
  // A vector bell follows both contrast palettes without a white bitmap square.
  const bell=icons[1];if(bell?.tagName.toLowerCase()==='img'){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-label','Notifications');svg.classList.add('exam-bell');svg.innerHTML='<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>';bell.replaceWith(svg)}
  new MutationObserver(()=>{if(screen&&(document.querySelector('.full-summary')?.hidden===false||document.getElementById('full-summary')?.hidden===false||document.querySelector('.exam-submit')?.disabled))close()}).observe(document.body,{subtree:true,attributes:true,attributeFilter:['hidden','disabled']});
 }
 window.IELTSOptions={get settings(){return {...settings}},apply,open,close};apply(settings);
 window.addEventListener('storage',e=>{if(e.key===key)apply(read())});
 document.addEventListener('load',e=>{if(e.target.matches?.('#full-frames iframe'))try{e.target.contentWindow.IELTSOptions?.apply(settings,{propagate:false})}catch{}},true);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
