// Couinaud numbering is a display layer over the untouched source points/masks.
export const liverSegments=[
 {structure:2895,number:'I',arabic:'1',name:'Хвостатая доля',color:'#66FFFF'},
 {structure:2890,number:'II',arabic:'2',name:'Левый латеральный верхний сегмент',color:'#CC66FF'},
 {structure:2891,number:'III',arabic:'3',name:'Левый латеральный нижний сегмент',color:'#9900FF'},
 {structure:2893,number:'IV',arabic:'4',name:'Левый медиальный сегмент',color:'#00FF00'},
 {structure:2898,number:'V',arabic:'5',name:'Правый передний нижний сегмент',color:'#FFFF00'},
 {structure:2901,number:'VI',arabic:'6',name:'Правый задний нижний сегмент',color:'#FF9900'},
 {structure:2902,number:'VII',arabic:'7',name:'Правый задний верхний сегмент',color:'#FF0000'},
 {structure:2899,number:'VIII',arabic:'8',name:'Правый передний верхний сегмент',color:'#FF99FF'}
];
export function addAbdomenAnatomy(data){
 data.numberedStructures={};data.displayNames={};data.shortNames={};data.searchAliases={};data.structureNotes={};
 for(const s of liverSegments){data.numberedStructures[s.structure]=s.number;data.displayNames[s.structure]='S '+s.number+' · '+s.name;data.shortNames[s.structure]='S '+s.number;data.searchAliases[s.structure]='сегмент печени '+s.arabic+' S'+s.arabic+' S'+s.number+' Couinaud Куино';data.structureNotes[s.structure]='Сегмент '+s.number+' по Куино. Цвет и координаты исходного атласа.'+(s.number==='IV'?' В исходнике IV не разделён на IVa и IVb.':'')+([2898,2899].includes(s.structure)?' Номер исправлен по латинскому и английскому названиям источника.':'')}
 for(const sl of Object.values(data.slices))sl.points=sl.points.map(p=>data.numberedStructures[p.structure]?{...p,preserveColor:true}:p);
 const segments=data.filters.abdomen.find(f=>f.id===4);segments.default=true;
}
