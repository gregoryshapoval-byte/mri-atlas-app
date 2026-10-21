import assert from 'node:assert/strict';import fs from 'node:fs';
import {data}from '../app/src/main/assets/atrophy-data.js';import{figures}from '../app/src/main/assets/atrophy-figures.js';import{regions}from '../app/src/main/assets/anatomy-regions.js';
const h=fs.readFileSync('app/src/main/assets/atrophy.html','utf8');
assert.match(h,/MRI Atlas · 2.02/);assert.match(h,/Проверено21.10.2026/);assert.match(h,/href="region.html\?area=brain"/);
assert.equal(regions.find(r=>r.id==='brain').items[0].url,'small-vessel.html');assert.equal(regions.find(r=>r.id==='brain').items[1].url,'atrophy.html');assert.equal(regions.flatMap(r=>r.items).filter(i=>i.url==='atrophy.html').length,1);
assert.deepEqual(data.features.map(f=>f.id),['mta','gca','pa','ad','ftld','vascular']);assert.equal(Object.keys(figures).length,16);
for(const[id,n]of [['mta',5],['gca',4],['pa',4]])for(let i=0;i<n;i++)assert(figures[id+i]);
for(const s of Object.values(figures)){assert.match(s,/viewBox="0 0 420 300"/);assert.match(s,/role="img" aria-label=/);assert(!/<script|<image/.test(s));}
for(const id of ['mta0','mta4']){assert.match(figures[id],/Медиально/);assert.match(figures[id],/Латерально/);}
for(const id of ['pa0','pa1','pa2','pa3'])for(const view of ['SAG','COR','AX'])assert(figures[id].includes(view));
for(const [id,n]of [['mtaScale',5],['gcaScale',4],['paScale',4]]){const t=h.split('id="'+id+'"')[1].split('</details>')[0];assert.equal((t.match(/<tr>/g)||[]).length,n+1);assert(t.includes('data-label='));}
assert.match(h,/до75лет.*MTA≥2.*с75лет.*MTA≥3/);assert.match(h,/хотя бы с одной стороны/);assert.match(h,/нельзя смешивать/);assert.match(h,/наибольшая убедительная степень, не среднее/);
assert.match(data.features[0].good,/справа и слева.*отдельно/);assert.match(data.features[0].trap,/не специфична/);assert.match(data.features[1].trap,/13зон.*0–39/);
assert.match(data.features[3].trap,/не подтверждает биологическую/);assert.match(data.features[4].trap,/функциональное снижение/);assert.match(data.features[5].trap,/не устанавливает сосудистую деменцию/);
assert.equal(data.locations.length,6);assert.equal(data.scan.length,6);assert.equal(data.differentials.length,5);assert.equal(data.reports.length,5);assert.equal(data.checklist.length,8);
assert.match(data.scan[0][1],/перпендикуляр|поперёк/);assert.match(data.scan[4][1],/Gd рутинно не обязателен/);assert.match(data.scan[5][1],/контроль сегментации/);assert.match(data.reports[4][1],/не исключает раннее/);
assert(!/id="boston"|id="fazekas"|Zabramski|Spetzler/.test(h));
console.log('PASS atrophy202: all MTA/GCA/Koedam grades, side vs mean and age75 limits, three-plane PA, non-specificity, protocol, report and route.');
