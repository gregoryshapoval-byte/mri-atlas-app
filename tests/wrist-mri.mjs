import assert from 'node:assert/strict';
import fs from 'node:fs';
const a='app/src/main/assets/';
const d=JSON.parse(fs.readFileSync(a+'wrist-mri-data.json','utf8'));
const labels=JSON.parse(fs.readFileSync(a+'wrist-mri-labels.json','utf8'));
assert.deepEqual(d.series.map(s=>s.frames.length),[24,24,20,20,30,30,30,31]);
assert.equal(d.series.reduce((n,s)=>n+s.frames.length,0),209);
for(const s of d.series)for(const f of s.frames){assert(fs.existsSync(a+f.src));assert(labels.slices[f.annotation]);assert(f.width&&f.height&&f.sha256);}
assert.equal(Object.values(labels.slices).reduce((n,s)=>n+s.points.length,0),6288);
console.log('PASS: wrist series order, frame mapping and revised point count');

assert.equal(labels.catalog.length,32);
assert.equal(labels.blocks.length,2);
const filters=new Set(labels.filters['wrist-mri-3d'].map(f=>f.id));
for(const sl of Object.values(labels.slices)){
 const seen=new Set();
 for(const p of sl.points){
  assert(filters.has(p.filter),'valid filter');
  const k=[p.structure,p.x,p.y].join(':');assert(!seen.has(k),'no identical point duplicates');seen.add(k);
  if(p.provenance==='manual-region-review-1.30'){assert(p.approximate);assert(p.name.startsWith('≈'));assert(labels.structureNotes[p.structure]);}
 }
}
assert.equal(labels.catalog.filter(c=>!c.structures.length).length,10);
console.log('PASS: independent blocks, complete catalog, explicit uncertainty, valid filters and no identical duplicate points');
