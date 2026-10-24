import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const sandbox={};vm.runInNewContext(fs.readFileSync('app/src/main/assets/prostate-rules.js','utf8'),sandbox);
const assess=sandbox.ProstateRules.assess;
const tztab=[[1,1,1,1,1],[2,2,2,3,3],[3,3,3,3,4],[4,4,4,4,4],[5,5,5,5,5]];
let n=0;
for(const zone of ['PZ','TZ'])for(let t2=1;t2<=5;t2++)for(let dwi=1;dwi<=5;dwi++)for(const dce of ['+','-','X']){
const expected=zone==='TZ'?tztab[t2-1][dwi-1]:dwi===3&&dce==='+'?4:dwi;
assert.equal(assess({zone,t2,dwi,dce}).score,expected,JSON.stringify({zone,t2,dwi,dce}));n++;
}
assert.match(assess({zone:'PZ',t2:3,dwi:3,dce:'X'}).reason,/не оценено/);
assert.equal(assess({zone:'TZ',t2:2,dwi:5,dce:'+'}).score,3);
assert.equal(assess({zone:'TZ',t2:3,dwi:4,dce:'+'}).score,3);
assert.equal(assess({zone:'TZ',t2:3,dwi:5,dce:'-'}).score,4);
assert.equal(assess({zone:'PZ',t2:5,dwi:2,dce:'+'}).score,2);
for(const bad of [{zone:'CZ',t2:3,dwi:3},{zone:'PZ',t2:0,dwi:3},{zone:'TZ',t2:3,dwi:6},{zone:'PZ',t2:3,dwi:3,dce:'?'},{zone:'PZ',t2:4,dwi:5,adequate:false}])assert.equal(assess(bad).score,null);
const data={};vm.runInNewContext(fs.readFileSync('app/src/main/assets/prostate-data.js','utf8'),data);
assert.equal(data.ProstateAtlasData.zones.length,4);
assert.equal(data.ProstateAtlasData.scan.length,6);
console.log('PASS prostate185: '+n+' PI-RADS combinations, TZ upgrades, DCE X, invalid/limited input.');
