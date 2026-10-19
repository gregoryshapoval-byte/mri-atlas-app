export const categories={internalSphincter:{name:'Внутренний сфинктер',color:'#49E0CF'},externalSphincter:{name:'Наружный сфинктер',color:'#F28BCB'},perianalSpaces:{name:'Перианальные пространства',color:'#F2CF69'},arteries:{name:'Артерии',color:'#FF6B6B'},veins:{name:'Вены и синусы',color:'#72A9FF'},ligaments:{name:'Связки и сухожилия',color:'#FFC36B'},nerves:{name:'Нервы',color:'#FFE56B'},muscles:{name:'Мышцы',color:'#CF9BFF'},bones:{name:'Кости',color:'#E4E8EC'},cartilage:{name:'Хрящи и суставные диски',color:'#62DDD2'},organs:{name:'Органы и мягкие ткани',color:'#88DBA4'},whiteMatter:{name:'Белое вещество',color:'#E8D7AF'},csf:{name:'Ликворные пространства',color:'#79D6EB'},sulci:{name:'Борозды',color:'#DBBB9E'}};
function category(s){
 s=s.toLowerCase();
 if(/артери|артерия|артерии|артерий|arter|carotid|\bica\b|вса|аорт/.test(s))return 'arteries';
 if(/веноз|вена|вены|вену|вен |синус|sinus|vein|яремн/.test(s))return 'veins';
 if(/хрящ|суставн.*диск|диск тфхк|мениск|суставн.*губ|cartil|articular disc/.test(s))return 'cartilage';
 if(/связк|сухож|ligament|tendon|subsheath|прикрепление|\b(sl|lt|tfcc|dcss|rsc|lrl|srl|rsl|stt|drc|dic|rcl)\b/.test(s))return 'ligaments';
 if(/нерв|nerv|хиазм|зрительн.*тракт|optic.*tract|chiasm/.test(s))return 'nerves';
 if(/мышц|muscl/.test(s))return 'muscles';
 if(/кость|кости|костн|позвон|фаланг|надколенник|bone/.test(s))return 'bones';
 if(/желудоч|цистерн|ликвор|subarachnoid|подпаутин/.test(s))return 'csf';
 if(/белое вещество|лучистый венец|white matter/.test(s))return 'whiteMatter';
 if(/борозд|sulc/.test(s))return 'sulci';
 return null;
}
export function classifyPoint(point,filters){
 if(categories[point.category])return point.category;
 const name=point.name.toLowerCase();
 if(/сумк|bursa/.test(name))return 'organs';
 const seen=new Set();let f=filters.find(f=>f.id===point.filter);
 while(f&&!seen.has(f.id)){
  seen.add(f.id);const n=f.name.toLowerCase();
  if(/^(кости|кости;|скелет|тазовый пояс)/.test(n))return 'bones';
  if(/^(артери|вены|веноз|нервы|связки|сухожили|белое вещество|борозды)/.test(n))return category(n)||'organs';
  if(/^мышц/.test(n))return /сухож/.test(name)?'ligaments':'muscles';
  f=filters.find(x=>x.id===f.parent);
 }
 if([1640,1638].includes(point.structure))return 'ligaments';
 return category(point.name)||'organs';
}
export function paintPoint(point,filters){const category=classifyPoint(point,filters);return {...point,fullName:point.name,name:point.shortName||point.name,category,color:point.preserveColor&&/^#[0-9A-F]{6}$/i.test(point.color)?point.color:categories[category].color}}
