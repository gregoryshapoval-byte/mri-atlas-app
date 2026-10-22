from pathlib import Path
r=Path(__file__).resolve().parents[1];a=r/'app/src/main/assets';out=a/'sacroiliitis';out.mkdir(exist_ok=True)
BG='#0d1822';BONE='#294657';EDGE='#8ba6b5';JOINT='#163d49';EDEMA='#81d2df';FAT='#efcc86';DARK='#09151e'
IL='M40 114Q75 70 122 64L152 85C149 120 165 140 158 175C154 204 163 223 170 236L119 265L40 234Z'
SA='M166 64H254V85C257 120 241 140 248 175C252 204 243 223 236 236L210 265L184 236C177 223 168 204 172 175C179 140 163 120 166 85Z'
JL='M152 85C149 120 165 140 158 175C154 204 163 223 170 236L184 236C177 223 168 204 172 175C179 140 163 120 166 85Z'
AL='M35 90L122 65L140 103L150 172L162 221L75 243L35 203Z'
AS='M150 65Q210 40 270 65L257 171Q247 220 210 235Q173 220 163 171Z'
AJ='M122 65L150 65L163 171L172 211L162 221L150 172L140 103Z'
def t(x,y,s,size=12,color='#acc3cf',anchor='middle'):return f'<text x="{x}" y="{y}" fill="{color}" font-family="sans-serif" font-size="{size}" text-anchor="{anchor}">{s}</text>'
def m(n,x,y):return f'<circle cx="{x}" cy="{y}" r="11" fill="#12242e" stroke="#7dd9c6" stroke-width="1.5"/>'+t(x,y+4,str(n),12,'#c4f8e9')
def ln(x,y,xx,yy):return f'<path d="M{x} {y}L{xx} {yy}" stroke="#87d3c4" fill="none" stroke-width="1.5"/>'
def ell(x,y,rx,ry,fill=EDEMA,opacity=1):return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}" opacity="{opacity}"/>'
def mirror(s):return '<g transform="translate(420,0) scale(-1,1)">'+s+'</g>'
def path(d,fill,stroke=EDGE,sw=2):return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def base(id,ax=False):
 il,sa,jl=(AL,AS,AJ) if ax else(IL,SA,JL)
 s=f'<defs><clipPath id="il-{id}"><path d="{il}"/></clipPath><clipPath id="sa-{id}"><path d="{sa}"/></clipPath></defs>'
 s+=path(il,BONE)+mirror(path(il,BONE))+path(sa,BONE)+path(jl,JOINT)+mirror(path(jl,JOINT))
 if not ax:s+=t(210,48,'КРЕСТЕЦ',10)+t(27,49,'R',15,'#7dd9c6')+t(393,49,'L',15,'#7dd9c6')
 else:
  s+=t(210,48,'ПЕРЕД',11)+t(210,279,'ЗАД',11)+t(23,51,'R',15,'#7dd9c6')+t(397,51,'L',15,'#7dd9c6')
  s+='<path d="M153 177L172 209M145 187L164 221M267 177L248 209M275 187L256 221" stroke="#6c8796" stroke-dasharray="4 3" fill="none"/>'
 return s
# Every edema/fat focus is clipped to its specified bone; joint fluid is drawn separately.
def il(id,s,right=False):
 b=f'<g clip-path="url(#il-{id})">{s}</g>';return mirror(b) if right else b
def sa(id,s):return f'<g clip-path="url(#sa-{id})">{s}</g>'
def edema(id,typical=True):
 s=il(id,ell(146,147,25,34)) +sa(id,ell(181,151,15,35))
 if typical:s+=il(id,ell(153,205,20,21),True)+sa(id,ell(242,196,16,28))
 return s
def erosion(left=True):
 b=path('M156 144L142 149L144 164L160 171',JOINT,EDGE,2)
 return b if left else mirror(b)
def backfill(left=False):
 b=path('M156 144L142 149L144 164L160 171',FAT,DARK,4)
 return b if left else mirror(b)
def bridge(id):return path('M158 195L178 192L184 211L161 215',BONE,BONE,4)+'<path d="M160 202L179 200M162 208L181 206" stroke="#91b5bd" fill="none"/>'
def wrap(id,s,title='SEMI COR · ЧЕРЕЗ СУСТАВНУЮ ЧАСТЬ'):
 return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 300" role="img" aria-label="КПС: {id}"><rect width="420" height="300" rx="16" fill="{BG}"/>'+t(210,23,title,10)+s+'</svg>'
