import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import http from 'node:http';
import {modules} from '../app/src/main/assets/clinical255-data.js';
const {chromium}=await import(process.env.PLAYWRIGHT_IMPORT);
const root=path.resolve('app/src/main/assets'),server=http.createServer((req,res)=>{try{const f=path.join(root,new URL(req.url,'http://local').pathname);res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.webp':'image/webp','.json':'application/json'})[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f));}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--single-process','--no-zygote','--disable-gpu']}),page=await browser.newPage();const errors=[],external=[];
page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url());});page.on('request',r=>{if(!r.url().startsWith(base))external.push(r.url());});
let jumps=0,reports=0;
try{
 for(const [width,height]of [[320,568],[393,852],[852,393],[1280,800]]){
  await page.setViewportSize({width,height});
  for(const [key,m]of Object.entries(modules)){
   await page.goto(base+'/'+key+'.html');await page.waitForSelector('#clinical-feature-'+m.features[0].id);
   for(const id of ['features','location','differences','scanning','report','sources']){
    await page.locator('[data-neck-tab='+id+']').click();assert.equal(await page.locator('[role=tabpanel]:visible').count(),1);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,key+' '+id+' '+width);
   }
   for(let i=0;i<m.scenarios.length;i++){
    await page.locator('[data-neck-tab=navigator]').click();await page.locator('#neckScenario').selectOption(String(i));
    for(const id of m.scenarios[i][2]){await page.locator('[data-scenario-feature='+id+']').click();assert(await page.locator('#clinical-feature-'+id).isVisible());jumps++;await page.locator('[data-neck-tab=navigator]').click();}
   }
   await page.locator('[data-neck-tab=report]').click();
   for(let i=0;i<m.reports.length;i++){
    await page.locator('[data-neck-report]').nth(i).click();assert(await page.locator('#atlasReport251').evaluate(n=>n.open));assert.match(await page.locator('#atlasReport-description').inputValue(),/\[/);
    await page.locator('#atlasReport251').getByRole('button',{name:'Проверить и собрать текст',exact:true}).click();assert(await page.locator('#atlasReport251').getByRole('button',{name:'Копировать готовый текст',exact:true}).isDisabled());
    await page.keyboard.press('Escape');reports++;
   }
   await page.locator('[data-neck-tab=features]').click();
   await page.locator('#clinical-feature-'+m.features[0].id+' .hint a').first().click();assert(await page.locator('#neck-sources').isVisible());
   await page.locator('[data-neck-tab=features]').click();if(width===393)await page.screenshot({path:'review/clinical255-'+key+'.png',fullPage:false});
  }
 }
 for(const [key,m]of Object.entries(modules)){
  for(const f of m.features){await page.goto(base+'/'+key+'.html?focus255='+f.id);await page.waitForFunction(()=>document.documentElement.dataset.deepLink255==='ready');assert(await page.locator('#clinical-feature-'+f.id).isVisible());}
  await page.goto(base+'/region.html?area='+m.areaId);await page.locator('a[href="'+key+'.html"]').click();await page.waitForSelector('#clinicalApp h1');
 }
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 fs.writeFileSync('review/browser-clinical255.json',JSON.stringify({pass:true,viewports:4,scenario_jumps:jumps,report_imports:reports,deep_links:25,errors,external},null,2));
 console.log('PASS browser clinical255: four viewports, '+jumps+' scenario transitions, '+reports+' template checks, 25 deep links, no overflow/errors/external requests.');
}finally{await browser.close();server.close();}
