from pathlib import Path
r=Path(__file__).resolve().parents[1];a=r/'app/src/main/assets';out=a/'osteonecrosis';out.mkdir(exist_ok=True)
BG='#0d1822';BONE='#294657';EDGE='#8ba6b5';ZONE='#dba181';RIM='#10232c';FAT='#b9d3bd';EDEMA='#70b5d0'
def text(x,y,t,size=12,color='#acc3cf',anchor='middle'):return f'<text x="{x}" y="{y}" fill="{color}" font-family="sans-serif" font-size="{size}" text-anchor="{anchor}">{t}</text>'
def mark(n,x,y):return f'<circle cx="{x}" cy="{y}" r="11" fill="#12242e" stroke="#7dd9c6" stroke-width="1.5"/>'+text(x,y+4,str(n),12,'#c4f8e9')
def line(x,y,xx,yy):return f'<path d="M{x} {y}L{xx} {yy}" stroke="#87d3c4" fill="none" stroke-width="1.5"/>'
def circle(x,y,rad,fill,stroke=EDGE,sw=2):return f'<circle cx="{x}" cy="{y}" r="{rad}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def head(id,kind='normal',band=True,edema=False):
 dep=kind in ['collapse','3b','4'];small=kind=='3a';flat=85 if dep else 66
 hp=(f'M166 85H274A78 78 0 1 1 166 85Z' if dep else 'M196 66H244A78 78 0 1 1 196 66Z' if small else 'M142 140A78 78 0 1 0 298 140A78 78 0 1 0 142 140Z')
 s=f'<defs><clipPath id="head-{id}"><path d="{hp}"/></clipPath></defs><path d="M70 280H135L147 236L219 192L163 146L89 202Z" fill="{BONE}" stroke="{EDGE}" stroke-width="2"/><path d="{hp}" fill="{BONE}" stroke="{EDGE}" stroke-width="3"/>'
 if edema:s+=f'<g clip-path="url(#head-{id})"><ellipse cx="220" cy="150" rx="76" ry="78" fill="{EDEMA}" opacity=".6"/></g><path d="M88 256L101 207L167 159L193 186L132 224L120 256Z" fill="{EDEMA}" opacity=".55"/>'
 if band:s+=f'<g clip-path="url(#head-{id})"><path d="M125 35H310V96Q220 198 125 96Z" fill="{ZONE}"/><path d="M125 96Q220 198 310 96" stroke="{RIM}" stroke-width="7" fill="none"/></g>'
 if kind in ['fracture','3a','3b','4']:s+='<path d="M171 103Q220 76 269 103" stroke="#ffe2a0" stroke-width="4" fill="none"/>'
 if dep or small:s+='<path d="M166 85Q220 38 274 85" stroke="#91c7b9" stroke-width="2" stroke-dasharray="5 4" fill="none"/>' if dep else '<path d="M196 66Q220 58 244 66" stroke="#91c7b9" stroke-width="2" stroke-dasharray="3 3" fill="none"/>'
 if kind=='4':s+='<path d="M141 108Q158 58 220 60Q278 60 302 108" fill="none" stroke="#6b8999" stroke-width="17"/><path d="M151 109Q172 79 220 80Q268 80 294 109" fill="none" stroke="#d8b58c" stroke-width="5"/>'+circle(184,74,7,'#152833')+circle(271,88,6,'#152833')
 elif kind not in ['3a','3b','collapse']:s+='<path d="M132 104Q157 26 231 31Q289 35 313 102" fill="none" stroke="#486778" stroke-width="10"/>'
 return s
