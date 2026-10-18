/* Selection has no side effects. Only submission writes completion histories. */
(function(root){
 const key='ielts-full-test-draft';
 function read(storage,k,fallback){try{return JSON.parse(storage.getItem(k)||'null')??fallback}catch{return fallback}}
 function completed(storage,id){const h=read(storage,'reading-'+id+'-history',[]);return Array.isArray(h)&&h.some(x=>x.completed)}
 function select(catalog,storage,rng=Math.random){return [1,2,3].map(part=>{const pool=catalog.filter(x=>x.part===part&&x.count===(part===3?14:13));if(!pool.length)throw Error('Thiếu Passage '+part);const fresh=pool.filter(x=>!completed(storage,x.id)),choices=fresh.length?fresh:pool;return choices[Math.min(choices.length-1,Math.floor(rng()*choices.length))]})}
 function manual(catalog,ids){if(!Array.isArray(ids)||ids.length!==3)throw Error('Chọn đủ 3 passages');return ids.map((id,i)=>{const item=catalog.find(x=>x.id===id&&x.part===i+1&&x.count===(i===2?14:13));if(!item)throw Error('Bài đã chọn không hợp lệ ở Passage '+(i+1));return item})}
 function submit(storage,set,answers,automatic=false){const at=new Date().toISOString();set.items.forEach((item,i)=>{const k='reading-'+item.id+'-history';let history=read(storage,k,[]);if(!Array.isArray(history))history=[];if(!history.some(x=>x.setId===set.id)){const v=answers[i];history.push({at,values:v,completed:v.filter(Boolean).length>5,mode:'practice',setId:set.id,fullTest:true,automatic});storage.setItem(k,JSON.stringify(history))}});storage.removeItem(key)}
 root.FullTestCore={key,read,completed,select,manual,submit};
})(typeof window==='undefined'?globalThis:window);
