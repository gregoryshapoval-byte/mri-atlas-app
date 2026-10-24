"""Original schematic meniscus diagrams, no patient data or source illustrations."""
from pathlib import Path
import math
from html import escape
out=Path('app/src/main/assets/meniscus');out.mkdir(exist_ok=True)
ink='#d9edee';tissue='#b4c8c9';line='#ff8d7e';yellow='#f4cf76';bg='#111e29';blue='#61d8f0'
def path(d,fill='none',stroke=line,w=4):return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>'
def text(x,y,t,size=14,fill=ink):return f'<text x="{x}" y="{y}" fill="{fill}" font-size="{size}" font-family="sans-serif">{escape(t)}</text>'
def badge(x,y,n):return f'<circle cx="{x}" cy="{y}" r="11" fill="#142b36" stroke="{yellow}" stroke-width="1.5"/>'+text(x-4,y+5,str(n),14,yellow)
def pt(deg,rx=120,ry=95,cx=205,cy=160):return (cx+rx*math.cos(math.radians(deg)),cy-ry*math.sin(math.radians(deg)))
def coord(p):return f'{p[0]:.1f},{p[1]:.1f}'
def arc(start,end,rx,ry,cx=205,cy=160):return [pt(start+(end-start)*i/80,rx,ry,cx,cy) for i in range(81)]
def ribbon(rx=120,ry=95,ix=73,iy=60,cx=205,cy=160,start=50,end=310,fill=tissue):
 pts=arc(start,end,rx,ry,cx,cy)+list(reversed(arc(start,end,ix,iy,cx,cy)))
 return path('M'+' L'.join(map(coord,pts))+' Z',fill,'#77989d',1.5)
def curve(start,end,rx,ry,cx=205,cy=160,color=line,w=4):return path('M'+' L'.join(map(coord,arc(start,end,rx,ry,cx,cy))),'none',color,w)
def top():return ribbon()+text(150,42,'СПЕРЕДИ',12)+text(158,285,'СЗАДИ',12)+text(292,164,'центр',12,'#9bb4c6')
def wedge():return path('M85,95 Q100,86 118,107 L305,205 L85,230 Z',tissue,'#77989d',2)+text(62,260,'периферия',12)+text(277,233,'край',12)
fig={}
fig['signal']=wedge()+path('M120,163 L194,165','none',yellow)+path('M211,186 L254,172','none',line)+badge(141,144,1)+badge(264,164,2)+badge(336,255,3)
fig['horizontal']=wedge()+path('M89,165 L245,183 L303,205')+badge(148,129,1)+badge(208,171,2)+badge(132,208,3)
fig['long']=top()+curve(76,285,96,77)+badge(90,150,1)+badge(112,211,2)+badge(152,162,3)
p1,p2=pt(230,73,60),pt(230,120,95)
fig['radial']=top()+path('M'+coord(p1)+' L'+coord(p2),'none',bg,10)+path('M'+coord(p1)+' L'+coord(p2))+badge(165,195,1)+badge(133,222,2)+badge(103,247,3)
fig['flap']=top()+path('M140,191 L107,214 L151,235','none',bg,12)+path('M140,191 L107,214 L151,235')+path('M148,194 L198,226 L178,241 Z',line,line,2)+path('M168,208 L192,214','none',yellow,2)+badge(115,200,1)+badge(191,246,2)+badge(222,213,3)
fig['bucket']=ribbon(120,95,96,77)+ribbon(96,77,73,60,cx=248,fill=line)+path('M267,88 L303,101 M267,232 L303,219','none',line,4)+text(150,42,'СПЕРЕДИ',12)+text(158,285,'СЗАДИ',12)+badge(88,160,1)+badge(179,168,2)+badge(299,230,3)
fig['complex']='<g transform="translate(-15,5) scale(.8)">'+top()+path('M'+coord(p1)+' L'+coord(p2))+badge(133,222,2)+badge(95,145,3)+'</g><g transform="translate(230,160) scale(.48)">'+wedge()+path('M88,166 L303,205')+'</g>'+badge(322,228,1)+text(256,172,'сечение',12)
q1,q2=pt(296,73,60),pt(296,120,95)
fig['root']=top()+path('M'+coord(q1)+' L'+coord(q2),'none',bg,10)+path('M'+coord(q1)+' L'+coord(q2))+path('M270,221 L298,230','none',yellow,6)+path('M298,220 L318,220 L318,240 L298,240 Z','#78959a','#78959a',1)+badge(195,246,1)+badge(248,251,2)+badge(327,239,3)
# Coronal, compartment-agnostic section: exterior left, joint interior right.
plateau=path('M120,209 L365,209 L365,256 L120,256 Z','#576f7e','#8fa8b7',2)
fig['extrusion']=plateau+path('M120,225 L98,234 L120,242','#576f7e','#8fa8b7',2)+path('M70,120 L184,190 L70,190 Z',tissue,'#77989d',2)+path('M120,106 L120,260','none',yellow,2)+path('M70,106 L70,202','none',blue,2)+path('M70,102 L120,102 M70,96 L70,108 M120,96 L120,108','none',line,3)+text(215,143,'COR · тело',14)+text(192,243,'плато',14)+badge(133,189,1)+badge(57,151,2)+badge(95,80,3)
fig['ramp']=wedge().replace(text(62,260,'периферия',12),'')+path('M55,267 L340,267 L340,286 L55,286 Z','#576f7e','#8fa8b7',1)+path('M62,78 L62,219 Q65,246 118,249','none',yellow,6)+path('M70,124 L79,225','none',blue,7)+path('M88,232 L94,266','none',yellow,5)+path('M88,232 L91,246','none',line,5)+text(239,62,'SAG · сзади',14)+badge(173,178,1)+badge(46,154,2)+badge(110,252,3)
fig['variants']=wedge()+path('M232,82 Q204,141 179,218','none',yellow,16)+path('M219,95 Q197,142 175,198','none',bg,5)+badge(128,197,1)+badge(244,91,2)+badge(203,150,3)
fig['cyst']=wedge()+path('M85,166 L245,183 L303,205')+path('M85,166 L59,176','none',blue,5)+f'<ellipse cx="43" cy="173" rx="23" ry="34" fill="{blue}" opacity=".65"/>'+badge(173,161,1)+badge(63,208,2)+badge(38,126,3)
fig['discoid']=plateau+path('M119,115 Q120,105 147,115 L340,190 L119,190 Z',tissue,'#77989d',2)+path('M119,203 L340,203 M119,198 L119,208 M340,198 L340,208','none',line,3)+text(218,74,'COR · латеральный',13)+text(204,245,'плато',14)+badge(174,146,1)+badge(260,222,2)+badge(349,137,3)
fig['repair']=wedge()+path('M89,166 L245,183 L303,205','none',yellow,4)+path('M147,131 L147,204 M165,141 L165,207','none','#81b9e7',3)+badge(139,118,1)+badge(225,170,2)+badge(104,218,3)
fig['retear']=path('M85,95 L254,177 L230,210 L85,230 Z',tissue,'#77989d',2)+path('M85,166 L252,178','none',blue,5)+path('M273,197 L321,221 L276,234 Z',line,line,2)+badge(235,151,1)+badge(150,151,2)+badge(322,245,3)
for id,body in fig.items():
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="420" height="300" viewBox="0 0 420 300" role="img" aria-labelledby="title"><title id="title">{id}: условная схема мениска, номера соответствуют легенде</title><rect width="420" height="300" rx="14" fill="{bg}"/>{body}</svg>'
 (out/(id+'.svg')).write_text(svg)
print('Wrote',len(fig),'original schemes')
