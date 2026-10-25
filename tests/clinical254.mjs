import assert from 'node:assert/strict';
import fs from 'node:fs';
import {modules,sources} from '../app/src/main/assets/clinical254-data.js';
import {regions} from '../app/src/main/assets/anatomy-regions.js';
import {searchEntries} from '../app/src/main/assets/search252-data.js';
import {prepare,search} from '../app/src/main/assets/search252-core.js';
import {splitTemplate,unresolved} from '../app/src/main/assets/report251-core.js';
for(const [key,m]of Object.entries(modules)){
 assert(regions.find(r=>r.id===m.areaId).items.some(i=>i.url===key+'.html'));
 assert.equal(new Set(m.features.map(f=>f.id)).size,m.features.length);
 for(const f of m.features){assert(f.check&&f.trap);assert(f.refs.length);for(const id of f.refs)assert(sources[id]);assert(searchEntries.some(e=>e.url===key+'.html?focus254='+f.id));}
 for(const [,focus,ids]of m.scenarios){assert(focus);assert(ids.length);ids.forEach(id=>assert(m.features.some(f=>f.id===id)));}
 for(const [,text]of m.reports){const s=splitTemplate(text);assert(s.description&&s.conclusion);assert(unresolved(text));}
 assert(m.urgent&&m.special.length);assert(fs.existsSync('app/src/main/assets/'+key+'.html'));
}
assert.match(modules['bladder-urethra'].intro,/не стадия TNM/);
assert.match(modules['bladder-urethra'].features.find(f=>f.id==='diverticulum').trap,/не исключает/);
assert.match(modules['orbits-optic'].features.find(f=>f.id==='sheath').trap,/не патогномоничен/);
assert.match(modules['orbits-optic'].features.find(f=>f.id==='lymphoma').trap,/порога ADC нет/);
const index=prepare(searchEntries);
for(const [q,page]of [['VI-RADS','bladder-urethra.html'],['дивертикул женской уретры','bladder-urethra.html'],['тиреоидная офтальмопатия','orbits-optic.html'],['орбитальный абсцесс','orbits-optic.html']])assert(search(index,q).slice(0,5).some(e=>e.url.startsWith(page)),q);
console.log('PASS clinical254: sources, menus, 23 direct topic links, scenarios, report placeholders and clinical limits.');
