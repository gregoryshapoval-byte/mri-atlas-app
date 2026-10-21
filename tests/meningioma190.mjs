import assert from 'node:assert/strict';
import fs from 'node:fs';
import {data} from '../app/src/main/assets/meningioma-data.js';
import {figures} from '../app/src/main/assets/meningioma-figures.js';
const html=fs.readFileSync('app/src/main/assets/meningioma.html','utf8'),hub=fs.readFileSync('app/src/main/assets/brain-tumors.html','utf8');
assert.match(hub,/href="meningioma.html"/);assert.match(hub,/Эти два модуля запланированы/);
assert.deepEqual(data.features.map(x=>x.id),['extra','bone','sinus','interface']);
assert.deepEqual(new Set(Object.keys(figures)),new Set(data.features.map(x=>x.id)));
for(const f of data.features){assert.equal(f.legend.length,3);assert.match(figures[f.id],/viewBox="0 0 420 300"/);}
assert.match(data.features[2].trap,/не баллы инвазии/);assert.match(data.features[2].trap,/артефактом потока/);
assert.match(data.features[3].trap,/не подтверждают.*не определяют WHO grade/);
assert.match(data.features[0].trap,/не специфичен/);assert.match(data.features[1].trap,/не доказывает инвазию/);
assert.equal(data.locations.length,4);assert.match(data.locations[2][1],/зрительные каналы.*ВСА/);
assert.equal(data.scan.length,4);assert.match(data.scan[0][1],/изотропно 1 мм/);
assert.match(html,/MRV \/ CTV/);assert.match(html,/MRA \/ CTA/);assert.match(html,/КТ кости/);
assert.equal(data.differentials.length,3);assert.equal(data.checklist.length,7);assert.equal(data.reports.length,3);
assert.match(data.reports[2][1],/контактом \/ сдавлением.*подозрением/s);
assert(!data.reports.some(r=>/WHO grade [123]/.test(r[1])));
for(const svg of Object.values(figures))assert(!/<script|<image|https?:\/\//.test(svg.replace('http://www.w3.org/2000/svg','')));
console.log('PASS meningioma190: four schemes, complete legends, sinus/grade limits, location-specific checklist, protocol and cautious reporting.');

