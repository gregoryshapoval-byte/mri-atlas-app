import {createPanelGallery,initPanelZoom} from './case-panels.js';
import {cordCases,infectionCases,sources} from './spine246-cases.js';
const el=id=>document.getElementById(id),make=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
const cases=document.body.dataset.module==='spinal-cord'?cordCases:infectionCases;
let selected=cases[0],group='Все',query='';
const filtered=()=>cases.filter(c=>(group==='Все'||c.group===group)&&[c.title,c.finding,c.trap,c.group].join(' ').toLowerCase().includes(query));
const select=el('caseGroup');for(const g of ['Все',...new Set(cases.map(c=>c.group))]){const o=make('option',g);o.value=g;select.append(o);}select.onchange=()=>{group=select.value;refresh();};
function add(p,label,text){const d=make('p');d.append(make('strong',label+' '),document.createTextNode(text));p.append(d);}
function render(){const root=el('realCase');root.replaceChildren();if(!selected){root.append(make('p','Нет примеров по этому запросу. Измените поиск или выберите «Все».'));return;}
 const c=selected,s=sources[c.source];root.append(make('p',`${cases.indexOf(c)+1} / ${cases.length} · ${c.group}`,'caseCount'),make('h3',c.title),make('p','Кадры исходной публикации · обозначения сохранены','caseMeta'),createPanelGallery('spine246/'+c.file,c.title,c.layout));
 const d=make('details',null,'caseAnswer');d.append(make('summary','Разбор и ограничения'));add(d,'На примере:',c.finding);add(d,'Проверить в полном исследовании:',c.check);add(d,'Ловушка:',c.trap);root.append(d);
 const credit=make('p',null,'caseCredit'),a=make('a',`${s.short} · Fig. ${c.figure}`);a.href=s.url;a.target='_blank';a.rel='noopener';const license=make('a','CC BY 4.0');license.href='https://creativecommons.org/licenses/by/4.0/';license.target='_blank';license.rel='noopener';credit.append(a,document.createTextNode(' · © '+s.year+' авторы · '),license,document.createTextNode('. Панели отделены только для показа; исходная композиция доступна ниже. Русские пояснения — MRI Atlas.'));root.append(credit);
}
function refresh(){const items=filtered();if(!items.includes(selected))selected=items[0];const choice=el('caseSelect');choice.replaceChildren();for(const c of items){const o=make('option',c.title);o.value=c.id;choice.append(o);}choice.disabled=!items.length;choice.value=selected?.id||'';el('caseCount').textContent=`Найдено ${items.length} из ${cases.length}`;for(const id of ['casePrev','caseNext'])el(id).disabled=!items.length;render();}
el('caseSelect').onchange=e=>{selected=cases.find(c=>c.id===e.target.value);render();};for(const [id,delta]of [['casePrev',-1],['caseNext',1]])el(id).onclick=()=>{const items=filtered();selected=items[(items.indexOf(selected)+delta+items.length)%items.length];refresh();};
el('caseSearch').oninput=e=>{query=e.target.value.trim().toLowerCase();refresh();};
for(const key of new Set(cases.map(c=>c.source))){const s=sources[key],li=make('li'),a=make('a',s.short+'. '+s.title);a.href=s.url;a.target='_blank';a.rel='noopener';li.append(a);el('caseSourceList').append(li);}
initPanelZoom();refresh();
