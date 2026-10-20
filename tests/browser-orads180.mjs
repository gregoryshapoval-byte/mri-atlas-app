import {createRequire}from'node:module';import assert from'node:assert/strict';import fs from'node:fs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const http=await import('node:http'),path=await import('node:path');
const root=path.resolve('app/src/main/assets');const server=http.createServer((req,res)=>{const file=path.join(root,decodeURIComponent(new URL(req.url,'http://local').pathname));try{const data=fs.readFileSync(file);res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':file.endsWith('.html')?'text/html':'application/octet-stream');res.end(data);}catch{res.statusCode=404;res.end();}});await new Promise(r=>server.listen(8765,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});
const errors=[];fs.mkdirSync('review/browser-orads180',{recursive:true});
for(const [width,height]of [[393,852],[320,568],[852,393],[1280,800]]){
 const page=await browser.newPage({viewport:{width,height}});page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://127.0.0.1:8765/region.html?area=pelvis');await page.getByRole('link',{name:/Образования придатков/}).click();
 if(await page.locator('[data-tab="schemes"]').count())await page.locator('[data-tab="assessment"]').click();await page.waitForSelector('#scope');assert.match(await page.locator('#result').innerText(),/Нужны/);
 for(const [id,v]of Object.entries({scope:'standard',adequate:'yes',type:'uni',peritoneal:'no',fat:'no',solid:'no',fluid:'simple',wall:'thin'}))await page.selectOption('#'+id,v);
 assert.match(await page.locator('#result').innerText(),/MRI 2/);
 await page.selectOption('#fluid','other');await page.selectOption('#wall','thin');assert.match(await page.locator('#result').innerText(),/MRI 3/);
 await page.selectOption('#solid','yes');for(const [id,v]of Object.entries({dark:'no',mode:'dce',uterus:'yes',curve:'high'}))await page.selectOption('#'+id,v);assert.match(await page.locator('#result').innerText(),/MRI 5/);
 await page.selectOption('#uterus','no');await page.selectOption('#curve','plateau');assert.match(await page.locator('#result').innerText(),/4–5/);
 for(const tab of ['assessment','guide','protocol','report']){
  await page.locator(`[data-tab="${tab}"]`).click();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'horizontal overflow '+width+' '+tab);
  await page.screenshot({path:`review/browser-orads180/${width}-${tab}.png`,fullPage:true});
 }
 await page.locator('#makeReport').click();assert.match(await page.locator('#reportText').inputValue(),/Категория не определена/);
 await page.fill('#reportText','Ручная правка');await page.locator('#makeReport').click();assert.equal(await page.locator('#replacePrompt').isVisible(),true);await page.locator('#cancelReplace').click();assert.equal(await page.locator('#reportText').inputValue(),'Ручная правка');
 await page.locator('#makeReport').click();await page.locator('#confirmReplace').click();assert.notEqual(await page.locator('#reportText').inputValue(),'Ручная правка');
 await page.locator('[data-tab="assessment"]').click();await page.locator('#reset').click();assert.equal(await page.locator('#scope').inputValue(),'');assert.match(await page.locator('#result').innerText(),/Нужны/);
 await page.getByRole('link',{name:'‹ Малый таз'}).click();await page.waitForSelector('#cards');assert.equal(await page.locator('.sectionCard').count(),6);
 await page.close();
}
await browser.close();server.close();assert.deepEqual(errors,[]);console.log('4 viewports, 4 tabs, category changes, missing uterus, manual-edit protection, reset and menu navigation passed');
