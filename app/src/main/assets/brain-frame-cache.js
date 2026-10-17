// Decode before display; bounded cache and retry after errors.
const images=new Map();
export function decodedImage(src){
 if(images.has(src)){const p=images.get(src);images.delete(src);images.set(src,p);return p;}
 const pending=new Promise((resolve,reject)=>{const img=new Image();img.onload=async()=>{try{if(img.decode)await img.decode();resolve(img)}catch(e){reject(e)}};img.onerror=()=>reject(Error('Image failed: '+src));img.src=src});
 images.set(src,pending);pending.catch(()=>{if(images.get(src)===pending)images.delete(src)});
 while(images.size>18)images.delete(images.keys().next().value);
 return pending;
}
export class LatestFrame {
 constructor(){this.version=0}
 async run(load,commit,onError){const version=++this.version;try{const value=await load();if(version===this.version)commit(value)}catch(e){if(version===this.version)onError?.(e)}}
}
