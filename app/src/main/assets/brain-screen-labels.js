export function projectPoint(p,frame,view,width,height){
 const k=Math.min(width/700,height/760),ih=400*frame.height/frame.width;
 const x=(p.x/frame.width-.5)*400*k*view.flipX,y=(p.y/frame.height-.5)*ih*k*view.flipY,a=view.rotation*Math.PI/180;
 return {...p,sx:width/2+(x*Math.cos(a)-y*Math.sin(a))*view.zoom+view.x,sy:height/2+(x*Math.sin(a)+y*Math.cos(a))*view.zoom+view.y};
}
export function visiblePoints(points,frame,view,w,h){return points.filter(p=>p.x>=0&&p.y>=0&&p.x<=frame.width&&p.y<=frame.height).map(p=>projectPoint(p,frame,view,w,h)).filter(p=>p.sx>=8&&p.sx<=w-8&&p.sy>=8&&p.sy<=h-8)}
export function wrapMeasured(text,width,measure){
 const lines=[];let line='';
 for(const word of text.split(/\s+/)){if(line&&measure(line+' '+word)>width){lines.push(line);line=''}for(const ch of word){if(measure(line+ch)>width&&line){lines.push(line);line=''}line+=ch}line+=' '}
 if(line.trim())lines.push(line.trim());return lines.map(s=>s.trim());
}
export function screenLayout(points,w,h,page=0,selected=null,measure=t=>t.length*6.5){
 const labelWidth=Math.min(150,Math.max(76,w*.25)),margin=10,gap=10,unique=new Map();
 for(const p of [...points].sort((a,b)=>Math.hypot(a.sx-w/2,a.sy-h/2)-Math.hypot(b.sx-w/2,b.sy-h/2)))if(!unique.has(p.structure))unique.set(p.structure,p);
 const all=[...unique.values()].sort((a,b)=>a.sx-b.sx),mid=Math.ceil(all.length/2),sides=[all.slice(0,mid),all.slice(mid)],chunks=[];
 for(let side=0;side<2;side++){
  const pages=[[]];let height=0;
  for(const p of sides[side].sort((a,b)=>a.sy-b.sy||a.sx-b.sx)){
   const full=wrapMeasured(p.name||'',labelWidth-8,measure),limit=Math.max(1,Math.floor((h-2*margin-8)/15)),lines=full.slice(0,limit);if(full.length>limit)lines[lines.length-1]=lines.at(-1).slice(0,-1)+'…';const bh=lines.length*15+8;
   if(height+bh+gap>h-2*margin&&pages.at(-1).length){pages.push([]);height=0}
   pages.at(-1).push({...p,lines,bh,side});height+=bh+gap;
  }chunks.push(pages);
 }
 // Keep text clear of visible markers. Split crowded pages instead of stacking names.
 function place(ps,side){
  const sum=ps.reduce((n,p)=>n+p.bh,0),space=ps.length>1?(h-2*margin-sum)/(ps.length-1):0;let top=ps.length===1?(h-sum)/2:margin,previous=margin-gap;const out=[];
  for(const p of ps){
   const width=Math.max(...p.lines.map(measure))+6,left=side?w-11-width:5,right=side?w-5:11+width;
   const obstacles=points.filter(q=>q.sx+6>=left&&q.sx-6<=right);
   const min=previous+gap+p.bh/2,max=h-margin-p.bh/2,preferred=top+p.bh/2;
   const candidates=[preferred,min,max,...obstacles.flatMap(q=>[q.sy-7-p.bh/2,q.sy+7+p.bh/2])].filter(y=>y>=min&&y<=max).sort((a,b)=>Math.abs(a-preferred)-Math.abs(b-preferred));
   const y=candidates.find(y=>!obstacles.some(q=>Math.abs(q.sy-y)<p.bh/2+6));
   if(y===undefined)return null;
   out.push({...p,ly:y});previous=y+p.bh/2;top+=p.bh+space;
  }return out;
 }
 function split(ps,side){const placed=place(ps,side);if(placed)return [placed];if(ps.length<=1)return [ps.map(p=>({...p,ly:h/2,requiresFilter:true}))];const mid=Math.ceil(ps.length/2);return [...split(ps.slice(0,mid),side),...split(ps.slice(mid),side)]}
 const fitted=chunks.map((ps,side)=>ps.flatMap(ps=>split(ps,side)));
 const pages=Math.max(1,...fitted.map(s=>s.length));page=Math.max(0,Math.min(page,pages-1));
 if(selected!==null)for(const ps of fitted)ps.forEach((ps,i)=>{if(ps.some(p=>p.structure===selected))page=i});
 const labels=[...(fitted[0][page]||[]),...(fitted[1][page]||[])];
 return {labels,page,pages,total:all.length,labelWidth};
}
