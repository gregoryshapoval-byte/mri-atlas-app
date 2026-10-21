import assert from 'node:assert/strict';import fs from 'node:fs';
import {data} from '../app/src/main/assets/small-vessel-data.js';
import {figures} from '../app/src/main/assets/small-vessel-figures.js';
import {regions} from '../app/src/main/assets/anatomy-regions.js';
const h=fs.readFileSync('app/src/main/assets/small-vessel.html','utf8');
assert.match(h,/MRI Atlas · 2.01/);assert.match(h,/Проверено21.10.2026/);
assert.equal(regions.find(r=>r.id==='brain').items[0].url,'small-vessel.html');
assert.equal(regions.flatMap(r=>r.items).filter(i=>i.url==='small-vessel.html').length,1);
assert.equal(data.features.length,7);assert.equal(Object.keys(figures).length,13);
for(const prefix of ['pvh','dwmh'])for(let i=0;i<4;i++)assert(figures[prefix+i]);
for(const f of data.features){assert.equal(f.legend.length,3);assert(h.includes('data-feature="'+f.id+'"'));if(!['pvh','dwmh'].includes(f.id))assert(figures[f.id]);}
for(const s of Object.values(figures)){assert.match(s,/viewBox="0 0 420 300"/);assert.match(s,/role="img" aria-label=/);assert(!/<script|<image/.test(s));}
const faz=h.split('id="fazekas"')[1].split('</details>')[0];assert.equal((faz.match(/<tr>/g)||[]).length,5);
for(const t of ['Нет изменений','Шапочки','шапочки','Гладкий','Начинающееся','Неровные','Крупные'])if(!['Шапочки'].includes(t))assert.match(faz,new RegExp(t,'i'));
assert.match(data.features[2].good,/STRIVE-2 допускает лакуны менее 3 мм/);assert.match(data.features[2].trap,/Размер и ободок по отдельности не отличают/);
assert.match(data.features[3].trap,/более 3 мм/);assert.match(data.features[4].trap,/minIP без исходных срезов недостаточно/);
const b=h.split('id="boston"')[1].split('</details>')[0];
for(const t of ['≥50','транзиторные фокальные','когнитивное','≥2','ИЛИ 1','&gt;20','&gt;10','Мозжечковая кровь','не считать дважды','глубоких ВМК','травму','геморрагическую трансформацию','васкулит','бессимптомных'])assert(b.includes(t),t);
assert.match(b,/не равны гистологическому диагнозу/);assert.match(b,/Любой высокий Fazekas не заменяет/);
assert.equal(data.scan.length,6);assert.match(data.scan[0][1],/1–2 мм/);assert.match(data.scan[4][1],/минимальный исследовательский набор/);
assert.equal(data.locations.length,6);assert.equal(data.differentials.length,4);assert.equal(data.checklist.length,8);assert.equal(data.reports.length,5);
assert.match(data.reports[4][1],/невозможно/);assert.match(h,/суммарный балл/);
console.log('PASS svd201: independent Fazekas 0–3, STRIVE-2 size exceptions, Boston 2.0 logic/thresholds/exclusions, scan targets and route.');
