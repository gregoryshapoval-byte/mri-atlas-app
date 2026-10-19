// Presentation supplement composed after historical overlays. No source mutation.
export async function addJointLines(moduleName,data){
 const res=await fetch(moduleName+'-joints154.json');if(!res.ok)throw Error('joint lines');const e=await res.json(),code=data.seriesIndex[0].module;
 for(const f of e.filters){const prior=data.filters[code].find(x=>x.id===f.id);if(prior)Object.assign(prior,f);else data.filters[code].push(f)}
 for(const key of ['displayNames','structureNotes','searchAliases'])data[key]={...data[key],...e[key]};
 data.pointPresentation||={};for(const [id,p]of Object.entries(e.pointPresentation))data.pointPresentation[id]={...data.pointPresentation[id],...p};
 data.seriesSlices||={};for(const [series,slices]of Object.entries(e.seriesSlices)){const ss=data.seriesSlices[series]||={};for(const [id,add]of Object.entries(slices)){const old=ss[id]||={};ss[id]={...old,points:[...(old.points||[]),...(add.points||[])],regions:[...(old.regions||[]),...(add.regions||[])],suppress:[...new Set([...(old.suppress||[]),...add.suppress])],suppressMasks:[...new Set([...(old.suppressMasks||[]),...add.suppressMasks])]}}};
 const old=data.shoulderGuide||{};data.shoulderGuide={...old,guideTitle:e.guideTitle,guideHint:e.guideHint,guideChapters:[...e.guideChapters,...(old.guideChapters||[])],catalogNames:{...old.catalogNames,...e.catalogNames},sources:[...(old.sources||[]),...e.sources],limitations:[...(old.limitations||[]),...e.limitations]};
 try{const key=data.storageKey+':joints154';if(!localStorage.getItem(key)){const saved=JSON.parse(localStorage.getItem(data.storageKey));if(saved?.groups?.[code]){const selected=new Set(saved.groups[code]);for(const [parent,child]of e.migration)if(selected.has(parent))selected.add(child);saved.groups[code]=[...selected];localStorage.setItem(data.storageKey,JSON.stringify(saved))}localStorage.setItem(key,'1')}}catch{}
}
