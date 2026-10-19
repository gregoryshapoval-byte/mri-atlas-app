import * as T from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {hillCases,headMesh,HEAD_CENTER,headPoint} from './hill-sachs-data.js';
import {hillSources} from './hill-sachs-data.js';
import {cases,labrumParts,labrumMesh,surfaceMesh} from './labrum-data.js';
const $=s=>document.querySelector(s),host=$('#canvas'),requested=new URLSearchParams(location.search).get('case');
let selected=hillCases.some(c=>c.id===requested)?requested:'hill',compare=false,current,size=1;
const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.05,150);let renderer;
try{renderer=new T.WebGLRenderer({antialias:true,alpha:true})}catch(e){$('#failure').hidden=false;throw e}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0,0);renderer.toneMapping=T.ACESFilmicToneMapping;host.append(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=6;controls.maxDistance=50;
scene.add(new T.HemisphereLight(0xd6edff,0x343b41,2.4));for(const[p,intensity]of [[[8,8,8],3],[[-8,4,-8],2]]){const l=new T.DirectionalLight(0xffffff,intensity);l.position.set(...p);scene.add(l)}
const model=new T.Group(),joint=new T.Group();scene.add(model,joint);
const material=color=>new T.MeshStandardMaterial({color,roughness:.55,side:T.DoubleSide});
function mesh(data,color,group){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(data.positions,3));g.setIndex(data.indices);g.computeVertexNormals();const m=material(color);if(data.colors){g.setAttribute('color',new T.Float32BufferAttribute(data.colors,3));m.vertexColors=true}const object=new T.Mesh(g,m);group.add(object);return object}
function clear(group){for(const c of [...group.children]){c.geometry?.dispose();c.material?.dispose();group.remove(c)}}
function rebuild(){current=hillCases.find(c=>c.id===(compare?'normal':selected));const chosen=hillCases.find(c=>c.id===selected);clear(model);clear(joint);mesh(headMesh(current,size),0xffffff,model);
 const shaft=new T.Mesh(new T.CylinderGeometry(.86,.68,4.5,40),material('#b6ad97'));shaft.position.set(4.5,-3.2,0);shaft.rotation.z=-.16;model.add(shaft);
 const neck=new T.Mesh(new T.SphereGeometry(1,40,24),material('#b6ad97'));neck.scale.set(1.25,1.45,1.2);neck.position.set(4.45,-1.25,0);model.add(neck);
 const paired=cases.find(c=>c.id===($('#paired').checked&&!compare?chosen.paired:'normal'));
 mesh(surfaceMesh(paired), '#c5bda4',joint);mesh(surfaceMesh(paired,true),'#6bb6d3',joint);for(const part of labrumParts(paired))mesh(labrumMesh(part,paired),part.affected?'#ef8876':'#5abfb9',joint);
 joint.visible=$('#joint').checked;$('#title').textContent=compare?'Норма · сравнение':chosen.name;$('#location').textContent=current.location;$('#mechanism').textContent=current.mechanism;$('#mriNote').textContent=current.mri;$('#report').textContent=current.report;
 $('#compare').disabled=selected==='normal';$('#compare').textContent=compare?'К повреждению':'С нормой';$('#compare').setAttribute('aria-pressed',String(compare));$('#paired').disabled=selected==='normal'||compare;$('#size').disabled=!current.direction;
 $('#paired').parentElement.lastChild.textContent=selected==='reverse'?' Возможный обратный Bankart':' Возможный Bankart';$('#labrumLink').href='shoulder-labrum.html?lesion='+chosen.paired;
 $('#headLabels').replaceChildren();if(current.direction){const el=document.createElement('span');el.className='anatomyLabel';el.textContent='Костная импрессия';$('#headLabels').append(el)}updateLabels();}
const views={posterior:[0,.15,1],anterior:[0,.15,-1],superior:[.1,1,.01]};let view='defect';
function frame(next='defect'){view=next;const chosen=hillCases.find(c=>c.id===selected),dir=new T.Vector3(...(next==='defect'?(chosen.direction||[-.3,.3,1]):views[next])).normalize(),center=new T.Vector3(2.8,-1.2,0),tan=Math.tan(T.MathUtils.degToRad(camera.fov/2)),distance=Math.max(5.2/(tan*Math.max(.35,(host.clientHeight-125)/host.clientHeight)),4.5/(tan*camera.aspect*.88));camera.up.set(0,1,0);if(next==='superior')camera.up.set(0,0,-1);camera.position.copy(center).addScaledVector(dir,distance);controls.target.copy(center);controls.update();for(const b of document.querySelectorAll('[data-view]'))b.setAttribute('aria-pressed',String(b.dataset.view===next))}
function updateLabels(){const el=$('#headLabels .anatomyLabel');if(!el)return;const w=host.clientWidth,h=host.clientHeight,p=new T.Vector3(...headPoint(current.direction,current,size)).project(camera);el.hidden=!$('#names').checked||p.z<-1||p.z>1;el.style.left=Math.max(80,Math.min(w-80,(p.x+1)*w/2))+'px';el.style.top=Math.max(90,Math.min(h-85,(1-p.y)*h/2-30))+'px'}
for(const c of hillCases){const o=document.createElement('option');o.value=c.id;o.textContent=c.name;$('#lesion').append(o)}$('#lesion').value=selected;$('#lesion').onchange=e=>{selected=e.target.value;compare=false;$('#paired').checked=false;rebuild();frame()};$('#compare').onclick=()=>{compare=!compare;rebuild()};$('#size').oninput=e=>{size=Number(e.target.value)/100;$('#sizeValue').textContent=size<1?'Меньше':size>1?'Больше':'Средний';rebuild()};$('#joint').onchange=()=>joint.visible=$('#joint').checked;$('#paired').onchange=rebuild;$('#names').onchange=updateLabels;for(const b of document.querySelectorAll('[data-view]'))b.onclick=()=>frame(b.dataset.view);$('#reset').onclick=()=>frame();
for(const s of hillSources){const a=document.createElement('a');a.href=s.url;a.textContent=s.name;$('#sources').append(a)}
function orientation(){const v=camera.position.clone().sub(controls.target).normalize(),axis=Math.abs(v.x)>Math.abs(v.z)?'x':'z';$('#orientation').textContent=Math.abs(v.y)>.75?(v.y>0?'Вид сверху':'Вид снизу'):axis==='x'?(v.x>0?'Латеральная сторона':'Медиальная сторона'):(v.z>0?'Задняя сторона':'Передняя сторона')}
let first=true;new ResizeObserver(()=>{if(!host.clientWidth||!host.clientHeight)return;camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();renderer.setSize(host.clientWidth,host.clientHeight);if(first){first=false;frame()}updateLabels()}).observe(host);
rebuild();renderer.setAnimationLoop(()=>{if(document.hidden)return;controls.update();orientation();renderer.render(scene,camera);updateLabels()});document.body.dataset.ready='true';window.hill3D={scene,camera,renderer,controls,model,joint,frame,get lesion(){return current},get selected(){return selected},get size(){return size}};
