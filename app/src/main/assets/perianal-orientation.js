import {projectPoint} from './brain-screen-labels.js';
const NS='http://www.w3.org/2000/svg';
// Angles use the surgical clock convention in a conventional radiological axial image.
// 3h is patient left, at screen right before user transforms.
export function orientationItems(config,frame,view,w,h){
 const project=(x,y,text,kind)=>({...projectPoint({x,y},frame,view,w,h),text,kind});
 const items=[];
 if(config.plane==='axial'&&config.clock?.[frame.annotation]){
  const{x,y,r}=config.clock[frame.annotation];
  for(let n=1;n<=12;n++){const a=n*Math.PI/6;items.push(project(x+r*Math.sin(a),y-r*Math.cos(a),String(n),'clock'))}
 }
 const gap=config.plane==='sagittal'?32:18;
 if(config.plane==='axial'||config.plane==='coronal'){
  items.push(project(gap,frame.height/2,'П','side'),project(frame.width-gap,frame.height/2,'Л','side'));
 }else if(config.plane==='sagittal'){
  items.push(project(gap,frame.height/2,'перед','side'),project(frame.width-gap,frame.height/2,'зад','side'));
 }
 return items.filter(p=>p.sx>=Math.max(12,p.text.length*4)&&p.sx<=w-Math.max(12,p.text.length*4)&&p.sy>=14&&p.sy<=h-14);
}
export function drawPerianalOrientation(overlay,data,series,frame,view,w,h){
 if(!data.perianalOrientation||view.orientation===false)return;
 const config=data.perianalOrientation[series.id];if(!config)return;
 const g=document.createElementNS(NS,'g');g.classList.add('perianalOrientation');g.setAttribute('pointer-events','none');g.setAttribute('aria-label','Условный циферблат; стороны пациента');
 for(const p of orientationItems(config,frame,view,w,h)){
  const t=document.createElementNS(NS,'text');t.textContent=p.text;t.dataset.orientation=p.kind;
  for(const[k,v]of Object.entries({x:p.sx,y:p.sy,'text-anchor':'middle','dominant-baseline':'middle','font-family':'sans-serif','font-size':p.kind==='clock'?13:12,'font-weight':'600',fill:'#FFFFFF','fill-opacity':p.kind==='clock'?.48:.65,stroke:'#001219','stroke-opacity':.5,'stroke-width':2,'paint-order':'stroke'}))t.setAttribute(k,v);
  g.append(t);
 }
 overlay.append(g);
}
