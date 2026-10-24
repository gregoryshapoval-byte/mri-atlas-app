import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
const {chromium}=await import(process.env.PLAYWRIGHT_IMPORT||'/tmp/atlas-dom/node_modules/playwright/index.mjs');
const root=path.resolve('app/src/main/assets'),out='review/browser-orads183';
fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{
 const file=path.join(root,decodeURIComponent(new URL(req.url,'http://local').pathname));
 try{const data=fs.readFileSync(file);res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':file.endsWith('.html')?'text/html':'application/octet-stream');res.end(data);}catch{res.statusCode=404;res.end();}
});
await new Promise(resolve=>server.listen(8765,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});
const errors=[];
try{
 for(const [width,height] of [[393,852],[320,568],[852,393],[1280,800]]){
  const page=await browser.newPage({viewport:{width,height}});
  page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('http://127.0.0.1:8765/region.html?area=pelvis');
  await page.getByRole('link',{name:/Образования придатков/}).click();
  await page.waitForSelector('#categoryChoices button');
  assert.equal(await page.locator('input,select,textarea,[data-tab]').count(),0);
  assert.equal(await page.locator('#assessment,#report').count(),0);
  for(const [score,count]of [[0,1],[1,3],[2,7],[3,5],[4,3],[5,3]]){
   await page.locator('[data-category="'+score+'"]').click();
   assert.equal(await page.locator('.caseCard').count(),count);
   assert.match(await page.locator('#schemeCategory').innerText(),new RegExp('MRI '+score));
   assert.equal(await page.locator('.caseFigure svg path').evaluateAll(paths=>paths.every(p=>p.getTotalLength()>0)),true);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
   assert.doesNotMatch(await page.locator('#caseCards').innerText(),/усиливающ|усиливается|усиливаются/iu);
   await page.screenshot({path:out+'/'+width+'-category'+score+'.png',fullPage:true});
  }
  await page.locator('[data-category="2"]').click();
  assert.match(await page.locator('[data-case="endo"]').innerText(),/Истинно многокамерная.*3/u);
  await page.locator('[data-category="3"]').click();
  assert.match(await page.locator('[data-case="bloodWall"]').innerText(),/гладкая стенка накапливает контраст/u);
  await page.getByText('Как понимать подписи',{exact:true}).click();
  assert.match(await page.locator('.quickGuide').innerText(),/Это не означает утолщение стенки/u);
  await page.getByRole('link',{name:'‹ Малый таз'}).click();
  await page.waitForSelector('#cards');
  await page.close();
 }
 assert.deepEqual(errors,[]);
 console.log('PASS O-RADS183: no assessment/report forms, 22 schemes x4 viewports, clear contrast wording, SVG paths, mobile bounds, explanations and menu return');
}finally{await browser.close();server.close();}
