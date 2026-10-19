import assert from 'node:assert/strict';import fs from 'node:fs';import {spawn} from 'node:child_process';
const {chromium}=await import(process.env.PLAYWRIGHT_IMPORT||'/tmp/atlas-dom/node_modules/playwright/index.mjs');
const A='app/src/main/assets/',out='review/hip-1.47',server=spawn('python3',['-m','http.server','8777','--bind','127.0.0.1'],{cwd:A,stdio:'ignore'});fs.mkdirSync(out,{recursive:true});let browser;
const read=p=>JSON.parse(fs.readFileSync(p)),D=read(A+'hip-mri-data.json'),E=read(A+'hip-mri-anatomy147.json');
try{browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});
 for(const viewport of [{width:393,height:852},{width:360,height:640},{width:852,height:393}]){
  const page=await browser.newPage({viewport}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:8777/')?r.continue():r.abort());
  await page.goto('http://127.0.0.1:8777/hip-mri.html');await page.waitForSelector('.screenLabels [data-structure]');await page.locator('.fit').click();
  await page.locator('.anatomyMenuButton').click();await page.locator('.filterButtons .all').click();await page.locator('.closeMenu').click();await page.locator('[data-mode="points"]').click();
  async function frame(s,n){await page.locator('.panelHead select').selectOption(s.id);await page.locator('.slice').fill(String(n-1));await page.locator('.slice').dispatchEvent('input');await page.waitForFunction(src=>document.querySelector('.screenLabels').dataset.frame===src,s.frames[n-1].src)}
  for(const s of D.series.filter(s=>/_dp(?:fs)?$/.test(s.id)))for(let n=1;n<=s.frames.length;n++){
   await frame(s,n);assert.equal(await page.locator('.failed').isVisible(),false);for(const p of E.seriesSlices[s.id][s.frames[n-1].annotation].points)assert(await page.locator('.screenLabels g[data-structure="'+p.structure+'"] circle').count()>0,`${s.id} ${n}: ${p.structure}`);
  }
  // Select only the new groups for readable screenshot review, without replacing source settings.
  await page.locator('.anatomyMenuButton').click();await page.locator('.filterButtons .none').click();
  for(const f of E.filters)await page.getByRole('switch',{name:f.name,exact:true}).check();await page.locator('.closeMenu').click();
  for(const [se,n,id]of [[632,39,147104],[633,18,147103],[633,20,147205],[634,30,147101]]){
   const s=D.series.find(s=>s.sourceSeries===se&&/_dp(?:fs)?$/.test(s.id));await frame(s,n);const marker=page.locator('.screenLabels g[data-structure="'+id+'"] circle').last();assert.equal(await marker.getAttribute('fill'),'none');assert.equal(await marker.getAttribute('stroke-dasharray'),'3 2');
   const box=await marker.boundingBox();await page.mouse.click(box.x+box.width/2,box.y+box.height/2);await page.waitForSelector('.pointPopup:not([hidden])');assert.match(await page.locator('.pointPopup').textContent(),/ориентировоч|ожидаем/);await page.locator('.pointPopup button').click();
   const cx=await marker.getAttribute('cx');await page.locator('.stage').dispatchEvent('wheel',{ctrlKey:true,deltaY:-100});assert.notEqual(await marker.getAttribute('cx'),cx);await page.locator('.fit').click();await page.locator('[data-mode="labels"]').click();
   await page.locator('.fullscreenButton').click();assert(await page.locator('.fullscreenViewer .screenLabels text').count()>0);if(viewport.width===393)await page.screenshot({path:out+'/'+se+'-'+n+'.png'});await page.locator('.fullscreenButton').click();
   await page.locator('[data-mode="off"]').click();assert.equal(await page.locator('.screenLabels [data-structure]').count(),0);await page.locator('[data-mode="points"]').click();
   const t1=D.series.find(t=>t.sourceSeries===se&&t.id.endsWith('contraste_'));await frame(t1,n);assert.equal(await page.locator('.screenLabels g[data-structure="'+id+'"] circle').count(),0);
  }
  await frame(D.series.find(s=>s.id==='633-contraste_dpfs'),20);await page.locator('.anatomyMenuButton').click();await page.getByRole('switch',{name:E.filters[1].name,exact:true}).uncheck();await page.locator('.closeMenu').click();assert.equal(await page.locator('.screenLabels g[data-structure="147205"] circle').count(),0);assert(await page.locator('.screenLabels g[data-structure="147105"] circle').count()>0);
  await page.locator('.anatomyMenuButton').click();await page.getByRole('switch',{name:E.filters[1].name,exact:true}).check();await page.locator('.closeMenu').click();assert(await page.locator('.screenLabels g[data-structure="147205"] circle').count()>0);
  assert.deepEqual(errors,[]);console.log('PASS hip',viewport.width+'x'+viewport.height,': all PD frames, popups, zoom, modes, fullscreen, independent groups');await page.close();
 }
 fs.writeFileSync(out+'/result.json',JSON.stringify({passed:true,pdFrames:126,viewports:3,externalNetworkBlocked:true}));
}finally{await browser?.close();server.kill()}
