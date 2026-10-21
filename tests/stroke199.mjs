import assert from 'node:assert/strict';import fs from 'node:fs';
import {data} from '../app/src/main/assets/stroke-data.js';
import {figures} from '../app/src/main/assets/stroke-figures.js';
import {regions} from '../app/src/main/assets/anatomy-regions.js';
const h=fs.readFileSync('app/src/main/assets/stroke.html','utf8');
assert.match(h,/MRI Atlas · 1.99/);assert.match(h,/href="region.html\?area=brain"/);assert.match(h,/Проверено21.10.2026/);
assert(!/нейроцитома|Ki-67|септальн|нейроцитомного/.test(h));
const b=regions.find(r=>r.id==='brain');assert.equal(b.items.filter(i=>!['small-vessel.html','atrophy.html'].includes(i.url))[0].url,'stroke.html');assert.equal(regions.flatMap(r=>r.items).filter(i=>i.url==='stroke.html').length,1);
assert(b.items.some(i=>i.url==='brain-tumors.html'));assert(b.items.some(i=>i.url==='multiple-sclerosis.html'));
assert.deepEqual(Object.keys(figures),['ischemia','timing','mismatch','territory','hemorrhage','transformation']);assert.deepEqual(data.features.map(x=>x.id),Object.keys(figures));
assert.equal(data.locations.length,6);assert.equal(data.scan.length,6);assert.equal(data.checklist.length,8);assert.equal(data.reports.length,4);assert.equal(data.differentials.length,4);
for(const f of data.features){assert.equal(f.legend.length,3);assert(h.includes('data-feature="'+f.id+'"'));assert(f.trap.length>45);}
for(const s of Object.values(figures)){assert.match(s,/viewBox="0 0 420 300"/);assert.match(s,/role="img" aria-label=/);assert(!/<script|<image|https?:\/\//.test(s.replace('http://www.w3.org/2000/svg','')));for(const n of [1,2,3])assert(s.includes('>'+n+'</text>'));}
assert.match(data.features[0].good,/ограничение диффузии/);assert.match(data.features[0].trap,/DWI↑ без ADC↓.*не исключает ранний, малый или стволовой/);
assert.match(data.features[1].trap,/Нормальный ADC не исключает подострый/);assert.match(data.features[2].trap,/не доказывает точное время <4,5.*не равен перфузионному/);
assert.match(data.features[3].trap,/границы|Границы/);assert.match(data.features[4].trap,/блуминг завышает.*не доказывает/);
assert.match(h,/PH1.*≤30%/);assert.match(h,/PH2.*&gt;30%/);assert.match(h,/Heidelberg.*класс3a/);assert.match(h,/процент и масс-эффект не согласуются/);
for(const id of ['ageGuide','htGuide']){const section=h.split('id="'+id+'"')[1].split('</details>')[0];assert.equal((section.match(/<tr>/g)||[]).length,5);}
assert.match(h,/псевдонормализоваться/);assert.match(h,/не жёсткие|не универсальной|Нет универсальной/);assert.match(h,/не должен задерживать/);
assert.match(data.scan[0][1],/Весь мозг.*b=0 и 1000.*3–5 мм без промежутков/);assert.match(data.scan[2][1],/не только minIP/);assert.match(data.scan[3][1],/Шея — отдельное покрытие/);
assert.match(data.scan[4][2],/не взаимозаменяемы/);assert.match(data.scan[5][2],/Gd не обязателен/);assert.match(data.reports[2][1],/не исключает ранний.*инсульт/);
assert.match(figures.territory,/Перед.*Зад/);assert.match(figures.mismatch,/FLAIR/);assert.match(figures.transformation,/HI1.*HI2.*PH1.*PH2/);
console.log('PASS stroke199: source-versioned ECASS I complete criteria, ischemia/mismatch/ADC exceptions, all six diagrams, urgent MRI protocol and brain-only integration.');
