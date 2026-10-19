import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {annotationSlice} from '../app/src/main/assets/anatomy-regions-layer.js';
const A='app/src/main/assets/',read=p=>JSON.parse(fs.readFileSync(p)),R=read('review/ligaments-1.46.json');let added=0,frames=0;
for(const M of R.modules){const D=read(A+M.module+'-data.json'),L=read(A+M.module+'-labels.json'),E=read(A+M.module+'-anatomy146.json');
 for(const [suffix,sha]of [['-data.json',M.sourceDataSha256],['-labels.json',M.sourceLabelsSha256]])assert.equal(crypto.createHash('sha256').update(fs.readFileSync(A+M.module+suffix)).digest('hex'),sha);
 const base=structuredClone(L);Object.assign(L,{seriesSlices:E.seriesSlices,displayNames:E.displayNames,shortNames:E.shortNames});
 for(const s of D.series)for(const [i,f]of s.frames.entries()){
  const a=annotationSlice(L,s,f);if(!/_dp(?:fs)?$/.test(s.id)){assert.deepEqual(a.points.map(p=>[p.id,p.structure,p.x,p.y,p.filter]),base.slices[f.annotation].points.map(p=>[p.id,p.structure,p.x,p.y,p.filter]));assert.equal(a.regions,undefined);continue}frames++;
  const extras=E.seriesSlices[s.id][f.annotation];const ids=extras.points.map(p=>p.structure);assert.equal(ids.length,new Set(ids).size);
  for(const p of extras.points){assert(p.approximate);assert(p.name.startsWith('≈'));assert(p.x>=0&&p.x<f.width&&p.y>=0&&p.y<f.height);assert(E.structureNotes[p.structure]);}
  for(const p of M.added.filter(p=>p.series===s.id&&p.frame===i+1)){assert.equal(p.imageSha256,f.sha256);assert(a.points.some(q=>q.structure===p.structure&&q.x===p.x&&q.y===p.y));assert.match(p.name,/ориентировочно/);added++}
  for(const p of base.slices[f.annotation].points)if(!extras.suppress.includes(p.structure))assert.deepEqual([a.points.find(q=>q.id===p.id)?.x,a.points.find(q=>q.id===p.id)?.y],[p.x,p.y]);
 }
 const wanted=M.module==='shoulder-mri'?[143202,143203,143204,143205,143206]:Object.keys(M.coverage);
 for(const id of wanted){const planes=M.coverage[id];assert.equal(Object.keys(planes).length,3);for(const ns of Object.values(planes))assert(ns.length>0,`${M.module} ${id}: missing PD plane`)}
 if(M.module==='wrist-mri')for(const c of E.catalog)assert(c.structures.length>0,`${c.id}: unlinked catalog`);
 if(M.module==='shoulder-mri'){const prior=read(A+'shoulder-mri-anatomy145.json');for(const [sid,ss]of Object.entries(E.seriesSlices))for(const [ann,a]of Object.entries(ss))assert.deepEqual(a.regions,prior.seriesSlices[sid][ann].regions,'No removed ribbon reintroduced')}
 console.log('PASS',M.module,': source unchanged, PD-only landmarks, all requested components covered in 3 planes');
}
assert.equal(added,207);assert.equal(frames,319);console.log('PASS',added,'review records;',frames,'PD frames; tests do not establish anatomical certainty');
