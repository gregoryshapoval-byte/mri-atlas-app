import {createRequire}from'node:module';import assert from'node:assert/strict';import fs from'node:fs';import path from'node:path';import http from'node:http';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const root=path.resolve('app/src/main/assets'),out='review/browser-castellvi182';fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const file=path.join(root,decodeURIComponent(new URL(req.url,'http://local').pathname));try{const data=fs.readFileSync(file);res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':file.endsWith('.html')?'text/html':'application/octet-stream');res.end(data);}catch{res.statusCode=404;res.end();}});await new Promise(r=>server.listen(8766,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/root/.cache/ms-playwright/chromium_headless_shell-1161/chrome-linux/headless_shell',args:['--no-sandbox']});let count=0;const errors=[];
try{
for(const [width,height]of [[393,852],[320,568],[852,393],[1280,900]]){
 const page=await browser.newPage({viewport:{width,height}});page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.url());});
 await page.goto('http://127.0.0.1:8766/region.html?area=spine');await page.getByRole('link',{name:/Сакрализация/}).click();await page.waitForSelector('.card');assert.equal(await page.locator('.card').count(),7);await page.evaluate(()=>Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(i=>i.decode())));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 for(const code of ['Ia','Ib','IIa','IIb','IIIa','IIIb','IV']){
  const card=page.locator(`[data-type="${code}"]`);if(width===393)await card.screenshot({path:`${out}/card-${code}.png`});await card.click();assert.equal(await page.locator('#zoom').isVisible(),true);assert.equal(await page.locator('#zoomTitle').innerText(),'Castellvi '+code);await page.locator('#zoomImage').evaluate(e=>e.decode());assert.equal(await page.locator('#zoom').evaluate(e=>e.scrollWidth<=e.clientWidth+1),true);if(width===393)await page.screenshot({path:`${out}/zoom-${code}.png`});await page.getByRole('button',{name:'Закрыть увеличенную схему'}).click();assert.equal(await page.locator('#zoom').isVisible(),false);count++;
 }
 await page.screenshot({path:`${out}/gallery-${width}.png`,fullPage:true});await page.getByRole('link',{name:'‹ Позвоночник'}).click();await page.waitForSelector('.sectionCard');assert.equal(await page.locator('.sectionCard').count(),2);await page.close();
}
assert.deepEqual(errors,[]);console.log('PASS 7 types ×4 viewports: images, labels, zoom/close, overflow and spine menu; '+count+' open/close checks');
}finally{await browser.close();server.close();}
