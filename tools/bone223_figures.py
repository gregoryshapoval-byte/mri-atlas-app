"""Original schematic vectors. Colours encode tissue, not a literal MRI sequence."""
from pathlib import Path
from html import escape
A=Path(__file__).resolve().parents[1]/'app/src/main/assets';O=A/'bone-lesions';O.mkdir(exist_ok=True)
BG='#0d1822';CORT='#b4c9d1';MARROW='#294657';CYAN='#80d2dc';DARK='#0b1620';FAT='#ebca83';PINK='#d58f8e';EDGE='#90aebd'
OUT='M110 66Q135 39 157 58Q190 72 223 58Q250 39 276 66Q298 95 263 120L239 145V282H151V145L123 120Q92 95 110 66Z'
INNER='M120 73Q138 54 156 69Q190 83 225 69Q248 54 267 73Q282 95 255 110L227 139V282H163V139L132 111Q106 95 120 73Z'
def path(d,fill,stroke='none',sw=2):return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"/>'
def ell(x,y,rx,ry,fill,stroke='none',sw=2):return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def text(x,y,s,size=11,color=EDGE,anchor='middle'):return f'<text x="{x}" y="{y}" font-size="{size}" font-family="sans-serif" text-anchor="{anchor}" fill="{color}">{escape(s)}</text>'
def line(x,y,X,Y,color='#7ed6c3',width=1.5,dash=''):return f'<path d="M{x} {y}L{X} {Y}" stroke="{color}" stroke-width="{width}" fill="none" stroke-dasharray="{dash}"/>'
def mark(n,x,y,X,Y):return line(x,y,X,Y)+f'<circle cx="{x}" cy="{y}" r="11" fill="#12242e" stroke="#7ed6c3"/>'+text(x,y+4,str(n),12,'#c5f3e9')
def base(expand=False):
 o=OUT;i=INNER
 if expand:
  o=o.replace('L239 145V282','L260 165Q270 198 239 236V282').replace('H151V145','H151V236Q120 198 132 165L151 145')
  i=i.replace('L227 139V282','L249 165Q259 198 227 234V282').replace('H163V139','H163V234Q132 198 144 165L163 139')
 return '<defs><clipPath id="med"><path d="'+i+'"/></clipPath></defs>'+path(o,CORT)+path(i,MARROW)+path('M112 60Q135 35 157 52Q190 66 223 52Q251 35 274 60','none','#6fc8c4',5)
def clip(s):return '<g clip-path="url(#med)">'+s+'</g>'
def wrap(id,s,title):return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 300" role="img" aria-label="{escape(id)}"><rect width="420" height="300" rx="16" fill="{BG}"/>'+text(210,22,title,10)+s+'</svg>'
fig={}
fig['location']=wrap('location',base()+line(116,107,272,107,EDGE,1.5,'5 4')+line(153,143,238,143,EDGE,1,'4 4')+mark(1,61,77,175,82)+mark(2,349,123,225,125)+mark(3,64,220,156,219),'ДЛИННАЯ КОСТЬ · СЕГМЕНТЫ И КОМПАРТМЕНТЫ')
fig['margin']=wrap('margin',base()+ell(195,185,24,38,DARK,CORT,5)+mark(1,57,158,186,170)+mark(2,347,181,219,184)+mark(3,60,249,151,246),'МЕДЛЕННЫЙ РОСТ · НЕ ГИСТОЛОГИЧЕСКИЙ ДИАГНОЗ')
rag='M176 135L192 141L205 129L212 148L229 151L223 170L234 184L222 201L225 215L208 212L195 228L182 216L167 219L173 199L161 184L174 169L164 150Z'
fig['aggressive']=wrap('aggressive',base()+clip(path(rag,PINK))+path('M222 160H239V204H222',PINK)+ell(253,183,32,25,PINK)+path('M242 128L264 149M245 225L266 211','none',CORT,3)+mark(1,58,137,181,148)+mark(2,349,177,267,183)+mark(3,348,240,254,219),'КОСТЬ / КОРТИКАЛЬНЫЙ СЛОЙ / МЯГКИЕ ТКАНИ')
s=''
for x in [24,157,290]:s+=f'<rect x="{x}" y="65" width="105" height="175" rx="12" fill="{MARROW}" stroke="{EDGE}"/>'
for x,y in [(52,102),(87,135),(59,180),(100,201)]:s+=f'<path d="M{x-9} {y}a10 10 0 1 1 15 8" stroke="{CORT}" stroke-width="4" fill="none"/>'
for x,y,rx,ry in [(189,112,19,12),(216,133,22,18),(188,160,15,22),(217,180,18,15)]:s+=ell(x,y,rx,ry,CORT)
for row in range(8):
 for col in range(5):s+=ell(304+col*17+(row%2)*4,82+row*19,3,2.5,EDGE)
