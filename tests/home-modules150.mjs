import assert from 'node:assert/strict';import fs from 'node:fs';import {spawn} from 'node:child_process';
import {regions} from '../app/src/main/assets/anatomy-regions.js';
const {chromium}=await import('/tmp/atlas-dom/node_modules/playwright/index.mjs');
const out='review/browser-1.50';fs.mkdirSync(out,{recursive:true});
const server=spawn('python3',['-m','http.server','8770','--bind','127.0.0.1'],{cwd:'app/src/main/assets',stdio:'ignore'});let browser;
try{
 browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});const context=await browser.newContext();const errors=[];
 // Cross-document transitions can reject when automated navigation closes a page.
 // Test layout/navigation with motion disabled; do not suppress application errors.
 await context.route('**/*',async r=>{const u=new URL(r.request().url());if(u.hostname!=='127.0.0.1')return r.abort();if(u.pathname.endsWith('/menus.css')){const response=await r.fetch();return r.fulfill({response,body:(await response.text())+'\n@view-transition{navigation:none}'});}return r.continue();});
 for(const viewport of [{width:393,height:852},{width:360,height:640},{width:320,height:568},{width:852,height:393}]){
 const page=await context.newPage();await page.setViewportSize(viewport);page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:8770/index.html');await page.waitForSelector('.areaCard:visible');await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
 assert.equal(await page.locator('.areaCard:visible').count(),12);
 const layout=await page.evaluate(()=>({h:innerHeight,w:innerWidth,sh:document.documentElement.scrollHeight,sw:document.documentElement.scrollWidth,cards:[...document.querySelectorAll('.areaCard')].map(e=>{const r=e.getBoundingClientRect(),t=e.querySelector('h3').getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,h:r.height,titleBottom:t.bottom,titleRight:t.right}})}));
 assert(layout.sh<=layout.h,'home fits height: '+JSON.stringify(layout));assert(layout.sw<=layout.w);
 for(const c of layout.cards){assert(c.h>=44);assert(c.bottom<=layout.h);assert(c.titleBottom<=c.bottom);assert(c.titleRight<=c.right);}
 await page.screenshot({path:`${out}/home-${viewport.width}x${viewport.height}.png`});
 await page.locator('#areaSearch').fill('сплетение');assert.equal(await page.locator('.areaCard:visible').count(),1);await page.locator('.areaCard:visible').click();await page.waitForSelector('.sectionCard');await page.locator('.backPill').click();await page.waitForSelector('.areaCard:visible');assert.equal(await page.locator('#areaSearch').inputValue(),'сплетение');await page.locator('#areaSearch').fill('');await page.close();
 }
 const page=await context.newPage();await page.setViewportSize({width:393,height:852});page.on('pageerror',e=>errors.push(e.message));
 for(const mod of ['upper-limb-mri','lower-limb-mri','brachial-plexus-mri']){
  const data=JSON.parse(fs.readFileSync('app/src/main/assets/'+mod+'-data.json'));await page.goto('http://127.0.0.1:8770/'+mod+'.html');await page.waitForSelector('.screenLabels circle');const select=page.locator('.panelHead select').first();assert.equal(await select.locator('option').count(),data.series.length);
  for(const s of data.series){await select.selectOption(s.id);await page.waitForFunction(()=>{const im=document.querySelector('.stage>img');return im.complete&&im.naturalWidth>0});await page.waitForTimeout(80);assert.equal(await page.locator('#error:not([hidden]),.failed:not([hidden])').count(),0);await page.screenshot({path:`${out}/${mod}-${s.sourceSeries}.png`});}
  // Exercise modes, search, frame range, zoom, comparison, fullscreen on real source data.
  const panel=page.locator('.panel').first();await panel.locator('.slice').fill('0');await panel.locator('.stage').dblclick();await panel.locator('.fullscreenButton').click();await panel.locator('.fullscreenButton').click();await page.locator('#compare').check();assert.equal(await page.locator('.panel').count(),2);await page.locator('#compare').uncheck();
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(out+'/result.json',JSON.stringify({passed:true,cards:regions.length,noScrolling:true,offline:true,viewports:4,newSeries:15}));
 console.log('PASS compact home on four viewports and all 15 source series offline');
}finally{await browser?.close();server.kill()}
