#!/usr/bin/env python3
"""MRIAtlas 2.18: original flat anatomical navigation illustrations."""
from pathlib import Path
import json
O=Path('app/src/main/assets');D=O/'home-icons';D.mkdir(exist_ok=True)
P={'bg':'#0d1822','tissue':'#89aabc','light':'#bdd4dd','deep':'#2c465c','bone':'#d4e0de','mint':'#71c9bb','coral':'#e8a293','yellow':'#e4c28f'}
def p(d,c='tissue',stroke=None,w=1.3):return f'<path d="{d}" fill="{P.get(c,c)}"'+(f' stroke="{P.get(stroke,stroke)}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"' if stroke else '')+'/>'
def e(x,y,rx,ry,c='tissue',stroke=None,w=1.3):return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{P.get(c,c)}"'+(f' stroke="{P.get(stroke,stroke)}" stroke-width="{w}"' if stroke else '')+'/>'
def l(d,c='mint',w=1.6):return p(d,'none',c,w)
def rect(x,y,w,h,c,rx=2):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{P.get(c,c)}"/>'
A={}
A['brain']=e(48,49,34,38,'deep','tissue',1)+p('M47 15C31 8 14 31 16 51C17 73 30 85 46 84L47 15Z','tissue')+p('M49 15C65 8 82 31 80 51C79 73 66 85 50 84L49 15Z','tissue')+l('M48 16L48 81','light',.7)+p('M38 39Q30 34 32 45L43 61L45 43Z M58 39Q66 34 64 45L53 61L51 43Z','deep')+l('M23 31Q31 25 37 29M19 44Q26 40 29 44M22 62Q28 58 33 64M63 29Q70 25 75 33M68 49L77 45M61 70Q67 65 75 67','light',.8)+e(48,63,3,4,'mint')
A['spine']=p('M29 10Q50 4 64 19L61 80L39 88L27 72Z','deep')
for y in [12,27,42,57]:A['spine']+=p(f'M35 {y}Q47 {y-3} 57 {y+1}L56 {y+11}Q46 {y+14} 35 {y+9}Z','bone')+p(f'M34 {y+11}L57 {y+13}L56 {y+16}L34 {y+14}Z','mint')+p(f'M60 {y+3}L74 {y+9}L70 {y+12}L59 {y+9}Z','tissue')
A['spine']+=p('M36 75L55 76L49 89L41 84Z','bone')+l('M30 12L29 75','light',2)
A['face-neck']=p('M27 83L39 67L36 55L23 49L26 41L19 37L26 29Q25 9 46 10Q68 10 73 31Q75 50 61 60L65 76L78 86Z','tissue')+p('M37 18Q51 12 63 24Q70 40 58 49L41 46L31 32Z','light')+p('M35 37Q44 31 53 39L48 47L37 46Z','deep')+l('M25 42L33 42M29 51Q38 56 43 51','coral',1.8)
for y in [59,66,73]:A['face-neck']+=rect(48,y,10,5,'bone')+rect(48,y+5,10,1.4,'mint')
A['face-neck']+=p('M41 60L45 60L46 82L40 82Z','deep')
A['shoulder']=p('M15 20Q36 12 57 20L76 28L72 34L51 27L33 26L15 28Z','bone')+p('M21 33L44 29L50 58L27 78Z','tissue','light')+p('M46 35Q55 38 53 56L47 62L43 51Z','bone')+e(64,44,17,18,'bone')+e(64,44,12,13,'tissue')+p('M59 61L72 60L78 86L61 86Z','bone')+p('M62 63L69 63L72 84L64 84Z','tissue')+l('M53 30Q70 25 81 41','mint',4)+l('M46 38Q41 47 48 57','coral',2)
A['elbow']=p('M25 10L43 10L44 38L53 48Q55 60 43 64L30 59L25 49Z','bone')+p('M30 13L38 13L38 41L44 49L35 54L30 46Z','tissue')+p('M29 62Q38 71 50 65L76 45L83 53L55 79L39 83L25 74Z','bone')+p('M49 79L78 59L83 66L57 87Z','tissue','light')+l('M26 59Q28 72 43 73M47 62L53 65','mint',3)+e(47,53,8,8,'tissue')
A['wrist']=p('M23 8L41 8L42 31L34 38L21 34Z','bone')+p('M50 8L63 8L63 33L51 35Z','tissue','bone')+p('M27 9L35 9L36 29L29 31Z','tissue')
for x,y,rx,ry in [(24,46,9,8),(43,44,8,7),(61,44,7,8),(25,64,8,9),(43,61,9,10),(61,61,7,10),(76,58,5,9)]:A['wrist']+=e(x,y,rx,ry,'bone')+e(x,y,rx*.58,ry*.58,'tissue')
for x in [22,39,56,71]:A['wrist']+=p(f'M{x} 76L{x+8} 75L{x+11} 91L{x+2} 91Z','bone')
A['wrist']+=l('M17 36Q38 41 66 36','mint',2.5)+l('M19 54L68 52','coral',1.8)
A['knee']=p('M34 7L58 7L59 39Q64 51 55 55L32 52Q24 43 32 34Z','bone')+p('M40 8L51 8L52 37Q55 44 49 47L36 44Z','tissue')+p('M30 63L60 63L55 89L33 89Z','bone')+p('M37 67L53 67L49 88L39 88Z','tissue')+p('M65 65L75 67L70 89L64 88Z','tissue','light')+e(22,43,5,10,'bone')+p('M28 56L39 58L29 61Z M49 59L60 56L61 61Z','deep')+l('M30 54Q46 60 60 54','mint',2.3)+l('M23 56L29 69','coral',2)
A['hip']=p('M20 12Q39 6 57 18L55 33L43 43L39 63L25 58L21 44L11 39Z','bone')+p('M26 18Q38 13 49 22L44 34L32 43L27 37Z','tissue')+p('M26 49Q34 41 39 49L34 58L27 56Z','deep','tissue')+e(59,46,15,15,'bone')+e(59,46,10,10,'tissue')+p('M65 57L76 58L86 86L69 88L59 68L49 63L49 57Z','bone')+p('M66 66L72 65L79 85L73 85Z','tissue')+l('M45 32Q62 25 75 40','mint',3)+l('M43 43Q40 57 49 64','coral',2)
A['pelvis']=p('M42 25Q26 9 13 22L12 40L23 55L29 75L43 84L48 77L41 61L36 43L43 39Z','bone')+p('M54 25Q70 9 83 22L84 40L73 55L67 75L53 84L48 77L55 61L60 43L53 39Z','bone')+p('M38 22L58 22L57 43L48 51L39 43Z','tissue')+e(48,57,13,12,'mint')+e(48,75,7,7,'coral')+p('M24 58Q34 52 38 65L35 74L27 68Z M72 58Q62 52 58 65L61 74L69 68Z','deep')+l('M33 27L37 42M63 27L59 42','coral',2)
A['abdomen']=e(48,49,39,31,'tissue','light',1)+p('M17 38Q26 24 48 26L51 41L39 52L19 50Z','coral')+e(67,37,12,9,'deep','light')+p('M28 54Q14 54 22 68Q31 72 32 62Z M69 54Q82 54 75 68Q65 72 64 62Z','yellow')+e(48,66,9,8,'bone')+e(48,66,5,4,'deep')+e(44,52,3,4,'coral')+e(53,52,4,3,'mint')+l('M37 40Q44 46 57 43','light',2)+l('M35 57Q46 60 58 57','bone',2)
A['foot']=p('M27 8L42 8L41 35L34 42L25 35Z','bone')+p('M49 9L57 9L55 34L47 39Z','tissue')+p('M26 50Q12 52 12 69L22 79L39 75L48 62L42 49Z','bone')+e(36,44,11,9,'tissue','light')+p('M47 54L59 51L68 58L57 69L45 66Z','tissue','bone')+p('M61 57L82 48L86 55L68 66Z','bone')+p('M66 70L85 61L89 67L70 76Z','tissue','light')+e(87,49,4,4,'bone')+e(90,60,3,3,'bone')+l('M25 42L44 43','mint',3)+l('M17 70Q24 58 33 57','coral',2)
A['upper-limb']=p('M22 10Q36 7 51 19L47 26L29 20Z','bone')+e(49,28,10,10,'tissue','bone',2)+p('M45 38L56 37L58 58L48 62Z','bone')+p('M49 64L57 63L71 78L66 83L56 75Z','tissue','bone')+p('M61 62L65 61L81 74L77 79Z','bone')+p('M72 79L82 76L90 84L86 91L76 89Z','tissue','light')+l('M39 22Q53 14 62 29M47 60L59 59','mint',2.5)+l('M76 82L84 85','coral',2)
A['lower-limb']=p('M30 8Q45 3 57 17L53 27L40 32L30 24Z','bone')+e(51,31,8,8,'tissue','bone',2)+p('M47 40L57 38L56 59L46 60Z','bone')+p('M47 66L56 65L55 83L47 86Z','bone')+p('M61 66L65 66L61 84L58 84Z','tissue')+p('M48 87L58 84L76 88L75 93L46 93Z','bone')+l('M46 63L57 62M40 23Q52 16 62 29','mint',2.5)+e(59,61,3,4,'coral')
for key,art in A.items():
 s=f'<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" data-style="atlas-illustration-218"><rect width="96" height="96" rx="12" fill="{P["bg"]}"/>{art}</svg>\n';(D/(key+'.svg')).write_text(s)
(O/'home-icons.js').write_text('// Original flat anatomical illustrations, one palette.\nexport const homeIconIds='+json.dumps(list(A))+';\nexport function homeIcon(id){if(!homeIconIds.includes(id))throw Error("Missing home icon: "+id);return "home-icons/"+id+".svg"}\n')
print('Generated',len(A),'flat anatomical illustrations')
