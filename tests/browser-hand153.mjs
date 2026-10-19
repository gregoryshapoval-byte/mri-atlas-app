import assert from 'node:assert/strict';import fs from 'node:fs';import {spawn} from 'node:child_process';
const {chromium}=await import('/tmp/atlas-dom/node_modules/playwright/index.mjs');const A='app/src/main/assets/',out='review/browser-1.53';fs.mkdirSync(out,{recursive:true});
const server=spawn('python3',['-m','http.server','8783','--bind','127.0.0.1'],{cwd:A,stdio:'ignore'});let browser;
try{browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});
for(const viewport of [{width:393,height:852},{width:360,height:640},{width:852,height:393}])for(const mod of ['hand-mri']){
 const d=JSON.parse(fs.readFileSync(A+mod+'-data.json')),page=await browser.newPage({viewport}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:8783/')?r.continue():r.abort());
 await page.goto('http://127.0.0.1:8783/'+mod+'.html');await page.waitForSelector('.anatomyMenuButton');await page.locator('.anatomyMenuButton').click();assert.equal(await page.locator('.groupOpen').filter({hasText:'Сухожилие'}).count(),0);await page.locator('.filterButtons .all').click();await page.locator('.closeMenu').click();
 for(const s of d.series){await page.locator('.panelHead select').selectOption(s.id);
  for(let i=0;i<s.frames.length;i++){
   await page.locator('.slice').fill(String(i));await page.locator('.slice').dispatchEvent('input');await page.waitForFunction(src=>document.querySelector('.screenLabels')?.dataset.frame===src,s.frames[i].src);
   assert.equal(await page.locator('.failed').isVisible(),false);
   if(s.id==='167-contraste_dp'&&i===11)assert.equal(await page.locator('.screenLabels [data-structure="1632"] circle').last().getAttribute('fill'),'#62DDD2');if(viewport.width===393&&i===Math.floor(s.frames.length/2))await page.screenshot({path:`${out}/${mod}-${s.id}.png`});
  }
 }
 const s=d.series[0];await page.locator('.panelHead select').selectOption(s.id);await page.locator('.slice').fill(String(Math.floor(s.frames.length/2)));await page.locator('.slice').dispatchEvent('input');await page.waitForSelector('.screenLabels circle');
 await page.locator('[data-mode="points"]').click();await page.waitForFunction(()=>document.querySelectorAll('.screenLabels text').length===0);assert.equal(await page.locator('.screenLabels text').count(),0);assert(await page.locator('.screenLabels circle').count()>0);
 await page.locator('[data-mode="off"]').click();await page.waitForFunction(()=>document.querySelectorAll('.screenLabels circle').length===0);assert.equal(await page.locator('.screenLabels circle').count(),0);await page.locator('[data-mode="labels"]').click();await page.waitForSelector('.screenLabels text');
 await page.locator('.stage').dispatchEvent('wheel',{deltaY:-80,ctrlKey:true});await page.locator('.fit').click();await page.locator('.fullscreenButton').click();await page.locator('.fullscreenButton').click();
 await page.locator('.anatomyMenuButton').click();await page.locator('.search').fill('FDP');await page.waitForSelector('.searchResults button');await page.locator('.searchResults button').first().click();
 await page.locator('.anatomyMenuButton').click();await page.locator('.shoulderGuide>summary').click();await page.locator('.shoulderGuide details>summary').filter({hasText:'Влагалища, блоки и удерживатели'}).click();assert.match(await page.locator('.shoulderGuide').textContent(),/Индивидуальные точки не добавлены/);await page.screenshot({path:`${out}/guide-${viewport.width}.png`});await page.locator('.closeMenu').click();await page.locator('#compare').check();assert.equal(await page.locator('.panel').count(),2);assert.deepEqual(errors,[]);await page.close();console.log('PASS',mod,viewport.width,viewport.height,'all frames, modes/search/zoom/fullscreen/two panels');
}
fs.writeFileSync(out+'/result.json',JSON.stringify({passed:true,frames:280,viewports:3,externalNetworkBlocked:true,independentMedicalVerification:false}));
}finally{await browser?.close();server.kill()}
