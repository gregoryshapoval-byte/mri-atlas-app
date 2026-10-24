import assert from 'node:assert/strict';import fs from 'node:fs';import {spawn} from 'node:child_process';import{data}from'../app/src/main/assets/meniscus-data.js';
const{chromium}=await import(process.env.PLAYWRIGHT_IMPORT||'/tmp/atlas-dom/node_modules/playwright/index.mjs');
const out='review/browser-meniscus224';fs.mkdirSync(out,{recursive:true});
const server=spawn('python3',['-m','http.server','8824','--bind','127.0.0.1'],{cwd:'app/src/main/assets',stdio:'ignore'});let browser;
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader'],...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 for(const viewport of[{width:320,height:568},{width:393,height:852},{width:852,height:393},{width:1280,height:800}]){
 const p=await browser.newPage({viewport}),errors=[];await p.context().grantPermissions(['clipboard-read','clipboard-write']);p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.url())});
 await p.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 await p.goto('http://127.0.0.1:8824/region.html?area=knee');await p.locator('a[href="knee.html"]').click();await p.waitForSelector('[data-feature="signal"]');
 for(const g of ['features','roots','mimics','postop']){
  await p.locator('[data-tab="'+g+'"]').click();assert.equal(await p.locator('section[role="tabpanel"]:visible').count(),1);
  for(const f of data[g]){
   await p.locator('[data-feature="'+f.id+'"]').click();await p.locator('[data-figure="'+g+'"] img').evaluate(i=>i.decode());
   assert.equal(await p.locator('[data-title="'+g+'"]').innerText(),f.title);assert.equal(await p.locator('[data-trap="'+g+'"]').innerText(),f.trap);
   assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await p.locator('[data-figure="'+g+'"]').click();await p.locator('#zoomImage').evaluate(i=>i.decode());assert.equal(await p.locator('#zoomTitle').innerText(),f.title);
   if(viewport.width===393)await p.screenshot({path:out+'/zoom-'+f.id+'.png'});
   await p.keyboard.press('Escape');assert.equal(await p.locator('dialog[open]').count(),0);
  }
 }
 await p.locator('[data-tab="scan"]').click();assert.equal(await p.locator('#scanRows tr').count(),6);assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 if(viewport.width===393)await p.screenshot({path:out+'/scan.png',fullPage:true});
 await p.locator('[data-tab="report"]').click();assert.equal(await p.locator('.copy').count(),8);
 for(let i=0;i<8;i++){await p.locator('.copy').nth(i).click();assert.equal(await p.evaluate(()=>navigator.clipboard.readText()),data.reports[i][1]);}
 await p.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>Promise.reject(new Error('denied'))}}));await p.locator('.copy').first().click();assert.equal(await p.locator('#copyFallback').inputValue(),data.reports[0][1]);
 await p.locator('[data-tab="features"]').focus();await p.keyboard.press('End');assert.equal(await p.locator('[aria-selected="true"]').getAttribute('data-tab'),'report');await p.keyboard.press('Home');assert.equal(await p.locator('[aria-selected="true"]').getAttribute('data-tab'),'features');
 if(viewport.width===320)await p.screenshot({path:out+'/mobile.png',fullPage:true});
 await p.locator('a[href="knee-model.html"]').click();await p.waitForSelector('#canvas canvas');assert.equal(await p.locator('[data-type]').count(),8);
 for(const side of ['medial','lateral']){await p.locator('#'+side).click();for(const type of ['normal','long','radial','horizontal','flap','bucket','complex','root']){await p.locator('[data-type="'+type+'"]').click();await p.waitForTimeout(60);assert.equal(await p.locator('[data-type="'+type+'"].active').count(),1)}}
 if(viewport.width===393)await p.screenshot({path:out+'/3d.png',fullPage:true});await p.locator('a[href="knee.html"]').click();await p.waitForSelector('[data-feature="signal"]');await p.locator('header a').click();assert(p.url().endsWith('region.html?area=knee'));assert.deepEqual(errors,[]);await p.close();console.log('PASS meniscus224 browser',viewport);
 }
}finally{await browser?.close();server.kill()}
