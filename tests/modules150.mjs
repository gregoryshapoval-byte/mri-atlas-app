import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
assert(fs.readFileSync('app/src/main/java/ru/grigory/shoulderatlas/MainActivity.java','utf8').includes('image/svg+xml'),'WebView serves SVG icons with their correct MIME');
const root='app/src/main/assets/';
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
const preserved=JSON.parse(fs.readFileSync('review/preservation-1.50.json'));
for(const [p,sha] of Object.entries(preserved.existingFiles))assert.equal(digest(fs.readFileSync(p)),sha,'Preserved from 1.49: '+p);
for(const [mod,source,frames,points,series] of [['upper-limb-mri','upper-limb',194,6235,6],['lower-limb-mri','lowerlimb',277,8439,6],['brachial-plexus-mri','Brachial-Plexus-MR',160,15560,3]]){
 const d=JSON.parse(fs.readFileSync(root+mod+'-data.json')),l=JSON.parse(fs.readFileSync(root+mod+'-labels.json'));
 assert.equal(d.source,source);assert.equal(d.series.length,series);assert.equal(d.series.reduce((n,s)=>n+s.frames.length,0),frames);assert.equal(Object.keys(l.slices).length,frames);assert.equal(Object.values(l.slices).reduce((n,s)=>n+s.points.length,0),points);
 const refs=new Set();
 for(const s of d.series){assert.equal(s.group,'multiplanar');assert.equal(s.module,source);assert(s.sourceSeries);assert(!/T1|T2|PD/.test(s.title),'No guessed sequence');
  for(const f of s.frames){assert(!refs.has(f.annotation));refs.add(f.annotation);assert.equal(f.original,digest(`${source}#contraste_#images-${String(f.sourceFrame).padStart(4,'0')}.jpg`));assert.equal(digest(fs.readFileSync(root+f.src)),f.sha256);assert(f.width>0&&f.height>0);assert(l.slices[f.annotation]);}
 }
 console.log('PASS exact new module:',mod,frames,'frames',points,'source points');
}
console.log('PASS all 1.49 MRI, labels, overlays, shared viewer and annotation code preserved');
