"""Original PI-RADS v2.1 sector schematics. Reference: ACR Appendix II, p31.

The coordinates are an authored educational model, not patient segmentation.
Topology: base14 (including CZ R/L), mid12, apex12, plus SV R/L and US.
"""
import json
from pathlib import Path

A = Path('app/src/main/assets')
LEVELS = {'base': ('B', 'основание'), 'mid': ('M', 'средняя треть'), 'apex': ('X', 'верхушка')}
PARTS = {
 'PZa': ('передний сектор периферической зоны', '#72b5db', 'Передний рог PZ, латеральнее TZ; не передний сектор TZ.'),
 'PZpl': ('заднелатеральный сектор периферической зоны', '#4f95bc', 'Задняя наружная часть PZ, ближе к боковому контуру железы.'),
 'PZpm': ('заднемедиальный сектор периферической зоны', '#367ba6', 'Задняя внутренняя часть PZ, ближе к срединной линии.'),
 'TZa': ('передний сектор переходной зоны', '#deb464', 'Часть TZ спереди от линии деления на переднюю и заднюю половины.'),
 'TZp': ('задний сектор переходной зоны', '#b58d48', 'Часть TZ сзади от линии деления. Снаружи от неё лежит PZ.'),
 'CZ': ('центральная зона', '#7fa47c', 'Окружает семявыбрасывающие протоки. Парные сектора CZ на карте выделены у основания.'),
 'AFS': ('передняя фибромускулярная строма', '#7d919e', 'Передняя нежелезистая ткань. Сектора AFS разделены на правый и левый на каждом уровне.'),
 'SV': ('семенной пузырёк', '#937db5', 'Парный регион над основанием простаты, позади мочевого пузыря.'),
 'US': ('наружный уретральный сфинктер / мембранозная уретра', '#baa878', 'Непарный регион ниже верхушки простаты.'),
}
COUNTOURS = {
 'base': 'M280 68 C168 58 84 102 60 205 C30 295 75 365 160 382 Q280 407 400 382 C485 365 530 295 500 205 C476 102 392 58 280 68Z',
 'mid': 'M280 65 C170 58 83 99 56 200 C29 295 62 365 139 393 Q280 433 421 393 C498 365 531 295 504 200 C477 99 390 58 280 65Z',
 'apex': 'M280 68 C215 56 155 85 130 155 C106 220 85 265 85 295 Q84 375 145 395 Q220 410 280 390 Q340 410 415 395 Q476 375 475 295 C475 265 454 220 430 155 C405 85 345 56 280 68Z',
}
TZ = {
 'base': 'M280 225 C268 191 281 133 246 112 C207 83 162 107 148 152 C134 195 148 239 160 275 Q217 287 280 274Z',
 'mid': 'M280 225 C273 196 280 132 248 111 C203 80 157 116 148 174 C139 218 145 265 168 294 C202 323 250 296 280 252Z',
 'apex': 'M278 225 C268 193 272 148 247 140 C215 131 194 163 193 207 Q185 258 213 283 Q244 305 278 260Z',
}
PZ = {'PZa': 'M0 0H280V240H0Z', 'PZpl': 'M0 240H145L183 480H0Z', 'PZpm': 'M145 240H280V480H183Z'}
AFS = 'M110 145 L100 0H460L450 145 C414 116 392 106 350 109 C315 105 286 152 280 225 C274 152 245 105 210 109 C168 106 145 116 110 145Z'
LABELS = {
 'base': {'PZa': (88, 204), 'PZpl': (110, 315), 'PZpm': (171, 429), 'TZa': (214, 183), 'TZp': (212, 258), 'CZ': (236, 330), 'AFS': (241, 98)},
 'mid': {'PZa': (88, 205), 'PZpl': (110, 319), 'PZpm': (224, 371), 'TZa': (211, 179), 'TZp': (207, 275), 'AFS': (241, 95)},
 'apex': {'PZa': (152, 174), 'PZpl': (132, 319), 'PZpm': (227, 362), 'TZa': (239, 198), 'TZp': (238, 264), 'AFS': (249, 113)},
}

def text(x, y, s, size=25, extra=''):
 return f'<text x="{x}" y="{y}" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="{size}" fill="#f2f6fa" {extra}>{s}</text>'

