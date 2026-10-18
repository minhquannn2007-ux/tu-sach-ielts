/* Keep the sample HTML authoritative, with generated CSS as an immediate fallback.
   Only read its dedicated CSS block; never execute scripts or replace answers. */
(()=>{
 const source=document.currentScript?.src;
 if(!source)return;
 const typeSelectors={
  tfng:'.tfng-question',ynng:'.ync-question','mc-one':'.mc-question',
  'mc-two':'.tif-question','matching-info':'.grid-outer',
  'matching-headings':'.mh-gap,.mh-bank','matching-endings':'.me-drop,.me-endingbank',
  'summary-input':'.summ-body','summary-drag':'.dnd-summary-body,.dnd-wordbank',
  'flow-chart':'.flow-chart-viewport',notes:'.choice-notes,.note-comp-table,.source-notes',diagram:'.perfume-diagram-scroll',
  'short-answer':'.short-question','matching-features':'.researchers'
 };
 for(const [type,selector] of Object.entries(typeSelectors))document.querySelectorAll(selector).forEach(el=>el.dataset.examType=type);
 if(document.getElementById('ielts-question-template'))return;
 // A relative URL also works when the site is served below a path prefix.
 fetch(new URL('reading-sample.html',source),{cache:'no-cache'})
  .then(r=>{if(!r.ok)throw new Error('Sample unavailable');return r.text()})
  .then(html=>{
   const css=html.match(/<style\s+id="ielts-question-template">([\s\S]*?)<\/style>/)?.[1];
   if(!css?.trim())return;
   const style=document.createElement('style');style.id='ielts-question-template';style.textContent=css;document.head.append(style);
  }).catch(()=>{/* Generated CSS remains in effect if the sample cannot load. */});
})();
