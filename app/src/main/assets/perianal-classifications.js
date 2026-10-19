// Original schematic geometry; classification references are linked in the guide.
// Parks describes anatomical TYPES. St James describes MRI GRADES, not temporal stages.
const inter='M110 140 L136 140 L136 214 L172 232';
const trans='M110 140 L136 140 L173 163 L196 232';
const supra='M110 140 L136 140 L136 78 Q140 57 157 69 L183 96 L196 232';
const extra='M110 45 L165 45 L192 98 L196 232';
export const parksTypes=[
 {number:1,roman:'I',name:'Межсфинктерный',tract:inter,note:'Ход между сфинктерами; наружный сфинктер не пересечён.'},
 {number:2,roman:'II',name:'Транссфинктерный',tract:trans,note:'Ход пересекает наружный сфинктер в седалищно-анальную клетчатку.'},
 {number:3,roman:'III',name:'Супрасфинктерный',tract:supra,note:'Ход поднимается между сфинктерами, огибает puborectalis сверху и спускается снаружи.'},
 {number:4,roman:'IV',name:'Экстрасфинктерный',tract:extra,note:'Высокое сообщение с прямой кишкой; ход через леватор вне сфинктерного комплекса.'}
];
export const jamesGrades=[
 {number:1,name:'Простой межсфинктерный',tract:inter,note:'Линейный межсфинктерный ход без абсцесса и вторичных ходов.'},
 {number:2,name:'Межсфинктерный + осложнения',tract:inter,abscess:{cx:136,cy:118,rx:6,ry:17,compartment:'intersphincteric'},branch:'M136 175 L132 188 L137 201',note:'Абсцесс или вторичный ход в межсфинктерном пространстве. На схеме показаны оба варианта.'},
 {number:3,name:'Транссфинктерный',tract:trans,note:'Пересечение наружного сфинктера без абсцесса или вторичного хода в седалищно-анальной ямке.'},
 {number:4,name:'Транссфинктерный + осложнения',tract:trans,abscess:{cx:185,cy:181,rx:14,ry:19,compartment:'ischioanal'},branch:'M173 163 L195 147 L210 163',note:'Абсцесс или вторичный ход в седалищно-анальной / седалищно-прямокишечной ямке.'},
 {number:5,name:'Выше или через леватор',tract:supra,abscess:{cx:157,cy:62,rx:16,ry:12,compartment:'supralevator'},note:'Супралеваторное или транс­леваторное распространение. Пример: высокий ход с абсцессом выше леватора.'}
];
const anatomy='<path d="M22 92 L65 108 L81 94 M139 94 L155 108 L201 92" stroke="#CF9BFF" stroke-width="12" fill="none"/><path d="M70 110 L70 208 M150 110 L150 208" stroke="#F28BCB" stroke-width="13"/><path d="M96 104 L96 198 M124 104 L124 198" stroke="#49E0CF" stroke-width="8"/><path d="M96 104 L96 25 M124 104 L124 25" stroke="#88DBA4" stroke-width="5"/><path d="M35 232 H205" stroke="#87949c" stroke-width="3"/><text x="120" y="249" fill="#a7b5bc" text-anchor="middle" font-size="10">кожа промежности</text>';
export function classificationSvg(model,system){
 const badge=system==='Parks'?`Parks ${model.roman} · тип ${model.number}`:`St James · степень ${model.number}`;
 const abscess=model.abscess?`<ellipse class="schematicAbscess" data-compartment="${model.abscess.compartment}" cx="${model.abscess.cx}" cy="${model.abscess.cy}" rx="${model.abscess.rx}" ry="${model.abscess.ry}" fill="#FFB35C" fill-opacity=".45" stroke="#FFB35C" stroke-width="2" aria-label="Абсцесс"/>`:'';
 const branch=model.branch?`<path class="secondaryTract" d="${model.branch}" stroke="#FF6B6B" stroke-width="3" stroke-dasharray="4 3" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-label="Вторичный ход"/>`:'';
 return `<svg viewBox="0 0 220 282" role="img" aria-label="${badge}: ${model.name}. Условная коронарная схема"><rect x="7" y="5" width="206" height="28" rx="7" fill="#233c46"/><text class="classificationBadge" x="110" y="24" text-anchor="middle" fill="#F4FAFC" font-size="13" font-weight="700">${badge}</text><g transform="translate(0 25)">${anatomy}<path class="primaryTract" d="${model.tract}" fill="none" stroke="#FF6B6B" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-label="Основной свищевой ход"/>${branch}${abscess}</g></svg>`;
}
export function renderClassifications(host,models,system){
 for(const model of models){const figure=document.createElement('figure');figure.dataset.classification=system;figure.dataset.number=model.number;figure.innerHTML=classificationSvg(model,system);const caption=document.createElement('figcaption'),title=document.createElement('strong'),note=document.createElement('p');title.textContent=system==='Parks'?`Тип ${model.roman} (${model.number}) · ${model.name}`:`Степень ${model.number} · ${model.name}`;note.textContent=model.note;caption.append(title,note);const launch=document.createElement('button');launch.className='trainingLaunch';launch.dataset.trainingCase=(system==='Parks'?'parks-':'james-')+model.number;launch.textContent='Показать пример на МРТ';launch.onclick=()=>window.dispatchEvent(new CustomEvent('perianal-training-select',{detail:{key:launch.dataset.trainingCase}}));caption.append(launch);figure.append(caption);host.append(figure)}
}
