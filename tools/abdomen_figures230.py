from pathlib import Path
from html import escape
import json,math
A=Path('app/src/main/assets');D=A/'abdomen230';D.mkdir(exist_ok=True)
C='#5ae0c5';O='#ffb75e';R='#ff7f91';B='#7bbcff';BG='#101c28'
def path(d,c=C,w=8,fill='none',dash=''):return f'<path d="{d}" fill="{fill}" stroke="{c}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"'+(f' stroke-dasharray="{dash}"'if dash else '')+'/>'
def ell(x,y,rx,ry,fill,stroke=C,w=2):return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}" stroke="{stroke}" stroke-width="{w}"/>'
def mark(n,x,y,tx,ty):return path(f'M{x} {y} L{tx} {ty}', '#c8d6e8',1.3)+f'<circle cx="{x}" cy="{y}" r="12" fill="#26394d" stroke="#e4f3ff"/><text x="{x}" y="{y+5}" fill="white" text-anchor="middle" font-size="15">{n}</text>'
def txt(x,y,t,size=12):return f'<text x="{x}" y="{y}" fill="#b5c9df" font-size="{size}">{escape(t)}</text>'
def save(id,title,body,projection):
 s=f'<svg xmlns="http://www.w3.org/2000/svg" width="420" height="340" viewBox="0 0 420 340" role="img" aria-labelledby="title desc"><title id="title">{escape(title)}</title><desc id="desc">Условная учебная схема. {escape(projection)}. Цифры соответствуют легенде. Без масштаба.</desc><rect width="420" height="340" rx="18" fill="{BG}"/>'+txt(16,24,projection)+body+txt(16,325,'Условная схема · без масштаба · не МРТ',11)+'</svg>'
 (D/(id+'.svg')).write_text(s)
pan=path('M53 147 Q32 180 61 241 Q85 267 119 221 Q172 196 250 207 Q322 208 371 157 Q356 127 317 137 Q255 158 195 144 Q143 121 100 147 Q77 122 53 147Z','#4a8973',2,'#193d34')
duct=path('M72 219 Q98 176 160 175 L325 165',C,4)
for id in ['ps-pdac','ps-net','ps-focal','ps-aip','ps-spn','ps-spleen','ps-duct','ps-angle','ps-vein','ps-spread']:
 b=pan+duct;proj='Длинная ось · головка слева / хвост справа'
 if id in ['ps-pdac','ps-duct']:
  b+=ell(100,181,30,31,'#45404c',R)+path('M130 175 L326 165',C,10)+path('M101 175 L128 175',BG,12)+path('M68 92 L68 151 L91 159',C,9)
  b+=mark(1,157,99,101,179)+mark(2,269,235,250,171)+mark(3,43,90,68,112) if id=='ps-pdac' else mark(1,155,98,125,174)+mark(2,279,235,256,170)+mark(3,43,90,68,111)
 elif id=='ps-net':b+=ell(199,164,22,24,R,R)+path('M172 106 L226 106 L226 70 L328 70',B,2)+path('M328 70 L363 92 L351 122 L302 115Z',C,2,'#193d34')+mark(1,119,94,195,157)+mark(2,273,231,246,169)+mark(3,367,58,335,94)
 elif id=='ps-focal':b+=ell(194,167,44,37,'#3f5148',O)+path('M152 177 Q191 169 237 173',C,4)+path('M146 125 Q189 99 236 127',O,2,dash='4 6')+mark(1,284,96,213,148)+mark(2,262,232,199,173)+mark(3,105,94,159,122)
 elif id=='ps-aip':b=path('M52 127 Q28 178 54 237 Q79 271 112 232 L337 217 Q386 197 379 150 Q375 118 336 116 L110 128 Q72 101 52 127Z',O,7,'#315548')+path('M76 219 Q99 177 153 177 L336 170',C,2)+mark(1,143,74,172,137)+mark(2,343,85,351,119)+mark(3,237,269,238,174)
 elif id=='ps-spn':b+=ell(266,164,51,47,'#6d3e50',O,4)+path('M238 125 Q257 132 266 155 L233 181 Q220 158 238 125Z',R,2,R)+ell(282,178,23,20,'#bca6b7','#bca6b7')+mark(1,337,103,306,136)+mark(2,188,91,242,147)+mark(3,343,249,283,181)
 elif id=='ps-spleen':b+=ell(359,114,30,49,'#8663a0','#b791d1')+ell(311,171,15,16,'#8663a0','#b791d1')+mark(1,248,235,310,172)+mark(2,312,64,355,108)+mark(3,369,252,335,181)
 elif id=='ps-angle':
  proj='Поперечный срез сосуда · угол по всей окружности';b=''
  for x,label,large in [(108,'≤180°',False),(307,'>180°',True)]:
   b+=ell(x,165,45,45,'#243f5b',B,3)
   if large:b+=path(f'M{x-51} 153 A52 52 0 1 1 {x-24} 211',R,17)
   else:b+=path(f'M{x+41} 133 A52 52 0 0 1 {x+41} 197',R,17)
   b+=path(f'M{x} 105 L{x} 225','#a1b3c5',1,dash='4 4')+txt(x-29,270,label,18)
  b+=mark(1,59,83,94,157)+mark(2,205,153,158,166)+mark(3,362,78,341,119)
 elif id=='ps-vein':b=txt(61,72,'Воротная / верхняя брыжеечная вена')+path('M196 91 L196 135 Q211 170 197 207 L196 270',B,28)+ell(236,168,48,39,'#553541',R)+path('M196 137 Q208 166 199 202',B,11)+ell(200,175,5,15,O,O)+mark(1,313,122,226,153)+mark(2,129,161,201,176)+mark(3,307,265,199,252);proj='Продольная условная схема · вена и опухоль'
 else:b+=ell(152,174,33,30,'#553541',R)+path('M111 70 Q221 43 294 78 L279 119 L130 121Z',C,2,'#193d34')+ell(238,88,12,10,R,R)+path('M179 204 L179 270',B,12)+path('M167 218 Q180 210 192 220 L194 253 L166 255Z',O,2,'#745543')+mark(1,79,94,150,167)+mark(2,322,71,243,87)+mark(3,254,268,182,237)
 save(id,id,b,proj)
