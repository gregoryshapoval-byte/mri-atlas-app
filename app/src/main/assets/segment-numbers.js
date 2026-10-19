// Offset only the screen badge when source anchors are too close; keep a leader
// and the original source point, so the badge never implies a changed location.
export function numberPlacements(points,width,height){
 const placed=[],result=new Map();
 for(const p of points){
  let choice;
  for(const [dx,dy]of [[0,0],[0,-26],[0,26],[-40,0],[40,0],[-40,-26],[40,-26],[-40,26],[40,26],[0,-52],[0,52]]){
   const x=Math.max(19,Math.min(width-19,p.sx+dx)),y=Math.max(12,Math.min(height-12,p.sy+dy));
   if(!placed.some(q=>Math.abs(q.x-x)<40&&Math.abs(q.y-y)<25)){choice={x,y};break}
  }
  choice||={x:p.sx,y:p.sy};placed.push(choice);result.set(p.structure,choice);
 }
 return result;
}
