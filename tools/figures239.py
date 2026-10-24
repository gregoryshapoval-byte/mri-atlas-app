"""Original conditional SVG teaching diagrams; not MRI signal or exact patient anatomy."""
from html import escape
F={}
def text(x,y,s,size=16,color='#d4e0eb'):
 return f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}">{escape(s)}</text>'
def path(d,color='#edbc78',w=5,fill='none',dash=False):
 return f'<path d="{d}" stroke="{color}" stroke-width="{w}" fill="{fill}"'+(' stroke-dasharray="6 5"'if dash else '')+'/>'
def wrap(key,title,b,foot='Условная схема · цвета тканей, не МР-сигнал'):
 F[key]=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 350" role="img" aria-label="{escape(title)}"><title>{escape(title)}</title><rect width="440" height="350" rx="14" fill="#10202d"/>{text(18,28,title,19)}{b}{text(18,335,foot,12)}</svg>'
def wrist(k):
 b='<rect x="55" y="180" width="137" height="118" rx="23" fill="#71869a"/><rect x="287" y="180" width="79" height="118" rx="25" fill="#71869a"/>'
 b+='<ellipse cx="202" cy="82" rx="45" ry="32" fill="#71869a"/><ellipse cx="310" cy="82" rx="37" ry="27" fill="#71869a"/>'
 b+=text(81,267,'Radius')+text(298,267,'Ulna')+text(176,86,'L')+text(305,86,'T')
 b+='<path d="M167 153 Q224 132 289 154 L286 174 Q219 156 170 173Z" fill="#b59bd9"/>'
 b+=path('M279 160 L319 183 M278 153 L345 151 M279 147 L304 111',w=7)
 b+=path('M244 82 H273','#edbc78',6)+text(189,218,'TFCC',16,'#d4bdee')
 if k in ['1A','2C','2D','2E']:b+=path('M222 140 L221 170','#fb9678',9)
 if k=='1B':b+=path('M293 151 L301 183','#fb9678',9)
 if k=='1C':b+=path('M289 116 L304 129','#fb9678',9)
 if k=='1D':b+=path('M173 151 L174 173','#fb9678',9)
 if k.startswith('2'):b+=path('M187 150 Q220 144 269 154','#f1d5e2',3)
 if k in ['2B','2C','2D','2E']:b+=path('M173 111 L218 112 M302 178 L343 178','#65d8c4',6)+path('M191 111 L201 115 M317 178 L324 174','#fb9678',5)
 if k in ['2D','2E']:b+=path('M258 70 L258 94','#fb9678',7)+text(244,53,'LT',13)
 if k=='2E':b+=path('M291 113 L279 131 L297 125 M296 179 L280 188','#e1d2bb',4)
 names={'normal':'TFCC: ориентиры','1A':'Palmer 1A · центр','1B':'Palmer 1B · локтевое прикрепление','1C':'Palmer 1C · дистальные связки','1D':'Palmer 1D · лучевой край','2A':'Palmer 2A · износ','2B':'Palmer 2B · + хрящ','2C':'Palmer 2C · + перфорация','2D':'Palmer 2D · + LT','2E':'Palmer 2E · + артроз'}
 wrap('w-'+k,names[k],b,'Корональная идея · L полулунная · T трёхгранная')
for k in ['normal','1A','1B','1C','1D','2A','2B','2C','2D','2E']:wrist(k)
for k,gap in [('sl','SL'),('lt','LT')]:
 b=''
 for x,n in [(100,'S'),(218,'L'),(336,'T')]:b+=f'<ellipse cx="{x}" cy="170" rx="43" ry="49" fill="#71869a"/>'+text(x-7,177,n,22)
 b+=path('M143 165 H175 M261 165 H293',w=12)+path('M'+('154'if gap=='SL'else'273')+' 149 v34','#fb9678',10)
 b+=text(33,270,'Оценивать дорсальную, волярную',17)+text(33,294,'и мембранозную части отдельно',17)
 wrap('w-'+k,gap+' · межкостная связка',b,'Топологическая схема костей, не один МР-срез')