fig={}
fig['anatomy']=wrap('anatomy',base('anatomy')+m(1,210,138)+m(2,97,151)+ln(326,248,173,201)+m(3,341,254))
fig['bme']=wrap('bme',base('bme')+edema('bme')+m(1,139,142)+m(2,184,160)+ln(336,253,168,185)+m(3,350,259),'STIR / T2 FS · BME В КОСТИ')
s=base('soft',True)+'<path d="M117 67Q135 43 155 67" stroke="#efa68c" stroke-width="6" fill="none"/>'+path('M137 92L150 92L156 135L147 135Z','#a3e1ed','#a3e1ed',1)+ell(112,55,12,6,'#efa68c',.7)+m(1,135,55)+m(2,148,120)+ln(80,88,110,55)+m(3,69,98)
fig['soft']=wrap('soft',s,'SEMI AX · КАПСУЛА / ЩЕЛЬ / МЯГКИЕ ТКАНИ')
fig['erosion']=wrap('erosion',base('erosion')+erosion()+erosion(False)+ln(57,153,146,151)+m(1,42,153)+ln(68,205,145,160)+m(2,53,213)+ln(325,232,262,165)+m(3,339,240),'T1 / ЭРОЗИЯ-ЧУВСТВИТЕЛЬНАЯ СЕРИЯ')
fig['fat']=wrap('fat',base('fat')+il('fat',ell(143,148,18,28,FAT))+backfill()+m(1,137,143)+ln(342,148,272,156)+m(2,357,147)+ln(340,223,270,170)+m(3,353,233),'T1 · ЖИР / BACKFILL')
fig['sclerosis']=wrap('sclerosis',base('sclerosis')+il('sclerosis',ell(146,162,17,41,DARK))+m(1,141,147)+ln(346,120,166,127)+m(2,360,119)+m(3,210,207),'T1 И FS · НИЗКИЙ СИГНАЛ')
fig['ankylosis']=wrap('ankylosis',base('ankylosis')+bridge('ankylosis')+ln(60,185,169,204)+m(1,45,182)+ln(58,245,173,210)+m(2,44,252)+ln(339,125,255,141)+m(3,353,119),'T1 · КОСТНОМОЗГОВОЙ МОСТ')
s=base('mechanical',True)+il('mechanical',ell(134,111,15,19))+sa('mechanical',ell(157,112,13,21))+m(1,210,74)+ln(57,123,139,114)+m(2,42,124)+ln(330,245,259,199)+m(3,344,252)
fig['mechanical']=wrap('mechanical',s,'SEMI AX · ПЕРЕДНЕЕ РАСПОЛОЖЕНИЕ')
tri=path('M149 156L115 235L169 228Z',DARK,DARK,1)
fig['oci']=wrap('oci',base('oci')+il('oci',tri)+il('oci',tri,True)+il('oci',ell(139,193,9,24))+il('oci',ell(139,193,9,24),True)+m(1,141,219)+ln(340,185,255,182)+m(2,354,185)+m(3,139,182),'OCI · ПОДВЗДОШНЫЙ СКЛЕРОЗ')
fig['postpartum']=wrap('postpartum',base('postpartum')+il('postpartum',ell(145,153,18,42))+il('postpartum',ell(145,153,18,42),True)+sa('postpartum',ell(178,150,10,23))+m(1,139,143)+ln(341,126,256,134)+m(2,356,122)+m(3,210,224),'КОНТЕКСТ · НЕ ДИАГНОЗ ПО ОДНОЙ МРТ')
s=base('degeneration')+il('degeneration',ell(147,181,15,36,DARK))+path('M158 119L171 105L169 129',BONE,EDGE,2)+path('M157 175L173 172L176 190L158 191',BONE,EDGE,2)+ell(146,181,5,6,JOINT)+il('degeneration',ell(145,206,9,12))+ln(60,93,166,117)+m(1,45,89)+ln(65,180,147,182)+m(2,50,180)+ln(65,245,147,206)+m(3,49,252)
fig['degeneration']=wrap('degeneration',s,'ФОКАЛЬНОЕ СУЖЕНИЕ / ОСТЕОФИТЫ')
s=base('infection',True)+il('infection',ell(133,123,30,45))+sa('infection',ell(172,126,20,46))+path(AJ,'#a4e6ed','#a4e6ed',2)+ell(130,46,31,17,'#b37b80',.85)+ell(135,38,13,10,'#e4b1a0')+ell(135,38,7,5,JOINT)+ln(60,136,149,133)+m(1,44,140)+ln(88,97,111,51)+m(2,77,107)+ln(329,70,145,38)+m(3,344,75)
fig['infection']=wrap('infection',s,'SEMI AX · МЫШЦЫ / КОЛЛЕКЦИЯ СПЕРЕДИ')
s=base('fracture')+sa('fracture',ell(189,157,14,67))+sa('fracture',ell(231,157,14,67))+path('M188 101L190 147L186 192L191 219M232 101L230 150L234 193L229 219M189 194L231 194','none',DARK,3)+m(1,189,122)+ln(327,165,231,154)+m(2,342,162)+ln(312,252,210,194)+m(3,325,262)
fig['fracture']=wrap('fracture',s,'ПЕРЕЛОМ В КРЫЛЬЯХ КРЕСТЦА')
s=base('variant',True)+ell(152,206,12,7,JOINT)+path('M138 202L146 199M147 211L157 214','none',EDGE,2)+il('variant',ell(122,202,11,14))+m(1,152,206)+ln(341,105,149,127)+m(2,356,102)+m(3,210,151)
fig['variant']=wrap('variant',s,'SEMI AX · ДОБАВОЧНАЯ / СВЯЗОЧНАЯ ЗОНА')
fig['typical']=wrap('typical',base('typical')+edema('typical')+erosion()+il('typical',ell(147,213,14,18,FAT),True)+m(1,184,141)+m(2,145,156)+m(3,210,224),'ПАТТЕРН + СТРУКТУРНЫЕ НАХОДКИ')
fig['nonspecific']=wrap('nonspecific',base('nonspecific')+sa('nonspecific',ell(179,179,6,9))+ln(334,191,179,179)+m(1,349,194)+ln(331,118,166,121)+m(2,346,111)+m(3,210,227),'МАЛЫЙ НЕСПЕЦИФИЧЕСКИЙ ОЧАГ')
fig['inactive']=wrap('inactive',base('inactive')+bridge('inactive')+backfill()+m(1,269,157)+m(2,185,144)+m(3,210,224),'СТРУКТУРНЫЕ ИЗМЕНЕНИЯ БЕЗ BME')
for id,s in fig.items():(out/(id+'.svg')).write_text(s)
(a/'menu-thumbs/sacroiliitis.svg').write_text(fig['bme'])
print(len(fig),'original SIJ figures')
