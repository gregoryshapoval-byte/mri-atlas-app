import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
const {chromium}=await import(process.env.PLAYWRIGHT_IMPORT||'/tmp/atlas-dom/node_modules/playwright/index.mjs');
const root=path.resolve('app/src/main/assets'),out='review/browser-sellar193';fs.mkdirSync(out,{recursive:true});
const mime={'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.json':'application/json'};
const server=http.createServer((req,res)=>{try{const f=path.join(root,decodeURIComponent(new URL(req.url,'http://local').pathname));res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f));}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});const errors=[],external=[];
try{
for(const [width,height]of [[320,568],[393,852],[852,393],[1280,800]]){
 const page=await browser.newPage({viewport:{width,height}});
 page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});page.on('request',r=>{if(!r.url().startsWith(base))external.push(r.url());});
 await page.goto(base+'/region.html?area=brain');await page.getByRole('link',{name:/Опухоли головного мозга/}).click();
 assert.equal(await page.locator('a[href="sellar.html"]').count(),1);
 assert.equal(await page.locator('a.moduleLink').count(),11);
 await page.screenshot({path:out+'/'+width+'-hub.png',fullPage:true});
 await page.locator('a[href="sellar.html"]').click();await page.waitForSelector('#featureFigure svg');
 assert.equal(await page.locator('[role=tab]').count(),5);
 for(const id of ['anatomy','micro','macro','apoplexy']){
  await page.locator('[data-feature="'+id+'"]').click();assert.equal(await page.locator('[data-feature][aria-pressed=true]').count(),1);assert.equal(await page.locator('#featureLegend li').count(),3);
  assert.ok((await page.locator('#featureTrap').innerText()).length>30);
  assert.equal(await page.locator('#featureFigure svg path').evaluateAll(ps=>ps.every(p=>p.getTotalLength()>0)),true);
  await page.screenshot({path:out+'/'+width+'-'+id+'.png',fullPage:true});
  await page.locator('#featureFigure').click();assert.equal(await page.locator('#zoom').evaluate(d=>d.open),true);
  if(id==='anatomy')await page.screenshot({path:out+'/'+width+'-zoom.png'});
  await page.keyboard.press('Escape');assert.equal(await page.locator('#zoom').evaluate(d=>d.open),false);
 }
 await page.locator('[data-tab=knosp]').click();
 for(const id of ['0','1','2','3A','3B','4']){
  await page.locator('button[data-knosp="'+id+'"]').click();
  assert.equal(await page.locator('button[data-knosp][aria-pressed=true]').count(),1);
  assert.match(await page.locator('#knospTitle').innerText(),new RegExp('Knosp '+id+'$'));
  assert.equal(await page.locator('#knospFigure svg path').evaluateAll(ps=>ps.every(p=>p.getTotalLength()>0)),true);
  await page.screenshot({path:out+'/'+width+'-knosp-'+id+'.png',fullPage:true});
  await page.locator('#knospFigure').click();assert.equal(await page.locator('#zoom').evaluate(d=>d.open),true);await page.keyboard.press('Escape');
 }
 for(const tab of ['features','knosp','differences','scanning','report']){
  await page.locator('[data-tab="'+tab+'"]').click();assert.equal(await page.locator('[role=tabpanel]:visible').count(),1);
  for(const detail of await page.locator('#'+tab+' details').all())await detail.evaluate(d=>d.open=true);
  await page.locator('#sources').evaluate(d=>d.open=true);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,width+' '+tab);
  await page.screenshot({path:out+'/'+width+'-'+tab+'.png',fullPage:true});
 }
 assert.equal(await page.locator('#locationRows tr').count(),4);assert.equal(await page.locator('#scanRows tr').count(),5);assert.equal(await page.locator('#differentials article').count(),4);
 assert.equal(await page.locator('#checklist input').count(),7);
 await page.locator('#checklist input').first().check();assert.equal(await page.locator('#checklist input').first().isChecked(),true);
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async t=>window.copied=t}}));
 await page.locator('#reportCards .copy').nth(1).click();await page.waitForFunction(()=>document.querySelector('#copyStatus').textContent.startsWith('Скопировано'));assert.match(await page.evaluate(()=>window.copied),/аденомы гипофиза/);
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('Denied')}}}));
 await page.locator('#reportCards .copy').first().click();assert.equal(await page.locator('#copyFallback').isVisible(),true);assert.match(await page.locator('#copyFallback').inputValue(),/размерами/);
 await page.locator('[data-tab=features]').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('[data-tab=knosp]').getAttribute('aria-selected'),'true');
 await page.keyboard.press('End');assert.equal(await page.locator('[data-tab=report]').getAttribute('aria-selected'),'true');
 await page.getByRole('link',{name:'‹ Опухоли мозга',exact:true}).click();await page.getByRole('link',{name:'‹ Головной мозг',exact:true}).click();await page.waitForSelector('#heading');assert.match(await page.locator('#heading').innerText(),/Головной мозг/);await page.close();
}
assert.deepEqual(errors,[]);assert.deepEqual(external,[]);console.log('PASS sellar193 browser: region/hub/sellar, ten diagrams including six Knosp grades, five panels x4 viewports, zoom, keyboard, clipboard/fallback, checklist, layout and offline.');
}finally{await browser.close();server.close();}

