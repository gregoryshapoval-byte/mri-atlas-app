// Explicit anatomical station order. Planes/contrasts and 3D views never auto-chain.
export const zoneOrders={
 'upper-limb-mri':['406-contraste_','407-contraste_','408-contraste_','409-contraste_','410-contraste_','411-contraste_'],
 'lower-limb-mri':['535-contraste_','536-contraste_','537-contraste_','538-contraste_','539-contraste_','540-contraste_']
};
export function zoneSeries(data,moduleName,current){
 const ids=zoneOrders[moduleName];if(!ids?.includes(current.id))return [];
 const series=ids.map(id=>data.series.find(s=>s.id===id));if(series.some(s=>!s?.frames.length||s.group!=='multiplanar'||s.module!==current.module))return [];
 // Source frame numbers are the original ordering, not inferred DICOM geometry.
 let previous;for(const s of series)for(const f of s.frames){if(!Number.isInteger(f.sourceFrame)||(previous!==undefined&&f.sourceFrame!==previous+1))return [];previous=f.sourceFrame}
 return series;
}
export function resolveSeriesFrame(data,moduleName,current,index){
 const chain=zoneSeries(data,moduleName,current),i=Number.isFinite(index)?Math.trunc(index):0;
 if(!chain.length)return {series:current,index:Math.max(0,Math.min(current.frames.length-1,i))};
 const offset=chain.slice(0,chain.indexOf(current)).reduce((n,s)=>n+s.frames.length,0),total=chain.reduce((n,s)=>n+s.frames.length,0);let position=Math.max(0,Math.min(total-1,offset+i));
 for(const series of chain){if(position<series.frames.length)return {series,index:position};position-=series.frames.length}
}
export function flowPosition(data,moduleName,current,index){
 const chain=zoneSeries(data,moduleName,current);if(!chain.length)return null;
 return {index:chain.slice(0,chain.indexOf(current)).reduce((n,s)=>n+s.frames.length,0)+index,total:chain.reduce((n,s)=>n+s.frames.length,0)};
}
