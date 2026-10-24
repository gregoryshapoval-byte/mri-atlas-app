(function(root){
'use strict';
function assess({zone,t2,dwi,dce='X',adequate=true}){
 if(!adequate)return {score:null,reason:'Качество ограничивает оценку. Укажите причину; используйте таблицы для неполного исследования и решите вопрос о повторении серии.'};
 if(!['PZ','TZ'].includes(zone))return {score:null,reason:'Укажите исходную PZ или TZ.'};
 const valid=n=>Number.isInteger(n)&&n>=1&&n<=5;
 if(!valid(dwi)||!valid(t2)||!['+','-','X'].includes(dce))return {score:null,reason:'Проверьте баллы серий и DCE.'};
 if(zone==='PZ'){
  if(dwi===3)return {score:dce==='+'?4:3,reason:dce==='+'?'PZ: DWI 3 + DCE+ → PI-RADS 4.':dce==='X'?'PZ: по DWI — 3. DCE не оценено; возможность повышения до 4 не проверена.':'PZ: DWI 3 + DCE− → PI-RADS 3.'};
  return {score:dwi,reason:'PZ: итог определяется DWI / ADC.'};
 }
 const score=t2===2&&dwi>=4?3:t2===3&&dwi===5?4:t2;
 return {score,reason:t2===2&&dwi>=4?'TZ: T2 2 + DWI 4–5 → PI-RADS 3.':t2===3&&dwi===5?'TZ: T2 3 + DWI 5 → PI-RADS 4.':'TZ: итог определяется T2; DCE категорию не меняет.'};
}
const api={assess};root.ProstateRules=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
