// Screen layout only; all anatomical coordinates remain in their source modules.
export function clockLayout(points,width,height,force=false){
 const overlap=(a,b)=>Math.abs(a.x-b.x)<27&&Math.abs(a.y-b.y)<27;
 const rails=force||points.some((p,i)=>!Number.isFinite(p.x+p.y)||p.x<15||p.x>width-15||p.y<48||p.y>height-94||points.slice(i+1).some(q=>overlap(p,q)));
 if(!rails)return{rails:false,points:points.map(p=>({...p}))};
 const ordered=[...points].sort((a,b)=>a.x-b.x||a.hour-b.hour),top=60,bottom=Math.max(top+112,height-86),out=[];
 for(const[side,list]of [[0,ordered.slice(0,6)],[1,ordered.slice(6)]]){list.sort((a,b)=>a.y-b.y||a.hour-b.hour);list.forEach((p,i)=>out.push({...p,x:side?width-20:20,y:top+(bottom-top)*i/Math.max(1,list.length-1)}));}
 return{rails:true,points:out};
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
