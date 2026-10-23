import assert from 'node:assert/strict';
import fs from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_IMPORT||'/tmp/atlas-dom/node_modules/playwright/index.mjs');
import {data as nerves} from '../app/src/main/assets/tunnel-neuropathies-data.js';
import {data as fractures} from '../app/src/main/assets/stress-fractures-data.js';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--no-zygote','--single-process','--in-process-gpu','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'],env:{...process.env,LD_LIBRARY_PATH:'/tmp/chrome-support:/tmp/chrome-support/lib'}});
fs.mkdirSync('review231',{recursive:true});const failures=[],results=[];
const page=await browser.newPage();page.on('pageerror',e=>failures.push(e.message));
for(const [width,height]of [[320,568],[393,852],[852,393],[1280,800]]){
 await page.setViewportSize({width,height});
 for(const [module,d]of [['tunnel-neuropathies',nerves],['stress-fractures',fractures]]){
  await page.goto('http://127.0.0.1:8765/'+module+'.html?from=knee');await page.waitForSelector('[data-case]');
  assert.equal(await page.locator('[data-case]').count(),d.cases.length);
  for(const c of d.cases){await page.locator('[data-case="'+c.id+'"]').click();assert.equal(await page.locator('#caseTitle').textContent(),c.label);assert.equal(await page.locator('#reportText').textContent(),c.report);assert.equal(await page.locator('#figure svg').count(),1);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width+' '+module+' '+c.id);
   if(width===393){await page.locator('#figure').screenshot({path:'review231/'+module+'-'+c.id+'.png'});}
   await page.locator('#figure').click();assert(await page.locator('#zoom').evaluate(e=>e.open));await page.keyboard.press('Escape');assert(!(await page.locator('#zoom').evaluate(e=>e.open)));
  }
  for(const id of ['signs','scan','report','cases']){await page.locator('[data-tab="'+id+'"]').click();assert(await page.locator('#'+id).isVisible());assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'tab overflow');}
  await page.locator('#search').fill('zzzzzzz');assert.equal(await page.locator('[data-case]').count(),0);assert(await page.locator('#empty').isVisible());await page.locator('#search').fill('');
  await page.locator('#groups button').last().click();assert((await page.locator('[data-case]').count())>0);await page.locator('#groups button').first().click();
  await page.locator('[data-tab="report"]').click();await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('test blocked')}}}));await page.locator('#copy').click();assert(await page.locator('#fallback').isVisible());
  await page.locator('#checks input').first().check();assert(await page.locator('#checks input').first().isChecked());
  await page.locator('[data-tab="cases"]').click();await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'review231/'+module+'-'+width+'.png',fullPage:true});
  results.push({module,width,height,cases:d.cases.length,status:'passed'});
 }

}
assert.deepEqual(failures,[]);await browser.close();fs.writeFileSync('review231/ui-results.json',JSON.stringify(results,null,2));console.log('PASS: 22 cases x 4 viewports; tabs, zoom, search, filters, reports, copy fallback, checks; no overflow / JS errors.');
