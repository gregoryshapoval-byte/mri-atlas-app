import {layouts} from './case-panel-layouts.js';
const el=id=>document.getElementById(id);
function crop(src,layout,panel){
 const frame=document.createElement('span');frame.className='panelCrop';
 const [x,y,w,h]=panel.box;frame.style.aspectRatio=`${w} / ${h}`;
 const img=document.createElement('img');img.src=src;img.alt=panel.label;img.decoding='async';
 Object.assign(img.style,{position:'absolute',width:`${layout.width/w*100}%`,height:`${layout.height/h*100}%`,left:`${-x/w*100}%`,top:`${-y/h*100}%`,maxWidth:'none',maxHeight:'none',objectFit:'fill'});frame.append(img);return frame;
}
function openZoom(src,layout,panel,title){
 const frame=crop(src,layout,panel);frame.id='caseZoomImage';el('caseZoom').querySelector('.caseZoomScroll').replaceChildren(frame);
 el('caseZoomTitle').textContent=title+' · '+panel.label;el('caseZoomScale').value='1';el('caseZoom').showModal();
}
export function initPanelZoom(){
 const dialog=el('caseZoom');dialog.querySelector('.close').onclick=()=>dialog.close();
 el('caseZoomScale').max='4';el('caseZoomScale').oninput=e=>{el('caseZoomImage').style.width=`${Number(e.target.value)*100}%`;};
 dialog.addEventListener('close',()=>{dialog.querySelector('.caseZoomScroll').replaceChildren();});
}
export function createPanelGallery(src,title,layout=layouts[src]){
 if(!layout)throw new Error('No reviewed panel layout: '+src);
 const gallery=document.createElement('div');gallery.className='casePanelGallery';gallery.dataset.source=src;
 for(const [index,panel] of layout.panels.entries()){
  const fig=document.createElement('figure');fig.className='casePanel';fig.dataset.panel=String(index+1);
  const button=document.createElement('button');button.type='button';button.className='caseImageButton panelButton';button.setAttribute('aria-label','Увеличить: '+panel.label);button.append(crop(src,layout,panel));button.onclick=()=>openZoom(src,layout,panel,title);
  const caption=document.createElement('figcaption');caption.textContent=panel.label;fig.append(button,caption);gallery.append(fig);
 }
 if(layout.panels.length>1){
  const details=document.createElement('details');details.className='caseOriginal';const summary=document.createElement('summary');summary.textContent='Исходная композиция целиком';
  const button=document.createElement('button');button.type='button';button.className='caseImageButton originalButton';button.setAttribute('aria-label','Увеличить исходную композицию');const img=document.createElement('img');img.src=src;img.alt=title+' · исходная композиция';img.loading='lazy';button.append(img);button.onclick=()=>openZoom(src,layout,{box:[0,0,layout.width,layout.height],label:'Исходная композиция'},title);details.append(summary,button);gallery.append(details);
 }
 return gallery;
}
