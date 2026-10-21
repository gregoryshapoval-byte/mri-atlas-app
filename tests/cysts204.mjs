import assert from 'node:assert/strict';import fs from 'node:fs';
import{data}from '../app/src/main/assets/brain-cysts-data.js';import{figures}from '../app/src/main/assets/brain-cysts-figures.js';import{regions}from '../app/src/main/assets/anatomy-regions.js';
const h=fs.readFileSync('app/src/main/assets/brain-cysts.html','utf8');
assert.match(h,/MRI Atlas · 2.04/);assert.match(h,/Проверено 21.10.2026/);assert.match(h,/href="region.html\?area=brain"/);
const urls=regions.find(r=>r.id==='brain').items.map(x=>x.url);assert.deepEqual(urls.slice(0,4),['small-vessel.html','atrophy.html','csf-disorders.html','brain-cysts.html']);assert.equal(regions.flatMap(r=>r.items).filter(i=>i.url==='brain-cysts.html').length,1);
assert.deepEqual(data.features.map(x=>x.id),['arachnoid','pineal','pvs','fissure','mega','epidermoid','colloid','dermoid','neuroglial','porencephaly']);assert.deepEqual(Object.keys(figures),data.features.map(x=>x.id));
for(const f of data.features){assert.equal(f.legend.length,3);assert(h.includes('data-feature="'+f.id+'"'));assert.match(figures[f.id],/viewBox="0 0 420 300"/);assert.match(figures[f.id],/role="img" aria-label=/);assert(!/<script|<image/.test(figures[f.id]));}
const f=Object.fromEntries(data.features.map(x=>[x.id,x]));
assert.match(f.epidermoid.good,/ADC ниже ликвора/);assert.match(f.epidermoid.trap,/не обязан быть ниже белого вещества.*shine-through.*без ADC/);assert.match(f.dermoid.trap,/не подавляются как жир/);assert.match(f.pvs.trap,/гидроцефалию.*глиоз/);assert.match(f.pineal.trap,/сами по себе не доказывают опухоль/);assert.match(f.colloid.legend[1],/проверить оба/);assert.match(f.neuroglial.trap,/Точную выстилку по МРТ не установить/);assert.match(f.porencephaly.trap,/Сообщение и глиоз не обязательны/);
for(const[id,n]of [['signalTable',6],['posteriorTable',4],['followTable',3]]){const t=h.split('id="'+id+'"')[1].split('</details>')[0];assert.equal((t.match(/<tr>/g)||[]).length,n+1);}
assert.match(h,/Размер задней ямки и высокое положение стока синусов не обязательны/);assert.match(h,/CCRS, Galassi.*не рассчитываются/);assert.match(h,/Без контраста не писать/);assert.match(h,/универсальные TR\/TE/);
assert.equal(data.scan.length,6);assert.equal(data.locations.length,7);assert.equal(data.differentials.length,6);assert.equal(data.checklist.length,8);assert.equal(data.reports.length,6);assert.match(data.scan[1][1],/ADC обязателен/);assert.match(data.scan[4][2],/не требует Gd автоматически/);
for(const u of ['csf-disorders.html','small-vessel.html','brain-tumors.html'])assert(h.includes('href="'+u+'"'));
console.log('PASS cysts204: ten types, discriminating DWI/ADC/fat/FLAIR criteria, posterior-fossa distinctions, scan quality, uncertainty and preserved menu order.');
