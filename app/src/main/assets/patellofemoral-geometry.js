// Right knee teaching coordinates: X lateral, Y superior, Z anterior.
// Parametric anatomy; no patient units or diagnostic thresholds.
export const presets={
 normal:{name:'Норма',tilt:0,shift:0,alta:0,flat:0},
 tilt:{name:'Латеральный наклон',tilt:25,shift:0,alta:0,flat:0},
 shift:{name:'Латеральное смещение',tilt:0,shift:.7,alta:0,flat:0},
 alta:{name:'Patella alta',tilt:0,shift:0,alta:1,flat:0},
 flat:{name:'Плоский блок',tilt:0,shift:0,alta:0,flat:1},
 combined:{name:'Сочетание изменений',tilt:22,shift:.65,alta:.7,flat:.85}
};
export function widthAt(y){return 1.62-.18*((y-.8)/1.5)**2}
export function frontAt(x,y,flat){return 1.28-.10*((y-.85)/1.6)**2+.055*x-(.46-.38*flat)*Math.exp(-((x/.66)**2))}
function loft(ring,N=64,M=80){const positions=[],indices=[];for(let i=0;i<=N;i++)for(let j=0;j<M;j++)positions.push(...ring(i/N,j/M));for(let i=0;i<N;i++)for(let j=0;j<M;j++){let a=i*M+j,b=i*M+(j+1)%M;indices.push(a,a+M,b,b,a+M,b+M)}for(const row of [0,N]){let center=[0,0,0];for(let j=0;j<M;j++)for(let k=0;k<3;k++)center[k]+=positions[(row*M+j)*3+k]/M;let idx=positions.length/3;positions.push(...center);for(let j=0;j<M;j++)indices.push(idx,row*M+j,row*M+(j+1)%M)}return {positions,indices}}
export function femurMesh(flat=0){return loft((u,v)=>{
 const y=-.12+2.45*u,w=widthAt(y),edge=.84*w;
 const back=x=>-.52-.42*Math.exp(-(((Math.abs(x)-.9)/.65)**2));
 let x,z;
 if(v<.4){x=-edge+2*edge*v/.4;z=frontAt(x,y,flat)}
 else if(v<.55){const t=(v-.4)/.15,hi=frontAt(edge,y,flat),lo=back(edge);x=edge+.16*w*Math.sin(Math.PI*t);z=(hi+lo)/2+(hi-lo)/2*Math.cos(Math.PI*t)}
 else if(v<.85){x=edge-2*edge*(v-.55)/.3;z=back(x)}
 else{const t=(v-.85)/.15,hi=frontAt(-edge,y,flat),lo=back(-edge);x=-edge-.16*w*Math.sin(Math.PI*t);z=(hi+lo)/2-(hi-lo)/2*Math.cos(Math.PI*t)}
 return [x,y,z];
})}
// Front half of each ring is convex; posterior half has a central ridge and two facets.
export function localPatellaMesh(){return loft((u,v)=>{let y=-.78+1.56*u,f=Math.sqrt(Math.max(.00001,1-(y/.78)**2))*(.85+.14*y/.78),t=2*Math.PI*v,x=.72*f*Math.cos(t);let back=-.25+.24*Math.abs((x+.10*f)/(.82*f));let z=Math.sin(t)>=0?.10+.25*Math.sqrt(Math.max(0,1-(x/(.72*f))**2))*f:back*f;return [x,y,z]},56,80)}
const local=localPatellaMesh();
export function pose(s){const c=Math.cos(s.tilt*Math.PI/180),q=Math.sin(s.tilt*Math.PI/180),cy=.95+s.alta;let cz=1.25;for(let i=0;i<local.positions.length;i+=3){let [x,y,z]=local.positions.slice(i,i+3),xx=x*c+z*q+s.shift,zz=-x*q+z*c,yy=y+cy;if(yy>=-.12&&yy<=2.33&&Math.abs(xx)<=widthAt(yy))cz=Math.max(cz,frontAt(xx,yy,s.flat)+.12-zz)}return {c,q,cy,cz}}
export function transform(p,s,ps=pose(s)){const [x,y,z]=p;return [x*ps.c+z*ps.q+s.shift,y+ps.cy,-x*ps.q+z*ps.c+ps.cz]}
export function patellaMesh(s){const ps=pose(s),positions=[];for(let i=0;i<local.positions.length;i+=3)positions.push(...transform(local.positions.slice(i,i+3),s,ps));return {positions,indices:local.indices}}
// Intersect the actual rendered triangles with Y=level. Returned points are X,Z.
export function sectionSegments(mesh,level){const segs=[];for(let i=0;i<mesh.indices.length;i+=3){let vs=mesh.indices.slice(i,i+3).map(k=>mesh.positions.slice(k*3,k*3+3)),hits=[];for(let j=0;j<3;j++){let a=vs[j],b=vs[(j+1)%3],da=a[1]-level,db=b[1]-level;if((da<0&&db>=0)||(db<0&&da>=0)){let t=da/(da-db);hits.push([a[0]+t*(b[0]-a[0]),a[2]+t*(b[2]-a[2])])}}if(hits.length===2)segs.push(hits)}return segs}
