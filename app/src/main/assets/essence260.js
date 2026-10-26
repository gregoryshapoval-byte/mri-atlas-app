import {essence} from './essence260-data.js';
const page=location.pathname.split('/').pop().replace(/\.html$/,''),data=essence[page];
const h=(tag,text,cls)=>{const el=document.createElement(tag);if(text)el.textContent=text;if(cls)el.className=cls;return el;};
if(data){
 const main=document.querySelector('main'),title=main?.querySelector('h1');
 if(main&&title){
  const card=h('section',null,'essence260');card.setAttribute('aria-labelledby','essence260-title');
  const head=h('div',null,'essence260-head');head.append(h('h2','Самая суть','essence260-title'));head.firstChild.id='essence260-title';card.append(head);
  const dl=h('dl');
  for(const [key,label,cls]of [['look','Что искать',''],['key','Ключевые','essential'],['support','Поддерживающие','supporting'],['nonspecific','Неспецифические','nonspecific'],['mimic','С чем спутать',''],['report','В заключение','']]){
   const row=h('div',null,'essence260-row '+cls);row.append(h('dt',label),h('dd',data[key]));dl.append(row);
  }card.append(dl);
  const legend=h('p','Ключевые — приоритет оценки; один признак не заменяет весь диагностический паттерн.','essence260-note');card.append(legend);
  let anchor=title;while(anchor.parentElement!==main&&anchor.parentElement&&!['clinicalApp','neckApp','app'].includes(anchor.parentElement.id))anchor=anchor.parentElement;
  const lead=anchor.nextElementSibling;if(lead?.classList.contains('lead'))anchor=lead;
  anchor.after(card);
  // Keep tab panels, IDs, original text, diagrams and handlers intact. Only the
  // first diagnostic panel's contents are placed inside native disclosure.
  const panels=[...main.querySelectorAll('[role="tabpanel"]')];
  const panel=panels.find(p=>/^(?:features|patterns|lesions|local|panel0|neck-features)$/.test(p.id))||panels.find(p=>!p.hidden&&!/cases|report|scan|source/i.test(p.id));
  if(panel&&panel.childNodes.length){
   const details=h('details',null,'essence260-detail');const summary=h('summary','Подробный разбор · признаки и схемы');details.append(summary);
   const contents=h('div',null,'essence260-original');while(panel.firstChild)contents.append(panel.firstChild);details.append(contents);panel.append(details);
   const params=new URLSearchParams(location.search);details.open=[...params.keys()].some(k=>/^(?:focus|pattern|case|neckFeature|cat|oradsCase|compare|tab)/.test(k))||Boolean(location.hash);
   document.addEventListener('click',e=>{if(e.target.closest('[data-scenario-feature],[data-navigator-feature],[data-focus-feature]'))details.open=true;},true);
   document.addEventListener('beforematch',()=>{details.open=true;});
   window.addEventListener('hashchange',()=>{if(location.hash)details.open=true;});
  }
  document.documentElement.dataset.essence260='ready';
 }
}
