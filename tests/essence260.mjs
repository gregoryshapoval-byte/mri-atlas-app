import fs from 'node:fs';import assert from 'node:assert/strict';
import {essence,excluded} from '../app/src/main/assets/essence260-data.js';
import {reportRoutes} from '../app/src/main/assets/report251-catalog.js';
const root='app/src/main/assets/',pages=reportRoutes.filter(p=>!excluded.includes(p));
assert.equal(pages.length,82);
for(const p of pages){const d=essence[p.replace('.html','')];assert.ok(d,p);for(const k of ['look','key','support','nonspecific','mimic','report']){assert.equal(typeof d[k],'string',p+' '+k);assert.ok(d[k].length>15,p+' '+k);assert.ok(d[k].length<330,p+' '+k+' too verbose');}const html=fs.readFileSync(root+p,'utf8');assert.equal((html.match(/src="essence260.js"/g)||[]).length,1,p);assert.ok(html.includes('essence260.css'),p);}
const {searchEntries}=await import('../app/src/main/assets/search252-data.js');
const on=searchEntries.find(e=>e.url==='osteonecrosis.html');assert.ok(on.text.includes(essence.osteonecrosis.key));assert.ok(!on.text.includes(essence['neck-nodes'].report),'Cross-module search contamination');
const knee=searchEntries.find(e=>e.url==='knee.html');assert.ok(knee.text.includes(essence.knee.key));assert.ok(!knee.text.includes(essence.stroke.report));
assert.ok(essence.osteonecrosis.nonspecific.includes('не подтверждают'));assert.ok(essence['ankle-impingement'].nonspecific.includes('бессимптомны'));assert.ok(essence['prostate-cancer'].key.includes('зоны'));
console.log('PASS essence260: 82 summaries, all six fields, concise lengths, isolated search content.');
