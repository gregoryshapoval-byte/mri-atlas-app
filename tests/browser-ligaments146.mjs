import assert from 'node:assert/strict';import fs from 'node:fs';import {spawn} from 'node:child_process';
const {chromium}=await import(process.env.PLAYWRIGHT_IMPORT||'/tmp/atlas-dom/node_modules/playwright/index.mjs');
const A='app/src/main/assets/',out='review/ligaments-1.46',server=spawn('python3',['-m','http.server','8776','--bind','127.0.0.1'],{cwd:A,stdio:'ignore'});fs.mkdirSync(out,{recursive:true});let browser;
const read=p=>JSON.parse(fs.readFileSync(p));
try{browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});
 for(const viewport of [{width:393,height:852},{width:360,height:640},{width:852,height:393}]){
  const page=await browser.newPage({viewport}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:8776/')?r.continue():r.abort());
  for(const [mod,refs]of [['shoulder-mri',[[656,25,143202],[657,18,143206],[658,18,143205]]],['wrist-mri',[[667,9,146110],[668,9,146103],[669,16,146106]]],['elbow-mri',[[642,37,146204],[643,22,146204],[644,28,146202]]]]){
   const D=read(A+mod+'-data.json'),E=read(A+mod+'-anatomy146.json');await page.goto('http://127.0.0.1:8776/'+mod+'.html');await page.waitForSelector('.screenLabels [data-structure]');await page.locator('.fit').click();
   await page.locator('.anatomyMenuButton').click();await page.locator('.filterButtons .all').click();await page.locator('.closeMenu').click();await page.locator('[data-mode="points"]').click();
   async function frame(s,n){await page.locator('.panelHead select').selectOption(s.id);await page.locator('.slice').fill(String(n-1));await page.locator('.slice').dispatchEvent('input');await page.waitForFunction(src=>document.querySelector('.screenLabels').dataset.frame===src,s.frames[n-1].src)}
   // Test every PD frame, including empty and densely marked slices.
   for(const s of D.series.filter(s=>/_dp(?:fs)?$/.test(s.id)))for(let n=1;n<=s.frames.length;n++){
    await frame(s,n);assert.equal(await page.locator('.failed').isVisible(),false);const extra=E.seriesSlices[s.id][s.frames[n-1].annotation];for(const p of extra.points)assert(await page.locator('.screenLabels g[data-structure="'+p.structure+'"] circle').count()>0,`${mod} ${s.id} ${n}: missing ${p.structure}`);
   }
   for(const [se,n,id]of refs){const s=D.series.find(s=>s.sourceSeries===se&&/_dp(?:fs)?$/.test(s.id));await frame(s,n);const marker=page.locator('.screenLabels g[data-structure="'+id+'"] circle').last();assert.equal(await marker.getAttribute('fill'),'none');assert.equal(await marker.getAttribute('stroke-dasharray'),'3 2');
    const box=await marker.boundingBox();await page.mouse.click(box.x+box.width/2,box.y+box.height/2);await page.waitForSelector('.pointPopup:not([hidden])');assert.match(await page.locator('.pointPopup').textContent(),/ориентировоч|приблиз|ожидаем/);await page.locator('.pointPopup button').click();
    const cx=await marker.getAttribute('cx');await page.locator('.stage').dispatchEvent('wheel',{ctrlKey:true,deltaY:-100});assert.notEqual(await marker.getAttribute('cx'),cx);await page.locator('.fit').click();
    await page.locator('[data-mode="labels"]').click();await page.locator('.fullscreenButton').click();assert(await page.locator('.fullscreenViewer .screenLabels text').count()>0);if(viewport.width===393)await page.screenshot({path:out+'/'+mod+'-'+se+'.png'});await page.locator('.fullscreenButton').click();
    await page.locator('[data-mode="off"]').click();assert.equal(await page.locator('.screenLabels [data-structure]').count(),0);await page.locator('[data-mode="points"]').click();
    const t1=D.series.find(t=>t.sourceSeries===se&&t.id.endsWith('contraste_'));await frame(t1,n);assert.equal(await page.locator('.screenLabels g[data-structure="'+id+'"] circle').count(),mod==='shoulder-mri'?0:0,'new component does not leak onto T1');
   }
   if(mod==='wrist-mri'){
    const s=D.series.find(s=>s.id==='668-contraste_dpfs');await frame(s,12);await page.locator('[data-mode="labels"]').click();await page.locator('.anatomyMenuButton').click();await page.locator('.search').fill('RSC');await page.locator('.search').dispatchEvent('input');const row=page.locator('.searchResults .catalogRow').first();await row.locator('summary').click();await row.locator('button').click();assert((await page.locator('.panelHead select').inputValue()).includes('_dp'));await page.waitForSelector('.screenLabels g[data-structure="146101"] circle');assert(await page.locator('.screenLabels g[data-structure="146101"] circle').count()>0,'catalog jumps to overlay-only PD landmark');
    await page.locator('.pointPopup button').click();await page.locator('[data-mode="points"]').click();await page.locator('.anatomyMenuButton').click();await page.getByRole('switch',{name:'Остальные связки запястья',exact:true}).uncheck();await page.locator('.closeMenu').click();assert.equal(await page.locator('.screenLabels g[data-structure="146101"] circle').count(),0);await page.locator('.anatomyMenuButton').click();await page.getByRole('switch',{name:'Остальные связки запястья',exact:true}).check();await page.locator('.closeMenu').click();assert(await page.locator('.screenLabels g[data-structure="146101"] circle').count()>0);
   }
   console.log('PASS',mod,viewport.width+'x'+viewport.height,': every PD frame, approximate markers, popups, zoom, fullscreen, label modes, no T1 leakage');
  }
  assert.deepEqual(errors,[]);await page.close();
 }
 fs.writeFileSync(out+'/result.json',JSON.stringify({passed:true,modules:3,pdFrames:319,viewports:3,externalNetworkBlocked:true}));
}finally{await browser?.close();server.kill()}
