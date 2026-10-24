"""Original teaching schematics; no patient image or segmentation."""
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]/'app/src/main/assets'
base='<path d="M208 32C151 9 72 51 67 126C57 195 104 258 177 258L210 247L242 258C316 258 361 194 352 126C347 51 268 9 213 32Z" fill="#29394b" stroke="#91a7bd" stroke-width="2"/><path d="M210 35V246" stroke="#71859a" stroke-width="1.5"/><path d="M176 119Q152 108 158 150L178 181L191 168L193 129Z M244 119Q268 108 262 150L242 181L229 168L227 129Z" fill="#10171f" stroke="#8ca9c1" stroke-width="2"/>'
tumor='M121 103L139 85L163 91L182 86L196 108L191 132L201 148L182 166L160 162L145 174L124 154L127 133L114 122Z'
core='M144 111L164 103L179 117L173 139L155 148L139 130Z'
halo='M104 84Q138 49 183 66L217 103L209 155L181 196L141 206L100 166L88 127Z'
def pointer(n,x,y,tx,ty,color):
 return f'<path d="M{x} {y}L{tx} {ty}" stroke="{color}" stroke-width="2" fill="none"/><circle cx="{x}" cy="{y}" r="13" fill="#10171f" stroke="{color}" stroke-width="2"/><text x="{x}" y="{y+5}" text-anchor="middle" fill="{color}" font-size="15" font-weight="700">{n}</text>'
def svg(title,body):
 return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 300" role="img" aria-label="{title}"><rect width="420" height="300" rx="18" fill="#101b29"/><g font-family="sans-serif">{base}<text x="30" y="35" fill="#c3d5e8" font-size="14">R</text><text x="380" y="35" fill="#c3d5e8" font-size="14">L</text>{body}<text x="210" y="286" text-anchor="middle" fill="#acbfd2" font-size="13">AX · условная схема</text></g></svg>'
figures={}
figures['layers']=svg('Ткань с усилением, неусиливающийся центр, зона FLAIR',f'<path d="{halo}" fill="#54e1c1" fill-opacity=".25" stroke="#54e1c1" stroke-width="2" stroke-dasharray="5 4"/><path d="{tumor}" fill="#eaa76b" stroke="#ffe1a7" stroke-width="3"/><path d="{core}" fill="#101b29" stroke="#c2cbd4"/>'+pointer(1,49,100,128,106,'#ffe1a7')+pointer(2,310,85,162,125,'#c2cbd4')+pointer(3,55,213,114,180,'#54e1c1'))
figures['spread']=svg('Узел, распространение через мозолистое тело, сателлитный узел','<path d="M112 107Q141 68 190 78Q214 65 241 83L280 95L294 126L272 155L239 141L216 118L185 125L156 169L128 161Z" fill="#54e1c1" fill-opacity=".25" stroke="#54e1c1" stroke-dasharray="5 4"/><path d="'+tumor+'" fill="#eaa76b" stroke="#ffe1a7" stroke-width="3"/><path d="'+core+'" fill="#101b29"/><path d="M184 103Q210 81 239 103" fill="none" stroke="#eaa76b" stroke-width="13"/><ellipse cx="276" cy="115" rx="13" ry="17" fill="#eaa76b" stroke="#ffe1a7" stroke-width="3"/>'+pointer(1,49,100,128,106,'#ffe1a7')+pointer(2,227,45,214,95,'#eaa76b')+pointer(3,346,150,279,120,'#54e1c1'))
figures['diffusion']=svg('ADC: солидная ткань темнее, некротический центр светлее; исключения возможны',f'<path d="{halo}" fill="#54e1c1" fill-opacity=".15"/><path d="{tumor}" fill="#182431" stroke="#f2b37f" stroke-width="3"/><path d="{core}" fill="#d0deeb" stroke="#f5f8fc"/>'+pointer(1,49,100,128,106,'#f2b37f')+pointer(2,310,85,162,125,'#d0deeb')+pointer(3,55,213,144,141,'#54e1c1')+'<text x="300" y="219" fill="#d0deeb" font-size="14">Схема ADC</text>')
figures['perfusion']=svg('Солидная ткань с повышенным rCBV и выбор области измерения',f'<path d="{halo}" fill="#54e1c1" fill-opacity=".22" stroke="#54e1c1" stroke-dasharray="5 4"/><path d="{tumor}" fill="#c16b45" stroke="#ffe1a7" stroke-width="3"/><path d="{core}" fill="#101b29"/><circle cx="184" cy="144" r="8" fill="none" stroke="#ffffff" stroke-width="2"/><circle cx="131" cy="121" r="5" fill="#110a13"/><path d="M115 90Q132 92 135 106" fill="none" stroke="#fb6676" stroke-width="4"/>'+pointer(1,314,179,184,144,'#ffffff')+pointer(2,49,100,131,121,'#f2b37f')+pointer(3,55,213,114,180,'#54e1c1'))
(root/'glioblastoma-figures.js').write_text('export const figures = '+json.dumps(figures,ensure_ascii=False,indent=2)+';\n')
(root/'menu-thumbs/brain-tumors.svg').parent.mkdir(parents=True,exist_ok=True)
(root/'menu-thumbs/brain-tumors.svg').write_text(figures['layers'])
if __name__=='__main__': print('Generated four original GBM teaching schemes and menu thumb.')

