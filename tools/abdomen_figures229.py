from pathlib import Path
from html import escape
import json
A=Path('app/src/main/assets');D=A/'abdomen229';D.mkdir(exist_ok=True)
C='#5ae0c5';O='#ffb75e';R='#ff7f91';BG='#101c28'
def path(d,c=C,w=8,fill='none',dash=''):return f'<path d="{d}" fill="{fill}" stroke="{c}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"'+(f' stroke-dasharray="{dash}"'if dash else '')+'/>'
def ellipse(x,y,rx,ry,fill,stroke=C,w=2):return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}" stroke="{stroke}" stroke-width="{w}"/>'
def mark(n,x,y,tx,ty):return path(f'M{x} {y} L{tx} {ty}', '#c8d6e8',1.3)+f'<circle cx="{x}" cy="{y}" r="12" fill="#26394d" stroke="#e4f3ff"/><text x="{x}" y="{y+5}" fill="white" text-anchor="middle" font-size="15">{n}</text>'
def txt(x,y,t,size=12):return f'<text x="{x}" y="{y}" fill="#b5c9df" font-size="{size}">{escape(t)}</text>'
def save(id,title,body,projection):
 s=f'<svg xmlns="http://www.w3.org/2000/svg" width="420" height="340" viewBox="0 0 420 340" role="img" aria-labelledby="title desc"><title id="title">{escape(title)}</title><desc id="desc">Условная учебная схема. {escape(projection)}. Цифры соответствуют легенде на странице. Без масштаба.</desc><rect width="420" height="340" rx="18" fill="{BG}"/>'+txt(16,24,projection)+body+txt(16,325,'Условная схема · без масштаба · не МРТ',11)+'</svg>'
 (D/(id+'.svg')).write_text(s)
# biliary tree: anterior view, right patient lobe on image left; cystic duct joins below confluence.
base=path('M200 128 L200 174 L224 207 L224 279')+path('M200 128 L145 86 L104 66 M145 86 L153 48 M200 128 L259 85 L316 64 M259 85 L257 46',w=6)+path('M200 174 L159 177 L135 190',w=5)+ellipse(120,216,22,38,'#254a45')+path('M132 185 L135 190',w=5)
for id in ['bc-map','bc-stone','bc-benign','bc-malignant','bc-psc','bc-hilar','bc-mirizzi','bc-leak','bc-pitfall']:
 b=base
 if id=='bc-map': b+=txt(53,43,'ПРАВАЯ доля')+txt(269,43,'ЛЕВАЯ доля')+mark(1,177,106,200,128)+mark(2,73,179,144,181)+mark(3,289,266,224,279)
 elif id=='bc-stone': b+=path('M224 208 L224 240',w=15)+ellipse(224,252,7,10,'#101c28',O)+mark(1,282,253,232,252)+mark(2,177,252,218,243)+mark(3,286,202,230,218)
 elif id=='bc-benign': b+=path('M224 211 L224 268',BG,19)+path('M224 211 Q219 231 222 244 L224 268',w=3)+path('M224 211 Q229 231 226 244 L224 268',w=3)+mark(1,290,239,225,238)+mark(2,273,190,224,211)+mark(3,177,281,224,271)
 elif id=='bc-malignant': b+=ellipse(224,241,26,30,'#4b2937',R)+path('M224 208 L224 267',BG,18)+path('M218 211 L222 226 L217 234 L223 244 L220 255 L220 267',R,4)+path('M230 211 L227 224 L232 237 L226 249 L229 266',R,4)+mark(1,292,241,230,240)+mark(2,275,188,223,211)+mark(3,171,267,205,253)
 elif id=='bc-psc':
  for d in ['M200 137 L200 145','M162 99 L168 104','M278 78 L288 74','M224 235 L224 243']:b+=path(d,BG,13)+path(d,C,2)
  b+=ellipse(198,155,7,9,'#285349')+mark(1,275,231,224,238)+mark(2,256,155,205,155)+mark(3,334,98,304,69)
 elif id=='bc-hilar': b+=path('M187 117 L212 117 L214 138 L190 140 Z',R,2,'#4b2937')+mark(1,225,105,201,125)+mark(2,77,104,144,88)+mark(3,319,111,260,86)
 elif id=='bc-mirizzi':b+=ellipse(187,175,13,13,O,O)+path('M200 165 L200 184',BG,14)+path('M200 165 Q192 175 200 184',C,3)+mark(1,89,158,187,175)+mark(2,258,169,198,176)+mark(3,281,258,224,258)
 elif id=='bc-leak':b+=ellipse(271,191,36,24,'#214d59','#7edcff')+path('M224 204 L245 193','#7edcff',3,dash='4 5')+path('M213 191 L230 185',O,3)+mark(1,173,207,219,189)+mark(2,336,181,284,190)+mark(3,285,272,224,263)
 else:b+=ellipse(224,238,5,9,BG,O)+txt(266,103,'MIP')+path('M282 115 L327 115 L327 211 L282 211 Z','#4d6c86',2)+path('M304 125 L304 197',C,8)+mark(1,168,248,224,238)+mark(2,354,243,306,191)+mark(3,284,280,225,276)
 save(id,id,b,'Спереди · анатомия протоков условная')
