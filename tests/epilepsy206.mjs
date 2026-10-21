import assert from 'node:assert/strict';import fs from 'node:fs';import {data}from '../app/src/main/assets/epilepsy-data.js';import {figures}from '../app/src/main/assets/epilepsy-figures.js';import{regions}from '../app/src/main/assets/anatomy-regions.js';
const root='app/src/main/assets/',h=fs.readFileSync(root+'epilepsy.html','utf8'),f=Object.fromEntries(data.features.map(x=>[x.id,x]));
assert.deepEqual(data.features.map(x=>x.id),['hs','fcd','leat','scar','encephalocele','heterotopia','pmg','schiz','tuber','hamartoma','periictal','himal']);assert.equal(Object.keys(figures).length,12);
assert.match(f.hs.trap,/Одна асимметрия.*недостаточны/);assert.match(f.hs.trap,/двусторонний/);assert.match(f.fcd.trap,/не заменяет гистологию/);assert.match(f.fcd.good,/дне борозды/);
assert.match(f.schiz.good,/выстилкой серым веществом/);assert.match(f.encephalocele.trap,/бессимптомным/);assert.match(f.himal.trap,/не доказывает склероз или эпилептогенность/);assert.match(f.periictal.trap,/не всегда полностью/);assert.match(f.tuber.trap,/Не каждый тубер/);
const scan=JSON.stringify(data.scan);for(const s of ['1×1×1 мм','0,4×0,4×2 мм','перпендикулярно','не изотропный','Gd не обязателен','<24 месяцев','ILAE 2026','1,5 Т'])assert(scan.includes(s),s);
assert.equal(data.reports.length,6);assert.equal(data.checklist.length,8);assert.equal(data.locations.length,6);assert.equal(data.scan.length,6);assert.equal(data.differentials.length,6);
assert(data.reports.at(-1)[1].includes('не исключает эпилепсию'));assert.equal(regions.find(r=>r.id==='brain').items.filter(x=>x.url==='epilepsy.html').length,1);
for(const x of data.features){assert(h.includes('data-feature="'+x.id+'"'));assert.equal(x.legend.length,3);assert.match(figures[x.id],/role="img" aria-label=/);assert(!/<script|<image/.test(figures[x.id]));}
// Validate actual HTML links, including the related-route bug found in the prior page.
for(const page of ['epilepsy.html','brain-infections.html'])for(const match of fs.readFileSync(root+page,'utf8').matchAll(/href="([^"#]+)"/g)){const route=match[1];if(!route.startsWith('http'))assert(fs.existsSync(root+route.split('?')[0]),page+' '+route);}
console.log('PASS epilepsy206: HS/FCD limits, gray-lined cleft, HIMAL/TE causality caveats, peri-ictal reversibility limits, HARNESS geometry/age/Gd, 12 diagrams and real local routes.');
