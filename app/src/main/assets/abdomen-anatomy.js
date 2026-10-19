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
// Explicit reviewed frame assignments; transition frames retain an unresolved label.
export const segmentIVReview={
 a:[10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27],
 transition:[28,29,30,31,32,33,34,35,36,37],
 b:[38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73]
};
export const liverSubsegments=[
 {structure:166401,number:'IVa',arabic:'4a',name:'Левый медиальный верхний подсегмент',color:'#00FF00'},
 {structure:166402,number:'IVb',arabic:'4b',name:'Левый медиальный нижний подсегмент',color:'#00B86B'},
 {structure:166403,number:'IVa/b',arabic:'4',name:'Переходный уровень IVa / IVb',color:'#00FF00'}
];
export function addAbdomenAnatomy(data){
 data.numberedStructures={};data.displayNames={};data.shortNames={};data.searchAliases={};data.structureNotes={};
 for(const s of [...liverSegments,...liverSubsegments]){data.numberedStructures[s.structure]=s.number;data.displayNames[s.structure]='S '+s.number+' · '+s.name;data.shortNames[s.structure]='S '+s.number;data.searchAliases[s.structure]='сегмент печени '+s.arabic+' S'+s.arabic+' S'+s.number+' Couinaud Куино';data.structureNotes[s.structure]='Сегмент '+s.number+' по Куино. Цвет и координаты исходного атласа.'+(s.number==='IV'?' В исходнике IV не разделён на IVa и IVb.':'')+([2898,2899].includes(s.structure)?' Номер исправлен по латинскому и английскому названиям источника.':'')}
 for(const sl of Object.values(data.slices))sl.points=sl.points.map(p=>data.numberedStructures[p.structure]?{...p,preserveColor:true}:p);
 for(const [kind,frames]of Object.entries(segmentIVReview))for(const frame of frames){
  const sl=data.slices[frame];if(!sl)continue;
  const spec=liverSubsegments[kind==='a'?0:kind==='b'?1:2];
  sl.points=sl.points.map(p=>p.structure===2893?{...p,sourceStructure:2893,structure:spec.structure,color:spec.color,approximate:true,preserveColor:true}:p);
  data.structureNotes[spec.structure]='≈ Учебное уточнение исходного сегмента IV по визуальному обзору этой серии. IVa — выше, IVb — ниже уровня левой воротной ветви. На кадрах 28–37 граница не определена: IVa/b, без точного разделения цветного поля. Исходный контур IV сохранён; это не независимая объёмная сегментация.';
 }
 data.displayNames[2879]='Левая медиальная часть печени · сегмент IV';
 data.shortNames[2879]='Медиальная часть печени';
 data.searchAliases[2879]='квадратная доля сегмент IV IVa IVb 4a 4b';
 data.structureNotes[2879]='В источнике весь сегмент IV назван квадратной долей, включая верхние срезы. Квадратная доля топографически соответствует нижней части, IVb; здесь используется общее название медиальной части левой печени. Координата источника сохранена.';
 data.maskTransform=(mask,slice)=>{
  if(!slice.points.some(p=>p.structure===166402))return mask;
  const canvas=document.createElement('canvas');canvas.width=mask.naturalWidth;canvas.height=mask.naturalHeight;
  const ctx=canvas.getContext('2d');ctx.drawImage(mask,0,0);const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);
  for(let i=0;i<pixels.data.length;i+=4){const d=pixels.data;if(d[i+1]>d[i]*1.8&&d[i+1]>d[i+2]*1.8){d[i]=0;d[i+1]=184;d[i+2]=107}}
  ctx.putImageData(pixels,0,0);return canvas;
 };
 data.segmentControls=true;data.masksInPoints=true;data.maskOpacity=.9;
 data.defaultsRevision='liver166';
 const segments=data.filters.abdomen.find(f=>f.id===4);segments.default=true;
}
