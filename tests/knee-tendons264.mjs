import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {addJointAnatomy} from '../app/src/main/assets/joint-anatomy.js';
import {addKneeTendons} from '../app/src/main/assets/knee-tendons263.js';
import {addKneeTendonReview} from '../app/src/main/assets/knee-tendons264.js';
import {kneeTendons,tendonLandmarks,tendonSources} from '../app/src/main/assets/knee-tendons264-data.js';
import {tendonTargets} from '../app/src/main/assets/knee-tendon-guide264.js';
import {annotationSlice} from '../app/src/main/assets/anatomy-regions-layer.js';
const A='app/src/main/assets/',read=n=>JSON.parse(fs.readFileSync(A+n));
globalThis.fetch=async n=>({ok:true,json:async()=>read(n)});
const D=read('knee-mri-data.json'),L=read('knee-mri-labels.json');
await addJointAnatomy('knee-mri',L);addKneeTendons(L);L.seriesIndex=D.series;
const before=new Map(D.series.flatMap(s=>s.frames.map(f=>[s.id+':'+f.annotation,structuredClone(annotationSlice(L,s,f))])));
addKneeTendonReview(L);let frames=0,newMarkers=0,sourceTendonCount=0;
const coverage={},renamed=new Set([149211,149212,149213]),ids=new Set();
for(const s of D.series)for(const f of s.frames){
 frames++;
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(A+f.src)).digest('hex'),f.sha256);
 const old=before.get(s.id+':'+f.annotation),now=annotationSlice(L,s,f);
 for(const p of old.points){const q=now.points.find(q=>q.id===p.id);assert(q,'lost original point');assert.deepEqual([q.structure,q.x,q.y,q.filter],[p.structure,p.x,p.y,p.filter]);if(!renamed.has(p.structure))assert.equal(q.name,p.name);}
 assert.deepEqual(now.regions||[],old.regions||[]);
 for(const p of now.points){
  if(p.filter===1222){sourceTendonCount++;assert(L.structureNotes[p.structure]);}
  if(p.provenance==='knee-tendon-review-2.64'){
   newMarkers++;assert(!ids.has(p.id),'marker ID collision');ids.add(p.id);assert(p.approximate);assert.equal(p.filter,1222);
   assert(p.x>=0&&p.x<f.width&&p.y>=0&&p.y<f.height);
   assert(tendonLandmarks[p.structure].rows.some(([se,an,x,y])=>se===s.sourceSeries&&an===+f.annotation&&x===p.x&&y===p.y));
   coverage[p.structure]??={};(coverage[p.structure][s.id]??=[]).push(+f.annotation);
  }
 }
}
assert.equal(frames,228);assert.equal(newMarkers,Object.values(tendonLandmarks).reduce((n,m)=>n+m.rows.length*2,0));
assert.equal(kneeTendons.length,23);assert.equal(new Set(kneeTendons.map(e=>e.id)).size,23);
const layer={data:L,slice:(f,s)=>annotationSlice(L,s,f)};
for(const e of kneeTendons){
 for(const key of ['title','origin','course','insertion','pitfall','coverage'])assert(e[key]?.length>12,e.id+' '+key);
 assert(e.refs.length);for(const key of e.refs)assert(tendonSources[key]?.url.startsWith('https://'));
 const targets=tendonTargets(layer,e);assert(targets.length,e.id+' has no valid image target');
 for(const t of targets)assert(annotationSlice(L,t.s,t.s.frames[t.index]).points.some(p=>p.id===t.p.id));
 for(const id of e.structures)assert(L.structureNotes[id]?.includes('Прикрепление:'));
 if(['medial-gastrocnemius','lateral-gastrocnemius','plantaris'].includes(e.id))assert.equal(targets.length,6,'posterior origins must be accessible in all six series');
}
for(const id of [264211,264212,264213])assert.equal(Object.keys(coverage[id]).length,6);
assert.match(kneeTendons.find(e=>e.id==='plantaris').coverage,/вне/);
assert.match(kneeTendons.find(e=>e.id==='popliteus').insertion,/мышечное/);
assert.match(kneeTendons.find(e=>e.id==='biceps-femoris').insertion,/большеберцовое/);
assert.match(kneeTendons.find(e=>e.id==='semimembranosus').pitfall,/Не входит в поверхностную/);
const count=Object.values(L.seriesSlices).flatMap(Object.values).reduce((n,s)=>n+s.points.length,0);addKneeTendonReview(L);
assert.equal(Object.values(L.seriesSlices).flatMap(Object.values).reduce((n,s)=>n+s.points.length,0),count,'augmentation must be idempotent');
const result={passed:true,frames,newMarkers,reviewedEntries:kneeTendons.length,sourceTendonCount,coverage,sourceImagesAndCoordinatesPreserved:true,anatomicalAccuracy:'Educational topographic landmarks; no independent expert validation or enthesis segmentation'};
fs.writeFileSync('review/knee-tendons-2.64-validation.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({...result,coverage:undefined}));
