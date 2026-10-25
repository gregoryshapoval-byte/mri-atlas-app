export const plans={
 all:{primary:["meningioma.html", "sellar.html", "glioblastoma.html", "vestibular.html", "diffuse-gliomas.html", "cns-lymphoma.html", "ependymal.html", "pilocytic.html", "craniopharyngioma.html", "glioneuronal.html", "hemangioblastoma.html", "neurocytoma.html",'brain-oncology247.html?topic=medulloblastoma','brain-oncology247.html?topic=pediatric-gliomas','brain-oncology247.html?topic=germ-cell'],status:'Все доступные первичные опухолевые темы.',limits:''},
 child:{primary:['brain-oncology247.html?topic=medulloblastoma','brain-oncology247.html?topic=pediatric-gliomas','brain-oncology247.html?topic=germ-cell','pilocytic.html','ependymal.html','craniopharyngioma.html','glioneuronal.html'],status:'0–14 лет: характерные готовые темы.',limits:'Детская серия неполная; часть модулей содержит взрослую основу.'},
 aya:{primary:['brain-oncology247.html?topic=germ-cell','brain-oncology247.html?topic=medulloblastoma','sellar.html','meningioma.html','vestibular.html','diffuse-gliomas.html','pilocytic.html','glioneuronal.html','neurocytoma.html'],status:'15–39 лет: частые и характерные темы.',limits:'Группа включает подростков; часть модулей имеет взрослую основу.'},
 older:{primary:['meningioma.html','sellar.html','glioblastoma.html','vestibular.html','diffuse-gliomas.html','cns-lymphoma.html'],status:'40+ лет: частые взрослые группы.',limits:''}
};
for(const [age,ids]of Object.entries({all:['skull-base','sft','choroid-plexus'],child:['choroid-plexus'],aya:['skull-base','sft','choroid-plexus'],older:['skull-base','sft','choroid-plexus']}))plans[age].primary.push(...ids.map(id=>'brain-oncology247.html?topic='+id));
for(const age of ['all','child','aya','older'])plans[age].primary.push(...['pineal-parenchymal','pxa'].map(id=>'brain-oncology247.html?topic='+id));
if(typeof document!=='undefined'){
 const cards=new Map([...document.querySelectorAll('#primary a.moduleLink')].map(a=>[a.getAttribute('href'),a]));
 const buttons=[...document.querySelectorAll('[data-age]')];
 function select(id,update=false){
  const key=Object.hasOwn(plans,id)?id:'all',p=plans[key];
  document.getElementById('primaryCards').replaceChildren(...p.primary.map(x=>cards.get(x)));
  const rest=plans.all.primary.filter(x=>!p.primary.includes(x));document.getElementById('otherCards').replaceChildren(...rest.map(x=>cards.get(x)));document.getElementById('other').hidden=rest.length===0;
  document.getElementById('primaryTitle').textContent=key==='all'?'Первичные опухоли':'Первыми для возраста';
  document.getElementById('primaryHint').textContent=key==='all'?'Навигация по готовым темам; порядок не является шкалой вероятности.':'Другие доступные темы — ниже.';
  document.getElementById('ageStatus').textContent=p.status;document.getElementById('ageLimits').textContent=p.limits;document.getElementById('ageLimits').hidden=!p.limits;
  for(const b of buttons)b.setAttribute('aria-pressed',String(b.dataset.age===key));
  try{sessionStorage.setItem('atlas-brain-age',key);}catch{}
  if(update){const u=new URL(location.href);u.searchParams.set('age',key);try{history.replaceState(null,'',u);}catch{}}
 }
 const search=document.getElementById('tumorSearch');function filter(){const q=search.value.trim().toLowerCase();let count=0;for(const a of cards.values()){const match=a.textContent.toLowerCase().includes(q);a.hidden=!match;if(match)count++;}document.getElementById('tumorSearchStatus').textContent=`Найдено ${count} из ${cards.size}`;}search.addEventListener('input',filter);
 for(const b of buttons)b.addEventListener('click',()=>select(b.dataset.age,true));
 let initial=new URL(location.href).searchParams.get('age');if(!initial)try{initial=sessionStorage.getItem('atlas-brain-age');}catch{}
 select(initial||'all');filter();
}
