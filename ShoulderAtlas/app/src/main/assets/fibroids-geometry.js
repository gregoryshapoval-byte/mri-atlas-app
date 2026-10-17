// Generalized uterine anatomy. X lateral, Y fundusward, Z anterior.
// Profiles are teaching units, never patient measurements.
const outerProfile=[[-2.25,.43,.36],[-1.8,.5,.39],[-1.3,.48,.38],[-.85,.43,.36],[-.45,.68,.49],[0,1.08,.65],[.6,1.4,.76],[1.25,1.64,.8],[1.65,1.57,.72],[1.95,1.2,.55],[2.17,.56,.26],[2.23,.005,.005]];
const innerProfile=[[-2.25,.045,.04],[-.85,.045,.04],[-.45,.14,.05],[0,.36,.06],[.6,.62,.065],[1.25,.9,.065],[1.45,.97,.06],[1.61,.56,.04],[1.69,.005,.005]];
function interp(profile,y){if(y<profile[0][0]||y>profile.at(-1)[0])return [0,0];for(let i=1;i<profile.length;i++)if(y<=profile[i][0]){let a=profile[i-1],b=profile[i],t=(y-a[0])/(b[0]-a[0]);return [a[1]*(1-t)+b[1]*t,a[2]*(1-t)+b[2]*t]}return [0,0]}
export function outer(y){
 if(y<outerProfile[0][0]||y>outerProfile.at(-1)[0])return [0,0];
 let i=1;while(y>outerProfile[i][0])i++;const a=outerProfile[i-1],b=outerProfile[i],h=b[0]-a[0],t=(y-a[0])/h;
 const slope=(j,k)=>{const rate=q=>(outerProfile[q+1][k]-outerProfile[q][k])/(outerProfile[q+1][0]-outerProfile[q][0]);if(j===0)return rate(0);if(j===outerProfile.length-1)return rate(j-1);let u=rate(j-1),v=rate(j);return u*v<=0?0:2*u*v/(u+v)};
 return [1,2].map(k=>(2*t**3-3*t*t+1)*a[k]+(t**3-2*t*t+t)*h*slope(i-1,k)+(-2*t**3+3*t*t)*b[k]+(t**3-t*t)*h*slope(i,k));
}
export function inner(y,id){let [w,d]=interp(innerProfile,y);if(w&&['0','1','2','2-5'].includes(id)){d+=.30*Math.exp(-(((y-.6)/.62)**4))}return [w,d]}
export const types={
 '0':{name:'Внутриполостной на ножке',position:[.10,.6,0],r:.26,color:'#ba685e',stalk:[[.36,.6,0],[.665,.6,0]]},
 '1':{name:'Субмукозный · <50%',position:[.465,.6,0],r:.34,color:'#ba685e'},
 '2':{name:'Субмукозный · ≥50%',position:[.825,.6,0],r:.34,color:'#ba685e'},
 '3':{name:'Контакт с эндометрием',position:[.9481,.6,0],r:.26,color:'#bd8f47'},
 '4':{name:'Интрамуральный',position:[1.025,.6,0],r:.22,color:'#bd8f47'},
 '5':{name:'Субсерозный · ≥50%',position:[1.23,.6,0],r:.32,color:'#9373a6'},
 '6':{name:'Субсерозный · <50%',position:[1.60,.6,0],r:.32,color:'#9373a6'},
 '7':{name:'Субсерозный на ножке',position:[2.06,.6,0],r:.33,color:'#9373a6',stalk:[[1.4,.6,0],[1.73,.6,0]]},
 '8':{name:'Другой · шеечный',position:[.46,-1.6,0],r:.36,color:'#508d9c'},
 '2-5':{name:'Гибридный',position:[1.025,.6,0],r:.53,color:'#9c6785'}
};
export function surface(kind,id){let lo=-2.25,hi=kind==='outer'?2.23:1.69,N=180,M=96,positions=[],indices=[];for(let i=0;i<=N;i++){let y=lo+(hi-lo)*i/N,[w,d]=kind==='outer'?outer(y):inner(y,id);if(kind==='endoOuter'){w+=.045;d+=.035}for(let j=0;j<=M;j++){let a=j/M*2*Math.PI;positions.push(w*Math.cos(a),y,d*Math.sin(a))}}for(let i=0;i<N;i++)for(let j=0;j<M;j++){let a=i*(M+1)+j,b=a+M+1;indices.push(a,b,a+1,a+1,b,b+1)}return {positions,indices}}
export function cutFace(id,layer='myo'){let positions=[],indices=[],N=240;for(let sign of [-1,1]){const start=positions.length/3;for(let i=0;i<=N;i++){let y=-2.25+4.48*i/N,[o]=outer(y),[w]=inner(y,id),endo=w>0?Math.min(o,w+.045):0;let a=layer==='myo'?endo:w,b=layer==='myo'?o:endo;positions.push(sign*a,y,0,sign*b,y,0)}for(let i=0;i<N;i++){let a=start+i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2)}}return {positions,indices}}
export function sampleSection(id){const wall=[],endo=[];for(let i=0;i<=240;i++){let y=-2.25+4.48*i/240;wall.push([y,...outer(y)]);endo.push([y,...inner(y,id)])}return {wall,endo,node:types[id]}}
