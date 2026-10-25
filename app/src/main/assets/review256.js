import {guides} from './review256-data.js';
const key=location.pathname.split('/').pop().replace('.html',''),g=guides[key];
const h=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
if(g){
 const root=h('details',null,'review256');root.id='review256';root.append(h('summary','Дифдиагностика · сравнить похожие находки'));
 root.append(h('h2','Проверенные условия применения'));
 const checks=h('ul');for(const text of g.audit)checks.append(h('li',text));root.append(checks);
 g.comparisons.forEach((c,i)=>{
  const card=h('article',null,'compareCard256');card.id='compare256-'+i;card.append(h('h2',c.title));
  const wrap=h('div',null,'compareScroll256'),table=h('table'),thead=h('thead'),head=h('tr');
  table.append(h('caption',c.left+' / '+c.right));for(const title of ['Признак',c.left,c.right]){const th=h('th',title);th.scope='col';head.append(th);}thead.append(head);table.append(thead);
  const tbody=h('tbody');for(const row of c.rows){const tr=h('tr');row.forEach((text,j)=>{const td=h(j===0?'th':'td',text);if(j===0)td.scope='row';else td.dataset.label=j===1?c.left:c.right;tr.append(td);});tbody.append(tr);}table.append(tbody);wrap.append(table);card.append(wrap,h('p',c.trap,'compareTrap256'));root.append(card);
 });
 root.append(h('h3','Источники и границы проверки'));const list=h('ul');for(const s of g.sources){const li=h('li'),a=h('a',s.title);a.href=s.url;a.target='_blank';a.rel='noopener';li.append(a);list.append(li);}root.append(list,h('p','Редакционная сверка: 25.10.2026. Проверены перечисленные условия и различия; это не независимая врачебная валидация всего раздела. Сравнения не являются автоматическим диагнозом.','reviewScope256'));
 const main=document.querySelector('main');main.insertBefore(root,main.querySelector('footer'));
 const jump=h('button','Сравнить похожие находки','reviewJump256');jump.type='button';jump.onclick=()=>{root.open=true;root.scrollIntoView({block:'start'});};const title=main.querySelector('h1');if(title)title.after(jump);else main.prepend(jump);
 const focus=new URLSearchParams(location.search).get('compare256');if(focus!==null&&/^\d+$/.test(focus)&&g.comparisons[Number(focus)]){root.open=true;document.getElementById('compare256-'+Number(focus)).scrollIntoView({block:'start'});document.documentElement.dataset.compare256='ready';}
}
