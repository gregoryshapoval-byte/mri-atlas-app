import assert from 'node:assert/strict';import fs from 'node:fs';import{primaryRows}from '../app/src/main/assets/brain-metastases-primary211.js';
assert.deepEqual(primaryRows.map(r=>r.id),['melanoma','rcc','thyroid','choriocarcinoma','neuroendocrine','gi','breast']);
for(const r of primaryRows){assert(r.pattern.length>80&&r.trap.length>100);assert(r.sources.length);for(const[name,url]of r.sources){assert(name.length>5);assert(new URL(url).protocol==='https:');}}
const by=id=>primaryRows.find(r=>r.id===id);
assert.match(by('rcc').pattern,/кровоизлиянию/);assert.match(by('rcc').trap,/не устанавливает почечный источник/);
assert.match(by('thyroid').trap,/не специфический тест/);assert.match(by('choriocarcinoma').trap,/Не считать любую гематому/);assert.match(by('choriocarcinoma').sources[0][0],/наблюдение/);
for(const t of ['DWI↑ с ADC↓','солидную ткань и центр полости','Универсальный ADC-порог не используется'])assert(JSON.stringify(by('neuroendocrine')).includes(t),t);
assert.match(by('gi').trap,/«T2↓ = муцин» ненадёжно/);assert.match(by('gi').trap,/не устанавливать ЖКТ-источник/);
assert.match(by('breast').pattern,/лептоменингеальному/);assert.match(by('breast').trap,/не особый T1\/T2-сигнал/);assert.match(by('breast').trap,/отрицательная МРТ их не исключает/);
const html=fs.readFileSync('app/src/main/assets/brain-metastases.html','utf8');assert.match(html,/<details id="primary211">/);assert.match(html,/tbody id="primaryRows211"/);assert.match(html,/не определение первичного органа/);assert.match(html,/<details id="signals210" open>/);
console.log('PASS primary211: seven source-linked primary patterns, hemorrhage vs native signal, DWI solid/center distinction, no ADC/mucin/primary-organ inference, breast spread vs signal and LM limitations.');
