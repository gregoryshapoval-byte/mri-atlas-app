import{cases}from'./pelvic-prolapse-data.js';import{classify,mobility}from'./pelvic233-math.js';
const $=s=>document.querySelector(s),names=[['patterns','Паттерны'],['measure','Измерения'],['calc','Калькулятор'],['scan','Протокол'],['report','Заключение']];
function tab(id,focus=false){for(const [k]of names){const b=$('[data-tab="'+k+'"]');$('#'+k).hidden=k!==id;b.setAttribute('aria-selected',String(k===id));b.tabIndex=k===id?0:-1;if(k===id&&focus)b.focus()}}
for(const [id,label]of names){const b=document.createElement('button');b.textContent=label;b.dataset.tab=id;b.id='tab-'+id;b.setAttribute('role','tab');b.setAttribute('aria-controls',id);$('#'+id).setAttribute('role','tabpanel');$('#'+id).setAttribute('aria-labelledby',b.id);b.onclick=()=>tab(id);b.onkeydown=e=>{let i=names.findIndex(x=>x[0]===id);if(e.key==='ArrowRight')i=(i+1)%names.length;else if(e.key==='ArrowLeft')i=(i+names.length-1)%names.length;else if(e.key==='Home')i=0;else if(e.key==='End')i=names.length-1;else return;e.preventDefault();tab(names[i][0],true)};$('.tabs').append(b)}
const T=(t,x,y,size=18,color='#e3eef5')=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="sans-serif" font-size="${size}" fill="${color}">${t}</text>`;
const P=(d,fill,stroke='#8ec9bd',w=3,dash='')=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" ${dash?'stroke-dasharray="'+dash+'"':''}/>`;
const C=(x,y,color='#f4c388')=>`<circle cx="${x}" cy="${y}" r="5" fill="${color}"/>`;
function svg(inner,title){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 470" role="img" aria-label="${title}"><rect width="600" height="470" rx="20" fill="#10232b"/>${inner}</svg>`}
export function figure(id){
 const line=id==='lines',low=id==='descent';let s=T('Спереди',80,30,17,'#a4becb')+T('Сзади',515,30,17,'#a4becb');
 // Symphysis and terminal coccygeal joint. PCL is intentionally horizontal in this diagram.
 s+=P('M65 155 Q82 142 95 155 L95 240 Q80 254 65 240Z','#a8b9c4','#d8e1e6')+P('M510 58 Q546 110 530 156 L521 215 Q514 235 511 250 Q502 269 490 280','#71868f','#c9d6dd',6)+P('M503 247 L519 253','none','#172a35',4);
 const b=id==='cystocele'?80:0,u=['uterine','vault'].includes(id)?92:0,r=low?50:0;
 s+=P(`M115 127 Q132 90 201 116 Q238 134 221 ${204+b} Q208 ${232+b} 155 ${228+b} Q119 ${213+b} 115 127Z`,'#397d83','#7ad6cb');
 s+=P(`M155 ${228+b} Q153 ${267+b*.6} 153 ${300+b*.4}`,'none','#79cfc0',9);
 if(id!=='vault')s+=P(`M268 ${102+u} Q255 ${74+u} 284 ${61+u} Q319 ${44+u} 334 ${77+u} L317 ${141+u} L294 ${175+u} L274 ${169+u}Z`,'#805e8e','#cda8d4');
 s+=P(`M285 ${170+u} Q267 ${226+u*.4} 245 ${312+u*.1} L265 ${321+u*.1} Q292 ${249+u*.4} 310 ${174+u}Z`,'#986e87','#e0a8c4',3);
 if(id==='vault')s+=P(`M285 ${170+u} Q298 ${155+u} 310 ${174+u}`,'none','#f1b9cf',6);
 const front=id==='rectocele'?'Q302 213 287 256 Q274 299 355 297':`Q355 230 355 ${291+r}`;
 s+=P(`M370 89 Q337 143 352 188 ${front} L377 ${326+r} L377 372 L408 372 L407 ${317+r} Q432 262 427 198 Q413 137 432 92Z`,'#487460','#9eceac',4);
 s+=P(`M95 230 Q231 ${300+r} 407 ${310+r}`,'none','#b68be1',8,'10 6');
 s+=P('M80 250 L511 250','none','#efb768',3,'10 6')+T('PCL',467,242,20,'#efb768');s+=C(80,250)+C(511,250);
 s+=T('Пузырь',169,163,18)+T('Влагалище',270,357,16)+T('Прямая кишка',418,71,17)+T('Симфиз',79,285,14);
 if(['normal','lines','descent'].includes(id)){
 const arj=[407,310+r];s+=P(`M80 250 L${arj[0]} ${arj[1]}`,'none','#6dbbfd',4)+P(`M407 250 L407 ${arj[1]}`,'none','#ff91bb',4)+T('H',230,282+r*.45,22,'#6dbbfd')+T('M',438,285+r*.5,22,'#ff91bb')+C(...arj)+T('ARJ',445,333+r,17,'#f4c388');
 }
 if(id==='cystocele'){s+=P(`M181 250 L181 ${228+b}`,'none','#f4c388',4)+C(181,228+b)+T('Дно ниже PCL',190,425,21,'#f4c388')}
 if(['uterine','vault'].includes(id)){s+=P(`M296 250 L296 ${175+u}`,'none','#f4c388',4)+C(296,175+u)+T(id==='vault'?'Опущение свода':'Ориентир: шейка',280,425,21,'#f4c388')}
 if(id==='rectocele'){s+=P('M355 198 L355 320','none','#c0d0d7',2,'6 6')+P('M287 256 L355 256','none','#f4c388',5)+T('Глубина',305,218,17,'#f4c388')+T('Выпячивание к влагалищу',280,425,20,'#f4c388')}
 if(id==='enterocele'){s+=P('M325 100 Q345 180 310 248 Q302 289 330 299 Q352 298 346 263 L359 118','none','#f4c388',4,'8 5');s+=P('M335 147 Q315 171 334 192 Q353 212 325 234 Q312 253 331 270','none','#cfa8db',13)+T('Мешок с кишкой',280,425,21,'#f4c388')}
 if(id==='intussusception'){s+=P('M355 240 L380 292 L380 255 M422 240 L398 292 L398 255','none','#f4c388',6)+T('Внедрение стенки в просвет',280,425,20,'#f4c388')}
 if(id==='dyssynergia'){s+=P('M434 284 Q377 260 367 297','none','#d89bff',12)+P('M393 303 L393 350','none','#f4c388',4,'6 6')+T('Сохраняется вдавление puborectalis',300,425,18,'#f4c388')}
 if(line)s+=T('PCL — ориентир · H — щель · M — опущение',300,425,19,'#a6dfd1');
 if(id==='normal')s+=T('Референсная схема, без числовой нормы',300,425,18,'#a6dfd1');
 if(low)s+=T('H и M оценивают отдельно от органов',300,425,19,'#a6dfd1');
 return svg(s,'Схема: '+id)
}
let selected=cases[0];function choose(c){selected=c;for(const k of ['title','group','look','trap'])$('#'+k).textContent=c[k];$('#scheme').innerHTML=figure(c.id);$('#reportTitle').textContent=c.title;$('#reportText').textContent=c.report;for(const b of $('#choices').children)b.setAttribute('aria-pressed',String(b.dataset.case===c.id))}
for(const c of cases){const b=document.createElement('button');b.textContent=({enterocele:'Энтероцеле',intussusception:'Инвагинация кишки',dyssynergia:'Диссинергия'})[c.id]||c.title;b.dataset.case=c.id;b.onclick=()=>choose(c);$('#choices').append(b)}
function zoom(title,html){$('#zoomTitle').textContent=title;$('#zoomFigure').innerHTML=html;$('#zoom').showModal()}
$('#scheme').onclick=()=>zoom(selected.title,figure(selected.id));$('#lineScheme').innerHTML=figure('lines');$('#lineScheme').onclick=()=>zoom('PCL · H · M',figure('lines'));$('#close').onclick=()=>$('#zoom').close();
const read=id=>$('#'+id).value.trim()===''?NaN:Number($('#'+id).value);
function calc(){const rest=read('rest'),max=read('max'),depth=read('depth'),c=classify(max,depth),m=mobility(rest,max),result=$('#result');result.replaceChildren();result.dataset.valid=String(c.valid&&m!==null);if(!c.valid||m===null){result.textContent='Заполните все поля корректными числами; глубина ≥0.';return}const texts=[$('#organ').value+': '+max.toFixed(1)+' см относительно PCL. '+c.level+'.','Смещение от покоя: '+m.toFixed(1)+' см. '+c.rect+'.'];if($('#organ').selectedIndex===0&&max<=1)texts.push('Для пузыря значение ≤1 см ниже PCL не подтверждает цистоцеле само по себе.');if(max>3)texts.push('Превышен ориентир >3 см ESUR 2026. Сопоставить с качеством пробы и клиникой.');texts.push('Описательный результат: без автоматического диагноза или стадии.');for(const t of texts){const p=document.createElement('p');p.textContent=t;result.append(p)}}
for(const id of ['rest','max','depth','organ'])$('#'+id).oninput=calc;
$('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(selected.report);$('#copyStatus').textContent='Скопировано';$('#fallback').hidden=true}catch{$('#fallback').value=selected.report;$('#fallback').hidden=false;$('#fallback').focus();$('#fallback').select();$('#copyStatus').textContent='Выделено для ручного копирования'}};
for(const t of ['Адекватность усилия и эвакуации отражена.','Все три компартмента оценены.','Сантиметры, знак и фаза указаны.','Ректоцеле и опущение ARJ измерены раздельно.','Грыжа: содержимое, положение и влияние на эвакуацию.','Клиническая тяжесть и POP-Q не назначены автоматически.']){const l=document.createElement('label'),i=document.createElement('input');i.type='checkbox';l.append(i,document.createTextNode(t));$('#checks').append(l)}
choose(selected);calc();tab('patterns');
