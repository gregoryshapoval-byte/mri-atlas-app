from pathlib import Path
import json,math
from shapely.geometry import Polygon,box
from shapely.ops import unary_union
from shapely.affinity import scale
OUT=Path(__file__).resolve().parents[1]/'app/src/main/assets/castellvi';OUT.mkdir(parents=True,exist_ok=True)
sacrum=Polygon([(300,258),(265,249),(232,262),(198,264),(170,258),(150,254),(105,254),(86,269),(87,287),(111,316),(141,344),(165,381),(205,428),(245,468),(273,487),(300,495),(327,487),(355,468),(395,428),(435,381),(459,344),(489,316),(513,287),(514,269),(495,254),(450,254),(430,258),(402,264),(368,262),(335,249)])
shapes={
'normal':[(233,176),(205,163),(172,153),(139,153),(124,161),(145,176),(181,189),(224,203)],
'large':[(230,176),(203,152),(163,137),(122,131),(100,138),(88,156),(94,186),(117,211),(153,219),(196,210),(230,204)],
'joint':[(230,177),(201,153),(163,146),(128,150),(105,169),(97,197),(97,226),(101,246),(154,246),(177,221),(200,215),(230,209)],
'fusion':[(230,177),(201,153),(163,146),(128,150),(105,169),(97,197),(93,228),(94,276),(145,289),(164,259),(177,221),(200,215),(230,209)]}
polys={k:Polygon(v) for k,v in shapes.items()}
def mirror(p):return scale(p,xfact=-1,yfact=1,origin=(300,0))
def path(poly):
 parts=[]
 for p in getattr(poly,'geoms',[poly]):
  coords=list(p.exterior.coords);parts.append('M'+' L'.join(f'{x:.2f},{y:.2f}' for x,y in coords)+' Z')
  for hole in p.interiors:parts.append('M'+' L'.join(f'{x:.2f},{y:.2f}' for x,y in hole.coords)+' Z')
 return ' '.join(parts)
