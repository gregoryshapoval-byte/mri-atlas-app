import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import http from 'node:http';
const {chromium}=await import(process.env.PLAYWRIGHT_IMPORT),root=path.resolve('app/src/main/assets');
const mime={'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{try{const f=path.join(root,new URL(req.url,'http://local').pathname);res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f));}catch{res.statusCode=404;res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--disable-gpu']}),page=await browser.newPage();const errors=[],external=[];
page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url());});page.on('request',r=>{if(!r.url().startsWith(base))external.push(r.url());});
try{for(const [width,height]of [[320,568],[393,852],[852,393],[1280,800]]){
 await page.setViewportSize({width,height});await page.goto(base+'/prostate-recurrence.html');
 assert.match(await page.locator('#result').textContent(),/не рассчитана/);
 await page.selectOption('#therapy','RP');await page.selectOption('#dwi','4');await page.selectOption('#dce','3');await page.check('#adequate');await page.check('#sameFocus');assert.match(await page.locator('#result').textContent(),/PI-RR 4/);
 await page.selectOption('#therapy','RT');await page.selectOption('#dce','4');assert.match(await page.locator('#result').textContent(),/PI-RR 5/);
 await page.uncheck('#sameFocus');assert.match(await page.locator('#result').textContent(),/PI-RR 4/);
 await page.selectOption('#dce','');assert.match(await page.locator('#result').textContent(),/не рассчитана/);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'overflow '+width);
 await page.locator('a[href="#scanning"]').click();assert(await page.locator('#scanning').isVisible());
 await page.locator('#copy').click();assert(await page.locator('#copyStatus').textContent());
 if(width===393){await page.locator('#assessment').screenshot({path:'review/pirr258-assessment.png'});await page.locator('#criteria').screenshot({path:'review/pirr258-criteria.png'});}
 }
 await page.goto(base+'/prostate-cancer.html');assert(await page.locator('a[href="prostate-recurrence.html"]').isVisible());
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);fs.writeFileSync('review/browser-pirr258.json',JSON.stringify({pass:true,viewports:4,errors,external,overflow:false,scope_and_quality_gate:true},null,2)+'\n');console.log('PASS browser PI-RR: four widths, RP/RT upgrades, X gate, anchors, copy and old-module link; no errors/external requests/overflow.');
}finally{await browser.close();server.close();}
