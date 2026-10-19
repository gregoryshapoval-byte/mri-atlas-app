// Original schematic UI illustrations. Symbols identify groups, not diagnostic anatomy.
// SVGs are embedded locally, scale without blur and never request the network.
const C={bone:'#d7e3ec',joint:'#60dace',ligament:'#f2b75c',muscle:'#bb96ed',nerve:'#f1df73',artery:'#f77d85',vein:'#75b6f6',organ:'#85d6ad',brain:'#a7b9cf'};
const path=(d,c=C.bone,fill='none',w=2.4)=>`<path d="${d}" fill="${fill}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const circle=(x,y,r,c,fill='none',w=2.4)=>`<circle cx="${x}" cy="${y}" r="${r}" stroke="${c}" fill="${fill}" stroke-width="${w}"/>`;
const ellipse=(x,y,rx,ry,c,fill='none')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" stroke="${c}" fill="${fill}" stroke-width="2.4"/>`;
const B='M16 54C10 48 13 34 22 29C25 19 38 15 47 20C56 14 69 20 72 27C83 30 86 42 80 50C85 60 73 66 61 65L52 71L38 67C27 69 18 65 16 54Z';
const folds=()=>path('M25 34Q30 24 40 28M20 45Q27 36 35 40M25 57Q33 49 39 56M43 26Q51 30 48 39M57 26Q63 31 59 38M69 34Q76 42 67 46M39 42Q44 36 49 45M53 56Q60 48 67 55M39 63Q44 56 42 51',C.brain,'none',1.8);
function brain(key){
 let base=path(B,C.brain,'#2b3d51')+folds();let accent=C.joint;
 const lobes={frontal:'M16 54C10 48 13 34 22 29C25 19 38 15 47 20L43 39L36 55Z',parietal:'M47 20C56 14 69 20 72 27L68 43L44 46L43 39Z',temporal:'M25 57L39 45L66 47L70 61L61 65L52 71L38 67C27 69 24 63 25 57Z',occipital:'M72 27C83 30 86 42 80 50C85 60 73 66 61 65L66 47Z',insula:'M39 41Q53 33 61 44L56 53L43 55Z'};
 if(lobes[key])return base+path(lobes[key],accent,'#3b9f94',2)+folds();
 if(key==='cerebrum')return base+path('M21 69Q48 81 76 66',accent,'none',3);
 if(key==='lobes'||key==='brodmann'||key==='territories')return base+path('M47 20L43 39L36 55M43 39L68 43L72 27M36 55L66 47L70 61',accent)+ (key==='brodmann'?circle(29,34,5,C.muscle,'#7c5b9a')+circle(56,30,5,C.ligament,'#896338')+circle(55,58,4,C.artery,'#914c57'):key==='territories'?path('M18 48Q29 30 44 27M48 25Q60 35 65 47M32 59Q49 51 71 55',C.artery,'none',4):'');
 if(key==='sulci')return base+path('M47 23Q39 30 46 38Q51 44 43 52M65 29Q58 36 63 42M29 47Q39 40 39 52',C.ligament,'none',3.5);
 if(key==='gyri')return base+path('M22 42Q29 30 36 34M52 24Q61 22 66 29M33 60Q40 55 47 61',C.organ,'none',7);
 if(key==='meninges')return path('M11 58C2 23 33 6 59 14C86 18 94 46 83 66',C.ligament)+path('M17 57C9 30 34 13 58 20C80 23 87 45 78 62',C.vein)+base;
 if(key==='association'||key==='commissures'||key==='white-matter')return base+path(key==='commissures'?'M27 49Q46 22 69 47M27 53Q46 30 69 51':'M24 48Q45 24 73 46M27 55Q48 38 68 55M35 60Q49 49 61 59',C.ligament,'none',3);
 // Midline/coronal schematic for deep structures.
 base=path('M17 58Q9 34 25 24Q36 14 49 20Q69 13 80 32Q88 49 72 63L59 64L58 79L48 77L43 63Q25 69 17 58Z',C.brain,'#293c50');
 if(key==='limbic')return base+path('M27 48Q26 29 48 29Q68 29 69 46L59 52Q43 47 37 54',C.organ,'none',7);
 if(key==='diencephalon')return base+ellipse(48,43,13,9,C.muscle,'#765a9b')+path('M43 53L53 53L49 60Z',C.organ,'#43816f');
 if(key==='basal-forebrain')return base+path('M31 52Q49 61 66 52L61 61L35 61Z',C.organ,'#43816f');
 if(key==='basal')return base+ellipse(39,44,7,11,C.muscle,'#765a9b')+ellipse(58,44,7,11,C.muscle,'#765a9b')+path('M47 34L49 56',C.joint);
 if(key==='ventricles')return base+path('M29 37Q35 31 42 37L45 49L39 55L36 46L30 49M68 37Q62 31 55 37L52 49L58 55L61 46L67 49M48 44L49 60L54 65L50 69',C.vein,'none',5);
 if(key==='optic')return base+circle(28,56,6,C.nerve)+circle(69,56,6,C.nerve)+path('M33 54L48 44L64 54M48 44L36 34M48 44L60 34',C.nerve,'none',3);
 if(key==='glands')return base+circle(48,57,5,C.organ,'#4a8c70')+circle(60,41,3,C.organ,'#4a8c70')+path('M48 52L48 44',C.organ);
 if(key==='cranial-nerves'||key==='nuclei')return base+path('M48 39L49 67M48 43L28 36M48 50L27 48M49 57L30 65M50 43L70 36M50 50L71 48M50 57L69 65',C.nerve)+(key==='nuclei'?circle(48,44,4,C.nerve,'#9a893b')+circle(49,56,4,C.nerve,'#9a893b'):'');
 if(['brainstem','midbrain','pons','medulla'].includes(key))return base+path('M45 42L56 43L56 52Q66 58 57 64L55 78L48 77L47 64Q40 60 45 54Z',C.nerve,'#928348')+ (key==='brainstem'?'':ellipse(51,key==='midbrain'?47:key==='pons'?59:71,8,5,C.ligament,'#c08944'));
 if(['cerebellum','hemisphere','vermis','fissures','deep-cerebellum'].includes(key)){
  base=path('M15 55Q14 32 35 33L47 39L58 33Q80 28 83 52Q85 69 66 70L48 64L31 71Q15 71 15 55Z',C.brain,'#34475c');
  const lines=path('M20 47L38 45M19 54L39 51M23 61L40 58M59 44L77 45M58 51L79 52M57 58L75 61',key==='fissures'?C.ligament:C.brain,'none',2);
  return base+lines+(key==='vermis'?path('M44 39Q51 33 54 42L53 64L44 64Z',C.organ,'#47927e'):key==='hemisphere'?path('M18 55Q18 36 35 36L42 41L41 63L31 68Q18 68 18 55Z',C.joint,'#347d7c'):key==='deep-cerebellum'?path('M28 51L34 46L39 53L34 58M61 52L67 46L72 54L66 59',C.nerve,'none',3):'');
 }
 return base;
}
const bones=()=>path('M29 13Q18 10 18 22Q18 29 30 30L33 56Q23 61 27 70Q33 79 41 70Q49 73 52 65Q54 58 44 55L42 30Q53 26 48 17Q43 9 37 17Z',C.bone,'#344956')+path('M58 29Q49 26 47 36L53 66Q50 75 58 80Q69 83 70 73L65 39Q73 34 67 29Z',C.bone,'#344956');
const joint=()=>path('M25 13L29 36Q47 48 65 36L69 13M27 81L30 57Q47 47 65 57L68 81',C.bone,'#344956')+path('M30 42Q48 51 64 42M30 52Q48 43 64 52',C.joint);
function body(key){
 const a=C.ligament,b=C.bone,o=C.organ;
 switch(key){
 case 'bone':case 'femur':case 'humerus':return path('M39 17Q28 9 25 23Q24 33 37 32L43 62Q32 66 36 76Q41 85 49 77Q59 81 64 72Q67 62 54 60L48 31Q60 25 55 17Q47 9 39 17Z',b,'#415665')+path('M40 32L47 60',b,'none',1.4);
 case 'radius':case 'ulna':case 'forearm':return bones();
 case 'hand':return path('M31 58L23 36Q21 29 26 29L39 49L35 19Q35 11 40 16L47 44L47 12Q49 7 52 14L54 43L59 17Q62 12 64 18L62 47L70 29Q75 27 74 34L69 63Q67 78 48 80L36 77Z',b,'#344956')+path('M36 59L49 62L62 57M43 72L58 70',C.joint);
 case 'joint':return joint();
 case 'ligament':case 'collateral':case 'interosseous':return joint()+path(key==='interosseous'?'M36 40L60 55M60 40L36 55':'M28 33L26 59M67 33L69 59',a,'none',6);
 case 'palmar':case 'dorsal':return bones()+path(key==='palmar'?'M25 42L60 58M29 53L60 43':'M26 48L62 36M27 54L65 66',a,'none',5);
 case 'tfcc':case 'disc':return bones()+path('M36 40Q49 33 65 43L62 50Q49 45 39 49Z',C.joint,'#318c86')+ (key==='tfcc'?path('M59 46L72 38M60 47L71 57',a,'none',3):'');
 case 'labrum':return path('M47 18C18 15 13 55 37 68',b,'none',8)+path('M45 24C25 22 23 52 39 59',C.joint,'none',5)+circle(54,48,20,b,'#354d5c')+path('M61 65L71 81',b,'none',10);
 case 'tendon':case 'insertion':case 'sheath':return path('M32 14Q19 32 32 47L42 63L48 61L40 43Q45 26 38 14Z',C.muscle,'#755597')+path('M42 48L50 69M36 48L45 70',a,'none',3)+path('M28 77Q44 64 66 73L73 82L23 82Z',b,'#344956')+(key==='insertion'?circle(48,70,7,a):key==='sheath'?path('M35 49L42 73M47 46L57 71',C.joint):'');
 case 'muscle':return path('M29 14L34 27Q18 39 34 60L51 74L58 69L49 48Q49 28 40 25L35 12Z',C.muscle,'#735690')+path('M34 31Q29 42 43 59M39 29Q37 42 48 56',C.muscle,'none',1.8)+path('M51 73L58 83M30 15L25 9',a,'none',4);
 case 'fascia':case 'compartments':return path('M17 31L59 20L80 42L37 55Z',C.muscle,'#3d3455')+path('M17 42L59 31L80 53L37 66Z',C.organ,'#275c57')+path('M17 53L59 42L80 64L37 77Z',C.joint,'#284d5c')+path('M25 28L42 48M40 24L58 44M55 21L72 40',C.bone,'none',1);
 case 'bursa':case 'recess':return joint()+path(key==='bursa'?'M16 36Q8 47 19 60L23 58Q15 47 23 38Z':'M32 43L21 44Q13 50 22 58L31 56',C.vein,'#2d6897',3)+path('M18 24L14 34',a,'none',4);
 case 'capsule':return joint()+path('M25 34C6 39 8 62 28 64M67 34C86 39 85 62 68 64',a,'none',4);
 case 'artery':case 'vein':return path('M44 78L44 48L26 24M44 48L65 21M44 61L71 49',key==='artery'?C.artery:C.vein,'none',12)+path('M44 76L44 48L27 25M45 48L65 23M47 59L70 49',key==='artery'?'#ffb2ad':'#afdcff','none',3)+ellipse(44,79,6,3,key==='artery'?C.artery:C.vein,'#14242e');
 case 'sinus':case 'deep-veins':case 'surface-veins':case 'emissary-veins':case 'diploic-veins':return path(B,C.brain,'#253747')+path(key==='sinus'?'M18 48Q18 20 49 20Q80 20 80 47L63 61L47 54L49 28':key==='deep-veins'?'M31 41L45 48L58 39M45 48L66 57L77 48':key==='emissary-veins'?'M21 34L12 26M64 22L70 12M73 55L85 62':'M23 40L35 31L45 39L57 28M30 58L40 45L63 49L72 35',C.vein,'none',4);
 case 'nerve':case 'plexus':return path('M48 12L48 55L26 77M48 55L70 78M48 38L25 27M48 38L70 24M48 65L48 83',C.nerve,'none',4)+path('M43 12L43 53M53 12L53 53',C.nerve,'none',1.3)+(key==='plexus'?path('M26 25L69 60M71 25L27 61',C.nerve):'');
 case 'node':return ellipse(47,47,22,16,o,'#32624f')+path('M47 32Q33 45 47 62M47 33Q60 47 47 62M25 47L11 37M69 47L84 34M48 64L48 83',o)+circle(47,47,5,C.joint,'#2d7b70');
 case 'spine':case 'vertebra':case 'sacrum':return key==='sacrum'?path('M22 21Q47 13 73 21L63 62L48 80L32 62Z',b,'#344956')+path('M30 34L66 34M34 47L62 47M39 60L57 60',b)+circle(34,39,2,C.joint)+circle(61,39,2,C.joint):[22,44,66].map(y=>path(`M31 ${y-7}Q48 ${y-11}64 ${y-7}L63 ${y+7}Q48 ${y+12}32 ${y+7}Z`,b,'#344956')+path(`M31 ${y}L19 ${y+5}M64 ${y}L77 ${y+5}`,b)+path(`M34 ${y+12}L61 ${y+12}`,C.joint)).join('');
 case 'cord':return path('M35 13Q47 7 60 13L57 79Q47 86 37 79Z',C.nerve,'#746b38')+path('M46 15L47 79M35 28L18 36M58 28L77 36M36 48L17 56M58 48L78 56M37 69L22 77M57 69L74 77',C.nerve);
 case 'pelvis':case 'dimensions':return path('M45 36Q24 4 14 27Q9 45 28 54L25 70L41 77L47 65L53 77L70 70L67 54Q87 43 80 25Q70 4 50 36Z',b,'#344956')+path('M44 35L51 35L56 54L47 63L39 54Z',b)+(key==='dimensions'?path('M20 46L74 46M20 41L20 51M74 41L74 51',C.joint):'');
 case 'female':return path('M42 48Q24 45 20 29Q18 23 13 29M53 48Q71 45 75 29Q78 23 83 29M34 42Q47 31 61 42L55 61L51 66L51 79L44 79L44 66L39 60Z',o,'#3c705e')+ellipse(20,38,7,5,C.muscle,'#735690')+ellipse(75,38,7,5,C.muscle,'#735690');
 case 'urinary':return path('M28 20Q12 16 17 36Q20 47 31 42Q36 36 29 31Q23 29 28 20ZM68 20Q84 16 79 36Q76 47 65 42Q60 36 67 31Q73 29 68 20Z',o,'#356852')+path('M29 41L39 62M67 41L57 62M47 77L47 86',C.joint)+path('M34 59Q47 52 61 59L61 68Q49 84 34 69Z',o,'#356852');
 case 'urethra':return body('prostate')+path('M48 50L48 82',C.joint,'none',5);
 case 'prostate':case 'prostate-zones':return path('M30 17Q47 24 65 17L62 34Q48 43 33 34Z',o,'#356852')+path('M28 49Q48 34 69 49Q73 68 49 78Q25 68 28 49Z',o,'#356852')+ellipse(48,56,10,13,C.muscle,'#765d9b')+path('M48 38L48 83',C.joint)+(key==='prostate-zones'?path('M31 63Q47 73 66 63',C.joint,'none',4):'');
 case 'male':return path('M23 23Q16 13 11 24Q9 44 31 49L42 58L44 79Q48 86 53 79L54 58L65 49Q87 44 85 24Q80 13 73 23',o)+ellipse(32,48,9,12,o,'#356852')+ellipse(64,48,9,12,o,'#356852')+path('M33 47Q47 40 63 47',C.joint);
 case 'digestive':return path('M35 15L35 29Q39 36 48 26Q66 16 74 32Q86 54 57 61L47 58Q31 58 31 44M24 61Q15 69 26 77L64 77Q76 72 66 65L35 65Q27 69 37 71L59 71',o,'#315b50')+path('M35 13L42 13L42 28',o);
 case 'pelvic-floor':return body('pelvis')+path('M27 53Q47 80 68 53L63 70Q48 85 32 70Z',C.muscle,'#725793');
 case 'skull':case 'foramen':return path('M27 61Q13 46 21 28Q32 8 56 16Q79 20 79 42L69 55L68 74L51 80L38 73L37 61Z',b,'#344956')+path('M32 39L43 37L43 46L32 47ZM58 38L68 40L67 48L57 46ZM48 49L45 58L53 58M41 65L62 66',b)+(key==='foramen'?circle(60,56,7,C.nerve):'');
 case 'jaw':return path('M20 25L28 62Q48 83 70 61L78 25L69 24L63 54Q47 65 35 54L29 24Z',b,'#344956')+path('M36 54L63 54M41 54L41 60M48 54L48 63M56 54L56 61',b);
 case 'maxilla':return body('skull')+path('M28 49L40 51L46 61L52 61L59 51L70 49L65 67L35 67Z',C.joint,'#2d7777');
 case 'sinuses':return body('skull')+ellipse(33,31,8,6,C.vein,'#2e6690')+ellipse(62,31,8,6,C.vein,'#2e6690')+path('M28 49L39 50L38 61L28 57ZM58 50L69 49L69 57L58 61Z',C.vein,'#2e6690');
 case 'oral':return path('M17 43Q47 23 79 43Q49 69 17 43Z',o,'#315b50')+path('M28 44Q48 35 68 44M32 49Q47 65 64 48',C.muscle,'none',4);
 case 'pharynx':case 'larynx':case 'thyroid':return path('M38 13L38 36L34 48L39 80M58 13L58 36L62 48L57 80',b)+path('M38 22L58 22M38 30L58 30M36 43L60 43M37 57L59 57M38 65L58 65',C.joint)+(key==='thyroid'?path('M36 43Q19 27 23 56Q30 72 42 55L54 55Q66 72 73 56Q77 27 60 43Z',o,'#3e7963'):key==='larynx'?path('M30 32L48 39L66 32L60 54L48 62L36 54Z',C.joint,'#2c6969'):path('M29 20Q23 40 31 57L35 77',o,'none',6));
 case 'region':return path('M22 22L64 14L80 36L70 76L30 82L14 60Z',C.joint,'#243f4e')+path('M22 22L70 76M64 14L30 82M14 60L80 36',C.brain,'none',1.4)+circle(48,48,12,C.joint);
 default:throw Error('Missing anatomy icon '+key);
 }
}
const brainIds={976:'lobes',977:'cerebrum',978:'sulci',979:'frontal',980:'parietal',981:'temporal',982:'insula',983:'occipital',984:'limbic',985:'commissures',986:'basal',987:'basal-forebrain',988:'diencephalon',989:'cerebellum',990:'fissures',991:'hemisphere',992:'vermis',993:'deep-cerebellum',994:'brainstem',995:'midbrain',996:'pons',997:'medulla',998:'cranial-nerves',999:'cranial-nerves',1000:'nuclei',1001:'ventricles',1002:'meninges',1003:'artery',1004:'territories',1005:'vein',1006:'sinus',1007:'deep-veins',1008:'surface-veins',1009:'diploic-veins',1010:'emissary-veins',1011:'brodmann',1012:'association',1361:'lobes',1362:'sulci',1363:'gyri',1364:'limbic',1365:'white-matter',1366:'ventricles',1367:'basal',1368:'optic',1369:'cerebellum',1370:'brainstem',1371:'cord',1372:'artery',1373:'sinus',1374:'glands'};
export function anatomyIconKey(f,module){
 if(['brain3dmri','cerveau','vascular-arteries3d','vascular-veins3d'].includes(module))return brainIds[f.id]||'region';
 const n=f.name.toLocaleLowerCase('ru');
 if(/подвздош|тазовая кост|тазовый пояс/.test(n))return 'pelvis';
 if(/губа/.test(n))return 'labrum';if(/аксиля|аксилля|капсула/.test(n))return 'capsule';if(/заворот/.test(n))return 'recess';if(/сумк/.test(n))return 'bursa';
 if(/тфхк/.test(n))return 'tfcc';if(/диск и прикреп/.test(n))return 'disc';if(/лучелоктев/.test(n))return 'collateral';if(/sl \/ lt|межзапяст/.test(n))return 'interosseous';if(/ладонн/.test(n))return 'palmar';if(/тыльн/.test(n))return 'dorsal';if(/ecu|влагалищ|футляр/.test(n))return 'sheath';if(/сухожил.*прикрепл/.test(n))return 'insertion';if(/сухожил/.test(n)&&!/мышц/.test(n))return 'tendon';
 if(/артери/.test(n))return 'artery';if(/вен/.test(n))return 'vein';if(/лимфат/.test(n))return 'node';if(/сплетен/.test(n))return 'plexus';if(/нервн|нерв|задние ветви/.test(n))return 'nerve';if(/спинной мозг/.test(n))return 'cord';if(/оболочк/.test(n))return 'meninges';
 if(/зональн/.test(n))return 'prostate-zones';if(/простат|семенн/.test(n))return 'prostate';if(/мочеиспуск/.test(n))return 'urethra';if(/мочев/.test(n))return 'urinary';if(/мужск|яичко|половой член/.test(n))return 'male';if(/половые органы/.test(n))return 'female';if(/пищевар/.test(n))return 'digestive';if(/диафрагма таза/.test(n))return 'pelvic-floor';if(/размеры таза/.test(n))return 'dimensions';
 if(/щитовид/.test(n))return 'thyroid';if(/пазух|полость носа/.test(n))return 'sinuses';if(/полость рта/.test(n))return 'oral';if(/гортан/.test(n)&&!/мышц/.test(n))return 'larynx';if(/глотк/.test(n)&&!/мышц/.test(n))return 'pharynx';if(/нижняя челюст/.test(n))return 'jaw';if(/верхняя челюст/.test(n))return 'maxilla';if(/отверстие$/.test(n))return 'foramen';
 if(/фасциальные ложа/.test(n))return 'compartments';if(/фасци|апоневр/.test(n))return 'fascia';if(/мышц/.test(n))return 'muscle';
 if(/связк|медиальный комплекс|латеральный комплекс|ориентиры исходника/.test(n))return 'ligament';if(/соединени|сустав/.test(n))return 'joint';if(/крестец/.test(n))return 'sacrum';if(/позвонок|нумерац/.test(n))return 'vertebra';if(/позвоноч/.test(n))return 'spine';if(/лучевая кость/.test(n))return 'radius';if(/локтевая кость/.test(n))return 'ulna';if(/пястн|запястья/.test(n))return 'hand';if(/бедренная/.test(n))return 'femur';if(/плечевая/.test(n))return 'humerus';if(/кость|кости|скелет/.test(n))return module==='face-cou-irm'?'skull':'bone';
 return /таз/.test(n)?'pelvis':'region';
}
const cache=new Map();
export function anatomyGroupIcon(f,module){
 const key=anatomyIconKey(f,module);if(cache.has(key))return cache.get(key);
 const isBrain=Object.values(brainIds).includes(key)&&!['artery','vein','sinus','deep-veins','surface-veins','emissary-veins','diploic-veins','cord'].includes(key);
 const image=`<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#243b4a"/><stop offset="1" stop-color="#14252f"/></linearGradient></defs><rect x="1" y="1" width="94" height="94" rx="22" fill="url(#bg)" stroke="#3b5564"/>${isBrain?brain(key):body(key)}</svg>`;
 const uri='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(image);cache.set(key,uri);return uri;
}
