// Right wrist: X radial (thumb), Y distal (fingers), Z dorsal. Teaching units.
export const bones=[
 ['radius','Лучевая кость',[.65,-1.03,0],[.91,.79,.46],0],['radiusShaft','Диафиз лучевой',[.8,-2.05,0],[.53,.95,.38],0],
 ['ulna','Головка локтевой',[-1.23,-.73,0],[.43,.48,.4],0],['ulnaShaft','Диафиз локтевой',[-1.26,-1.9,0],[.29,.92,.29],0],['styloid','Шиловидный отросток локтевой',[-1.64,-.19,.11],[.13,.29,.14],-.13],['lister','Бугорок Листера',[.58,-.63,.5],[.13,.22,.17],0],
 ['scaphoid','Ладьевидная',[1.0,.63,-.07],[.38,.68,.39],-.34],['lunate','Полулунная',[.12,.53,0],[.43,.43,.39],.07],['triquetrum','Трёхгранная',[-.84,.66,.02],[.43,.42,.36],-.2],['pisiform','Гороховидная',[-1.02,.53,-.62],[.24,.29,.22],.05],
 ['trapezium','Кость-трапеция',[1.4,1.63,-.1],[.39,.4,.35],-.22],['trapezoid','Трапециевидная',[.7,1.7,.02],[.29,.34,.32],.04],['capitate','Головчатая',[.03,1.57,0],[.42,.64,.41],-.04],['hamate','Крючковидная',[-.83,1.62,-.01],[.44,.5,.38],.15],['hook','Крючок крючковидной',[-.73,1.48,-.55],[.15,.21,.26],-.17]
];
export const ligamentDefs={
 SL:{name:'Ладьевидно-полулунная · SL',color:'#4eab9b',paths:[[[.68,.49,.37],[.53,.53,.43],[.38,.5,.36]],[[.68,.44,-.36],[.52,.43,-.43],[.36,.43,-.34]],[[.57,.33,.32],[.52,.14,.05],[.55,.30,-.32]]]},
 LT:{name:'Полулунно-трёхгранная · LT',color:'#648fbd',paths:[[[-.25,.55,.35],[-.41,.63,.40],[-.52,.65,.33]],[[-.24,.53,-.33],[-.4,.59,-.40],[-.52,.62,-.32]],[[-.38,.51,.29],[-.4,.30,0],[-.4,.50,-.29]]]},
 RSC:{name:'Лучеладьевидно-головчатая · RSC',color:'#a588bf',paths:[[[1.35,-.25,-.3],[1.0,.48,-.46],[.45,1.05,-.45],[.04,1.55,-.4]]]},
 LRL:{name:'Длинная лучеполулунная · LRL',color:'#a78e62',paths:[[[.74,-.33,-.38],[.39,.06,-.48],[.04,.54,-.4]]]},
 SRL:{name:'Короткая лучеполулунная · SRL',color:'#b6a96b',paths:[[[.04,-.31,-.34],[.05,-.02,-.42],[.11,.26,-.37]]]},
 DRC:{name:'Тыльная лучезапястная · DRC',color:'#bb8376',paths:[[[.68,-.32,.42],[.14,.2,.53],[-.84,.64,.39]]]},
 DIC:{name:'Тыльная межзапястная · DIC',color:'#a1a45e',paths:[[[-.84,.71,.40],[-.24,1.06,.5],[.47,1.09,.5],[1.0,1.02,.39]]]},
 UC:{name:'Локтезапястные · UL / UT',color:'#b579a0',paths:[[[-1.16,-.11,-.4],[-.65,.14,-.48],[.03,.41,-.37]],[[-1.23,-.10,-.39],[-1.10,.24,-.47],[-.89,.59,-.34]]]}
};
export const palmer={normal:{name:'Норма',wear:false},'1A':{name:'Центральный разрыв',hole:true},'1B':{name:'Локтевое отрывное повреждение'},'1C':{name:'Дистальное отрывное повреждение'},'1D':{name:'Лучевое отрывное повреждение'},'2A':{name:'Изнашивание диска',wear:true},'2B':{name:'Изнашивание + хондромаляция',wear:true,chondral:true},'2C':{name:'Перфорация + хондромаляция',wear:true,hole:true,chondral:true},'2D':{name:'2C + повреждение LT',wear:true,hole:true,chondral:true,lt:true},'2E':{name:'2D + локтезапястный артроз',wear:true,hole:true,chondral:true,lt:true,arthrosis:true}};
export function discPresent(u,v,type){if(type==='1D'&&u<.13)return false;const p=palmer[type];if(p.hole){const a=type==='1A'?.09:.14,b=type==='1A'?.32:.33,center=type==='1A'?.27:.47;if(((u-center)/a)**2+(v/b)**2<1)return false}return true}
export function discPoint(u,v,side,type){let x=-.27-1.18*u,z=v*(.5-.29*u),h=.038+.07*(2*u-1)**2+.02*v*v;if(palmer[type].wear)h-=.025*Math.exp(-((u-.47)**2/.05+v*v/.2));return [x,-.08+side*h,z]}
export function discMesh(type){const N=100,M=70,positions=[],indices=[],cells=Array.from({length:N},(_,i)=>Array.from({length:M},(_,j)=>discPresent((i+.5)/N,-1+2*(j+.5)/M,type)));const quad=p=>{const n=positions.length/3;for(const x of p)positions.push(...x);indices.push(n,n+1,n+2,n,n+2,n+3)};
 for(let i=0;i<N;i++)for(let j=0;j<M;j++)if(cells[i][j]){const a=i/N,b=(i+1)/N,c=-1+2*j/M,d=-1+2*(j+1)/M;for(const side of [-1,1])quad([[a,c],[b,c],[b,d],[a,d]].map(([u,v])=>discPoint(u,v,side,type)));if(i===0||!cells[i-1][j])quad([discPoint(a,c,-1,type),discPoint(a,d,-1,type),discPoint(a,d,1,type),discPoint(a,c,1,type)]);if(i===N-1||!cells[i+1][j])quad([discPoint(b,c,-1,type),discPoint(b,d,-1,type),discPoint(b,d,1,type),discPoint(b,c,1,type)]);if(j===0||!cells[i][j-1])quad([discPoint(a,c,-1,type),discPoint(b,c,-1,type),discPoint(b,c,1,type),discPoint(a,c,1,type)]);if(j===M-1||!cells[i][j+1])quad([discPoint(a,d,-1,type),discPoint(b,d,-1,type),discPoint(b,d,1,type),discPoint(a,d,1,type)])}return {positions,indices,cells}}
