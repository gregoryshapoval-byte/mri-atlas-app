import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {categories,classifyPoint} from '../app/src/main/assets/anatomy-colors.js';
const root='app/src/main/assets/',modules=['brain','wrist-mri','elbow-mri','male-pelvis-mri','female-pelvis-mri','shoulder-mri','foot-mri','knee-mri','face-neck-mri','hip-mri','spine-mri'];
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
const preserved=JSON.parse(fs.readFileSync('review/preservation-1.42.json'));
for(const [p,sha]of Object.entries(preserved.existingFiles))assert.equal(digest(fs.readFileSync(p)),sha,p+' remains unchanged');
for(const mod of modules){const data=JSON.parse(fs.readFileSync(root+mod+'-data.json')),labels=JSON.parse(fs.readFileSync(root+mod+'-labels.json'));for(const s of data.series)for(const f of s.frames){assert(labels.slices[f.annotation]);const raw=fs.readFileSync(root+f.src);if(f.sha256)assert.equal(digest(raw),f.sha256);for(const p of labels.slices[f.annotation].points){assert(Number.isFinite(p.x)&&Number.isFinite(p.y));assert(categories[classifyPoint(p,labels.filters[s.module])]);}}
 for(const fspec of Object.values(labels.filters))for(const f of fspec)if(f.icon)assert(fs.existsSync(root+f.icon),f.icon);
 for(const sl of Object.values(labels.slices))for(const mask of sl.masks||[])assert(fs.existsSync(root+mask.src),mask.src);
 console.log('PASS exact packaged data:',mod);
}
assert.equal(classifyPoint({name:'Борозда сухожилия',filter:1},[{id:1,name:'Кости'}]),'bones');
assert.equal(classifyPoint({name:'Подсухожильная сумка',filter:1},[{id:1,name:'Мышцы'}]),'organs');
assert.equal(classifyPoint({name:'Прикрепленная пластинка',filter:1},[]),'organs');
