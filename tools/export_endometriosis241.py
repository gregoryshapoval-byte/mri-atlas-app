"""Export the complete endometriosis module as one offline HTML file."""
from pathlib import Path
import base64,json,re,sys
assets=Path(__file__).resolve().parents[1]/'app/src/main/assets'
s=(assets/'endometriosis.html').read_text()
s=re.sub(r'<link rel="stylesheet" href="([^"]+)">',lambda m:'<style>'+ (assets/m[1]).read_text()+'</style>',s)
s=re.sub(r'<nav class="related".*?</nav>','',s)
s=s.replace('href="region.html?area=pelvis"','href="#"').replace('‹ Таз','MRI Atlas · офлайн')
images={str(int(p.stem.split('-')[1])):'data:image/png;base64,'+base64.b64encode(p.read_bytes()).decode() for p in (assets/'endometriosis-cases').glob('*.png')}
scripts=[]
for name in ['endometriosis-data.js','endometriosis-figures.js','endometriosis-cases-data.js']:
 scripts.append((assets/name).read_text().replace('export const ','const '))
scripts.append('const caseImages = '+json.dumps(images)+';')
for name in ['endometriosis.js','endometriosis-cases.js']:
 js=re.sub(r'^import .*?;\s*','',(assets/name).read_text(),flags=re.M)
 if name=='endometriosis-cases.js':js=re.sub(r'const path=c=>.*?;', 'const path=c=>caseImages[String(c.figure)];',js,count=1)
 scripts.append('{\n'+js+'\n}')
s=re.sub(r'<script type="module" src="[^"]+"></script>','',s)
s=s.replace('</body>','<script>\n'+'\n'.join(scripts).replace('</script','<\\/script')+'\n</script></body>')
p=Path(sys.argv[1]);p.write_text(s);print(p, p.stat().st_size)
