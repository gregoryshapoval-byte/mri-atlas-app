export function iconMarkup(kind){const paths={info:'<circle cx="12" cy="12" r="9"/><path d="M12 10v7M12 7h.01"/>',fullscreen:'<path d="M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5"/>',close:'<path d="m5 5 14 14M19 5 5 19"/>'};return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[kind]+'</svg>'}
export function setupViewerPage(){
 document.body.classList.add('atlasViewer');
 const main=document.querySelector('main'),bar=document.createElement('div');bar.className='viewerTop';
 const back=document.querySelector('header>a');if(back){back.className='viewerBack';bar.append(back)}
 const nav=document.querySelector('main>nav');if(nav){nav.className='viewerSets';for(const [id,title]of [['multi','МРТ'],['contrast','Контрасты'],['vascular','3D']]){const b=nav.querySelector('#'+id);if(b){b.setAttribute('aria-label',b.textContent);b.title=b.textContent;b.textContent=title}}bar.append(nav)}
 const toolbar=document.querySelector('main>.toolbar');if(toolbar){toolbar.classList.add('viewerTools');bar.append(toolbar)}
 const info=document.createElement('dialog');info.className='viewerInfo';info.innerHTML='<div class="drawerHead"><h2>Информация</h2><button aria-label="Закрыть">✕</button></div><div class="infoContent"><p>Один палец — быстрое листание срезов. Два пальца — масштаб и перемещение. Двойное касание — увеличение или возврат к исходному масштабу.</p><p>Подписи: названия у краёв экрана. Только точки: коснитесь точки для названия и пояснения. Без меток: чистое изображение. При большом числе подписей используйте «ещё» или фильтры в меню «Анатомия».</p><p>Сплошная линия и заполненная точка — исходная метка. Пунктир и контурная точка — ориентировочная. Исходные метки также могут требовать проверки специалистом.</p><div class="colorLegend"></div></div>';
 const content=info.querySelector('.infoContent');for(const el of [...main.querySelectorAll(':scope>.hint,:scope>details')])content.append(el);
 info.querySelector('button').onclick=()=>info.close();info.addEventListener('click',e=>{if(e.target===info)info.close()});document.body.append(info);
 const button=document.createElement('button');button.className='infoButton';button.innerHTML=iconMarkup('info');button.setAttribute('aria-label','Информация');button.onclick=()=>info.showModal();bar.append(button);main.prepend(bar);
 const globalReset=document.querySelector('#reset');if(globalReset)globalReset.hidden=true;
 window.AtlasNative?.setImmersive(true);
 window.addEventListener('pagehide',()=>window.AtlasNative?.setImmersive(false));
 return info;
}
// Bounds are a presentation layer; source pixels and all annotation coordinates stay intact.
export async function applySeriesFit(data,moduleName){
 const response=await fetch('viewer-fit-bounds.json');if(!response.ok)throw Error('fit bounds');
 const bounds=(await response.json())[moduleName]||{};
 for(const series of data.series)if(bounds[series.id])series.fitBounds=bounds[series.id];
}
export function fittedView(viewer,width,height){
 const f=viewer.series.frames[viewer.index],w=width||viewer.stage?.clientWidth||360,h=height||viewer.stage?.clientHeight||500,k=Math.min(w/700,h/760);
 const [x,y,bw,bh]=viewer.series.fitBounds||[0,0,f.width,f.height],a=viewer.rotation*Math.PI/180,c=Math.cos(a),s=Math.sin(a),unit=400/f.width*k;
 const iw=unit*(Math.abs(bw*c)+Math.abs(bh*s)),ih=unit*(Math.abs(bw*s)+Math.abs(bh*c));
 const zoom=Math.max(1,Math.min(5,(w-8)/iw,(h-8)/ih));
 const cx=(x+bw/2-f.width/2)*unit*viewer.flipX,cy=(y+bh/2-f.height/2)*unit*viewer.flipY;
 return {zoom,x:-(cx*c-cy*s)*zoom,y:-(cx*s+cy*c)*zoom};
}
export function fitZoom(viewer){return fittedView(viewer).zoom}
export function fitViewer(viewer){Object.assign(viewer,fittedView(viewer))}
export function watchViewerSize(viewer){
 if(typeof ResizeObserver==='undefined')return;
 let width=viewer.stage.clientWidth,height=viewer.stage.clientHeight;
 const observer=new ResizeObserver(()=>{
  const w=viewer.stage.clientWidth,h=viewer.stage.clientHeight;if(!w||!h||(w===width&&h===height))return;
  const old=fittedView(viewer,width,height),next=fittedView(viewer,w,h),ratio=viewer.zoom/old.zoom;
  const dx=(viewer.x-old.x*ratio)/Math.max(1,width),dy=(viewer.y-old.y*ratio)/Math.max(1,height);
  viewer.zoom=Math.max(1,Math.min(5,next.zoom*ratio));const r=viewer.zoom/next.zoom;
  viewer.x=next.x*r+dx*w;viewer.y=next.y*r+dy*h;width=w;height=h;viewer.transform();
 });observer.observe(viewer.stage);viewer.sizeObserver=observer;
}
