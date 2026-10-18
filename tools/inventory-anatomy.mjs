import fs from 'node:fs';import crypto from 'node:crypto';import {categories,classifyPoint} from '../app/src/main/assets/anatomy-colors.js';
const modules=['brain','wrist-mri','elbow-mri','male-pelvis-mri','female-pelvis-mri','shoulder-mri','foot-mri'],report={version:'1.41',categories,modules:{}};
for(const mod of modules){const data=JSON.parse(fs.readFileSync('app/src/main/assets/'+mod+'-data.json')),labels=JSON.parse(fs.readFileSync('app/src/main/assets/'+mod+'-labels.json'));const fspec=Object.values(labels.filters).flat(),structures=new Map(),counts={};
 for(const sl of Object.values(labels.slices))for(const p of sl.points){const category=classifyPoint(p,fspec);counts[category]=(counts[category]||0)+1;structures.set(p.structure,{id:p.structure,name:p.name,category,filter:p.filter})}
 report.modules[mod]={images:data.series.reduce((n,s)=>n+s.frames.length,0),points:Object.values(counts).reduce((a,b)=>a+b,0),categoryPointCounts:counts,structures:[...structures.values()].sort((a,b)=>a.id-b.id)};
}
fs.writeFileSync('review/anatomy-inventory-1.41.json',JSON.stringify(report,null,2));console.log(Object.fromEntries(Object.entries(report.modules).map(([k,v])=>[k,{images:v.images,structures:v.structures.length,counts:v.categoryPointCounts}])));
