// Original teaching diagrams. No source figure is copied or traced.
const C={cavity:'#d9edf9',retro:'#f5d9c5',extra:'#f7e8bd',sub:'#ffe9a2',pelvic:'#f9e4ac',perineal:'#e0d6f2',fascia:'#168b7b',peritoneum:'#e47d26',muscle:'#b2bdd0',organ:'#d8a4ad'};
const e=(x,y,rx,ry,fill,stroke='#7b8494',sw=2)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const p=(d,fill='none',stroke='#7b8494',sw=2,extra='')=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const t=(x,y,s,size=17)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="#20334d">${s}</text>`;
const f=(id,s)=>`<g data-space="${id}" class="feature">${s}</g>`;
const line=(id,d,color=id==='peritoneum'?C.peritoneum:C.fascia)=>f(id,p(d,'none',color,5));
const organ=(x,y,rx,ry,name)=>e(x,y,rx,ry,C.organ)+t(x,y+5,name);
function base(){return e(340,290,285,230,'#f1f4f8','#91a0b4',3)+e(340,281,264,207,C.extra,'#91a0b4')+t(340,31,'ПЕРЕД · A',16)+t(340,548,'ЗАД · P',16)+t(27,294,'R',19)+t(653,294,'L',19)+p('M300 473 Q340 452 380 473 L370 501 Q340 492 310 501 Z','#ded9d1')+t(340,488,'Позв.',14);}
function cavity(d='M85 190 Q110 72 340 73 Q565 72 595 190 L586 275 Q500 302 430 275 Q340 250 250 275 Q170 303 94 275 Z'){return f('peritoneal',p(d,C.cavity,'#e47d26',4));}
function renal(){return f('aps',p('M93 275 Q165 301 245 275 Q340 252 435 275 Q510 301 587 275 L582 346 Q510 312 435 333 Q340 310 245 333 Q169 312 98 346 Z',C.retro,'none'))+f('pps',e(205,410,102,52,C.retro)+e(475,410,102,52,C.retro))+f('prs',e(205,363,92,65,'#ffe8a5',C.fascia,4)+e(475,363,92,65,'#ffe8a5',C.fascia,4))+f('renal-fascia',p('M113 361 C117 280 283 280 297 361 M383 361 C393 280 563 280 567 361','none',C.fascia,4)+p('M113 364 C117 449 283 449 297 364 M383 364 C393 449 563 449 567 364','none','#7b53a3',4))+organ(205,365,43,30,'Почка')+organ(475,365,43,30,'Почка')+e(322,378,14,14,'#6b91c5')+e(359,380,12,12,'#d7767c')+t(340,415,'НПВ / аорта',14);}
function bowel(){return [[230,170],[320,158],[405,180],[275,228],[370,235]].map(([x,y])=>organ(x,y,30,22,'')).join('')+t(337,205,'Петли кишки',17);}
function colon(){return organ(150,294,27,31,'')+organ(530,294,27,31,'')+t(150,342,'Восх.',14)+t(530,342,'Нисх.',14);}
const genericPins={peritoneal:[340,110],peritoneum:[110,220],central:[345,437],preperitoneal:[335,67],mesentery:[345,280],aps:[340,309],prs:[230,390],pps:[172,435],'renal-fascia':[126,340],interfascial:[552,429],fusion:[535,345],'gutter-r':[100,258],'gutter-l':[582,258],'infra-r':[250,216],'infra-l':[442,245],lesser:[440,258],omentum:[350,203],transversalis:[89,360],lateroconal:[88,306],pararectal:[482,397]};
function axial(id,sex){let s=base(),pins={...genericPins};
 if(id==='diaphragm'){
  s+=cavity('M87 211 Q100 78 340 75 Q570 79 592 214 L580 368 Q340 425 98 368 Z');
  s+=organ(255,241,145,115,'Печень')+organ(475,243,58,58,'Желудок')+f('bare',p('M153 328 Q230 365 300 348 L305 386 Q190 395 133 356 Z',C.extra,'#937e51',2))+line('peritoneum','M112 212 Q123 130 220 127 M395 239 Q410 315 480 307');
  s+=p('M342 83 L342 127','none',C.peritoneum,4)+t(342,65,'Серповидная связка',14);pins={'right-subphrenic':[175,112],'left-subphrenic':[492,123],bare:[217,365],peritoneum:[122,196]};
 }else if(id==='lesser-sac'){
  s+=cavity();s+=renal();s+=organ(225,204,115,80,'Печень')+organ(456,209,83,46,'Желудок')+organ(560,218,23,49,'Сел.');
  s+=f('lesser',p('M370 250 Q447 275 526 253 L526 282 Q445 307 370 285 Z',C.cavity,C.peritoneum,3));s+=organ(440,313,105,18,'Поджелудочная');
  s+=f('omentum',p('M328 180 L380 198 L381 218 L328 210 Z',C.sub,'#bd944b',2));pins.morison=[165,291];pins.lesser=[443,277];pins.mesentery=[351,181];pins.omentum=[350,220];
 }else if(id==='pancreas'||id==='kidneys'){
  s+=cavity()+renal()+colon()+bowel();if(id==='pancreas')s+=f('lesser',p('M308 245 Q398 250 449 264 L450 271 L308 271 Z',C.cavity,C.peritoneum,3))+organ(358,292,121,23,'Поджелудочная')+organ(242,304,26,24,'D2');
  if(id==='pancreas')pins.aps=[340,336];
  s+=line('fusion','M140 330 Q180 345 220 333 M450 333 Q500 345 544 328','#9c6db5');
  s+=line('interfascial','M99 351 Q92 415 133 444 M581 351 Q588 415 547 444','#c06c70');
 }else if(['mesocolon','infrarenal','sigmoid'].includes(id)){
  s+=cavity()+f('central',p('M100 280 Q260 252 340 278 Q450 252 580 280 L575 420 Q340 460 105 420 Z',C.retro,'none'))+colon()+bowel();
  s+=line('fusion','M130 326 Q150 340 181 327 M499 327 Q530 340 550 326','#9c6db5');
  s+=line('interfascial','M112 354 Q99 405 130 433 M568 354 Q581 405 550 433','#c06c70');
  s+=f('mesentery',p('M281 279 L409 209 L456 268 Z',C.sub,'#bd944b',3))+t(378,265,'Брыжейка',15);
  s+=e(322,380,14,14,'#6b91c5')+e(359,380,12,12,'#d7767c')+organ(253,410,30,36,'m.')+organ(427,410,30,36,'m.');
  if(id==='mesocolon')s+=f('mesentery',p('M170 175 Q335 310 516 175','none','#bd944b',14))+t(340,327,'Поперечная брыжейка*',16);
  if(id==='sigmoid')s+=f('mesentery',p('M475 360 L440 246 L520 247 Z',C.sub,'#bd944b',3))+organ(479,244,31,24,'Сигма');
 }else{
  s+=f('pararectal',e(340,314,227,145,C.pelvic));s+=line('presacral-fascia','M130 447 Q340 500 550 447','#8654ad');
  if(id==='upper-rectum'){
   s+=cavity('M104 160 Q340 64 576 160 L560 226 Q522 332 436 263 Q340 202 244 263 Q158 332 120 226 Z');
   s+=f('mesorectum',e(340,357,135,91,C.pelvic,'none'));
   s+=line('mrf','M245 280 C171 320 196 445 340 448 C484 445 509 320 435 280');
   s+=organ(340,279,76,58,'Прямая кишка');
   s+=line('peritoneum','M121 224 Q153 334 264 279 A76 58 0 0 1 416 279 Q527 334 559 224');
   pins={mesorectum:[345,399],mrf:[222,385],peritoneum:[339,219],retrorectal:[344,462],'presacral-fascia':[495,465],pararectal:[155,356]};
  }else{
   s+=f('mesorectum',e(340,365,112,85,C.pelvic,C.fascia,4))+organ(340,361,49,36,'Прямая');
   s+=f('perivesical',e(340,174,139,63,'#f6eac8','#728aa5',3))+organ(340,174,98,42,'Пузырь');
   s+=line('umbilical-fascia','M203 172 C203 88 477 88 477 172','#728aa5');
   s+=sex==='female'?organ(340,264,61,24,'Влагалище'):organ(340,258,69,26,'Простата / СП');
   s+=line('dvf','M247 298 Q340 282 433 298','#e26079');
   pins={retzius:[340,93],perivesical:[454,171],paravesical:[166,218],mesorectum:[340,416],mrf:[235,364],dvf:[340,296],retrorectal:[344,462],pararectal:[171,367],parametrium:[465,262]};
  }
 }
 return {s,pins};}
function sagittal(id,sex){let s=e(340,287,283,239,'#f1f4f8','#91a0b4',3)+t(35,283,'A',20)+t(648,283,'P',20)+t(340,34,'ГОЛОВА · H',16)+t(340,550,'НОГИ · F',16);
 s+=f('retrorectal',p('M454 147 Q550 199 557 442 L462 476 Q490 335 454 147 Z',C.pelvic,'none'));
 s+=p('M541 145 Q615 269 550 463 L581 474 Q650 284 568 133 Z','#dcd7cf')+t(577,307,'S',16);
 s+=p('M123 393 L145 382 L159 431 L135 443 Z','#dcd7cf')+t(110,438,'Лобок',14);
 s+=f('mesorectum',p('M423 172 Q497 218 470 365 L452 470 L388 467 L394 301 Z',C.pelvic,'none'));
 s+=line('mrf','M431 175 Q497 218 470 365 L452 470 L388 467 L394 321');
 s+=p('M418 171 Q461 190 438 291 L422 483 L401 483 L399 290 Q417 222 398 194 Z',C.organ,'#a36e7c',3)+t(440,209,'Прямая',15);
 s+=organ(222,301,76,58,'Пузырь');
 if(sex==='female')s+=organ(322,250,44,57,'Матка')+p('M327 296 L350 401 L368 396 L347 291 Z',C.organ)+t(312,379,'Влаг.',14);
 else s+=organ(267,383,40,25,'Простата')+organ(320,320,22,18,'СП');
 const border=sex==='female'?'M102 231 Q150 211 213 237 Q270 260 279 227 Q316 165 355 229 L373 299 Q391 292 399 241 L402 195 Q423 147 476 139':'M102 231 Q161 205 222 238 Q288 249 320 296 Q369 323 399 241 L402 195 Q423 147 476 139';
 s+=f('peritoneal',p(border+' L476 97 Q306 44 155 123 Z',C.cavity,'none'))+line('peritoneum',border,C.peritoneum);
 s+=line('presacral-fascia','M536 172 Q590 300 539 449','#8654ad');
 s+=line('dvf',sex==='female'?'M376 307 L386 431':'M354 324 L384 436','#e26079');
 s+=line('levator','M170 446 Q260 462 401 488 M433 488 Q497 492 548 458','#8f9eb8');
 if(id==='low-rectum')s+=line('rsf','M558 357 Q514 376 467 401','#a65c31')+t(567,354,'S3–S4*',14);
 const pins={peritoneum:[202,234],rectovesical:[349,274],douglas:[377,275],vesicouterine:[267,224],mrf:[474,325],dvf:[375,373],mesorectum:[452,286],retrorectal:[516,292],'presacral-fascia':[561,264],rsf:[508,385],levator:[300,472]};return {s,pins};}
function coronal(){return {s:e(340,287,278,226,'#f1f4f8','#91a0b4',3)+t(340,32,'ГОЛОВА · H',16)+t(340,548,'НОГИ · F',16)+t(27,286,'R',20)+t(653,286,'L',20)+f('mesorectum',p('M255 115 Q340 90 425 115 L377 334 L303 334 Z',C.pelvic,C.fascia,4))+p('M321 110 L359 110 L362 454 L318 454 Z',C.organ,'#a36e7c',3)+t(340,166,'Прямая',14)+t(340,433,'Канал',14)+f('ischioanal',p('M160 239 L303 383 L303 455 L171 444 Z',C.perineal)+p('M520 239 L377 383 L377 455 L509 444 Z',C.perineal))+f('levator',p('M153 214 Q242 259 308 378 L298 403 Q229 303 140 245 Z',C.muscle)+p('M527 214 Q438 259 372 378 L382 403 Q451 303 540 245 Z',C.muscle))+t(175,386,'СИАЯ',16)+t(500,386,'СИАЯ',16)+t(340,502,'Задняя корональная плоскость',15),pins:{levator:[239,313],ischioanal:[197,419],mesorectum:[290,215],mrf:[396,224]}};}
export function scheme(level,sex,selected){const ids=level.spaces.filter(id=>!(sex==='male'&&['douglas','vesicouterine','parametrium'].includes(id))&&!(sex==='female'&&id==='rectovesical')&&!(level.id==='floor'&&id==='perivesical'));
 const result=level.orient==='AX'?axial(level.id,sex):level.orient==='SAG'?sagittal(level.id,sex):coronal();
 let content=result.s;for(const [i,id]of ids.entries()){const pin=result.pins[id];if(!pin)continue;content+=`<g data-space="${id}" class="pin${selected===id?' selected':''}" tabindex="0" role="button" aria-label="Метка ${i+1}"><circle cx="${pin[0]}" cy="${pin[1]}" r="19"/><text x="${pin[0]}" y="${pin[1]+6}" text-anchor="middle">${i+1}</text></g>`;}
 return {svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 570" role="img" aria-label="${level.title}. ${level.orient}. Условная анатомическая схема"><title>${level.title}</title><style>.pin circle{fill:#20334d;stroke:#fff;stroke-width:3}.pin text{fill:#fff;font-size:18px;font-weight:750}.pin.selected circle{fill:#de6f21;stroke:#20334d}</style>${content}</svg>`,ids};}