# Liver outline deliberately schematic; no segmental map is implied.
liver=path('M58 91 Q112 57 210 84 Q270 70 350 106 L368 154 Q342 184 291 188 Q240 194 206 237 Q154 277 87 238 Q43 193 58 91Z','#4a8973',3,'#254c40')
pv=path('M208 243 L208 183 L125 144 M208 183 L299 130',B,7)
hv=path('M235 80 L235 273',B,11)+path('M115 129 L235 109 L315 123 M190 156 L235 109',B,5)
for id in ['ld-fat','ld-focal','ld-iron','ld-cirrhosis','ld-mre','ld-portal','ld-pvt','ld-budd','ld-congestion']:
 b=liver;proj='Условный вид спереди · не карта сегментов'
 if id=='ld-fat':
  b='';proj='Сравнение сигналов · изображения условные'
  for i,(label,fill)in enumerate([('in-phase','#82998b'),('opposed-phase','#36483c'),('PDFF','#d5ae51')]):
   x=75+i*135;b+=ell(x,170,54,62,fill,'#4a8973')+txt(x-39,80,label,13)+mark(i+1,x,273,x,184)
 elif id=='ld-focal':b+=path('M129 142 L194 129 L205 187 L151 211Z',O,2,'#9b7b44')+pv+mark(1,90,80,162,158)+mark(2,266,267,206,198)+mark(3,326,95,280,139)
 elif id=='ld-iron':b=liver.replace('#254c40','#182321')+txt(83,124,'TE →')+path('M102 155 Q132 212 188 220',O,3)+path('M241 154 L241 217 L323 217','#74869b',2)+path('M245 161 Q262 206 319 213',O,3)+mark(1,55,72,98,155)+mark(2,336,124,279,202)+mark(3,284,270,281,219)
 elif id=='ld-cirrhosis':b=path('M59 98 Q67 76 82 88 Q96 67 112 83 Q133 65 148 82 Q168 63 186 87 Q207 75 221 92 Q246 78 263 97 Q287 83 303 104 Q333 101 348 126 Q371 148 350 170 Q352 192 321 188 Q297 210 277 195 Q248 213 232 211 Q211 243 191 238 Q165 260 146 246 Q119 255 105 237 Q81 239 72 214 Q44 189 56 170 Q39 144 59 98Z',C,3,'#254c40')+pv+mark(1,37,83,78,90)+mark(2,306,66,237,124)+mark(3,273,274,208,231)
 elif id=='ld-mre':b+=path('M112 124 L191 112 L214 193 L133 210Z',O,2,'#ab8852')+ell(198,159,14,10,'#101c28',B)+pv+txt(251,107,'MRE')+mark(1,82,77,143,146)+mark(2,264,260,198,161)+mark(3,329,93,183,130)
 elif id=='ld-portal':b+=pv+path('M282 201 L282 291',B,10)+ell(346,222,21,44,'#8663a0','#b791d1')+path('M208 218 Q244 272 272 261 Q297 248 282 223',B,5)+mark(1,89,276,206,225)+mark(2,234,296,260,263)+mark(3,381,284,347,230)
 elif id=='ld-pvt':b+=pv+ell(207,210,5,19,O,O)+path('M193 233 Q168 220 190 196 Q216 178 232 199 Q251 226 224 239',B,3)+mark(1,270,275,208,211)+mark(2,105,277,213,227)+mark(3,304,212,232,220)
 elif id=='ld-budd':b+=hv+path('M221 108 L249 108',R,6)+path('M136 157 Q151 184 194 172 Q223 158 258 182',O,4,dash='4 5')+mark(1,145,63,229,108)+mark(2,302,267,235,241)+mark(3,69,282,175,174)
 else:b+=hv.replace('B,11','B,18')+path('M235 110 L235 254',B,19)+path('M118 130 L235 109 L315 123',B,11)+path('M96 174 Q143 146 180 180 T295 170',O,14,dash='8 16')+mark(1,294,281,234,249)+mark(2,354,72,300,123)+mark(3,62,274,146,171)
 save(id,id,b,proj)
