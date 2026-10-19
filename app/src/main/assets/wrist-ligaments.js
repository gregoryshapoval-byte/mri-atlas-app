// Expected-topography supplement composed after146/154/155, never fibre segmentation.
export async function addWristLigaments(data){
 const res=await fetch('wrist-mri-ligaments156.json');if(!res.ok)throw Error('capitate anatomy');const e=await res.json(),code='wrist-mri-3d';
 for(const f of e.filters){const old=data.filters[code].find(g=>g.id===f.id);if(old)Object.assign(old,f);else data.filters[code].push(f)}
 for(const key of ['structureNotes','displayNames','shortNames','searchAliases'])data[key]={...data[key],...e[key]};
 data.seriesSlices||={};for(const [sid,slices]of Object.entries(e.seriesSlices)){const ss=data.seriesSlices[sid]||={};for(const [id,add]of Object.entries(slices)){const old=ss[id]||{};ss[id]={...old,points:[...(old.points||[]),...add.points],regions:[...(old.regions||[]),...add.regions],suppress:[...new Set([...(old.suppress||[]),...add.suppress])],suppressMasks:[...new Set([...(old.suppressMasks||[]),...add.suppressMasks])]}}}
 data.catalog=[...(data.catalog||[]).filter(c=>!e.catalog.some(n=>n.id===c.id)),...e.catalog];const old=data.shoulderGuide||{};data.shoulderGuide={...old,guideTitle:e.guideTitle,guideHint:e.guideHint,guideChapters:[...e.guideChapters,...(old.guideChapters||[])],catalogNames:{...old.catalogNames,...e.catalogNames},sources:[...(old.sources||[]),...e.sources],limitations:[...(old.limitations||[]),...e.limitations]};
 try{const key=data.storageKey+':ligaments156';if(!localStorage.getItem(key)){const saved=JSON.parse(localStorage.getItem(data.storageKey));if(saved?.groups?.[code]?.includes(91270)){saved.groups[code]=[...new Set([...saved.groups[code],...e.filters.map(f=>f.id)])];localStorage.setItem(data.storageKey,JSON.stringify(saved))}localStorage.setItem(key,'1')}}catch{}
}
