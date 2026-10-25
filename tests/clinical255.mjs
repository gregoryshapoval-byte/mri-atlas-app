import assert from 'node:assert/strict';import fs from 'node:fs';
import {modules,sources} from '../app/src/main/assets/clinical255-data.js';
import {regions} from '../app/src/main/assets/anatomy-regions.js';
import {searchEntries} from '../app/src/main/assets/search252-data.js';
import {prepare,search} from '../app/src/main/assets/search252-core.js';
import {splitTemplate,unresolved} from '../app/src/main/assets/report251-core.js';
let topics=0,scenarios=0;
for(const [key,m]of Object.entries(modules)){
 const menu=regions.filter(r=>r.items.some(i=>i.url===key+'.html'));assert(menu.length>=2);
 assert.equal(new Set(m.features.map(f=>f.id)).size,m.features.length);
 for(const f of m.features){topics++;assert(f.check&&f.trap&&f.refs.length);for(const id of f.refs){assert(sources[id]);assert(m.sources.includes(id));}assert(searchEntries.some(e=>e.url===key+'.html?focus255='+f.id));}
 for(const [,focus,ids]of m.scenarios){scenarios++;assert(focus&&ids.length);ids.forEach(id=>assert(m.features.some(f=>f.id===id)));}
 for(const [,text]of m.reports){const s=splitTemplate(text);assert(s.description&&s.conclusion);assert(unresolved(text));}
 for(const [route]of m.related)assert(fs.existsSync('app/src/main/assets/'+route));
 assert(m.scan.length>=6&&m.special.length);assert(m.sources.every(id=>sources[id]));
}
assert.equal(topics,25);assert.equal(scenarios,12);
const soft=modules['soft-tissue-tumors'],arthritis=modules['inflammatory-arthritis'];
assert.match(soft.urgent,/предшествовать биопсии/);assert.match(soft.special[0][1],/не граница/);
assert.match(soft.features.find(f=>f.id==='synovial-sarcoma').trap,/Малый размер/);
assert.match(soft.features.find(f=>f.id==='myxoid').trap,/высокий ADC не гарантирует/);
assert.match(arthritis.urgent,/не должна задерживать/);assert.match(arthritis.features.find(f=>f.id==='erosion').signs,/двух плоскостях/);
assert.match(arthritis.features.find(f=>f.id==='ra').trap,/односторонней/);
assert.match(arthritis.features.find(f=>f.id==='pitfalls').trap,/не формулируйте/i);
const index=prepare(searchEntries);for(const [q,p]of [['MDM2','soft-tissue-tumors.html'],['миксоидное образование','soft-tissue-tumors.html'],['воспалительные заболевания суставов','inflammatory-arthritis.html'],['псориатический','inflammatory-arthritis.html']])assert(search(index,q).slice(0,5).some(e=>e.url.startsWith(p)),q);
console.log('PASS clinical255: 25 cited topics, 12 valid scenarios, menu coverage, report placeholders, direct search links and diagnostic limitations.');
