import {installPersonal252} from './personal252.js';
import {APP_VERSION} from './app-version-data.js';import {openReport251,installReport251} from './report251.js';
for(const n of document.querySelectorAll('header span'))if(/^MRI\s*Atlas\s*[· ]\s*\d/i.test(n.textContent.trim()))n.dataset.appVersion='';
for(const n of document.querySelectorAll('[data-app-version]'))n.textContent='Версия '+APP_VERSION;
if(document.body.hasAttribute('data-report-tools')){const bar=document.createElement('aside');bar.className='atlasTools251';bar.setAttribute('aria-label','Инструменты описания');const b=document.createElement('button');b.type='button';b.textContent='Конструктор описания';b.onclick=()=>openReport251('',undefined,b);const v=document.createElement('small');v.textContent='MRIAtlas '+APP_VERSION;bar.append(b,v);installPersonal252(bar);(document.querySelector('main')||document.body).prepend(bar);installReport251();}