s+=mark(1,76,264,76,226)+mark(2,209,264,209,226)+mark(3,342,264,342,226)
fig['matrix']=wrap('matrix',s,'МАТРИКС · УСЛОВНЫЙ РЕНТГЕНОГРАФИЧЕСКИЙ РИСУНОК')
spikes='M195 163L200 174L210 168L208 181L222 183L211 191L219 204L204 202L201 216L192 205L180 213L182 199L169 194L181 188L172 175L188 179Z'
fig['enostosis']=wrap('enostosis',base()+path(spikes,DARK)+mark(1,58,167,192,190)+mark(2,348,206,211,201)+mark(3,61,252,166,227),'ЭНОСТОЗ · ПЛОТНЫЙ ОЧАГ С ЛУЧИСТЫМ КРАЕМ')
s=base()+clip(ell(186,143,24,24,CYAN)+ell(204,164,22,23,CYAN)+ell(188,184,22,25,CYAN))
for x,y in [(184,134),(207,159),(185,182)]:s+=f'<path d="M{x-7} {y}a8 8 0 1 1 10 7" stroke="{DARK}" stroke-width="3" fill="none"/>'
s+=mark(1,58,126,181,144)+mark(2,346,147,207,159)+mark(3,346,224,227,186)
fig['enchondroma']=wrap('enchondroma',s,'ХРЯЩЕВОЙ ОЧАГ · ОЦЕНИВАЙТЕ ЭНДОСТ')
fig['cyst']=wrap('cyst',base()+ell(194,146,26,47,CYAN,EDGE,1.5)+mark(1,57,135,189,144)+mark(2,348,178,236,179)+mark(3,61,244,175,183),'ЦЕНТРАЛЬНАЯ КОСТНАЯ КИСТА')
fig['ganglion']=wrap('ganglion',base()+ell(149,84,15,13,CYAN,CORT,3)+mark(1,54,84,144,84)+mark(2,344,124,161,89)+mark(3,344,65,245,57),'СУБХОНДРАЛЬНЫЙ ГАНГЛИОН / ГЕОДА')
nof=path('M153 129Q174 123 174 145Q181 160 169 179Q163 191 153 187Z',DARK,CORT,3)
fig['nof']=wrap('nof',base()+nof+mark(1,57,139,157,147)+mark(2,346,181,171,163)+mark(3,61,247,201,218),'КОРТИКАЛЬНЫЙ МЕТАФИЗАРНЫЙ ОЧАГ')
s=base(True)+ell(194,185,48,61,'#72909d',CORT,2)
for y in range(139,232,13):
 for x in range(156,235,12):
  if ((x-194)/43)**2+((y-185)/55)**2<1:s+=ell(x,y,2,2,CORT)
