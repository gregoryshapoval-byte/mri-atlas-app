#!/usr/bin/env python3
"""Twelve original, code-native navigation pictograms in one visual style."""
from pathlib import Path
import json
OUT=Path('app/src/main/assets/home-icons');OUT.mkdir(exist_ok=True)
# Common palette/weights. These are navigation symbols, not diagnostic diagrams.
def p(d,c='bone',fill=True,w=2.5):
 colors={'bone':'#DBE9EC','accent':'#65D8C4','muted':'#8EABB7'}
 return f'<path d="{d}" fill="{colors[c] if fill else "none"}" stroke="{colors[c] if not fill else "#344F60"}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>'
def circle(x,y,r,c='accent'):
 return f'<circle cx="{x}" cy="{y}" r="{r}" fill="'+{'accent':'#65D8C4','bone':'#DBE9EC','muted':'#8EABB7'}[c]+'" stroke="#344F60" stroke-width="2"/>'
art={}
art['brain']=p('M47 22C40 14 25 19 23 30C13 33 12 47 17 54C12 64 20 75 31 75C36 83 47 80 49 75C57 82 70 77 72 69C85 66 85 53 79 47C84 37 77 26 68 25C65 15 52 16 47 22Z')+p('M48 24L48 72M29 29Q36 27 38 35L31 43Q22 42 22 51M59 25Q54 33 60 39L68 35M69 46Q59 43 56 52L62 59Q73 55 76 63M27 61Q35 55 40 62L37 72M47 44Q38 39 34 49M48 64Q52 58 57 64','accent',False,3)
art['spine']=p('M50 16C34 30 59 42 47 57C39 67 43 73 49 80','muted',False,12)
for x,y,a in [(47,21,-18),(45,32,0),(49,43,15),(49,54,0),(45,65,-10)]:
 art['spine']+=f'<g transform="translate({x} {y}) rotate({a})">'+p('M-10-4Q0-7 10-4L11 4Q0 7-11 4Z')+p('M-8 6L8 6','accent',False,2.5)+'</g>'
art['spine']+=p('M40 74L53 74L48 84Z')
art['face-neck']=p('M30 76Q38 65 35 55L27 50L29 43L22 40L28 32C25 15 39 12 51 15C68 17 72 34 67 47L59 58L61 72L75 81L24 81Z')+p('M31 31L38 30M28 43L34 43M37 51Q47 57 57 49','muted',False,2.5)+p('M48 60L50 68L51 76','accent',False,7)+p('M42 62L54 62M43 69L56 69M44 76L58 76','bone',False,2)
art['shoulder']=p('M19 25Q36 16 56 24L70 31L67 38L52 32L37 30L19 32Z')+p('M23 36L49 32L55 53L27 73Z')+circle(64,43,12,'bone')+p('M62 55L73 53L78 82L64 83Z')+p('M51 37Q55 29 66 30Q79 31 81 43','accent',False,4)+p('M54 50L58 58','accent',False,3)
art['elbow']=p('M32 14L46 15L46 47Q52 52 48 59Q40 65 33 59L28 53L32 46Z')+p('M50 61L76 44L82 49L57 70L47 73L39 68Z')+p('M54 72L79 55L83 61L60 80L50 81Z')+p('M28 59Q32 70 42 71M48 57L53 61','accent',False,3.5)
art['wrist']=p('M35 83L35 65L27 56L16 44Q13 38 18 36Q21 34 25 39L32 46L29 23Q29 18 33 18Q37 18 37 23L40 41L39 15Q39 10 43 10Q47 10 47 15L48 39L50 17Q50 12 54 13Q58 14 57 19L57 42L61 25Q63 19 67 22Q70 24 68 30L65 54Q64 64 58 68L57 83Z')+p('M37 48L57 48M38 56L55 56','muted',False,2.5)+circle(40,64,4)+circle(49,64,4)+p('M38 73L55 73','accent',False,3)
art['knee']=p('M30 14L61 14L58 34Q68 39 63 49Q59 55 51 50L46 45Q39 54 31 49Q25 44 30 37Z')+p('M29 59Q44 54 59 59L55 82L34 82Z')+p('M65 58Q72 55 74 62L68 83L63 81Z')+p('M31 54Q45 59 59 54','accent',False,4)+p('M44 36Q52 34 54 41L51 51L43 50L40 43Z','accent')
art['hip']=p('M24 15Q46 9 63 21L59 34L47 42L48 52L40 66L27 60L25 49L13 44L17 27Z')+p('M26 47Q36 39 43 48L38 59L29 56Z','muted')+circle(57,49,11,'bone')+p('M61 58L70 59L79 81L65 83L56 66L49 62L49 56Z')+p('M47 35Q59 31 68 41M44 52Q43 62 53 66','accent',False,4)
art['pelvis']=p('M43 27Q27 11 16 24L14 42L24 54L27 69L42 80L47 74L42 61L35 54L33 41L42 39Z')+p('M53 27Q69 11 80 24L82 42L72 54L69 69L54 80L49 74L54 61L61 54L63 41L54 39Z')+p('M42 24L54 24L57 44L48 54L39 44Z','accent')+p('M29 57Q35 53 39 61L38 70L31 67Z','muted')+p('M67 57Q61 53 57 61L58 70L65 67Z','muted')+p('M44 76L52 76','accent',False,4)
art['foot']=p('M29 12L43 12L42 45L36 52L27 45Z')+p('M48 12L55 12L54 43L47 49Z')+p('M31 53Q23 55 23 65L16 71L20 80L38 80L47 71L54 67L51 57L41 54Z')+p('M51 61L72 48L76 54L57 70Z')+p('M55 71L76 61L79 67L59 77Z')+circle(78,46,5,'bone')+circle(82,58,4,'bone')+circle(83,69,3,'bone')+p('M29 49L42 50M39 60L47 65','accent',False,3.5)
art['upper-limb']=p('M23 14Q38 10 49 21L44 28L29 22Z')+circle(46,30,8,'bone')+p('M45 38L54 38L54 58L47 62L42 58Z')+p('M49 64L56 64L68 78L64 82L54 75Z')+p('M59 61L63 60L77 74L74 79Z')+p('M70 80L78 76L85 82L82 88L74 88Z')+p('M40 24Q51 20 57 31M46 61L57 61','accent',False,3)
art['lower-limb']=p('M31 14Q44 10 53 19L49 29L40 33L31 28Z')+circle(48,32,7,'bone')+p('M45 40L54 39L53 58L44 58Z')+p('M44 65L52 64L51 81L45 83Z')+p('M56 65L60 65L57 81L54 81Z')+p('M46 84L55 82L68 86L67 90L44 90Z')+p('M44 61L54 61M39 25Q47 21 55 27','accent',False,3.5)
for key,glyph in art.items():
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" data-style="atlas-anatomy-163"><defs><linearGradient id="tile" x2="1" y2="1"><stop stop-color="#233B4B"/><stop offset="1" stop-color="#13232F"/></linearGradient></defs><rect x="1" y="1" width="94" height="94" rx="22" fill="url(#tile)" stroke="#3B5667" stroke-width="1.5"/><g>{glyph}</g></svg>\n'
 (OUT/(key+'.svg')).write_text(svg)
Path('app/src/main/assets/home-icons.js').write_text('// Original navigation pictograms; all local SVG, one palette and frame.\nexport const homeIconIds='+json.dumps(list(art))+';\nexport function homeIcon(id){if(!homeIconIds.includes(id))throw Error("Missing home icon: "+id);return "home-icons/"+id+".svg"}\n')
print('Generated',len(art),'distinct home SVG icons')
