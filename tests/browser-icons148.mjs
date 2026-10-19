import assert from 'node:assert/strict';import fs from 'node:fs';import{spawn}from'node:child_process';
const{chromium}=await import(process.env.PLAYWRIGHT_IMPORT||'/tmp/atlas-dom/node_modules/playwright/index.mjs');
const A='app/src/main/assets/',out='review/icons-1.48',server=spawn('python3',['-m','http.server','8778','--bind','127.0.0.1'],{cwd:A,stdio:'ignore'});fs.mkdirSync(out,{recursive:true});let browser;
try{browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});
 for(const viewport of [{width:393,height:852},{width:360,height:640},{width:852,height:393}]){
  const page=await browser.newPage({viewport}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:8778/')?r.continue():r.abort());
  for(const name of ['brain','wrist-mri','elbow-mri','male-pelvis-mri','female-pelvis-mri','shoulder-mri','foot-mri','knee-mri','face-neck-mri','hip-mri','spine-mri']){
   await page.goto('http://127.0.0.1:8778/'+name+'.html');await page.waitForSelector('.screenLabels [data-structure]');await page.locator('.anatomyMenuButton').click();
   async function check(){await page.locator('.groupOpen img').first().waitFor();const images=await page.locator('.groupOpen img').evaluateAll(async imgs=>{await Promise.all(imgs.map(im=>im.decode()));return imgs.map(im=>({width:im.naturalWidth,height:im.naturalHeight,src:im.getAttribute('src')}))});assert(images.length>0);for(const im of images){assert.equal(im.width,96);assert.equal(im.height,96);assert(im.src.startsWith('data:image/svg+xml'))}assert.equal(await page.locator('.groupOpen').count(),images.length)}
   await check();if(viewport.width===393&&['brain','hip-mri','wrist-mri','female-pelvis-mri'].includes(name))await page.screenshot({path:out+'/'+name+'-top.png'});
   // Exercise nested categories and return, preserving existing navigation and switches.
   const label=await page.locator('.compactGroup>input').first().getAttribute('aria-label');await page.locator('.groupOpen').first().click();assert(await page.locator('.groupBack').isVisible());await page.locator('.groupBack').click();await check();assert.equal(await page.locator('.compactGroup>input').first().getAttribute('aria-label'),label);
   const toggle=page.locator('.compactGroup>input').first(),before=await toggle.isChecked();await toggle.click();assert.equal(await page.locator('.compactGroup>input').first().isChecked(),!before);
   await page.locator('.drawerBody').evaluate(el=>el.scrollTop=el.scrollHeight);if(viewport.width===393&&['brain','hip-mri','wrist-mri'].includes(name))await page.screenshot({path:out+'/'+name+'-bottom.png'});await page.locator('.closeMenu').click();assert.equal(await page.locator('#error').isVisible(),false);console.log('PASS anatomy icons',name,viewport.width+'x'+viewport.height);
  }
  assert.deepEqual(errors,[]);
  if(viewport.width===393){await page.goto('http://127.0.0.1:8778/hip-mri.html');await page.waitForSelector('.anatomyMenuButton');await page.evaluate(async rows=>{const{anatomyGroupIcon}=await import('./anatomy-icons.js');document.body.replaceChildren();document.body.style.cssText='background:#10171f;margin:0;padding:20px;display:grid;grid-template-columns:repeat(6,1fr);gap:12px;color:#d7e3ec;font:11px system-ui';document.documentElement.style.overflow='auto';document.body.className='';for(const r of rows){const el=document.createElement('div'),im=document.createElement('img');im.src=anatomyGroupIcon(r,r.module);im.width=96;im.height=96;el.append(im,document.createElement('br'),document.createTextNode(r.key));document.body.append(el)}await Promise.all([...document.images].map(im=>im.decode()))},[...new Map(JSON.parse(fs.readFileSync('review/anatomy-icons-1.48.json')).map(r=>[r.key,r])).values()]);await page.setViewportSize({width:700,height:900});await page.screenshot({path:out+'/icon-sheet.png',fullPage:true})}
  await page.close();
 }
 fs.writeFileSync(out+'/result.json',JSON.stringify({passed:true,modules:11,viewports:3,externalNetworkBlocked:true}));
}finally{await browser?.close();server.kill()}
