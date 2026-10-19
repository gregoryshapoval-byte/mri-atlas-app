import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';import {regions} from '../app/src/main/assets/anatomy-regions.js';
const A='app/src/main/assets/',sha=b=>crypto.createHash('sha256').update(b).digest('hex');
// 1.57 adds optional wrist display metadata in this shared runtime; MRI/data/old overlays remain byte-protected.
const runtime157=new Set(['app/src/main/assets/anatomy-regions-layer.js','app/src/main/assets/anatomy-colors.js']);
// 1.62 allows explicit preferred guide series; normalize only that expression to protect the previous component.
// 1.58 adds three explicit colors; tests/perianal158.mjs protects all prior color entries.
for(const [p,h] of Object.entries(JSON.parse(fs.readFileSync('review/preservation-1.52.json')).existingFiles))if(!runtime157.has(p)){let bytes=fs.readFileSync(p);if(p==='app/src/main/assets/shoulder-anatomy.js')bytes=bytes.toString().replace("(layer.data.shoulderGuide.preferredSeries?layer.data.shoulderGuide.preferredSeries.includes(s.id):/_dp(?:fs)?$/.test(s.id))","/_dp(?:fs)?$/.test(s.id)");assert.equal(sha(bytes),h,'Preserved 1.51: '+p);}
for(const [mod,code,n,points] of [['hand-mri','hand-mr',280,7274],['brain-3d','brain3dmri',18,997],['knee-3d','knee',6,126]]){
 const d=JSON.parse(fs.readFileSync(A+mod+'-data.json')),l=JSON.parse(fs.readFileSync(A+mod+'-labels.json'));assert.equal(d.series.reduce((n,s)=>n+s.frames.length,0),n);assert.equal(Object.values(l.slices).reduce((n,s)=>n+s.points.length,0),points);
 for(const s of d.series)for(const f of s.frames){const contrast=mod==='hand-mri'?s.id.slice(String(s.sourceSeries).length+1):'contraste_';assert.equal(f.original,sha(`${code}#${contrast}#images-${String(f.sourceFrame).padStart(4,'0')}.jpg`));assert.equal(sha(fs.readFileSync(A+f.src)),f.sha256);assert(l.slices[f.annotation]);if(mod==='brain-3d')assert(f.sourceFrame<372,'No duplicate vascular frames or replaced ICA corrections');}
 for(const slice of Object.values(l.slices))for(const mask of slice.masks)assert(fs.existsSync(A+mask.src));for(const filter of l.filters[code])assert(fs.existsSync(A+filter.icon));console.log('PASS source images/annotations:',mod,n,points);
}
assert.equal(regions.length,12);assert.equal(regions.find(r=>r.id==='wrist').name,'Кисть и запястье');for(const [area,url] of [['wrist','hand-mri.html'],['brain','brain-3d.html?set=vascular'],['knee','knee-3d.html?set=vascular']])assert(regions.find(r=>r.id===area).items.some(i=>i.url===url));
console.log('PASS preserved all 1.51 images, source metadata, labels and overlays; compact home retains 12 cards after moving the plexus into shoulder in1.63');
