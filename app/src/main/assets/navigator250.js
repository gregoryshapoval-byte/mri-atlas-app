import {guides} from './navigator250-data.js';
const key=location.pathname.split('/').pop().replace('.html',''),data=guides[key];
if(data){
 const make=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
 const root=make('section',null,'diagnosticNavigator');root.id='diagnosticNavigator';root.setAttribute('aria-labelledby','navigator250Title');
 const title=make('h2','Диагностический навигатор');title.id='navigator250Title';
 root.append(title,make('p','Выберите ведущий паттерн и уточните признак. Это ориентир для дифференциального ряда, а не автоматический диагноз.'));
 const pattern=make('select'),clue=make('select');pattern.id='navigator250Pattern';clue.id='navigator250Clue';
 const label=(text,id)=>{const l=make('label',text);l.htmlFor=id;return l;};
 const question=label('2. Уточняющий признак',clue.id),result=make('div');result.id='navigator250Result';result.setAttribute('aria-live','polite');result.setAttribute('aria-atomic','true');
 const addOption=(sel,value,text)=>{const o=make('option',text);o.value=value;sel.append(o);};
 addOption(pattern,'','— Выберите паттерн —');data.patterns.forEach(p=>addOption(pattern,p.id,p.title));
 const reset=make('button','Сбросить выбор');reset.type='button';
 root.append(label('1. Ведущий МР-паттерн',pattern.id),pattern,question,clue,result,reset);
 const sources=make('details'),summary=make('summary','Источники и ограничения');sources.append(summary,make('p','При нескольких паттернах разберите каждый отдельно. Приоритеты зависят от клиники, возраста, иммунного статуса и времени исследования. Окончательный диагноз требует сопоставления данных.'));
 const a=make('a',data.source);a.href=data.url;a.target='_blank';a.rel='noopener';sources.append(a);root.append(sources);
 const main=document.querySelector('main'),lead=main.querySelector('.lead');if(lead)lead.after(root);else main.querySelector('h1').after(root);
 function clear(){result.replaceChildren(make('p','После выбора уточняющего признака здесь появятся ориентиры.','navigatorHint'));}
 function choosePattern(){clue.replaceChildren();addOption(clue,'','— Выберите признак —');const p=data.patterns.find(p=>p.id===pattern.value);clue.disabled=!p;question.textContent=p?'2. '+p.question:'2. Уточняющий признак';if(p)p.branches.forEach((b,i)=>addOption(clue,String(i),b.label));clear();}
 pattern.addEventListener('change',choosePattern);
 clue.addEventListener('change',()=>{const p=data.patterns.find(p=>p.id===pattern.value);const b=p?.branches[Number(clue.value)];if(clue.value===''||!b){clear();return;}
  result.replaceChildren();const section=(heading,body,cls)=>{const article=make('article',null,cls);article.append(make('h3',heading),make('p',body));result.append(article);};
  if(b.urgent)section('Срочность',b.urgent,'navigatorUrgent');
  section('Дифференциальный ориентир',b.lead);section('Что проверить',b.check);section('Диагностическая ловушка',b.trap,'navigatorTrap');
  const button=make('button','Открыть подробный разбор →');button.type='button';button.addEventListener('click',()=>{document.querySelector('[data-tab="features"]')?.click();const target=document.querySelector('[data-feature="'+b.feature+'"]');target?.click();(document.getElementById('featureTitle')||target)?.scrollIntoView({behavior:'smooth',block:'center'});});result.append(button);
 });
 reset.addEventListener('click',()=>{pattern.value='';choosePattern();pattern.focus();});choosePattern();
}
