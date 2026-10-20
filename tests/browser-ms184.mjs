import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
const {chromium}=await import('/tmp/atlas-dom/node_modules/playwright/index.mjs');
const root=path.resolve('app/src/main/assets'),out='review/browser-ms184';
fs.mkdirSync(out,{recursive:true});
const mime={'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.json':'application/json','.webp':'image/webp'};
const server=http.createServer((req,res)=>{try{const p=path.join(root,decodeURIComponent(new URL(req.url,'http://local').pathname));res.setHeader('Content-Type',mime[path.extname(p)]||'application/octet-stream');res.end(fs.readFileSync(p));}catch{res.statusCode=404;res.end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']});
const errors=[],requests=[];
try{
for(const [width,height]of [[320,568],[393,852],[852,393],[1280,800]]){
const page=await browser.newPage({viewport:{width,height}});
page.on('pageerror',e=>errors.push(String(e)));
page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url());});
page.on('request',r=>{if(!r.url().startsWith(base))requests.push(r.url());});
await page.goto(base+'/region.html?area=brain');
await page.getByRole('link',{name:/Рассеянный склероз/}).click();
await page.waitForSelector('#featureFigure svg');
assert.equal(await page.locator('[role=tab]').count(),5);
assert.equal(await page.locator('[data-feature]').count(),6);
for(const id of ['pv','jc','cc','it','sc','on']){
await page.locator('[data-feature="'+id+'"]').click();
assert.equal(await page.locator('[data-feature][aria-pressed=true]').count(),1);
assert.ok((await page.locator('#featureTitle').innerText()).length>3);
assert.equal(await page.locator('#featureFigure svg path').evaluateAll(ps=>ps.every(p=>p.getTotalLength()>0)),true);
await page.locator('#featureFigure').click();
assert.equal(await page.locator('#zoom').evaluate(d=>d.open),true);
if(id==='pv')await page.screenshot({path:out+'/'+width+'-zoom.png'});
await page.keyboard.press('Escape');
assert.equal(await page.locator('#zoom').evaluate(d=>d.open),false);
await page.screenshot({path:out+'/'+width+'-'+id+'.png',fullPage:true});
}
for(const tab of ['features','criteria','differences','scanning','report']){
await page.locator('[data-tab="'+tab+'"]').click();
assert.equal(await page.locator('[role=tabpanel]:visible').count(),1);
assert.equal(await page.locator('#'+tab).isVisible(),true);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
for(const detail of await page.locator('#'+tab+' details').all())await detail.evaluate(d=>d.open=true);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
await page.screenshot({path:out+'/'+width+'-'+tab+'.png',fullPage:true});
}
assert.equal(await page.locator('#scanning tbody tr').count(),9);
assert.match(await page.locator('#scanning').innerText(),/5 минут/);
assert.match(await page.locator('#scanning').innerText(),/2–3 мм/);
await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.copied=text;}}}));
await page.locator('.copy').first().click();
await page.waitForFunction(()=>document.querySelector('#copyStatus').textContent.includes('Скопировано'));
assert.match(await page.evaluate(()=>window.copied),/диссеминации/);
await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('Denied');}}}));
await page.locator('.copy').nth(1).click();
assert.equal(await page.locator('#copyFallback').isVisible(),true);
assert.match(await page.locator('#copyFallback').inputValue(),/В сравнении/);
assert.match(await page.locator('.reportText').nth(1).innerText(),/При выполненном контрастировании/);
await page.locator('[data-tab="features"]').focus();
await page.keyboard.press('ArrowRight');
assert.equal(await page.locator('[data-tab="criteria"]').getAttribute('aria-selected'),'true');
await page.getByRole('link',{name:'‹ Головной мозг',exact:true}).click();
await page.waitForSelector('#heading');
assert.match(await page.locator('#heading').innerText(),/Головной мозг/);
await page.close();
}
assert.deepEqual(errors,[]);
assert.deepEqual(requests,[]);
console.log('PASS MS184: route, 6 diagrams, 5 panels, 4 viewports, zoom/Escape, layout bounds, clipboard/fallback, keyboard and offline requests.');
}finally{await browser.close();server.close();}
