"""Original ACL reconstruction schematics; projection, not surgical measurements."""
from pathlib import Path
from html import escape
O=Path('app/src/main/assets/acl-postop');O.mkdir(exist_ok=True)
BG='#0e1b26';BONE='#58727e';CORT='#a1bac4';G='#e8c48b';RED='#ff8b83';BLUE='#74d8ee';GREEN='#7ee2c1';DARK='#182a36'
def p(d,fill='none',stroke=CORT,w=2):return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>'
def t(x,y,s,size=11,c=CORT):return f'<text x="{x}" y="{y}" font-size="{size}" font-family="sans-serif" fill="{c}">{escape(s)}</text>'
def ell(x,y,rx,ry,c,stroke='none'):return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{c}" stroke="{stroke}" stroke-width="2"/>'
def mark(n,x,y,X,Y):return p(f'M{x},{y} L{X},{Y}',stroke=GREEN,w=1)+ell(x,y,10,10,DARK,GREEN)+t(x-3.5,y+4,str(n),12,GREEN)
def bones():return p('M150,28 H360 V163 Q350,196 310,188 L272,165 L245,95 L170,175 L140,150 Z',BONE)+p('M90,218 H335 L318,282 H110 Z',BONE)+t(20,35,'SAG · СПЕРЕДИ',10)+t(321,35,'СЗАДИ',10)
def tunnels(tib=190):return p(f'M112,278 L{tib},216',stroke=BG,w=25)+p('M270,113 L340,55',stroke=BG,w=25)+p(f'M112,278 L{tib},216',stroke=CORT,w=1)+p('M270,113 L340,55',stroke=CORT,w=1)
def graft(color=G,tib=190):return p(f'M112,278 L{tib},216 L270,113 L340,55',stroke=color,w=13)
def base():return bones()+tunnels()
def roof():return p('M154,192 L245,95',stroke=GREEN,w=3)
fig={}
fig['normal']=base()+graft()+mark(1,365,94,302,86)+mark(2,295,210,230,163)+mark(3,49,263,143,253)
fig['maturation']=base()+graft()+p('M198,207 L263,122',stroke=BLUE,w=6)+mark(1,300,120,268,123)+mark(2,319,188,228,170)+mark(3,72,104,142,104)+t(74,88,'сравнение',11)
fig['partial']=base()+graft()+p('M224,174 L237,158',stroke=BG,w=7)+p('M220,174 L233,158',stroke=BLUE,w=3)+mark(1,322,135,242,155)+mark(2,298,206,227,171)+mark(3,51,100,117,100)+t(39,82,'другая плоскость',10)
fig['complete']=base()+graft()+p('M222,175 L241,151',stroke=BG,w=26)+p('M221,177 L227,170',stroke=RED,w=13)+p('M239,155 L244,148',stroke=RED,w=13)+p('M225,162 L232,167',stroke=BLUE,w=4)+mark(1,319,110,257,132)+mark(2,318,176,231,163)+mark(3,56,230,202,204)
fig['insufficiency']=base()+p('M112,278 L190,216 Q227,241 244,181 Q253,145 270,113 L340,55',stroke=G,w=13)+p('M154,236 L187,236 M154,236 L163,230 M154,236 L163,242',stroke=BLUE,w=3)+mark(1,318,193,244,180)+mark(2,51,247,161,236)+mark(3,66,102,133,102)+t(39,83,'клинические тесты',10)
fig['materials']=base()+graft()+p('M124,269 L149,249',stroke='#d9e4e8',w=19)+p('M296,91 L321,71',stroke='#d9e4e8',w=19)+p('M153,267 L176,245',stroke=RED,w=9)+p('M334,43 L351,65',stroke=GREEN,w=7)+mark(1,64,226,140,258)+mark(2,314,202,235,163)+mark(3,368,62,342,54)
fig['tibial']=base()+graft()+roof()+p('M105,244 L245,95',stroke=GREEN,w=1)+mark(1,80,162,200,143)+mark(2,294,237,191,216)+mark(3,54,276,137,259)
# Coronal sketch for femoral placement; not a sagittal clockface.
fig['femoral']=p('M95,35 H325 V174 Q318,204 281,199 Q263,192 256,153 Q248,125 226,125 Q203,126 194,153 Q187,192 162,199 Q103,206 95,174 Z',BONE)+p('M100,225 H325 V280 H100 Z',BONE)+p('M190,153 L240,224',stroke=G,w=14)+p('M190,153 L121,83',stroke=BG,w=26)+p('M190,153 L121,83',stroke=G,w=13)+t(155,22,'COR · УСЛОВНО',11)+t(26,215,'латеральный',10)+t(285,215,'медиальный',10)+mark(1,53,147,190,153)+mark(2,54,66,137,110)+mark(3,358,104,282,104)
# Orthogonal canal cross section avoids presenting an oblique diameter as true size.
fig['widening']=ell(215,155,94,101,BONE,CORT)+ell(215,155,56,64,BG,CORT)+ell(215,155,18,23,G)+p('M159,155 L271,155 M159,149 L159,161 M271,149 L271,161',stroke=RED,w=3)+t(62,30,'ПОПЕРЁК ОСИ КАНАЛА',11)+t(163,283,'не косой срез',11)+mark(1,330,199,266,177)+mark(2,337,100,250,155)+mark(3,60,202,137,205)
fig['cyst']=base()+graft()+p('M127,276 L191,225',stroke=BLUE,w=24)+p('M127,276 L191,225',stroke=G,w=10)+ell(74,250,30,25,BLUE)+p('M98,253 L138,256',stroke=BLUE,w=8)+mark(1,282,245,157,252)+mark(2,25,207,68,235)+mark(3,50,285,120,255)
fig['impingement']=bones()+tunnels(110)+graft(tib=110)+roof()+ell(164,181,14,12,RED)+mark(1,78,117,219,125)+mark(2,305,184,164,181)+mark(3,52,237,110,216)
fig['cyclops']=base()+graft()+ell(167,201,25,17,RED)+mark(1,325,145,235,159)+mark(2,69,185,164,201)+mark(3,64,111,170,186)
fig['fibrosis']=base()+graft()+p('M101,213 Q127,173 163,177 L192,213 Z','#9c8294','#b99ba9',2)+p('M170,197 Q210,190 247,116 M194,211 Q230,200 263,141',stroke='#b99ba9',w=5)+mark(1,52,200,140,195)+mark(2,315,165,234,169)+mark(3,316,221,224,181)
fig['hardware']=base()+graft()+ell(145,252,39,33,'#15202c','#5c86a7')+p('M126,265 L164,235',stroke='#e2e8e8',w=9)+p('M137,262 L131,251 M147,253 L141,241 M157,245 L151,234',stroke=RED,w=2)+mark(1,54,218,143,252)+mark(2,51,283,169,273)+mark(3,317,171,244,151)
fig['infection']=base()+graft()+p('M120,207 Q130,189 152,194 L176,209 L282,208 Q313,202 330,213 L320,217 H120 Z',BLUE,RED,3)+p('M120,278 L190,221',stroke=RED,w=28)+p('M120,278 L190,221',stroke=BLUE,w=19)+ell(75,252,30,25,BLUE,RED)+mark(1,41,165,146,204)+mark(2,313,261,153,253)+mark(3,24,216,70,247)
for id,s in fig.items():
 (O/(id+'.svg')).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="420" height="300" viewBox="0 0 420 300" role="img"><title>{escape(id)} · условная схема реконструкции ПКС</title><rect width="420" height="300" rx="14" fill="{BG}"/>'+s+'</svg>')
Path('app/src/main/assets/menu-thumbs/acl-postop.svg').write_text((O/'normal.svg').read_text())
print('15 original postoperative ACL schemes')
