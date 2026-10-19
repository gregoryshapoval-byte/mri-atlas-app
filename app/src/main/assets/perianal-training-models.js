// Explicit native-image control frames. These are approximate educational examples,
// not observed pathology, skin openings or a coherent 3D reconstruction.
const frames={cor50:{series:'perianal-314',annotation:'8186',sourceIndex:50,title:'Фронтальный · общий ход'},cor54:{series:'perianal-314',annotation:'8190',sourceIndex:54,title:'Фронтальный · другая учебная проекция'},ax38:{series:'perianal-312',annotation:'8029',sourceIndex:38,title:'Аксиальный · отношение к сфинктерам'}};
const interCor=[[310,515],[299,515],[296,529],[300,546],[310,561],[310,577]],transCor=[[310,515],[299,515],[285,522],[263,533],[243,556]],supraCor=[[310,515],[299,515],[297,482],[298,447],[295,420],[282,398],[265,394],[246,409],[237,443],[232,497],[224,550]],extraCor=[[309,400],[285,400],[262,401],[241,417],[230,450],[226,500],[219,550]],supra54=[[309,511],[299,511],[298,478],[298,444],[292,412],[279,390],[262,389],[242,406],[231,441],[225,488],[220,542]],extra54=[[307,393],[284,392],[260,394],[238,410],[226,441],[221,486],[216,540]],interAx=[[313,414],[303,414],[294,414],[284,414]],transAx=[[313,414],[303,414],[294,414],[284,414],[271,417],[251,433]];
const target=(frame,tract,note,extra={})=>({...frames[frame],tract,note,approximate:true,observedFistula:false,...extra});
const interNote='Ход выходит из канала и идёт между внутренним и наружным сфинктерами. EAS не пересечён.';
const transNote='Ход пересекает наружный сфинктер и продолжается в седалищно-анальную клетчатку.';
const supraNote='Подъём между сфинктерами, огибание puborectalis сверху и спуск снаружи через тазовое дно. Высота условная.';
const extraNote='Высокое сообщение с прямой кишкой и ход через леватор снаружи сфинктерного комплекса. Исключают иной тазовый источник.';
const simpleInter=()=>[target('cor50',interCor,interNote),target('ax38',interAx,interNote+' На аксиальном примере показан только поперечный участок, не весь вертикальный ход.')];
const simpleTrans=()=>[target('cor50',transCor,transNote),target('ax38',transAx,transNote)];
export const trainingCases=[
 {key:'parks-1',label:'Parks I · межсфинктерный',targets:simpleInter()},
 {key:'parks-2',label:'Parks II · транссфинктерный',targets:simpleTrans()},
 {key:'parks-3',label:'Parks III · супрасфинктерный',targets:[target('cor50',supraCor,supraNote),target('cor54',supra54,supraNote)]},
 {key:'parks-4',label:'Parks IV · экстрасфинктерный',targets:[target('cor50',extraCor,extraNote),target('cor54',extra54,extraNote)]},
 {key:'james-1',label:'St James 1 · простой межсфинктерный',targets:simpleInter()},
 {key:'james-2',label:'St James 2 · межсфинктерный + осложнения',targets:[target('cor50',interCor,interNote+' Оранжевым — условный межсфинктерный абсцесс; пунктиром — вторичная ветвь.',{abscess:{cx:296,cy:518,rx:2,ry:10,compartment:'intersphincteric'},branch:[[296,529],[293,537],[295,543]]}),target('ax38',interAx,'Условная полость ограничена межсфинктерным пространством.',{abscess:{cx:284,cy:414,rx:2,ry:6,compartment:'intersphincteric'}})]},
 {key:'james-3',label:'St James 3 · транссфинктерный',targets:simpleTrans()},
 {key:'james-4',label:'St James 4 · транссфинктерный + осложнения',targets:[target('cor50',transCor,transNote+' Абсцесс и ветвь показаны в седалищно-анальной ямке.',{abscess:{cx:246,cy:530,rx:14,ry:19,compartment:'ischioanal'},branch:[[263,533],[251,508],[236,495]]}),target('ax38',transAx,'Условный абсцесс и вторичный ход снаружи EAS, в седалищно-анальной ямке.',{abscess:{cx:249,cy:433,rx:14,ry:11,compartment:'ischioanal'},branch:[[271,417],[256,399],[243,397]]})]},
 {key:'james-5',label:'St James 5 · выше / через леватор',targets:[target('cor50',supraCor,'Пример супралеваторного распространения с полостью выше леватора. Степень 5 определяется высотой, а не наличием абсцесса.',{abscess:{cx:267,cy:383,rx:14,ry:11,compartment:'supralevator'}}),target('cor54',extra54,'Другой пример степени 5: транс­леваторный ход. Это отдельный вариант, а не продолжение предыдущей модели.')]} 
];
export const trainingState={key:''};
export function currentTrainingCase(){return trainingCases.find(c=>c.key===trainingState.key)}
export function targetForFrame(series,frame){return currentTrainingCase()?.targets.find(t=>t.series===series.id&&t.annotation===frame.annotation)}
