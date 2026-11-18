import {orderExamples,panelSequence} from './nav327-image-match.js';
import {treatmentTimes} from './nav327-treatment.js';
import {fields,profiles,sources} from './nav327-data.js';
import {evaluate,sanitize,neutral,label} from './nav327-engine.js';
import {diffusionCases, examples} from './nav327-diffusion.js';
const $=s=>document.querySelector(s),make=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
const preview=!!window.NAV327_PREVIEW,storageKey='mriatlas-nav327-v1';let state=sanitize({}),selected=new Set(),lastEvaluation,zoomOpener,compareOpener;
const rootUrl=new URL(location.href);let provided=false;const fromURL={};for(const f of fields)if(rootUrl.searchParams.has('n_'+f.id)){provided=true;fromURL[f.id]=rootUrl.searchParams.get('n_'+f.id);}
if(provided)state=sanitize(fromURL);else try{state=sanitize(JSON.parse(sessionStorage.getItem(storageKey)||'{}'));}catch{}
function link(text,url){if(preview&&!/^https?:/.test(url))return make('span',text+' · доступно в приложении','muted');const a=make('a',text);a.href=url;return a;}
function save(){try{sessionStorage.setItem(storageKey,JSON.stringify(state));}catch{}const u=new URL(location.href);for(const f of fields){u.searchParams.delete('n_'+f.id);if(state[f.id])u.searchParams.set('n_'+f.id,state[f.id]);}try{history.replaceState(null,'',u);}catch{}}
for(const f of fields){const box=make('div',undefined,'control'),l=make('label',f.label),s=make('select');box.dataset.field=f.id;s.id='field327-'+f.id;l.htmlFor=s.id;for(const [v,t]of f.options){const o=make('option',t);o.value=v;s.append(o);}s.value=state[f.id];s.onchange=()=>{state[f.id]=s.value;if(f.id==='therapy_contrast'){state.enhance='';$('#field327-enhance').value='';}if(f.id==='therapy_kind'){state.therapy_time='';state.therapy_field='';$('#field327-therapy_time').value='';$('#field327-therapy_field').value='';}save();render();};box.append(l,s);if(f.help){const h=make('details',undefined,'fieldhelp');h.append(make('summary','Как оценить'),make('p',f.help,'hint'));box.append(h);}$('#'+f.group+'Fields327').append(box);}
function focusField(id){$('#filters332').open=true;const s=$('#field327-'+id);if(!s)return;const d=s.closest('details');if(d)d.open=true;s.scrollIntoView({block:'center'});s.focus({preventScroll:true});}
function patch(values){Object.assign(state,sanitize({...state,...values}));for(const f of fields)$('#field327-'+f.id).value=state[f.id];save();render();}
const starts={dura:{dura:'broad'},posterior:{loc:'posterior'},ring:{enhance:'ring'},node:{structure:'cyst_node',enhance:'node'},ventricle:{loc:'ventricular',comp:'ventricular'},sellar:{loc:'sellar_region',comp:'sellar'},pineal:{loc:'pineal_region',comp:'pineal'},cortical:{loc:'cortical_region',comp:'intra'},mimics:{treatment:'untreated'},treated:{treatment:'treated'}};
for(const b of document.querySelectorAll('[data-start]'))b.onclick=()=>{$('#filters332').open=true;state=sanitize(starts[b.dataset.start]);selected.clear();for(const d of document.querySelectorAll('.advanced'))d.open=false;patch({});if(b.dataset.start==='mimics')$('#mimicGroup327').open=true;if(b.dataset.start==='treated')$('#therapyGroup327').open=true;document.querySelector('.next').scrollIntoView({block:'start'});};
$('#reset327').onclick=()=>{$('#filters332').open=true;state=sanitize({});selected.clear();for(const f of fields)$('#field327-'+f.id).value='';save();render();$('#field327-loc').focus();};
$('#showResults332').onclick=()=>{$('#filters332').open=false;$('#quick332').open=false;$('#output327').scrollIntoView({block:'start'});};
$('#editFilters332').onclick=()=>{$('#filters332').open=true;$('#filters332').scrollIntoView({block:'start'});};
function matchingEvidence(list,cls=''){const ul=make('ul',undefined,'evidence '+cls);for(const r of list)ul.append(make('li',r.reason));return ul;}
function compareControl(p){const b=make('button',selected.has(p.id)?'В сравнении ✓':'Добавить к сравнению');b.type='button';b.dataset.compare=p.id;b.setAttribute('aria-pressed',String(selected.has(p.id)));b.onclick=()=>{if(selected.has(p.id))selected.delete(p.id);else if(selected.size<3)selected.add(p.id);else{$('#status327').textContent='В сравнении максимум три варианта. Снимите один из выбранных.';return;}render();document.querySelector('[data-compare=\"'+p.id+'\"]')?.focus();};return b;}
function card(c){const p=c.profile,a=make('article',undefined,'candidate');a.dataset.entity=p.id;a.append(make('span',p.group==='mimic'?'Неопухолевый имитатор':'Опухоль / опухолевая группа','kind'),make('h3',p.title),make('h4','Что совпадает'),matchingEvidence(c.supports));if(c.against.length)a.append(make('h4','Что менее типично'),matchingEvidence(c.against,'against'));a.append(make('h4','Что проверить'),make('p',p.check),make('p',p.trap,'hint'));const actions=make('div',undefined,'actions');const photos=make('button',examples.some(x=>x.entity===p.id)?'Снимки и сравнение':'Признаки и сравнение');photos.type='button';photos.onclick=()=>openComparison([p.id],photos);actions.append(photos,compareControl(p),link('Открыть разбор →',p.url));a.append(actions);const refs=make('details'),summary=make('summary','Источники признаков');refs.append(summary);for(const id of p.sources){const src=sources[id];refs.append(link(src.title,src.url),make('br'));}a.append(refs);return a;}
function render(){
 const r=evaluate(state);lastEvaluation=r;renderTreated331(r);
 $('#filterSummary332').textContent=r.mode==='treated'?'После лечения · уточнить данные':'Признаки · '+r.selected.length+' выбрано';$('#showResults332').textContent=r.mode==='treated'?'К разбору после лечения':r.main.length?'К вариантам · '+r.main.length:'К результатам и следующему вопросу';$('#selectionSummary332').textContent='Выбрано признаков: '+r.selected.length;
 for(const f of fields){const box=$('#field327-'+f.id).closest('.control');box.hidden=r.mode==='treated'?!r.therapy.visible.includes(f.id):f.group==='therapy';}
 const time=$('#field327-therapy_time'),allowedTime=treatmentTimes(state.therapy_kind);
 for(const o of time.options)o.disabled=!!o.value&&o.value!=='uncertain'&&!allowedTime.includes(o.value);
 for(const group of document.querySelectorAll('.advanced'))group.hidden=[...group.querySelectorAll('.control')].every(c=>c.hidden);
 $('#mainFields327').hidden=r.mode==='treated';

 const displayFields=r.mode==='treated'?fields.filter(f=>r.therapy.visible.includes(f.id)):fields;
 $('#resultSummary327').textContent=displayFields.filter(f=>state[f.id]).map(f=>f.label+': '+label(f.id,state[f.id])).join(' · ');$('#selection327').replaceChildren();for(const f of displayFields.filter(f=>state[f.id])){const chip=make('button',f.label+': '+label(f.id,state[f.id])+' ×','chip');chip.type='button';chip.setAttribute('aria-label','Убрать признак: '+f.label);chip.onclick=()=>patch({[f.id]:''});$('#selection327').append(chip);}
 for(const b of document.querySelectorAll('[data-start]'))b.setAttribute('aria-pressed',String(Object.entries(starts[b.dataset.start]).every(([k,v])=>state[k]===v)));
 $('#notes327').replaceChildren(...r.notes.map(n=>make('p',n,'notice warning')));$('#start327').hidden=r.mode!=='start';$('#treated327').hidden=r.mode!=='treated';$('#vascular329').hidden=r.mode!=='vascular';$('#noResults327').hidden=r.mode!=='results'||r.main.length>0;
 const branching=['region','ventricle','origin','midline','cortical'].includes(r.mode);$('#region327').hidden=!branching;$('#region327').replaceChildren();if(branching){
 const rows=r.mode==='cortical'?[['cortex','Центр в коре','Пузырчатый очаг, изменение коры или тканевой узел.'],['juxta','Узелки под сохранённой корой','Сравните FLAIR с ликвором и оцените рисунок узелков.'],['hemisphere','Глубокая тканевая масса','Общий глиальный и неопухолевый ряд.']]:r.mode==='midline'?((state.loc==='sellar_region'||!state.loc&&state.comp==='sellar')?[['pituitary','Гипофиз / седло','Масса центрирована в железе; оцените отдельно её симметрию.'],['suprasellar','Супраселлярная цистерна','Нормальная железа может быть видна отдельно от образования.'],['stalk','Воронка / гипоталамус / хиазма','Проследите истинную структуру происхождения.'],['parasellar','Кавернозный синус / параселлярно','Оцените твёрдую оболочку и отношения с артерией.']]:[['pineal','Истинный центр в эпифизе','Киста, паренхиматозная или герминогенная опухоль и имитаторы.'],['tectal','Пластинка четверохолмия','Отличайте ткань среднего мозга от первичной пинеальной массы.'],['falcotentorial','Серп / намёт рядом','Дуральное происхождение; эпифиз может быть смещён.']]):r.mode==='region'?[['cerebellum','Вещество мозжечка','Гемангиобластома, пилоцитарная опухоль, метастаз, медуллобластома — с учётом возраста и строения.'],['fourth','IV желудочек','Эпендимома, субэпендимома, опухоль сплетения, RGNT и другие варианты.'],['cpa','ММУ / ВСП','Шваннома, менингиома, эпидермоидная или арахноидальная киста.'],['brainstem','Ствол','Глиальные опухоли и другие имитаторы.']]:r.mode==='ventricle'?[['lateral','Боковой желудочек','Уточните перегородку у Монро, стенку или сплетение.'],['monro','Область Монро / перегородка','Нейроцитома, SEGA; коллоидная киста — при передневерхнем центре III желудочка.'],['trigone','Треугольник бокового желудочка','Внутрижелудочковая менингиома, опухоль сплетения, вторичные очаги.'],['third','III желудочек','Отделите передневерхнюю кисту от массы нижней части / дна.'],['fourth','IV желудочек','Стенка, obex, сплетение, выходы Люшка / Мажанди.']]:[['cerebellum','Источник в мозжечке','Далее оценивать как мозжечковую массу с возможным воздействием на IV желудочек.'],['brainstem','Источник в стволе','Отделить экзофитный рост от первичной массы IV желудочка.'],['hemisphere','Источник в полушарии','Подбор по внутримозговому центру; учитывать врастание в желудочек.'],['cpa','Источник в ММУ','Экстрааксиальный процесс, сдавливающий соседние структуры.'],['suprasellar','Супраселлярный источник','Масса вне просвета III желудочка.'],['pineal','Пинеальный источник','Отделить эпифиз от III желудочка и четверохолмия.']];
 for(const [id,title,body]of rows){const a=make('article',undefined,'candidate');a.append(make('h3',title),make('p',body));const b=make('button','Выбрать этот центр');b.type='button';b.dataset.region=id;b.onclick=()=>patch(r.mode==='origin'?{loc:id,comp:['cpa','falcotentorial'].includes(id)?'extra':['pituitary','suprasellar','stalk','parasellar'].includes(id)?'sellar':id==='pineal'?'pineal':'intra',attachment:'',vent_relation:''}:{loc:id,...(['midline','cortical'].includes(r.mode)?{comp:id==='tectal'?'intra':id==='falcotentorial'?'extra':id==='pineal'?'pineal':['cortex','juxta','hemisphere'].includes(id)?'intra':'sellar',attachment:'',vent_relation:''}:{})});a.append(b);$('#region327').append(a);}}
 $('#results327').replaceChildren(...r.main.map(card));$('#moreCards327').replaceChildren(...r.more.map(card));$('#more327').hidden=!r.more.length;$('#moreTitle327').textContent='Дополнительные варианты · '+r.more.length;
 $('#lessCards327').replaceChildren(...r.less.map(c=>{const a=make('article',undefined,'less-row');a.dataset.lessEntity=c.profile.id;a.append(make('h3',c.profile.title),make('p','Совпадает: '+c.supports.map(x=>x.reason).join(' ')),matchingEvidence(c.against,'against'));const actions=make('div',undefined,'actions'),photos=make('button',examples.some(e=>e.entity===c.profile.id)?'Снимки и сравнение':'Признаки и сравнение');photos.type='button';photos.onclick=()=>openComparison([c.profile.id],photos);actions.append(photos,compareControl(c.profile),link('Открыть разбор →',c.profile.url));a.append(actions);return a;}));$('#less327').hidden=!r.less.length;$('#lessTitle327').textContent='Менее типичные при выбранных признаках · '+r.less.length;
 $('#nextQuestion327').textContent=r.next.text;$('#nextField327').hidden=!r.next.field;$('#nextField327').onclick=()=>focusField(r.next.field);
 $('#status327').textContent=r.mode==='start'?'Выберите локализацию или МР-признак.':r.mode==='treated'?'Отдельная ветвь после лечения.':r.mode==='region'?'Уточните центр в ЗЧЯ; это группы поиска.':r.mode==='ventricle'?'Выберите желудочек и отдел; прикрепление уточняется отдельно.':r.mode==='cortical'?'Уточните корковый или подкорковый центр.':r.mode==='midline'?'Выберите исходную структуру; это не готовый диагноз.':r.mode==='vascular'?'Требуется уточнение сосудистого происхождения.':r.mode==='origin'?'Уточните источник: компрессия и врастание не равны массе просвета.':r.main.length+' основных ориентиров · '+r.more.length+' дополнительных. Порядок не является вероятностью.';
 const valid=new Set([...r.main,...r.more,...r.less].map(c=>c.profile.id));for(const id of [...selected])if(!valid.has(id))selected.delete(id);
 $('#compareBar327').hidden=!selected.size;$('#compareNames327').textContent='Для сравнения: '+selected.size+' / 3';document.documentElement.dataset.nav327='ready';
}
function picture(panel,id=''){const wrap=make('span',undefined,'imagepanel328'),img=make('img');if(id)img.id=id;img.src=window.NAV327_ASSETS?.[panel.file]||panel.file;img.alt=panel.label;wrap.append(img);if(panel.box){const [x,y,w,h]=panel.box;wrap.style.aspectRatio=w+'/'+h;wrap.classList.add('cropped');const fit=()=>{img.style.width=img.naturalWidth/w*100+'%';img.style.left=-x/w*100+'%';img.style.top=-y/h*100+'%';};img.onload=fit;if(img.complete&&img.naturalWidth)fit();}return wrap;}
function showZoom(panel,button){zoomOpener=button;$('#zoomTitle327').textContent=panel.label;$('#zoomPanel327').replaceChildren(picture(panel,'image327'));$('#zoomNote327').textContent=panel.note||'';$('#scale327').value='100';$('#zoomPanel327').style.width='100%';$('#zoom327').showModal();history.pushState({navModal332:'zoom'},'',location.href);$('#closeZoom327').focus();}
const comparisonIntro = $('#compareIntro327').textContent;

