import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const {Window}=await import(process.env.HAPPY_DOM_PATH||'/tmp/atlas-dom/node_modules/happy-dom/lib/index.js');
const root=path.resolve('app/src/main/assets');
const errors=[];
for(const name of ['wrist-mri','elbow-mri','male-pelvis-mri','female-pelvis-mri','shoulder-mri','foot-mri','knee-mri','face-neck-mri','hip-mri','spine-mri','upper-limb-mri','lower-limb-mri','brachial-plexus-mri','hand-mri','brain-3d','knee-3d','abdomen-pelvis-ct','brain']){
 const w=new Window({url:'https://appassets.androidplatform.net/assets/'+name+'.html'});
 w.document.write(await fs.readFile(path.join(root,name+'.html'),'utf8'));
 for(const key of ['window','document','location','localStorage'])globalThis[key]=key==='window'?w:w[key];
 globalThis.requestAnimationFrame=fn=>fn();
 globalThis.Image=class {set src(v){queueMicrotask(()=>this.onload?.())}async decode(){}};
 globalThis.fetch=async url=>({ok:true,json:async()=>JSON.parse(await fs.readFile(path.join(root,url),'utf8'))});
 w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({measureText:t=>({width:t.length*6})},{get:(o,k)=>o[k]||(()=>{})});
 await import(pathToFileURL(path.join(root,name==='brain'?'brain.js':'source-mri-viewer.js'))+'?case='+name);
 await new Promise(r=>setTimeout(r,30));
 assert.equal(w.document.querySelector('#error').hidden,true,name+' loads');
 assert.equal(w.document.querySelectorAll('.panel').length,1);
 assert.ok(w.document.querySelectorAll('.screenLabels circle').length>0,name+' has visible points');
 const first=w.document.querySelector('.panel');
 if(name==='wrist-mri'){
  const switches=first.querySelectorAll('.anatomyBlocks input');assert.equal(switches.length,2);
  const set=(i,value)=>{switches[i].checked=value;switches[i].onchange()};
  set(0,false);assert.equal(switches[0].checked,false);assert.equal(switches[1].checked,true);
  set(1,false);assert.equal(switches[0].checked,false);assert.equal(switches[1].checked,false);
  set(0,true);assert.equal(switches[1].checked,false);set(1,true);
  const q=first.querySelector('.search');q.value='DCSS';q.oninput();
  assert.match(first.querySelector('.searchResults').textContent,/≈ ориентир/);assert.equal(first.querySelectorAll('.searchResults button').length,1);first.querySelector('.searchResults button').click();assert.match(first.querySelector('select').value,/_dpfs$/);
  q.value='ладонная лучелоктевая';q.oninput();assert.ok(first.querySelector('.searchResults button'));first.querySelector('.searchResults button').click();
  assert.match(first.querySelector('select').selectedOptions[0].textContent,/PD-SPIR/i);
  const sel=first.querySelector('select');sel.selectedIndex=3;sel.onchange();await new Promise(r=>setTimeout(r,20));
 }

 first.querySelector('.anatomyMenuButton').click();
 assert.ok(first.querySelectorAll('.compactGroup').length>0);
 assert.ok(first.querySelectorAll('.compactGroup img').length>0);
 const search=first.querySelector('.search');search.value=['brain','brain-3d'].includes(name)?'мозг':['upper-limb-mri','lower-limb-mri','brachial-plexus-mri'].includes(name)?'артер':name==='abdomen-pelvis-ct'?'печень':name==='spine-mri'?'позвон':['male-pelvis-mri','female-pelvis-mri','face-neck-mri'].includes(name)?'артер':'кость';search.oninput();
 assert.ok(first.querySelectorAll('.searchResults button').length>0,name+' search');
 first.querySelector('.searchResults button').click();
 const mode=type=>first.querySelector('[data-mode="'+type+'"]').click();
 mode('points');await new Promise(r=>setTimeout(r,20));assert.equal(first.querySelectorAll('.screenLabels text,.screenLabels polyline').length,0);assert(first.querySelectorAll('.screenLabels circle').length>0);
 const dot=first.querySelector('.screenLabels [data-structure]');dot.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));await new Promise(r=>setTimeout(r,20));assert.equal(first.querySelector('.pointPopup').hidden,false);
 mode('off');await new Promise(r=>setTimeout(r,20));assert.equal(first.querySelectorAll('.screenLabels circle').length,0);assert.equal(first.querySelector('.pointPopup').hidden,true);
 mode('labels');await new Promise(r=>setTimeout(r,20));assert(first.querySelectorAll('.screenLabels text').length>0);
 assert(w.document.body.classList.contains('atlasViewer'));assert(w.document.querySelector('.viewerInfo .hint'));assert(w.document.querySelector('.infoButton'));
 first.querySelector('.plus').click();
 await new Promise(r=>setTimeout(r,20));
 assert.match(first.querySelector('.fit').textContent,/130%/);
 if(name==='wrist-mri'){assert.match(first.querySelector('img').style.transform,/scale\(1,-1\)/);first.querySelector('.fit').click();assert.match(first.querySelector('.fit').textContent,/100%/);}
 first.querySelector('.fullscreenButton').click();assert.ok(first.classList.contains('fullscreenViewer'));
 assert.equal(w.exitAtlasFullscreen(),true);
 first.querySelector('.next').click();
 const select=first.querySelector('select');select.selectedIndex=Math.min(1,select.options.length-1);select.onchange();
 await new Promise(r=>setTimeout(r,20));
 assert.equal(first.querySelector('.failed').hidden,true);
 w.document.querySelector('#compare').checked=true;w.document.querySelector('#compare').onchange();
 assert.equal(w.document.querySelectorAll('.panel').length,2);
 if(['wrist-mri','elbow-mri','brain'].includes(name)){
  w.document.querySelector('#vascular').click();await new Promise(r=>setTimeout(r,20));
  assert.ok(w.document.querySelectorAll('.screenLabels circle').length>0,name+' 3D labels');
 }
 console.log('PASS',name,': menu/icons/search, labels, zoom, fullscreen, series, comparison');
}
