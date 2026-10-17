import * as T from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {model,point,TYPES} from './meniscus-geometry.js';
const $=s=>document.querySelector(s),host=$('#canvas');
const info={
normal:['Норма','Целый мениск','Непрерывная ткань с клиновидным сечением. Наружный край толще свободного внутреннего.','Оцени форму, сигнал, оба корня и положение относительно края плато. Внутрименисковый сигнал без выхода к поверхности сам по себе не равен разрыву.'],
long:['Продольный','Продольный вертикальный разрыв','Идёт вдоль дуги мениска, примерно параллельно периферическому краю; плоскость разрыва вертикальна.','На сагиттальных и коронарных срезах прослеживай выход сигнала на суставную поверхность и протяжённость по серии. В этом примере смещения нет.'],
radial:['Радиальный','Радиальный разрыв','Пересекает циркулярные волокна от свободного края к периферии. Здесь показан полный разрыв по ширине; бывают и неполные.','Ищи дефект свободного края, усечение нормального треугольника, «марширующую щель» на соседних срезах. Оцени глубину и протяжённость.'],
horizontal:['Горизонтальный','Горизонтальное расслоение','Разделяет мениск на верхний и нижний листки, приблизительно параллельно плато. Листки на модели приподняты для обзора.','Прослеживай связь сигнала со свободным краем или суставной поверхностью. Проверь параменисковые кисты и возможное смещение листка.'],
flap:['Лоскутный','Косой лоскутный разрыв','Один из вариантов «клюва попугая»: косая линия формирует лоскут у свободного края. Его свободный конец показан приподнятым.','Опиши место дефекта, размер и положение лоскута. Лоскутные разрывы также могут возникать при горизонтальном расслоении; это не единственная форма.'],
bucket:['Ручка лейки','Разрыв по типу «ручки лейки»','Продольный разрыв со смещением внутреннего фрагмента к межмыщелковой области; концы фрагмента остаются связанными с мениском.','Ищи фрагмент в межмыщелковой вырезке, уменьшение тела мениска, absent bow-tie. Возможен double PCL sign, но он не обязателен; ЗКС на модели не показана.'],
complex:['Сложный','Сложный многоплоскостной разрыв','Сочетание нескольких направлений. Здесь совмещены горизонтальное расслоение и радиальный компонент.','Перечисли компоненты, поражённые отделы и смещённые фрагменты. Слово «сложный» без уточнения не описывает весь объём изменений.'],
root:['Корневой','Разрыв у заднего корня','На модели — радиальный дефект рядом с задним корневым прикреплением. Корневые повреждения включают радиальные разрывы в пределах 1 см от прикрепления и отрыв корня.','Ищи дефект корня в трёх плоскостях, ghost sign и усечение. Экструзия — косвенный признак, не обязательный и не специфичный. Здесь отрыв костного фрагмента не моделируется.']};
let type='radial',side='medial',amount=.6;
const scene=new T.Scene();scene.background=new T.Color('#e6eeea');
const camera=new T.PerspectiveCamera(35,1,.1,60);camera.position.set(5,6,7);
let renderer;try{renderer=new T.WebGLRenderer({antialias:true});}catch(e){$('#failure').hidden=false;throw e;}renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;host.appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.target.set(0,0,0);controls.minDistance=4;controls.maxDistance=15;controls.autoRotateSpeed=.7;
scene.add(new T.HemisphereLight(0xffffff,0x839889,2.5));for(const [p,int]of [[[3,7,5],3],[[-4,3,-5],2]]){let l=new T.DirectionalLight(0xffffff,int);l.position.set(...p);scene.add(l)}
const mat=(c,o=1)=>new T.MeshStandardMaterial({color:c,roughness:.43,metalness:.02,side:T.DoubleSide,transparent:o<1,opacity:o,depthWrite:o>=1});
const tissue=mat('#e2c9ae'),cut=mat('#da715e'),normal=mat('#adbbb4',.8),boneMat=mat('#dedbc4',.52),rootMat=mat('#d8b797');
const damaged=new T.Group(),healthy=new T.Group(),bones=new T.Group(),roots=new T.Group();scene.add(damaged,healthy,bones,roots);
function sphere(p,s,m,g){let o=new T.Mesh(new T.SphereGeometry(1,40,24),m);o.position.set(...p);o.scale.set(...s);g.add(o)}
sphere([-.95,-.27,0],[1.22,.27,1.54],boneMat,bones);sphere([.95,-.27,0],[1.18,.27,1.41],boneMat,bones);sphere([0,-.85,0],[1.73,.69,1.17],boneMat,bones);
function clear(g){while(g.children.length){let m=g.children[0];m.geometry.dispose();g.remove(m)}}
function display(parts,g,mats){for(const p of parts){let geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(p.positions,3));geo.setIndex(p.indices);p.groups.forEach(q=>geo.addGroup(q.start,q.count,q.material));geo.computeVertexNormals();g.add(new T.Mesh(geo,mats))}}
function rebuild(){clear(damaged);clear(healthy);clear(roots);display(model(type,side,amount),damaged,[tissue,cut]);display(model('normal',side==='medial'?'lateral':'medial'),healthy,[normal,normal]);
 for(const s of ['medial','lateral'])for(const t of [0,1]){let p=point(t,.5,.25,s),end=[s==='medial'?-.32:.32,-.06,t===0?.87:-.87];let curve=new T.CatmullRomCurve3([new T.Vector3(...p),new T.Vector3((p[0]+end[0])/2,.03,(p[2]+end[2])/2),new T.Vector3(...end)]);roots.add(new T.Mesh(new T.TubeGeometry(curve,14,.07,8,false),rootMat))}
 $('#scene-heading').textContent=info[type][1];$('#detail').innerHTML=`<span class="kicker">${side==='medial'?'МЕДИАЛЬНЫЙ':'ЛАТЕРАЛЬНЫЙ'} МЕНИСК</span><h2>${info[type][1]}</h2><p>${info[type][2]}</p><p><b>На МРТ</b><br>${info[type][3]}</p>`;
 document.querySelectorAll('[data-type]').forEach(b=>b.classList.toggle('active',b.dataset.type===type));$('#amount').disabled=type==='normal';
}
for(const id of TYPES){let b=document.createElement('button');b.dataset.type=id;b.textContent=info[id][0];b.onclick=()=>{type=id;rebuild()};$('#types').appendChild(b)}
for(const s of ['medial','lateral'])$('#'+s).onclick=()=>{side=s;$('#medial').classList.toggle('active',s==='medial');$('#lateral').classList.toggle('active',s==='lateral');rebuild()};
$('#amount').oninput=e=>{amount=+e.target.value/100;$('#amount-val').value=e.target.value+'%';rebuild()};
$('#bone').onchange=e=>bones.visible=e.target.checked;$('#other').onchange=e=>healthy.visible=e.target.checked;$('#roots').onchange=e=>roots.visible=e.target.checked;$('#spin').onchange=e=>controls.autoRotate=e.target.checked;
const poses={top:[0,9,.001],front:[0,2,9],side:[9,2,0],oblique:[5,6,7]};for(const b of document.querySelectorAll('[data-view]'))b.onclick=()=>{camera.position.set(...poses[b.dataset.view]);controls.target.set(0,0,0);controls.update()};$('#reset').onclick=()=>{camera.position.set(5,6,7);controls.target.set(0,0,0);controls.autoRotate=false;$('#spin').checked=false;controls.update()};
const labels=[];for(const [text,p]of [['СПЕРЕДИ',[0,.1,1.9]],['СЗАДИ',[0,.1,-1.9]],['Медиальный',[-2.3,.4,0]],['Латеральный',[2.3,.4,0]]]){let el=document.createElement('span');el.className='label';el.textContent=text;$('#labels').appendChild(el);labels.push({el,p:new T.Vector3(...p)})}
function resize(){let w=host.clientWidth,h=host.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)}new ResizeObserver(resize).observe(host);resize();rebuild();
function animate(){requestAnimationFrame(animate);controls.update();renderer.render(scene,camera);for(const l of labels){let p=l.p.clone().project(camera);l.el.style.display=$('#names').checked&&p.z<1?'':'none';l.el.style.left=(p.x*.5+.5)*host.clientWidth+'px';l.el.style.top=(-p.y*.5+.5)*host.clientHeight+'px'}}animate();
