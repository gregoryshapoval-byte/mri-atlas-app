import * as T from './vendor/three.module.js';
import {mghlPath} from './labrum-variants173.js';
// Illustrative display dimensions, not diagnostic thickness thresholds.
export const mghlStyle={color:'#b69ae8',cord:[.20,.20],ribbon:[.14,.035]};
export function mghlGeometry(cord=true){
 const curve=new T.CatmullRomCurve3(mghlPath(cord).map(p=>new T.Vector3(...p))),g=new T.TubeGeometry(curve,64,1,12,false),a=g.attributes.position,[width,thickness]=cord?mghlStyle.cord:mghlStyle.ribbon;
 // Scale the two local cross-section axes, never a fixed world axis.
 for(let i=0;i<=64;i++){const c=curve.getPointAt(i/64),n=g.normals[i],b=g.binormals[i];for(let j=0;j<=12;j++){const angle=j/12*Math.PI*2,p=c.clone().addScaledVector(n,-Math.cos(angle)*width).addScaledVector(b,Math.sin(angle)*thickness);a.setXYZ(i*13+j,p.x,p.y,p.z);}}
 a.needsUpdate=true;g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();return g;
}
