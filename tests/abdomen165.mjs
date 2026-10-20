import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {liverSegments,liverSubsegments,segmentIVReview,addAbdomenAnatomy}from '../app/src/main/assets/abdomen-anatomy.js';
import {annotationSlice}from '../app/src/main/assets/anatomy-regions-layer.js';import{paintPoint}from '../app/src/main/assets/anatomy-colors.js';import{regions}from '../app/src/main/assets/anatomy-regions.js';
const A='app/src/main/assets/',hash=b=>crypto.createHash('sha256').update(b).digest('hex');
assert.deepEqual(liverSegments.map(s=>s.number),['I','II','III','IV','V','VI','VII','VIII']);assert.equal(new Set(liverSegments.map(s=>s.structure)).size,8);
for(const [mod,source,n,points]of [['abdomen-ct','abdomen',182,6352],['abdomen-pelvis-ct','abdominopelvic-cavity-ct',303,19840]]){
 const d=JSON.parse(fs.readFileSync(A+mod+'-data.json')),raw=fs.readFileSync(A+mod+'-labels.json'),l=JSON.parse(raw);assert.equal(d.modality,'CT');assert.equal(d.source,source);assert.equal(d.series.reduce((n,s)=>n+s.frames.length,0),n);assert.equal(Object.values(l.slices).reduce((n,s)=>n+s.points.length,0),points);
 for(const s of d.series)for(const f of s.frames){assert.equal(f.original,hash(`${source}#contraste_#images-${String(f.sourceFrame).padStart(4,'0')}.jpg`));assert.equal(hash(fs.readFileSync(A+f.src)),f.sha256);assert(l.slices[f.annotation]);}
 for(const sl of Object.values(l.slices))for(const m of sl.masks)assert(fs.existsSync(A+m.src));
 if(mod==='abdomen-ct'){
  const before=structuredClone(l);addAbdomenAnatomy(l);assert(l.filters.abdomen.find(f=>f.id===4).default);const counts=new Map();
  for(const s of d.series)for(const f of s.frames){const shown=annotationSlice(l,s,f);assert.equal(shown.points.length,before.slices[f.annotation].points.length);assert.deepEqual(shown.masks,before.slices[f.annotation].masks);
   for(let i=0;i<shown.points.length;i++){
    const p=shown.points[i],original=before.slices[f.annotation].points[i];
    for(const k of ['id','x','y','filter'])assert.equal(p[k],original[k]);
    const kind=Object.keys(segmentIVReview).find(k=>segmentIVReview[k].includes(Number(f.annotation)));
    const sub=original.structure===2893&&kind?liverSubsegments[kind==='a'?0:kind==='b'?1:2]:null;
    assert.equal(p.structure,sub?.structure??original.structure);assert.equal(p.color,sub?.color??original.color);
    if(sub){assert.equal(p.sourceStructure,2893);assert.equal(p.approximate,true);}
    const seg=liverSegments.find(s=>s.structure===original.structure);
    if(seg){const display=sub??seg;counts.set(seg.number,(counts.get(seg.number)||0)+1);assert.equal(l.numberedStructures[p.structure],display.number);assert.equal(p.shortName,'S '+display.number);assert.equal(paintPoint(p,l.filters.abdomen).color,display.color);assert(l.searchAliases[p.structure].includes('S'+display.arabic));assert.match(p.name,/^S [IV]+(?:a|b|a\/b)? · /);}
   }
  }
  assert.equal(counts.size,8);assert.equal([...counts.values()].reduce((a,b)=>a+b),312);assert.match(l.displayNames[2898],/^S V · /);assert.match(l.displayNames[2899],/^S VIII · /);assert.equal(hash(fs.readFileSync(A+mod+'-labels.json')),hash(raw));
 }
 console.log('PASS exact CT frames/points/masks',mod,n,points);
}
const area=regions.find(r=>r.id==='abdomen');assert.equal(area.items.length,2);assert(area.items.every(i=>i.type==='КТ'));assert.equal(regions.length,13);console.log('PASS all 8 Couinaud numbers, 312 unchanged source anchors/colors, corrected V/VIII, masks/default group/search, 13 areas');

const{numberPlacements}=await import('../app/src/main/assets/segment-numbers.js');const clustered=[{structure:1,sx:100,sy:100},{structure:2,sx:105,sy:104},{structure:3,sx:101,sy:99}];const positions=[...numberPlacements(clustered,393,680).values()];for(let i=0;i<positions.length;i++)for(let j=0;j<i;j++)assert(Math.abs(positions[i].x-positions[j].x)>=40||Math.abs(positions[i].y-positions[j].y)>=25);
