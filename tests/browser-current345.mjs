import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_IMPORT);const repo=path.dirname(path.dirname(fileURLToPath(import.meta.url))),root=path.join(repo,'build/runtime-assets');
const origin='https://appassets.androidplatform.net',mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH}),results=[];
try{
 for(const viewport of [{width:360,height:800},{width:393,height:852},{width:852,height:393},{width:1280,height:800}]){
  const context=await browser.newContext({viewport}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.origin!==origin)return route.abort();const f=path.resolve(root,'.'+decodeURIComponent(u.pathname).replace(/^\/assets/,''));if(!f.startsWith(root+path.sep)||!fs.existsSync(f)){errors.push('Missing '+u.pathname);return route.fulfill({status:404,body:''});}await route.fulfill({status:200,contentType:mime[path.extname(f)]||'application/octet-stream',body:fs.readFileSync(f)});});
  for(const [query,href,anchor]of [['SMART','perianal-cases.html#smart2024','smart2024'],['RIFIL','perianal-cases.html#smart-rifil','smart-rifil'],['HOPE','perianal-cases.html#smart-hope','smart-hope']]){
   await page.goto(origin+'/assets/index.html');await page.locator('#areaSearch').fill(query);const first=page.locator('.searchCard252 a').first();assert.equal(await first.getAttribute('href'),href);await first.click();await page.waitForSelector('#smart2024[open]');assert(await page.locator('#report').isVisible());assert(await page.locator('#'+anchor).isVisible());assert.equal(await page.locator('[data-section="report"]').getAttribute('aria-pressed'),'true');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'overflow '+viewport.width+' '+query);
  }
  await page.goto(origin+'/assets/index.html');for(const q of ['PI-RR','pirr','пи рр']){await page.locator('#areaSearch').fill(q);assert.equal(await page.locator('.searchCard252 a').first().getAttribute('href'),'prostate-recurrence.html');}
  await page.goto(origin+'/assets/nvc310.html');
  const comparison=page.locator('#nvc-compare');
  assert.equal(await comparison.locator('img:visible').count(),4);
  await comparison.getByText('Сравнить в аксиальной и косой сагиттальной плоскостях').click();
  assert.equal(await comparison.locator('img:visible').count(),8);
  assert(await comparison.locator('img').evaluateAll(images=>images.every(image=>image.complete&&image.naturalWidth>0)));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'NVC overflow '+viewport.width);
  await comparison.getByRole('link',{name:'Три реконструкции одного случая'}).click();
  await page.locator('#n306-case-v-indentation').waitFor();
  await page.goto(origin+'/assets/nvc310.html');
  await comparison.getByRole('link',{name:'Все три плоскости',exact:true}).last().click();
  await page.locator('#n306-case-vii-deformity').waitFor();
  await page.goto(origin+'/assets/brain-oncology247.html');
  const diffusionButton=page.getByRole('button',{name:'Сравнить DWI и ADC на снимках'});
  await diffusionButton.click();
  const diffusion=page.getByRole('dialog',{name:'DWI и ADC на реальных снимках'});
  await diffusion.waitFor();
  assert.equal(await diffusion.locator('[data-case-id]').count(),5);
  const ids=await diffusion.locator('[data-case-id]').evaluateAll(cards=>cards.map(card=>card.dataset.caseId));
  assert.equal(new Set(ids).size,5);
  const pairs=diffusion.locator('.diffusion-pair327');
  for(const pair of await pairs.all()){
   assert.equal(await pair.locator('figure').count(),2);
   assert.match(await pair.locator('figcaption').first().textContent(),/DWI/);
   assert.match(await pair.locator('figcaption').last().textContent(),/ADC/);
  }
  await diffusion.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
  assert.equal(await diffusion.evaluate(dialog=>dialog.scrollWidth>dialog.clientWidth+1),false,'DWI/ADC dialog overflow '+viewport.width);
  await diffusion.locator('[data-case-id="PMC12186845-case1"] button').last().click();
  const zoom=page.locator('#zoom327');
  await zoom.waitFor();
  assert.match(await zoom.locator('h2').textContent(),/ADC/);
  await zoom.getByRole('button',{name:'Закрыть ×'}).click();
  await zoom.waitFor({state:'hidden'});
  await diffusion.getByRole('button',{name:'Закрыть ×'}).click();
  await diffusion.waitFor({state:'hidden'});
  assert(await diffusionButton.evaluate(button=>button===document.activeElement));

  await page.goto(origin+'/assets/brain-oncology247.html?n_enhance=ring&n_adc=center_low');
  const abscess=page.locator('[data-entity="abscess"], [data-less-entity="abscess"]').first();
  await abscess.getByRole('button',{name:'Снимки и сравнение'}).click();
  const example=page.locator('[data-example="brain-infections--abscess-gd"]');
  await example.waitFor();
  assert.match(await example.textContent(),/Совпадает по разметке случая: .*DWI и ADC/);
  assert.deepEqual(errors,[]);results.push({viewport,searchAndDeepLinks:true,nvcComparison:true,diffusionComparison:true,noOverflow:true});await context.close();
 }
 fs.writeFileSync(path.join(repo,'build/browser-current345.json'),JSON.stringify({pass:true,results},null,2));console.log('PASS browser current search and SMART targets at four viewport sizes.');
}finally{await browser.close();}
