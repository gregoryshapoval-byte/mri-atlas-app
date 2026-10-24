from pathlib import Path
import json
r=Path(__file__).resolve().parents[1];a=r/'app/src/main/assets';out=a/'disc-nerve';out.mkdir(exist_ok=True)
palette={'bg':'#0d1822','bone':'#294657','edge':'#7796a6','disc':'#83c9c1','hernia':'#efab83','fat':'#e8ca83','root':'#a3dce9','csf':'#1d6575'}
def text(x,y,s,size=12,color='#a9c1ce',anchor='middle'):return f'<text x="{x}" y="{y}" text-anchor="{anchor}" fill="{color}" font-family="sans-serif" font-size="{size}">{s}</text>'
def marker(n,x,y):return f'<circle cx="{x}" cy="{y}" r="11" fill="#12242e" stroke="#7dd9c6" stroke-width="1.5"/>'+text(x,y+4,str(n),12,'#b7f4e5')
def ellipse(x,y,rx,ry,fill,stroke='#7796a6',sw=2):return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def rect(x,y,w,h,fill,rx=8):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="#7796a6" stroke-width="2"/>'
def wrap(id,body):
 title=id;return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 300" role="img" aria-label="Условная учебная схема {title}"><rect width="420" height="300" rx="16" fill="#0d1822"/>{body}</svg>'
def sag(id):
 s=text(210,24,'SAG · КРАНИАЛЬНО ↑')+text(45,288,'СПЕРЕДИ',11,anchor='start')+text(375,288,'СЗАДИ',11,anchor='end')
 s+=rect(65,40,165,62,'#294657')+rect(65,178,165,74,'#294657')+rect(65,106,165,68,'#83c9c1',4)
 s+='<path d="M230 35V260" stroke="#7692a0" stroke-dasharray="5 5" fill="none"/>'
 if id=='protrusion':
  s+='<path d="M230 106Q250 112 272 124Q286 140 272 156Q250 168 230 174Z" fill="#efab83" stroke="#efc19f" stroke-width="2"/>'
  s+='<path d="M208 106V174M202 106H214M202 174H214M300 124V156M294 124H306M294 156H306" stroke="#e8ca83" fill="none" stroke-width="2"/>'
  s+=text(192,144,'B',15,'#e8ca83')+text(315,144,'D',15,'#e8ca83')+marker(1,208,196)+marker(2,300,96)+marker(3,345,222)
 elif id=='extrusion':
  s+='<path d="M230 126C245 126 242 89 270 89C301 89 311 112 307 140C311 172 296 191 270 191C243 191 245 154 230 154Z" fill="#efab83" stroke="#efc19f" stroke-width="2"/>'
  s+='<path d="M210 126V154M204 126H216M204 154H216M330 89V191M324 89H336M324 191H336" stroke="#e8ca83" fill="none" stroke-width="2"/>'
  s+=text(193,145,'B',15,'#e8ca83')+text(346,145,'D',15,'#e8ca83')+marker(1,210,179)+marker(2,330,65)+marker(3,246,140)
 elif id=='migration':
  s+='<path d="M230 126C265 124 262 165 264 181C298 174 310 201 299 225C289 247 257 244 249 222C241 199 249 176 247 161C245 150 238 151 230 154Z" fill="#efab83" stroke="#efc19f" stroke-width="2"/>'
  s+='<path d="M339 135V223L331 212M339 223L347 212" fill="none" stroke="#7dd9c6" stroke-width="3"/>'
  s+=marker(1,230,139)+marker(2,278,211)+marker(3,363,191)
 else:
  s+=ellipse(277,215,26,31,'#efab83','#efc19f')+marker(1,147,140)+marker(2,277,215)+marker(3,267,164)
 return wrap(id,s)
