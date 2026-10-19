// Review display only; historical points, geometry and full names remain intact.
export async function addWristReview(data){
 const res=await fetch('wrist-mri-review157.json');if(!res.ok)throw Error('wrist review');
 const e=await res.json();data.pointReview=e;
 for(const f of data.filters['wrist-mri-3d'])if(e.filterNames[f.id])f.name=e.filterNames[f.id];
}
