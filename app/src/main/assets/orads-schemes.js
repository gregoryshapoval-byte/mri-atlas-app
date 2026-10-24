import {categoryCases} from './orads-cases.js';
const blue='#275779',wall='#72e2cd',blood='#865744',fat='#dbbf62',tissue='#e89eac';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function caseDiagram(kind,title){
 const isCurve=/solid(Low|Intermediate|High)/.test(kind),isEarly=/early/.test(kind),cy=isCurve||isEarly?91:119,rx=94,ry=isCurve||isEarly?61:76;
 let drawing='',notes=[];
 const ellipse=(fill=blue,stroke='#a8b9c9',sw=3)=>`<ellipse cx="174" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
 const node=`<path d="M223 ${cy+52}Q202 ${cy+9} 228 ${cy-9}Q250 ${cy-6} 250 ${cy+36}Z" fill="${tissue}" stroke="${wall}" stroke-width="3"/>`;
 if(kind==='incomplete'){
  drawing=ellipse(blue,'#a8b9c9')+`<rect x="172" y="32" width="130" height="180" fill="#15232f"/><path d="M175 35V210" stroke="#e0b770" stroke-width="3" stroke-dasharray="8 6"/><text x="213" y="132" fill="#e0b770" font-size="36">?</text>`;notes=['Часть не оценена'];
 }else if(kind==='normal'){
  drawing=`<ellipse cx="174" cy="119" rx="86" ry="61" fill="#496760" stroke="#a4c0b9" stroke-width="3"/>`;
  for(const[x,y,r]of [[122,100,14],[145,78,12],[175,73,10],[206,80,12],[229,103,15],[221,139,11],[129,140,13]])drawing+=`<circle cx="${x}" cy="${y}" r="${r}" fill="${blue}" stroke="#a8b9c9" stroke-width="2"/>`;notes=['Фолликулы в яичнике'];
 }else if(kind==='follicle'){
  drawing=`<ellipse cx="174" cy="119" rx="95" ry="73" fill="#496760" stroke="#a4c0b9" stroke-width="3"/><circle cx="189" cy="117" r="48" fill="${blue}" stroke="#a8b9c9" stroke-width="2"/>`;notes=['≤3 см · пременопауза'];
 }else if(kind==='luteum'){
  drawing=`<path d="M100 91L122 64L153 72L180 56L204 74L237 78L244 108L260 132L238 155L226 178L193 174L169 188L145 171L114 168L112 138L93 117Z" fill="${blood}" stroke="${wall}" stroke-width="8"/>`;notes=['Складчатая стенка · ≤3 см'];
 }else if(['tube','tubeComplex','tubeThick'].includes(kind)){
  drawing=`<path d="M95 66C195 34 248 61 245 100S89 84 102 141S215 193 257 158" fill="none" stroke="${wall}" stroke-width="${kind==='tubeThick'?37:29}" stroke-linecap="round"/><path d="M95 66C195 34 248 61 245 100S89 84 102 141S215 193 257 158" fill="none" stroke="${kind==='tubeComplex'?blood:blue}" stroke-width="22" stroke-linecap="round"/>`;notes=[kind==='tube'?'Тонкая гладкая стенка':kind==='tubeThick'?'Простая жидкость · толстая стенка':'Непростая жидкость · тонкая стенка'];
 }else if(kind==='fibrous'){
  drawing=ellipse('#5a626f',wall,4);for(let i=0;i<7;i++)drawing+=`<path d="M${110+i*14} 77Q${100+i*14} 125 ${121+i*14} 158" fill="none" stroke="#808a98" stroke-width="2"/>`;notes=['Вся ткань: dark T2 + dark DWI'];
 }else if(kind==='fat'||kind==='fatSolid'){
  drawing=ellipse(fat,wall,4)+`<path d="M84 ${cy+20}Q180 ${cy+5} 264 ${cy+20}L245 ${cy+50}Q175 ${cy+95} 100 ${cy+40}Z" fill="${blue}" opacity=".65"/>`;
  drawing+=kind==='fat'?`<path d="M231 76Q210 94 238 108L254 93Z" fill="${tissue}" stroke="${wall}" stroke-width="3"/>`:`<path d="M179 44Q268 42 269 120Q269 185 193 192L166 157L184 128L163 98Z" fill="${tissue}" stroke="${wall}" stroke-width="4"/>`;
  notes=[kind==='fat'?'Небольшой узел Рокитанского':'Большой объём ткани с контрастом'];
 }else{
  const hemorrhagic=['blood','bloodWall','endo'].includes(kind),enhancing=['bloodWall','multi','simple','endo','para'].includes(kind);
  drawing=ellipse(hemorrhagic?blood:blue,enhancing?wall:'#a8b9c9',enhancing?5:3);
  if(kind==='blood'||kind==='bloodWall')drawing+=`<path d="M83 133Q174 113 267 134" stroke="#d6a68a" stroke-width="3" fill="none"/><path d="M104 162L129 143L158 165Z" fill="#4c3734"/>`;
  if(kind==='endo')drawing+=`<path d="M95 137Q174 177 254 134" stroke="#c18e70" stroke-width="15" opacity=".4" fill="none"/>`;
  if(kind==='multi')drawing+=`<path d="M174 44V195M86 112Q171 145 258 105" stroke="${wall}" stroke-width="4" fill="none"/>`;
  if(kind==='para')drawing+=`<ellipse cx="302" cy="132" rx="28" ry="41" fill="#496760" stroke="#a4c0b9" stroke-width="3"/><circle cx="303" cy="120" r="9" fill="${blue}" stroke="#a8b9c9"/>`;
  if(isCurve||isEarly||kind==='peritoneal')drawing+=node;
  if(kind==='peritoneal'){
   drawing+=`<path d="M37 43Q9 120 48 196M313 36Q345 127 307 202" fill="none" stroke="#a8b9c9" stroke-width="3"/>`;
   for(const[x,y,r]of [[36,65,9],[28,120,11],[38,169,8],[320,72,10],[326,131,8]])drawing+=`<circle cx="${x}" cy="${y}" r="${r}" fill="${tissue}" stroke="${wall}" stroke-width="2"/>`;
  }
  notes=[{simple:'Простая жидкость · гладкая стенка',blood:'Контраста в стенке и сгустке нет',bloodWall:'Гладкая стенка накапливает контраст',endo:'Кровь / shading · нет солидной ткани',multi:'Перегородки накапливают контраст',para:'Яичник виден отдельно',peritoneal:'Образование + узлы брюшины'}[kind]||'Солидная ткань накапливает контраст'];
 }
 if(isCurve){
  const line=kind==='solidLow'?'M62 219Q140 210 262 182':kind==='solidIntermediate'?'M62 219C102 211 118 179 158 177S231 177 262 177':'M62 219C78 210 80 164 128 160S220 160 262 160';
  drawing+=`<path d="M60 158V225H279" stroke="#8d9cae" fill="none"/><path d="M62 219C89 204 101 171 151 171S230 171 262 171" stroke="#b6c1ce" stroke-dasharray="4 4" fill="none" stroke-width="2"/><path d="${line}" stroke="${wall}" stroke-width="4" fill="none"/>`;notes.push('Кривая: ткань — цвет, миометрий — пунктир');
 }
 if(isEarly){const h=kind==='earlyHigh'?58:27;drawing+=`<rect x="100" y="${225-h}" width="42" height="${h}" fill="${wall}"/><rect x="206" y="181" width="42" height="44" fill="#a8b9c9"/><text x="121" y="243" text-anchor="middle" fill="#c6d4df" font-size="12">ткань</text><text x="227" y="243" text-anchor="middle" fill="#c6d4df" font-size="12">миометрий</text><text x="175" y="162" text-anchor="middle" fill="#c6d4df" font-size="12">Ранняя фаза 30–40 с</text>`;}
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 260" role="img" aria-label="${esc(title)} — условная схема"><title>${esc(title)} — условная схема</title><rect width="360" height="260" rx="16" fill="#101e28"/>${drawing}${!isEarly?notes.map((n,i)=>`<text x="180" y="${isCurve?(i===0?18:251):230+i*17}" text-anchor="middle" fill="#c6d4df" font-size="${isCurve?12:13}">${esc(n)}</text>`).join(''):''}</svg>`;
}
export function initSchemes(){
 const host=document.getElementById('categoryChoices');
 for(const score of Object.keys(categoryCases)){const b=document.createElement('button');b.dataset.category=score;b.textContent=score;b.setAttribute('aria-label','O-RADS MRI '+score);b.onclick=()=>show(score);host.append(b);}
 function show(score){const data=categoryCases[score];for(const b of host.children)b.setAttribute('aria-pressed',String(b.dataset.category===score));document.getElementById('schemeCategory').textContent='O-RADS MRI '+score+' · '+data.title;document.getElementById('schemeRisk').textContent=data.risk;document.getElementById('schemeIntro').textContent=data.intro;const cards=document.getElementById('caseCards');cards.replaceChildren();
  for(const[kind,title,when,comment]of data.cases){const article=document.createElement('article');article.className='caseCard';article.dataset.case=kind;article.innerHTML=`<div class="caseFigure">${caseDiagram(kind,title)}</div><div class="caseText"><h3>${esc(title)}</h3><p class="caseWhen"><b>Когда:</b> ${esc(when)}</p><p class="caseComment"><b>Комментарий:</b> ${esc(comment)}</p></div>`;cards.append(article);}
 }
 show('2');
}