figs={}
figs['bulge']=wrap('bulge',text(210,24,'AX · ПЕРЕДНЯЯ СТОРОНА')+ellipse(210,145,131,82,'#efab83','#efc19f')+ellipse(210,145,108,68,'#83c9c1','#83c9c1')+'<ellipse cx="210" cy="145" rx="114" ry="72" fill="none" stroke="#18343d" stroke-dasharray="5 4" stroke-width="2"/>'+marker(1,210,73)+marker(2,333,145)+marker(3,210,246)+text(210,279,'Распространённый контур >25%',14))
for id in ['protrusion','extrusion','migration','sequestration']:figs[id]=sag(id)
def axial(id):
 s=text(210,22,'AX · ПЕРЕДНЯЯ СТОРОНА')+text(25,49,'R',15,'#7dd9c6')+text(395,49,'L',15,'#7dd9c6')+text(210,286,'ЗАДНЯЯ СТОРОНА',11)
 s+=ellipse(210,163,167,104,'#192f3d','#4d6a7d')+ellipse(210,87,120,57,'#294657')
 s+=rect(57,110,36,50,'#294657')+rect(327,110,36,50,'#294657')
 s+=ellipse(210,120,117,28,'#83c9c1','#83c9c1')+ellipse(210,197,67,40,'#1d6575','#79a7b4')
 s+=ellipse(111,225,34,25,'#294657')+ellipse(309,225,34,25,'#294657')
 s+='<path d="M91 208Q117 188 149 208L153 222H110Z M329 208Q303 188 271 208L267 222H310Z" fill="#365469" stroke="#7796a6" stroke-width="2"/>'
 for x in [84,336]:s+=ellipse(x,180,20,17,'#e8ca83','#e8ca83')+ellipse(x,180,9,7,'#a3dce9','#72a9bc')
 s+=ellipse(277,181,8,8,'#a3dce9','#72a9bc')
 if id=='zones':
  s+=ellipse(143,181,8,8,'#a3dce9','#72a9bc')+'<path d="M126 158Q144 152 160 168V201Q135 211 119 197Z" fill="none" stroke="#efab83" stroke-width="2"/>'
  s+=marker(1,210,197)+marker(2,143,181)+marker(3,84,180)
 else:
  end={'root0':156,'root1':173,'root2':190,'root3':198}[id]
  s+=f'<path d="M119 140Q143 132 167 142Q170 {end-8} 144 {end}Q119 {end-5} 119 140Z" fill="#efab83" stroke="#efc19f" stroke-width="2"/>'
  cy={'root0':181,'root1':181,'root2':198,'root3':202}[id];ry=3 if id=='root3' else 8;rx=12 if id=='root3' else 8
  if id=='root2':s+='<circle cx="144" cy="181" r="8" fill="none" stroke="#e8ca83" stroke-dasharray="3 2"/>'
  s+=ellipse(144,cy,rx,ry,'#a3dce9','#a3dce9',1)
  # Number markers and leaders remain outside the small target region.
  y2=168 if id=='root0' else 181 if id=='root2' else cy
  y3=181 if id=='root0' else cy if id=='root2' else 214
  x3=144 if id in ['root0','root2'] else 130
  s+=f'<path d="M36 125L120 145M36 190L132 {y2}M62 245L{x3} {y3}" stroke="#7dd9c6" fill="none"/>'
  s+=marker(1,26,119)+marker(2,26,190)+marker(3,53,252)
 return wrap(id,s)
for id in ['zones','root0','root1','root2','root3']:figs[id]=axial(id)
def foram(id):
 s=text(210,23,'ПАРАСАГИТТАЛЬНО · КРАНИАЛЬНО ↑',11)+text(30,284,'СПЕРЕДИ',11,anchor='start')+text(385,284,'СЗАДИ',11,anchor='end')
 s+=rect(40,40,110,77,'#294657')+rect(40,187,110,75,'#294657')+rect(40,122,110,58,'#83c9c1',3)
 s+='<path d="M150 50H270Q285 67 270 82H150Z M150 224H270Q285 241 270 256H150Z" fill="#294657" stroke="#7796a6" stroke-width="2"/>'
 s+=rect(290,106,48,109,'#294657',12)
 s+=ellipse(215,153,73,69,'#38515d','#7796a6')
 if id in ['foramen','lee0']:s+=ellipse(215,153,58,58,'#e8ca83','#e8ca83')+ellipse(215,153,14,12,'#a3dce9','#2c5b70')
 if id=='lee1':s+=ellipse(215,153,14,58,'#e8ca83','#e8ca83')+ellipse(215,153,14,12,'#a3dce9','#2c5b70')
 if id=='lee2':s+=ellipse(215,153,14,12,'#a3dce9','#2c5b70')
 if id=='lee3':s+=ellipse(215,153,35,16,'#e8ca83','#e8ca83')+ellipse(215,153,25,4,'#a3dce9','#2c5b70')
 if id=='foramen':s+=marker(1,220,65)+marker(2,215,153)+marker(3,315,158)
 else:
  if id=='lee1':end1=(231,153);end2=(215,111);end3=(215,153)
  elif id=='lee3':end1=(277,153);end2=(215,153);end3=(243,153)
  else:end1=(234,143);end2=(234,154);end3=(218,164)
  s+=f'<path d="M353 90L{end1[0]} {end1[1]}M353 154L{end2[0]} {end2[1]}M353 218L{end3[0]} {end3[1]}" stroke="#7dd9c6" fill="none"/>'
  s+=marker(1,364,85)+marker(2,364,154)+marker(3,364,223)
 return wrap(id,s)
for id in ['foramen','lee0','lee1','lee2','lee3']:figs[id]=foram(id)
for id,s in figs.items():(out/(id+'.svg')).write_text(s)
(a/'menu-thumbs/disc-nerve.svg').write_text(figs['zones'])
