export const types=[
 {code:'Ia',name:'Одностороннее увеличение',caption:'Высота отростка ≥19 мм. Без сочленения.'},
 {code:'Ib',name:'Двустороннее увеличение',caption:'Высота отростков ≥19 мм. Без сочленения.'},
 {code:'IIa',name:'Односторонний псевдосустав',caption:'Сочленение поперечного отростка с крестцом.'},
 {code:'IIb',name:'Двусторонние псевдосуставы',caption:'Сочленение с крестцом с обеих сторон.'},
 {code:'IIIa',name:'Одностороннее сращение',caption:'Непрерывный костный мост с крестцом.'},
 {code:'IIIb',name:'Двустороннее сращение',caption:'Костное сращение с обеих сторон.'},
 {code:'IV',name:'Смешанный тип',caption:'II с одной стороны + III с другой.'}
];
const gallery=document.getElementById('gallery'),dialog=document.getElementById('zoom');
for(const type of types){const button=document.createElement('button');button.className='card';button.dataset.type=type.code;button.setAttribute('aria-label','Castellvi '+type.code+' · '+type.name);const image=document.createElement('img');image.src='castellvi/'+type.code+'.svg';image.alt='Castellvi '+type.code+' — '+type.name;image.width=600;image.height=520;const caption=document.createElement('div');caption.className='caption';const code=document.createElement('span');code.className='code';code.textContent=type.code;const words=document.createElement('div');words.className='words';const title=document.createElement('strong');title.textContent=type.name;const detail=document.createElement('span');detail.textContent=type.caption;words.append(title,detail);caption.append(code,words);button.append(image,caption);button.onclick=()=>{document.getElementById('zoomTitle').textContent='Castellvi '+type.code;document.getElementById('zoomImage').src=image.src;document.getElementById('zoomImage').alt=image.alt;document.getElementById('zoomCaption').textContent=type.name+'. '+type.caption;dialog.showModal();};gallery.append(button);}
document.getElementById('close').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
