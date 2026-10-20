import{stages,protocol,mrfStatus,report,measurement}from'./rectal-cancer-data.js';
const $=id=>document.getElementById(id);
for(const s of stages){const o=document.createElement('option');o.value=s.id;o.textContent=s.name+' · '+s.short;$('stage').append(o)}
for(const row of protocol){const tr=document.createElement('tr');for(const v of row){const td=document.createElement('td');td.textContent=v;tr.append(td)}$('protocolRows').append(tr)}
function scheme(){const s=stages.find(v=>v.id===$('stage').value);$('stageTitle').textContent=s.name+' · '+s.short;$('stageDetail').textContent=s.detail;
const reach=s.id==='t4b'?76:s.id==='t12'?220:197-s.depth*2.4;
const axial=`<svg viewBox="0 0 540 370" aria-labelledby="diagramTitle"><title id="diagramTitle">${s.name}. Схема поперечного сечения, размеры условные</title><text x="270" y="22" text-anchor="middle" class="sLabel">Перед · 12</text><text x="270" y="354" text-anchor="middle" class="sLabel">Зад · 6</text><text x="23" y="190" class="sLabel">R</text><text x="502" y="190" class="sLabel">L</text><ellipse cx="270" cy="180" rx="176" ry="136" fill="#314147" fill-opacity=".55" stroke="#63d3cb" stroke-width="3"/>${s.id==='t4b'?'<rect id="adjacentOrgan" x="30" y="132" width="76" height="100" rx="18" fill="#a987ba" fill-opacity=".45" stroke="#c9abda"/><text x="22" y="267" class="small">Соседний орган</text>':''}<ellipse cx="270" cy="180" rx="67" ry="63" fill="#584a40" stroke="#d9b27a" stroke-width="7"/><ellipse cx="270" cy="180" rx="45" ry="42" fill="#111a24" stroke="#8cac9b" stroke-width="9"/><path id="tumour" d="M230 158 Q210 180 230 208 L${reach} 215 Q${reach-12} 187 ${reach} 150Z" fill="#ee8493" stroke="#ffc2cc" stroke-width="2"/><text x="405" y="61" class="sLabel">MRF</text><text x="270" y="295" text-anchor="middle" class="small">Мезоректальная клетчатка</text><text x="270" y="104" text-anchor="middle" class="small">Стенка</text><text x="270" y="331" text-anchor="middle" class="small">Аксиальная схема · вид со стороны стоп</text></svg>`;
const sag=`<svg viewBox="0 0 540 370" aria-labelledby="diagramTitle"><title id="diagramTitle">T4a, инвазия перитонеального отражения; условная сагиттальная схема</title><text x="25" y="24" class="sLabel">Перед</text><text x="455" y="24" class="sLabel">Зад</text><path d="M343 45 Q288 119 318 191 L318 303 M396 45 Q343 119 373 191 L373 303" fill="none" stroke="#d9b27a" stroke-width="13"/><path d="M60 114 Q155 111 225 171 Q270 205 315 166" fill="none" stroke="#63d3cb" stroke-width="4"/><path d="M321 122 Q286 142 275 181 L329 204 Q347 162 344 139Z" fill="#ee8493" stroke="#ffc2cc" stroke-width="2"/><text x="46" y="89" class="sLabel">Перитонеальное</text><text x="46" y="109" class="sLabel">отражение</text><text x="381" y="258" class="small">Кишка</text><text x="80" y="330" class="small">Инвазия брюшины; не просто контакт</text></svg>`;
$('scheme').innerHTML=s.id==='t4a'?sag:axial;$('legend').innerHTML='<span style="color:#ee8493">● Опухоль</span><span style="color:#d9b27a">● Мышечная оболочка</span><span style="color:#63d3cb">● '+(s.id==='t4a'?'Брюшина':'MRF')+'</span>'+(s.id==='t4b'?'<span style="color:#c9abda">● Соседний орган вне мезоректума</span>':'');}
function mrf(){
 const raw=$('mrf').value,val=mrfStatus(raw),source=$('source').value;
 const invalid=raw.trim()!==''&&measurement(raw)===null;
 $('mrf').setAttribute('aria-invalid',invalid);
 $('mrfResult').textContent=invalid?'Введите число ≥0':val==='не оценена'?'Не оценена':source?val:'Укажите источник расстояния';
 $('mrfResult').dataset.positive=val==='MRF+'&&!!source;
}
$('stage').addEventListener('change',scheme);$('mrf').addEventListener('input',mrf);$('source').addEventListener('change',mrf);
for(const button of document.querySelectorAll('[data-tab]'))button.addEventListener('click',()=>{
 for(const b of document.querySelectorAll('[data-tab]'))b.setAttribute('aria-selected',b===button);
 for(const p of document.querySelectorAll('section.panel'))p.hidden=p.id!==button.dataset.tab;
 button.scrollIntoView({block:'nearest',inline:'nearest'});
});
let draftEdited=false;
function make(){
 $('reportText').value=report({height:$('height').value,length:$('length').value,mrf:$('mrf').value,source:$('source').value,emvi:$('emvi').value});
 $('replaceDraft').hidden=true;draftEdited=false;$('reportStatus').textContent='Шаблон обновлён; заполните пропуски по исследованию.';$('copyStatus').textContent='';
}
$('reportText').addEventListener('input',()=>{draftEdited=true;$('reportStatus').textContent='В тексте есть ручные правки.';$('copyStatus').textContent='';});
for(const id of ['height','length','mrf','source','emvi'])$(id).addEventListener(id==='source'||id==='emvi'?'change':'input',()=>{
 $('reportStatus').textContent='Поля изменены. Обновите шаблон, чтобы перенести новые значения.';
 if(id==='height'||id==='length')$(id).setAttribute('aria-invalid',$(id).value.trim()!==''&&measurement($(id).value,{positive:id==='length'})===null);
});
$('makeReport').addEventListener('click',()=>{if(draftEdited){$('replaceDraft').hidden=false;$('replaceDraft').scrollIntoView({block:'nearest'});}else make();});
$('confirmReplace').addEventListener('click',make);$('cancelReplace').addEventListener('click',()=>{$('replaceDraft').hidden=true;});
$('copyReport').addEventListener('click',async()=>{
 let copied=false;
 try{if(navigator.clipboard){await navigator.clipboard.writeText($('reportText').value);copied=true;}}catch{}
 if(!copied){$('reportText').focus();$('reportText').select();try{copied=document.execCommand('copy');}catch{}}
 $('copyStatus').textContent=copied?'Скопировано':'Текст выделен: используйте «Копировать»';
});
scheme();mrf();make();document.body.dataset.ready='true';
