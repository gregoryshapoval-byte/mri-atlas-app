"""Generate original conceptual diagrams for adult brain metastasis module."""
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]/'app/src/main/assets'
def mark(n,x,y,tx,ty,color):
 return f'<path d="M{x} {y}L{tx} {ty}" fill="none" stroke="{color}" stroke-width="2"/><circle cx="{x}" cy="{y}" r="13" fill="#101b29" stroke="{color}" stroke-width="2"/><text x="{x}" y="{y+5}" fill="{color}" text-anchor="middle" font-size="15" font-weight="700">{n}</text>'
def wrap(title,body,plane='AX'):
 return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 300" role="img" aria-label="{title}"><rect width="420" height="300" rx="18" fill="#101b29"/><g font-family="sans-serif">{body}<text x="210" y="285" text-anchor="middle" fill="#b4c6d8" font-size="13">{plane} · условная схема</text></g></svg>'
brain='<path d="M208 32C151 9 72 51 67 126C57 195 104 258 177 258L210 247L242 258C316 258 361 194 352 126C347 51 268 9 213 32Z" fill="#29394b" stroke="#91a7bd" stroke-width="2"/><path d="M210 35V246" stroke="#71859a" stroke-width="1.5"/><path d="M176 119Q152 108 158 150L178 181L191 168L193 129Z M244 119Q268 108 262 150L242 181L229 168L227 129Z" fill="#10171f" stroke="#8ca9c1" stroke-width="2"/><path d="M113 82Q87 140 127 209 M307 82Q333 140 293 209" fill="none" stroke="#74869b" stroke-width="13"/><text x="30" y="35" fill="#c3d5e8" font-size="14">R</text><text x="380" y="35" fill="#c3d5e8" font-size="14">L</text>'
halo='<path d="M96 91Q127 61 159 99L177 153L149 197L107 183L84 140Z" fill="#54e1c1" fill-opacity=".24" stroke="#54e1c1" stroke-width="2" stroke-dasharray="5 4"/>'
node='<ellipse cx="120" cy="128" rx="23" ry="29" fill="#eaa76b" stroke="#ffe1a7" stroke-width="3"/><ellipse cx="120" cy="128" rx="12" ry="17" fill="#101b29"/>'
figures={}
figures['single']=wrap('Одиночный метастатический узел у кортикомедуллярной границы с отёком',brain+halo+node+mark(1,41,90,106,105,'#ffe1a7')+mark(2,285,71,120,125,'#c2d1df')+mark(3,55,215,127,180,'#54e1c1'))
figures['multiple']=wrap('Несколько самостоятельных узлов с разной выраженностью отёка',brain+halo+node+'<ellipse cx="290" cy="170" rx="37" ry="43" fill="#54e1c1" fill-opacity=".24" stroke="#54e1c1" stroke-dasharray="5 4"/><ellipse cx="290" cy="170" rx="17" ry="21" fill="#eaa76b" stroke="#ffe1a7" stroke-width="3"/><circle cx="275" cy="78" r="5" fill="#ffe1a7"/>'+mark(1,41,90,106,105,'#ffe1a7')+mark(2,375,218,290,175,'#54e1c1')+mark(3,355,62,275,78,'#ffe1a7'))
figures['blood']=wrap('Узел с кровоизлиянием: кровь отдельно от контрастного усиления',brain+halo+node+'<path d="M114 111Q138 116 128 140L112 144L107 129Z" fill="#b55479" stroke="#f9a6c3" stroke-width="2"/>'+mark(1,41,90,106,105,'#ffe1a7')+mark(2,285,71,120,125,'#f9a6c3')+mark(3,55,215,127,180,'#54e1c1'))
# A cortical fragment with two deep sulci; dura remains smooth outside.
cortex='M47 178Q60 133 89 151Q104 160 103 196Q102 221 116 219Q131 219 130 190Q128 145 161 150Q189 150 189 191Q189 218 204 216Q219 215 220 180Q221 137 249 151Q270 162 280 149Q303 131 327 158Q350 178 373 169'
tissue=f'<path d="{cortex}L373 254H47Z" fill="#29394b" stroke="#91a7bd" stroke-width="2"/><path d="{cortex}" fill="none" stroke="#9cafc2" stroke-width="10"/><path d="M44 91Q210 28 376 91" fill="none" stroke="#7d8fa5" stroke-width="16"/><path d="M46 112Q210 50 374 112" fill="none" stroke="#adbad0" stroke-width="3"/>'
figures['lepto']=wrap('Лептоменингеальное усиление следует поверхности коры и в борозды',tissue+'<path d="M57 161Q73 133 92 155Q104 166 103 196Q102 221 116 219Q131 219 130 190Q128 145 161 150" fill="none" stroke="#ffbb75" stroke-width="5"/><ellipse cx="249" cy="145" rx="12" ry="10" fill="#ffbb75" stroke="#ffe1a7" stroke-width="2"/>'+mark(1,42,223,116,216,'#ffbb75')+mark(2,330,115,250,143,'#ffe1a7')+mark(3,212,100,200,146,'#54e1c1'),'Фрагмент коры')
figures['dural']=wrap('Дуральный узел под костью; усиление не следует в борозды',tissue+'<path d="M134 89Q178 65 221 82L213 100Q187 139 155 116Z" fill="#ffbb75" stroke="#ffe1a7" stroke-width="3"/><path d="M133 70Q176 57 218 66" fill="none" stroke="#f3b0bb" stroke-width="13"/>'+mark(1,326,36,184,64,'#f3b0bb')+mark(2,46,125,174,99,'#ffe1a7')+mark(3,325,224,248,164,'#9cafc2'),'Фрагмент коры')
(root/'brain-metastases-figures.js').write_text('export const figures = '+json.dumps(figures,ensure_ascii=False,indent=2)+';\n')
print('Generated 5 original metastasis schemes.')