def sector(id, code, shape, label, transform='', clip='', leader=''):
 color=PARTS[code][1]
 x,y=label
 # Transform only the region path, leaving upright labels and leader coordinates.
 return f'<g class="sector" data-sector="{id}" role="button" tabindex="0" aria-label="{id}"><path d="{shape}" fill="{color}" stroke="#172d3d" stroke-width="1.5" {transform} {clip}/>{leader}{text(x,y,code,21 if code=="AFS" else 25)}</g>'

def axial(level):
 prefix='s186'+level
 defs=f'<defs><clipPath id="{prefix}outer"><path d="{COUNTOURS[level]}"/></clipPath><clipPath id="{prefix}right"><path d="M0 0H280V480H0Z"/></clipPath><clipPath id="{prefix}left"><path d="M280 0H560V480H280Z"/></clipPath><clipPath id="{prefix}front"><path d="M0 0H560V240H0Z"/></clipPath><clipPath id="{prefix}back"><path d="M0 240H560V480H0Z"/></clipPath></defs>'
 body=[]
 ids=[]
 for side in ('R','L'):
  mirror=side=='L'
  transform='transform="translate(560 0) scale(-1 1)"' if mirror else ''
  level_code=side+LEVELS[level][0]
  for code in ('PZa','PZpl','PZpm'):
   id=level_code+'-'+code; ids.append(id)
   x,y=LABELS[level][code];x=560-x if mirror else x
   leader=''
   if level=='base' and code=='PZpm':
    # A narrow posteromedial rim flanking CZ: use an external label.
    ax=367 if mirror else 193
    leader=f'<path d="M{x} 412L{ax} 381" fill="none" stroke="#b2cddd" stroke-width="1.5"/>'
   # Clip the path only, so the external base labels are not clipped away.
   shape=f'<g clip-path="url(#{prefix}outer)"><path d="{PZ[code]}" {transform} fill="{PARTS[code][1]}" stroke="#172d3d" stroke-width="1.5"/></g>'
   body.append(f'<g class="sector" data-sector="{id}" role="button" tabindex="0" aria-label="{id}">{shape}{leader}{text(x,y,code)}</g>')
 # AFS occupies the anterior crescent and periurethral central notch.
 for side in ('R','L'):
  id=side+LEVELS[level][0]+'-AFS';ids.append(id)
  x,y=LABELS[level]['AFS'];x=560-x if side=='L' else x
  half='right' if side=='R' else 'left'
  body.append(f'<g clip-path="url(#{prefix}outer)">'+sector(id,'AFS',AFS,(x,y),clip=f'clip-path="url(#{prefix}{half})"')+'</g>')
 for side in ('R','L'):
  transform='transform="translate(560 0) scale(-1 1)"' if side=='L' else ''
  for code,half in [('TZa','front'),('TZp','back')]:
   id=side+LEVELS[level][0]+'-'+code;ids.append(id)
   x,y=LABELS[level][code];x=560-x if side=='L' else x
   # Clip in page coordinates after reflection; y boundaries remain the same.
   body.append(f'<g clip-path="url(#{prefix}{half})">'+sector(id,code,TZ[level],(x,y),transform)+'</g>')
 if level=='base':
  for side in ('R','L'):
   id=side+'B-CZ';ids.append(id)
   transform='transform="translate(560 0) scale(-1 1)"' if side=='L' else ''
   x,y=LABELS[level]['CZ'];x=560-x if side=='L' else x
   body.append(sector(id,'CZ','M160 275 Q217 287 280 274 L280 394 C235 391 202 368 181 329Z',(x,y),transform))
 # Central urethral lumen, ejaculatory ducts, and anatomic reference axes.
 if level=='base':
  body.append('<path d="M280 119 C288 141 286 193 280 225 C274 193 272 141 280 119Z" fill="#dce6ec" stroke="#b4c2cc"/>')
  body.append('<ellipse cx="266" cy="312" rx="3" ry="6" fill="#e2eedb"/><ellipse cx="294" cy="312" rx="3" ry="6" fill="#e2eedb"/>')
 else:
  uy=239 if level=='mid' else 281
  body.append(f'<ellipse cx="280" cy="{uy}" rx="5" ry="10" fill="#dce6ec" stroke="#b4c2cc"/>')
 body.append(f'<path d="{COUNTOURS[level]}" fill="none" stroke="#c7d5df" stroke-width="2.3"/>')
 body.append(f'<g clip-path="url(#{prefix}outer)" stroke="#173342" stroke-width="2" stroke-dasharray="7 5" fill="none" pointer-events="none"><path d="M280 55V440M20 240H540M145 240L183 480M415 240L377 480"/></g>')
 body.append(text(27,245,'R',28)+text(533,245,'L',28)+text(280,28,'A · спереди',19)+text(280,463,'P · сзади',19))
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 485" aria-label="'+LEVELS[level][1]+' · сектора PI-RADS">'+defs+'<rect width="560" height="485" rx="18" fill="#101c28"/>'+''.join(body)+'</svg>',ids

