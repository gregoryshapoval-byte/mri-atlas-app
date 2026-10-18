import assert from 'node:assert/strict';import {spawn} from 'node:child_process';import fs from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_IMPORT||'/tmp/atlas-dom/node_modules/playwright/index.mjs');
const server=spawn('python3',['-m','http.server','8767','--bind','127.0.0.1'],{cwd:'app/src/main/assets',stdio:'ignore'}),out='review/shoulder-1.43';fs.mkdirSync(out,{recursive:true});
const E=JSON.parse(fs.readFileSync('app/src/main/assets/shoulder-pd-anatomy.json')),D=JSON.parse(fs.readFileSync('app/src/main/assets/shoulder-mri-data.json'));let browser;
try{
 browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});
 for(const viewport of [{width:393,height:852},{width:360,height:640},{width:852,height:393}]){
  const page=await browser.newPage({viewport}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:8767/')?r.continue():r.abort());
  await page.goto('http://127.0.0.1:8767/shoulder-mri.html');await page.waitForSelector('.anatomyRegion path');assert.equal(await page.locator('.panelHead select').inputValue(),'658-contraste_dp');
  await page.locator('.anatomyMenuButton').click();await page.locator('.filterButtons .none').click();
  for(const text of ['Сумки · протяжённые ориентиры PD','Аксиллярный карман · капсула и прикрепления'])await page.locator('.compactGroup').filter({hasText:text}).locator('input').check();await page.locator('.closeMenu').click();
  for(const [se,n]of [[658,16],[657,18],[656,15]]){
   const sid=se+'-contraste_dp',s=D.series.find(s=>s.id===sid),expected=E.seriesSlices[sid][s.frames[n-1].annotation];
   await page.locator('.panelHead select').selectOption(sid);await page.locator('.slice').fill(String(n-1));await page.locator('.slice').dispatchEvent('input');await page.waitForFunction(src=>document.querySelector('.screenLabels').dataset.frame===src,s.frames[n-1].src);
   await page.waitForFunction(count=>document.querySelectorAll('.anatomyRegion').length===count,expected.regions.length);await page.waitForTimeout(80);
   assert.equal(await page.locator('.screenLabels g[data-structure="2380"] circle').count(),0);assert(await page.locator('.screenLabels text').count()>0);
   const geom=await page.locator('.anatomyRegion path').first().getAttribute('d');await page.locator('.stage').dispatchEvent('wheel',{deltaY:-100,ctrlKey:true});assert.notEqual(await page.locator('.anatomyRegion path').first().getAttribute('d'),geom);await page.locator('.fit').click();
   if(viewport.width===393)await page.screenshot({path:out+'/pd-'+se+'.png'});
   await page.locator('.anatomyRegion').first().locator('path').last().click({force:true});assert(await page.locator('.pointPopup').isVisible());assert.match(await page.locator('.pointPopup').textContent(),/ожидаем|ориентир|сумк|капсул/i);await page.locator('.pointPopup button').click();
   await page.locator('[data-mode="points"]').click();assert.equal(await page.locator('.anatomyRegion').count(),0);assert.equal(await page.locator('.screenLabels text,.screenLabels polyline').count(),0);
   await page.locator('[data-mode="off"]').click();assert.equal(await page.locator('.screenLabels [data-structure]').count(),0);await page.locator('[data-mode="labels"]').click();
   await page.locator('.fullscreenButton').click();assert(await page.locator('.fullscreenViewer .anatomyRegion').count()>0);await page.locator('.fullscreenButton').click();
   await page.locator('.panelHead select').selectOption(se+'-contraste_');await page.waitForFunction(()=>!document.querySelector('.anatomyRegion'));assert.equal(await page.locator('.anatomyRegion').count(),0);
  }
  // Every listed slice is rendered, not only one reference frame per plane.
  for(const s of D.series.filter(s=>s.id.endsWith('_dp'))){await page.locator('.panelHead select').selectOption(s.id);
   for(let i=0;i<s.frames.length;i++){
    const expected=E.seriesSlices[s.id][s.frames[i].annotation].regions.length;
    await page.locator('.slice').fill(String(i));await page.locator('.slice').dispatchEvent('input');await page.waitForFunction(src=>document.querySelector('.screenLabels').dataset.frame===src,s.frames[i].src);await page.waitForFunction(count=>document.querySelectorAll('.anatomyRegion').length===count,expected);assert.equal(await page.locator('.failed').isVisible(),false);
   }
  }
  await page.locator('.anatomyMenuButton').click();assert(await page.locator('.shoulderGuide').isVisible());await page.locator('.shoulderGuide>summary').click();assert.match(await page.locator('.shoulderGuide').textContent(),/SGHL/);if(viewport.width===393)await page.screenshot({path:out+'/anatomy-menu.png'});await page.locator('.closeMenu').click();
  assert.deepEqual(errors,[]);await page.close();console.log('PASS shoulder browser',viewport.width,viewport.height,': all PD slices, per-plane ribbons, modes, zoom, fullscreen, menu; network blocked');
 }
 fs.writeFileSync(out+'/result.json',JSON.stringify({passed:true,planes:3,pdFrames:115,regions:76,componentPoints:41,viewports:3,externalNetworkBlocked:true}));
}finally{await browser?.close();server.kill()}
