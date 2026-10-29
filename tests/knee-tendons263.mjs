import assert from 'node:assert/strict';
import fs from 'node:fs';
import {addJointAnatomy} from '../app/src/main/assets/joint-anatomy.js';
import {addKneeTendons} from '../app/src/main/assets/knee-tendons263.js';
import {annotationSlice} from '../app/src/main/assets/anatomy-regions-layer.js';
import {visiblePoints,screenLayout} from '../app/src/main/assets/brain-screen-labels.js';
const A='app/src/main/assets/',read=n=>JSON.parse(fs.readFileSync(A+n));
globalThis.fetch=async n=>({ok:true,json:async()=>read(n)});
const D=read('knee-mri-data.json'),L=read('knee-mri-labels.json');await addJointAnatomy('knee-mri',L);
const before=new Map(D.series.flatMap(s=>s.frames.map(f=>[s.id+':'+f.annotation,structuredClone(annotationSlice(L,s,f))])));
addKneeTendons(L);let frames=0,newMarkers=0,sourceTendons=0;const tendonIds=new Set();
for(const s of D.series)for(const f of s.frames){
 const old=before.get(s.id+':'+f.annotation),now=annotationSlice(L,s,f);frames++;
 assert(fs.existsSync(A+f.src));assert.equal(now.points.length-old.points.length,s.sourceSeries===652&&[17675,17676,17677,17678,17679].includes(+f.annotation)?1:0);
 for(const p of old.points){const q=now.points.find(q=>q.id===p.id);assert(q);assert.deepEqual([q.structure,q.x,q.y,q.filter],[p.structure,p.x,p.y,p.filter]);if(p.structure!==149214)assert.equal(q.name,p.name);}
 for(const p of now.points){if(p.filter===1222){sourceTendons++;tendonIds.add(p.structure);assert(L.structureNotes[p.structure]);}
  if(p.provenance==='axial-tendon-review-2.63'){newMarkers++;assert(p.approximate);assert.equal(p.filter,1222);assert(p.x<f.width&&p.y<f.height);
   for(const[w,h]of[[393,650],[360,500],[852,340]]){const view={flipX:1,flipY:1,rotation:0,x:0,y:0,zoom:1.5};const visible=visiblePoints(now.points,f,view,w,h);assert(visible.some(q=>q.id===p.id));const layout=screenLayout(visible,w,h,0,p.structure);assert(layout.labels.some(q=>q.structure===p.structure),'selected tendon must be labeled even on paginated frames');}
  }
 }
 assert.deepEqual(now.regions||[],old.regions||[]);
}
assert.equal(frames,228);assert.equal(newMarkers,10);assert(tendonIds.has(149214));
const html=fs.readFileSync(A+'source-mri-viewer.js','utf8');assert(html.includes("if(moduleName==='knee-mri')await (await import('./knee-tendons263.js'))"));
console.log(JSON.stringify({passed:true,frames,newMarkers,sourceTendons,tendonStructures:tendonIds.size,originalCoordinatesAndRegionsPreserved:true,selectedLabelVisibleAtThreeSizes:true}));
