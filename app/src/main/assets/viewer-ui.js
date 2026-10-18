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
export function fitZoom(viewer){
 const f=viewer.series.frames[viewer.index],w=viewer.stage?.clientWidth||360,h=viewer.stage?.clientHeight||500,k=Math.min(w/700,h/760),a=(viewer.rotation%180)?f.height/f.width:1,iw=400*a,ih=(viewer.rotation%180)?400:400*f.height/f.width;
 return Math.max(1,Math.min(5,Math.min((w-8)/iw,(h-8)/ih)/k));
}
