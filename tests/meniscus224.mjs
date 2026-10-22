import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {data} from '../app/src/main/assets/meniscus-data.js';
import {regions as currentRegions} from '../app/src/main/assets/anatomy-regions.js';
// Historical fixture: only the new 2.25 route is outside its snapshot.
const regions=currentRegions.map(r=>({...r,items:r.items.filter(i=>i.url!=='acl-postop.html'&&!['endometrial-cancer.html','cervical-cancer.html','ankle-ligaments.html'].includes(i.url))}));

const A='app/src/main/assets/';
for(const group of ['features','roots','mimics','postop'])for(const f of data[group]){
 assert.equal(f.legend.length,3);const s=fs.readFileSync(A+'meniscus/'+f.id+'.svg','utf8');
 for(let i=1;i<=3;i++)assert(s.includes('>'+i+'</text>'));
 assert(!/<script|<image|foreignObject/.test(s));
}
const base='003af89797638c9b98488a7169de959cee85d960';
const previous=execFileSync('git',['show',base+':'+A+'anatomy-regions.js'],{encoding:'utf8'});
const old=JSON.parse(previous.slice(previous.indexOf('[')).trim().replace(/;$/,''));
for(const r of old)for(const item of r.items)if(item.url==='knee.html')Object.assign(item,{description:'Разрывы, корни, экструзия, после операции и 3D',type:'КЛИНИЧЕСКИЙ МОДУЛЬ'});
assert.deepEqual(regions,old,'only the existing meniscus catalogue item changes');
const exceptions=new Set([A+'anatomy-regions.js',A+'index.html',A+'knee.html']);
const raw=execFileSync('git',['ls-tree','-r','--name-only',base,'app/src/main/assets'],{encoding:'utf8'});
let preserved=0;for(const file of raw.trim().split('\n'))if(!exceptions.has(file)){
 const expected=execFileSync('git',['rev-parse',base+':'+file],{encoding:'utf8'}).trim();
 const actual=execFileSync('git',['hash-object',file],{encoding:'utf8'}).trim();assert.equal(actual,expected,file);preserved++;
}
assert.equal(data.features.length,7);assert.equal(data.roots.length,3);assert.equal(data.mimics.length,3);assert.equal(data.postop.length,2);
assert.equal(data.scan.length,6);assert.equal(data.reports.length,8);
const h=fs.readFileSync(A+'knee.html','utf8');
for(const s of ['3–&lt;6','6–9','0–&lt;3','Ровно 3 мм','knee-model.html','SSR 2026','22.10.2026'])assert(h.includes(s));
const oldModel=execFileSync('git',['show',base+':'+A+'knee.html'],{encoding:'utf8'});
assert.equal(fs.readFileSync(A+'knee-model.html','utf8').replace('href="knee.html">← Мениски','href="region.html?area=knee">← Колено').replace(' Корневая зона на модели обобщена; точное расстояние оценивают на МРТ.',''),oldModel);
console.log('PASS meniscus224: 15 schemes, original 3D retained, 8 templates; old assets unchanged:',preserved);