# pancreas long axis, no claim of exact patient projection; head left, tail right.
pan=path('M53 147 Q32 180 61 241 Q85 267 119 221 Q172 196 250 207 Q322 208 371 157 Q356 127 317 137 Q255 158 195 144 Q143 121 100 147 Q77 122 53 147Z','#4a8973',2,'#193d34')
duct=path('M72 219 Q98 176 160 175 L325 165',C,4)
for id in ['pc-bd','pc-md','pc-scn','pc-mcn','pc-post','pc-nodule','pc-high','pc-growth','pc-whole']:
 b=pan+duct
 cyst=lambda x,y,rx=28,ry=27:ellipse(x,y,rx,ry,'#163d56','#8ce5ff',2)
 if id=='pc-bd':b+=cyst(200,135,26,25)+cyst(223,124,18,18)+path('M200 161 L200 174','#8ce5ff',4)+mark(1,149,230,170,176)+mark(2,268,93,220,124)+mark(3,258,198,200,165)
 elif id=='pc-md':b=pan+path('M72 219 Q98 176 160 175 L325 165',C,12)+cyst(203,132)+path('M203 156 L203 173','#8ce5ff',6)+mark(1,170,238,171,174)+mark(2,254,94,205,134)+mark(3,43,265,73,218)
 elif id=='pc-scn':
  for x,y in [(210,159),(232,145),(254,159),(210,182),(233,171),(254,181),(232,194)]:b+=cyst(x,y,12,12)
  b+=path('M226 169 L239 176 M238 164 L229 182',O,3)+mark(1,299,123,254,159)+mark(2,299,220,234,174)+mark(3,153,233,162,175)
 elif id=='pc-mcn':b+=cyst(296,161,43,32)+path('M294 130 L294 192','#8ce5ff',3)+mark(1,353,114,320,148)+mark(2,339,231,295,177)+mark(3,208,236,222,171)
 elif id=='pc-post':b+=cyst(218,114,56,37)+path('M191 123 L230 138 L249 122',O,5)+mark(1,307,78,251,106)+mark(2,276,203,232,134)+mark(3,130,244,170,176)
 elif id in ['pc-nodule','pc-high']:
  b+=cyst(204,140,43,39)+path('M173 115 Q201 117 181 141 Z',R,2,R)+path('M161 105 L161 148',O,1)+txt(119,99,'h')
  if id=='pc-high':b+=path('M84 203 Q107 177 158 175 L321 165',C,12)
  b+=mark(1,128,80,183,126)+mark(2,279,104,224,138)+mark(3,277,235,219,172) if id=='pc-high' else mark(1,128,80,183,126)+mark(2,280,106,223,138)+mark(3,113,163,161,128)
 elif id=='pc-growth':b+=cyst(207,145,46,40)+ellipse(207,145,30,26,'none',O,2).replace('/>',' stroke-dasharray="5 5"/>')+path('M161 92 L253 92',O,2)+mark(1,124,92,180,132)+mark(2,290,96,247,124)+mark(3,285,242,273,168)
 else:b+=cyst(245,143)+cyst(303,179,12,12)+ellipse(130,174,18,20,R,R)+path('M111 174 L144 174',BG,5)+mark(1,269,87,244,136)+mark(2,355,233,305,182)+mark(3,94,100,131,167)
 save(id,id,b,'Длинная ось · головка слева / хвост справа')
