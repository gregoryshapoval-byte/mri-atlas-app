import assert from 'node:assert/strict';import fs from 'node:fs';
import {guides} from '../app/src/main/assets/review256-data.js';
import {panelGuides} from '../app/src/main/assets/panel-guides256-data.js';
import {layouts} from '../app/src/main/assets/case-panel-layouts.js';
import {mrfAssessment,report} from '../app/src/main/assets/rectal-cancer-data.js';
import {searchEntries} from '../app/src/main/assets/search252-data.js';
assert.equal(Object.keys(guides).length,12);let comparisons=0,panels=0;
for(const [key,g]of Object.entries(guides)){assert(g.sources.length&&g.audit.length);const html=fs.readFileSync('app/src/main/assets/'+key+'.html','utf8');assert(html.includes('review256.js'));assert(html.includes('review256.css'));for(const [i,c]of g.comparisons.entries()){comparisons++;assert(c.rows.length>=2&&c.rows.every(row=>row.length===3&&row.every(Boolean)));assert(c.trap);assert(searchEntries.some(e=>e.url===key+'.html?compare256='+i));}}
assert.equal(comparisons,27);assert.equal(Object.keys(panelGuides).length,56);
for(const [path,g]of Object.entries(panelGuides)){assert(fs.existsSync('app/src/main/assets/'+path));assert.equal(g.cues.length,layouts[path].panels.length,path);assert(g.limit);for(const cue of g.cues){panels++;assert(cue.trim().length>0&&!cue.includes('undefined'));}}
assert.equal(panels,225);
assert.match(panelGuides['liver-cases/frontiers-03.jpg'].cues[2],/ADC.*отсутствует/);
assert.match(panelGuides['rectal-cases/staging-21.png'].cues[3],/b0.*нельзя/);
assert.match(panelGuides['endometriosis-cases/figure-16.png'].cues[2],/отдельный узел/);
assert.match(panelGuides['endometriosis-cases/figure-14.png'].cues[2],/отдельный параматочный/);
for(const source of ['Опухоль','EMVI','Неровный депозит / узел с выходом за капсулу']){assert.equal(mrfAssessment(1,source).status,'MRF+');assert.equal(mrfAssessment('1,1',source).status,'MRF−');assert.equal(mrfAssessment('',source).status,'не оценена');}
for(const source of ['','неизвестный источник','Гладкий лимфоузел']){assert.equal(mrfAssessment(0,source).status,'не оценена');const r=report({mrf:0,source});assert.match(r,/Заключение:.*MRF: не оценена/);assert(!r.includes('MRF: MRF−'));}
assert.match(mrfAssessment(0,'Гладкий лимфоузел').reason,/сам по себе не определяет/);
console.log('PASS review256: 12 existing modules, 27 comparisons, 56 cases / 225 exact panel cues, search links, MRF scope / boundaries and missing data.');
