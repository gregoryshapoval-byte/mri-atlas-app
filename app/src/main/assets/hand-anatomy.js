// Hand presentation revision. Original MRI, points and source metadata are untouched.
export async function addHandAnatomy(data){
 const res=await fetch('hand-mri-anatomy153.json');if(!res.ok)throw Error('hand anatomy');const extra=await res.json(),code='hand-mr';
 for(const f of extra.filters){const old=data.filters[code].find(x=>x.id===f.id);if(old)Object.assign(old,f);else data.filters[code].push(f)}
 for(const key of ['displayNames','shortNames','searchAliases','structureNotes','pointPresentation','seriesSlices'])data[key]={...data[key],...extra[key]};data.shoulderGuide=extra;
 // Keep the user's selection when an old group is divided into child groups.
 try{const key=data.storageKey+':r153';if(!localStorage.getItem(key)){const saved=JSON.parse(localStorage.getItem(data.storageKey));if(saved?.groups?.[code]){const selected=new Set(saved.groups[code]);for(const f of extra.filters)if(f.parent&&selected.has(f.parent))selected.add(f.id);if(selected.has(409))selected.add(15301);saved.groups[code]=[...selected];localStorage.setItem(data.storageKey,JSON.stringify(saved))}localStorage.setItem(key,'1')}}catch{}
}
