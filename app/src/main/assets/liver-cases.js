import {panelGuides} from './panel-guides256-data.js';
import {createPanelGallery,initPanelZoom} from './case-panels.js';
import {cases,sources} from './liver-cases-data.js';
const el=id=>document.getElementById(id);
const make=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
const path=c=>'liver-cases/'+c.file;
let selected=cases.find(c=>c.id==='hemangioma'),filter='Все',query='';
const groups=['Все',...new Set(cases.map(c=>c.group))];
function visible(){return cases.filter(c=>(filter==='Все'||c.group===filter)&&(!query||[c.title,c.question,c.finding,c.check,c.trap,c.group].join(' ').toLowerCase().includes(query)));}
function renderFilters(){const label=make('label','Тема'),select=make('select');select.id='caseGroup';label.htmlFor=select.id;for(const g of groups){const o=make('option',g);o.value=g;select.append(o);}select.value=filter;select.onchange=()=>{filter=select.value;refresh();};el('caseFilters').replaceChildren(label,select);}
function refresh(){const items=visible();if(!items.includes(selected))selected=items[0];renderFilters();renderChoices();renderCase();}
function renderChoices(){
 const items=visible(),label=make('label',`Иллюстрация · найдено ${items.length} из ${cases.length}`),select=make('select');select.id='caseSelect';label.htmlFor=select.id;
 for(const c of items){const o=make('option',c.title);o.value=c.id;o.dataset.case=c.id;select.append(o);}select.value=selected?.id||'';select.disabled=!items.length;
 select.onchange=()=>{selected=cases.find(c=>c.id===select.value);renderCase();};
 const prev=make('button','← Предыдущая'),next=make('button','Следующая →');prev.type=next.type='button';prev.disabled=next.disabled=!items.length;
 const step=d=>{selected=items[(items.indexOf(selected)+d+items.length)%items.length];select.value=selected.id;renderCase();};prev.onclick=()=>step(-1);next.onclick=()=>step(1);
 el('caseChoices').replaceChildren(label,select,prev,next);
}
function addText(parent,title,text){const p=make('p');p.append(make('strong',title+' '),document.createTextNode(text));parent.append(p);}
function renderCase(){
 const c=selected,root=el('realCase');root.replaceChildren();if(!c){root.append(make('p','По этому запросу нет иллюстраций. Измените поиск или выберите «Все».'));return;}
 root.append(make('p',`Иллюстрация ${cases.indexOf(c)+1} / ${cases.length} · ${c.group}`,'caseCount'),make('h3',c.title),make('p',c.series,'caseMeta'));
 root.append(createPanelGallery(path(c),c.title,undefined,panelGuides[path(c)]),make('p','Каждый кадр — на всю ширину. Нажмите на него для дополнительного увеличения.','caseMeta'),make('p',c.question,'casePanelNote'));
 const d=make('details',null,'caseAnswer');d.append(make('summary','Показать разбор'));addText(d,'На изображении:',c.finding);addText(d,'В полном исследовании:',c.check);addText(d,'Ловушка:',c.trap);root.append(d);
 const jump=make('button','Открыть признаки и схему →','caseFeature');jump.type='button';jump.onclick=()=>{document.querySelector('[data-tab="features"]').click();document.querySelector(`[data-feature="${c.feature}"]`).click();};root.append(jump);
 const source=sources[c.source],credit=make('p',null,'caseCredit'),a=make('a',source.short+` · Fig. ${c.figure}`);a.href=source.url+(c.source==='frontiers'?'#F'+c.figure:'#Fig'+c.figure);a.target='_blank';a.rel='noopener';
 const license=make('a','CC BY 4.0');license.href='https://creativecommons.org/licenses/by/4.0/';license.target='_blank';license.rel='noopener';
 credit.append(a,document.createTextNode(' · '),license,document.createTextNode(` · © Авторы, ${source.copyrightYear||source.year}. Исходный файл без изменений; панели показаны отдельно. Русский разбор — MRIAtlas.`));root.append(credit);
}
initPanelZoom();
el('caseSearch').oninput=e=>{query=e.target.value.trim().toLowerCase();refresh();};
for(const source of Object.values(sources)){const li=make('li'),a=make('a',source.authors+'. '+source.title+'. DOI '+source.doi);a.href=source.url;a.target='_blank';a.rel='noopener';li.append(a);el('caseSourceList').append(li);}
refresh();
