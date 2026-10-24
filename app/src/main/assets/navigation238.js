// Clinical MRI guides are deliberately distinct from real image atlases.
export const groups=[
 {id:'mri',title:'МР-анатомия',description:'Реальные снимки с анатомическими метками'},
 {id:'ct',title:'КТ · снимки',description:'Реальные серии и анатомические метки'},
 {id:'clinical',title:'Клинические модули',description:'Признаки, классификации и описание'},
 {id:'model',title:'3D и анатомические схемы',description:'Модели и готовые ракурсы'},
 {id:'reference',title:'Общие справочники',description:'Один справочник доступен из нескольких областей'}
];
export function groupItems(items){return groups.map(g=>({...g,items:items.filter(i=>i.contentKind===g.id)})).filter(g=>g.items.length)}
export function normalize(s){return s.toLocaleLowerCase('ru').replace(/ё/g,'е').replace(/\s+/g,' ').trim()}
export function matches(item,q){return normalize(item.title+' '+item.description+' '+item.type).includes(normalize(q))}
export function cardBadge(item){return item.contentKind==='mri'?'МР-АНАТОМИЯ · СНИМКИ':item.contentKind==='ct'?'КТ · СНИМКИ':item.contentKind==='reference'?'ОБЩИЙ СПРАВОЧНИК':item.type}
