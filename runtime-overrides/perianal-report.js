const el=id=>document.getElementById(id);
for(const b of document.querySelectorAll('[data-section]'))b.onclick=()=>{for(const t of document.querySelectorAll('[data-section]')){const active=t===b;t.setAttribute('aria-pressed',String(active));el(t.dataset.section).hidden=!active;}};
const fields=[['internal','Внутреннее отверстие: часы, уровень, уверенность'],['course','Основной ход, IAS / EAS, puborectalis, леватор'],['external','Наружное отверстие: часы, локализация, уверенность'],['branches','Ветви / подкова: пространства, стороны, краниальная граница'],['cavity','Полости: локализация и размеры просвета'],['activity','T2 FS, усиление, DWI / ADC, сетон']];
const smartFields = [
 ['hope', 'HOPE — высота пересечения наружного сфинктера', 'Например: на 7 ч, в пределах нижней трети высоты EAS'],
 ['diameter', 'Максимальный диаметр хода по сегментам, мм', 'Например: межсфинктерный сегмент 2 мм, транссфинктерный 3 мм'],
 ['garg', 'Степень по Garg', 'Заполняется при необходимости']
];
let serial=0;
function addTract(){const fieldset=document.createElement('fieldset');fieldset.className='tractForm';fieldset.dataset.tract=String(++serial);const legend=document.createElement('legend');fieldset.append(legend);
 for(const [key,title] of fields){const label=document.createElement('label');label.textContent=title;const input=document.createElement('textarea');input.dataset.field=key;input.rows=2;input.placeholder='Не заполнено';label.append(input);fieldset.append(label);}
 for(const [key,title,values] of [['parks','Parks',['I · Межсфинктерный','II · Транссфинктерный','III · Супрасфинктерный','IV · Экстрасфинктерный','Не удаётся уверенно классифицировать']],['james','St James',['1','2','3','4','5','Спорное сочетание; см. анатомическое описание']]]){const label=document.createElement('label');label.textContent=title;const select=document.createElement('select');select.dataset.field=key;for(const v of ['',...values]){const option=document.createElement('option');option.value=v;option.textContent=v||'Не выбрано';select.append(option);}label.append(select);fieldset.append(label);}
 const smart = document.createElement('details');
 const summary = document.createElement('summary');
 summary.textContent = 'Дополнительные поля SMART';
 smart.append(summary);
 for (const [key, title, hint] of smartFields) {
  const label = document.createElement('label');
  label.textContent = title;
  const input = document.createElement('textarea');
  input.dataset.field = key;
  input.rows = 2;
  input.placeholder = hint;
  label.append(input);
  smart.append(label);
 }
 fieldset.append(smart);
 const remove=document.createElement('button');remove.type='button';remove.textContent='Удалить этот ход';remove.onclick=()=>{fieldset.remove();renumber();el('reportOutput').value='';};fieldset.append(remove);el('reportTracts').append(fieldset);renumber();el('reportOutput').value='';}
function renumber(){[...el('reportTracts').children].forEach((f,i)=>f.querySelector('legend').textContent='Ход '+(i+1));}
el('addTract').onclick=addTract;addTract();
const value=n=>n.value.trim()||'[не заполнено]';
el('buildReport').onclick=()=>{let lines=['Клиническая задача / вмешательства: '+value(el('reportClinical'))];for(const [i,f] of [...el('reportTracts').children].entries()){lines.push('\nХод '+(i+1)+':');for(const [key,title] of fields)lines.push(title+': '+value(f.querySelector(`[data-field="${key}"]`)));for(const [key,title] of [['parks','Parks'],['james','St James']])lines.push(title+': '+value(f.querySelector(`[data-field="${key}"]`)));
 for (const [key, title] of smartFields) {
  const entered = f.querySelector(`[data-field="${key}"]`).value.trim();
  if (entered) lines.push(title + ': ' + entered);
 }
}if(!el('reportTracts').children.length)lines.push('\n[Ходы не добавлены; это не означает отсутствие свища.]');lines.push('\nСфинктеры и сопутствующие изменения: '+value(el('reportAssociated')),'Сравнение: '+value(el('reportComparison')));el('reportOutput').value=lines.join('\n');el('copyStatus').textContent='Текст сформирован. Проверьте и отредактируйте перед использованием.';};
el('report').addEventListener('input',e=>{if(e.target!==el('reportOutput')){el('reportOutput').value='';el('copyStatus').textContent='Форма изменена — сформируйте текст заново.';}});
el('copyReport').onclick=async()=>{const output=el('reportOutput');if(!output.value){el('copyStatus').textContent='Сначала сформируйте текст.';return;}try{await navigator.clipboard.writeText(output.value);el('copyStatus').textContent='Текст скопирован.';}catch{output.focus();output.select();el('copyStatus').textContent=document.execCommand('copy')?'Текст скопирован.':'Текст выделен — используйте команду копирования устройства.';}};

// These anchors are inside the initially hidden report section. Reveal only known targets.
const smartTargets345 = new Set(['smart2024', 'smart-rifil', 'smart-hope']);
function revealSmart345() {
 const id = location.hash.slice(1);
 if (!smartTargets345.has(id)) return;
 document.querySelector('[data-section="report"]').click();
 document.getElementById('smart2024').open = true;
 requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({block:'start'}));
}
window.addEventListener('hashchange', revealSmart345);
revealSmart345();
