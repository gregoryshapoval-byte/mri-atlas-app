import assert from 'node:assert/strict';
import fs from 'node:fs';
import {data as gg} from '../app/src/main/assets/glioneuronal-data.js';
import {data as cn} from '../app/src/main/assets/neurocytoma-data.js';
import {figures as gf} from '../app/src/main/assets/glioneuronal-figures.js';
import {figures as nf} from '../app/src/main/assets/neurocytoma-figures.js';
import {plans} from '../app/src/main/assets/brain-tumors-age.js';
for(const [name,d,f] of [['glioneuronal',gg,gf],['neurocytoma',cn,nf]]){
 const h=fs.readFileSync('app/src/main/assets/'+name+'.html','utf8');
 assert.match(h,/1.98/);assert.match(h,/Проверено 21.10.2026/);assert.match(h,/href="brain-tumors.html"/);
 assert(!/NF1|пилоцитарная астроцитома —|зрительных путей/.test(h));
 assert.deepEqual(Object.keys(f),d.features.map(x=>x.id));assert.equal(d.features.length,4);
 assert.equal(d.locations.length,4);assert.equal(d.differentials.length,4);assert.equal(d.scan.length,5);assert.equal(d.checklist.length,7);assert.equal(d.reports.length,3);
 for(const feature of d.features){assert.equal(feature.legend.length,3);assert(feature.trap.length>30);assert(h.includes('data-feature="'+feature.id+'"'));}
 for(const svg of Object.values(f)){
  assert.match(svg,/viewBox="0 0 420 300"/);assert.match(svg,/role="img" aria-label=/);
  assert(!/<script|<image|https?:\/\//.test(svg.replace('http://www.w3.org/2000/svg','')));
  for(const n of [1,2,3])assert(svg.includes('>'+n+'</text>'));
 }
 for(const report of d.reports)assert(report[1].includes('['));
}
assert.match(gg.features[0].trap,/отсутствие усиления не исключает/);
assert.match(gg.features[1].trap,/Усиление и кальцинаты возможны/);
assert.match(gg.features[2].trap,/не выводить IDH/);
assert.match(gg.features[3].trap,/не задаёт границы эпилептогенной зоны/);
assert.match(gg.scan[0][1],/1 × 1 × 1 мм, без промежутков/);
assert.match(gg.scan[1][1],/Весь мозг, 1 × 1 × 1 мм/);
assert.match(gg.scan[2][1],/Перпендикулярно.*0,4 × 0,4 × 2 мм, без промежутков/);
assert.match(gg.scan[3][0],/Gd.*SWI/);assert.match(gg.scan[4][1],/b=0 и 1000/);
const gh=fs.readFileSync('app/src/main/assets/glioneuronal.html','utf8');
assert.match(gh,/оба CNS WHO grade 1 по ткани/);assert.match(gh,/до 24 месяцев FLAIR ограничен/);assert.match(gh,/WHO CNS5 это не отдельный тип/);
assert.match(cn.features[0].trap,/Контакт не доказывает/);
assert.match(cn.features[1].trap,/не автоматически/);
assert.match(cn.features[2].trap,/Ki-67.*grade по МРТ/);
assert.match(cn.features[3].good,/оба отверстия Монро/);assert.match(cn.features[3].trap,/Односторонний блок.*асимметричную/);
assert.match(cn.scan[2][1],/b=0 и 1000.*солидной/);
assert.match(cn.scan[4][2],/нет отдельного обязательного/);
const nh=fs.readFileSync('app/src/main/assets/neurocytoma.html','utf8');
assert.match(nh,/CNS WHO grade 2 по ткани/);assert.match(nh,/Экстравентрикулярная нейроцитома — отдельный тип/);assert.match(nh,/не обязательна всем/);
assert.match(nf.monro,/M197 164L203 184 M223 164L217 184/); // paired communications; one is obscured by mass
assert(plans.child.primary.includes('glioneuronal.html'));assert(!plans.child.primary.includes('neurocytoma.html'));
assert(plans.aya.primary.includes('glioneuronal.html')&&plans.aya.primary.includes('neurocytoma.html'));
assert.equal(plans.all.primary.length,12);
console.log('PASS neuronal198: independent clinical exceptions, HARNESS geometry, ventricular anatomy/Monro, no MRI grading, age access and all eight SVG.');
