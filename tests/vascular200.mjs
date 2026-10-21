import assert from 'node:assert/strict';import fs from 'node:fs';
import {data} from '../app/src/main/assets/vascular-malformations-data.js';
import {figures} from '../app/src/main/assets/vascular-malformations-figures.js';
import {regions} from '../app/src/main/assets/anatomy-regions.js';
const h=fs.readFileSync('app/src/main/assets/vascular-malformations.html','utf8');
assert.match(h,/MRI Atlas · 2.00/);assert.match(h,/href="region.html\?area=brain"/);assert.match(h,/Проверено21.10.2026/);
assert(!/ECASS|PH1|PH2|ageGuide|htGuide|ишемия.*давность.*кровь/i.test(h));
const brain=regions.find(r=>r.id==='brain');assert.equal(brain.items.filter(i=>i.url!=='small-vessel.html')[0].url,'stroke.html');assert.equal(brain.items.filter(i=>i.url!=='small-vessel.html')[1].url,'vascular-malformations.html');assert.equal(regions.flatMap(r=>r.items).filter(i=>i.url==='vascular-malformations.html').length,1);
assert.deepEqual(Object.keys(figures),['cavernoma','telangiectasia','dva','combined','avm','davf']);assert.deepEqual(data.features.map(x=>x.id),Object.keys(figures));
assert.equal(data.locations.length,6);assert.equal(data.scan.length,6);assert.equal(data.checklist.length,8);assert.equal(data.reports.length,5);assert.equal(data.differentials.length,4);
for(const f of data.features){assert.equal(f.legend.length,3);assert(h.includes('data-feature="'+f.id+'"'));assert(f.trap.length>45);}
for(const s of Object.values(figures)){assert.match(s,/viewBox="0 0 420 300"/);assert.match(s,/role="img" aria-label=/);assert(!/<script|<image|https?:\/\//.test(s.replace('http://www.w3.org/2000/svg','')));for(const n of [1,2,3])assert(s.includes('>'+n+'</text>'));}
assert.match(data.features[0].trap,/блуминг не равен.*Один точечный SWI-очаг не подтверждает/);
assert.match(data.features[1].trap,/дезоксигемоглобином, не обязательно с кровоизлиянием/);
assert.match(data.features[2].trap,/дренирует нормальный мозг.*поиска каверномы, тромбоза/);
assert.match(data.features[3].trap,/не автоматически семейная форма/);
assert.match(data.features[4].trap,/Одна расширенная вена не доказывает/);assert.match(data.features[5].trap,/не исключает dAVF.*ДСА.*ложноположительные/);
for(const [id,n]of [['zabramski',4],['spetzler',3],['borden',3]]){const part=h.split('id="'+id+'"')[1].split('</details>')[0];assert.equal((part.match(/<tr>/g)||[]).length,n+1);}
assert.match(h,/&lt;3см|<3см/);assert.match(h,/3–6см включительно →2/);assert.match(h,/>6см →3/);assert.match(h,/любой глубокий компонент →1/);assert.match(h,/Сумма1–5 → степениI–V/);assert.match(h,/не вероятность разрыва/);
assert.match(h,/IV.*не видны на стандартных T1\/T2/);assert.match(h,/без коркового венозного рефлюкса/);assert.match(h,/с ретроградным оттоком/);assert.match(h,/без промежуточного синусного дренажа/);
assert.match(data.scan[1][0],/SWI \/ SWAN/);assert.match(data.scan[1][1],/minIP как дополнение/);assert.match(data.scan[3][2],/Gd не обязателен при каждом контроле/);assert.match(data.scan[5][2],/ДСА не требуется рутинно/);
assert.match(h,/Единого обязательного интервала контроля/);assert.match(h,/не являются АВ-шунтом/);
for(const label of ['Дорсально','SWI · вставка','Вентрально'])assert(figures.telangiectasia.includes(label));assert.match(figures.davf,/M217 89Q215 116 244 139L249 154/);assert.match(figures.dva,/Медуллярные вены → коллектор → синус/);
console.log('PASS vascular200: cavernoma/telangiectasia/DVA vs shunts, venous preservation, all Zabramski/SM/Borden criteria and size boundaries, six schemes, selective Gd/DSA and brain integration.');
