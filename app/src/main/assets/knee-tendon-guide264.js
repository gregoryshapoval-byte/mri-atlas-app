import {tendonSources} from './knee-tendons264-data.js';
const make=(tag,text)=>{const el=document.createElement(tag);if(text)el.textContent=text;return el;};
const norm=s=>s.toLowerCase().replaceAll('ё','е');

export function tendonTargets(layer,entry){
 const targets=[];
 for(const s of layer.data.seriesIndex){
  const hits=[];
  for(let index=0;index<s.frames.length;index++){
   const a=layer.slice(s.frames[index],s);
   for(const id of entry.structures){const p=a.points.find(p=>p.structure===id);if(p)hits.push({s,index,p,rank:entry.structures.indexOf(id)});}
  }
  if(hits.length){const rank=Math.min(...hits.map(h=>h.rank)),best=hits.filter(h=>h.rank===rank);targets.push(best[Math.floor(best.length/2)]);}
 }
 return targets;
}

export function renderKneeTendonGuide(layer,box){
 const entries=layer.data.kneeTendonAtlas;if(!entries)return;
 const section=make('details');section.className='kneeTendonGuide264';
 section.append(make('summary','Сухожилия колена · полный разбор · '+entries.length+' структур'));
 section.append(make('p','Начало → ход → прикрепление. Кнопки открывают реальные кадры набора. ≈ обозначает ориентировочную область; невидимые пучки и прикрепления за пределами снимков указаны в тексте.'));
 const search=make('input');search.type='search';search.placeholder='Найти сухожилие, мышцу или прикрепление';search.setAttribute('aria-label','Поиск в полном разборе сухожилий');section.append(search);
 const count=make('p'),list=make('div');count.setAttribute('aria-live','polite');section.append(count,list);
 const rows=[];
 for(const entry of entries){
  const row=make('details');row.dataset.tendon264=entry.id;row.append(make('summary',entry.title));
  row.append(make('p',entry.group));
  const dl=make('dl');
  for(const [key,title]of [['origin','Начало'],['course','Ход'],['insertion','Прикрепление'],['pitfall','Не перепутать'],['coverage','Что видно в наборе']]){dl.append(make('dt',title),make('dd',entry[key]));}
  row.append(dl);
  const targets=tendonTargets(layer,entry),buttons=make('div');buttons.className='tendon264Targets';
  for(const target of targets){
   const button=make('button',target.s.title+' · кадр '+(target.index+1));button.type='button';button.dataset.structure=target.p.structure;button.dataset.series=target.s.id;
   button.onclick=()=>{
    layer.v.select.value=target.s.id;layer.v.select.onchange();
    layer.active().add(target.p.filter);layer.hiddenStructures.delete(target.p.structure);
    layer.on=layer.names=layer.markers=true;layer.selected=target.p.structure;
    layer.v.move(target.index);layer.v.reset();layer.syncSwitches();layer.render();layer.controls.close();
   };buttons.append(button);
  }
  if(targets.length)row.append(buttons);else row.append(make('p','В этом поле съёмки отдельная метка не подтверждена.'));
  const refs=make('p');refs.className='tendon264Sources';refs.append(document.createTextNode('Источники: '));
  for(const [i,key]of entry.refs.entries()){const source=tendonSources[key],a=make('a',source.title);a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';if(i)refs.append(document.createTextNode(' · '));refs.append(a);}row.append(refs);
  list.append(row);rows.push({row,text:norm([entry.title,entry.origin,entry.course,entry.insertion,entry.id].join(' '))});
 }
 search.oninput=()=>{const words=norm(search.value).trim().split(/\s+/).filter(Boolean);let visible=0;for(const r of rows){r.row.hidden=!words.every(w=>r.text.includes(w));if(!r.row.hidden)visible++;}count.textContent=visible+' из '+entries.length;};search.oninput();box.append(section);
 const requested=new URLSearchParams(location.search).get('tendon264');
 if(requested){const row=rows.find(r=>r.row.dataset.tendon264===requested)?.row;section.open=true;if(row)row.open=true;}
}

export function openKneeTendonGuide(viewer){
 const requested=new URLSearchParams(location.search).get('tendon264');
 if(!requested||!viewer?.ann)return;
 viewer.ann.menuButton.click();
 const section=viewer.ann.controls.querySelector('.kneeTendonGuide264');if(!section)return;
 section.open=true;
 const row=[...section.querySelectorAll('[data-tendon264]')].find(r=>r.dataset.tendon264===requested);
 if(row)row.open=true;
 requestAnimationFrame(()=>{(row||section).scrollIntoView({block:'start'});});
}
