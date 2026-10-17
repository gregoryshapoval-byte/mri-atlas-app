// Right knee: +X lateral, +Y superior, +Z anterior. Teaching coordinates.
export const SPECS={
 acl:{name:'ПКС',full:'Передняя крестообразная связка',color:'#d6a852',points:[[.12,.18,.62],[.25,.78,.1],[.48,1.52,-.48]],width:.24,depth:.13},
 pcl:{name:'ЗКС',full:'Задняя крестообразная связка',color:'#55a6aa',points:[[-.08,-.1,-1.03],[-.14,.88,-.57],[-.43,1.55,.38]],width:.31,depth:.17},
 mcl:{name:'МКС',full:'Поверхностная медиальная коллатеральная связка',color:'#b591c2',points:[[-2,1.32,-.06],[-2.12,.1,.02],[-1.62,-1.65,.18]],width:.62,depth:.065},
 lcl:{name:'ЛКС',full:'Малоберцовая коллатеральная связка',color:'#69ae88',points:[[2,1.3,-.08],[2.14,.22,-.26],[2.03,-.75,-.48]],width:.18,depth:.12}
};
export function ranges(state,location,gap,fiber){
 if(state==='normal'||(state==='partial'&&fiber<6))return [[0,1]];
 const at={proximal:.82,middle:.5,distal:.18}[location];const g=.025+.075*gap;
 return [[0,at-g],[at+g,1]];
}
