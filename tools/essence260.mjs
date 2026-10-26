// Explicitly registered clinical pages only. Never rewrite clinical source data.
import fs from 'node:fs';
import {reportRoutes} from '../app/src/main/assets/report251-catalog.js';
import {essence,excluded} from '../app/src/main/assets/essence260-data.js';
const root='app/src/main/assets/';let count=0;
for(const page of reportRoutes){if(excluded.includes(page))continue;const key=page.replace('.html','');if(!essence[key])throw Error('Missing editorial summary: '+page);let html=fs.readFileSync(root+page,'utf8');if(!html.includes('essence260.css'))html=html.replace('</head>','<link rel="stylesheet" href="essence260.css"></head>');if(!html.includes('src="essence260.js"'))html=html.replace('</body>','<script type="module" src="essence260.js"></script></body>');fs.writeFileSync(root+page,html);count++;}
console.log('Summary and ranking enabled on '+count+' clinical pages.');
