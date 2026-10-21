import assert from 'node:assert/strict';
import fs from 'node:fs';
import {data} from '../app/src/main/assets/brain-metastases-data.js';
import {figures} from '../app/src/main/assets/brain-metastases-figures.js';
const html=fs.readFileSync('app/src/main/assets/brain-metastases.html','utf8'),hub=fs.readFileSync('app/src/main/assets/brain-tumors.html','utf8');
assert.match(hub,/href="brain-metastases.html"/);assert.match(hub,/Этот модуль запланирован/);
assert.deepEqual(data.features.map(x=>x.id),['single','multiple','blood','lepto','dural']);
for(const f of data.features){assert.equal(f.legend.length,3);assert.match(figures[f.id],/viewBox="0 0 420 300"/);assert(f.trap.length>30);}
for(const f of Object.values(figures))assert(!/<script|<image|https?:\/\//.test(f.replace('http://www.w3.org/2000/svg','')));
assert.match(data.features.find(f=>f.id==='lepto').trap,/МРТ не исключает/);
assert.match(data.features.find(f=>f.id==='blood').trap,/не равна усилению/);
assert.match(data.features.find(f=>f.id==='dural').trap,/не специфичен/);
assert.deepEqual(Object.keys(data.scan),['3','1.5']); // JS orders integer-like keys first.
assert.match(data.scan['1.5'][0][1],/≤1,5 мм/);
assert.match(data.scan['3'][0][1],/1 мм/);
assert.match(data.scan['1.5'][3][1],/≤4 мм/);
assert.match(data.scan['3'][3][1],/3 мм, без промежутков/);
for(const rows of Object.values(data.scan)){assert.equal(rows.length,4);assert.match(rows[2][1],/0, 500, 1000.*≥3 направления/);}
assert.match(html,/4–8 минут/);assert.match(html,/10 минут/);assert.match(html,/≤1 мм/);assert.match(html,/≤3 мм/);
assert.match(html,/до люмбальной пункции/);assert.match(html,/0,1 ммоль\/кг/);
assert.equal(data.differentials.length,4);assert.equal(data.checklist.length,7);assert.equal(data.reports.length,3);
assert.match(data.reports[2][1],/ликворологическими/);assert.match(data.reports[2][1],/Дуральные очаги/);
console.log('PASS metastases189: five patterns and legends, 1.5/3T technical differences, separate LM timing/coverage and reporting limits.');

