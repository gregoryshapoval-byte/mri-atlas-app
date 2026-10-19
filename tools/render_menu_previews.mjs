import fs from 'node:fs';import path from 'node:path';import {spawn,execFileSync} from 'node:child_process';
const {chromium}=await import(process.env.PLAYWRIGHT_IMPORT||'/tmp/atlas-dom/node_modules/playwright/index.mjs');
const recipes=JSON.parse(fs.readFileSync('review/menu-preview-recipes-1.42.json'));fs.mkdirSync('build/menu-preview-png',{recursive:true});
const server=spawn('python3',['-m','http.server','8767','--bind','127.0.0.1'],{cwd:'app/src/main/assets',stdio:'ignore'});let browser;
try{browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox','--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:640,height:760},deviceScaleFactor:1});
 for(const item of recipes){const out='app/src/main/assets/'+item.thumb;if(fs.existsSync(out)&&process.env.RENDER_PREVIEWS_FORCE!=='1'){console.log('Preview retained:',item.url);continue}
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:8767/'+item.url);await page.waitForSelector('#canvas canvas');await page.addStyleTag({content:'.scene-title,#labels,.scene-foot,.viewbar{visibility:hidden!important}'});await page.waitForTimeout(650);if(errors.length)throw Error(errors.join('; '));
  const png='build/menu-preview-png/'+path.basename(item.thumb)+'.png';await page.locator('#canvas canvas').screenshot({path:png});
  execFileSync('python3',['-c',"from PIL import Image,ImageStat;import sys;im=Image.open(sys.argv[1]).convert('RGB');assert max(ImageStat.Stat(im).stddev)>4,'Empty canvas';im.thumbnail((320,320));im.save(sys.argv[2],'WEBP',quality=82,method=6)",png,out]);console.log('Rendered real model:',item.url)
 }
}finally{await browser?.close();server.kill()}