function showComparison(opener, title, intro, content) {
 compareOpener = opener;
 $('#compareTitle327').textContent = title;
 $('#compareIntro327').textContent = intro;
 $('#compareContent327').replaceChildren(content);
 $('#compare327').showModal();
 history.pushState({navModal332:'compare'}, '', location.href);
 $('#closeCompare327').focus();
}

function casePanel(panel, title) {
 const figure = make('figure');
 const button = make('button', undefined, 'imagebutton');
 button.type = 'button';
 button.setAttribute('aria-label', 'Увеличить: ' + title + ' · ' + panel.label);
 button.append(picture(panel));
 button.onclick = () => showZoom(panel, button);
 button.querySelector('img').onerror = () => {
  button.replaceChildren(make('p', 'Изображение не загрузилось.', 'notice warning'));
 };
 figure.append(button, make('figcaption', panel.label + (panel.note ? ' · ' + panel.note : '')));
 return figure;
}

function caseSource(box, example) {
 box.append(make('p', (example.authors || 'Авторы исходной публикации') + ' · ' +
  (example.license || 'Лицензия в исходном модуле'), 'credit'), link('Публикация', example.source));
 if (example.license_url) box.append(link('Условия лицензии', example.license_url));
}

function openDiffusion(opener) {
 const grid = make('div', undefined, 'diffusion-grid327');
 for (const {example, pattern, finding} of diffusionCases) {
  const box = make('section', undefined, 'example');
  box.dataset.caseId = example.case_id;
  box.append(make('p', pattern, 'kind'), make('h3', example.title), make('p', finding));
  const pair = make('div', undefined, 'diffusion-pair327');
  for (const sequence of ['DWI', 'ADC']) {
   const panel = example.panels.find(panel => panelSequence(panel).includes(sequence));
   pair.append(casePanel(panel, example.title));
  }
  box.append(pair, make('p', example.trap, 'hint'), link('Открыть разбор →', example.link));
  caseSource(box, example);
  grid.append(box);
 }
 showComparison(opener, 'DWI и ADC на реальных снимках',
  'В каждой паре сравните один участок на DWI и ADC. Увеличьте кадр касанием.', grid);
}

