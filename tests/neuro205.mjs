import assert from 'node:assert/strict';import fs from 'node:fs';import {regions} from '../app/src/main/assets/anatomy-regions.js';
import {data as i} from '../app/src/main/assets/brain-infections-data.js';import {data as d} from '../app/src/main/assets/demyelination-data.js';import {figures} from '../app/src/main/assets/neuro205-figures.js';
const brain=regions.find(r=>r.id==='brain');
for(const route of ['brain-infections.html','demyelination.html'])assert.equal(brain.items.filter(x=>x.url===route).length,1);
assert(!brain.items.some(x=>x.url==='multiple-sclerosis.html'));assert(d.links.some(x=>x[0]==='multiple-sclerosis.html'));
assert.deepEqual(i.features.map(x=>x.id),['abscess','cerebritis','empyema','ventriculitis','meningitis','hsv','tb','toxo','fungal','pml','ncc']);
assert.deepEqual(d.features.map(x=>x.id),['ms','nmosd','mogad','adem','tdl','balo','myelitis']);
const feature=(data,id)=>JSON.stringify(data.features.find(x=>x.id===id));
assert.match(feature(i,'abscess'),/не абсолютно специфично/);assert.match(feature(i,'abscess'),/после лечения/);
assert.match(feature(i,'meningitis'),/Нормальная МРТ не исключает/);assert.match(feature(i,'hsv'),/ПЦР/);
assert.match(feature(i,'pml'),/Отрицательная JCV-ПЦР.*не исключает/);assert.match(feature(i,'pml'),/IRIS/);
assert.match(feature(i,'ncc'),/КТ/);assert.match(feature(i,'ncc'),/Кальцинированная/);
assert.match(feature(d,'myelitis'),/≥3 смежных позвонковых сегментов/);assert.match(feature(d,'nmosd'),/Короткий очаг не исключает/);
assert.match(feature(d,'tdl'),/Ответ на стероиды не исключает лимфому/);
const criteria=JSON.stringify(d.criteria);for(const term of ['≥1 основной синдром','≥2 разных','>½','≥3 смежных','AQP4-IgG−','≥1 поддерживающий','≥1:100','≥1:10','<1:100','CBA'])assert(criteria.includes(term),term);
const ms=fs.readFileSync('app/src/main/assets/multiple-sclerosis.html','utf8');for(const term of ['≥6 CVS','&lt;10','строгое большинство','≥12 месяцев','≥50','&gt;90','κFLC'])assert(ms.includes(term),term);
for(const [name,data]of [['brain-infections',i],['demyelination',d]]){
 const html=fs.readFileSync('app/src/main/assets/'+name+'.html','utf8');assert.equal((html.match(/role="tabpanel"/g)||[]).length,5);
 for(const f of data.features){assert(html.includes('data-feature="'+f.id+'"'));assert.equal(f.legend.length,3);assert(figures[f.id].includes('<svg'));assert(!/<script|<image|https?:/.test(figures[f.id].replace('http://www.w3.org/2000/svg','')));}
 for(const [route]of data.links)assert(fs.existsSync('app/src/main/assets/'+route),route);
 assert.equal(data.scan.length,6);assert.equal(data.checklist.length,8);assert.equal(data.reports.length,5);
}
console.log('PASS neuro205: infection caveats, antibody criteria branches and thresholds, LETM units, PML/IRIS, MS Select6 and special populations, nested preserved MS route and local diagrams.');