s+=mark(1,57,143,187,179)+mark(2,350,186,257,187)+mark(3,61,250,142,212)
fig['fd']=wrap('fd',s,'ФИБРОЗНАЯ ДИСПЛАЗИЯ · МАТОВОЕ СТЕКЛО')
fig['lipoma']=wrap('lipoma',base()+ell(194,183,25,41,FAT,EDGE,2)+ell(194,185,7,9,CORT)+mark(1,57,154,188,164)+mark(2,347,182,196,185)+mark(3,61,251,151,237),'МАКРОСКОПИЧЕСКИЙ ЖИР · НЕ ПРОСТО T1-ЯРКОСТЬ')
serp='M181 145Q170 151 178 166Q168 181 178 191Q171 210 183 222Q199 214 211 221Q222 209 214 193Q224 176 213 164Q219 144 203 146Q191 134 181 145Z'
fig['infarct']=wrap('infarct',base()+path(serp,FAT,DARK,5)+mark(1,57,152,177,155)+mark(2,347,178,195,181)+mark(3,61,247,227,237),'МЕТА-/ДИАФИЗ · СЕРПИГИНОЗНАЯ ГРАНИЦА')
s=f'<rect x="90" y="70" width="240" height="158" rx="22" fill="{CORT}"/><rect x="101" y="81" width="218" height="136" rx="15" fill="{FAT}"/>'
for x in [119,149,179,209,239,269,299]:s+=line(x,90,x-3,211,MARROW,5)
s+=mark(1,47,91,100,96)+mark(2,363,149,268,149)+mark(3,47,246,187,178)
fig['hemangioma']=wrap('hemangioma',s,'ТЕЛО ПОЗВОНКА · ПРОДОЛЬНАЯ УСЛОВНАЯ СХЕМА')
s=base()+path('M225 160L270 141L287 110L303 116L291 158L238 182Z',CORT)+path('M223 169L278 149L293 119L298 123L285 153L226 175Z',MARROW)+path('M285 109Q299 101 309 116L304 125Q298 113 289 119Z',CYAN)
s+=mark(1,349,185,264,156)+mark(2,58,197,253,160)+mark(3,351,81,301,113)
fig['osteochondroma']=wrap('osteochondroma',s,'НЕПРЕРЫВНОСТЬ КОРТЕКСА И КОСТНОГО МОЗГА')
s=base()+ell(155,187,19,45,'#92adb7')+ell(155,187,9,12,CYAN)+ell(155,187,3,4,CORT)+mark(1,56,156,154,181)+mark(2,349,183,155,188)+mark(3,57,253,154,215)
fig['osteoid']=wrap('osteoid',s,'НИДУС И НЕПРОПОРЦИОНАЛЬНАЯ РЕАКЦИЯ')
s=base()+clip(ell(194,137,25,27,PINK)+ell(190,248,13,16,PINK))+path('M223 142H241V169H223',PINK)+ell(251,156,23,20,PINK)+mark(1,57,125,190,137)+mark(2,61,252,186,247)+mark(3,349,177,260,158)
fig['metastasis']=wrap('metastasis',s,'МЕТАСТАЗЫ · СХЕМА РАСПРЕДЕЛЕНИЯ, НЕ СИГНАЛА')
s=base()+clip(path('M171 112H219V275H171Z','#705a70')+ell(185,148,15,19,PINK)+ell(201,213,13,19,PINK)+ell(189,256,10,12,PINK))+mark(1,57,131,184,148)+mark(2,348,227,200,213)+mark(3,58,252,151,240)
fig['myeloma']=wrap('myeloma',s,'ОЧАГОВОЕ / ДИФФУЗНОЕ ЗАМЕЩЕНИЕ')
s=base()+clip(ell(198,154,34,39,PINK)+ell(193,254,12,13,PINK))+path('M222 135H241V181H222',PINK)+ell(267,157,39,29,PINK)+mark(1,55,126,195,151)+mark(2,355,191,275,169)+mark(3,61,258,188,254)
fig['sarcoma']=wrap('sarcoma',s,'ОПУХОЛЬ И ОТДЕЛЬНЫЙ SKIP-ОЧАГ')
fig['gct']=wrap('gct',base()+clip(ell(154,99,34,33,PINK)+ell(165,119,26,28,PINK))+mark(1,57,60,151,72)+mark(2,349,118,166,112)+mark(3,60,210,147,139),'ЭКСЦЕНТРИЧЕСКИЙ ЭПИМЕТАФИЗАРНЫЙ ОЧАГ')
s=base(True)+ell(194,184,49,58,DARK,CORT,2)
for x,y,rx,ry in [(173,160,17,23),(211,163,20,24),(178,207,22,23),(219,205,15,22)]:
 s+=ell(x,y,rx,ry,CYAN,EDGE,2)+line(x-rx+3,y+2,x+rx-3,y+2,PINK,5)
s+=ell(220,139,10,9,PINK)+mark(1,56,156,174,162)+mark(2,348,208,200,185)+mark(3,348,101,224,139)
fig['abc']=wrap('abc',s,'УРОВНИ ЖИДКОСТИ · ИЩИТЕ СОЛИДНЫЙ КОМПОНЕНТ')
s=base()+clip(ell(194,180,34,55,CYAN))+ell(194,180,26,40,DARK,CORT,5)+ell(194,180,20,33,PINK)+ell(194,180,15,28,CYAN)+mark(1,56,163,192,181)+mark(2,349,179,212,178)+mark(3,60,252,178,217)
fig['brodie']=wrap('brodie',s,'АБСЦЕСС · PENUMBRA НА НЕКОНТРАСТНОЙ T1')
for id,s in fig.items():(O/(id+'.svg')).write_text(s)
(A/'menu-thumbs/bone-lesions.svg').write_text(fig['enchondroma'])
print(len(fig),'original bone lesion figures')