$('#openDiffusion327').onclick = event => openDiffusion(event.currentTarget);

function openComparison(ids,opener){
 const content = document.createDocumentFragment();
 for(const id of ids){const p=profiles.find(x=>x.id===id),c=[...lastEvaluation.main,...lastEvaluation.more,...lastEvaluation.less].find(x=>x.profile.id===id),col=make('article',undefined,'comparison');col.dataset.comparison=id;col.append(make('h3',p.title));if(c){col.append(make('h4','Совпадает'),matchingEvidence(c.supports));if(c.against.length)col.append(make('h4','Менее типично'),matchingEvidence(c.against,'against'));}col.append(make('p',p.check),link('Подробный модуль →',p.url));
 const items=orderExamples(examples.filter(e=>e.entity===id),state);if(!items.length)col.append(make('p','Для этого варианта реальные снимки в новом сравнении пока не подключены. Доступен текстовый разбор; отсутствие примера не исключает вариант.','noexamples'));
 for(const match of items){const ex=match.ex,box=make('section',undefined,'example');box.dataset.example=ex.id;if(ex.case_id)box.dataset.caseId=ex.case_id;box.dataset.match=match.status;box.append(make('h4',ex.title));
 const names=keys=>keys.map(k=>fields.find(f=>f.id===k)?.label||k).join(', ');
 box.append(make('p',match.complete?'Разметка подборки соответствует выбранным признакам.':match.status==='different'?'Пример для сравнения: есть отличия от выбранного паттерна.':match.matches.length?'Частичное совпадение с выбранным паттерном.':'Справочный пример диагноза; совпадение с выбранным паттерном не подтверждено.','match-badge '+match.status));
 if(match.matches.length)box.append(make('p','Совпадает по разметке случая: '+names(match.matches)+'. Это относится к подборке, не к каждому отдельному кадру.','hint'));
 if(match.differences.length)box.append(make('p','Иначе описано в этом случае: '+names(match.differences)+'.','against'));
 if(match.missing.length||match.unproven.length){const details=make('details');details.append(make('summary','Какие признаки пример не подтверждает'),make('p',names([...match.missing,...match.unproven])+' — разметки или необходимых серий недостаточно.','hint'));box.append(details);}
 for(const warning of match.warnings)box.append(make('p',warning,'notice warning'));
 box.append(make('p','Серии в подборке: '+(match.sequences.join(', ')||'точные последовательности в подписи не указаны')+'.','hint'));
 for (const panel of ex.panels) box.append(casePanel(panel, ex.title));
 if (ex.note) box.append(make('p', ex.note));
 if (ex.trap) box.append(make('p', ex.trap, 'hint'));
 caseSource(box, ex);
 col.append(box);
 }content.append(col);
 }showComparison(opener, 'Сравнение вариантов', comparisonIntro, content);
}

