import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {annotationSlice} from '../app/src/main/assets/anatomy-regions-layer.js';
import {addJointAnatomy} from '../app/src/main/assets/joint-anatomy.js';
const A='app/src/main/assets/',read=p=>JSON.parse(fs.readFileSync(p)),D=read(A+'hip-mri-data.json'),L=read(A+'hip-mri-labels.json'),E=read(A+'hip-mri-anatomy147.json'),R=read('review/hip-1.47.json');
for(const [suffix,sha]of [['-data.json',R.sourceDataSha256],['-labels.json',R.sourceLabelsSha256]])assert.equal(crypto.createHash('sha256').update(fs.readFileSync(A+'hip-mri'+suffix)).digest('hex'),sha);
const original=structuredClone(L);globalThis.fetch=async()=>({ok:true,json:async()=>structuredClone(E)});await addJointAnatomy('hip-mri',L);
for(const f of E.filters){assert(L.filters['hip-mri-3d'].some(q=>q.id===f.id&&q.default));assert(fs.existsSync(A+f.icon))}
let frames=0,count=0;const seen=new Set();
for(const s of D.series)for(const [i,f]of s.frames.entries()){
 const a=annotationSlice(L,s,f),base=original.slices[f.annotation].points;
 if(!/_dp(?:fs)?$/.test(s.id)){assert.deepEqual(a.points.map(p=>[p.id,p.structure,p.x,p.y,p.filter]),base.map(p=>[p.id,p.structure,p.x,p.y,p.filter]));continue}frames++;
 const e=E.seriesSlices[s.id][f.annotation];assert.equal(new Set(e.points.map(p=>p.structure)).size,e.points.length);
 for(const p of e.points){assert(!seen.has(p.id));seen.add(p.id);assert(p.approximate);assert.match(p.name,/^≈ .*ориентировочно$/);assert(p.x>0&&p.x<f.width&&p.y>0&&p.y<f.height);assert(E.structureNotes[p.structure]);assert.equal(p.category,p.filter===14701?'ligaments':'cartilage');assert(a.points.some(q=>q.id===p.id&&q.x===p.x&&q.y===p.y));count++}
 for(const p of base)if(!e.suppress.includes(p.structure))assert.deepEqual(a.points.find(q=>q.id===p.id),p);
 assert.deepEqual(e.points.map(p=>[p.structure,p.x,p.y]),R.added.filter(p=>p.series===s.id&&p.frame===i+1).sort((a,b)=>a.structure-b.structure).map(p=>{assert.equal(p.imageSha256,f.sha256);return[p.structure,p.x,p.y]}));
}
for(let id=147101;id<=147107;id++)for(const ns of Object.values(R.coverage[id]))assert(ns.length>=3,'Each insertion has adjacent slices in all 3 PD planes');
for(const [title,ids]of E.guideChapters)for(const id of ids)assert(R.added.some(p=>p.structure===id),title);
assert.equal(frames,126);assert.equal(count,90);assert.equal(Object.keys(R.coverage).length,13);
console.log('PASS hip: 90 approximate landmarks, 13 structures, 126 PD frames; sources/T1/3D unchanged. Geometry checks do not establish anatomical certainty.');
