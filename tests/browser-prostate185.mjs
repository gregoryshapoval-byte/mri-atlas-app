import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
const pw=process.env.PLAYWRIGHT_IMPORT||'/tmp/atlas-dom/node_modules/playwright/index.mjs';
const {chromium}=await import(pw);
const root=path.resolve('app/src/main/assets'),out='review/browser-prostate185';fs.mkdirSync(out,{recursive:true});
const mime={'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.json':'application/json'};
const server=http.createServer((req,res)=>{try{const f=path.join(root,decodeURIComponent(new URL(req.url,'http://local').pathname));res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f));}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});const errors=[],external=[];
try{
for(const [width,height]of [[320,568],[393,852],[852,393],[1280,800]]){
const page=await browser.newPage({viewport:{width,height}});page.on('pageerror',e=>errors.push(String(e)));page.on('request',r=>{if(!r.url().startsWith(base))external.push(r.url());});
await page.goto(base+'/region.html?area=pelvis');await page.getByRole('link',{name:/Рак простаты/}).click();await page.waitForSelector('#scoreRows tr');
assert.equal(await page.locator('[role=tab]').count(),4);assert.equal(await page.locator('#scoreRows tr').count(),5);
for(const zone of ['PZ','TZ']){
await page.locator('[data-score-zone="'+zone+'"]').click();assert.equal(await page.locator('#scoreRows tr').count(),5);assert.match(await page.locator('#dominant').innerText(),new RegExp(zone));await page.locator('#scoreFigure').click();assert.equal(await page.locator('#zoom').evaluate(d=>d.open),true);await page.keyboard.press('Escape');
await page.screenshot({path:out+'/'+width+'-'+zone+'.png',fullPage:true});
}
await page.locator('[data-tab="zones"]').click();
for(const level of ['base','mid','apex']){
await page.locator('[data-level="'+level+'"]').click();for(const zone of level==='apex'?['PZ','TZ','AFS']:['PZ','TZ','CZ','AFS']){
await page.locator('#zoneChoices [data-zone="'+zone+'"]').click();assert.equal(await page.locator('#zoneChoices [aria-pressed="true"]').count(),1);assert.match(await page.locator('#zoneTitle').innerText(),new RegExp(zone));assert.ok(await page.locator('#zoneFigure .active').count());}
if(level==='apex'){assert.equal(await page.locator('#zoneChoices [data-zone="CZ"]').isDisabled(),true);assert.equal(await page.locator('#zoneFigure [data-zone="CZ"]').count(),0);}
await page.screenshot({path:out+'/'+width+'-'+level+'.png',fullPage:true});
}
for(const tab of ['lesions','zones','scanning','report']){
await page.locator('[data-tab="'+tab+'"]').click();assert.equal(await page.locator('[role=tabpanel]:visible').count(),1);
for(const detail of await page.locator('#'+tab+' details').all())await detail.evaluate(d=>d.open=true);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'viewport '+width+' '+tab);
await page.screenshot({path:out+'/'+width+'-'+tab+'.png',fullPage:true});
}
await page.locator('[data-tab="lesions"]').click();await page.locator('#assessment').evaluate(d=>d.open=true);
await page.selectOption('#calcZone','PZ');await page.selectOption('#calcDwi','3');await page.selectOption('#calcDce','+');assert.equal(await page.locator('#calcResult').innerText(),'PI-RADS 4');
await page.selectOption('#calcDce','X');assert.equal(await page.locator('#calcResult').innerText(),'PI-RADS 3');assert.match(await page.locator('#calcReason').innerText(),/не оценено/);
await page.selectOption('#calcZone','TZ');await page.selectOption('#calcT2','2');await page.selectOption('#calcDwi','5');assert.equal(await page.locator('#calcResult').innerText(),'PI-RADS 3');
await page.selectOption('#calcT2','3');assert.equal(await page.locator('#calcResult').innerText(),'PI-RADS 4');
await page.locator('#adequate').uncheck();assert.equal(await page.locator('#calcResult').innerText(),'Оценка ограничена');
await page.locator('[data-tab="report"]').click();
await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async t=>{window.copied=t;}}}));await page.locator('.copy').first().click();await page.waitForFunction(()=>document.querySelector('#copyStatus').textContent.startsWith('Скопировано'));assert.match(await page.evaluate(()=>window.copied),/Очаг/);
await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('Denied');}}}));await page.locator('.copy').nth(1).click();assert.equal(await page.locator('#copyFallback').isVisible(),true);
await page.locator('[data-tab="lesions"]').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('[data-tab="zones"]').getAttribute('aria-selected'),'true');
await page.getByRole('link',{name:'‹ Малый таз',exact:true}).click();await page.waitForSelector('#cards');assert.match(await page.locator('#heading').innerText(),/Малый таз/);await page.close();
}
assert.deepEqual(errors,[]);assert.deepEqual(external,[]);console.log('PASS prostate185 browser: 4 screens, 3 levels, zones, scoring, DCE X, quality guard, copy/fallback, keyboard, zoom, route and offline requests.');
}finally{await browser.close();server.close();}
