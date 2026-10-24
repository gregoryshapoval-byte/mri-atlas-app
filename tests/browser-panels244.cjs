const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH}),results=[];
 const out=path.resolve('review/browser-panels244');fs.mkdirSync(out,{recursive:true});
 const modules=[['liver','liver-lesions.html',24],['rectal','rectal-cancer.html',20],['endometriosis','endometriosis.html',12]];
 for(const [width,height] of [[393,852],[320,568],[852,393]])for(const [module,file,count] of modules){
  const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage(),errors=[],external=[],missing=[];
  page.on('pageerror',e=>errors.push(e.message));
  await context.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname!=='atlas.test'){external.push(u.href);return r.abort();}const p=path.join(process.cwd(),'app/src/main/assets',decodeURIComponent(u.pathname));if(!fs.existsSync(p)){missing.push(p);return r.fulfill({status:404,body:'missing'});}const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};return r.fulfill({status:200,body:fs.readFileSync(p),contentType:types[path.extname(p)]||'application/octet-stream'});});
  await page.goto('http://atlas.test/'+file);await page.locator('[data-tab="cases"]').click();await page.waitForSelector('#caseSelect');
  const ids=await page.locator('[data-case]').evaluateAll(ns=>ns.map(n=>n.dataset.case));assert.equal(ids.length,count);let panels=0;
  for(const id of ids){
   await page.locator('#caseSelect').selectOption(id);await page.locator('.panelCrop img').evaluateAll(ns=>Promise.all(ns.map(i=>i.decode())));
   const geometry=await page.locator('.casePanel').evaluateAll(ns=>ns.map(n=>{const b=n.querySelector('.panelCrop'),im=b.querySelector('img'),r=b.getBoundingClientRect();return{top:r.top,bottom:r.bottom,left:r.left,width:r.width,height:r.height,parent:n.getBoundingClientRect().width,caption:n.querySelector('figcaption').textContent,src:im.getAttribute('src'),imageWidth:im.getBoundingClientRect().width};}));
   assert(geometry.length>0);panels+=geometry.length;
   for(let i=0;i<geometry.length;i++){const g=geometry[i];assert(g.width>=g.parent*.98,'full width '+id);assert(g.height>60);assert(g.caption.length>3);if(i){assert(g.top>geometry[i-1].bottom,'vertical '+id);assert(Math.abs(g.left-geometry[0].left)<1);}}
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'overflow '+module+' '+id);
   const last=page.locator('.casePanel .panelButton').last();await last.click();await page.waitForSelector('#caseZoom[open]');await page.locator('#caseZoomImage img').evaluate(i=>i.decode());assert.equal(await page.locator('#caseZoomImage img').getAttribute('alt'),geometry.at(-1).caption);await page.locator('#caseZoomScale').fill('4');assert.equal(await page.locator('#caseZoomImage').evaluate(n=>n.style.width),'400%');await page.keyboard.press('Escape');
   if(geometry.length>1){await page.locator('.caseOriginal summary').click();assert(await page.locator('.originalButton').isVisible());await page.locator('.originalButton').click();assert((await page.locator('#caseZoomTitle').textContent()).includes('Исходная композиция'));await page.keyboard.press('Escape');}
  }
  await page.locator('#caseSelect').selectOption(ids[0]);await page.locator('.casePanel img').evaluateAll(ns=>Promise.all(ns.map(i=>i.decode())));await page.locator('.casePanel').first().scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,module+'-'+width+'.png')});
  await page.locator('.caseFeature').click();assert(await page.locator(module==='rectal'?'#staging':'#features').isVisible());
  for(const tab of await page.locator('[data-tab]').all())await tab.click();
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);assert.deepEqual(missing,[]);results.push({module,width,height,cases:count,panels,vertical:true,full_width:true,panel_zoom:true,original_composition:true,errors,external,missing});await context.close();console.log(module,width,panels,'PASS');
 }
 await browser.close();fs.writeFileSync('review/browser-panels244.json',JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
