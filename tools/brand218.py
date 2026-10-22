#!/usr/bin/env python3
from pathlib import Path
import re,xml.etree.ElementTree as ET
r=Path('.');a=r/'app/src/main/assets';res=r/'app/src/main/res';bg='#101c28'
paths=[('#83adbf','M52,28C42,20 28,37 29,55C30,71 39,80 52,78L52,28Z'),('#a9c6d2','M56,28C66,20 80,37 79,55C78,71 69,80 56,78L56,28Z'),('#2b465c','M45,44Q37,40 39,49L49,63L51,47Z M63,44Q71,40 69,49L59,63L57,47Z'),('#72d5bf','M52,65Q54,62 56,65L55,71L53,71Z')]
frame='M54,22A32,32 0 1 1 53.99,22Z'
vec=lambda mono=False: '<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="108dp" android:height="108dp" android:viewportWidth="108" android:viewportHeight="108">'+''.join(f'<path android:fillColor="{"#ffffff" if mono else c}" android:pathData="{d}"/>' for c,d in paths[:2] if mono or c)+('' if mono else ''.join(f'<path android:fillColor="{c}" android:pathData="{d}"/>' for c,d in paths[2:]))+f'<path android:fillColor="#00000000" android:strokeColor="{"#ffffff" if mono else "#72d5bf"}" android:strokeWidth="3.5" android:strokeLineCap="round" android:strokeLineJoin="round" android:pathData="{frame}"/></vector>\n'
(res/'drawable/ic_launcher_foreground.xml').write_text(vec())
(res/'drawable/ic_launcher_monochrome.xml').write_text(vec(True))
# Legacy drawable also updated for any older references; launcher uses adaptive resources.
s=vec().replace('>'+''.join([]),'>',1);s=s.replace('<path ',f'<path android:fillColor="{bg}" android:pathData="M0,0h108v108h-108z"/><path ',1)
(res/'drawable/ic_atlas.xml').write_text(s)
(res/'values/colors.xml').write_text('<resources><color name="launcher_background">'+bg+'</color></resources>\n')
for version in [26,33]:
 d=res/f'mipmap-anydpi-v{version}';d.mkdir(exist_ok=True);(d/'ic_launcher.xml').write_text('<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android"><background android:drawable="@color/launcher_background"/><foreground android:drawable="@drawable/ic_launcher_foreground"/>'+('<monochrome android:drawable="@drawable/ic_launcher_monochrome"/>' if version==33 else '')+'</adaptive-icon>\n')
svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108"><rect width="108" height="108" rx="24" fill="'+bg+'"/>'+''.join(f'<path fill="{c}" d="{d}"/>' for c,d in paths)+f'<path fill="none" stroke="#72d5bf" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" d="{frame}"/></svg>'
(a/'brand-logo.svg').write_text(svg)
p=r/'app/src/main/AndroidManifest.xml';s=p.read_text().replace('android:label="МРТ Атлас · метки"','android:label="MRIAtlas"').replace('android:icon="@drawable/ic_atlas"','android:icon="@mipmap/ic_launcher" android:roundIcon="@mipmap/ic_launcher"');p.write_text(s)
p=a/'index.html';s=p.read_text();s=re.sub(r'<svg viewBox="0 0 32 32".*?</svg>','<img class="brandLogo" src="brand-logo.svg" width="36" height="36" alt="">',s,count=1);s=s.replace('MRI Atlas','MRIAtlas').replace('<span>MRI <b>Atlas</b></span>','<span>MRI<b>Atlas</b></span>').replace('Версия 1.77','Версия 2.18');p.write_text(s)
p=a/'region.html';p.write_text(p.read_text().replace('MRI Atlas','MRIAtlas').replace('MRI <b>Atlas</b>','MRI<b>Atlas</b>'))
p=a/'menus.css';s=p.read_text().split('/* 2.18: flat schematic thumbnails;')[0].rstrip();s+='''
/* 2.18: flat schematic thumbnails; preserve the complete compact home grid. */
[data-page="home"] .brandLogo{width:34px;height:34px;flex-shrink:0;border-radius:9px}
[data-page="home"] .areaCard>img{width:clamp(34px,6.2dvh,54px);height:clamp(34px,6.2dvh,54px);border-radius:9px;background:#0d1822}
@media(max-width:345px){[data-page="home"] .areaCard>img{width:34px;height:34px}}
@media(min-width:700px) and (max-height:600px){[data-page="home"] .areaCard>img{width:38px;height:38px}}
''';p.write_text(s)
for f in ['app/build.gradle','build-apk.sh']:
 p=r/f;s=p.read_text().replace('2.17','2.18').replace('versionCode 117','versionCode 118').replace('--version-code 117','--version-code 118');p.write_text(s)
(r/'build-apk.sh').chmod(0o755)
for p in res.rglob('*.xml'):ET.parse(p)
print('MRIAtlas: adaptive/monochrome/legacy icons, label, header, footer updated')
