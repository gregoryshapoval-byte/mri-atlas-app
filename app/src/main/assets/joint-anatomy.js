// Overlay-only augmentation. Original image manifests, points and names are retained.
export async function addJointAnatomy(moduleName,data){
 const code={'shoulder-mri':'shoulder','knee-mri':'knee','foot-mri':'cheville'}[moduleName];if(!code)return;
 const res=await fetch(moduleName+(moduleName==='foot-mri'?'-anatomy144.json':'-anatomy145.json'));if(!res.ok)throw Error('joint anatomy');const extra=await res.json();
 for(const f of extra.filters){const old=data.filters[code].find(x=>x.id===f.id);if(old)Object.assign(old,f);else data.filters[code].push(f)}
 data.structureNotes={...data.structureNotes,...extra.structureNotes};data.displayNames=extra.displayNames;data.shortNames=extra.shortNames;data.seriesSlices=extra.seriesSlices;data.shoulderGuide=extra;
 try{const key=data.storageKey+':r144';if(!localStorage.getItem(key)){const saved=JSON.parse(localStorage.getItem(data.storageKey));if(saved?.groups?.[code]){saved.groups[code]=[...new Set([...saved.groups[code],...extra.filters.filter(f=>f.default).map(f=>f.id)])];localStorage.setItem(data.storageKey,JSON.stringify(saved))}localStorage.setItem(key,'1')}}catch{}
}
