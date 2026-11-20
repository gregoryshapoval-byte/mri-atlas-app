// Preserve every published destination; apply explicit, reviewable additions.
// Never run historical recursive data flattening over the recovered runtime.
import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const repo=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const option=(key,fallback)=>process.argv.includes(key)?process.argv[process.argv.indexOf(key)+1]:fallback;
const root=path.resolve(option('--root',path.join(repo,'build/runtime-assets'))),base=option('--base',process.env.ATLAS_BASE_APK);
function readBase(name) {
 const args=[path.join(repo,'tools/runtime_current.py'),'--read-asset',name];
 if(base)args.push('--base',base);
 return execFileSync('python3',args,{maxBuffer:16*1024*1024,encoding:'utf8'});
}
const original=readBase('search252-data.js');
if(!/^export const searchEntries\s*=/.test(original))throw Error('Unexpected pinned index format');
const list=JSON.parse(original.replace(/^export const searchEntries\s*=/,'').trim().replace(/;$/,''));
const routes=JSON.parse(fs.readFileSync(path.join(repo,'release-inputs/search-routes.json'),'utf8'));
for(const row of routes.existing){const e=list.find(e=>e.url===row.url);if(!e)throw Error('Missing existing destination '+row.url);e.aliases=row.aliases;}
const clean=s=>s.replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&(?:nbsp|amp|lt|gt|quot);/g,' ').replace(/\s+/g,' ').trim();
for(const row of routes.additions){
 const html=fs.readFileSync(path.join(root,row.source),'utf8');const marker='id="'+row.sourceAnchor+'"';const start=html.indexOf(marker),end=html.indexOf('</details>',start);
 if(start<0||end<start)throw Error('Missing source block '+row.sourceAnchor);
 const {source,sourceAnchor,...fields}=row;list.push({id:row.url,...fields,text:clean(html.slice(start+marker.length+1,end))});
}
const ids=new Set();for(const e of list){if(ids.has(e.id))throw Error('Duplicate search id '+e.id);ids.add(e.id);const file=e.url.split(/[?#]/)[0];if(!fs.existsSync(path.join(root,file)))throw Error('Missing route '+e.url);}
const changed=routes.existing.length || routes.additions.length;
const data=changed ? 'export const searchEntries='+JSON.stringify(list,null,2)+';\n' : original;
const catalog=changed ? 'export const catalog='+JSON.stringify(list.map(({text,...e})=>e),null,2)+';\n' : readBase('search252-catalog.js');
for(const [name,text] of [['search252-data.js',data],['search252-catalog.js',catalog]]){
 const file=path.join(root,name);
 if(process.argv.includes('--check')){if(fs.readFileSync(file,'utf8')!==text)throw Error('Stale search index '+name);}
 else fs.writeFileSync(file,text);
}
console.log(JSON.stringify({entries:list.length,preservedPublishedEntries:list.length-routes.additions.length,added:routes.additions.length}));