def smooth(p):return p.buffer(4,resolution=5).buffer(-4,resolution=5)
def make(code,left,right):
 P=polys[left];R=mirror(polys[right]);s=smooth(sacrum)
 arch=box(214,180,386,211)
 vertebra=unary_union([smooth(P),smooth(R),arch])
 fused=left=='fusion' or right=='fusion'
 merged=unary_union([s,vertebra]) if fused else None
 bonepath=path(merged) if fused else path(s)
 defs='''<defs><linearGradient id="bone" x1="0" y1="0" x2=".85" y2="1"><stop stop-color="#f2e4c9"/><stop offset=".38" stop-color="#cdbf9f"/><stop offset=".68" stop-color="#a6977c"/><stop offset="1" stop-color="#d3c4a6"/></linearGradient><linearGradient id="body" x1="0" y1="0" x2=".2" y2="1"><stop stop-color="#eee4cd"/><stop offset=".45" stop-color="#cabb9b"/><stop offset="1" stop-color="#f1dfbb"/></linearGradient><radialGradient id="hole"><stop stop-color="#18242d"/><stop offset=".7" stop-color="#394346"/><stop offset="1" stop-color="#827e6b"/></radialGradient><pattern id="grain" width="16" height="15" patternUnits="userSpaceOnUse"><path d="M2 2l5 3m3 6l4-2M3 13l2-4" stroke="#685d4c" stroke-width=".55" opacity=".3"/></pattern><filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#000" flood-opacity=".45"/></filter></defs>'''
 title={'Ia':'Iа — одностороннее увеличение','Ib':'Ib — двустороннее увеличение','IIa':'IIa — односторонний псевдосустав','IIb':'IIb — двусторонние псевдосуставы','IIIa':'IIIa — одностороннее сращение','IIIb':'IIIb — двустороннее сращение','IV':'IV — псевдосустав и сращение'}[code]
 svg=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 520" role="img" aria-label="Castellvi {title}"><title>Castellvi {title}</title>',defs,'<rect width="600" height="520" rx="24" fill="#121e27"/>']
 # Anterior sacral surface and posterior arch/transverse processes.
 svg.append(f'<path d="{bonepath}" fill="url(#bone)" stroke="#eadbc0" stroke-width="2.8" stroke-linejoin="round" fill-rule="evenodd" filter="url(#shadow)"/>')
 if not fused:svg.append(f'<path d="{path(vertebra)}" fill="url(#bone)" stroke="#eadbc0" stroke-width="2.8" stroke-linejoin="round"/>')
 # Fine cancellous texture stays within the same bone silhouette.
 svg.append(f'<path d="{path(unary_union([s,vertebra]))}" fill="url(#grain)" fill-rule="evenodd"/>')
 for side,kind,p in [('left',left,P),('right',right,R)]:
  if kind!='normal':
   svg.append(f'<path d="{path(smooth(p))}" fill="#e9b65c" opacity=".13"/>')
  if kind=='joint':
   transform='' if side=='left' else ' transform="translate(600 0) scale(-1 1)"'
   svg.append(f'<g{transform} data-joint="{side}"><path d="M101 246H152M105 254H151" stroke="#fff1d2" stroke-width="2.5"/><path d="M106 250H150" stroke="#6de1da" stroke-width="3.5" stroke-linecap="round"/></g>')
  if kind=='fusion':
   transform='' if side=='left' else ' transform="translate(600 0) scale(-1 1)"'
   svg.append(f'<g{transform} data-fusion="{side}"><path d="M116 218Q112 251 132 279" stroke="#f1c46d" stroke-width="5" opacity=".65" fill="none" stroke-linecap="round"/></g>')
 # Slightly visible S1 endplate, transverse ridges and four paired anterior foramina.
 svg.append('<path d="M241 271Q300 250 359 271M228 300Q300 315 372 300M228 345Q300 357 372 345M242 389Q300 398 358 389M261 432Q300 438 339 432" fill="none" stroke="#6b685b" stroke-width="2.3" opacity=".7"/>')
 for x,y,rx,ry in [(211,307,18,12),(217,352,16,11),(237,395,13,10),(261,435,10,8)]:
  for xx in [x,600-x]:svg.append(f'<ellipse cx="{xx}" cy="{y}" rx="{rx}" ry="{ry}" fill="url(#hole)" transform="rotate({-15 if xx<300 else 15} {xx} {y})"/><path d="M{xx-rx+3} {y-ry}Q{xx} {y-ry-5} {xx+rx-3} {y-ry}" fill="none" stroke="#efdfc1" stroke-width="1.7" opacity=".7"/>')
 # Adjacent vertebral body and last lumbar body; no numeric level is assumed.
 svg.append('<path d="M235 55Q300 44 365 55L375 64L372 119Q300 135 228 119L225 64Z" fill="url(#body)" stroke="#e9dcc3" stroke-width="2.5" opacity=".7"/><path d="M239 132Q300 144 361 132L365 143Q300 154 235 143Z" fill="#4e727a" stroke="#89a4a3" stroke-width="1.3" opacity=".8"/>')
 body='M234 155Q300 145 366 155Q382 160 383 177L380 222Q375 235 364 239Q300 249 236 239Q220 235 217 222L215 177Q216 161 234 155Z'
 svg.append(f'<path d="{body}" fill="url(#body)" stroke="#f0dfc0" stroke-width="3" filter="url(#shadow)"/><path d="{body}" fill="url(#grain)"/>')
 svg.append('<path d="M237 163Q300 155 363 163M235 231Q300 241 365 231" fill="none" stroke="#8a7b62" stroke-width="2" opacity=".75"/><path d="M235 248Q300 256 365 248L364 258Q300 252 236 258Z" fill="#4e727a" stroke="#86a6a8" stroke-width="1.1"/>')
 # The 19-mm criterion is explicitly craniocaudal, not the lateral process length.
 if code in ['Ia','Ib']:
  svg.append('<g data-height="craniocaudal" stroke="#edbd68" fill="none" stroke-width="2"><path d="M65 136V215M59 136H86M59 215H104M61 144L65 136L69 144M61 207L65 215L69 207"/></g><text x="30" y="177" fill="#f1c77f" font-family="system-ui,sans-serif" font-size="19" text-anchor="middle" transform="rotate(-90 30 177)">≥19 мм</text>')
 # Small direct labels only for mixed type; subtype badges live outside the figure.
 if code=='IV':svg.append('<text x="73" y="340" fill="#73dfda" font-family="system-ui,sans-serif" font-size="27" font-weight="700" text-anchor="middle">II</text><path d="M74 317L120 260" stroke="#73dfda" stroke-width="1.5" fill="none"/><text x="527" y="340" fill="#efc373" font-family="system-ui,sans-serif" font-size="27" font-weight="700" text-anchor="middle">III</text><path d="M526 317L476 256" stroke="#efc373" stroke-width="1.5" fill="none"/>')
 svg.append('</svg>')
 (OUT/(code+'.svg')).write_text(''.join(svg))
 return {'code':code,'left':left,'right':right,'separate_bones':len(getattr(unary_union([s,vertebra]),'geoms',[unary_union([s,vertebra])])),'joint_count':int(left=='joint')+int(right=='joint'),'fusion_count':int(left=='fusion')+int(right=='fusion')}
models=[('Ia','large','normal'),('Ib','large','large'),('IIa','joint','normal'),('IIb','joint','joint'),('IIIa','fusion','normal'),('IIIb','fusion','fusion'),('IV','joint','fusion')]
assert polys['normal'].intersection(sacrum).area==0
assert polys['large'].intersection(sacrum).area==0
assert 0<polys['joint'].distance(sacrum)<12
assert polys['fusion'].intersection(sacrum).area>0
meta=[make(*model) for model in models]
(Path(__file__).resolve().parents[1]/'review/castellvi-geometry182.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2))
print(json.dumps(meta))
