import {regions} from './anatomy-regions.js';
const area=new URLSearchParams(location.search).get('area'),r=regions.find(r=>r.id===(area==='brachial-plexus'?'shoulder':area));
document.querySelector('#heading').textContent=r?r.name:'Область не найдена';
document.querySelector('#regionDescription').textContent=r?.description||'Вернитесь к списку анатомических областей.';
document.querySelector('#sectionCount').textContent=r?r.items.length+' раздел'+(r.items.length===1?'':r.items.length<5?'а':'ов'):'';
if(r){document.title=r.name+' · MRI Atlas';document.querySelector('#regionImage').src=r.image;
 for(const item of r.items){const a=document.createElement('a');a.className='sectionCard';a.href=item.url;const im=document.createElement('img');im.src=item.thumb;im.alt='';im.width=112;im.height=112;im.loading='lazy';im.decoding='async';const text=document.createElement('div');text.className='sectionCardText';const type=document.createElement('span');type.className='typeBadge';type.textContent=item.type;const title=document.createElement('h2');title.textContent=item.title;const desc=document.createElement('p');desc.textContent=item.description;const arrow=document.createElement('span');arrow.className='cardArrow';arrow.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>';text.append(type,title,desc);a.append(im,text,arrow);document.querySelector('#cards').append(a)}
}else document.querySelector('#regionImage').hidden=true;
