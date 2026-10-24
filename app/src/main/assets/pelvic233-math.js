// Distances in cm: negative above PCL, positive below. Descriptive, no POP-Q conversion.
export function classify(d,r){
 if(!Number.isFinite(d)||!Number.isFinite(r)||r<0)return {valid:false,message:'Введите конечные числа; глубина ректоцеле не может быть отрицательной.'};
 const level=d<=0?'На PCL или выше':d<1?'Менее 1 см ниже PCL':d<=3?'Диапазон I: 1–3 см ниже PCL':d<=6?'Диапазон II: >3–6 см ниже PCL':'Диапазон III: >6 см ниже PCL';
 const rect=r===0?'Выпячивания нет':r<=2?'Небольшое выпячивание ≤2 см':r<=4?'Ректоцеле >2–4 см':'Ректоцеле >4 см';
 return {valid:true,level,rect,significant:d>3};
}
export function mobility(rest,max){return Number.isFinite(rest)&&Number.isFinite(max)?max-rest:null}
