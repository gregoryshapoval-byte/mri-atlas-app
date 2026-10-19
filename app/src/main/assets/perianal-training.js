import {projectPoint} from './brain-screen-labels.js';
import {trainingCases,trainingState,currentTrainingCase,targetForFrame} from './perianal-training-models.js';
const NS='http://www.w3.org/2000/svg';
const el=(name,attrs={})=>{const e=document.createElementNS(NS,name);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,v);return e};
export function trainingPoint([x,y],frame,view,w,h){return projectPoint({x:x-(frame.crop?.[0]||0),y:y-(frame.crop?.[1]||0)},frame,view,w,h)}
export function drawTraining(layer,series,frame,w,h){
 if(!layer.data.perianalOrientation)return;
 const v=layer.v,model=currentTrainingCase(),target=targetForFrame(series,frame);
 if(!v.trainingBanner){v.trainingBanner=document.createElement('div');v.trainingBanner.className='trainingWatermark';v.trainingBanner.setAttribute('role','status');v.stage.append(v.trainingBanner)}
 v.trainingBanner.hidden=!model||!layer.on;
 v.el.dataset.trainingCase=model?.key||'';v.el.dataset.trainingTarget=target?.annotation||'';
 if(!model||!layer.on)return;
 v.trainingBanner.textContent=target?'УЧЕБНАЯ СХЕМА НА МРТ НОРМЫ · ≈ '+model.label:'УЧЕБНЫЙ РЕЖИМ · на этом срезе ход не размечен';
 if(!target)return;
 const g=el('g',{class:'trainingOverlay','pointer-events':'none','data-case':model.key,'data-annotation':target.annotation,'aria-label':'Приблизительный учебный ход, не выявленная патология'}),project=p=>trainingPoint(p,frame,v,w,h),path=points=>points.map((p,i)=>{const q=project(p);return(i?'L':'M')+q.sx+' '+q.sy}).join(' ');
 // Reuse only the existing approximate sphincter outlines on this explicit frame.
 const regions=layer.data.seriesSlices?.[series.id]?.[frame.annotation]?.regions||[];
 for(const r of regions.filter(r=>['internalSphincter','externalSphincter'].includes(r.category))){const points=r.vertices.map(([x,y])=>[x+(frame.crop?.[0]||0),y+(frame.crop?.[1]||0)]);g.append(el('path',{class:'trainingContext',d:path(points)+' Z',fill:'none',stroke:r.category==='internalSphincter'?'#49E0CF':'#F28BCB','stroke-width':1.5,'stroke-dasharray':'4 3',opacity:.8}))}
 const d=path(target.tract);g.append(el('path',{d,fill:'none',stroke:'#080808','stroke-width':7,opacity:.7,'stroke-linecap':'round','stroke-linejoin':'round'}),el('path',{class:'trainingPrimary',d,fill:'none',stroke:'#FF6B6B','stroke-width':3.5,'stroke-linecap':'round','stroke-linejoin':'round'}));
 if(target.branch)g.append(el('path',{class:'trainingSecondary',d:path(target.branch),fill:'none',stroke:'#FF9B92','stroke-width':3,'stroke-dasharray':'4 3','stroke-linecap':'round'}));
 if(target.abscess){const a=target.abscess,points=Array.from({length:40},(_,i)=>[a.cx+a.rx*Math.cos(i*Math.PI/20),a.cy+a.ry*Math.sin(i*Math.PI/20)]);g.append(el('path',{class:'trainingAbscess','data-compartment':a.compartment,d:path(points)+' Z',fill:'#FFB35C','fill-opacity':.38,stroke:'#FFB35C','stroke-width':2}))}
 const start=project(target.tract[0]),end=project(target.tract.at(-1)),prev=project(target.tract.at(-2)),angle=Math.atan2(end.sy-prev.sy,end.sx-prev.sx),arrow=[end,...[-.5,.5].map(a=>({sx:end.sx-9*Math.cos(angle+a),sy:end.sy-9*Math.sin(angle+a)}))];
 g.append(el('circle',{cx:start.sx,cy:start.sy,r:4,fill:'#152124',stroke:'#FF6B6B','stroke-width':2}),el('polygon',{class:'trainingDirection',points:arrow.map(p=>p.sx+','+p.sy).join(' '),fill:'#FF6B6B'}));layer.overlay.append(g);
}
export function setupTrainingUI({getPanels,navigate}){
 const bar=document.createElement('div');bar.className='trainingBar';bar.innerHTML='<label>Учебный ход<select class="trainingSelect" aria-label="Выбор учебного свища"><option value="">Выкл · МРТ нормы</option></select></label><button class="trainingPrevious" aria-label="Предыдущий учебный срез">‹</button><button class="trainingNext" aria-label="Следующий учебный срез">›</button><button class="trainingReturn" title="Перейти к размеченному срезу">К модели</button><button class="trainingClear" aria-label="Выключить учебный ход">✕</button>';
 const select=bar.querySelector('select');for(const system of['Parks','St James']){const group=document.createElement('optgroup');group.label=system;for(const c of trainingCases.filter(c=>c.label.startsWith(system))){const o=document.createElement('option');o.value=c.key;o.textContent=c.label;group.append(o)}select.append(group)}
 const note=document.createElement('p');note.className='trainingNote';note.setAttribute('aria-live','polite');document.querySelector('#viewers').before(bar,note);
 const update=()=>{const model=currentTrainingCase(),p=getPanels()[0],target=p&&targetForFrame(p.series,p.series.frames[p.index]);select.value=model?.key||'';for(const b of bar.querySelectorAll('button'))b.disabled=!model;note.hidden=!model;note.textContent=model?(target?.note||'На этом срезе модель не размечена. Нажмите «К модели».')+' Отдельные условные проекции, не 3D-реконструкция. Стрелка — продолжение хода, не доказанное кожное отверстие.':'';for(const p of getPanels())p.ann?.drawOverlay()};
 const selectCase=key=>{trainingState.key=trainingCases.some(c=>c.key===key)?key:'';const model=currentTrainingCase();if(model){const p=getPanels()[0];if(p?.ann){p.ann.on=true;for(const f of[15801,15802,15803])p.ann.active().add(f);p.ann.syncSwitches()}navigate(model.targets[0]);getPanels()[0]?.ann?.render()}update()};
 select.onchange=()=>selectCase(select.value);
 const step=delta=>{const model=currentTrainingCase(),p=getPanels()[0];if(!model||!p)return;const i=model.targets.findIndex(t=>t.series===p.series.id&&t.annotation===p.series.frames[p.index].annotation);navigate(model.targets[i<0?0:(i+delta+model.targets.length)%model.targets.length]);update()};
 bar.querySelector('.trainingPrevious').onclick=()=>step(-1);bar.querySelector('.trainingNext').onclick=()=>step(1);bar.querySelector('.trainingReturn').onclick=()=>{const m=currentTrainingCase();if(m)navigate(m.targets[0]);update()};bar.querySelector('.trainingClear').onclick=()=>selectCase('');
 window.addEventListener('perianal-training-select',e=>{document.querySelector('#perianalGuide')?.close();selectCase(e.detail.key)});window.addEventListener('perianal-view-change',update);update();
}
