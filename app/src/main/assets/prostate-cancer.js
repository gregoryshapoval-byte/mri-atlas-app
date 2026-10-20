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
let level='mid',zone='PZ';
function chooseZone(id){if(level==='apex'&&id==='CZ')return;zone=id;const d=data.zones.find(z=>z.id===id);el('zoneTitle').textContent=d.name;el('zoneText').textContent=d.text;el('zoneTip').textContent=d.tip;
for(const b of el('zoneChoices').children)b.setAttribute('aria-pressed',String(b.dataset.zone===id));
for(const part of el('zoneFigure').querySelectorAll('[data-zone]')){part.classList.toggle('active',part.dataset.zone===id);part.classList.toggle('dim',part.dataset.zone!==id);}
}
for(const z of data.zones){const b=document.createElement('button');b.type='button';b.textContent=z.name;b.dataset.zone=z.id;b.style.setProperty('--zone-color',z.color);b.addEventListener('click',()=>chooseZone(z.id));el('zoneChoices').append(b);}
function drawLevel(id){level=id;if(level==='apex'&&zone==='CZ')zone='PZ';el('zoneFigure').innerHTML=figures[level];for(const b of document.querySelectorAll('[data-level]'))b.setAttribute('aria-pressed',String(b.dataset.level===id));
for(const b of el('zoneChoices').children)b.disabled=level==='apex'&&b.dataset.zone==='CZ';
for(const part of el('zoneFigure').querySelectorAll('[data-zone]')){part.setAttribute('tabindex','0');part.setAttribute('role','button');part.setAttribute('aria-label',data.zones.find(z=>z.id===part.dataset.zone).name);part.addEventListener('click',()=>chooseZone(part.dataset.zone));part.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();chooseZone(part.dataset.zone);}});}
chooseZone(zone);}
for(const b of document.querySelectorAll('[data-level]'))b.addEventListener('click',()=>drawLevel(b.dataset.level));drawLevel('mid');el('sagFigure').innerHTML=figures.sagittal;
rows(el('scanRows'),data.scan);
function calculate(){const r=ProstateRules.assess({zone:el('calcZone').value,t2:Number(el('calcT2').value),dwi:Number(el('calcDwi').value),dce:el('calcDce').value,adequate:el('adequate').checked});el('calcResult').textContent=r.score===null?'Оценка ограничена':'PI-RADS '+r.score;el('calcReason').textContent=r.reason;}
for(const id of ['calcZone','calcT2','calcDwi','calcDce','adequate'])el(id).addEventListener('change',calculate);calculate();
const zoom=el('zoom');el('scoreFigure').addEventListener('click',()=>{el('zoomFigure').innerHTML=scoreZone==='PZ'?figures.signals:figures.tz;zoom.showModal();});zoom.querySelector('.close').addEventListener('click',()=>zoom.close());
for(const [title,body]of data.reports){const card=document.createElement('article');card.className='card';const h=document.createElement('h3');h.textContent=title;const p=document.createElement('p');p.className='reportText';p.textContent=body;const b=document.createElement('button');b.type='button';b.className='copy';b.textContent='Копировать';b.setAttribute('aria-label','Копировать: '+title);b.addEventListener('click',async()=>{const fallback=el('copyFallback');try{await navigator.clipboard.writeText(body);fallback.hidden=true;el('copyStatus').textContent='Скопировано. Заполните поля в скобках.';}catch{fallback.value=body;fallback.hidden=false;fallback.focus();fallback.select();el('copyStatus').textContent='Выделен текст для ручного копирования.';}});card.append(h,p,b);el('reportCards').append(card);}