# Cysts are magnified sections, not MRI; wall thickness diagrams illustrative, dimensions only in text.
for id in ['rn-i','rn-ii','rn-iif-many','rn-iif-wall','rn-iii','rn-iv','rn-t1','rn-sub','rn-solid','rn-fat']:
 b=ellipse(198,169,148,107,'#193d34','#4a8973')
 b+=ellipse(212,164,86,79,'#163d56','#8ce5ff', 2 if id in ['rn-i','rn-ii','rn-iif-many'] else 5)
 if id=='rn-i':b+=mark(1,317,97,270,117)+mark(2,223,59,215,143)+mark(3,81,263,111,221)
 elif id in ['rn-ii','rn-iif-many']:
  lines=['M142 122 Q208 169 277 112','M141 210 Q209 164 283 203']
  if id=='rn-iif-many':lines+=['M165 99 Q198 151 161 227','M250 95 Q227 167 258 228']
  for d in lines:b+=path(d,R,2)
  b+=mark(1,316,104,274,114)+mark(2,309,242,253,195)+mark(3,111,82,180,146)
 elif id=='rn-iif-wall':b+=ellipse(212,164,86,79,'none',R,5)+txt(290,174,'3 мм')+mark(1,335,214,297,175)+mark(2,122,80,196,154)+mark(3,144,268,207,245)
 elif id=='rn-iii':b+=ellipse(212,164,86,79,'none',R,10)+path('M131 140 C132 150 150 150 149 158 C148 168 130 168 128 179Z',R,2,R)+mark(1,321,90,277,114)+mark(2,83,134,147,147)+mark(3,301,261,230,190)
 elif id=='rn-iv':b+=path('M145 120 L180 126 L150 146Z',R,2,R)+txt(172,118,'h')+mark(1,216,68,174,129)+mark(2,96,94,146,125)+mark(3,315,243,245,197)
 elif id=='rn-t1':b+=ellipse(212,164,83,76,'#bda5b5','#cdb7cc')+ellipse(228,185,28,20,'#7b617c','#7b617c')+mark(1,316,91,247,128)+mark(2,330,239,235,188)+mark(3,115,92,156,128)
 elif id=='rn-sub':
  b=''
  for i,label in enumerate(['До','После','Вычитание']):
   x=77+i*132;b+=ellipse(x,169,54,66,'#5b536d' if i<2 else '#172638','#8ce5ff')+txt(x-29,72,label,13)
   b+=ellipse(x-23,145,11,15,'#5b536d' if i==0 else R,R if i else '#5b536d')
  b+=mark(1,45,270,69,181)+mark(2,206,270,188,146)+mark(3,364,270,379,181)
 elif id=='rn-solid':b+=ellipse(212,164,82,75,R,R)+ellipse(228,180,30,26,'#163d56','#8ce5ff')+mark(1,128,78,180,130)+mark(2,322,237,235,181)+mark(3,79,264,111,221)
 else:b+=ellipse(212,164,83,76,'#7e5c53',R)+path('M179 103 L229 124 L248 169 L210 191 L160 165Z',O,2,O)+mark(1,317,86,212,147)+mark(2,321,246,246,209)+mark(3,81,263,109,222)
 save(id,id,b,'Увеличенный условный срез · R/L не заданы')
for k in ['biliary-mrcp','pancreatic-cysts','renal-bosniak']:
 d=json.loads((A/(k+'-data.js')).read_text().split('=',1)[1].strip().removesuffix(';'))
 (A/'menu-thumbs'/(k+'.svg')).write_text((D/(d['local'][0]['id']+'.svg')).read_text())
print('28 original SVGs and 3 menu thumbnails')
