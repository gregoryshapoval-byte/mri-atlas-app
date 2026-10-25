import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import http from 'node:http';
import {guides} from '../app/src/main/assets/review256-data.js';import {panelGuides} from '../app/src/main/assets/panel-guides256-data.js';
import {cases as liver} from '../app/src/main/assets/liver-cases-data.js';import {cases as rectal} from '../app/src/main/assets/rectal-cases-data.js';import {cases as endo} from '../app/src/main/assets/endometriosis-cases-data.js';
const {chromium}=await import(process.env.PLAYWRIGHT_IMPORT),root=path.resolve('app/src/main/assets');
const server=http.createServer((req,res)=>{try{const f=path.join(root,new URL(req.url,'http://local').pathname);res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.json':'application/json'})[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f));}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--single-process','--no-zygote','--disable-gpu']}),page=await browser.newPage();const errors=[],external=[];let panels=0;
page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url());});page.on('request',r=>{if(!r.url().startsWith(base))external.push(r.url());});
try{
 for(const [width,height]of [[320,568],[393,852],[852,393],[1280,800]]){
  await page.setViewportSize({width,height});for(const [key,g]of Object.entries(guides)){
   await page.goto(base+'/'+key+'.html');await page.locator('.reviewJump256').click();assert(await page.locator('#review256').evaluate(n=>n.open));assert.equal(await page.locator('#review256 table').count(),g.comparisons.length);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,key+' '+width);assert.equal(await page.locator('.compareScroll256').evaluateAll(nodes=>nodes.some(n=>n.scrollWidth>n.clientWidth+1)),false,'Table horizontal scroll '+key+' '+width);
   if(width===393&&['liver-lesions','rectal-cancer','endometriosis'].includes(key))await page.screenshot({path:'review/review256-'+key+'.png'});
  }
 }
 await page.setViewportSize({width:393,height:852});
 for(const [key,g]of Object.entries(guides))for(let i=0;i<g.comparisons.length;i++){await page.goto(base+'/'+key+'.html?compare256='+i);await page.waitForFunction(()=>document.documentElement.dataset.compare256==='ready');assert(await page.locator('#compare256-'+i).isVisible());}
 for(const [key,list,src]of [['liver-lesions',liver,c=>'liver-cases/'+c.file],['rectal-cancer',rectal,c=>'rectal-cases/'+c.file],['endometriosis',endo,c=>'endometriosis-cases/figure-'+String(c.figure).padStart(2,'0')+'.png']]){
  await page.goto(base+'/'+key+'.html');await page.locator('[data-tab=cases]').click();
  for(const c of list){await page.locator('#caseSelect').selectOption(c.id);const g=panelGuides[src(c)];assert.equal(await page.locator('.casePanelCue256').count(),g.cues.length);panels+=g.cues.length;
   const texts=await page.locator('.casePanelCue256').allTextContents();g.cues.forEach((text,i)=>assert(texts[i].endsWith(text)));
   await page.locator('.caseLimits256 summary').click();assert((await page.locator('.caseLimits256').innerText()).includes(g.limit));
   await page.locator('.panelButton').first().click();assert(await page.locator('#caseZoom').evaluate(d=>d.open));await page.locator('#caseZoomScale').fill('2');await page.locator('#caseZoomScale').dispatchEvent('input');await page.keyboard.press('Escape');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,key+' '+c.id);
   if(c===list[0])await page.locator('.casePanelCue256').first().screenshot({path:'review/panelcue256-'+key+'.png'});
  }
 }
 await page.goto(base+'/rectal-cancer.html');await page.locator('[data-tab=staging]').click();await page.locator('#mrf').fill('0');await page.locator('#source').selectOption({label:'Гладкий лимфоузел'});assert.match(await page.locator('#mrfResult').innerText(),/не определяет MRF\+/);assert.equal(await page.locator('#mrfResult').getAttribute('data-positive'),'false');
 await page.locator('[data-tab=report]').click();await page.locator('#makeReport').click();assert.match(await page.locator('#reportText').inputValue(),/MRF: не оценена/);
 await page.locator('[data-tab=staging]').click();await page.locator('#source').selectOption({label:'Опухоль'});await page.locator('#mrf').fill('1');assert.equal(await page.locator('#mrfResult').innerText(),'MRF+');await page.locator('#mrf').fill('1,1');assert.equal(await page.locator('#mrfResult').innerText(),'MRF−');
 assert.equal(panels,225);assert.deepEqual(errors,[]);assert.deepEqual(external,[]);fs.writeFileSync('review/browser-review256.json',JSON.stringify({pass:true,viewports:4,modules:12,comparisons:27,case_count:56,panel_cues:panels,mrf_scope_and_boundaries:true,errors,external},null,2));console.log('PASS browser review256: 12 modules x4, 27 direct links, 225 panel cues / 56 cases, zoom, MRF scope, no overflow / errors / external requests.');
}finally{await browser.close();server.close();}
