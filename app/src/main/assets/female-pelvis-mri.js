const $=s=>document.querySelector(s),NS='http://www.w3.org/2000/svg';
const [D,L]=await Promise.all(['female-pelvis-mri-data.json','female-pelvis-mri-labels.json'].map(async u=>{let r=await fetch(u);if(!r.ok)throw Error('Не найдены данные: '+u);return r.json()}));
const fs=L.filters.pelvis||[],enabled=new Set(fs.filter(f=>f.default).map(f=>f.id));let series=D.series[0],index=0,zoom=1,dx=0,dy=0,show=true,selected=null;
const area=$('#imaging'),world=$('#world'),img=$('#sliceImage'),marks=$('#markers'),labels=$('#labels');
const make=(tag,attrs={})=>{let e=document.createElementNS(NS,tag);for(let [k,v]of Object.entries(attrs))e.setAttribute(k,String(v));return e};
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
D.series.forEach(s=>{let o=new Option(s.title+' · '+s.id.split('-').at(-1)+' · '+s.frames.length,s.id);$('#series').add(o)});
const cachedPoints=()=>L.slices[series.frames[index].annotation]?.points||[];
function fit(){zoom=1;dx=dy=0;world.style.transform='';paint()}
function render(){let frame=series.frames[index];img.src=frame.src;$('#frames').max=series.frames.length-1;$('#frames').value=index;$('#counter').textContent=(index+1)+' / '+series.frames.length;$('#prev').disabled=index===0;$('#next').disabled=index===series.frames.length-1;selected=null;img.onload=paint;paint()}
function project(x,y){let f=series.frames[index],W=area.clientWidth,H=area.clientHeight,scale=Math.min(W/f.width,H/f.height),ox=(W-f.width*scale)/2,oy=(H-f.height*scale)/2;return [ox+x*scale,oy+y*scale]}
function transform(){world.style.transform='translate('+dx+'px,'+dy+'px) scale('+zoom+')';paint()}
function paint(){let W=area.clientWidth,H=area.clientHeight;for(let svg of [marks,labels]){svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.replaceChildren()}
let pts=cachedPoints().filter(p=>enabled.has(p.filter));let hit=pts.find(p=>p.id===selected);$('#selection').textContent=hit?hit.name:'На срезе структур: '+pts.length;
let visible=show?pts:[];let take=visible.filter(p=>!hit||p.id===hit.id);const max=25;take=take.slice(0,max);
for(let i=0;i<take.length;i++){let p=take[i],[px,py]=project(p.x,p.y),x=px*zoom+dx+(W*(1-zoom)/2),y=py*zoom+dy+(H*(1-zoom)/2);
if(x<0||y<0||x>W||y>H)continue;
let c=make('circle',{cx:px,cy:py,r:Math.max(3,5/zoom),fill:p.color||'#77dcc1','data-id':p.id});c.onclick=()=>{selected=p.id;paint()};marks.append(c);
let left=i%2===0,tx=left?7:W-7,ty=18+(Math.floor(i/2)*Math.max(22,Math.min(34,(H-30)/Math.ceil(take.length/2))));let line=make('line',{x1:x,y1:y,x2:left?135:W-135,y2:ty,stroke:p.color||'#7cd4b8'});labels.append(line);
let txt=make('text',{x:tx,y:ty,'text-anchor':left?'start':'end'});txt.textContent=p.name.length>23?p.name.slice(0,22)+'…':p.name;labels.append(txt);
}
}
function move(n){index=clamp(n,0,series.frames.length-1);render()}
$('#series').onchange=e=>{series=D.series.find(x=>x.id===e.target.value);index=Math.floor(series.frames.length/2);fit();render()};
$('#frames').oninput=e=>move(+e.target.value);$('#prev').onclick=()=>move(index-1);$('#next').onclick=()=>move(index+1);
$('#plus').onclick=()=>{zoom=clamp(zoom*1.25,1,5);transform()};$('#minus').onclick=()=>{zoom=clamp(zoom/1.25,1,5);transform()};$('#reset').onclick=fit;
$('#hideLabels').onclick=()=>{show=!show;$('#hideLabels').textContent=show?'Скрыть подписи':'Показать подписи';paint()};
$('#fullscreen').onclick=()=>{area.classList.toggle('large');area.style.height=area.classList.contains('large')?'90dvh':'68dvh';paint()};
const list=$('#filterList');function controls(q=''){list.replaceChildren();for(let f of fs){if(q&&!f.name.toLowerCase().includes(q.toLowerCase())&&!cachedPoints().some(p=>p.filter===f.id&&p.name.toLowerCase().includes(q.toLowerCase())))continue;let l=document.createElement('label'),c=document.createElement('input');c.type='checkbox';c.checked=enabled.has(f.id);c.onchange=()=>{if(c.checked)enabled.add(f.id);else enabled.delete(f.id);paint()};l.append(c,document.createTextNode(f.name));list.append(l)}}
$('#anatomy').onclick=()=>{controls();$('#side').showModal()};$('#close').onclick=()=>$('#side').close();
$('#search').oninput=e=>controls(e.target.value);$('#all').onclick=()=>{fs.forEach(f=>enabled.add(f.id));controls($('#search').value);paint()};$('#none').onclick=()=>{enabled.clear();controls($('#search').value);paint()};
let touches=new Map(),firstY=0;area.addEventListener('pointerdown',e=>{touches.set(e.pointerId,{x:e.clientX,y:e.clientY});if(touches.size===1)firstY=e.clientY;area.setPointerCapture(e.pointerId)});
area.addEventListener('pointermove',e=>{if(!touches.has(e.pointerId))return;let prev=touches.get(e.pointerId);touches.set(e.pointerId,{x:e.clientX,y:e.clientY});if(touches.size>=2){let a=[...touches.values()],before=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),prior=[...touches.entries()].map(([id,v])=>id===e.pointerId?prev:v);let old=Math.hypot(prior[0].x-prior[1].x,prior[0].y-prior[1].y);if(old>5)zoom=clamp(zoom*before/old,1,5);dx+=e.clientX-prev.x;dy+=e.clientY-prev.y;transform()}});
area.addEventListener('pointerup',e=>{if(touches.size===1&&zoom<=1&&Math.abs(e.clientY-firstY)>38)move(index+(e.clientY>firstY?1:-1));touches.delete(e.pointerId)});
area.addEventListener('pointercancel',e=>touches.delete(e.pointerId));area.addEventListener('wheel',e=>{e.preventDefault();move(index+(e.deltaY>0?1:-1))},{passive:false});window.addEventListener('resize',paint);move(12);
