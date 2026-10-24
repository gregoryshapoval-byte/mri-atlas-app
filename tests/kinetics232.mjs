import assert from 'node:assert/strict';
import {classifyKinetics as k} from '../app/src/main/assets/breast232-math.js';
// Reference cases selected from the published cutoffs; no category assignment.
for(const [input,early,late]of [
 [[100,149,149],'медленное','plateau'],[[100,150,150],'среднее','plateau'],
 [[100,200,200],'среднее','plateau'],[[100,201,201],'быстрое','plateau'],
 [[100,200,220],'среднее','plateau'],[[100,200,220.01],'среднее','persistent'],
 [[100,200,180],'среднее','plateau'],[[100,200,179.99],'среднее','washout']]){
 const r=k(...input);assert(r.valid);assert.equal(r.initial,early);assert.equal(r.delayed,late);
}
for(const x of [[0,200,100],[100,0,100],[100,200,-1],[NaN,200,100],[100,100,100],[100,90,120]])assert(!k(...x).valid);
console.log('PASS: early50/100 and delayed±10 boundaries, invalid inputs; no BI-RADS automation.');
