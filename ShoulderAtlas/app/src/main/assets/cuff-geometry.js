export const TYPES=['normal','articular','bursal','internal','full','retracted'];
export function point(t,u,v){const x=-2.0+3.42*t,base=1.12+.10*Math.sin(Math.PI*t)-.52*t**6;const width=1.04-.12*t;return [x,base+.23*v,(u-.5)*width];}
export function regions(type,amount=.5){
 if(!TYPES.includes(type))throw Error('Unknown type');
 if(type==='normal')return [[0,1,0,1,0,1]];
 if(type==='retracted')return [[0,.82-.32*amount,0,1,0,1]];
 let a=type==='internal'?.63:.78,b=type==='internal'?.91:1,c=.26,d=.74;
 let lo=0,hi=1;if(type==='articular')hi=.15+.65*amount;if(type==='bursal')lo=1-(.15+.65*amount);if(type==='internal'){lo=.28;hi=.72;}
 let r=[[0,a,0,1,0,1],[a,b,0,c,0,1],[a,b,d,1,0,1]];
 if(b<1)r.push([b,1,0,1,0,1]);if(lo>0)r.push([a,b,c,d,0,lo]);if(hi<1)r.push([a,b,c,d,hi,1]);return r;
}
export function meshData(r,type){const [a,b,c,d,e,f]=r,positions=[],indices=[],groups=[];
 const face=[(s,q)=>[a,c+(d-c)*s,e+(f-e)*q],(s,q)=>[b,c+(d-c)*s,e+(f-e)*q],(s,q)=>[a+(b-a)*s,c,e+(f-e)*q],(s,q)=>[a+(b-a)*s,d,e+(f-e)*q],(s,q)=>[a+(b-a)*s,c+(d-c)*q,e],(s,q)=>[a+(b-a)*s,c+(d-c)*q,f]];
 const cut=[a>0,b<1,c>0,d<1,e>0,f<1];
 face.forEach((fn,k)=>{let start=indices.length,off=positions.length/3,n=32,m=8;for(let i=0;i<=n;i++)for(let j=0;j<=m;j++)positions.push(...point(...fn(i/n,j/m)));for(let i=0;i<n;i++)for(let j=0;j<m;j++){let z=off+i*(m+1)+j;indices.push(z,z+1,z+m+1,z+1,z+m+2,z+m+1)}groups.push({start,count:indices.length-start,material:cut[k]&&type!=='normal'?1:0})});return {positions,indices,groups};
}
