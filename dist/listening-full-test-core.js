/* Listening selection never writes history. Submission is idempotent per set. */
(function(root){
 const key='ielts-listening-full-test-draft';
 function read(storage,k,fallback){try{return JSON.parse(storage.getItem(k)||'null')??fallback}catch{return fallback}}
 function completed(storage,id){const h=read(storage,'listening-'+id+'-history',[]);return Array.isArray(h)&&h.some(x=>x.completed)}
 function select(catalog,storage,rng=Math.random){return [1,2,3,4].map(part=>{const pool=catalog.filter(x=>x.part===part&&x.count===10);if(!pool.length)throw Error('Thiếu bài Listening Part '+part);const fresh=pool.filter(x=>!completed(storage,x.id)),choices=fresh.length?fresh:pool;return choices[Math.min(choices.length-1,Math.floor(rng()*choices.length))]})}
 function valid(catalog,set){return set&&Array.isArray(set.items)&&set.items.length===4&&set.items.every((x,i)=>catalog.some(c=>c.id===x.id&&c.part===i+1&&c.count===10))&&Number.isInteger(set.audioIndex)&&set.audioIndex>=0&&set.audioIndex<4&&['ready','playing','review'].includes(set.phase)&&Number.isFinite(set.reviewLeft)&&set.reviewLeft>=0&&set.reviewLeft<=120}
 function submit(storage,set,snapshots,automatic=false){const submittedAt=new Date().toISOString();set.items.forEach((item,i)=>{const k='listening-'+item.id+'-history';let history=read(storage,k,[]);if(!Array.isArray(history))history=[];if(!history.some(x=>x.setId===set.id)){const answers=snapshots[i]?.answers||{};history.push({setId:set.id,fullTest:true,completed:Array.from({length:10},(_,n)=>i*10+n+1).filter(n=>String(answers[n]??'').trim()).length>5,answers,submittedAt,automatic});storage.setItem(k,JSON.stringify(history))}});storage.removeItem(key)}
 root.ListeningFullTestCore={key,read,completed,select,valid,submit};
})(typeof window==='undefined'?globalThis:window);
