import {data} from './stroke-data.js';
import {figures} from './stroke-figures.js';
const el=id=>document.getElementById(id);
const tabs=[...document.querySelectorAll('[data-tab]')];
function activate(tab,focus=false){for(const b of tabs){const active=b===tab;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;el(b.dataset.tab).hidden=!active;}if(focus)tab.focus();}
for(const b of tabs){b.addEventListener('click',()=>activate(b));b.addEventListener('keydown',e=>{const i=tabs.indexOf(b);let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();activate(tabs[n],true);});}
let current='ischemia';
function feature(id){const f=data.features.find(x=>x.id===id);if(!f)return;current=id;el('featureFigure').innerHTML=figures[id];el('featureTitle').textContent=f.title;el('featureGood').textContent=f.good;el('featureTrap').textContent=f.trap;el('featureLegend').replaceChildren(...f.legend.map(t=>{const li=document.createElement('li');li.textContent=t;return li;}));for(const b of document.querySelectorAll('[data-feature]'))b.setAttribute('aria-pressed',String(b.dataset.feature===id));}
for(const b of document.querySelectorAll('[data-feature]'))b.addEventListener('click',()=>feature(b.dataset.feature));
feature('ischemia');
const zoom=el('zoom');el('featureFigure').addEventListener('click',()=>{el('zoomFigure').innerHTML=figures[current];zoom.showModal();});zoom.querySelector('.close').addEventListener('click',()=>zoom.close());
function paragraph(text,className=''){const p=document.createElement('p');p.textContent=text;p.className=className;return p;}
for(const d of data.differentials){const card=document.createElement('article');card.className='card';const h=document.createElement('h3');h.textContent=d.title;card.append(h,paragraph(d.feature),paragraph(d.check),paragraph(d.trap,'trap'));el('differentials').append(card);}
for(const row of data.scan){const tr=document.createElement('tr');row.forEach((t,i)=>{const td=document.createElement(i===0?'th':'td');if(i===0)td.scope='row';else td.dataset.label=i===1?'Требования':'Задача';td.textContent=t;tr.append(td);});el('scanRows').append(tr);}
for(const text of data.checklist){const label=document.createElement('label'),input=document.createElement('input'),span=document.createElement('span');input.type='checkbox';span.textContent=text;label.append(input,span);el('checklist').append(label);}
for(const [title,body]of data.reports){const card=document.createElement('article');card.className='card';const h=document.createElement('h3');h.textContent=title;const p=paragraph(body,'reportText'),b=document.createElement('button');b.type='button';b.className='copy';b.textContent='Копировать';b.setAttribute('aria-label','Копировать: '+title);b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(body);el('copyFallback').hidden=true;el('fallbackLabel').hidden=true;el('copyStatus').textContent='Скопировано. Заполните поля в скобках.';}catch{el('copyFallback').value=body;el('copyFallback').hidden=false;el('fallbackLabel').hidden=false;el('copyFallback').focus();el('copyFallback').select();el('copyStatus').textContent='Выделен текст для ручного копирования.';}});card.append(h,p,b);el('reportCards').append(card);}


for(const row of data.locations){const tr=document.createElement('tr');row.forEach((t,i)=>{const cell=document.createElement(i===0?'th':'td');if(i===0)cell.scope='row';cell.textContent=t;tr.append(cell);});el('locationRows').append(tr);}
