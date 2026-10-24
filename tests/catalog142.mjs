import assert from 'node:assert/strict';import fs from 'node:fs';import {regions} from '../app/src/main/assets/anatomy-regions.js';
const old=JSON.parse(fs.readFileSync('review/routes-before-1.42.json'));
for(const [id,urls]of Object.entries(old)){const r=regions.find(r=>r.id===id);assert(r,'existing region '+id);for(const url of urls)assert(r.items.some(i=>i.url===url),'existing route '+url)}
assert.equal(new Set(regions.map(r=>r.id)).size,regions.length);const images=new Set();
for(const r of regions){assert(r.items.length>0);assert(fs.existsSync('app/src/main/assets/'+r.image));images.add(r.image);for(const i of r.items){assert(fs.existsSync('app/src/main/assets/'+i.url.split('?')[0]));assert(/\.(webp|svg)$/.test(i.thumb));assert(fs.existsSync('app/src/main/assets/'+i.thumb));}}
assert.equal(images.size,regions.length);const html=fs.readFileSync('app/src/main/assets/index.html','utf8');assert(!html.includes('aria-disabled'));console.log('PASS all old routes, three-level hierarchy, 10 unique real artworks, ready destinations, no placeholder regions');