$('#openCompare327').onclick=e=>openComparison([...selected],e.target);const closeModal332=id=>{const mode=id==='zoom327'?'zoom':'compare';if(history.state?.navModal332===mode)history.back();else $('#'+id).close();};$('#closeCompare327').onclick=()=>closeModal332('compare327');$('#closeZoom327').onclick=()=>closeModal332('zoom327');for(const id of ['compare327','zoom327'])$('#'+id).oncancel=e=>{e.preventDefault();closeModal332(id);};$('#compare327').onclose=()=>compareOpener?.focus();$('#zoom327').onclose=()=>zoomOpener?.focus();$('#scale327').oninput=e=>$('#zoomPanel327').style.width=e.target.value+'%';
for(const s of Object.values(sources)){$('#sources327').append(link(s.title,s.url),make('br'));}
window.addEventListener('popstate',()=>{const mode=history.state?.navModal332;if(mode!=='zoom'&&$('#zoom327').open)$('#zoom327').close();if(!mode&&$('#compare327').open)$('#compare327').close();const p=new URLSearchParams(location.search);const next={};for(const f of fields)next[f.id]=p.get('n_'+f.id);state=sanitize(next);for(const f of fields)$('#field327-'+f.id).value=state[f.id];render();});render();

if(!preview)import('./personal252.js').then(m=>m.installPersonal252($('#personalTools327')));

function renderTreated331(r){
 const root=$('#treatedCards331');root.replaceChildren();if(r.mode!=='treated')return;
 for(const row of r.therapy.cards){const a=make('article',undefined,'candidate');a.dataset.therapyCard=row.id;a.append(make('h4',row.title),make('p',row.body));
 if(row.refs.length){const d=make('details');d.append(make('summary','Источники'));for(const id of row.refs){const src=sources[id];if(src)d.append(link(src.title,src.url),make('br'));}a.append(d);}root.append(a);}
}
