import assert from 'node:assert/strict';import {spawn} from 'node:child_process';import fs from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_IMPORT||'/tmp/atlas-dom/node_modules/playwright/index.mjs');
const server=spawn('python3',['-m','http.server','8767','--bind','127.0.0.1'],{cwd:'app/src/main/assets',stdio:'ignore'}),out='review/joints-1.44';fs.mkdirSync(out,{recursive:true});let browser;
try{
 browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});
 for(const viewport of [{width:393,height:852},{width:360,height:640},{width:852,height:393}]){
  const page=await browser.newPage({viewport}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:8767/')?r.continue():r.abort());
  for(const [mod,refs]of [['shoulder-mri',[[656,17],[657,18],[658,23]]],['knee-mri',[[652,28],[653,14],[654,17]]],['foot-mri',[[541,15],[542,20],[543,45]]]]){
   const E=JSON.parse(fs.readFileSync('app/src/main/assets/'+mod+'-anatomy144.json')),D=JSON.parse(fs.readFileSync('app/src/main/assets/'+mod+'-data.json'));
   await page.goto('http://127.0.0.1:8767/'+mod+'.html');await page.waitForSelector('.anatomyRegion path');assert((await page.locator('.panelHead select').inputValue()).endsWith('_dp'));
   await page.locator('.anatomyMenuButton').click();await page.locator('.filterButtons .none').click();for(const text of ['Сумки и завороты · ленты PD',...(mod==='shoulder-mri'?['Аксиллярный карман · капсула и прикрепления']:[])])await page.locator('.compactGroup').filter({hasText:text}).locator('input').check();await page.locator('.closeMenu').click();
   for(const [se,n]of refs){
    const sid=se+'-contraste_dp',s=D.series.find(s=>s.id===sid),f=s.frames[n-1],expected=E.seriesSlices[sid][f.annotation];
    await page.locator('.panelHead select').selectOption(sid);await page.locator('.slice').fill(String(n-1));await page.locator('.slice').dispatchEvent('input');await page.waitForFunction(src=>document.querySelector('.screenLabels').dataset.frame===src,f.src);await page.waitForFunction(count=>document.querySelectorAll('.anatomyRegion').length===count,expected.regions.length);
    assert.equal(await page.locator('.screenLabels g[data-structure="2429"] circle,.screenLabels g[data-structure="2380"] circle').count(),0);assert(await page.locator('.screenLabels text').count()>0);
    const geom=await page.locator('.anatomyRegion path').first().getAttribute('d');await page.locator('.stage').dispatchEvent('wheel',{deltaY:-100,ctrlKey:true});assert.notEqual(await page.locator('.anatomyRegion path').first().getAttribute('d'),geom);await page.locator('.fit').click();
    if(viewport.width===393)await page.screenshot({path:out+'/'+mod+'-pd-'+se+'.png'});
    const hit=await page.locator('.anatomyRegion path').first().evaluate(p=>{const q=p.getPointAtLength(p.getTotalLength()/2),v=new DOMPoint(q.x,q.y).matrixTransform(p.getScreenCTM());return{x:v.x,y:v.y}});await page.mouse.click(hit.x,hit.y);if(!await page.locator('.pointPopup').isVisible()){console.log('Ribbon tap diagnostic',mod,se,n,viewport,hit,await page.evaluate(({x,y})=>document.elementFromPoint(x,y)?.outerHTML.slice(0,600),hit));await page.screenshot({path:out+'/tap-diagnostic.png'})}await page.waitForSelector('.pointPopup:not([hidden])');assert.match(await page.locator('.pointPopup').textContent(),/ориентир|област|ожидаем|сумк|капсул/i);
    const before=await page.locator('.slice').inputValue();await page.locator('.pointPopup').dispatchEvent('wheel',{deltaY:80});assert.equal(await page.locator('.slice').inputValue(),before);await page.locator('.pointPopup button').click();assert.equal(await page.locator('.pointPopup').isVisible(),false);
    await page.locator('[data-mode="points"]').click();assert.equal(await page.locator('.anatomyRegion,.screenLabels text,.screenLabels polyline').count(),0);await page.locator('[data-mode="off"]').click();assert.equal(await page.locator('.screenLabels [data-structure]').count(),0);await page.locator('[data-mode="labels"]').click();
    await page.locator('.fullscreenButton').click();assert(await page.locator('.fullscreenViewer .anatomyRegion').count()>0);await page.locator('.fullscreenButton').click();
    const t1=D.series.find(s=>s.id===se+'-contraste_');await page.locator('.panelHead select').selectOption(t1.id);await page.waitForFunction(src=>document.querySelector('.screenLabels').dataset.frame===src,t1.frames[n-1].src);assert.equal(await page.locator('.anatomyRegion').count(),0);
   }
   for(const s of D.series.filter(s=>s.id.endsWith('_dp'))){await page.locator('.panelHead select').selectOption(s.id);for(let i=0;i<s.frames.length;i++){
    await page.locator('.slice').fill(String(i));await page.locator('.slice').dispatchEvent('input');await page.waitForFunction(src=>document.querySelector('.screenLabels').dataset.frame===src,s.frames[i].src);assert.equal(await page.locator('.anatomyRegion').count(),E.seriesSlices[s.id][s.frames[i].annotation].regions.length);assert.equal(await page.locator('.failed').isVisible(),false);
   }}
   await page.locator('.anatomyMenuButton').click();await page.locator('.shoulderGuide>summary').click();assert.match(await page.locator('.shoulderGuide').textContent(),/Литература и ограничения/);if(viewport.width===393)await page.screenshot({path:out+'/'+mod+'-menu.png'});await page.locator('.closeMenu').click();
   console.log('PASS',mod,viewport.width+'x'+viewport.height,': every PD frame, three planes, ribbons, popup, modes, zoom, full screen, guide, offline');
  }
  assert.deepEqual(errors,[]);await page.close();
 }
 fs.writeFileSync(out+'/result.json',JSON.stringify({passed:true,modules:3,pdFrames:371,ribbons:238,viewports:3,externalNetworkBlocked:true}));
}finally{await browser?.close();server.kill()}
