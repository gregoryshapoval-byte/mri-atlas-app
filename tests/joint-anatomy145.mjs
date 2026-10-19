import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {annotationSlice,regionGeometry} from '../app/src/main/assets/anatomy-regions-layer.js';
import {projectPoint} from '../app/src/main/assets/brain-screen-labels.js';
const A='app/src/main/assets/',read=p=>JSON.parse(fs.readFileSync(p)),audit=read('review/joint-audit-1.45.json');
assert.equal(audit.edits.length,92);let redrawn=0,removed=0;
for(const mod of ['knee-mri','shoulder-mri']){
 const old=read(A+mod+'-anatomy144.json'),now=read(A+mod+'-anatomy145.json'),D=read(A+mod+'-data.json'),L=read(A+mod+'-labels.json');Object.assign(L,{seriesSlices:now.seriesSlices,displayNames:now.displayNames,shortNames:now.shortNames});
 assert.deepEqual(now.filters,old.filters);assert.deepEqual(now.catalogNames,old.catalogNames);
 const expected=structuredClone(old.seriesSlices);
 for(const s of D.series)for(const f of s.frames){
  const e=audit.edits.filter(e=>e.module===mod&&e.series===s.id&&e.annotation===f.annotation);
  for(const edit of e){assert.equal(edit.imageSha256,f.sha256);const a=expected[s.id][f.annotation],r=a.regions.find(r=>r.structure===edit.structure);assert(r);assert.deepEqual(r.vertices,edit.before);assert.equal(r.width,edit.beforeWidth);
   if(edit.decision==='removed'){a.regions=a.regions.filter(r=>r!==a.regions.find(r=>r.structure===edit.structure));removed++}
   else {assert.equal(edit.decision,'redrawn');r.vertices=edit.after;r.width=edit.afterWidth;redrawn++}
  }
  const a=annotationSlice(L,s,f);
  if(!s.id.endsWith('_dp')){assert.deepEqual(a.points.map(p=>[p.structure,p.x,p.y]),L.slices[f.annotation].points.map(p=>[p.structure,p.x,p.y]));assert.equal(a.regions,undefined);continue}
  for(const r of a.regions){assert(r.approximate);for(const [x,y]of r.vertices)assert(x>=0&&x<f.width&&y>=0&&y<f.height);
   for(const rotation of [0,90,180,270]){const view={rotation,flipX:-1,flipY:1,zoom:3,x:50,y:-20},g=regionGeometry(r,f,view,393,600);r.vertices.forEach(([x,y],i)=>assert.deepEqual(g.vertices[i],projectPoint({x,y},f,view,393,600)))}
  }
 }
 assert.deepEqual(now.seriesSlices,expected,'No unreviewed region, source point, suppression or other frame changed');
 if(mod==='shoulder-mri')for(const [sid,ss]of Object.entries(now.seriesSlices))for(const a of Object.values(ss))for(const r of a.regions)if(r.structure===143201)assert.equal(sid,'658-contraste_dp','no sagittal U crossing metaphysis');
 console.log('PASS',mod,': audit complete; original points, unrelated ribbons and transforms preserved');
}
assert.equal(redrawn,32);assert.equal(removed,60);
// Original 1.44 regression checks authoritative source JSON hashes; foot overlay remains untouched.
console.log('PASS 92 audited ribbons: 32 redrawn, 60 removed; anatomy accuracy requires visual review, not these geometry assertions');
