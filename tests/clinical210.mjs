import assert from 'node:assert/strict';import fs from 'node:fs';import{regions}from '../app/src/main/assets/anatomy-regions.js';import{data as e}from '../app/src/main/assets/endometriosis-data.js';import{figures}from '../app/src/main/assets/endometriosis-figures.js';import{data as m}from '../app/src/main/assets/brain-metastases-data.js';import{signalRows}from '../app/src/main/assets/brain-metastases-signals210.js';
const text=JSON.stringify(e),html=fs.readFileSync('app/src/main/assets/endometriosis.html','utf8');
assert.equal(regions.find(r=>r.id==='pelvis').items.filter(i=>i.url==='endometriosis.html').length,1);
assert.deepEqual(e.features.map(f=>f.id),['endometrioma','superficial','usl','douglas','rectovag','bowel','bladder','ureter','lateral','tube','scar','adenomyosis']);
for(const f of e.features){assert.equal(f.legend.length,3);assert.match(figures[f.id],/viewBox="0 0 420 300"/);assert(!/<script|<image|https?:\/\//.test(figures[f.id].replace('http://www.w3.org/2000/svg','')));}
assert.equal(new Set(Object.values(figures)).size,12);
for(const term of ['≤1 см','>1 см','не порог доброкачественности','не исключает поверхностный','≥2 плоскостях ИЛИ','только в одной плоскости','ниже брюшинного отражения','от нижнего края','до центра','обе почки','внутреннюю и наружную','DCE','не обязателен','специальный день']){
 assert(text.toLowerCase().includes(term.toLowerCase()),term);
}
for(const term of ['девяти тазовых и одного внетазового','несколько очагов в одном отделе','В каждом латеральном отделе','+1 за поражение влагалища','+1 за поражение треугольника','+1 за расширение мочеточника справа и +1 слева','≤2','3–4','≥5','неполном покрытии','Ноль означает'])assert(text.includes(term),term);
assert.equal(e.scan.length,6);assert.equal(e.checklist.length,8);assert.equal(e.reports.length,5);assert.deepEqual(e.tables.map(t=>t.rows.length),[4,4]);assert.match(html,/area=pelvis/);assert.match(html,/orads-mri.html/);assert.match(html,/не вычисляются/);
assert.equal(m.features.length,6);const melanoma=m.features.find(f=>f.id==='melanoma');for(const t of ['не имеют этого сочетания','до Gd','Амеланотический','SWI не разделяет','не заменяет контрастирование'])assert(JSON.stringify(melanoma).includes(t),t);
assert.equal(signalRows.length,7);for(const t of ['метгемоглобин','муцин','DWI↑ требует подтверждения ADC↓','Некроз','не доказывает абсцесс','субтракция'])assert((JSON.stringify(signalRows)+JSON.stringify(m)).includes(t),t);
console.log('PASS clinical210: signal variants/limits, actual pelvis route, complete manual dPEI modifiers/boundaries, adnexal and deep disease reporting, 12 local figures.');
