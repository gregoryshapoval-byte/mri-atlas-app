export function projectPoint(p,frame,view,width,height){
 const k=Math.min(width/700,height/760),ih=400*frame.height/frame.width;
 const x=(p.x/frame.width-.5)*400*k*view.flipX,y=(p.y/frame.height-.5)*ih*k*view.flipY,a=view.rotation*Math.PI/180;
 return {...p,sx:width/2+(x*Math.cos(a)-y*Math.sin(a))*view.zoom+view.x,sy:height/2+(x*Math.sin(a)+y*Math.cos(a))*view.zoom+view.y};
}
export function visiblePoints(points,frame,view,w,h){return points.map(p=>projectPoint(p,frame,view,w,h)).filter(p=>p.sx>=8&&p.sx<=w-8&&p.sy>=18&&p.sy<=h-8)}
export function screenLayout(points,w,h,page=0,selected=null){
 const perSide=Math.max(1,Math.floor((h-40)/56)),capacity=perSide*2,unique=new Map();
 for(const p of [...points].sort((a,b)=>Math.hypot(a.sx-w/2,a.sy-h/2)-Math.hypot(b.sx-w/2,b.sy-h/2)))if(!unique.has(p.structure))unique.set(p.structure,p);
 const all=[...unique.values()].sort((a,b)=>a.sy-b.sy||a.sx-b.sx);const pages=Math.max(1,Math.ceil(all.length/capacity));page=Math.min(page,pages-1);
 if(selected!==null){const index=all.findIndex(p=>p.structure===selected);if(index>=0)page=Math.floor(index/capacity)}
 const chosen=all.slice(page*capacity,(page+1)*capacity).sort((a,b)=>a.sx-b.sx),sides=[chosen.slice(0,Math.ceil(chosen.length/2)),chosen.slice(Math.ceil(chosen.length/2))];
 const labels=[];for(let side=0;side<2;side++){sides[side].sort((a,b)=>a.sy-b.sy);const step=Math.min(70,(h-32)/Math.max(1,sides[side].length));sides[side].forEach((p,i)=>labels.push({...p,side,ly:16+step*(i+.5)}))}
 return {labels,page,pages,total:all.length};
}
