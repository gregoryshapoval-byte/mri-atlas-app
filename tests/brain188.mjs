import assert from 'node:assert/strict';
import fs from 'node:fs';
import {regions} from '../app/src/main/assets/anatomy-regions.js';
import {data} from '../app/src/main/assets/glioblastoma-data.js';
import {figures} from '../app/src/main/assets/glioblastoma-figures.js';
const brain=regions.find(r=>r.id==='brain');
assert.equal(brain.items.filter(i=>i.url==='brain-tumors.html').length,1);
const hub=fs.readFileSync('app/src/main/assets/brain-tumors.html','utf8'),html=fs.readFileSync('app/src/main/assets/glioblastoma.html','utf8');
assert.match(hub,/href="glioblastoma.html"/);assert.match(hub,/запланированы/);
assert.deepEqual(data.features.map(f=>f.id),['layers','spread','diffusion','perfusion']);
for(const f of data.features){assert.equal(f.legend.length,3);assert.ok(figures[f.id]?.includes('viewBox="0 0 420 300"'));assert.ok(f.trap.length>35);}
assert.match(data.features[0].trap,/отёк и инфильтрацию нельзя/);
assert.match(html,/IDH-wildtype/);assert.match(html,/IDH-mutant/);assert.match(html,/не определяют/);
assert.equal(data.differentials.length,4);assert.equal(data.scan.length,5);
assert.match(data.scan[4][1],/4–8/);assert.match(data.scan[2][1],/ADC|0, 500, 1000/);
assert.match(html,/0,1 ммоль\/кг/);assert.match(html,/5 мм/);
assert.match(data.reports[1][1],/подозрительного.*верификации/s);
assert.ok(data.checklist.some(s=>s.includes('гидроцефалия')));
assert.ok(data.checklist.some(s=>s.includes('эпендимального')));
assert.equal(data.reports.length,3);
for(const svg of Object.values(figures)){assert(!/<script|<image|https?:\/\//.test(svg.replace('http://www.w3.org/2000/svg','')));}
console.log('PASS brain188: route, planned destinations, GBM diagnostic limits, matched legends, protocol boundary values and reporting coverage.');

