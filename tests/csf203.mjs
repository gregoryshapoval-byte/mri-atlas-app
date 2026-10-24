import assert from 'node:assert/strict';import fs from 'node:fs';
import{data}from '../app/src/main/assets/csf-disorders-data.js';import{figures}from '../app/src/main/assets/csf-disorders-figures.js';import{regions}from '../app/src/main/assets/anatomy-regions.js';
const h=fs.readFileSync('app/src/main/assets/csf-disorders.html','utf8');
assert.match(h,/MRI Atlas · 2.03/);assert.match(h,/Проверено 21.10.2026/);assert.match(h,/href="region.html\?area=brain"/);
assert.equal(regions.find(r=>r.id==='brain').items[2].url,'csf-disorders.html');assert.equal(regions.flatMap(r=>r.items).filter(i=>i.url==='csf-disorders.html').length,1);
assert.deepEqual(data.features.map(x=>x.id),['obstruction','communicating','nph','exvacuo','evans','angle','low','high']);assert.deepEqual(Object.keys(figures),data.features.map(x=>x.id));
for(const f of data.features){assert.equal(f.legend.length,3);assert(h.includes('data-feature="'+f.id+'"'));}
for(const s of Object.values(figures)){assert.match(s,/viewBox="0 0 420 300"/);assert.match(s,/role="img" aria-label=/);assert(!/<script|<image/.test(s));}
for(const[id,n]of [['measurements',5],['nphCriteria',3],['pressureLimits',3]]){const t=h.split('id="'+id+'"')[1].split('</details>')[0];assert.equal((t.match(/<tr>/g)||[]).length,n+1);}
for(const t of ['более одного симптома','≤200 мм вод. ст.','нормальный состав','DESH с характерным нарушением ходьбы','либо улучшение','Объективное улучшение','после ликворошунтирующей','одного симптома недостаточно'])assert(h.includes(t),t);
assert.match(data.features[4].good,/на том же срезе/);assert.match(data.features[4].trap,/EI >0,30.*≥0,30.*ровно 0,30.*EI ≤0,30/);assert.match(data.features[5].good,/заднюю комиссуру.*перпендикулярно.*AC–PC/);assert.match(data.features[5].trap,/<90°.*не является самостоятельным/);
assert.match(data.features[1].trap,/Расширенный IV желудочек не доказывает/);assert.match(data.features[2].trap,/Отсутствие DESH не исключает/);assert.match(data.features[6].trap,/нормальное ликворное давление SIH не исключают/);assert.match(data.features[7].trap,/нужна МР- \/ КТ-венография/);
assert.equal(data.locations.length,6);assert.equal(data.scan.length,6);assert.equal(data.differentials.length,5);assert.equal(data.checklist.length,8);assert.equal(data.reports.length,5);
assert.match(data.scan[3][0],/мозг с Gd \+ весь позвоночник/);assert.match(data.scan[2][2],/не универсальный прогноз/);assert.match(h,/Интратекальный Gd не является/);
assert.match(figures.evans,/M142 105H278/);assert.match(figures.evans,/M65 151H355/);assert.match(figures.angle,/COR ⟂ AC–PC/);assert(!/Zabramski|Spetzler|id="mtaScale"/.test(h));
console.log('PASS csf203: obstruction distribution, DESH/ex-vacuo, EI boundaries/plane, callosal plane, complete Japan2021 categories, SIH/IIH limitations and protocol.');
