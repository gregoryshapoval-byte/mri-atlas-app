from pathlib import Path
import re,sys
A=Path(__file__).resolve().parents[1]/'app/src/main/assets'
h=(A/'pelvic-prolapse.html').read_text();h=re.sub(r'<link rel="stylesheet" href="([^"]+)">',lambda m:'<style>'+(A/m[1]).read_text()+'</style>',h)
j=(A/'pelvic233.js').read_text();j=j[j.index('\n')+1:].replace('export function figure','function figure')
math=(A/'pelvic233-math.js').read_text().replace('export function','function');data=(A/'pelvic-prolapse-data.js').read_text().replace('export const','const')
h=h.replace('<script type="module" src="pelvic233.js"></script>','<script type="module">'+data+'\n'+math+'\n'+j+'</script>').replace('href="region.html?area=pelvis"','href="#"')
Path(sys.argv[1]).write_text(h)
