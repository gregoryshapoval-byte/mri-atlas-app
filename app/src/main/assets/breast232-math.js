export function classifyKinetics(s0,se,sl){
 if([s0,se,sl].some(v=>!Number.isFinite(v))||s0<=0||se<=0||sl<0)return {valid:false,message:'Нужны числовые значения: исходный и ранний сигнал >0; поздний ≥0.'};
 const early=100*(se-s0)/s0,late=100*(sl-se)/se;
 if(early<=0)return {valid:false,message:'Нет положительного раннего усиления: проверьте ROI, исходную T1, контраст и время фаз.',early,late};
 return {valid:true,early,late,initial:early<50?'медленное':early<=100?'среднее':'быстрое',delayed:late>10?'persistent':late< -10?'washout':'plateau'};
}