for k,selected in [('deq',1),('ecu',6),('tendon',4)]:
 b=''
 for j,n in enumerate(['APL/EPB','ECRL/B','EPL','EDC/EIP','EDM','ECU']):
  x=45+j*68;b+=f'<rect x="{x}" y="112" width="40" height="116" rx="19" fill="#203947" stroke="#708ca4"/>'+path(f'M{x+20} 120 V220','#fb9678'if j+1==selected else '#edbc78',12)+text(x+12,91,str(j+1),19)+text(x-8,252,n,12)
  if j+1==selected and k!='tendon':b+=f'<rect x="{x-5}" y="107" width="50" height="126" rx="23" fill="none" stroke="#70bde6" stroke-width="5"/>'
  if j+1==selected and k=='tendon':b+=path(f'M{x+9} 164 h22','#10202d',12)
 b+=text(28,292,'Лучевая сторона ← → локтевая сторона',15)
 wrap('w-'+k,{'deq':'De Quervain · I канал','ecu':'ECU · VI канал / влагалище','tendon':'Разрыв сухожилия'}[k],b,'Порядок каналов разгибателей, не один МР-срез')
def shoulder(k):
 b='<path d="M65 85 H167 V268 H65Z" fill="#71869a"/><circle cx="291" cy="184" r="78" fill="#71869a" stroke="#c0d0de" stroke-width="2"/>'
 b+=path('M171 116 L193 99 L196 134Z','#c4a4e3',2,'#b59bd9')+path('M171 238 L192 218 L197 252Z','#c4a4e3',2,'#b59bd9')
 b+=path('M194 108 Q271 57 345 128 M194 241 Q282 298 341 244','#edbc78',4)
 b+=text(72,185,'Гленоид',14)+text(250,184,'Головка',16)+text(27,62,'Перед ↑',14)+text(27,299,'Зад ↓',14)
 if k in ['bankart','perthes','alpsa']:b+=path('M175 103 L181 136','#fb9678',8)
 if k=='bankart':b+=path('M170 104 L181 83','#fb9678',6)
 if k=='perthes':b+=path('M165 88 Q154 92 158 130','#65d8c4',4)+text(229,60,'Периост цел',14)
 if k=='alpsa':b=b.replace(path('M171 116 L193 99 L196 134Z','#c4a4e3',2,'#b59bd9'),'').replace('M194 108 Q271 57 345 128','M140 63 Q271 57 345 128');b+=path('M143 70 L139 36 L119 48 Z','#c4a4e3',2,'#b59bd9')+text(224,61,'Медиализация',14)
 if k=='bony':b+='<path d="M165 86 L180 109 L164 134Z" fill="#fb9678"/>'
 if k=='glad':b+=path('M171 136 V165','#fb9678',7)+path('M184 112 L191 124','#fb9678',4)
 if k=='posterior':b+=path('M176 225 L181 254','#fb9678',8)
 if k=='hagl':b+=path('M322 261 L345 252','#fb9678',10)
 if k=='gagl':b+=path('M190 236 L205 247','#fb9678',10)
 if k=='hs':b+='<path d="M333 246 L315 248 L333 259Z" fill="#fb9678"/>'+text(218,307,'Заднелатеральный дефект',14)
 if k=='reverse':b+='<path d="M238 126 L256 123 L243 109Z" fill="#fb9678"/>'+text(215,307,'Переднемедиальный дефект',14)
 names={'bankart':'Bankart · передняя губа','perthes':'Perthes · периост сохранён','alpsa':'ALPSA · смещение на шейку','bony':'Костный Bankart','glad':'GLAD · губа + хрящ','posterior':'Задняя губа','hagl':'HAGL · плечевое прикрепление','gagl':'GAGL · гленоидное прикрепление','hs':'Hill–Sachs','reverse':'Обратный Hill–Sachs'}
 wrap('s-'+k,names[k],b,'Условно аксиально · ориентация по анатомии')
for k in ['bankart','perthes','alpsa','bony','glad','posterior','hagl','gagl','hs','reverse']:shoulder(k)
for k in ['slap','buford']:
 b='<ellipse cx="219" cy="186" rx="91" ry="112" fill="#526d82" stroke="#b59bd9" stroke-width="12"/>'+text(207,51,'12',18)+text(329,190,'3',18)+text(210,320,'6',18)+text(84,190,'9',18)
 if k=='slap':b+=path('M219 76 V43','#edbc78',10)+path('M178 83 Q218 72 264 86','#fb9678',10)+text(272,67,'Бицепс',14)
 else:b+=path('M253 89 Q307 107 311 163','#10202d',16)+path('M219 76 Q255 110 285 236','#edbc78',14)+text(26,277,'Нет передневерхней губы;',14)+text(26,298,'утолщена MGHL',14)
 wrap('s-'+k,'SLAP · верхняя губа и якорь'if k=='slap'else'Комплекс Буфорда · вариант',b,'Карта en face · 12 верх · 3 перед · обе стороны')
