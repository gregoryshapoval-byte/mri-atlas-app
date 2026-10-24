const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {chromium}=process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright'):require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})}),results=[];
 const out=path.resolve('review/browser-rectal242');fs.mkdirSync(out,{recursive:true});
 for(const [width,height] of [[393,852],[320,568],[852,393],[1280,800]]){
  const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage(),errors=[],external=[],missing=[];
  page.on('pageerror',e=>errors.push(e.message));
  await context.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname!=='atlas.test'){external.push(u.href);return r.abort();}const p=path.join(process.cwd(),'app/src/main/assets',decodeURIComponent(u.pathname));if(!fs.existsSync(p)){missing.push(p);return r.fulfill({status:404,body:'missing'});}const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp'};return r.fulfill({status:200,body:fs.readFileSync(p),contentType:types[path.extname(p)]||'application/octet-stream'});});
  await page.goto('http://atlas.test/rectal-cancer.html');await page.waitForSelector('#caseSelect');assert(await page.locator('#cases').isVisible());
  const ids=await page.locator('[data-case]').evaluateAll(ns=>ns.map(n=>n.dataset.case));assert.equal(ids.length,20);
  for(const id of ids){await page.locator('#caseSelect').selectOption(id);await page.locator('.caseImageButton img').evaluate(i=>i.decode());await page.locator('.caseAnswer summary').click();assert.notEqual(await page.locator('.caseAnswer').getAttribute('open'),null);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'overflow '+width+' '+id);}
  for(const g of await page.locator('#caseGroup option').evaluateAll(ns=>ns.map(n=>n.value))){await page.locator('#caseGroup').selectOption(g);assert(await page.locator('[data-case]').count()>0);}
  await page.locator('#caseGroup').selectOption('Все');await page.locator('#caseSearch').fill('EMVI');assert(await page.locator('[data-case]').count()>0);assert(await page.locator('[data-case]').count()<20);
  await page.locator('#caseSearch').fill('неттакогопризнака123');assert.equal(await page.locator('[data-case]').count(),0);assert(await page.locator('#caseSelect').isEnabled()===false);
  await page.locator('#caseSearch').fill('');await page.locator('#caseSelect').selectOption('shine');await page.locator('.caseFeature').click();assert(await page.locator('#response').isVisible());
  await page.locator('[data-tab="cases"]').click();await page.locator('.caseImageButton').click();await page.waitForSelector('#caseZoom[open]');await page.locator('#caseZoomImage').evaluate(i=>i.decode());await page.locator('#caseZoomScale').fill('4');assert.equal(await page.locator('#caseZoomImage').evaluate(i=>i.style.width),'400%');await page.keyboard.press('Escape');assert.equal(await page.locator('#caseZoom').getAttribute('open'),null);
  await page.locator('[data-tab="staging"]').click();await page.locator('#mrf').fill('1');await page.locator('#source').selectOption({label:'Опухоль'});assert((await page.locator('#mrfResult').textContent()).includes('MRF+'));
  await page.locator('#mrf').fill('1.1');assert((await page.locator('#mrfResult').textContent()).includes('MRF−')||(await page.locator('#mrfResult').textContent()).includes('MRF-'));
  for(const tab of await page.locator('[data-tab]').all())await tab.click();
  await page.locator('[data-tab="cases"]').click();await page.locator('#caseSelect').selectOption('t3-mrf');await page.locator('.caseImageButton img').evaluate(i=>i.decode());await page.locator('.caseAnswer summary').click();await page.screenshot({path:path.join(out,width+'.png'),fullPage:true});
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);assert.deepEqual(missing,[]);results.push({width,height,cases:20,filters:true,search:true,zoom:true,mrf_boundaries:true,errors,external,missing});await context.close();
 }
 await browser.close();fs.writeFileSync('review/browser-rectal242.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
})().catch(e=>{console.error(e);process.exit(1)});
