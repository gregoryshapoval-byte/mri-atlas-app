import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {pathToFileURL,fileURLToPath} from 'node:url';import {execFileSync} from 'node:child_process';
const repo=path.dirname(path.dirname(fileURLToPath(import.meta.url))),root=path.join(repo,'build/runtime-assets');
const {searchEntries}=await import(pathToFileURL(path.join(root,'search252-data.js')));const {catalog}=await import(pathToFileURL(path.join(root,'search252-catalog.js')));const {prepare,search}=await import(pathToFileURL(path.join(root,'search252-core.js')));
const baseText=execFileSync('python3',[path.join(repo,'tools/runtime_current.py'),'--read-asset','search252-data.js'],{encoding:'utf8',maxBuffer:16*1024*1024});
const base=JSON.parse(baseText.replace(/^export const searchEntries\s*=/,'').trim().replace(/;$/,''));const byId=new Map(searchEntries.map(e=>[e.id,e]));
const routes=JSON.parse(fs.readFileSync(path.join(repo,'release-inputs/search-routes.json'),'utf8'));
assert.equal(searchEntries.length,base.length+routes.additions.length);assert.equal(byId.size,searchEntries.length);assert.deepEqual(catalog.map(e=>e.id),searchEntries.map(e=>e.id));
for(const old of base){const next=byId.get(old.id);assert(next,'Lost published destination '+old.id);for(const k of Object.keys(old)){const edit=routes.existing.find(row=>row.url===old.url);assert.deepEqual(next[k],k==='aliases'&&edit?edit.aliases:old[k],'Changed published field '+old.id+' '+k);}}
const indexed=prepare(searchEntries);
for(const [query,target]of [['PI-RR','prostate-recurrence.html'],['pirr','prostate-recurrence.html'],['пи рр','prostate-recurrence.html'],['SMART','perianal-cases.html#smart2024'],['смарт','perianal-cases.html#smart2024'],['SMART 2024','perianal-cases.html#smart2024'],['RIFIL','perianal-cases.html#smart-rifil'],['рифил','perianal-cases.html#smart-rifil'],['HOPE','perianal-cases.html#smart-hope'],['хоуп','perianal-cases.html#smart-hope'],['высота пересечения наружного сфинктера','perianal-cases.html#smart-hope']]){
 assert.equal(search(indexed,query)[0]?.url,target,query);assert.equal(search(indexed,query,'module')[0]?.url,target,'Module filter '+query);
}
assert(search(indexed,'PI-RR').some(e=>e.url.includes('case338=')),'Published PI-RR examples remain searchable');assert(search(indexed,'PI-RR','case').every(e=>['Клинический пример','Учебная схема'].includes(e.kind)));
for(const [q,target]of [['Patte','cuff.html'],['Bosniak','renal-bosniak.html'],['Fazekas','small-vessel.html'],['warthin','salivary-glands.html'],['MRF','rectal-cancer.html']])assert(search(indexed,q).slice(0,3).some(e=>e.url.startsWith(target)),q);
assert.equal(search(indexed,'___несуществующийтермин9876').length,0);assert.equal(search(indexed,'').length,0);
for(const e of catalog){assert.equal(typeof e.id,'string');assert(e.id);assert(!/^(?:https?:|\/)/.test(e.url));assert(fs.existsSync(path.join(root,e.url.split(/[?#]/)[0])),e.url);}
for(const id of ['smart2024','smart-rifil','smart-hope'])assert(fs.readFileSync(path.join(root,'perianal-cases.html'),'utf8').includes('id="'+id+'"'));
console.log('PASS current search: published destinations preserved, exact primary routes/aliases, filters, empty states and existing clinical queries.');
