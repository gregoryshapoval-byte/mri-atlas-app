import * as T from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
const $=s=>document.querySelector(s), host=$('#canvas');
const scene=new T.Scene();scene.background=new T.Color('#111a22');scene.fog=new T.Fog('#e8efeb',18,40);
let renderer;try{renderer=new T.WebGLRenderer({antialias:true,alpha:false});}catch(e){$('#failure').hidden=false;throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.localClippingEnabled=true;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.32;host.appendChild(renderer.domElement);
const camera=new T.PerspectiveCamera(35,1,.1,100);camera.position.set(6,3,10);
const control=new OrbitControls(camera,renderer.domElement);control.target.set(-.3,-.6,0);control.enableDamping=true;control.minDistance=4;control.maxDistance=18;control.autoRotateSpeed=.6;control.maxPolarAngle=Math.PI-.05;
scene.add(new T.HemisphereLight(0xffffff,0x7f9691,2.4));for(const [p,int] of [[[4,8,7],4],[[-5,2,-4],3],[[2,-2,5],1]]){const l=new T.DirectionalLight(0xffffff,int);l.position.set(...p);scene.add(l)}
const root=new T.Group();scene.add(root);const groups={},surfaces=[],labels=[];let selected='sasd',isolated=false;
const V=p=>new T.Vector3(...p), material=(color,opacity=1)=>new T.MeshStandardMaterial({color,roughness:.47,metalness:.02,transparent:opacity<1,opacity,side:T.DoubleSide,depthWrite:opacity>=1});
function group(id){const g=new T.Group();root.add(g);groups[id]=g;return g}
['bones','cuff','deltoid','ligaments','capsule','sasd','sc','ss','ax','bi','supra','cc'].forEach(group);
const bone=material('#e8dfc7'), cartilage=material('#c0c7b7'),muscle=material('#b76a65',.32),tendon=material('#f0e1cb',.72),ligament=material('#d8cab1',.8);
function mesh(geo,mat,g){const m=new T.Mesh(geo,mat);groups[g].add(m);if(['sasd','sc','ss','ax','bi','supra','cc'].includes(g)){m.userData.id=g;surfaces.push(m)}return m}
function ell(pos,scale,mat,g,rot=[0,0,0]){const m=mesh(new T.SphereGeometry(1,48,32),mat,g);m.position.set(...pos);m.scale.set(...scale);m.rotation.set(...rot);return m}
function tube(points,r,mat,g){const curve=new T.CatmullRomCurve3(points.map(V));return mesh(new T.TubeGeometry(curve,60,r,12,false),mat,g)}
// A smooth surface bounded by two curves: broad muscle origins taper to insertion.
function ribbon(a,b,mat,g,bulge=0){let A=new T.CatmullRomCurve3(a.map(V)),B=new T.CatmullRomCurve3(b.map(V));let pos=[],uv=[],idx=[],n=40,m=15;for(let i=0;i<=n;i++){let p=A.getPoint(i/n),q=B.getPoint(i/n);for(let j=0;j<=m;j++){let v=p.clone().lerp(q,j/m);v.z+=bulge*Math.sin(Math.PI*i/n)*Math.sin(Math.PI*j/m);pos.push(v.x,v.y,v.z);uv.push(i/n,j/m)}}for(let i=0;i<n;i++)for(let j=0;j<m;j++){let k=i*(m+1)+j;idx.push(k,k+m+1,k+1,k+1,k+m+1,k+m+2)}let geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();return mesh(geo,mat,g)}
function fibers(a,b,g,count=16){let A=new T.CatmullRomCurve3(a.map(V)),B=new T.CatmullRomCurve3(b.map(V));for(let j=1;j<count;j++){let pts=[];for(let i=0;i<=10;i++)pts.push(A.getPoint(i/10).lerp(B.getPoint(i/10),j/count).toArray());tube(pts,.006,material('#f1c1a5',.22),g)}}
// Coordinates: +X lateral, +Y superior, +Z anterior. Right shoulder.
ell([.65,0,0],[1.03,1.06,.99],bone,'bones',[0,0,-.24]);
ell([1.27,-.3,.03],[.55,.8,.65],bone,'bones');
tube([[1.13,-.55,.03],[1.24,-1.5,.04],[1.29,-2.7,.09],[1.35,-3.7,.11]],.35,bone,'bones');
ell([1.46,.35,-.07],[.31,.48,.36],bone,'bones');ell([.93,.05,.83],[.22,.34,.2],bone,'bones');
// Scapular blade has a curved triangular surface and thickened lateral border.
ribbon([[-.53,.45,-.35],[-1.5,.75,-.72],[-3.1,.25,-1.03]],[[-.55,-.55,-.35],[-1.35,-2,-.77],[-2.18,-2.9,-.98]],bone,'bones',-.08);
tube([[-.58,.55,-.32],[-.8,-.6,-.46],[-1.35,-2,-.77],[-2.18,-2.9,-.98]],.13,bone,'bones');
tube([[-3.1,.25,-1.03],[-2.8,-1.25,-1.11],[-2.18,-2.9,-.98]],.055,bone,'bones');
ell([-.49,-.02,-.03],[.18,.79,.53],bone,'bones',[0,0,-.12]);ell([-.31,0,.01],[.065,.67,.46],cartilage,'bones');
// Scapular spine and acromion as broad plate rather than a spherical arch.
ribbon([[-2.9,.1,-1.1],[-1.5,.48,-1.05],[-.3,1.3,-.72],[1.2,1.47,-.14]],[[-2.9,.22,-.96],[-1.5,.85,-1.12],[-.22,1.65,-.82],[1.35,1.66,.49]],bone,'bones');
tube([[-1.5,.65,-1.1],[-.3,1.48,-.76],[.65,1.65,-.3],[1.29,1.59,.43]],.13,bone,'bones');
// Coracoid projects anteriorly from superior glenoid and hooks laterally.
tube([[-.66,.65,-.14],[-.67,1.07,.32],[-.5,1.24,.94],[.03,1.1,1.22]],.17,bone,'bones');ell([.06,1.1,1.22],[.25,.16,.21],bone,'bones');
tube([[1.2,1.7,.41],[.4,1.85,.58],[-.6,1.8,.76],[-1.8,1.67,1.02],[-2.7,1.78,1.1]],.14,bone,'bones');
// Rotator cuff, broad anatomical origins and narrowed tendon insertions.
let sa=[[-2.7,.48,-.85],[-1.45,.9,-.35],[-.2,1.02,.03],[1.38,.65,.1]],sb=[[-2.55,.1,-.37],[-1.4,.4,.14],[-.2,.84,.56],[1.37,.45,.48]];
ribbon(sa,sb,muscle,'cuff',.04);fibers(sa,sb,'cuff');
ribbon([[-.15,1.01,.04],[.6,.97,.03],[1.38,.65,.1]],[[-.15,.84,.56],[.6,.8,.56],[1.37,.45,.48]],tendon,'cuff');
let ssa=[[-2.95,.1,-.74],[-1.6,.28,.1],[-.65,.36,.69],[.91,.28,.94]],ssb=[[-2.1,-2.65,-.69],[-1.4,-1.18,.05],[-.5,-.52,.65],[.99,-.2,.88]];
ribbon(ssa,ssb,muscle,'cuff',.13);fibers(ssa,ssb,'cuff',25);
ribbon([[-.55,.35,.7],[.1,.36,.94],[.91,.28,.94]],[[-.47,-.49,.68],[.1,-.3,.99],[.99,-.2,.88]],tendon,'cuff');
let ia=[[-2.8,-.1,-1.08],[-1.2,.15,-1.04],[.4,.52,-.9],[1.4,.35,-.54]],ib=[[-2.1,-2.5,-1],[-1.1,-1.1,-1.1],[.5,-.3,-.96],[1.42,-.2,-.5]];
ribbon(ia,ib,muscle,'cuff',-.08);fibers(ia,ib,'cuff');
ribbon([[.2,.45,-.94],[.9,.42,-.81],[1.4,.35,-.54]],[[.2,-.4,-1],[.9,-.25,-.8],[1.42,-.2,-.5]],tendon,'cuff');
tube([[-1.4,-1.85,-.86],[-.3,-1,-.92],[1.31,-.42,-.53]],.12,muscle,'cuff');
// Deltoid envelope: only lateral hemisphere, maintaining deep bursal plane.
function cap(g,mat,r,theta0,theta1,phi0,phi1,center=[.65,0,0],ys=1){let pos=[],idx=[],n=56,m=48;for(let i=0;i<=n;i++){let th=theta0+(theta1-theta0)*i/n;for(let j=0;j<=m;j++){let ph=phi0+(phi1-phi0)*j/m;pos.push(center[0]+r*Math.sin(th)*Math.cos(ph),center[1]+r*Math.cos(th)*ys,center[2]+r*Math.sin(th)*Math.sin(ph))}}for(let i=0;i<n;i++)for(let j=0;j<m;j++){let k=i*(m+1)+j;idx.push(k,k+1,k+m+1,k+1,k+m+2,k+m+1)}let geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setIndex(idx);geo.computeVertexNormals();return mesh(geo,mat,g)}
cap('deltoid',material('#ad655c',.16),1.63,.3,2.55,-1.6,1.65,[.61,-.05,0],1.3);
// Capsule is a contextual layer, hidden by default.
ell([.2,-.16,0],[1.16,1.27,1.1],material('#b7c8a2',.12),'capsule');groups.capsule.visible=false;
tube([[.08,1.14,1.2],[.65,1.47,.95],[1.2,1.63,.43]],.055,ligament,'ligaments');
tube([[-.55,1.22,.73],[-.78,1.55,.77],[-1.04,1.77,.85]],.08,ligament,'ligaments');
tube([[-.4,1.24,.92],[-.19,1.56,.72],[.08,1.82,.62]],.09,ligament,'ligaments');
const colors={sasd:'#009fe3',sc:'#f49b32',ss:'#4cb982',ax:'#28b9b5',bi:'#a182dd',supra:'#e9bd4b',cc:'#e17c9b'};
const bmat=id=>{let m=material(colors[id],.88);m.roughness=.22;m.metalness=.06;return m};
// One continuous cap representing the communicating SA/SD complex.
cap('sasd',bmat('sasd'),1.28,.17,1.97,-1.48,1.48,[.65,.01,0],1.0);
ell([-.18,.65,1.04],[.48,.16,.28],bmat('sc'),'sc',[.14,0,-.14]);
// Subscapular recess is posterior to the tendon, anterior to scapular neck.
ell([-.37,.08,.4],[.4,.48,.16],bmat('ss'),'ss',[0,-.3,-.1]);
tube([[-.35,-.4,.27],[-.34,-.98,.24],[.12,-1.39,.24],[.6,-1.22,.22],[.73,-.76,.15]],.13,bmat('ax'),'ax');
// Biceps synovial sleeve wraps the tendon in groove; no free bursa here.
tube([[.1,.81,.42],[.62,.84,.66],[1.15,.48,.73],[1.2,-.35,.63],[1.24,-1.42,.47]],.097,bmat('bi'),'bi');
tube([[.1,.81,.42],[.62,.84,.66],[1.15,.48,.73],[1.2,-.35,.63],[1.24,-1.8,.42]],.039,tendon,'ligaments');
ell([.88,1.83,-.05],[.43,.07,.29],bmat('supra'),'supra');
ell([-.44,1.51,.77],[.2,.13,.12],bmat('cc'),'cc');groups.supra.visible=groups.cc.visible=false;
const data={
sasd:{name:'Субакромиально-поддельтовидная',type:'Внесуставная сумка · SASD',where:'Под акромионом и дельтовидной мышцей, поверх сухожилий вращательной манжеты. Латеральный отдел продолжается ниже большого бугорка.',mri:'Коронарные и сагиттальные PD/T2 FS: прослеживай жидкость над манжетой и латерально от плеча.',note:'Субакромиальный и поддельтовидный отделы обычно сообщаются и рассматриваются как единый комплекс. Медиальное продолжение не является отдельной сумкой. В норме нет прямого сообщения с плечевым суставом.'},
sc:{name:'Подклювовидная',type:'Внесуставная сумка',where:'Под клювовидным отростком, спереди от подлопаточной мышцы и её сухожилия.',mri:'На аксиальных срезах определи, лежит ли жидкость поверх подлопаточного сухожилия. Сопоставь с сагиттальными срезами.',note:'Не путай с подлопаточным заворотом позади сухожилия. В некоторых анатомических работах различают подклювовидную и клювовидно-плечевую сумки; модель показывает обобщённую клиническую топографию.'},
ss:{name:'Подлопаточный заворот',type:'Сообщается с полостью сустава',where:'Глубже подлопаточного сухожилия, у передней поверхности шейки лопатки. Верхняя часть может огибать верхний край сухожилия.',mri:'На аксиальных и сагиттальных срезах ищи связь с суставной полостью и положение глубже подлопаточного сухожилия.',note:'Термин «подлопаточная сумка» часто используют для этого сообщающегося пространства. Номенклатура неодинакова: не следует считать любое скопление под клювовидным отростком отдельным бурситом.'},
ax:{name:'Подмышечный заворот',type:'Нижний заворот суставной капсулы',where:'Нижний отдел суставной полости между шейкой плечевой кости и нижним краем гленоида, в области нижнего плечелопаточного связочного комплекса.',mri:'Лучше всего оценивать на коронарных срезах; сопоставляй жидкость с другими отделами суставной полости.',note:'Это не внесуставная сумка. Жидкость здесь относится к суставному выпоту; само её наличие не доказывает синовит.'},
bi:{name:'Влагалище длинной головки бицепса',type:'Синовиальное влагалище · не сумка',where:'Вокруг сухожилия длинной головки бицепса в межбугорковой борозде, с проксимальным сообщением с суставом.',mri:'На аксиальных срезах жидкость окружает сухожилие в борозде; оцени сухожилие и объём выпота в суставе.',note:'Небольшое количество жидкости может сопровождать суставной выпот. Изолированная жидкость без других признаков не равна теносиновиту.'},
supra:{name:'Надакромиальная',type:'Дополнительная / вариабельная сумка',where:'Поверх акромиона, в поверхностных мягких тканях; не под акромионом.',mri:'Оцени поверхностную жидкость на коронарных и сагиттальных срезах.',note:'Редко фигурирует в рутинных описаниях. Не принимай ганглион над акромиально-ключичным суставом за надакромиальную сумку только по близости.'},
cc:{name:'Клювовидно-ключичная область',type:'Вариабельные сумки · обобщённая метка',where:'В области клювовидно-ключичного связочного комплекса между клювовидным отростком и ключицей.',mri:'Сопоставляй коронарные и сагиттальные срезы с ходом трапециевидной и конической связок.',note:'В литературе описывают несколько мелких сумок этой области. Один цветной объект здесь обозначает область их возможного расположения, а не универсальную единственную полость.'}}
function select(id){selected=id;document.querySelectorAll('.structure').forEach(b=>b.classList.toggle('active',b.dataset.id===id));let d=data[id];$('#detail').innerHTML=`<span class="kicker">${d.type}</span><h2>${d.name}</h2><p><b>Где находится</b><br>${d.where}</p><p><b>МР-ориентир</b><br>${d.mri}</p><p>${d.note}</p>`;surfaces.forEach(m=>{m.material.emissive.set(m.userData.id===id?colors[id]:'#000000');m.material.emissiveIntensity=m.userData.id===id?.2:0;m.material.opacity=m.userData.id===id?.97:.64});if(isolated){Object.keys(data).forEach(k=>groups[k].visible=k===id)}groups[id].visible=true;}
for(const [id,d]of Object.entries(data)){let b=document.createElement('button');b.className='structure';b.dataset.id=id;b.innerHTML=`<span class="dot" style="background:${colors[id]}"></span><span><strong>${d.name}</strong><small>${d.type}</small></span>`;b.onclick=()=>select(id);$(id==='supra'||id==='cc'?'#rare-list':'#list').appendChild(b)}
const layerNames={bones:'Кости и суставные поверхности',cuff:'Вращательная манжета',deltoid:'Дельтовидная мышца',ligaments:'Связки и сухожилие бицепса',capsule:'Суставная капсула'};
for(const[id,name]of Object.entries(layerNames)){let l=document.createElement('label');l.className='switch';let inp=document.createElement('input');inp.type='checkbox';inp.checked=groups[id].visible;inp.onchange=()=>groups[id].visible=inp.checked;l.append(inp,document.createTextNode(name));$('#layer-list').appendChild(l)}
$('#opacity').oninput=e=>{let v=+e.target.value/100;$('#opacity-val').value=e.target.value+'%';groups.cuff.traverse(o=>{if(o.isMesh){o.material.opacity=v;o.material.transparent=true;o.material.depthWrite=false}});groups.deltoid.traverse(o=>{if(o.isMesh)o.material.opacity=v*.5})};
$('#rare').onchange=e=>{$('#rare-list').hidden=!e.target.checked;groups.supra.visible=groups.cc.visible=e.target.checked;if(!e.target.checked&&['supra','cc'].includes(selected))select('sasd')};
$('#isolate').onclick=()=>{isolated=true;select(selected)};$('#showall').onclick=()=>{isolated=false;Object.keys(data).forEach(k=>groups[k].visible=['cc','supra'].includes(k)?$('#rare').checked:true)};
for(const b of document.querySelectorAll('[data-tab]'))b.onclick=()=>{document.querySelectorAll('.tab').forEach(t=>t.hidden=t.id!==b.dataset.tab);document.querySelectorAll('[data-tab]').forEach(t=>t.classList.toggle('active',t===b))};
const presets={front:[0,0,10],back:[0,0,-10],side:[10,0,0],top:[.01,10,.001]};const viewNames={front:'Спереди · коронарные отношения',back:'Сзади',side:'Сбоку · сагиттальные отношения',top:'Сверху · аксиальные отношения'};
for(const b of document.querySelectorAll('[data-view]'))b.onclick=()=>{control.target.set(-.3,-.6,0);camera.position.copy(control.target).add(V(presets[b.dataset.view]));camera.up.set(0,1,0);control.update();$('#orientation').textContent='Правое плечо · '+viewNames[b.dataset.view]};
$('#spin').onchange=e=>control.autoRotate=e.target.checked;
$('#reset').onclick=()=>{camera.position.set(6,3,10);control.target.set(-.3,-.6,0);control.autoRotate=false;$('#spin').checked=false;$('#cut').value='none';applyCut();$('#orientation').textContent='Правое плечо · передний косой вид';control.update()};
const plane=new T.Plane(new T.Vector3(0,0,-1),0);function applyCut(){let mode=$('#cut').value;plane.normal.set(...({cor:[0,0,-1],ax:[0,-1,0],sag:[-1,0,0]}[mode]||[0,0,-1]));plane.constant=+$('#cutpos').value;renderer.clippingPlanes=mode==='none'?[]:[plane]}$('#cut').onchange=applyCut;$('#cutpos').oninput=applyCut;
$('#help').onclick=()=>$('#guide').showModal();
function label(text,p,g){const e=document.createElement('span');e.className='label';e.textContent=text;$('#labels').appendChild(e);labels.push({e,p:V(p),g})}
label('Акромион',[1.1,1.88,-.18],'bones');label('Клювовидный отросток',[.04,1.17,1.4],'bones');label('Ключица',[-1.8,1.94,1.05],'bones');label('Лопатка',[-2.65,-1.4,-1],'bones');label('Плечевая кость',[1.5,-2.8,.1],'bones');
const ray=new T.Raycaster(),pointer=new T.Vector2();let start;renderer.domElement.addEventListener('pointerdown',e=>start=[e.clientX,e.clientY]);renderer.domElement.addEventListener('pointerup',e=>{if(!start||Math.hypot(e.clientX-start[0],e.clientY-start[1])>5)return;const rect=host.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);let hit=ray.intersectObjects(surfaces.filter(o=>o.parent.visible)).find(h=>!renderer.clippingPlanes.length||plane.distanceToPoint(h.point)>=0);if(hit)select(hit.object.userData.id)});
function resize(){let w=host.clientWidth,h=host.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)}new ResizeObserver(resize).observe(host);resize();select('sasd');
function tick(){requestAnimationFrame(tick);control.update();renderer.render(scene,camera);for(const l of labels){const p=l.p.clone().project(camera);l.e.style.display=$('#names').checked&&groups[l.g].visible&&p.z<1&&p.z>-1?'':'none';l.e.style.left=(p.x*.5+.5)*host.clientWidth+'px';l.e.style.top=(-p.y*.5+.5)*host.clientHeight+'px'}}tick();
