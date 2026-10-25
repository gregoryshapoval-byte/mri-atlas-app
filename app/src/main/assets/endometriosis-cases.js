import {panelGuides} from './panel-guides256-data.js';
import {createPanelGallery,initPanelZoom} from './case-panels.js';
import {cases,source} from './endometriosis-cases-data.js';
const el=id=>document.getElementById(id);
const make=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
const path=c=>`endometriosis-cases/figure-${String(c.figure).padStart(2,'0')}.png`;
let selected=cases[0],filter='Все';
const groups=['Все',...new Set(cases.map(c=>c.group))];
function renderFilters(){el('caseFilters').replaceChildren(...groups.map(g=>{const b=make('button',g);b.type='button';b.setAttribute('aria-pressed',String(g===filter));b.onclick=()=>{filter=g;const visible=cases.filter(c=>g==='Все'||c.group===g);if(!visible.includes(selected))selected=visible[0];renderFilters();renderChoices();renderCase();};return b;}));}
function renderChoices(){const visible=cases.filter(c=>filter==='Все'||c.group===filter),label=make('label','Клинический пример'),select=make('select');select.id='caseSelect';label.htmlFor=select.id;for(const c of visible){const o=make('option',c.title);o.value=c.id;o.dataset.case=c.id;select.append(o);}select.value=selected.id;select.onchange=()=>{selected=cases.find(c=>c.id===select.value);renderCase();};const prev=make('button','←'),next=make('button','→');prev.type=next.type='button';prev.setAttribute('aria-label','Предыдущий случай');next.setAttribute('aria-label','Следующий случай');const step=d=>{selected=visible[(visible.indexOf(selected)+d+visible.length)%visible.length];select.value=selected.id;renderCase();};prev.onclick=()=>step(-1);next.onclick=()=>step(1);el('caseChoices').replaceChildren(label,select,prev,next);}
function addText(parent,title,text){const p=make('p');p.append(make('strong',title+' '),document.createTextNode(text));parent.append(p);}
function renderCase(){const c=selected,root=el('realCase');root.replaceChildren();root.append(make('p',`Случай ${cases.indexOf(c)+1} / ${cases.length} · ${c.group}`,'caseCount'),make('h3',c.title),make('p',c.series,'caseMeta'));
 root.append(createPanelGallery(path(c),c.title,undefined,panelGuides[path(c)]),make('p','Каждый кадр — на всю ширину. Нажмите на него для дополнительного увеличения.','caseMeta'),make('p',c.question));
 const d=make('details',null,'caseAnswer');d.append(make('summary','Показать разбор'));addText(d,'На изображении:',c.finding);addText(d,'В полном исследовании:',c.check);addText(d,'Ловушка:',c.trap);root.append(d);
 const jump=make('button','К соответствующей схеме →','caseFeature');jump.type='button';jump.onclick=()=>{document.getElementById('tab-features').click();document.querySelector(`[data-feature="${c.feature}"]`).click();};root.append(jump);
 const credit=make('p',null,'caseCredit');credit.append(document.createTextNode('Piccolo CL и соавт. Applied Sciences 2023;13:10509. '));const a=make('a',`Рисунок ${c.figure} · источник`);a.href=source.url+'#fig_body_display_applsci-13-10509-f'+String(c.figure).padStart(3,'0');a.target='_blank';a.rel='noopener';const license=make('a','CC BY 4.0');license.href=source.license;license.target='_blank';license.rel='noopener';credit.append(a,document.createTextNode(' · '),license,document.createTextNode('. '+source.credit+'. Панели показаны отдельно; исходная композиция доступна выше.'));root.append(credit);
}
initPanelZoom();
renderFilters();renderChoices();renderCase();
if(new URLSearchParams(location.search).get('tab')==='cases')el('tab-cases').click();
