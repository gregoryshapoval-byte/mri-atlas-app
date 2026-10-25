import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
import {cordCases,infectionCases,sources} from '../app/src/main/assets/spine246-cases.js';import {data} from '../app/src/main/assets/spinal-cord-data.js';import {regions} from '../app/src/main/assets/anatomy-regions.js';
const A='app/src/main/assets/',manifest=JSON.parse(fs.readFileSync(A+'spine246/ATTRIBUTION.json'));
for(const c of [...cordCases,...infectionCases]){assert(sources[c.source]);const im=manifest.images.find(i=>i.file===c.file);assert(im);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(A+'spine246/'+c.file)).digest('hex'),im.sha256);assert.equal(c.layout.width,im.width);assert.equal(c.layout.height,im.height);for(const p of c.layout.panels){const [x,y,w,h]=p.box;assert(x>=0&&y>=0&&w>0&&h>0&&x+w<=im.width&&y+h<=im.height,c.id+' '+p.label);assert(p.label);}assert(c.finding&&c.check&&c.trap);}
assert.equal(cordCases.length,15);assert.equal(infectionCases.length,8);assert.equal(data.patterns.length,13);
const old=execFileSync('git',['show','HEAD:app/src/main/assets/anatomy-regions.js'],{encoding:'utf8'});const prev=JSON.parse(old.slice(old.indexOf('[')).trim().replace(/;$/,''));
for(const r of prev){const now=regions.find(n=>n.id===r.id);assert(now);for(const i of r.items){const item=now.items.find(n=>n.url===i.url);assert(item);assert.deepEqual({...item,description:i.description},i);}}
assert.equal(regions.find(r=>r.id==='spine').items.filter(i=>i.url==='spinal-cord.html').length,1);
console.log('PASS spine246: all 23 cases; source hashes and panel bounds; 13 patterns; existing routes preserved.');
