const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});const results=[];
for(const [width,height]of [[393,852],[320,568],[852,393],[1280,800]]){
 const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage(),errors=[],external=[];
 page.on('pageerror',e=>errors.push(e.message));await context.route('**/*',r=>{if(new URL(r.request().url()).hostname==='atlas.test'){const fs=require('fs'),path=require('path'),p=path.join(process.cwd(),'app/src/main/assets',decodeURIComponent(new URL(r.request().url()).pathname));return r.fulfill({status:200,body:fs.readFileSync(p),contentType:p.endsWith('.html')?'text/html':p.endsWith('.js')?'application/javascript':p.endsWith('.css')?'text/css':'image/png'});}external.push(r.request().url());return r.abort();});
 await page.goto('http://atlas.test/endometriosis.html?tab=cases');await page.waitForSelector('#caseSelect');
 const ids=await page.locator('[data-case]').evaluateAll(ns=>ns.map(n=>n.dataset.case));
 if(ids.length!==12)throw Error('wrong count');
 for(const id of ids){await page.locator('#caseSelect').selectOption(id);await page.locator('.caseImageButton img').evaluate(img=>img.decode());await page.locator('.caseAnswer summary').click();if(!(await page.locator('.caseAnswer').getAttribute('open'))&&await page.locator('.caseAnswer').getAttribute('open')===null)throw Error('answer closed');
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('overflow '+width+' '+id);
 }
 await page.locator('.caseImageButton').click();await page.waitForSelector('#caseZoom[open]');await page.locator('#caseZoomScale').fill('3');await page.locator('#caseZoom .close').click();
 for(const button of await page.locator('#caseFilters button').all()){await button.click();const n=await page.locator('[data-case]').count();if(n<1)throw Error('empty filter');}
 await page.locator('#caseFilters button').first().click();await page.locator('#caseSelect').selectOption('ovary');await page.locator('.caseFeature').click();if(!(await page.locator('#featureTitle').textContent()).toLowerCase().includes('эндометри'))throw Error('feature jump '+await page.locator('#featureTitle').textContent());
 for(const tab of await page.locator('[data-tab]').all())await tab.click();
 await page.locator('#tab-cases').click();await page.locator('#caseSelect').selectOption('adenomyosis');await page.locator('.caseAnswer summary').click();await page.locator('.caseImageButton img').evaluate(i=>i.decode());await page.screenshot({path:`review/endometriosis-2.41/${width}.png`,fullPage:true});
 if(errors.length||external.length)throw Error(JSON.stringify({errors,external}));results.push({width,height,cases:ids.length,errors,external});await context.close();
}await browser.close();console.log(JSON.stringify(results));})().catch(e=>{console.error(e);process.exit(1)});
