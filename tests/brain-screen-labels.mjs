import assert from 'node:assert/strict';import {projectPoint,visiblePoints,screenLayout} from '../app/src/main/assets/brain-screen-labels.js';
const f={width:424,height:535},v={zoom:2.63,x:0,y:0,rotation:0,flipX:1,flipY:1},w=390,h=600;
const p={x:212,y:267.5,name:'Центр',structure:1};assert.equal(projectPoint(p,f,v,w,h).sx,w/2);assert.equal(projectPoint(p,f,v,w,h).sy,h/2);
assert.equal(visiblePoints([{...p,x:0}],f,{...v,zoom:5},w,h).length,0);
const pts=Array.from({length:100},(_,i)=>({...p,structure:i,sx:20+(i%10)*35,sy:30+Math.floor(i/10)*54}));const first=screenLayout(pts,w,h);assert(first.pages>1);for(let page=0;page<first.pages;page++){const l=screenLayout(pts,w,h,page);for(const p of l.labels){assert(p.ly>20&&p.ly<h-20);assert([0,1].includes(p.side))}}
const selected=screenLayout(pts,w,h,0,99);assert(selected.labels.some(p=>p.structure===99));const all=[];for(let p=0;p<first.pages;p++)all.push(...screenLayout(pts,w,h,p).labels);assert.equal(new Set(all.map(p=>p.structure)).size,100);
console.log('PASS: screen projection at zoom, clipping, bounded paginated labels, selection and no omitted structures');
