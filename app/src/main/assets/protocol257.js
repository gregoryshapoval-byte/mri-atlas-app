import {profiles} from './protocol257-data.js';
const file=location.pathname.split('/').pop(),topic=new URLSearchParams(location.search).get('topic'),key=file+(file==='brain-oncology247.html'&&topic?'?topic='+topic:'');
const profile=profiles[key];
const make=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
const headings={P:'1. Подготовка и покрытие',B:'2. Основные серии',E:'3. Дополнительные серии — по задаче',C:'4. Контрастирование',Q:'5. Контроль качества и ограничения'};
const intro={P:'Уточните клинический вопрос, предыдущее лечение и исследования для сравнения. Планируйте обзор и прицельное покрытие до начала сканирования.',B:'Набор относится к задаче этого раздела. Условия выполнения, указанные в карточках, сохраняются; состав первичного и контрольного исследования может различаться.',E:'Добавляйте серии под конкретный вопрос. Для каждой учитывайте указанную цель, условия и ограничения.',C:'Контрастные серии могут входить в основной набор выше. Решение о введении, препарат и дозу определяют по задаче исследования и действующему локальному протоколу; этот блок не означает рутинное назначение контраста.',Q:'Перед завершением проверьте покрытие, движение, геометрические искажения и пригодность ключевых серий. При сравнении учитывайте различия аппарата, плоскостей и параметров.'};
const empty={P:'Специальная подготовка в исходном протоколе отдельно не выделена. Это не отменяет стандартную проверку безопасности МРТ.',B:'Основные серии приведены в блоках по задаче ниже.',E:'Отдельные дополнительные серии в этом протоколе не выделены. Не расширяйте исследование без сформулированной задачи.',C:'Отдельный контрастный блок в исходном протоколе не выделен. Если введение необходимо, заранее согласуйте нативные серии, порядок и сроки постконтрастных серий.',Q:'Если ключевая серия отсутствует или недиагностична, укажите её и конкретный предел оценки. «Не оценено» не заменяйте отрицательным признаком.'};
function read(panel){
 const body=panel.querySelector('#scanRows,#protocolRows'),table=body?.closest('table')||(profile.adapter==='ms'?panel.querySelector('table'):null);
 if(table){const heads=[...table.querySelectorAll('thead th')].map(n=>n.textContent.trim());const rows=[...(body?.rows||table.tBodies[0]?.rows||[])];return rows.map(row=>{const cells=[...row.cells].map(n=>n.textContent.trim());const label=cells[profile.adapter==='ms'?1:0];return {label,fields:cells.map((text,i)=>({label:heads[i]||['Блок','Серия / покрытие','Требования'][i]||'Параметр',text})).filter((_,i)=>i!==(profile.adapter==='ms'?1:0))};});}
 return [...panel.querySelectorAll('article')].map(n=>({label:n.querySelector('h2,h3')?.textContent.trim(),paragraphs:[...n.querySelectorAll('p,ul,ol')].filter(p=>!p.parentElement.closest('p,ul,ol')).map(p=>p.textContent.trim())}));
}
function render(){
 const panel=document.getElementById(profile.panel);if(!panel||panel.dataset.protocol257)return false;
 const items=read(panel);if(items.length!==profile.labels.length)return false;
 if(items.some((item,i)=>item.label!==profile.labels[i])){document.documentElement.dataset.protocol257='mismatch';return false;}
 const root=make('div',null,'protocol257');root.id='protocol257';root.append(make('h2','Протокол МРТ'),make('p','Единый порядок блоков · параметры адаптируют к клинической задаче и оборудованию.','protocolLead257'));
 // Preserve the visible scope of the GE example and primary-MS protocol.
 if(file==='rectal-cancer.html')root.append(make('p',panel.querySelector('h2').textContent,'protocolLead257'));
 if(profile.adapter==='ms'){const scope=panel.querySelector('h2 + p');if(scope)root.append(make('p',scope.textContent,'protocolLead257'));}
 for(const group of ['P','B','E','C','Q']){const section=make('section',null,'protocolGroup257');section.dataset.protocolGroup=group;section.append(make('h3',headings[group]),make('p',intro[group],'protocolHint257'));let count=0;
 items.forEach((item,i)=>{if(profile.groups[i]!==group)return;count++;const card=make('article',null,'protocolItem257');card.dataset.protocolItem=String(i);card.append(make('h4',item.label));if(item.fields){const dl=make('dl');for(const f of item.fields){dl.append(make('dt',f.label),make('dd',f.text));}card.append(dl);}else for(const text of item.paragraphs)card.append(make('p',text));section.append(card);});
 if(!count)section.append(make('p',empty[group],'protocolEmpty257'));
 if(group==='C')section.append(make('p','Зафиксируйте название и дозу препарата, факт введения и фактическое время фаз. При отсутствии контраста или сорванной фазе явно ограничьте оценку усиления.','protocolHint257'));
 if(group==='Q')section.append(make('p','DWI оценивают вместе с ADC, усиление — с сопоставимой нативной серией. Выводы об отсутствующих последовательностях не делают.','protocolHint257'));
 root.append(section);
 }
 root.append(make('p','AX — аксиально; COR — коронально; SAG — сагиттально; FS — подавление жира; FOV — поле обзора; gap — межсрезовый промежуток. Числа и единицы приведены в карточках; параметры интерполяции не подменяют разрешение сбора.','protocolTerms257'));
 const original=make('details',null,'protocolOriginal257');original.append(make('summary','Технические таблицы и дополнительные пояснения'));while(panel.firstChild)original.append(panel.firstChild);panel.append(root,original);panel.dataset.protocol257='ready';
 const tab=[...document.querySelectorAll('button')].find(b=>b.getAttribute('aria-controls')===profile.panel||b.dataset.tab===profile.panel||b.dataset.neckTab==='scanning'||b.dataset.topicTab==='scanning');if(tab){tab.textContent='Протокол МРТ';if(new URLSearchParams(location.search).get('protocol257')==='1'){tab.click();panel.scrollIntoView({block:'start'});}}
 document.documentElement.dataset.protocol257='ready';return true;
}
if(profile){let observer;const attempt=()=>{if(render())observer?.disconnect();};observer=new MutationObserver(attempt);observer.observe(document.body,{childList:true,subtree:true});attempt();}
