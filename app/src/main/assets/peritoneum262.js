import {spaces,levels,sources} from './peritoneum262-data.js';
import {scheme} from './peritoneum262-schemes.js';
const $=s=>document.querySelector(s),byId=new Map(spaces.map(s=>[s.id,s])),params=new URLSearchParams(location.search);
const kinds={cavity:['Брюшинная полость','#d9edf9'],retro:['Забрюшинное','#f5d9c5'],extra:['Внебрюшинное','#f7e8bd'],sub:['Ткань брыжейки','#ffe9a2'],pelvic:['Подбрюшинное таза','#f9e4ac'],perineal:['Промежность','#e0d6f2'],fascia:['Фасция','#168b7b'],peritoneum:['Брюшина','#e47d26'],muscle:['Мышцы','#b2bdd0']};
const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let index=Math.max(0,levels.findIndex(l=>l.id===params.get('level262'))),sex=params.get('sex262')==='female'?'female':'male';
$('#sex').value=sex;
$('#level').innerHTML=levels.map((l,i)=>`<option value="${i}">${safe(l.title)}</option>`).join('');
$('#legend').innerHTML=Object.values(kinds).map(([name,color])=>`<span><i class="swatch" style="background:${color}"></i>${name}</span>`).join('');
$('#levelmap').innerHTML=levels.map((l,i)=>`<button data-index="${i}" type="button">${safe(l.title)}</button>`).join('');
function detail(id){const s=byId.get(id);return `<span class="tag">${kinds[s.kind][0]}</span><h4>${safe(s.name)}</h4><p><b>Границы:</b> ${safe(s.bounds)}</p><p><b>Содержимое:</b> ${safe(s.contents)}</p><p><b>Связи:</b> ${safe(s.links)}</p><p><b>Не перепутать:</b> ${safe(s.tip)}</p><p class="small">Источники: ${s.refs.map(k=>`<a href="#source-${k}">${safe(sources[k][0].split(' · ')[0])}</a>`).join(' · ')}</p>`;}
function card(level,initial){const {svg,ids}=scheme(level,sex,initial),visible=ids.filter(id=>byId.has(id)),selected=visible.includes(initial)?initial:visible[0];
 const article=document.createElement('div');article.className='levelcard';article.dataset.level=level.id;
 article.innerHTML=`<h3>${safe(level.title)}</h3><p class="orientation">${level.orient} · ${sex==='male'?'мужской':'женский'} таз · нажмите номер или название</p><div class="levelbody"><div><div class="diagram">${svg}<button type="button" class="zoom" aria-pressed="false">Увеличить</button></div>${level.notes.map(n=>`<p class="note">${safe(n)}</p>`).join('')}</div><div class="annotations"><div class="keys">${visible.map((id,i)=>`<button type="button" data-space="${id}" aria-pressed="${id===selected}"><b>${i+1}</b><span>${safe(byId.get(id).name)}</span></button>`).join('')}</div><div class="detail" aria-live="polite">${detail(selected)}</div></div></div>`;
 const select=id=>{if(!byId.has(id))return;article.querySelector('.detail').innerHTML=detail(id);for(const el of article.querySelectorAll('[data-space]')){const active=el.dataset.space===id;el.classList.toggle('active',active);if(el.classList.contains('pin'))el.classList.toggle('selected',active);if(el.tagName==='BUTTON')el.setAttribute('aria-pressed',String(active));}};
 for(const pin of article.querySelectorAll('.pin'))pin.setAttribute('aria-label',byId.get(pin.dataset.space).name);
 article.addEventListener('click',ev=>{const zoom=ev.target.closest('.zoom');if(zoom){const on=zoom.getAttribute('aria-pressed')!=='true';zoom.setAttribute('aria-pressed',String(on));zoom.textContent=on?'Уменьшить':'Увеличить';zoom.closest('.diagram').classList.toggle('zoomed',on);return;}const target=ev.target.closest('[data-space]');if(target)select(target.dataset.space);});
 article.addEventListener('keydown',ev=>{if(ev.target.classList.contains('pin')&&['Enter',' '].includes(ev.key)){ev.preventDefault();select(ev.target.dataset.space);}});select(selected);return article;
}
function updateURL(){const p=new URLSearchParams(location.search);p.set('level262',levels[index].id);p.set('sex262',sex);try{history.replaceState(null,'',location.pathname+'?'+p+location.hash);}catch{}}
function all(){const host=$('#allLevels');host.replaceChildren(...levels.map(l=>card(l)));}
function render(){const l=levels[index];$('#level').value=String(index);$('#current').replaceChildren(card(l,params.get('space262')));$('#counter').textContent=`${index+1} / ${levels.length}`;$('#prev').disabled=index===0;$('#next').disabled=index===levels.length-1;for(const el of $('#levelmap').children)el.setAttribute('aria-pressed',String(Number(el.dataset.index)===index));if(!$('#allLevels').hidden)all();updateURL();}
$('#level').addEventListener('change',e=>{index=Number(e.target.value);render();});$('#sex').addEventListener('change',e=>{sex=e.target.value;render();});$('#prev').onclick=()=>{if(index>0){index--;render();}};$('#next').onclick=()=>{if(index<levels.length-1){index++;render();}};
$('#levelmap').onclick=e=>{const b=e.target.closest('[data-index]');if(b){index=Number(b.dataset.index);render();}};
$('#showAll').onclick=()=>{const show=$('#allLevels').hidden;$('#allLevels').hidden=!show;$('.atlasgrid').hidden=show;$('#showAll').setAttribute('aria-pressed',String(show));$('#showAll').textContent=show?'Один уровень':'Все уровни';if(show)all();};window.addEventListener('beforeprint',all);
const normal=s=>s.toLowerCase().replace(/ё/g,'е');
$('#glossary').innerHTML=spaces.map(s=>`<details data-id="${s.id}"><summary>${safe(s.name)} <span class="tag">${kinds[s.kind][0]}</span></summary><div class="detail">${detail(s.id)}</div></details>`).join('');
$('#filter').oninput=e=>{let count=0;const q=normal(e.target.value.trim());for(const el of $('#glossary').children){el.hidden=!normal(el.textContent).includes(q);if(!el.hidden)count++;}$('#empty').hidden=count!==0;};
$('#sourceList').innerHTML=Object.entries(sources).map(([k,[name,url]])=>`<li id="source-${k}"><a href="${url}" target="_blank" rel="noopener">${safe(name)}</a></li>`).join('');render();

