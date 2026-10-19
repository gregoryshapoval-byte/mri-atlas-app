// Presentation and explicit T2 landmarks only; source labels and MRI stay intact.
export async function addFemalePelvisAnatomy(data){
 if(data.femalePelvisRevision==='1.62')return;
 const res=await fetch('female-pelvis-mri-anatomy162.json');if(!res.ok)throw Error('female pelvis anatomy');const e=await res.json();
 data.storageKey||='female-pelvis-mri-anatomy-v1';
 for(const f of e.filters){const old=data.filters.pelvis.find(x=>x.id===f.id);if(old)Object.assign(old,f);else data.filters.pelvis.push(f)}
 for(const key of['displayNames','shortNames','searchAliases','structureNotes','pointPresentation'])data[key]={...data[key],...e[key]};
 data.seriesSlices={...data.seriesSlices};for(const[sid,slices]of Object.entries(e.seriesSlices)){data.seriesSlices[sid]={...data.seriesSlices[sid]};for(const[ann,extra]of Object.entries(slices)){const old=data.seriesSlices[sid][ann]||{};data.seriesSlices[sid][ann]={...old,...extra,points:[...(old.points||[]),...(extra.points||[])],suppress:[...new Set([...(old.suppress||[]),...(extra.suppress||[])])]}}}
 data.shoulderGuide=e;data.femalePelvisRevision='1.62';
 // Split the existing genital group once; preserve all other visibility choices.
 try{const migration=data.storageKey+':r162';if(!localStorage.getItem(migration)){const saved=JSON.parse(localStorage.getItem(data.storageKey));if(saved?.groups?.pelvis?.includes(1147)){saved.groups.pelvis=[...new Set([...saved.groups.pelvis,16201])];localStorage.setItem(data.storageKey,JSON.stringify(saved))}localStorage.setItem(migration,'1')}}catch{}
}
