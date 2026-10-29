import {zoneSeries,resolveSeriesFrame,flowPosition} from './viewer-series-flow.js';
import {setupViewerPage,fitZoom,iconMarkup,applySeriesFit,fitViewer,watchViewerSize} from './viewer-ui.js';
import {SliceGestures} from './brain-gestures.js';
import {AnnotationLayer} from './brain-labels.js';
setupViewerPage();
const $=s=>document.querySelector(s), clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const moduleName=document.body.dataset.module;
let data,annotationData,group=['contrast','vascular'].includes(new URLSearchParams(location.search).get('set'))?new URLSearchParams(location.search).get('set'):'multiplanar',panels=[];
function save(){try{localStorage.setItem(moduleName+'-view-'+(document.body.dataset.viewRevision||'v1'),JSON.stringify({group,ids:panels.map(p=>p.series.id),indices:panels.map(p=>p.index)}))}catch{}}
class Viewer{
 constructor(series,index=0){
  this.series=series;this.index=clamp(index,0,series.frames.length-1);this.zoom=1;this.x=0;this.y=0;this.rotation=0;this.flipX=1;this.flipY=1;this.points=new Map();this.applyDefaultView();
  this.el=document.createElement('section');this.el.className='panel';
  this.el.innerHTML='<div class="panelHead"><span>СЕРИЯ</span><select aria-label="Выбор серии"></select></div><div class="stage"><img alt="Изображение атласа" draggable="false"><span class="status"></span><span class="failed" hidden>Не удалось загрузить кадр</span></div><div class="controls"><div class="paging"><button class="prev" aria-label="Предыдущий кадр">‹</button><input class="slice" type="range" min="0" step="1" aria-label="Номер кадра"><button class="next" aria-label="Следующий кадр">›</button></div><div class="pageCount" aria-live="polite"></div><div class="displayControls"><label>Яркость<input class="bright" type="range" min="50" max="180" value="100"></label><label>Контраст<input class="ct" type="range" min="50" max="200" value="100"></label></div><div class="zoomBar"><button class="minus" aria-label="Уменьшить">−</button><button class="fit">100% · вписать</button><button class="plus" aria-label="Увеличить">+</button></div></div>';
  const q=s=>this.el.querySelector(s);this.img=q('img');this.stage=q('.stage');this.range=q('.slice');this.select=q('select');
  for(const s of data.series.filter(s=>s.group===group)){const o=document.createElement('option');o.value=s.id;o.textContent=s.title;this.select.append(o)}this.select.value=series.id;
  this.select.onchange=()=>{this.series=data.series.find(s=>s.id===this.select.value);this.index=clamp(this.index,0,this.series.frames.length-1);this.reset();this.render();save()};
  q('.prev').onclick=()=>this.move(this.index-1);q('.next').onclick=()=>this.move(this.index+1);this.range.oninput=()=>this.move(+this.range.value);
  q('.bright').oninput=q('.ct').oninput=()=>{this.img.style.filter=`brightness(${q('.bright').value}%) contrast(${q('.ct').value}%)`;this.ann?.transform()};
  q('.minus').onclick=()=>this.scale(this.zoom/1.3);q('.plus').onclick=()=>this.scale(this.zoom*1.3);q('.fit').onclick=()=>this.reset();
  this.img.onerror=()=>{q('.failed').hidden=false};this.img.onload=()=>{q('.failed').hidden=true};
  this.gestures=new SliceGestures(this);this.gestures.bind(this.stage);
  this.stage.onwheel=e=>{e.preventDefault();if(e.ctrlKey)this.scale(this.zoom*(e.deltaY<0?1.1:1/1.1));else this.move(this.index+(e.deltaY>0?1:-1))};
  this.stage.tabIndex=0;this.stage.setAttribute('aria-label','Изображение. Стрелки вверх и вниз листают кадры.');this.stage.onkeydown=e=>{if(['ArrowDown','ArrowUp','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();this.move(this.index+(['ArrowDown','ArrowRight'].includes(e.key)?1:-1))}};
  this.fullButton=document.createElement('button');this.fullButton.className='fullscreenButton';this.fullButton.innerHTML=iconMarkup('fullscreen');this.fullButton.setAttribute('aria-label','На весь экран');q('.panelHead').append(this.fullButton);this.fullButton.onclick=()=>this.setFullscreen(!this.el.classList.contains('fullscreenViewer'));
  this.render();
 }
 setFullscreen(on){
  if(on)for(const p of panels)if(p!==this)p.setFullscreen(false);
  this.el.classList.toggle('fullscreenViewer',on);document.body.classList.toggle('viewerFullscreen',on);this.fullButton.innerHTML=iconMarkup(on?'close':'fullscreen');this.fullButton.setAttribute('aria-label',on?'Выйти из полного экрана':'На весь экран');this.fullButton.setAttribute('aria-pressed',String(on));
  window.AtlasNative?.setImmersive(true);requestAnimationFrame(()=>this.transform());
 }
 toggleZoom(){const base=fitZoom(this);if(this.zoom>base*1.1)this.reset();else this.scale(base*1.65)}
 distance(){const [a,b]=[...this.points.values()];return Math.hypot(a.x-b.x,a.y-b.y)}
 transform(){this.stage.style.touchAction='none';const maxX=this.stage.clientWidth*(this.zoom-1)/2,maxY=this.stage.clientHeight*(this.zoom-1)/2;this.x=clamp(this.x,-maxX,maxX);this.y=clamp(this.y,-maxY,maxY);this.img.style.transform=`translate(${this.x}px,${this.y}px) scale(${this.zoom}) rotate(${this.rotation}deg) scale(${this.flipX},${this.flipY})`;this.el.querySelector('.fit').textContent='↺ '+Math.round(this.zoom/fitZoom(this)*100)+'%';this.el.querySelector('.fit').setAttribute('aria-label','Сбросить масштаб');this.ann?.transform()}
 scale(z){this.zoom=clamp(z,1,5);this.transform()}
 applyDefaultView(){const frontal=moduleName==='wrist-mri'&&this.series.sourceSeries===668;this.rotation=0;this.flipX=1;this.flipY=frontal?-1:1;this.x=this.y=0;if(this.stage)fitViewer(this);else this.zoom=frontal?2.14:1}
 reset(){if(this.gestures)this.gestures.lastTap=0;this.applyDefaultView();this.el.querySelector('.bright').value=this.el.querySelector('.ct').value=100;this.img.style.filter='none';this.transform()}
 applyFrame(target){
  if(target.series!==this.series){const ratio=this.zoom/fitZoom(this);this.series=target.series;this.index=target.index;this.select.value=this.series.id;fitViewer(this);const fitted=this.zoom;this.zoom=clamp(fitted*ratio,1,5);const r=this.zoom/fitted;this.x*=r;this.y*=r;if(this.ann){this.ann.selected=null;this.ann.labelPage=0}}
  else this.index=target.index;
 }
 neighborFrame(delta){const t=resolveSeriesFrame(data,moduleName,this.series,this.index+delta);return t.series.frames[t.index]}
 move(i,sync=true){
  this.applyFrame(resolveSeriesFrame(data,moduleName,this.series,i));this.render();
  if(sync&&$('#link').checked)for(const p of panels)if(p!==this){if(zoneSeries(data,moduleName,this.series).includes(p.series)){p.applyFrame({series:this.series,index:this.index});p.render()}else if(p.series.sourceSeries===this.series.sourceSeries)p.move(this.index,false)}save()
 }
 render(){const n=this.series.frames.length;if(!this.ann)this.img.src=this.series.frames[this.index].src;this.img.alt=`${this.series.title}, кадр ${this.index+1} из ${n}`;this.range.max=n-1;this.range.value=this.index;this.el.querySelector('.status').textContent=this.series.plane;this.el.querySelector('.pageCount').textContent=`${group==='vascular'?'Ракурс':'Кадр'} ${this.index+1} / ${n}`;const position=flowPosition(data,moduleName,this.series,this.index);this.el.querySelector('.prev').disabled=position?position.index===0:this.index===0;this.el.querySelector('.next').disabled=position?position.index===position.total-1:this.index===n-1;this.el.querySelector('.pageCount').title=position?'Сквозной кадр '+(position.index+1)+' из '+position.total:'';this.el.dataset.flowIndex=position?position.index:'';this.ann?.render();this.transform();if(moduleName==='perianal-mri')window.dispatchEvent(new CustomEvent('perianal-view-change'));}
}
function build(restore){
 const ss=data.series.filter(s=>s.group===group),count=$('#compare').checked?2:1;for(const p of panels){p.sizeObserver?.disconnect();p.setFullscreen(false)}panels=[];$('#viewers').replaceChildren();$('#viewers').classList.toggle('compare',count===2);
 for(let i=0;i<count;i++){const series=ss.find(s=>s.id===restore?.ids?.[i])||(i===0&&ss.find(s=>s.id===document.body.dataset.defaultSeries))||ss[i]||ss[0];const p=new Viewer(series,restore?.indices?.[i]??(group==='vascular'?0:(series.id===document.body.dataset.defaultSeries?+(document.body.dataset.defaultIndex||0):Math.floor(series.frames.length/2))));panels.push(p);$('#viewers').append(p.el);p.ann=new AnnotationLayer(p,annotationData);p.reset();watchViewerSize(p)}
 $('#vascular').setAttribute('aria-pressed',group==='vascular');$('#multi').setAttribute('aria-pressed',group==='multiplanar');$('#contrast').setAttribute('aria-pressed',group==='contrast');$('#linkLabel').hidden=count!==2;
 $('#multi').hidden=!data.series.some(s=>s.group==='multiplanar');$('#vascular').hidden=!data.series.some(s=>s.group==='vascular');$('#contrast').hidden=true;$('#summary').textContent=ss.reduce((n,s)=>n+s.frames.length,0)+(group==='vascular'?' готовый 3D-ракурс · исходные покадровые метки':(data.modality==='CT'?' КТ-кадров · исходные покадровые метки':' МРТ-кадров · исходные покадровые метки'));save();
}
$('#vascular').onclick=()=>{group='vascular';build()};$('#multi').onclick=()=>{group='multiplanar';build()};$('#contrast').onclick=()=>{group='contrast';build()};
$('#compare').onchange=()=>build({ids:panels.map(p=>p.series.id),indices:panels.map(p=>p.index)});
$('#link').onchange=()=>{if($('#link').checked&&panels[0])panels[0].move(panels[0].index)};$('#reset').onclick=()=>panels.forEach(p=>p.reset());
try{const res=await fetch(moduleName+'-data.json');if(!res.ok)throw Error('manifest');data=await res.json();await applySeriesFit(data,moduleName);const labels=await fetch(moduleName+'-labels.json');if(!labels.ok)throw Error('labels');annotationData=await labels.json();if(moduleName==='abdomen-ct')(await import('./abdomen-anatomy.js')).addAbdomenAnatomy(annotationData);if(moduleName==='female-pelvis-mri')await (await import('./female-pelvis-anatomy.js')).addFemalePelvisAnatomy(annotationData);if(moduleName==='hand-mri')await (await import('./hand-anatomy.js')).addHandAnatomy(annotationData);if(['shoulder-mri','knee-mri','foot-mri','wrist-mri','elbow-mri','hip-mri'].includes(moduleName))await (await import('./joint-anatomy.js')).addJointAnatomy(moduleName,annotationData);if(moduleName==='knee-mri')await (await import('./knee-tendons263.js')).addKneeTendons(annotationData);annotationData.seriesIndex=data.series;if(['hand-mri','wrist-mri','elbow-mri','knee-mri','hip-mri'].includes(moduleName))await (await import('./joint-lines.js')).addJointLines(moduleName,annotationData);if(moduleName==='wrist-mri'){await (await import('./wrist-capitate.js')).addWristCapitate(annotationData);await (await import('./wrist-ligaments.js')).addWristLigaments(annotationData);await (await import('./wrist-review.js')).addWristReview(annotationData);}annotationData.useSourceDefaults=true;annotationData.storageKey||=moduleName+'-anatomy-v1';if(moduleName==='female-pelvis-mri')for(const f of Object.values(annotationData.filters).flat())f.icon='female-pelvis-mri-icons/group-'+f.id+'.png';if(!data.series.some(s=>s.group===group))group=data.series[0].group;let saved;try{saved=JSON.parse(localStorage.getItem(moduleName+'-view-'+(document.body.dataset.viewRevision||'v1')));if(saved?.group!==group)saved=null}catch{}const requested=new URLSearchParams(location.search).get('series');if(data.series.some(s=>s.id===requested&&s.group===group))saved={ids:[requested],indices:[0]};build(saved);if(moduleName==='perianal-mri'){const{setupTrainingUI}=await import('./perianal-training.js');setupTrainingUI({getPanels:()=>panels,navigate:target=>{const p=panels[0];if(!p)return;if(p.series.id!==target.series){p.select.value=target.series;p.select.onchange()}const i=p.series.frames.findIndex(f=>f.annotation===target.annotation);if(i>=0){p.move(i);p.reset()}}})}}catch(e){$('#summary').textContent='Не удалось открыть набор изображений.';$('#error').hidden=false;$('#error').textContent='Вернись в меню и открой раздел повторно.';console.error(e)}

window.addEventListener('resize',()=>panels.forEach(p=>p.ann?.render()));

window.exitAtlasFullscreen=()=>{const p=panels.find(p=>p.el.classList.contains('fullscreenViewer'));if(!p)return false;p.setFullscreen(false);return true};
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.querySelector('dialog[open]'))window.exitAtlasFullscreen()});
