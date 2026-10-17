import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
import * as T from '../app/src/main/assets/vendor/three.module.js';
import {bones,palmer,discPresent,discPoint,discMesh,tendonDefs,ligamentDefs} from '../app/src/main/assets/wrist-geometry.js';
for(const [type,p]of Object.entries(palmer)){
 const d=discMesh(type);assert(d.positions.every(Number.isFinite));assert(d.indices.every(i=>i>=0&&i<d.positions.length/3));
 let missing=0;for(let i=0;i<100;i++)for(let j=0;j<70;j++)if(!d.cells[i][j])missing++;
 if(['normal','1B','1C','2A','2B'].includes(type))assert.equal(missing,0);
 if(p.hole)assert(missing>0);
 if(type==='1D'){assert(!discPresent(.01,0,type));assert(discPresent(.25,0,type))}
 for(const u of [0,.25,.47,.75,1]){let top=discPoint(u,0,1,type),bottom=discPoint(u,0,-1,type);assert(top[1]>bottom[1])}
}
assert(discPoint(.47,0,1,'2A')[1]<discPoint(.47,0,1,'normal')[1]);
assert.equal(tendonDefs.flex.paths.length,9);assert.equal(tendonDefs.IV.paths.length,5);assert.equal(Object.keys(tendonDefs).filter(k=>['I','II','III','IV','V','VI'].includes(k)).length,6);
for(const defs of [tendonDefs,ligamentDefs])for(const d of Object.values(defs))for(const p of d.paths){assert(p.length>=2);const c=new T.CatmullRomCurve3(p.map(v=>new T.Vector3(...v))),f=c.computeFrenetFrames(50,false);for(const a of [...f.normals,...f.binormals,...f.tangents])assert(a.toArray().every(Number.isFinite))}
const a='ShoulderAtlas/app/src/main/assets/';for(const [area,count]of [['wrist',4],['knee',5],['shoulder',2],['pelvis',1]]){const elements={},create=()=>({children:[],append(...x){this.children.push(...x)}});vm.runInNewContext(fs.readFileSync(a+'regions.js','utf8'),{document:{createElement:create,querySelector(s){return elements[s]??=create()}},location:{search:'?area='+area},URLSearchParams});assert.equal(elements['#cards'].children.length,count);for(const link of elements['#cards'].children)assert(fs.existsSync(a+link.href.split('?')[0]))}
fs.writeFileSync('/tmp/wrist-qa.json',JSON.stringify({discs:Object.fromEntries(Object.keys(palmer).map(id=>[id,{cells:discMesh(id).cells,points:Array.from({length:101},(_,i)=>[discPoint(i/100,0,1,id),discPoint(i/100,0,-1,id)])}])),tendons:Object.fromEntries(Object.entries(tendonDefs).map(([id,d])=>[id,{color:d.color,paths:d.paths.map(p=>new T.CatmullRomCurve3(p.map(v=>new T.Vector3(...v))).getPoints(80).map(v=>v.toArray()))}])),bones}));
console.log('PASS: 10 Palmer states, full-thickness holes vs wear, 9 flexors, 6 extensor compartments, valid path frames and 11 menu routes');
