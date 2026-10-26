import {assess,likelihood} from './pirr258-core.js';
const el=id=>document.getElementById(id);
function update(){const r=assess({therapy:el('therapy').value,dwi:Number(el('dwi').value),dce:Number(el('dce').value),adequate:el('adequate').checked,sameFocus:el('sameFocus').checked});el('result').textContent=r.score===null?'Категория не рассчитана':'PI-RR '+r.score+' · '+likelihood[r.score]+' вероятность';el('reason').textContent=r.reason;}
for(const id of ['therapy','dwi','dce','adequate','sameFocus'])el(id).addEventListener('change',update);update();
el('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(el('draft').value);el('copyStatus').textContent='Заготовка скопирована. Проверьте и заполните её.';}catch{el('draft').focus();el('draft').select();el('copyStatus').textContent='Выделен текст: скопируйте вручную.';}});