export const tendonDefs={
 I:{name:'I канал · APL + EPB',color:'#b57b64',names:['APL','EPB'],paths:[[[1.05,-2.4,.6],[1.6,-.5,.25],[1.66,.7,.02],[1.91,2.5,-.03]],[[1.25,-2.4,.72],[1.7,-.5,.35],[1.82,.8,.24],[2.12,2.9,.25]]]},
 II:{name:'II канал · ECRL + ECRB',color:'#b59650',names:['ECRL','ECRB'],paths:[[[1.04,-2.4,.69],[1.03,-.5,.61],[.92,1,.52],[.75,2.5,.43]],[[.83,-2.4,.74],[.84,-.5,.68],[.51,1,.55],[.06,2.5,.48]]]},
 III:{name:'III канал · EPL',color:'#ab7ba7',names:['EPL'],paths:[[[.21,-2.4,.7],[.30,-.8,.79],[.42,-.4,.84],[1,.45,.92],[1.8,1.9,.43],[2.13,2.9,.35]]]},
 IV:{name:'IV канал · EDC + EIP',color:'#528eaf',names:['EDC II','EDC III','EDC IV','EDC V','EIP'],paths:[...Array.from({length:4},(_,i)=>[[.2-.19*i,-2.4,.68],[.16-.18*i,-.5,.67],[.75-.65*i,2.9,.48]]),[[.08,-2.4,.51],[.15,-.5,.52],[.58,1.5,.49],[.77,2.9,.51]]]},
 V:{name:'V канал · EDM',color:'#649778',names:['EDM'],paths:[[[-.70,-2.4,.57],[-.70,-.5,.55],[-.96,1.3,.52],[-1.25,2.9,.48]]]},
 VI:{name:'VI канал · ECU',color:'#bb7890',names:['ECU'],paths:[[[-1.42,-2.4,.34],[-1.51,-.5,.33],[-1.36,.8,.3],[-1.26,2.4,.25]]]},
 flex:{name:'Карпальный канал · 9 сухожилий',color:'#5ea89b',names:['FDS II','FDS III','FDS IV','FDS V','FDP II','FDP III','FDP IV','FDP V','FPL'],paths:[...Array.from({length:4},(_,i)=>[[.42-.27*i,-2.4,-.82],[.42-.27*i,.5,-.91],[.70-.63*i,2.9,-.65]]),...Array.from({length:4},(_,i)=>[[.42-.27*i,-2.4,-.6],[.42-.27*i,.5,-.65],[.70-.63*i,2.9,-.48]]),[[.86,-2.4,-.58],[.8,.5,-.72],[1.35,1.8,-.51],[1.95,2.9,-.35]]]},
 FCR:{name:'FCR · собственный канал',color:'#a595c0',names:['FCR'],paths:[[[1.15,-2.4,-.62],[1.22,.5,-.66],[1.24,1.6,-.51],[.78,2.5,-.3]]]},
 FCU:{name:'FCU · к гороховидной',color:'#a5a765',names:['FCU'],paths:[[[-1.09,-2.4,-.56],[-1.1,-.2,-.65],[-1.02,.48,-.79]]]},
 PL:{name:'PL · поверх удерживателя',color:'#b09a85',names:['PL'],paths:[[[.03,-2.4,-1.08],[.03,.3,-1.23],[.03,1.7,-1.22]]]}
};
