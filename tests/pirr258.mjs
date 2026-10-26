import assert from 'node:assert/strict';
import fs from 'node:fs';
import {assess} from '../app/src/main/assets/pirr258-core.js';
import {searchEntries} from '../app/src/main/assets/search252-data.js';
import {prepare,search} from '../app/src/main/assets/search252-core.js';
const run=(therapy,dwi,dce,sameFocus=true,adequate=true)=>assess({therapy,dwi,dce,sameFocus,adequate}).score;
const rp=[[1,1,1,1,1],[2,2,2,3,3],[3,3,3,4,4],[4,4,4,4,4],[5,5,5,5,5]];
const rt=[[1,2,3,4,5],[2,2,3,4,5],[3,3,3,4,5],[4,4,4,5,5],[5,5,5,5,5]];
for(let dce=1;dce<=5;dce++)for(let dwi=1;dwi<=5;dwi++){
 assert.equal(run('RP',dwi,dce),rp[dce-1][dwi-1]);assert.equal(run('RT',dwi,dce),rt[dce-1][dwi-1]);
 assert.equal(run('RP',dwi,dce,false),dce);assert.equal(run('RT',dwi,dce,false),Math.max(dwi,dce));
 assert.equal(run('RP',dwi,dce,true,false),null);
}
for(const therapy of ['RP','RT'])for(const n of [0,6,NaN,null,undefined,2.5,'4']){assert.equal(run(therapy,n,4),null);assert.equal(run(therapy,4,n),null);}
assert.equal(run('other',4,4),null);assert.equal(run('',4,4),null);
const indexed=prepare(searchEntries);for(const q of ['PI-RR','pirr','пи рр'])assert(search(indexed,q).slice(0,3).some(e=>e.url==='prostate-recurrence.html'),q);
const html=fs.readFileSync('app/src/main/assets/prostate-recurrence.html','utf8');for(const id of ['assessment','criteria','scanning','report','evidence'])assert(html.includes('id="'+id+'"'));
console.log('PASS PI-RR: RP/RT matrices, co-localization, invalid/missing scores, quality gate, scope and search aliases.');
