import assert from 'node:assert/strict';import fs from 'node:fs';import {spawn} from 'node:child_process';import {regions} from '../app/src/main/assets/anatomy-regions.js';
const {chromium}=await import(process.env.PLAYWRIGHT_IMPORT||'/tmp/atlas-dom/node_modules/playwright/index.mjs');
const out='review/browser-1.42';fs.mkdirSync(out,{recursive:true});
const server=spawn('python3',['-m','http.server','8768','--bind','127.0.0.1'],{cwd:'app/src/main/assets',stdio:'ignore'});let browser;
try{browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox','--enable-unsafe-swiftshader']});const failures=[];
 const context=await browser.newContext();await context.route('**/*',route=>{const u=new URL(route.request().url());return u.hostname==='127.0.0.1'?route.continue():route.abort()});
 for(const viewport of [{width:393,height:852},{width:360,height:640},{width:320,height:640},{width:852,height:393}]){const page=await context.newPage();await page.setViewportSize(viewport);page.on('pageerror',e=>failures.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))failures.push(r.url()+':'+r.status())});
  await page.goto('http://127.0.0.1:8768/index.html');await page.waitForSelector('.areaCard');assert.equal(await page.locator('.areaCard').count(),regions.length);assert.equal(await page.locator('.areaCard').first().getAttribute('href'),'region.html?area=brain');
  const cols=await page.locator('.areaGrid').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length);assert.equal(cols,viewport.width>=700&&viewport.height<=600?4:2);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('#areaSearch').fill('колено');assert.equal(await page.locator('.areaCard:visible').count(),1);await page.locator('#areaSearch').fill('');
  await page.evaluate(()=>Promise.all([...document.images].map(im=>{im.loading='eager';return im.decode()})));if(viewport.width===393)await page.screenshot({path:out+'/home.png',fullPage:true});
  for(const r of regions){await page.goto('http://127.0.0.1:8768/region.html?area='+r.id);await page.waitForSelector('.sectionCard');assert.equal(await page.locator('.sectionCard').count(),r.items.length);assert.equal(await page.locator('#heading').textContent(),r.name);
   await page.evaluate(()=>Promise.all([...document.images].map(im=>{im.loading='eager';return im.decode()})));const sizes=await page.locator('.sectionCard').evaluateAll(xs=>xs.map(x=>x.getBoundingClientRect().height));assert(sizes.every(h=>h>=110&&h<=151));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   if(viewport.width===393)await page.screenshot({path:out+'/region-'+r.id+'.png',fullPage:true});
  }
  await page.close();
 }
 const page=await context.newPage();await page.setViewportSize({width:393,height:852});await page.goto('http://127.0.0.1:8768/index.html');await page.waitForSelector('.areaCard');await page.evaluate(()=>scrollTo(0,500));await page.waitForTimeout(400);await page.locator('.areaCard[data-area="hip"]').scrollIntoViewIfNeeded();const y=await page.evaluate(()=>scrollY);await page.locator('.areaCard[data-area="hip"]').click();await page.waitForSelector('.sectionCard');await page.locator('.backPill').click();await page.waitForSelector('.areaCard');await page.waitForTimeout(500);assert(Math.abs(await page.evaluate(()=>scrollY)-y)<5,'home scroll restored');
 for(const r of regions)for(const item of r.items){const u='http://127.0.0.1:8768/'+item.url;await page.goto(u);
  if(item.type==='3D-МОДЕЛЬ'){await page.waitForSelector('#canvas canvas');assert.equal(await page.locator('#failure:not([hidden])').count(),0)}else{await page.waitForSelector('.panel');assert.equal(await page.locator('#error:not([hidden])').count(),0)}
  console.log('PASS existing/new route:',item.url);
 }
 assert.deepEqual(failures,[]);fs.writeFileSync(out+'/menu-result.json',JSON.stringify({passed:true,regions:regions.length,sections:regions.reduce((n,r)=>n+r.items.length,0),viewports:4,externalNetworkBlocked:true,scrollRestored:true}));
}finally{await browser?.close();server.kill()}
