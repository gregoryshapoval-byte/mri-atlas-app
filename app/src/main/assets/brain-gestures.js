export class SliceGestures{
 constructor(v){this.v=v;this.points=new Map();this.mode='slices';this.step=18;this.multi=false;this.travel=0;this.remainder=0;this.suppressClickUntil=0;this.lastTap=0;}
 geometry(){const [a,b]=[...this.points.values()];return {x:(a.x+b.x)/2,y:(a.y+b.y)/2,d:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y))}}
 down(id,x,y){if(!this.points.size){this.travel=0;this.remainder=0;this.multi=false}this.points.set(id,{x,y});if(this.points.size>=2){this.multi=true;this.lastTap=0;this.remainder=0}}
 move(id,x,y){const old=this.points.get(id);if(!old)return;const before=this.points.size===2?this.geometry():null;this.points.set(id,{x,y});this.travel+=Math.hypot(x-old.x,y-old.y);const v=this.v;
  if(this.points.size===2){const after=this.geometry(),r=v.stage.getBoundingClientRect(),ox=before.x-r.left-r.width/2,oy=before.y-r.top-r.height/2,nx=after.x-r.left-r.width/2,ny=after.y-r.top-r.height/2;const zoom=Math.max(1,Math.min(5,v.zoom*after.d/before.d)),ratio=zoom/v.zoom;v.x=nx-(ox-v.x)*ratio;v.y=ny-(oy-v.y)*ratio;v.zoom=zoom;v.transform();this.suppressClickUntil=Date.now()+500;return}
  if(this.multi||this.points.size!==1)return;
  if(this.mode==='pan'){v.x+=x-old.x;v.y+=y-old.y;v.transform()}else{this.remainder+=y-old.y;const n=Math.trunc(this.remainder/this.step);if(n){v.move(v.index+n);this.remainder-=n*this.step}}
  if(this.travel>10)this.suppressClickUntil=Date.now()+500;
 }
 up(id,cancel=false){if(!this.points.has(id))return;this.points.delete(id);if(this.multi||cancel||this.travel>10){this.suppressClickUntil=Date.now()+500;this.lastTap=0}else if(!this.points.size){const now=Date.now();if(now-this.lastTap<300){this.v.toggleZoom?this.v.toggleZoom():this.v.reset();this.lastTap=0;this.suppressClickUntil=now+300}else this.lastTap=now}if(!this.points.size){this.multi=false;this.remainder=0;if(this.v.ann?.regionOnly)this.v.ann.render()}}
 bind(stage){stage.style.touchAction='none';stage.onpointerdown=e=>{e.preventDefault();stage.setPointerCapture(e.pointerId);this.down(e.pointerId,e.clientX,e.clientY)};stage.onpointermove=e=>{e.preventDefault();this.move(e.pointerId,e.clientX,e.clientY)};stage.onpointerup=e=>{const tap=!this.multi&&this.travel<=10;this.up(e.pointerId);if(tap&&Date.now()>=this.suppressClickUntil){const hit=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-structure]');if(hit&&stage.contains(hit)){this.v.ann.selected=+hit.dataset.structure;this.v.ann.render()}}};stage.onpointercancel=e=>this.up(e.pointerId,true);stage.onlostpointercapture=e=>this.up(e.pointerId,true)}
}
