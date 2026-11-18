import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_IMPORT);const repo=path.dirname(path.dirname(fileURLToPath(import.meta.url))),root=path.join(repo,'build/runtime-assets');
const origin='https://appassets.androidplatform.net',mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const browser=await chromium.launch({headless:true}),results=[];
try{
 for(const viewport of [{width:360,height:800},{width:393,height:852},{width:852,height:393},{width:1280,height:800}]){
  const context=await browser.newContext({viewport}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.origin!==origin)return route.abort();const f=path.resolve(root,'.'+decodeURIComponent(u.pathname).replace(/^\/assets/,''));if(!f.startsWith(root+path.sep)||!fs.existsSync(f)){errors.push('Missing '+u.pathname);return route.fulfill({status:404,body:''});}await route.fulfill({status:200,contentType:mime[path.extname(f)]||'application/octet-stream',body:fs.readFileSync(f)});});
  for(const [query,href,anchor]of [['SMART','perianal-cases.html#smart2024','smart2024'],['RIFIL','perianal-cases.html#smart-rifil','smart-rifil'],['HOPE','perianal-cases.html#smart-hope','smart-hope']]){
   await page.goto(origin+'/assets/index.html');await page.locator('#areaSearch').fill(query);const first=page.locator('.searchCard252 a').first();assert.equal(await first.getAttribute('href'),href);await first.click();await page.waitForSelector('#smart2024[open]');assert(await page.locator('#report').isVisible());assert(await page.locator('#'+anchor).isVisible());assert.equal(await page.locator('[data-section="report"]').getAttribute('aria-pressed'),'true');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'overflow '+viewport.width+' '+query);
  }
  await page.goto(origin+'/assets/index.html');for(const q of ['PI-RR','pirr','пи рр']){await page.locator('#areaSearch').fill(q);assert.equal(await page.locator('.searchCard252 a').first().getAttribute('href'),'prostate-recurrence.html');}
  assert.deepEqual(errors,[]);results.push({viewport,searchAndDeepLinks:true,noOverflow:true});await context.close();
 }
 fs.writeFileSync(path.join(repo,'build/browser-current345.json'),JSON.stringify({pass:true,results},null,2));console.log('PASS browser current search and SMART targets at four viewport sizes.');
}finally{await browser.close();}
