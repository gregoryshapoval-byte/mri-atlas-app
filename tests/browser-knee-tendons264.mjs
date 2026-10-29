import assert from 'node:assert/strict';import fs from 'node:fs';import {spawn} from 'node:child_process';
import {kneeTendons}from'../app/src/main/assets/knee-tendons264-data.js';
const {chromium}=await import(process.env.PLAYWRIGHT_IMPORT||'/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const server=spawn('python3',['-m','http.server','8784','--bind','127.0.0.1'],{cwd:'app/src/main/assets',stdio:'ignore'});let browser;const result=[];
try{
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/tmp/atlas-chromium',args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage']});
 for(const viewport of [{width:393,height:852},{width:360,height:640},{width:852,height:393}]){
  const page=await browser.newPage({viewport}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:8784/')?r.continue():r.abort());
  await page.goto('http://127.0.0.1:8784/knee-mri.html?tendon264=medial-gastrocnemius');
  await page.waitForSelector('.anatomyDrawer[open] .kneeTendonGuide264');
  assert.equal(await page.locator('.kneeTendonGuide264 [data-tendon264]').count(),23);
  assert(await page.locator('[data-tendon264="medial-gastrocnemius"]').evaluate(e=>e.open));
  assert.equal(await page.locator('[data-tendon264="medial-gastrocnemius"] button').count(),6);
  for(const e of kneeTendons){const row=page.locator(`[data-tendon264="${e.id}"]`);assert(await row.locator('button').count()>0,e.id);assert.equal(await row.locator('dt').count(),5);}
  const search=page.getByRole('searchbox',{name:'Поиск в полном разборе сухожилий'});await search.fill('подошвенная');
  assert.equal(await page.locator('.kneeTendonGuide264 [data-tendon264]:not([hidden])').count(),1);
  await search.fill('несуществующая структура');assert.equal(await page.locator('.kneeTendonGuide264 [data-tendon264]:not([hidden])').count(),0);
  await search.fill('');
  const checks=[['medial-gastrocnemius',264211],['lateral-gastrocnemius',264212],['plantaris',264213],['biceps-femoris',9850],['semimembranosus',9470]];
  for(const [entry,id]of checks){
   for(const se of ['652-contraste_dp','653-contraste_dp','654-contraste_dp']){
    if(!await page.locator('.anatomyDrawer[open]').count())await page.locator('.anatomyMenuButton').first().click();
    await page.locator('.kneeTendonGuide264').evaluate(e=>e.open=true);
    const row=page.locator(`[data-tendon264="${entry}"]`);await row.evaluate(e=>e.open=true);
    const button=row.locator(`button[data-series="${se}"]`);if(!await button.count())continue;
    const target=await button.getAttribute('data-structure');await button.click();
    await page.waitForSelector(`.screenLabels g[data-structure="${target}"] circle`);
    assert.equal(await page.locator('.panelHead select').first().inputValue(),se);
    assert.equal(await page.locator('.anatomyDrawer[open]').count(),0);
   }
  }
  await page.locator('.anatomyMenuButton').first().click();await page.locator('.kneeTendonGuide264').evaluate(e=>e.open=true);
  await page.locator('[data-tendon264="plantaris"]').evaluate(e=>e.open=true);
  const overflow=await page.locator('.anatomyDrawer').evaluate(e=>e.scrollWidth>e.clientWidth+1);assert(!overflow,'drawer horizontal overflow');
  fs.mkdirSync('review/knee-tendons-2.64',{recursive:true});await page.screenshot({path:`review/knee-tendons-2.64/guide-${viewport.width}.png`});
  assert.deepEqual(errors,[]);result.push({viewport,entries:23,posteriorThreePlaneNavigation:true,noErrors:true});await page.close();
 }
 // The shared guide renderer must not add knee content to another module.
 const page=await browser.newPage();await page.goto('http://127.0.0.1:8784/hip-mri.html');await page.waitForSelector('.anatomyMenuButton');await page.locator('.anatomyMenuButton').first().click();assert.equal(await page.locator('.kneeTendonGuide264').count(),0);await page.close();
 fs.writeFileSync('review/knee-tendons-2.64-browser.json',JSON.stringify({passed:true,tests:result,otherModuleIsolated:true},null,2));console.log('PASS knee tendon guide: 23 records, multi-plane targets, filter and 3 layouts');
}finally{await browser?.close();server.kill();}