fig={}
def wrap(id,b,title='COR · УСЛОВНАЯ СХЕМА'):return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 300" role="img" aria-label="Остеонекроз: {id}"><rect width="420" height="300" rx="16" fill="{BG}"/>'+text(210,22,title,11)+b+'</svg>'
fig['rim']=wrap('rim',head('rim')+mark(1,217,91)+line(34,147,197,141)+mark(2,24,147)+line(350,62,276,85)+mark(3,363,56))
fig['double']=wrap('double',head('double')+'<g clip-path="url(#head-double)"><path d="M130 94Q220 181 306 94" stroke="#a4f1d6" stroke-width="3" fill="none"/></g>'+line(36,161,220,147)+mark(1,25,163)+line(354,148,249,131)+mark(2,366,148)+mark(3,217,89),'T2 · ДВОЙНАЯ ЛИНИЯ')
fig['edema']=wrap('edema',head('edema',edema=True)+'<path d="M306 127Q331 159 296 189" stroke="#88d8ef" stroke-width="8" fill="none"/>'+mark(1,217,92)+mark(2,132,225)+line(355,201,305,166)+mark(3,368,210),'FS / STIR · ЦВЕТА УСЛОВНЫЕ')
fig['fracture']=wrap('fracture',head('fracture','fracture')+line(348,64,269,81)+mark(1,362,60)+line(350,117,246,93)+mark(2,364,118)+line(40,171,206,145)+mark(3,28,177))
for id in ['collapse','arco3a','arco3b','arco4']:
 kind={'collapse':'collapse','arco3a':'3a','arco3b':'3b','arco4':'4'}[id];b=head(id,kind)
 if id=='arco4':b+=line(349,54,272,87)+mark(1,363,48)+line(355,104,231,82)+mark(2,368,104)+mark(3,220,167)
 else:
  if id=='collapse':b+=line(353,43,226,64)+mark(1,366,40)+line(354,112,243,85)+mark(2,368,112)
  else:b+=line(42,111,191,94)+mark(1,30,111)+line(351,111,247,85 if kind=='3b' else 66)+mark(2,365,112)
  b+=f'<path d="M327 62V{66 if kind=="3a" else 85}M321 62H333M321 {66 if kind=="3a" else 85}H333" stroke="#e6ce93" fill="none"/>'+text(345,80,'h',15,'#e6ce93')+line(350,168,332,76)+mark(3,358,176)
  if id!='collapse':b+=text(220,272,'≤2 мм' if kind=='3a' else '>2 мм',18,'#e6ce93')
 fig[id]=wrap(id,b,'МОРФОЛОГИЯ · БЕЗ МАСШТАБА' if id=='collapse' else 'ARCO 2019 · РЕНТГЕН / КТ')
