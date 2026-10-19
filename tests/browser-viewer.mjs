import assert from 'node:assert/strict';import {spawn} from 'node:child_process';import fs from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_IMPORT||'/tmp/atlas-dom/node_modules/playwright/index.mjs');
const server=spawn('python3',['-m','http.server','8766','--bind','127.0.0.1'],{cwd:'app/src/main/assets',stdio:'ignore'});
const out='review/browser-1.42';fs.mkdirSync(out,{recursive:true});
let browser;
try{
 browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});
 const errors=[];
 for(const viewport of [{width:393,height:852},{width:360,height:640},{width:852,height:393}]){
  const page=await browser.newPage({viewport});page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.url()+':'+r.status())});
  for(const name of ['brain','wrist-mri','elbow-mri','male-pelvis-mri','female-pelvis-mri','shoulder-mri','foot-mri','knee-mri','face-neck-mri','hip-mri','spine-mri','upper-limb-mri','lower-limb-mri','brachial-plexus-mri']){
   await page.goto('http://127.0.0.1:8766/'+name+'.html');await page.waitForSelector('.screenLabels circle');
   const sizes=await page.evaluate(()=>({height:innerHeight,scroll:document.documentElement.scrollHeight,stage:document.querySelector('.stage').getBoundingClientRect().height}));assert(sizes.scroll<=sizes.height+1);assert(sizes.stage>sizes.height*.52);
   const top=await page.locator('.infoButton').boundingBox();assert(top.x>=0&&top.x+top.width<=viewport.width+1);assert(await page.locator('.viewerBack').isVisible());
   const checks=await page.evaluate(()=>{const svg=document.querySelector('.screenLabels'),box=svg.getBoundingClientRect(),rects=[...svg.querySelectorAll('.labelBackdrop')].map(x=>x.getBoundingClientRect());return {inside:rects.every(r=>r.top>=box.top-1&&r.bottom<=box.bottom+1&&r.left>=box.left-1&&r.right<=box.right+1),overlap:rects.some((a,i)=>rects.some((b,j)=>i!==j&&a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top))}});assert(checks.inside,name+' labels bounded');assert(!checks.overlap,name+' labels do not overlap');
   if(viewport.width===393)await page.screenshot({path:out+'/'+name+'-labels.png'});
   await page.locator('[data-mode="points"]').first().click();assert.equal(await page.locator('.screenLabels text,.screenLabels polyline').count(),0);assert(await page.locator('.screenLabels circle').count()>0);
   await page.locator('.screenLabels circle').first().click({force:true});await page.waitForSelector('.pointPopup:not([hidden])');if(name==='wrist-mri'&&viewport.width===393)await page.screenshot({path:out+'/wrist-points.png'});
   await page.locator('[data-mode="off"]').first().click();assert.equal(await page.locator('.screenLabels circle').count(),0);
   await page.locator('[data-mode="labels"]').first().click();await page.locator('.fullscreenButton').first().click();assert(await page.locator('.fullscreenViewer .controls').isVisible());await page.locator('.fullscreenButton').first().click();
   await page.locator('#compare').check();assert.equal(await page.locator('.panel').count(),2);const boxes=await page.locator('.panel').evaluateAll(ps=>ps.map(p=>p.getBoundingClientRect().toJSON()));assert(boxes.every(b=>b.top>=0&&b.bottom<=viewport.height));
   await page.locator('#compare').uncheck();
   console.log('PASS browser:',name,viewport.width+'x'+viewport.height);
  }
  await page.goto('http://127.0.0.1:8766/brain.html?set=vascular');await page.waitForSelector('.screenLabels circle');await page.locator('[data-mode="points"]').click();assert(await page.locator('.screenLabels circle').count()>0);
  await page.close();
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(out+'/result.json',JSON.stringify({passed:true,viewports:3,modules:14,vascular:true}));
}finally{await browser?.close();server.kill()}
