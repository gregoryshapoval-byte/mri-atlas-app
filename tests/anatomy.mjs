import assert from 'node:assert/strict';
import fs from 'node:fs';
import {types,outer,inner,surface,cutFace,sampleSection} from '../app/src/main/assets/fibroids-geometry.js';
import {presets,femurMesh,patellaMesh,sectionSegments,frontAt,widthAt} from '../app/src/main/assets/patellofemoral-geometry.js';
const inEllipse=(p,kind,id)=>{const [w,d]=kind==='outer'?outer(p[1]):inner(p[1],id);return w>0&&d>0&&(p[0]/w)**2+(p[2]/d)**2<1};
const samples=(t)=>{const a=[];for(let i=0;i<10000;i++){let z=1-2*(i+.5)/10000,phi=i*2.39996323,r=Math.sqrt(1-z*z);a.push([t.position[0]+t.r*r*Math.cos(phi),t.position[1]+t.r*z,t.r*r*Math.sin(phi)])}return a};
for(const [id,t]of Object.entries(types)){
 for(const d of [surface('outer',id),surface('inner',id),surface('endoOuter',id),cutFace(id)]){assert(d.positions.every(Number.isFinite));assert(d.indices.every(i=>i>=0&&i<d.positions.length/3))}
 let pts=samples(t),cavity=pts.filter(p=>inEllipse(p,'inner',id)).length,external=pts.filter(p=>!inEllipse(p,'outer',id)).length;
 if(id==='0')assert.equal(cavity,pts.length,'type0 wholly intracavitary');
 if(['3','4'].includes(id)){assert.equal(cavity,0,id+' does not enter cavity');assert.equal(external,0,id+' does not cross serosa')}
 if(['1','2'].includes(id)){assert(cavity>0&&cavity<pts.length);assert.equal(external,0)}
 if(['5','6'].includes(id)){assert(external>0&&external<pts.length);assert.equal(cavity,0)}
 if(id==='7')assert.equal(external,pts.length);
 if(id==='2-5')assert(external>0&&cavity>0);
 console.log('FIGO',id,'surface cavity/external fractions',cavity/pts.length,external/pts.length);
}
for(const [id,s]of Object.entries(presets)){
 const f=femurMesh(s.flat),p=patellaMesh(s);for(const d of [f,p]){assert(d.positions.every(Number.isFinite));assert(d.indices.every(i=>i>=0&&i<d.positions.length/3))}
 for(let i=0;i<p.positions.length;i+=3){let [x,y,z]=p.positions.slice(i,i+3);if(y>=-.12&&y<=2.33&&Math.abs(x)<=widthAt(y))assert(z-frontAt(x,y,s.flat)>.119)}
 if(id==='alta'){assert.equal(sectionSegments(p,.95).length,0);assert(sectionSegments(p,1.95).length>0)}
 if(id==='normal')assert(sectionSegments(p,.95).length>0);
}
const root=new URL('../app/src/main/assets/',import.meta.url);for(const name of fs.readdirSync(root).filter(n=>n.endsWith('.html'))){let s=fs.readFileSync(new URL(name,root),'utf8');for(const m of s.matchAll(/(?:src|href)="([^"#]+)"/g)){let ref=m[1].split('?')[0];if(!ref.startsWith('https:'))assert(fs.existsSync(new URL(ref,root)),name+': '+ref)}}
console.log('PASS: anatomy boundaries, valid meshes, patella clearance, moving slice and local HTML links');
fs.writeFileSync('/tmp/atlas-qa.json',JSON.stringify({uterus:Object.fromEntries(['0','2','3','4','5','7','8','2-5'].map(id=>[id,sampleSection(id)])),patella:Object.fromEntries(Object.entries(presets).map(([id,s])=>[id,{f:sectionSegments(femurMesh(s.flat),.95),p:sectionSegments(patellaMesh(s),.95)}]))}));
