export const plans={
 all:{primary:["meningioma.html","sellar.html","glioblastoma.html","vestibular.html","diffuse-gliomas.html","cns-lymphoma.html","ependymal.html","pilocytic.html","craniopharyngioma.html","hemangioblastoma.html"],status:'Все возрасты: ориентировочная частота первичных групп. Метастазы отдельно.',limits:''},
 child:{primary:['pilocytic.html','ependymal.html','craniopharyngioma.html'],status:'0–14 лет: первыми — характерные для детей темы из готовой серии.',limits:'Детская серия неполная: пока нет отдельных модулей медуллобластомы, детских диффузных глиом и герминогенных опухолей. Эпендимальный модуль содержит взрослую основу; детский алгоритм требует отдельной оценки.'},
 aya:{primary:['sellar.html','meningioma.html','vestibular.html','diffuse-gliomas.html','pilocytic.html'],status:'15–39 лет: молодые пациенты; первыми — частые и характерные для этой группы готовые темы.',limits:'Группа включает подростков. Часть модулей ориентирована на взрослых; возрастная навигация не заменяет подростковый клинический протокол.'},
 older:{primary:['meningioma.html','sellar.html','glioblastoma.html','vestibular.html','diffuse-gliomas.html','cns-lymphoma.html'],status:'40+ лет: первыми — основные частые взрослые группы, остальные темы ниже.',limits:''}
};
if(typeof document!=='undefined'){
 const cards=new Map([...document.querySelectorAll('#primary a.moduleLink')].map(a=>[a.getAttribute('href'),a]));
 const buttons=[...document.querySelectorAll('[data-age]')];
 function select(id,update=false){
  const key=Object.hasOwn(plans,id)?id:'all',p=plans[key];
  document.getElementById('primaryCards').replaceChildren(...p.primary.map(x=>cards.get(x)));
  const rest=plans.all.primary.filter(x=>!p.primary.includes(x));document.getElementById('otherCards').replaceChildren(...rest.map(x=>cards.get(x)));document.getElementById('other').hidden=rest.length===0;
  document.getElementById('primaryTitle').textContent=key==='all'?'Первичные опухоли':'Первыми для этого возраста';
  document.getElementById('primaryHint').textContent=key==='all'?'Ориентировочно от более частых к редким среди готовых модулей.':'Характерные готовые темы; остальные первичные опухоли остаются ниже.';
  document.getElementById('ageStatus').textContent=p.status;document.getElementById('ageLimits').textContent=p.limits;document.getElementById('ageLimits').hidden=!p.limits;
  for(const b of buttons)b.setAttribute('aria-pressed',String(b.dataset.age===key));
  try{sessionStorage.setItem('atlas-brain-age',key);}catch{}
  if(update){const u=new URL(location.href);u.searchParams.set('age',key);try{history.replaceState(null,'',u);}catch{}}
 }
 for(const b of buttons)b.addEventListener('click',()=>select(b.dataset.age,true));
 let initial=new URL(location.href).searchParams.get('age');if(!initial)try{initial=sessionStorage.getItem('atlas-brain-age');}catch{}
 select(initial||'all');
}
