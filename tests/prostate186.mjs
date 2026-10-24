import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const ctx={};vm.runInNewContext(fs.readFileSync('app/src/main/assets/prostate-sectors186.js','utf8'),ctx);
const d=ctx.ProstateSectors186,ids=d.sectors.map(s=>s.id);
assert.equal(ids.length,41);assert.equal(new Set(ids).size,41);
const expected={base:['PZa','PZpl','PZpm','TZa','TZp','AFS','CZ'],mid:['PZa','PZpl','PZpm','TZa','TZp','AFS'],apex:['PZa','PZpl','PZpm','TZa','TZp','AFS']};
for(const [level,codes]of Object.entries(expected)){
 const rows=d.sectors.filter(s=>s.level===level);assert.equal(rows.length,codes.length*2);
 for(const side of ['R','L'])assert.deepEqual(Array.from(rows.filter(s=>s.side===side),s=>s.code).sort(),codes.slice().sort());
 const svg=d.figures[level];assert.equal((svg.match(/data-sector=/g)||[]).length,rows.length);
 for(const s of rows){assert(svg.includes('data-sector="'+s.id+'"'));assert(s.location.includes(s.name));assert(s.location.includes(s.side==='R'?'справа':'слева'));}
 assert(svg.includes('>R</text>')&&svg.includes('>L</text>'));
}
assert.equal(d.sectors.filter(s=>s.code==='CZ').length,2);
assert.equal(d.sectors.filter(s=>s.code==='SV').length,2);
assert.equal(d.sectors.filter(s=>s.code==='US').length,1);
assert(ids.includes('RX-PZpl')&&ids.includes('LX-TZp'));
const map={'PZa':'передний сектор периферической','PZpl':'заднелатеральный','PZpm':'заднемедиальный','TZa':'передний сектор переходной','TZp':'задний сектор переходной'};
for(const [code,name]of Object.entries(map))assert(d.legend.find(s=>s.code===code).name.includes(name));
await import('./prostate185.mjs');
console.log('PASS sectors186: exact 14+12+12+3 region set, bilateral names, base CZ only, SV/US, RX/LX codes, and original PI-RADS rules.');
