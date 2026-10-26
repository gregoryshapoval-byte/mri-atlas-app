// PI-RR consensus 2021; RP and RT algorithms cross-checked against Shetty 2025.
export const likelihood=['','очень низкая','низкая','неопределённая','высокая','очень высокая'];
export function assess({therapy,dwi,dce,adequate=false,sameFocus=false}){
 const valid=n=>Number.isInteger(n)&&n>=1&&n<=5;
 if(!['RP','RT'].includes(therapy))return {score:null,reason:'Выберите радикальную простатэктомию или лучевую терапию всей железы. Для других методов этот алгоритм не применяется.'};
 if(!adequate||!valid(dce)||!valid(dwi))return {score:null,reason:'Оценка ограничена: нужны диагностические DCE и DWI/ADC и выбранные баллы. X не означает отсутствие рецидива.'};
 if(therapy==='RP'){
  const upgrade=(dce===2||dce===3)&&dwi>=4&&sameFocus;
  return {score:dce+(upgrade?1:0),reason:upgrade?'После РПЭ: DWI 4–5 в том же очаге повышает DCE 2 → 3 или DCE 3 → 4.':'После РПЭ итог определяется DCE. Повышение допустимо только для DCE 2–3 при совпадающем очаге DWI 4–5.'};
 }
 const upgrade=dwi===4&&dce===4&&sameFocus;
 return {score:upgrade?5:Math.max(dwi,dce),reason:upgrade?'После ЛТ: совпадающие DWI 4 + DCE 4 → PI-RR 5.':'После ЛТ: выбирается больший из баллов DWI и DCE. Баллы разных очагов не объединяют.'};
}
