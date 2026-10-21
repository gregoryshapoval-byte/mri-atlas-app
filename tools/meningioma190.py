"""Original conceptual meningioma diagrams, not patient images."""
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]/'app/src/main/assets'
def mark(n,x,y,tx,ty,color):
 return f'<path d="M{x} {y}L{tx} {ty}" fill="none" stroke="{color}" stroke-width="2"/><circle cx="{x}" cy="{y}" r="13" fill="#101b29" stroke="{color}" stroke-width="2"/><text x="{x}" y="{y+5}" fill="{color}" text-anchor="middle" font-size="15" font-weight="700">{n}</text>'
def svg(title,body,note='Фрагмент · условная схема'):
 return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 300" role="img" aria-label="{title}"><rect width="420" height="300" rx="18" fill="#101b29"/><g font-family="sans-serif">{body}<text x="210" y="285" fill="#b4c6d8" text-anchor="middle" font-size="13">{note}</text></g></svg>'
skull='<path d="M44 74Q210 18 376 74" fill="none" stroke="#7d8fa5" stroke-width="15"/><path d="M45 92Q210 37 375 92" fill="none" stroke="#adbad0" stroke-width="3"/>'
cortex='M47 190Q64 146 90 168Q111 187 111 216Q111 235 126 231Q139 229 140 207Q147 171 178 186Q206 201 222 178Q241 152 266 176Q287 197 300 171Q328 143 373 184'
tissue=f'<path d="{cortex}L373 258H47Z" fill="#29394b" stroke="#91a7bd" stroke-width="2"/><path d="{cortex}" fill="none" stroke="#9cafc2" stroke-width="9"/>'
mass='<path d="M119 75Q173 51 224 67Q220 133 181 149Q140 155 119 75Z" fill="#eaa76b" stroke="#ffe1a7" stroke-width="3"/>'
figures={}
figures['extra']=svg('Дуральное основание, ликворная щель и оттеснённая кора',skull+tissue+mass+'<path d="M113 81L87 90 M224 72L250 79" stroke="#eaa76b" stroke-width="4"/><path d="M121 127Q173 177 218 126" fill="none" stroke="#54e1c1" stroke-width="4"/>'+mark(1,300,53,183,68,'#ffe1a7')+mark(2,43,139,169,158,'#54e1c1')+mark(3,319,232,243,173,'#9cafc2'))
figures['bone']=svg('Гиперостоз над протяжённым дуральным компонентом',skull+tissue+'<path d="M113 55Q173 27 239 43L237 65Q174 51 117 78Z" fill="#a9b9ca" stroke="#d1ddeb" stroke-width="2"/><path d="M116 76Q174 52 238 68L239 88Q174 72 119 96Z" fill="#eaa76b" stroke="#ffe1a7" stroke-width="3"/>'+mark(1,316,42,178,45,'#d1ddeb')+mark(2,43,116,170,79,'#ffe1a7')+mark(3,320,130,237,55,'#9cafc2'))
figures['interface']=svg('Нечёткий интерфейс и отёк не равны доказанной инвазии мозга',skull+tissue+'<path d="M131 170Q169 145 209 172L244 217L214 252L164 241L131 211Z" fill="#54e1c1" fill-opacity=".23" stroke="#54e1c1" stroke-dasharray="5 4"/>'+mass+'<path d="M136 143L152 164L166 155L179 172L196 152L212 159" fill="none" stroke="#f3b0bb" stroke-width="5"/>'+mark(1,300,53,183,95,'#ffe1a7')+mark(2,43,139,164,157,'#f3b0bb')+mark(3,320,232,206,218,'#54e1c1'))
panels=''
for i,label in enumerate(['Контакт','Сдавление','Ткань в просвете']):
 x=20+i*135
 panels+=f'<g transform="translate({x} 50)"><rect width="110" height="199" rx="12" fill="#192431" stroke="#304357"/><path d="M8 25H102" stroke="#889bb0" stroke-width="9"/><path d="M12 45H98" stroke="#bbc8d7" stroke-width="3"/><path d="M30 57H84L58 131Z" fill="#357eb0" stroke="#92caec" stroke-width="2"/>'
 if i==0: panels+='<path d="M6 73Q24 63 31 70L34 90Q22 112 6 109Z" fill="#eaa76b" stroke="#ffe1a7" stroke-width="2"/>'
 if i==1: panels+='<path d="M6 64Q38 55 55 76Q69 89 51 110L39 130Q15 126 6 110Z" fill="#eaa76b" stroke="#ffe1a7" stroke-width="2"/>'
 if i==2: panels+='<path d="M6 65Q31 54 48 69L66 79L65 104L50 113L38 98Q23 117 6 109Z" fill="#eaa76b" stroke="#ffe1a7" stroke-width="2"/><path d="M48 69L66 79L65 104L50 113L45 94Z" fill="#d68851" stroke="#ffe1a7" stroke-width="1.5"/>'
 panels+=f'<circle cx="55" cy="155" r="12" fill="#101b29" stroke="#ffe1a7"/><text x="55" y="160" text-anchor="middle" fill="#ffe1a7" font-size="15">{i+1}</text><text x="55" y="186" text-anchor="middle" fill="#d6e6f5" font-size="{11 if i==2 else 12}">{label}</text></g>'
figures['sinus']=svg('Три условных варианта отношений опухоли и венозного синуса',panels,'Синий — просвет · не шкала инвазии')
(root/'meningioma-figures.js').write_text('export const figures = '+json.dumps(figures,ensure_ascii=False,indent=2)+';\n')
print('Generated 4 original meningioma diagrams.')

