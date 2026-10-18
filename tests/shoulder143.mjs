import assert from 'node:assert/strict';import fs from 'node:fs';
import {annotationSlice,regionGeometry} from '../app/src/main/assets/anatomy-regions-layer.js';
import {projectPoint} from '../app/src/main/assets/brain-screen-labels.js';
import {classifyPoint} from '../app/src/main/assets/anatomy-colors.js';
const A='app/src/main/assets/',D=JSON.parse(fs.readFileSync(A+'shoulder-mri-data.json')),L=JSON.parse(fs.readFileSync(A+'shoulder-mri-labels.json')),E=JSON.parse(fs.readFileSync(A+'shoulder-pd-anatomy.json'));Object.assign(L,{seriesSlices:E.seriesSlices,displayNames:E.displayNames});
let regions=0,points=0;const coverage={};
for(const s of D.series){for(const f of s.frames){const a=annotationSlice(L,s,f),base=L.slices[f.annotation];
 if(!s.id.endsWith('_dp')){assert.deepEqual(a.points.map(({name,...p})=>p),base.points.map(({name,...p})=>p));assert.equal(a.regions,undefined);continue}
 assert(!a.points.some(p=>[2380,2384].includes(p.structure)),'bursae are never point markers on PD');
 const seen=new Set();for(const r of a.regions){regions++;assert(r.approximate);assert(r.vertices.length>=3);assert(r.width>0&&r.width<=5);assert(!seen.has(r.structure));seen.add(r.structure);assert(E.structureNotes[r.structure]);
  (coverage[s.sourceSeries]??={})[r.structure]=((coverage[s.sourceSeries]||{})[r.structure]||0)+1;
  for(const [x,y]of r.vertices){assert(x>=0&&x<f.width&&y>=0&&y<f.height)}
  for(const rotation of [0,90,180,270])for(const flipX of [1,-1])for(const flipY of [1,-1]){
   const v={rotation,flipX,flipY,zoom:3.1,x:28,y:-44},g=regionGeometry(r,f,v,393,600);
   for(let i=0;i<r.vertices.length;i++)assert.deepEqual(g.vertices[i],projectPoint({x:r.vertices[i][0],y:r.vertices[i][1]},f,v,393,600));
   assert(g.width>0);
  }
 }
 for(const p of a.points.filter(p=>p.structure>=143200)){points++;assert(p.approximate);assert.equal(classifyPoint(p,[]),'ligaments')}
}}
for(const [se,c]of Object.entries(coverage))for(const sid of [143101,143102,143103,143201])assert(c[sid]>=3,`${se} ${sid} covers multiple slices`);
assert.equal(regions,76);assert.equal(points,41);for(const sid of [9863,9864,9865,1596,1601,1604,1605,1620,1621,1597])assert(E.structureNotes[sid].length>100);
console.log('PASS shoulder: PD-only, 76 approximate ribbons, 41 component landmarks, three planes, source-coordinate transforms, no duplicate bursal dots');
