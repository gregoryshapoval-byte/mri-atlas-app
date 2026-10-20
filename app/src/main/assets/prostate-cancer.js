'use strict';
const data=globalThis.ProstateAtlasData,figures=globalThis.ProstateAtlasFigures;
const el=id=>document.getElementById(id);
const tabs=[...document.querySelectorAll('[data-tab]')];
function activate(b,focus=false){for(const tab of tabs){const yes=tab===b;tab.setAttribute('aria-selected',String(yes));tab.tabIndex=yes?0:-1;el(tab.dataset.tab).hidden=!yes;}if(focus)b.focus();}
for(const b of tabs){b.addEventListener('click',()=>activate(b));b.addEventListener('keydown',e=>{const i=tabs.indexOf(b);let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();activate(tabs[n],true);});}
function rows(host,values){host.replaceChildren();for(const row of values){const tr=document.createElement('tr');for(const text of row){const td=document.createElement('td');td.textContent=text;tr.append(td);}host.append(tr);}}
let scoreZone='PZ';
function score(zone){scoreZone=zone;for(const b of document.querySelectorAll('[data-score-zone]'))b.setAttribute('aria-pressed',String(b.dataset.scoreZone===zone));
el('dominant').textContent=zone==='PZ'?'PZ · ведущая серия DWI / ADC':'TZ · ведущая серия T2';
el('scoreHeading').textContent=zone==='PZ'?'Периферическая зона':'Переходная зона';
el('scoreRule').textContent=zone==='PZ'?'Сначала определите DWI-балл; DCE меняет итог только при DWI 3.':'Сначала оцените морфологию на T2; затем проверьте повышение по DWI.';
el('seriesLabel').textContent=zone==='PZ'?'DWI / ADC · требования к очагу':'T2 · требования к очагу';
rows(el('scoreRows'),zone==='PZ'?data.dwi:data.t2);
el('scoreFigure').innerHTML=zone==='PZ'?figures.signals:figures.tz;
el('upgradeRule').textContent=zone==='PZ'?'PZ: DWI 3 + DCE+ → итог 4. DWI 1, 2, 4, 5 дают ту же итоговую категорию.':'TZ: T2 2 + DWI 4–5 → итог 3; T2 3 + DWI 5 → итог 4. DCE категорию не меняет.';
}
for(const b of document.querySelectorAll('[data-score-zone]'))b.addEventListener('click',()=>{score(b.dataset.scoreZone);el('calcZone').value=b.dataset.scoreZone;calculate();});
score('PZ');
const sectorData=globalThis.ProstateSectors186;
let level='mid',selectedSector='RM-PZpl',zoomMode='score';
function sectorSelection(id){
 const item=sectorData.sectors.find(s=>s.id===id);if(!item)return;
 if(item.level!==level)renderSectorLevel(item.level,false);
 selectedSector=id;el('sectorCode').textContent=item.id;el('sectorName').textContent=item.name;el('sectorTip').textContent=item.tip;el('sectorLevel').textContent=sectorData.levels[item.level]+(item.side?' · '+(item.side==='R'?'справа':'слева'):'');el('sectorLocation').value=item.location;el('zoomSectorName').textContent=item.location;el('sectorCopyStatus').textContent='';
 for(const host of [el('zoneFigure'),el('zoomFigure')])for(const part of host.querySelectorAll('[data-sector]')){const active=part.dataset.sector===id;part.classList.toggle('active',active);part.setAttribute('aria-pressed',String(active));}
 for(const b of el('allSectors').querySelectorAll('[data-sector]'))b.setAttribute('aria-pressed',String(b.dataset.sector===id));
}
function bindSectorMap(host){for(const part of host.querySelectorAll('[data-sector]')){const item=sectorData.sectors.find(s=>s.id===part.dataset.sector);part.setAttribute('aria-label',item.location);part.addEventListener('click',()=>sectorSelection(part.dataset.sector));part.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();sectorSelection(part.dataset.sector);}});}}
function renderSectorLevel(id,select=true){level=id;el('zoneFigure').innerHTML=sectorData.figures[id];bindSectorMap(el('zoneFigure'));for(const b of document.querySelectorAll('[data-level]'))b.setAttribute('aria-pressed',String(b.dataset.level===id));if(select){const code=selectedSector.split('-').slice(1).join('-');const old=sectorData.sectors.find(s=>s.id===selectedSector);const next=sectorData.sectors.find(s=>s.level===id&&s.code===code&&s.side===old?.side)||sectorData.sectors.find(s=>s.level===id);sectorSelection(next.id);}}
for(const [id,name]of Object.entries(sectorData.levels)){const h=document.createElement('h3');h.textContent=name;const grid=document.createElement('div');grid.className='sectorList';for(const s of sectorData.sectors.filter(s=>s.level===id)){const b=document.createElement('button');b.type='button';b.dataset.sector=s.id;b.textContent=s.id;b.setAttribute('aria-label',s.location);b.addEventListener('click',()=>sectorSelection(s.id));grid.append(b);}el('allSectors').append(h,grid);}
for(const b of document.querySelectorAll('[data-level]'))b.addEventListener('click',()=>renderSectorLevel(b.dataset.level));renderSectorLevel('mid',false);sectorSelection(selectedSector);rows(el('sectorLegend'),sectorData.legend.map(s=>[s.code,s.name]));
el('copySector').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(el('sectorLocation').value);el('sectorCopyStatus').textContent='Локализация скопирована.';}catch{el('sectorLocation').focus();el('sectorLocation').select();el('sectorCopyStatus').textContent='Текст выделен для ручного копирования.';}});
el('enlargeMap').addEventListener('click',()=>{zoomMode='map';el('zoomSectorName').hidden=false;el('zoomFigure').innerHTML=sectorData.figures[level].replaceAll('s186','zoom186');bindSectorMap(el('zoomFigure'));sectorSelection(selectedSector);el('zoom').showModal();});
rows(el('scanRows'),data.scan);
function calculate(){const r=ProstateRules.assess({zone:el('calcZone').value,t2:Number(el('calcT2').value),dwi:Number(el('calcDwi').value),dce:el('calcDce').value,adequate:el('adequate').checked});el('calcResult').textContent=r.score===null?'Оценка ограничена':'PI-RADS '+r.score;el('calcReason').textContent=r.reason;}
for(const id of ['calcZone','calcT2','calcDwi','calcDce','adequate'])el(id).addEventListener('change',calculate);calculate();
const zoom=el('zoom');el('scoreFigure').addEventListener('click',()=>{zoomMode='score';el('zoomSectorName').hidden=true;el('zoomFigure').innerHTML=scoreZone==='PZ'?figures.signals:figures.tz;zoom.showModal();});zoom.querySelector('.close').addEventListener('click',()=>zoom.close());
for(const [title,body]of data.reports){const card=document.createElement('article');card.className='card';const h=document.createElement('h3');h.textContent=title;const p=document.createElement('p');p.className='reportText';p.textContent=body;const b=document.createElement('button');b.type='button';b.className='copy';b.textContent='Копировать';b.setAttribute('aria-label','Копировать: '+title);b.addEventListener('click',async()=>{const fallback=el('copyFallback');try{await navigator.clipboard.writeText(body);fallback.hidden=true;el('copyStatus').textContent='Скопировано. Заполните поля в скобках.';}catch{fallback.value=body;fallback.hidden=false;fallback.focus();fallback.select();el('copyStatus').textContent='Выделен текст для ручного копирования.';}});card.append(h,p,b);el('reportCards').append(card);}