b='<circle cx="132" cy="165" r="85" fill="#526d82" stroke="#bfd0dc" stroke-width="2" stroke-dasharray="5 4"/><path d="M199 112 L199 219" stroke="#fb9678" stroke-width="8"/>'+path('M47 273 H217','#edbc78',3)+text(120,296,'D',19)+path('M199 82 H217','#fb9678',3)+text(190,68,'d',18)
b+='<rect x="285" y="85" width="117" height="170" rx="15" fill="#526d82"/><rect x="294" y="109" width="30" height="118" fill="#fb9678"/><rect x="365" y="109" width="25" height="118" fill="#b59bd9"/>'+path('M294 274 H365','#edbc78',3)+text(307,300,'HSI',19)+text(20,55,'Гленоид',16)+text(282,56,'Головка / сзади',14)
wrap('s-track','GT = 0,83 × D − d',b,'HSI: дефект + мостик до прикрепления манжеты')
def cart(k):
 b='<rect x="53" y="175" width="334" height="117" fill="#71869a"/><rect x="53" y="105" width="334" height="68" fill="#65d8c4"/>'
 if k=='signal':b+='<ellipse cx="208" cy="140" rx="47" ry="14" fill="#9fc3d7"/>'
 if k in ['superficial','deep','full','bone']:
  y={'superficial':128,'deep':157,'full':175,'bone':213}[k];b+=f'<path d="M183 103 V{y} H252 V103Z" fill="#10202d" stroke="#fb9678" stroke-width="3"/>'
 if k=='delam':b+='<rect x="135" y="104" width="165" height="70" fill="#10202d"/><path d="M135 105 Q218 76 300 105 V164 Q218 135 135 165Z" fill="#65d8c4"/>'+path('M135 165 Q218 135 300 164','#fb9678',5)
 if k=='fragment':b+='<path d="M178 104 H270 V197 H178Z" fill="none" stroke="#fb9678" stroke-width="4"/>'+text(175,241,'Фрагмент',16)
 b+=text(75,269,'Субхондральная кость')+text(69,87,'Хрящ',16,'#8ee4d4')
 wrap('c-'+k,{'normal':'Непрерывный хрящ','signal':'Сигнал без дефекта','superficial':'Поверхностный дефект <50%','deep':'Глубокий дефект >50%','full':'Полнослойный хондральный','bone':'Дефект с проникновением в кость','delam':'Деламинация / blister','fragment':'Остеохондральный фрагмент'}[k],b)
for k in ['normal','signal','superficial','deep','full','bone','delam','fragment']:cart(k)
def pf(k):
 dys=k=='dysplasia';b=path('M52 192 Q110 113 160 182 Q220 '+('180'if dys else'240')+' 280 182 Q335 106 392 191','#71869a',36)
 b+=path('M57 185 Q110 116 160 175 Q220 '+('173'if dys else'233')+' 280 175 Q335 109 389 184','#65d8c4',7)
 x=300 if k in ['lateral','dislocation']else 220;y=110;rot=22 if k=='tilt'else 0
 b+=f'<g transform="rotate({rot} {x} {y})"><path d="M{x-49} {y-20} Q{x} {y-56} {x+49} {y-20} L{x+24} {y+16} L{x} {y+29} L{x-25} {y+16}Z" fill="#71869a" stroke="#b6c9d8" stroke-width="2"/>'+path(f'M{x-25} {y+16} L{x} {y+29} L{x+24} {y+16}','#65d8c4',7)+'</g>'
 b+=text(27,291,'Медиально',15)+text(312,291,'Латерально',15)
 if k=='mpfl':b+=path('M165 109 L96 145','#edbc78',8)+path('M129 118 L136 137','#fb9678',10)
 if k=='dislocation':b+='<ellipse cx="275" cy="125" rx="15" ry="9" fill="#fb9678"/><ellipse cx="333" cy="162" rx="17" ry="14" fill="#fb9678"/>'+text(155,260,'Искать костные ушибы / фрагмент',14)
 wrap('p-'+k,{'normal':'Пателлофеморальный сустав','tilt':'Латеральный наклон','lateral':'Латеральное смещение','dislocation':'После латерального вывиха','dysplasia':'Уплощение блока','mpfl':'Повреждение MPFL'}[k],b,'Условно аксиально · ориентация медиально/латерально')
