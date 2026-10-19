import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import{annotationSlice}from'../app/src/main/assets/anatomy-regions-layer.js';import{addJointAnatomy}from'../app/src/main/assets/joint-anatomy.js';
const A='app/src/main/assets/',read=p=>JSON.parse(fs.readFileSync(p)),R=read('review/hip-knee-1.49.json');let newPoints=0,newRibbons=0,pd=0;
globalThis.fetch=async url=>({ok:true,json:async()=>read(A+url)});
for(const M of R.modules){const D=read(A+M.module+'-data.json'),L=read(A+M.module+'-labels.json'),base=structuredClone(L),E=read(A+M.module+'-anatomy149.json');await addJointAnatomy(M.module,L);
 for(const[suffix,sha]of[['-data.json',M.sourceDataSha256],['-labels.json',M.sourceLabelsSha256]])assert.equal(crypto.createHash('sha256').update(fs.readFileSync(A+M.module+suffix)).digest('hex'),sha);
 const code=D.series[0].module;assert.equal(L.filters[code].filter(f=>f.id===(M.module==='hip-mri'?14701:1222)).length,1);assert.equal(L.filters[code].find(f=>f.id===(M.module==='hip-mri'?14701:1222)).name,M.module==='hip-mri'?'Сухожилия':'Сухожилия и прикрепления');
 for(const p of Object.values(E.pointPresentation))assert.deepEqual(Object.keys(p).sort(),['category','filter']);
 for(const s of D.series)for(const[i,f]of s.frames.entries()){
  const a=annotationSlice(L,s,f),e=E.seriesSlices[s.id]?.[f.annotation];if(/_dp(?:fs)?$/.test(s.id))pd++;else{assert(!e);assert.equal(a.regions,undefined)}
  for(const p of base.slices[f.annotation].points){if(e?.suppress.includes(p.structure))continue;const q=a.points.find(q=>q.id===p.id);assert(q);assert.deepEqual([q.x,q.y,q.id,q.structure],[p.x,p.y,p.id,p.structure]);assert.equal(q.name,E.displayNames[p.structure]||p.name);if(E.pointPresentation[p.structure])assert.equal(q.filter,M.module==='hip-mri'?14701:1222)}
  if(!e)continue;assert.equal(new Set(e.points.map(p=>p.structure)).size,e.points.length);assert.equal(new Set(e.regions.map(p=>p.structure)).size,e.regions.length);
  for(const p of e.points){assert(p.x>=0&&p.y>=0&&p.x<f.width&&p.y<f.height);assert(p.approximate);assert(E.structureNotes[p.structure]);assert(a.points.some(q=>q.id===p.id&&q.x===p.x&&q.y===p.y))}
  for(const r of e.regions){assert(r.approximate);for(const[x,y]of r.vertices)assert(x>=0&&x<f.width&&y>=0&&y<f.height)}
  for(const p of M.points.filter(p=>p.series===s.id&&p.frame===i+1)){assert.equal(p.imageSha256,f.sha256);assert(e.points.some(q=>q.id===p.id));newPoints++}
  for(const r of M.ribbons.filter(p=>p.series===s.id&&p.frame===i+1)){assert.equal(r.imageSha256,f.sha256);assert.deepEqual(e.regions.find(q=>q.structure===r.structure).vertices,r.vertices);newRibbons++}
 }
 for(const planes of Object.values(M.coverage))assert(Object.values(planes).some(ns=>ns.length>=3));
 if(M.module==='hip-mri'){const old=read(A+'hip-mri-anatomy147.json');for(const[sid,ss]of Object.entries(old.seriesSlices))for(const[ann,a]of Object.entries(ss))for(const p of a.points)assert.deepEqual(E.seriesSlices[sid][ann].points.find(q=>q.id===p.id),p);assert.equal(Object.keys(E.pointPresentation).length,10)}
 else{for(let id=144201;id<=144210;id++){const n=Object.values(E.seriesSlices).flatMap(ss=>Object.values(ss)).filter(a=>a.regions.some(r=>r.structure===id)).length;assert(n>=3,`recess/bursa ${id} restored`)}const old=read(A+'knee-mri-anatomy145.json');for(const[sid,ss]of Object.entries(old.seriesSlices))for(const[ann,a]of Object.entries(ss))for(const r of a.regions)assert.deepEqual(E.seriesSlices[sid][ann].regions.find(q=>q.structure===r.structure),r)}
 console.log('PASS',M.module,': names and coordinates retained; source tendon grouping, PD additions, coverage and confidence');
}
assert.equal(newPoints,114);assert.equal(newRibbons,29);assert.equal(pd,240);
// Presentation metadata cannot move or rename anatomy, even if a future map contains such keys.
const sample={slices:{a:{points:[{id:1,structure:1,name:'original',x:10,y:20,filter:1}]}},pointPresentation:{1:{filter:2,category:'ligaments',x:999,name:'wrong'}}};assert.deepEqual(annotationSlice(sample,{id:'s'},{annotation:'a'}).points[0],{id:1,structure:1,name:'original',x:10,y:20,filter:2,category:'ligaments'});
console.log('PASS 114 new approximate landmarks, 29 restored ribbons, all 10 knee spaces, 240 PD frames; anatomy accuracy requires visual/expert review.');
