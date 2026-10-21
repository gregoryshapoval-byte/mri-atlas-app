import assert from 'node:assert/strict';
import fs from 'node:fs';
import {data} from '../app/src/main/assets/cns-lymphoma-data.js';
import {figures} from '../app/src/main/assets/cns-lymphoma-figures.js';
const html=fs.readFileSync('app/src/main/assets/cns-lymphoma.html','utf8'),hub=fs.readFileSync('app/src/main/assets/brain-tumors.html','utf8');
assert.match(hub,/href="cns-lymphoma.html"/);assert.match(hub,/Этот модуль запланирован/);
assert.deepEqual(data.features.map(f=>f.id),['solid','diffusion','atypical','surface']);
assert.deepEqual(new Set(Object.keys(figures)),new Set(data.features.map(f=>f.id)));
for(const f of data.features){assert.equal(f.legend.length,3);assert.match(figures[f.id],/viewBox="0 0 420 300"/);}
assert.match(data.features[1].good,/высокий DWI И сниженный ADC/);
assert.match(data.features[1].trap,/Универсального диагностического порога ADC\/rCBV нет/);
assert.match(data.features[2].good,/иммунодефиците.*некроз.*lymphomatosis cerebri/);
assert.match(data.features[3].trap,/Нормальная МРТ не исключает.*ликвора или глаз/);
assert.match(data.features[3].trap,/Первичную и вторичную.*не различить/);
assert.match(data.locations[3][1],/симптомах ИЛИ положительном ликворе/);
assert.equal(data.locations.length,4);assert.equal(data.differentials.length,4);assert.equal(data.checklist.length,7);assert.equal(data.reports.length,3);
for(const rows of Object.values(data.scan)){assert.equal(rows.length,5);assert.match(rows[0][1],/b=0, 500, 1000.*≥3 направления/);assert.match(rows[2][0],/T2 до \/ FLAIR после Gd/);assert.match(rows[2][1],/2D FLAIR.*AX ≤3 мм/);}
assert.match(data.scan['1.5'][0][1],/≤4 мм, без промежутков/);assert.match(data.scan['3'][0][1],/3 мм, без промежутков/);
assert.match(data.scan['1.5'][1][1],/≤1,5 мм/);assert.match(data.scan['3'][1][1],/3D 1 мм/);
assert.match(data.scan['1.5'][3][1],/AX ≤4 мм/);assert.match(data.scan['3'][3][1],/AX 3 мм/);
assert.match(data.scan['1.5'][4][1],/DCE ИЛИ DSC/);
assert.match(html,/0,1 ммоль\/кг/);assert.match(html,/4–8 минут/);assert.match(html,/14 дней/);
assert.match(html,/до начала глюкокортикоидов/);assert.match(html,/не делает биопсию заведомо бесполезной/);assert.match(html,/неотложная помощь/);
assert.match(html,/безопасность люмбальной пункции/);assert.match(html,/стереотаксическая биопсия/);
assert.match(data.reports[1][1],/первичного \/ вторичного/);assert.match(data.reports[2][1],/не исключает лимфому.*не является специфическим/);
for(const svg of Object.values(figures))assert(!/<script|<image|https?:\/\//.test(svg.replace('http://www.w3.org/2000/svg','')));
console.log('PASS lymphoma192: four schemes, typical/atypical/compartment limits, DWI AND ADC, steroids and biopsy cautions, IPCG 1.5/3T protocol, staging and cautious reports.');