for k in ['normal','tilt','lateral','dislocation','dysplasia','mpfl']:pf(k)
b=path('M64 236 H380','#b8cada',3)+path('M165 106 V258 M285 106 V258','#edbc78',3)+path('M165 281 H285','#65d8c4',4)+text(198,307,'TT–TG',19)+text(127,81,'TG',20)+text(270,81,'TT',20)
b+=text(22,162,'Общие оси и задняя мыщелковая линия',14)
wrap('p-tttg','TT–TG · перенос уровней',b,'Два аксиальных уровня · здесь топологическая схема')
b='<path d="M109 82 L179 151 L155 181 L88 109Z" fill="#71869a"/>'+path('M168 165 L279 274','#edbc78',8)+path('M194 268 L338 268','#b8cada',5)+path('M84 67 L183 162','#65d8c4',3)+text(61,154,'Lp',20)+text(245,202,'Lt',20)+text(24,310,'Insall–Salvati = Lt / Lp',18)
wrap('p-height','Высота надколенника',b,'Сагиттально · Lt сухожилие · Lp длина надколенника')
b=path('M55 253 H390','#b8cada',3)+path('M206 177 L353 126','#65d8c4',5)+path('M206 177 H353','#edbc78',3)+path('M250 177 Q250 164 247 160','#edbc78',3)+text(259,164,'LTI',18)+text(33,295,'Латеральный скат ↔ задние мыщелки',16)
wrap('p-lti','LTI · наклон латерального ската',b,'Соответствующий проксимальный уровень блока')
for k in ['normal','sprain','partial','complete','chronic','mucoid']:
 b='<rect x="74" y="67" width="295" height="56" rx="20" fill="#71869a"/><rect x="74" y="245" width="295" height="56" rx="20" fill="#71869a"/>'
 b+=path('M166 113 L280 254','#edbc78',28 if k=='mucoid'else 18)
 if k=='sprain':b+=path('M141 125 L260 271 M180 102 L298 238','#70bde6',4)
 if k in ['partial','complete']:b+=path('M211 166 L244 194','#10202d',10 if k=='partial'else 35)+path('M211 166 L244 194','#fb9678',4)
 if k=='chronic':b+=path('M162 133 Q133 188 240 246','#b9a183',12)+path('M194 149 L262 220','#10202d',32)
 if k=='mucoid':b+=path('M156 119 L270 258 M171 112 L285 250','#516f71',3)
 wrap('k-'+k,{'normal':'Непрерывные волокна','sprain':'Отёк при сохранённых волокнах','partial':'Частичное повреждение','complete':'Полный разрыв','chronic':'Хроническое повреждение','mucoid':'Мукоидная дегенерация ПКС'}[k],b,'Схема волокон и прикреплений, не МР-срез')
b='<rect x="176" y="80" width="190" height="74" rx="25" fill="#71869a"/><rect x="176" y="195" width="190" height="105" rx="25" fill="#71869a"/>'+path('M165 102 L155 214 Q109 219 116 237','#edbc78',12)+path('M89 246 H185','#b59bd9',12)+text(24,275,'Pes anserinus',15)+text(24,59,'Оторванная МКС поверх сухожилий',16)
wrap('k-stener','Дистальная МКС · Stener-like',b,'Условная медиальная проекция, не один срез')
b='<ellipse cx="234" cy="103" rx="116" ry="54" fill="#71869a"/><rect x="161" y="222" width="157" height="71" rx="20" fill="#71869a"/><ellipse cx="101" cy="259" rx="30" ry="40" fill="#71869a"/>'+path('M165 124 L104 229 M254 126 Q211 200 137 245 M213 199 L111 235','#edbc78',8)+text(23,193,'FCL',16)+text(286,188,'PT',16)+text(165,242,'PFL',16)+text(34,311,'Малоберцовая головка слева',14)
wrap('k-plc','Заднелатеральный комплекс',b,'FCL коллатеральная · PT подколенная · PFL связка')
