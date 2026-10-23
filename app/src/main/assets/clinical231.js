const $=s=>document.querySelector(s),moduleId=document.body.dataset.module,{data}=await import('./'+moduleId+'-data.js'),isN=moduleId==='tunnel-neuropathies';
const params=new URLSearchParams(location.search),from=params.get('from');
if(['shoulder','elbow','wrist','knee','hip','foot','upper-limb','lower-limb','spine'].includes(from)){$('#backLink').href='region.html?area='+from;$('#backLink').textContent='‹ Назад к области'}
const tabs=[...document.querySelectorAll('[data-tab]')];
function tab(id,focus=false){for(const b of tabs){const on=b.dataset.tab===id;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;$('#'+b.dataset.tab).hidden=!on;if(on&&focus)b.focus()}}
for(const b of tabs){b.onclick=()=>tab(b.dataset.tab);b.onkeydown=e=>{let i=tabs.indexOf(b);if(e.key==='ArrowRight')i=(i+1)%tabs.length;else if(e.key==='ArrowLeft')i=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')i=0;else if(e.key==='End')i=tabs.length-1;else return;e.preventDefault();tab(tabs[i].dataset.tab,true)}}
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function lines(t,max=29){const a=[];let l='';for(const w of t.split(' ')){if((l+' '+w).trim().length>max&&l){a.push(l);l=w}else l=(l+' '+w).trim()}if(l)a.push(l);return a}
function txt(t,x,y,max=29,size=17,anchor='middle',color='#dcebf2'){return `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${color}" font-size="${size}" font-family="sans-serif">${lines(t,max).map((l,i)=>`<tspan x="${x}" dy="${i?23:0}">${esc(l)}</tspan>`).join('')}</text>`}
function box(t,x,y,w=220,h=76,color='#25434c'){return `<rect x="${x-w/2}" y="${y}" width="${w}" height="${h}" rx="12" fill="${color}" stroke="#577584"/>`+txt(t,x,y+28,Math.floor(w/12),18)}
function line(x1,y1,x2,y2,color='#f1d56f'){return `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${color}" stroke-width="5" fill="none"/>`}
const maps={
 carpal:['Карпальный канал',['Возвратная ветвь → тенар','Пальцевые ветви → I–II червеобразные'],'Ладонная кожная ветвь: вне канала'],
 cubital:['Кубитальный канал',['Предплечье: FCU, локтевая часть FDP','Кисть: гипотенар, межкостные и др.'],'Ветви отходят на разных уровнях'],
 guyon:['Зона 1: смешанный ствол',['Зона 2: глубокая двигательная','Зона 3: поверхностная ветвь'],'Мышцы предплечья не вовлекаются'],
 pronator:['Срединный нерв в предплечье',['AIN → FPL, лучевая FDP, PQ','Другие ветви → иные мышцы'],'AIN-паттерн ≠ доказанная компрессия'],
 pin:['Глубокая ветвь → супинатор',['PIN → разгибатели пальцев','Ветви к супинатору: уровень вариабелен'],'ECRL обычно сохранён'],
 suprascapular:['Надлопаточная вырезка',['Надостная мышца','Ость-суставная вырезка → подостная'],'Проксимально: обе; дистально: подостная'],
 axillary:['Четырёхстороннее отверстие',['Ветви → дельтовидная','Ветвь → малая круглая'],'Изолированная атрофия неспецифична'],
 fibular:['Шейка малоберцовой кости',['Глубокая ветвь → передняя группа','Поверхностная → латеральная группа'],'При кисте: искать суставную ветвь'],
 tarsal:['Большеберцовый нерв',['Медиальный подошвенный','Латеральный подошвенный'],'Пяточные ветви: вариабельное отхождение'],
 baxter:['Латеральный подошвенный нерв',['Первая ветвь → ADM','Другие ветви: иная территория'],'Жировая инфильтрация ADM не доказывает синдром'],
 'deep-fibular':['Передний тарзальный канал',['Двигательная → короткие разгибатели','Чувствительная → I межпальцевый'],'Передняя группа голени обычно сохранена'],
 meralgia:['Латеральный кожный нерв бедра',['Чувствительность переднелатерального бедра','Двигательной территории нет'],'Паховая связка / область ПВПО'],
 morton:['Подошвенный пальцевой нерв',['Фиброз подошвеннее связки','Бурса преимущественно дорсальнее'],'Обычно III межплюсневый промежуток']
};
function nerve(c){const m=maps[c.id];let s=txt(c.structure,280,35,42,20);s+=box(m[0],280,75,360,72);s+=line(280,147,280,186)+line(130,186,430,186)+line(130,186,130,224)+line(430,186,430,224);s+=box(m[1][0],135,224,240,115)+box(m[1][1],425,224,240,115);s+=txt(m[2],280,391,42,17,'middle','#7fdbcf');s+=txt('Карта связей; не пространственная анатомия',280,455,50,14,'middle','#a8bac6');return s}
function bone(c){let s='';const b='#b4bdc4',o='#d9e2e7',e='#9767c7',r='#f3b967';
 if(['neck','hip-sif'].includes(c.id)){
 s+=`<path d="M130 132 Q105 75 145 55 Q205 20 245 85 L300 155 Q333 148 355 125 L400 130 L397 440 L316 440 L316 249 Q295 213 247 191 L204 164 Q157 185 130 132Z" fill="${b}" stroke="${o}" stroke-width="4"/>`;
 if(c.id==='neck'){s+=`<ellipse cx="259" cy="153" rx="50" ry="54" fill="${e}" opacity=".5"/><path d="M237 104 L260 138 M235 193 L258 163" stroke="${r}" stroke-width="8"/>`;s+=txt('Растяжение: верхнелатерально',275,27,42,16)+txt('Сжатие: нижнемедиально',235,300,38,16)+txt('Два альтернативных положения линии',280,480,43,15);}
 else{s+=`<path d="M123 99 Q146 47 208 68" stroke="${r}" stroke-width="8" fill="none" stroke-dasharray="22 7"/>`;s+=txt('SIF: неровная субхондральная полоса',280,295,40,17);}
 }else if(c.id==='sacrum'){
 s+=`<path d="M100 95 Q195 45 280 75 Q365 45 460 95 L380 300 L280 435 L180 300Z" fill="${b}" stroke="${o}" stroke-width="4"/><path d="M176 120 L205 300 M384 120 L355 300 M205 265 L355 265" fill="none" stroke="${r}" stroke-width="8"/>`;
 for(const x of [240,320])for(const y of [145,205,265])s+=`<ellipse cx="${x}" cy="${y}" rx="12" ry="9" fill="#536576"/>`;
 s+=txt('Вертикальные линии ± поперечная',280,40,44,17)+txt('H-образная конфигурация необязательна',280,469,47,15);
 }else if(c.id==='sifk'){
 s+=`<path d="M150 45 L410 45 L410 225 Q410 306 335 300 L280 267 L225 300 Q150 306 150 225Z" fill="${b}" stroke="${o}" stroke-width="4"/><path d="M135 346 L425 346 L399 452 L161 452Z" fill="${b}" stroke="${o}" stroke-width="4"/><path d="M150 311 Q220 322 263 293 M300 293 Q362 323 412 311" stroke="#71cdbf" stroke-width="8" fill="none"/><ellipse cx="204" cy="241" rx="49" ry="52" fill="${e}" opacity=".55"/><path d="M163 264 Q206 287 245 264" stroke="${r}" stroke-width="7" fill="none"/>`;
 s+=txt('Колено: субхондральная линия',280,28,40,17)+txt('Отёк ≠ некроз; отдельно оценить SIF-ON',280,485,48,14);
 }else if(['tibia','reaction'].includes(c.id)){
 s+=`<path d="M195 80 Q280 35 365 80 L335 430 L225 430Z" fill="${b}" stroke="${o}" stroke-width="5"/><path d="M228 104 L330 104 L308 403 L252 403Z" fill="#697781"/><ellipse cx="258" cy="270" rx="53" ry="96" fill="${e}" opacity=".5"/><path d="M216 170 Q187 267 220 369" stroke="#69cfc0" stroke-width="9" fill="none"/>`;
 if(c.id==='tibia')s+=`<path d="M223 287 L282 281" stroke="${r}" stroke-width="8"/>`;
 s+=txt(c.id==='reaction'?'Реакция: отёк без видимой линии':'При линии: стресс-перелом',280,32,43,18)+txt('Схема сигнала; сторона не задана',280,471,45,15);
 }else if(c.id==='vertebra'){
 s+=`<path d="M160 125 L395 180 L395 330 L160 330Z" fill="${b}" stroke="${o}" stroke-width="5"/><path d="M170 158 L380 205" stroke="${r}" stroke-width="8"/><path d="M425 120 L425 345" stroke="#76c7d4" stroke-width="10"/><path d="M192 200 L358 232 L358 305 L192 305Z" fill="${e}" opacity=".45"/>`;
 s+=txt('Компрессионная деформация',280,62,40,18)+txt('Высота • задняя стенка • канал',280,405,42,17);
 }else{
 const labels=c.id==='foot'?['Ладьевидная','Проксимальная V плюсневая','Медиальная лодыжка']:['Пяточная кость','Диафизы II–IV плюсневых','Искать линию, а не только отёк'];
 s+=box(labels[0],280,65,400,70)+line(280,135,280,184,r)+box(labels[1],280,184,400,70)+line(280,254,280,303,r)+box(labels[2],280,303,400,70);s+=txt('Карта локализаций; не анатомическая проекция',280,443,48,15);
 }
 return s}
function figure(c){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 510" role="img" aria-label="${esc(c.label)}"><rect width="560" height="510" rx="18" fill="#0d1822"/>${isN?nerve(c):bone(c)}</svg>`}
let selected=data.cases[0],group='Все';
function choose(c){selected=c;$('#caseGroup').textContent=c.group;$('#caseTitle').textContent=c.label;for(const f of ['site','muscles','pitfall'])$('#'+f).textContent=c[f];$('#signsText').textContent=c.signs;$('#territoryLabel').textContent=isN?'Какие мышцы проверить':'Что указать в описании';$('#figure').innerHTML=figure(c);$('#reportCase').textContent=c.label;$('#reportText').textContent=c.report;$('#fallback').value=c.report;$('#fallback').hidden=true;$('#copyStatus').textContent='';for(const b of document.querySelectorAll('[data-case]'))b.setAttribute('aria-pressed',String(b.dataset.case===c.id))}
function choices(){const q=$('#search').value.toLocaleLowerCase('ru');const found=data.cases.filter(c=>(group==='Все'||group===c.group)&&Object.values(c).join(' ').toLocaleLowerCase('ru').includes(q));$('#choices').replaceChildren(...found.map(c=>{const b=document.createElement('button');b.type='button';b.dataset.case=c.id;b.textContent=c.label;b.setAttribute('aria-pressed',String(c.id===selected.id));b.onclick=()=>choose(c);return b}));$('#empty').hidden=found.length>0}
for(const g of ['Все',...new Set(data.cases.map(c=>c.group))]){const b=document.createElement('button');b.textContent=g;b.type='button';b.setAttribute('aria-pressed',String(g===group));b.onclick=()=>{group=g;for(const n of $('#groups').children)n.setAttribute('aria-pressed',String(n===b));choices()};$('#groups').append(b)}
$('#search').oninput=choices;
function cards(target,rows){for(const [title,text]of rows){const a=document.createElement('article');a.className='card';const h=document.createElement('h3'),p=document.createElement('p');h.textContent=title;p.textContent=text;a.append(h,p);$(target).append(a)}}
cards('#infoCards',data.info);cards('#scanCards',data.scan);
const checks=isN?['Уровень и длина изменения нерва, непрерывность.','Калибр, фасцикулы и T2-сигнал в нескольких плоскостях.','Причина компрессии или её отсутствие в исследованном поле.','Распределение мышечного отёка / атрофии и сохранённые мышцы.','Альтернативный уровень: корешок, сплетение, проксимальный ствол.','Соответствие клинике / ЭНМГ; ограничения покрытия.']:['Точная кость, отдел, сторона и нагрузочный контекст.','Линия: плоскость, длина, кортикальный слой; либо отсутствие видимой линии.','Суставная поверхность: деформация / коллапс, смещение.','Локализация высокого риска и передача результата.','Для SIFK: зона низкого FS-сигнала, мениски / корни, экструзия, хрящ.','Признаки опухоли / инфекции, качество кости и ограничения.'];
for(const t of checks){const l=document.createElement('label'),i=document.createElement('input');i.type='checkbox';l.append(i,document.createTextNode(t));$('#checks').append(l)}
for(const [title,url] of data.sources){const li=document.createElement('li'),a=document.createElement('a');a.textContent=title;a.href=url;li.append(a);$('#sources').append(li)}
$('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(selected.report);$('#copyStatus').textContent='Скопировано'}catch{$('#fallback').hidden=false;$('#fallback').focus();$('#fallback').select();$('#copyStatus').textContent='Выделено для ручного копирования'}};
$('#figure').onclick=()=>{$('#zoomTitle').textContent=selected.label;$('#zoomFigure').innerHTML=figure(selected);$('#zoom').showModal()};$('#closeZoom').onclick=()=>$('#zoom').close();
$('#zoom').addEventListener('click',e=>{if(e.target!==$('#zoom'))return;const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()});
tab('cases');choices();choose(selected);
