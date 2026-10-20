// Screen layout only; all anatomical coordinates remain in their source modules.
// Keep every digit at its projected anatomical point, even in profile views.
export function clockLayout(points){
 return{rails:false,points:points.map(p=>({...p}))};
}
export const comparisonGroups=[
 {id:'superior',label:'Борозда / SLAP II',cases:['recess','slap2']},
 {id:'variant',label:'Отверстие / Буфорд / MGHL',cases:['foramen','buford','cord']},
 {id:'anterior',label:'Bankart / Perthes / ALPSA',cases:['bankart','perthes','alpsa']},
 {id:'posterior',label:'Обратный Bankart / Kim / POLPSA',cases:['reverse','kim','polpsa']},
 {id:'slap',label:'SLAP I–IV',cases:['slap1','slap2','slap3','slap4']},
 {id:'capsule',label:'HAGL / GAGL',cases:['hagl','gagl']}
];
export const shortNames={recess:'Борозда',slap2:'SLAP II',foramen:'Отверстие',buford:'Буфорд',cord:'MGHL',bankart:'Bankart',perthes:'Perthes',alpsa:'ALPSA',reverse:'Обратный Bankart',kim:'Kim',polpsa:'POLPSA',slap1:'SLAP I',slap3:'SLAP III',slap4:'SLAP IV',hagl:'HAGL',gagl:'GAGL'};
