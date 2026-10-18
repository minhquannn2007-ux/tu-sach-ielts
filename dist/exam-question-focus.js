/* One active question across shared exams and original HTML controllers. */
(()=>{
 const marks='.choice-number,.mc-num,.ync-num,.tfng-num,.qnum,.order-number,.tif-num,.sample-drop,.mh-gap,.me-drop,.dnd-drop,.choice-gap,.ans-wrap input,.note-ans-wrap input';
 let current=null,painting=false;
 function number(el){
  if(!el)return null;
  const own=Number(el.dataset?.q);if(own)return own;
  const name=(el.name||'').match(/^(?:q|mc|ync|two)(\d+)$/);if(name)return Number(name[1]);
  const id=(el.id||'').match(/^(?:q|qbox|inp|a|drop|mhgap|medrop|mc-num-|ync-num-|tfng-num-)(\d+)(?:-\d+)?$/);if(id)return Number(id[1]);
  if(el.matches?.(marks)){const n=(el.querySelector('.me-num,.dnd-num,.gapOrderNumber,.mh-num')?.textContent||el.textContent).match(/^\s*(\d+)/);if(n)return Number(n[1]);const id=(el.id||'').match(/(\d+)$/);if(id)return Number(id[1])}
  const label=el.closest?.('label');if(label?.htmlFor){const input=document.getElementById(label.htmlFor);if(input&&input!==el)return number(input)}
  const parent=el.closest?.('[data-q],.choice-question,.mc-question,.ync-question,.tfng-question,.tif-question,.two-question,.matching-question,.scorableItem,.scorable-item,.me-sentence');
  if(parent){const own=Number(parent.dataset.q);if(own)return own;const marker=parent.querySelector(marks);if(marker&&marker!==el){const n=number(marker);if(n)return n}}
  return null;
 }
 function input(n){return [...document.querySelectorAll('#passage input,#qpanel input')].find(e=>!['radio','checkbox','hidden'].includes(e.type)&&number(e)===n)}
 function paint(){if(painting)return;painting=true;
  document.querySelectorAll('#passage '+marks.split(',').join(',#passage ')+',#qpanel '+marks.split(',').join(',#qpanel ')).forEach(e=>{e.classList.toggle('exam-question-active',number(e)===current)});
  document.querySelectorAll('#bb-dots button,.tif-dot').forEach(e=>{const range=e.dataset.examQuestions?.split(',').map(Number),start=Number(e.dataset.examQ)||Number(e.id.match(/\d+/)?.[0])||Number(e.textContent.match(/\d+/)?.[0]),active=range?range.includes(current):start===current;if(e.classList.contains('video-current')!==active)e.classList.toggle('video-current',active);if(!active&&e.classList.contains('active'))e.classList.remove('active')});
  painting=false;
 }
 function activate(n,{focus=false,notify=true}={}){n=Number(n);if(!Number.isInteger(n)||n<1||n>40)return;const changed=n!==current;current=n;if(typeof activeQ!=='undefined')activeQ=n;paint();
  if(focus){const field=input(n);if(field&&!field.disabled)field.focus({preventScroll:true});else if(document.activeElement?.matches('input,textarea')&&document.activeElement.closest('#passage,#qpanel'))document.activeElement.blur()}
  if(changed&&notify){document.dispatchEvent(new CustomEvent('ielts-question-focus',{detail:{n}}));if(parent!==window&&new URLSearchParams(location.search).get('full')==='1')parent.postMessage({type:'full-test-focus',n},location.origin)}
 }
 function init(){
  if(!document.querySelector('#qpanel'))return;
  for(const name of ['setActive','onAnswer','navigateTo']){const previous=window[name];if(typeof previous==='function')window[name]=function(n,...args){const result=previous.call(this,n,...args);activate(n,{focus:name==='navigateTo'});return result}}
  for(const type of ['focusin','click','input','change'])document.addEventListener(type,e=>{if(!e.target.closest?.('#passage,#qpanel'))return;const n=number(e.target);if(n)activate(n);queueMicrotask(paint)},true);
  document.addEventListener('click',e=>{const control=e.target.closest?.('.nav-prev,.nav-next,#bb-dots button,.tif-dot');if(!control)return;queueMicrotask(()=>{const dot=document.querySelector('#bb-dots .video-current,#bb-dots .active'),n=Number(dot?.dataset.examQ)||Number(dot?.id?.match(/\d+/)?.[0])||Number(dot?.textContent?.match(/\d+/)?.[0]);if(n)activate(n,{focus:true});else if(typeof activeQ!=='undefined')activate(activeQ,{focus:true})})},true);
  document.addEventListener('pointerup',e=>{const drop=document.elementFromPoint(e.clientX,e.clientY)?.closest('.sample-drop,.mh-gap,.me-drop,.dnd-drop');if(drop){const n=number(drop);queueMicrotask(()=>activate(n))}},true);
  const first=document.querySelector('#qpanel '+marks.split(',').join(',#qpanel '));if(typeof activeQ!=='undefined'&&activeQ)activate(activeQ);else if(first)activate(number(first));
 }
 window.IELTSQuestionFocus={activate,number,input,get current(){return current}};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
