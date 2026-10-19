import {projectPoint} from './brain-screen-labels.js';
import {categories} from './anatomy-colors.js';
const NS='http://www.w3.org/2000/svg';
export function annotationSlice(data,series,frame){
 const review=p=>{const shortName=data.pointReview?.shortNames?.[p.structure],coveredBy=data.pointReview?.coincident?.[series.id]?.[frame.annotation]?.[p.structure];return shortName||coveredBy?{...p,...(shortName?{shortName}:{}),...(coveredBy?{coveredBy}:{})}:p};
 const base=data.slices[frame.annotation]||{points:[],masks:[]},extra=data.seriesSlices?.[series.id]?.[frame.annotation];
 const points=base.points.map(p=>{const presentation=data.pointPresentation?.[p.structure];let q=(data.displayNames?.[p.structure]||data.shortNames?.[p.structure])?{...p,name:data.displayNames?.[p.structure]||p.name,shortName:data.shortNames?.[p.structure]||p.shortName}:p;if(presentation)q={...q,filter:presentation.filter??q.filter,category:presentation.category??q.category};return q});
 if(!extra)return {...base,points:points.map(review)};
 return {...base,masks:(base.masks||[]).filter(m=>!extra.suppressMasks?.includes(m.filter)),points:[...points.filter(p=>!extra.suppress?.includes(p.structure)),...(extra.points||[])].map(review),regions:extra.regions||[]};
}
// Ribbons have explicit per-frame paths, stored in source pixel coordinates.
// Project every vertex with exactly the same transform as the original points.
export function regionGeometry(region,frame,view,w,h){
 const vertices=region.vertices.map(([x,y])=>projectPoint({x,y},frame,view,w,h));
 const xs=vertices.map(p=>p.sx),ys=vertices.map(p=>p.sy);
 const visible=Math.max(...xs)>=0&&Math.min(...xs)<=w&&Math.max(...ys)>=0&&Math.min(...ys)<=h;
 const anchors=vertices.filter(p=>p.sx>=8&&p.sx<=w-8&&p.sy>=8&&p.sy<=h-8);
 const anchor=anchors[Math.floor(anchors.length/2)];
 const scale=400/frame.width*Math.min(w/700,h/760)*view.zoom;
 return {vertices,visible,anchor,width:region.width*scale};
}
export function drawRegions(overlay,regions,frame,view,w,h,selected){
 const anchors=[];
 for(const r of regions){
  const geom=regionGeometry(r,frame,view,w,h);if(!geom.visible)continue;
  const color=categories[r.category||'organs'].color;
  const g=document.createElementNS(NS,'g');g.dataset.structure=r.structure;g.classList.add('anatomyRegion');g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',r.name);g.dataset.approximate=String(r.approximate);
  const path=geom.vertices.map((p,i)=>(i?'L':'M')+p.sx+','+p.sy).join(' ');
  for(const [width,opacity,dash]of [[Math.max(16,geom.width),0,null],[Math.max(2,geom.width),.28,null],[selected===r.structure?2:1,.85,r.approximate?'4 3':null]]){
   const p=document.createElementNS(NS,'path');for(const [k,v]of Object.entries({d:path,fill:'none',stroke:color,'stroke-width':width,'stroke-opacity':opacity,'stroke-linecap':'round','stroke-linejoin':'round','pointer-events':'stroke'}))p.setAttribute(k,v);if(dash)p.setAttribute('stroke-dasharray',dash);g.append(p);
  }
  g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();g.dispatchEvent(new MouseEvent('click',{bubbles:true}))}};
  overlay.append(g);
  if(geom.anchor)anchors.push({...r,fullName:r.name,name:r.shortName||r.name,x:geom.anchor.x,y:geom.anchor.y,sx:geom.anchor.sx,sy:geom.anchor.sy,color,region:true});
 }
 return anchors;
}
