import assert from 'node:assert/strict';
import fs from 'node:fs';
const a='ShoulderAtlas/app/src/main/assets/';
const d=JSON.parse(fs.readFileSync(a+'wrist-mri-data.json','utf8'));
assert.equal(d.counts.mri,148);assert.equal(d.counts.views3d,61);
const expected={
 'pd-ax':['PD-SPIR','AX',44], 'pd-cor':['PD-SPIR','COR',30],
 't1-ax':['T1','AX',24], 't1-cor':['T1','COR',20], 't1-sag':['T1','SAG',30],
 'source-3d':['3D','3D',61]
};
for(const [id,[contrast,plane,count]] of Object.entries(expected)){
 const s=d.series.find(x=>x.id===id);assert(s,id);assert.equal(s.contrast,contrast);assert.equal(s.plane,plane);assert.equal(s.frames.length,count);
 for(const f of s.frames)assert(fs.existsSync(a+f.src),f.src);
}
assert.equal(d.series.filter(s=>s.group==='mri').reduce((n,s)=>n+s.frames.length,0),148);
assert.equal(d.series.filter(s=>s.group==='3d').reduce((n,s)=>n+s.frames.length,0),61);
assert(fs.readFileSync(a+'wrist-mri.html','utf8').includes('wrist-mri.js'));
console.log('wrist MRI source set OK');
