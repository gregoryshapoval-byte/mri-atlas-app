import assert from 'node:assert/strict';import fs from 'node:fs';import * as T from '../app/src/main/assets/vendor/three.module.js';
import {icaSegments,vessels,landmarks}from '../app/src/main/assets/cerebral-arteries-data.js';
assert.deepEqual(icaSegments.map(x=>x.id),['C1','C2','C3','C4','C5','C6','C7']);assert.equal(new Set(icaSegments.map(x=>x.color)).size,7);assert.equal(new Set(vessels.map(x=>x.id)).size,vessels.length);
const equal=(a,b)=>a.every((v,i)=>Math.abs(v-b[i])<1e-7),get=id=>vessels.find(v=>v.id===id);
for(const v of vessels){assert(v.points.length>=2&&v.radius>0);assert(v.points.flat().every(Number.isFinite));const curve=new T.CatmullRomCurve3(v.points.map(p=>new T.Vector3(...p)),false,'centripetal');const tube=new T.TubeGeometry(curve,32,v.radius,16,false);assert([...tube.attributes.position.array].every(Number.isFinite));assert([...tube.attributes.normal.array].every(Number.isFinite));tube.dispose();if(v.side==='L'){const other=get('R-'+v.id.slice(2));assert(other);assert.deepEqual(other.points,v.points.map(([x,y,z])=>[-x,y,z]));}}
for(const side of ['R','L']){
 for(let i=1;i<7;i++)assert(equal(get(side+'-C'+i).points.at(-1),get(side+'-C'+(i+1)).points[0]),'continuous ICA '+side);
 assert(equal(get(side+'-C7').points.at(-1),get(side+'-M1').points[0]));assert(equal(get(side+'-C7').points.at(-1),get(side+'-A1').points[0]));
 assert(equal(get(side+'-PCoA').points[0],get(side+'-C7').points[0]));assert(equal(get(side+'-PCoA').points.at(-1),get(side+'-P1').points.at(-1)));assert(equal(get(side+'-P2').points[0],get(side+'-P1').points.at(-1)));
 assert(equal(get(side+'-P1').points[0],get('BA').points.at(-1)));assert(equal(get(side+'-V4').points.at(-1),get('BA').points[0]));
 assert(equal(get(side+'-A1').points.at(-1),get('ACom').points[side==='R'?0:2]));
 // Every branch touches another vessel at a shared anatomical graph node.
 for(const v of vessels.filter(v=>v.side===side&&v.group!=='ica'&&!v.id.endsWith('-V4')))assert(vessels.some(other=>other.id!==v.id&&other.points.some(p=>equal(p,v.points[0]))),'connected branch '+v.id);
}
assert.equal(landmarks.length,3);assert(icaSegments.find(s=>s.id==='C3').note.includes('над рваным'));const html=fs.readFileSync('app/src/main/assets/cerebral-arteries.html','utf8');assert(html.includes('не является сегментацией пациента'));console.log('PASS 7 distinct ICA colors, mirrored bilateral anatomy, finite 3D surfaces, continuous C1–C7, closed Willis graph, connected branches, source disclosure');
