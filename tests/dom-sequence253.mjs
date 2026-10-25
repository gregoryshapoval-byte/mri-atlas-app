import assert from 'node:assert/strict';import fs from 'node:fs';import {Window} from '/tmp/mri253-dom/node_modules/happy-dom/lib/index.js';
const window=new Window({url:'http://localhost/sequence-tuning.html'});window.document.write(fs.readFileSync('app/src/main/assets/sequence-tuning.html','utf8').replace(/<script[\s\S]*?<\/script>/g,''));globalThis.document=window.document;await import('../app/src/main/assets/sequence253.js');
const doc=window.document,click=q=>doc.querySelector(q).click(),submit=()=>doc.getElementById('compare').dispatchEvent(new window.Event('submit',{cancelable:true}));
submit();assert.match(doc.getElementById('result').textContent,/100% исходного/);
doc.getElementById('after-nex').value='4';doc.getElementById('after-nex').dispatchEvent(new window.Event('input',{bubbles:true}));assert.match(doc.getElementById('result').textContent,/изменены/);submit();assert.match(doc.getElementById('result').textContent,/200% исходного/);
doc.getElementById('after-nex').value='0';submit();assert.match(doc.getElementById('result').textContent,/положительными/);doc.getElementById('after-nex').value='2';
for(const id of ['parameters','tasks','ge','sources','calculator']){click('[data-panel='+id+']');assert.equal(doc.querySelectorAll('[role=tabpanel]:not([hidden])').length,1);assert.equal(doc.querySelector('[role=tabpanel]:not([hidden])').id,id);}
doc.getElementById('family').value='epi';doc.getElementById('family').dispatchEvent(new window.Event('change'));submit();assert.match(doc.getElementById('result').textContent,/не рассчитываются/);
doc.getElementById('family').value='se';doc.getElementById('family').dispatchEvent(new window.Event('change'));assert(doc.getElementById('after-etl').disabled);submit();assert.match(doc.getElementById('result').textContent,/100% исходного/);
click('button[type=reset]');assert.equal(doc.getElementById('after-nex').value,'2');assert.match(doc.getElementById('result').textContent,/сброшены/);
console.log('PASS DOM: 5 panels, calculation, stale output, validation, unsupported family, SE lock and reset. No browser layout claim.');
await window.happyDOM.close();
