import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {annotationSlice,regionGeometry} from '../app/src/main/assets/anatomy-regions-layer.js';import {projectPoint} from '../app/src/main/assets/brain-screen-labels.js';
const A='app/src/main/assets/',report=JSON.parse(fs.readFileSync('review/joint-anatomy-1.44.json'));let total=0,pdFrames=0;
for(const m of report.modules){const D=JSON.parse(fs.readFileSync(A+m.module+'-data.json')),L=JSON.parse(fs.readFileSync(A+m.module+'-labels.json')),E=JSON.parse(fs.readFileSync(A+m.module+'-anatomy144.json'));
 for(const [suffix,sha]of [['-data.json',m.sourceDataSha256],['-labels.json',m.sourceLabelsSha256]])assert.equal(crypto.createHash('sha256').update(fs.readFileSync(A+m.module+suffix)).digest('hex'),sha);
 Object.assign(L,{seriesSlices:E.seriesSlices,displayNames:E.displayNames,shortNames:E.shortNames});const definitions=new Map();let regions=0;
 for(const s of D.series)for(const f of s.frames){const base=L.slices[f.annotation],a=annotationSlice(L,s,f);
  if(!s.id.endsWith('_dp')){assert.equal(a.regions,undefined);assert.deepEqual(a.points.map(p=>[p.structure,p.x,p.y]),base.points.map(p=>[p.structure,p.x,p.y]));continue}pdFrames++;
  if(m.module==='knee-mri')assert(!a.points.some(p=>p.structure===2429),'no duplicate suprapatellar dot on PD');
  if(m.module==='shoulder-mri')assert(!a.points.some(p=>[2380,2384].includes(p.structure)));
  const seen=new Set();for(const r of a.regions){regions++;assert(r.approximate);assert(r.name.startsWith('≈'));assert(E.structureNotes[r.structure]);assert(!seen.has(r.structure));seen.add(r.structure);assert(r.vertices.length>=3);assert(r.width>=3&&r.width<=5);
   if(definitions.has(r.structure))assert.equal(definitions.get(r.structure),r.name);definitions.set(r.structure,r.name);
   for(const [x,y]of r.vertices)assert(x>=0&&x<f.width&&y>=0&&y<f.height);
   for(const rotation of [0,90,180,270])for(const flipX of [1,-1]){const v={rotation,flipX,flipY:-1,zoom:3,x:40,y:-25},g=regionGeometry(r,f,v,393,600);r.vertices.forEach(([x,y],i)=>assert.deepEqual(g.vertices[i],projectPoint({x,y},f,v,393,600)))}
  }
 }
 assert.equal(regions,m.ribbons);assert.equal(Object.keys(E.seriesSlices).length,3);assert(Object.values(m.perSeries).every(s=>s.ribbons>0));
 for(const [_,ids]of E.guideChapters)for(const id of ids)assert(E.structureNotes[id],id+' guide description');
 if(m.module==='shoulder-mri')for(const ss of Object.values(E.seriesSlices))for(const a of Object.values(ss))for(const r of a.regions)if(r.structure===143201)assert.equal(r.filter,14301,'axillary recess in shared group');
 total+=regions;console.log('PASS',m.module,regions,'PD ribbons, preserved source, explicit approximate status, valid descriptions and transforms');
}
assert.equal(pdFrames,371);assert.equal(total,238);console.log('PASS',pdFrames,'PD frames;',total,'ribbons');
