import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const x={};vm.runInNewContext(fs.readFileSync('app/src/main/assets/prostate-data.js','utf8'),x);
const d=x.ProstateAtlasData;
for(const key of ['t2Pz','t2','dwi','dwiTz']){
 assert.equal(d[key].length,5,key);
 assert.equal(d[key].map(r=>r[0]).join(','),'1,2,3,4,5');
 assert.match(d[key][3][1],/<15 мм/);assert.match(d[key][4][1],/≥15 мм/);
}
assert.match(d.t2Pz[0][1],/Однородный высокий/);
assert.match(d.t2Pz[1][1],/клиновидный.*диффузное/);
assert.match(d.t2Pz[2][1],/неотграниченный/);
assert.match(d.t2Pz[3][1],/Чётко отграниченный.*однородный.*в пределах/);
assert.match(d.t2[0][1],/полностью.*двух плоскостях/);
assert.match(d.t2[3][1],/Линзовидный или.*однородный/);
assert.match(d.dwi[2][1],/не оба одновременно/);
assert.match(d.dwi[3][1],/ADC↓ И.*DWI↑/);
assert.match(d.dwiTz[1][1],/нефокальное/);
for(const index of [0,2,3,4])assert.equal(d.dwiTz[index][1],d.dwi[index][1]);
await import('./prostate186.mjs');
console.log('PASS prostate187: all 20 sequence-score rows, exact 15mm boundary, T2 zone distinction, DWI AND/OR, TZ nonfocal caveat; all 41 sectors and 150 final-score combinations.');
