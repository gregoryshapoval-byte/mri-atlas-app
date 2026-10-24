import {cases,sources} from './rectal-cases-data.js';
const el=id=>document.getElementById(id);
const make=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
const path=c=>'rectal-cases/'+c.file;
let selected=cases.find(c=>c.id==='t3-mrf'),filter='Все',query='';
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
 const b=make('button',null,'caseImageButton');b.type='button';b.setAttribute('aria-label','Увеличить: '+c.title);const img=make('img');img.src=path(c);img.alt=c.title+'; оригинальная иллюстрация '+c.figure;img.decoding='async';b.append(img);
 b.onclick=()=>{el('caseZoomTitle').textContent=c.title;el('caseZoomImage').src=path(c);el('caseZoomImage').alt=img.alt;el('caseZoomScale').value='1';el('caseZoomImage').style.width='100%';el('caseZoom').showModal();};root.append(b,make('p','Нажмите на снимок для увеличения до 4×.','caseMeta'),make('p',c.question,'casePanelNote'));
 const d=make('details',null,'caseAnswer');d.append(make('summary','Показать разбор'));addText(d,'На изображении:',c.finding);addText(d,'В полном исследовании:',c.check);addText(d,'Ловушка:',c.trap);root.append(d);
 const names={staging:'Стадирование',nodes:'Узлы и риски',response:'После лечения'};
 const jump=make('button','Открыть раздел «'+names[c.tab]+'» →','caseFeature');jump.type='button';jump.onclick=()=>document.querySelector(`[data-tab="${c.tab}"]`).click();root.append(jump);
 const source=sources[c.source],credit=make('p',null,'caseCredit'),a=make('a',source.short+` · Fig. ${c.figure}`);a.href=c.source==='mdpi'?source.url+'#fig_body_display_jcm-13-00172-f'+String(c.figure).padStart(3,'0'):source.url+'#Fig'+c.figure;a.target='_blank';a.rel='noopener';
 const license=make('a','CC BY 4.0');license.href='https://creativecommons.org/licenses/by/4.0/';license.target='_blank';license.rel='noopener';
 credit.append(a,document.createTextNode(' · '),license,document.createTextNode(` · © Авторы, ${source.copyrightYear||source.year}. Изображение без изменений; русский разбор — MRIAtlas.`));root.append(credit);
}
el('caseZoom').querySelector('.close').onclick=()=>el('caseZoom').close();
el('caseZoomScale').oninput=e=>{el('caseZoomImage').style.width=`${Number(e.target.value)*100}%`;};
el('caseSearch').oninput=e=>{query=e.target.value.trim().toLowerCase();refresh();};
for(const source of Object.values(sources)){const li=make('li'),a=make('a',source.authors+'. '+source.title+'. DOI '+source.doi);a.href=source.url;a.target='_blank';a.rel='noopener';li.append(a);el('caseSourceList').append(li);}
refresh();