# Adrenal over upper pole: simplified regional view, no claim of a specific right/left side unless bilateral.
kidney=path('M171 179 Q122 180 128 238 Q131 285 184 279 Q220 275 220 252 Q189 233 218 214 Q220 181 171 179Z','#4a8973',3,'#254c40')
adrenal=path('M149 154 L173 107 L214 146 L191 131 L173 135Z',O,3,'#5c513d')
for id in ['ad-adenoma','ad-myelo','ad-bleed','ad-pheo','ad-suspicious','ad-metastasis','ad-csi','ad-growth','ad-bilateral']:
 b=kidney+adrenal;proj='Зона надпочечника · проекция условная'
 if id=='ad-adenoma':b+=ell(190,128,29,26,'#8c9d90',O)+ell(303,127,29,26,'#3c4d3c',O)+txt(170,80,'IP')+txt(290,80,'OP')+mark(1,122,65,188,125)+mark(2,86,258,157,235)+mark(3,339,208,307,130)
 elif id=='ad-myelo':b+=ell(190,128,41,36,'#72574d',O)+path('M169 104 L197 104 L215 136 L175 148Z',O,2,O)+mark(1,129,70,189,121)+mark(2,280,98,222,136)+mark(3,95,271,165,213)
 elif id=='ad-bleed':b+=ell(190,128,42,35,'#bd9caf','#dfc2d6')+ell(210,115,9,10,R,R)+path('M143 169 Q185 177 228 158',O,3,dash='5 7')+mark(1,108,67,179,130)+mark(2,283,79,213,116)+mark(3,282,222,220,164)
 elif id=='ad-pheo':b+=ell(190,128,42,38,R,R)+ell(203,134,18,18,'#3a3d52','#7edcff')+mark(1,124,63,176,114)+mark(2,276,75,205,132)+mark(3,304,230,230,151)
 elif id=='ad-suspicious':b+=path('M133 112 L144 78 L182 87 L217 71 L241 106 L229 150 L241 181 L198 176 L175 158 L139 170Z',R,3,'#67404e')+ell(186,128,21,20,'#27394d','#7edcff')+path('M277 77 L277 272',B,16)+path('M234 140 L277 151 L277 192',R,9)+mark(1,102,65,166,106)+mark(2,92,178,145,165)+mark(3,329,240,278,175)
 elif id in ['ad-metastasis','ad-bilateral']:
  b='';proj='Спереди · правая сторона пациента слева'
  for x in [109,301]:b+=ell(x,232,41,54,'#254c40','#4a8973')+path(f'M{x-30} 143 L{x} 103 L{x+32} 143',O,9)+ell(x,133,32,28,'#67404e',R)
  b+=path('M170 61 L226 65 L239 86 L174 89Z',C,2,'#254c40')+ell(205,76,7,6,R,R)
  b+=mark(1,53,66,105,133)+mark(2,352,66,302,132)+mark(3,215,284,211,87)
 elif id=='ad-csi':
  b='';proj='Парные IP / OP · масса и одинаковый ROI'
  for x,label,fill in [(112,'in-phase','#96a497'),(308,'opposed-phase','#3e5141')]:
   b+=ell(x,163,47,53,fill,O)+ell(x,160,29,33,'none','#e8f6e9',1)+txt(x-38,75,label)
  b+=path('M164 160 L254 160','#9eb4cc',1,dash='5 5')+mark(1,74,265,110,178)+mark(2,350,265,310,178)+mark(3,211,244,208,160)
 else:b+=ell(195,127,53,44,'#67404e',R)+ell(195,127,31,26,'none',O,2).replace('/>',' stroke-dasharray="5 5"/>')+path('M142 69 L248 69',O,2)+path('M142 61 L142 77 M248 61 L248 77',O,2)+mark(1,121,66,170,117)+mark(2,289,65,247,69)+mark(3,300,229,218,149)
 save(id,id,b,proj)
for k in ['pancreatic-solid','diffuse-liver','adrenal-masses']:
 d=json.loads((A/(k+'-data.js')).read_text().split('=',1)[1].strip().removesuffix(';'))
 (A/'menu-thumbs'/(k+'.svg')).write_text((D/(d['local'][0]['id']+'.svg')).read_text())
print('28 SVGs and3 menu thumbnails')
