import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawn} from 'node:child_process';
const {chromium}=await import(process.env.PLAYWRIGHT_IMPORT||'/tmp/atlas-dom/node_modules/playwright/index.mjs');
const server=spawn('python3',['-m','http.server','8816','--bind','127.0.0.1'],{cwd:'app/src/main/assets',stdio:'ignore'});
const out='review/browser-pager216';fs.mkdirSync(out,{recursive:true});let browser;
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const results=[];
 for(const viewport of [{width:320,height:568},{width:393,height:852},{width:852,height:393},{width:1280,height:800}]){
  const p=await browser.newPage({viewport}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  const settle=()=>p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(r)))));
  const geometry=()=>p.evaluate(()=>[...document.querySelectorAll('.panel')].map(panel=>{const s=panel.querySelector('.stage'),b=s.getBoundingClientRect(),c=panel.querySelector('.anatomyScene'),pager=panel.querySelector('.labelPager');return {x:b.x,y:b.y,w:b.width,h:b.height,transform:c.style.transform,pagerH:pager.getBoundingClientRect().height}}));
  const stable=(a,b,context)=>{assert.equal(a.length,b.length);a.forEach((v,i)=>{for(const k of ['x','y','w','h','pagerH'])assert(Math.abs(v[k]-b[i][k])<.1,context+' '+k);assert.equal(v.transform,b[i].transform,context+' transform')})};
  for(const mod of ['brain','wrist-mri','elbow-mri','male-pelvis-mri','female-pelvis-mri','shoulder-mri','foot-mri','knee-mri','face-neck-mri','hip-mri','spine-mri','upper-limb-mri','lower-limb-mri','brachial-plexus-mri','hand-mri','perianal-mri','abdomen-ct','abdomen-pelvis-ct']){
   // Discover the page from its data route rather than assume non-existent names.
   if(!fs.existsSync('app/src/main/assets/'+mod+'.html'))continue;
   await p.goto('http://127.0.0.1:8816/'+mod+'.html');await p.waitForSelector('.screenLabels circle');await settle();
   const before=await geometry();assert(before[0].h>100);assert(before[0].pagerH>0);
   for(const mode of ['points','off','labels']){await p.locator('[data-mode="'+mode+'"]').first().click();await settle();stable(before,await geometry(),mod+' '+mode)}
   const pager=p.locator('.labelPager').first();
   if(await pager.isVisible()){const text=await pager.textContent();if(text.includes('ещё')){await pager.click();await settle();stable(before,await geometry(),mod+' next labels')}}
   // Exercise the exact hidden-state transition on a fixed frame, independent
   // of how many structures happen to fit at this screen size.
   await pager.evaluate(e=>e.hidden=true);await settle();stable(before,await geometry(),mod+' hidden');
   await pager.evaluate(e=>e.hidden=false);await settle();stable(before,await geometry(),mod+' shown');
   await p.locator('[data-mode="labels"]').first().click();
   if(mod==='brain'){
    await p.screenshot({path:out+'/brain-'+viewport.width+'.png'});
    await p.locator('.stage').first().dblclick({position:{x:viewport.width/2,y:100}});await settle();const zoomed=await geometry();
    for(const mode of ['points','labels']){await p.locator('[data-mode="'+mode+'"]').first().click();await settle();stable(zoomed,await geometry(),'zoom '+mode)}
    await p.locator('.fullscreenButton').first().click();await settle();const full=await geometry();
    for(const mode of ['off','labels']){await p.locator('[data-mode="'+mode+'"]').first().click();await settle();stable(full,await geometry(),'fullscreen '+mode)}
    await p.locator('.fullscreenButton').first().click();await p.locator('#compare').check();await settle();const pair=await geometry();
    await p.locator('[data-mode="off"]').first().click();await settle();stable(pair,await geometry(),'compare off');
    await p.locator('[data-mode="labels"]').first().click();await settle();stable(pair,await geometry(),'compare labels');
    await p.locator('#compare').uncheck();
   }
   results.push({mod,viewport});console.log('PASS stable pager',mod,viewport.width,viewport.height);
  }
  assert.deepEqual(errors,[]);await p.close();
 }
 fs.writeFileSync(out+'/result.json',JSON.stringify({passed:true,results},null,2));
}finally{await browser?.close();server.kill()}
