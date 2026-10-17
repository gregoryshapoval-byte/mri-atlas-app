// Pure parametric geometry, independent of the rendering engine.
export const TYPES=['normal','long','radial','horizontal','flap','bucket','complex','root'];
export function point(t,u,v,side='medial'){
 const lateral=side==='lateral',start=(lateral?.19:.35)*Math.PI,end=(lateral?1.81:1.65)*Math.PI;
 const a=start+(end-start)*t;
 const width=(.13+.43*Math.pow(Math.max(0,Math.sin(Math.PI*t)),.55))*(1-.13*Math.sin(a));
 const rx=lateral?1.03:1.04,rz=lateral?1.22:1.4;
 const x=(rx-width*(1-u))*Math.cos(a), z=(rz-width*(1-u))*Math.sin(a);
 const h=.045+.27*u;
 return [(lateral?.94:-.94)+(lateral?-x:x),.07+h*v,z];
}
// Each closed volume has six boundary surfaces. cut identifies true fracture faces.
export function volume(range,side,move=()=>[0,0,0],cut=[],fragment=false){
 const [ta,tb,ua=0,ub=1,va=0,vb=1]=range;let positions=[],indices=[],groups=[];
 const tval=(x,u)=>typeof x==='function'?x(u):x;
 function P(t,u,v){let p=point(t,u,v,side),d=move(t,u,v);return p.map((x,i)=>x+d[i]);}
 const faces=[(s,r)=>[tval(ta,ua+(ub-ua)*s),ua+(ub-ua)*s,va+(vb-va)*r],(s,r)=>[tval(tb,ua+(ub-ua)*s),ua+(ub-ua)*s,va+(vb-va)*r],(s,r)=>[tval(ta,ua)+(tval(tb,ua)-tval(ta,ua))*s,ua,va+(vb-va)*r],(s,r)=>[tval(ta,ub)+(tval(tb,ub)-tval(ta,ub))*s,ub,va+(vb-va)*r],(s,r)=>{let u=ua+(ub-ua)*r;return [tval(ta,u)+(tval(tb,u)-tval(ta,u))*s,u,va]},(s,r)=>{let u=ua+(ub-ua)*r;return [tval(ta,u)+(tval(tb,u)-tval(ta,u))*s,u,vb]}];
 faces.forEach((fn,f)=>{let off=positions.length/3,start=indices.length,n=36,m=10;for(let i=0;i<=n;i++)for(let j=0;j<=m;j++)positions.push(...P(...fn(i/n,j/m)));for(let i=0;i<n;i++)for(let j=0;j<m;j++){let k=off+i*(m+1)+j;indices.push(k,k+1,k+m+1,k+1,k+m+2,k+m+1)}groups.push({start,count:indices.length-start,material:fragment||cut.includes(f)?1:0})});
 return {positions,indices,groups};
}
export function model(type,side,amount=.6){
 if(!TYPES.includes(type))throw Error('Unknown type');
 const out=[],sign=side==='medial'?1:-1,gap=.009+.018*amount;
 const add=(r,move,cut,frag)=>out.push(volume(r,side,move,cut,frag));
 const fixed=()=>[0,0,0];
 if(type==='normal'){add([0,1]);return out;}
 if(type==='radial'||type==='root'){
  let at=type==='root'?.94:.62;
  add([0,at-gap],fixed,[1]);add([at+gap,1],fixed,[0]);return out;
 }
 if(type==='long'||type==='bucket'){
  const a=.18,b=.84;
  add([0,a]);add([b,1]);
  add([a,b,.57+gap,1],fixed,[2]);
  const move=type==='bucket'?(t)=>{let f=Math.sin(Math.PI*Math.max(0,Math.min(1,(t-a)/(b-a))));return [sign*(.42+amount*1.05)*f,(.08+amount*.25)*f,0]}:fixed;
  add([a,b,0,.57-gap],move,[3],type==='bucket');return out;
 }
 if(type==='horizontal'){
  const a=.25,b=.94;add([0,a]);add([b,1]);
  add([a,b,0,1,0,.48],fixed,[5]);
  add([a,b,0,1,.54,1],t=>[0,(.03+amount*.35)*Math.sin(Math.PI*(t-a)/(b-a)),0],[4]);return out;
 }
 if(type==='flap'){
  const A=.48,B=u=>A+.30*u,um=.7;
  add([0,A-gap,0,um],fixed,[1]);
  add([u=>B(u)+gap,1,0,um],fixed,[0]);
  add([0,1,um,1]);
  add([A,u=>B(u),.02,um],(t,u)=>{let f=(um-u)/um;return [sign*(.1+amount*.36)*f,(.08+amount*.55)*f,0]},[0,1],true);return out;
 }
 // Two directions: horizontal cleavage plus radial defect in posterior body/horn.
 add([0,.35]);add([.92,1]);
 for(const [a,b]of [[.35,.64-gap],[.64+gap,.92]]){
  add([a,b,0,1,0,.46],fixed,[0,1,5]);
  add([a,b,0,1,.55,1],()=>[0,.04+amount*.16,0],[0,1,4]);
 }
 return out;
}