def extras():
 b='<rect width="560" height="485" rx="18" fill="#101c28"/>'
 sv='M82 119 C54 93 86 56 113 64 C122 32 166 41 179 64 C215 55 228 84 210 103 C220 131 190 151 165 143 C143 171 110 158 113 144 C88 151 70 137 82 119Z'
 b+=sector('R-SV','SV',sv,(145,105))
 b+=sector('L-SV','SV',sv,(415,105),'transform="translate(560 0) scale(-1 1)"')
 b+=text(145,194,'R · справа',20)+text(415,194,'L · слева',20)+text(280,235,'Семенные пузырьки · над основанием',19)
 b+='<path d="M203 290Q280 268 357 290L330 323Q280 344 230 323Z" fill="#2e4555" stroke="#b7c7d3"/>'+text(280,303,'Верхушка',18)
 b+='<path d="M280 330V434" stroke="#d5c59b" stroke-width="11"/>'
 b+='<g class="sector" data-sector="US" tabindex="0" role="button" aria-label="US"><ellipse cx="280" cy="389" rx="48" ry="43" fill="#baa878" stroke="#e4d9b9" stroke-width="2"/><ellipse cx="280" cy="389" rx="16" ry="23" fill="#101c28"/>'+text(365,390,'US',25)+'</g>'+text(280,464,'Мембранозная уретра / наружный сфинктер',18)
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 485" aria-label="SV и US · дополнительные регионы">'+b+'</svg>'

def main():
 figures={};sectors=[]
 for level,(letter,name) in LEVELS.items():
  svg,ids=axial(level);figures[level]=svg
  for id in ids:
   side=id[0];code=id.split('-')[1]
   title,color,tip=PARTS[code]
   side_name='справа' if side=='R' else 'слева'
   sectors.append(dict(id=id,level=level,side=side,code=code,name=title,color=color,tip=tip,location=f'{id} — {side_name}, {name}, {title}'))
 figures['extra']=extras()
 for side in ('R','L'):
  sectors.append(dict(id=side+'-SV',level='extra',side=side,code='SV',name=PARTS['SV'][0],color=PARTS['SV'][1],tip=PARTS['SV'][2],location=('R-SV — правый' if side=='R' else 'L-SV — левый')+' семенной пузырёк'))
 sectors.append(dict(id='US',level='extra',side='',code='US',name=PARTS['US'][0],color=PARTS['US'][1],tip=PARTS['US'][2],location='US — мембранозная уретра / наружный уретральный сфинктер'))
 result=dict(version='PI-RADS v2.1',levels={**{k:v[1] for k,v in LEVELS.items()},'extra':'SV / US'},sectors=sectors,figures=figures,legend=[dict(code=c,name=v[0]) for c,v in PARTS.items()])
 (A/'prostate-sectors186.js').write_text('globalThis.ProstateSectors186='+json.dumps(result,ensure_ascii=False,separators=(',',':'))+';\n')
 (A/'menu-thumbs/prostate-cancer.svg').write_text(figures['mid'])
 Path('review/prostate186').mkdir(parents=True,exist_ok=True)
 for level,svg in figures.items():Path('review/prostate186',level+'.svg').write_text(svg)
 print('Wrote',len(sectors),'regions; level counts:',{l:sum(x['level']==l for x in sectors) for l in figures})

if __name__=='__main__':main()