fig['arco1']=wrap('arco1',head('arco1')+mark(1,218,89)+circle(350,207,32,BONE)+mark(2,350,207)+mark(3,345,264)+text(350,252,'XR: норма',11),'ARCO I · МРТ + РЕНТГЕН')
b=head('arco2',band=False);b+='<path d="M161 102Q221 183 278 102" stroke="#c5d3d7" stroke-width="8" fill="none"/>'+circle(215,113,12,'#10232c')+circle(253,121,8,'#10232c')+mark(1,220,160)+line(352,55,268,83)+mark(2,368,50)+mark(3,345,216)
fig['arco2']=wrap('arco2',b,'ARCO II · РЕНТГЕНОЛОГИЧЕСКИЕ ИЗМЕНЕНИЯ')
fig['extent']=wrap('extent',text(105,48,'COR · ЛАТ ← → МЕД',11)+text(318,48,'SAG · ПЕРЕД ← → ЗАД',10)+f'<g transform="translate(-25,50) scale(.65)">{head("extcor")}</g>'+f'<g transform="translate(193,50) scale(.65)">{head("extsag")}</g>'+mark(1,69,92)+mark(2,91,119)+mark(3,335,137),'ГРАНИЦЫ СЕГМЕНТА · ДВЕ ПЛОСКОСТИ')
fig['bilateral']=wrap('bilateral',f'<g transform="translate(-18,50) scale(.65)">{head("bilR")}</g>'+f'<g transform="translate(450,50) scale(-.65,.65)">{head("bilL","collapse")}</g>'+text(125,47,'R',16,'#7dd9c6')+text(307,47,'L',16,'#7dd9c6')+mark(1,126,113)+mark(2,307,113)+mark(3,210,269),'COR · СТАНДАРТНАЯ ОРИЕНТАЦИЯ')
# Compare only femoral-head contours; no copied source figures.
b=text(105,51,'ON',17,'#7dd9c6')+text(315,51,'SIF',17,'#7dd9c6')
b+=circle(105,151,73,BONE)+circle(315,151,73,BONE)
b+='<path d="M47 113Q106 50 163 113Q106 227 47 113Z" fill="#dba181"/><path d="M47 113Q106 227 163 113" fill="none" stroke="#10232c" stroke-width="7"/>'
b+='<circle cx="315" cy="151" r="68" fill="#70b5d0" opacity=".5"/><path d="M257 126L270 111L278 113L290 102L300 105L313 98L325 105L339 104L350 116L358 114L374 131" fill="none" stroke="#10232c" stroke-width="5" stroke-dasharray="26 4"/>'+mark(1,105,190)+mark(2,315,100)+mark(3,210,249)
fig['sif']=wrap('sif',b,'ПАТТЕРНЫ МОГУТ ПЕРЕКРЫВАТЬСЯ')
fig['transient']=wrap('transient',head('transient',band=False,edema=True)+mark(1,170,193)+mark(2,214,138)+line(353,70,254,85)+mark(3,368,61),'ДИФФУЗНЫЙ ОТЁК · НЕ СПЕЦИФИЧЕН')
b='<path d="M133 42H277L282 144Q323 163 293 218Q268 245 230 217L210 203L190 217Q152 245 125 218Q96 165 138 143Z" fill="#294657" stroke="#8ba6b5" stroke-width="3"/><path d="M124 249Q163 267 210 248Q255 266 297 249L279 283H140Z" fill="#294657" stroke="#8ba6b5" stroke-width="2"/><ellipse cx="158" cy="189" rx="29" ry="30" fill="#70b5d0" opacity=".6"/><path d="M133 211Q157 191 183 210" stroke="#10232c" stroke-width="5" fill="none"/><path d="M226 65Q245 54 256 78L249 125L234 115Z" fill="#b9d3bd" stroke="#10232c" stroke-width="4"/>'+mark(1,157,237)+line(44,166,159,207)+mark(2,30,158)+mark(3,244,94)
fig['knee']=wrap('knee',b,'КОЛЕНО · НЕ СТАДИРОВАТЬ ПО ARCO БЕДРА')
b='<path d="M164 276L173 178Q124 134 154 81Q190 41 242 64Q282 85 265 143L250 181L246 276Z" fill="#294657" stroke="#8ba6b5" stroke-width="3"/><path d="M160 78Q211 40 253 81Q227 145 160 78Z" fill="#dba181"/><path d="M160 78Q227 145 253 81" fill="none" stroke="#10232c" stroke-width="6"/><path d="M300 80Q330 116 300 158" fill="none" stroke="#486778" stroke-width="12"/>'+mark(1,209,199)+mark(2,204,84)+line(359,66,253,78)+mark(3,374,59)
fig['other']=wrap('other',b,'ГОЛОВКА ПЛЕЧА · УСЛОВНАЯ СХЕМА')
b='<path d="M147 43Q209 20 270 43L248 106L245 272H174L170 106Z" fill="#294657" stroke="#8ba6b5" stroke-width="3"/><path d="M196 115Q211 97 225 119L222 139L235 151L222 174L228 203L211 226L194 209L197 187L185 170L193 147Z" fill="#b9d3bd" stroke="#10232c" stroke-width="5"/>'+mark(1,156,74)+line(352,115,227,146)+mark(2,366,111)+mark(3,210,181)
fig['infarct']=wrap('infarct',b,'МЕТАДИАФИЗ · ВНЕ СУСТАВНОЙ ПОВЕРХНОСТИ')
for id,s in fig.items():(out/(id+'.svg')).write_text(s)
(a/'menu-thumbs/osteonecrosis.svg').write_text(fig['rim'])
print(len(fig),'original figures')
