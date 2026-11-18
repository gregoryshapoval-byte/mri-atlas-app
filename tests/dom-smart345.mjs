// DOM only. No assertions about visual layout, touch gestures or physical Android.
import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {pathToFileURL,fileURLToPath} from 'node:url';
const {parseHTML}=await import(process.env.ATLAS_DOM);const repo=path.dirname(path.dirname(fileURLToPath(import.meta.url))),root=path.join(repo,'build/runtime-assets');
const anchor=process.argv[2]||'smart2024';const {window,document}=parseHTML(fs.readFileSync(path.join(root,'perianal-cases.html'),'utf8'));
Object.assign(globalThis,{window,document,location:new URL('https://appassets.androidplatform.net/assets/perianal-cases.html#'+anchor),requestAnimationFrame:f=>f()});
// linkedom lacks native select.value; reproduce the browser option-selection contract.
Object.defineProperty(window.HTMLSelectElement.prototype,'value',{get(){const options=[...this.querySelectorAll('option')];return (options.find(o=>o.hasAttribute('selected'))||options[0])?.getAttribute('value')||''},set(value){for(const o of this.querySelectorAll('option'))o.toggleAttribute('selected',o.getAttribute('value')===String(value))},configurable:true});
window.HTMLElement.prototype.scrollIntoView=function(){this.dataset.scrolled345='true';};
await import(pathToFileURL(path.join(root,'perianal-report.js')));
assert.equal(document.getElementById('report').hidden,false);assert.equal(document.getElementById('cases').hidden,true);assert.equal(document.getElementById('smart2024').open,true);
assert.equal(document.getElementById(anchor).dataset.scrolled345,'true');assert.equal(document.querySelector('[data-section="report"]').getAttribute('aria-pressed'),'true');
const count=()=>document.querySelectorAll('[data-tract]').length;assert.equal(count(),1);document.getElementById('addTract').click();assert.equal(count(),2);
document.querySelector('[data-field="hope"]').value='нижняя треть';document.getElementById('buildReport').click();assert(document.getElementById('reportOutput').value.includes('нижняя треть'));assert(document.getElementById('reportOutput').value.includes('[не заполнено]'));
for(const field of [...document.querySelectorAll('[data-tract]')])field.querySelector('button').click();document.getElementById('buildReport').click();assert(document.getElementById('reportOutput').value.includes('это не означает отсутствие свища'));
location.hash='#not-a-registered-target';window.dispatchEvent(new window.Event('hashchange'));assert.equal(document.getElementById('report').hidden,false);
console.log('PASS DOM smart direct link, active tab, open details, target, report lifecycle:',anchor);
