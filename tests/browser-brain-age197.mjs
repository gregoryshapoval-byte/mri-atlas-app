import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
const {chromium}=await import(process.env.PLAYWRIGHT_IMPORT||'/tmp/atlas-dom/node_modules/playwright/index.mjs');
const root=path.resolve('app/src/main/assets'),out='review/browser-brain-age197';fs.mkdirSync(out,{recursive:true});
const mime={'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.json':'application/json'};
const server=http.createServer((req,res)=>{try{const f=path.join(root,decodeURIComponent(new URL(req.url,'http://local').pathname));res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f));}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});const errors=[],external=[];
try{
for(const [width,height]of [[320,568],[393,852],[852,393],[1280,800]]){
 const page=await browser.newPage({viewport:{width,height}});page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});page.on('request',r=>{if(!r.url().startsWith(base))external.push(r.url());});
 await page.goto(base+'/brain-tumors.html');
 const all=['meningioma.html','sellar.html','glioblastoma.html','vestibular.html','diffuse-gliomas.html','cns-lymphoma.html','ependymal.html','pilocytic.html','craniopharyngioma.html','glioneuronal.html','hemangioblastoma.html','neurocytoma.html'];
 const expected={all,child:['pilocytic.html','ependymal.html','craniopharyngioma.html','glioneuronal.html'],aya:['sellar.html','meningioma.html','vestibular.html','diffuse-gliomas.html','pilocytic.html','glioneuronal.html','neurocytoma.html'],older:['meningioma.html','sellar.html','glioblastoma.html','vestibular.html','diffuse-gliomas.html','cns-lymphoma.html']};
 for(const [age,order]of Object.entries(expected)){
  await page.locator('[data-age="'+age+'"]').click();assert.equal(await page.locator('[data-age][aria-pressed=true]').count(),1);
  assert.deepEqual(await page.locator('#primaryCards .moduleLink').evaluateAll(xs=>xs.map(x=>x.getAttribute('href'))),order);
  assert.equal(await page.locator('a.moduleLink').count(),13);assert.equal(await page.locator('a.moduleLink').evaluateAll(xs=>new Set(xs.map(x=>x.getAttribute('href'))).size),13);
  assert.equal(await page.locator('#other').isVisible(),age!=='all');assert.equal(await page.locator('#ageLimits').isVisible(),age==='child'||age==='aya');
  assert.deepEqual(await page.locator('#secondary .moduleLink').evaluateAll(xs=>xs.map(x=>x.getAttribute('href'))),['brain-metastases.html']);
  await page.locator('#frequency').evaluate(d=>d.open=true);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  await page.screenshot({path:out+'/'+width+'-'+age+'.png',fullPage:true});
 }
 await page.locator('[data-age=child]').click();await page.locator('a[href="pilocytic.html"]').click();await page.waitForSelector('#featureFigure svg');await page.getByRole('link',{name:'‹ Опухоли мозга',exact:true}).click();assert.equal(await page.locator('[data-age=child]').getAttribute('aria-pressed'),'true');
 await page.reload();assert.equal(await page.locator('[data-age=child]').getAttribute('aria-pressed'),'true');
 await page.goto(base+'/brain-tumors.html?age=unknown');assert.equal(await page.locator('[data-age=all]').getAttribute('aria-pressed'),'true');await page.close();
}
const fallback=await browser.newPage({viewport:{width:320,height:568}});await fallback.addInitScript(()=>Object.defineProperty(window,'sessionStorage',{get(){throw Error('Blocked')}}));await fallback.goto(base+'/brain-tumors.html');assert.equal(await fallback.locator('[data-age=all]').getAttribute('aria-pressed'),'true');await fallback.locator('[data-age=child]').click();assert.equal(await fallback.locator('[data-age=child]').getAttribute('aria-pressed'),'true');await fallback.close();
assert.deepEqual(errors,[]);assert.deepEqual(external,[]);console.log('PASS brain-age197: all four age plans x4 viewports, exact priorities, shared URLs/no lost modules, metastases separate, limits, return/reload and blocked-storage fallback.');
}finally{await browser.close();server.close();}
