"""Conservative slice audit of 1.44 overlays; exact source images/points are immutable.
Explicit source-pixel edits only. Run 144 generator first only to recreate its baseline.
No inferred fluid segmentation, threshold snapping, interpolation or propagated contour.
"""
import json,copy,hashlib
from pathlib import Path
A=Path(__file__).resolve().parents[1]/'app/src/main/assets';R=A.parents[3]
# Visually inspected narrow fluid portions. Paths stop before cartilage/cortex.
K={
 (653,144201):{
 8:[[114,220],[119,234],[123,251],[124,261]],
 9:[[111,220],[115,234],[121,251],[122,261]],
 10:[[109,222],[114,237],[120,253],[121,263]],
 11:[[109,227],[115,242],[120,255],[121,264]],
 12:[[112,236],[119,245],[122,253],[122,261]],
 13:[[111,241],[116,252],[120,263],[121,274]],
 14:[[111,247],[116,258],[119,272],[122,284]],
 15:[[112,253],[117,264],[120,278],[124,290]],
 16:[[111,261],[117,272],[122,286],[127,298]],
 17:[[110,268],[116,279],[122,292],[128,302]],
 18:[[111,273],[116,282],[120,292],[124,302]]},
 (652,144201):{
 14:[[184,107],[195,111],[205,112]],15:[[180,104],[193,108],[207,109]],
 16:[[178,103],[193,107],[209,108]],17:[[176,101],[190,104],[208,106]],
 18:[[191,103],[201,104],[211,104]],19:[[190,103],[200,104],[210,104]],
 20:[[182,102],[197,108],[211,110]]},
 (652,144202):{
 24:[[123,113],[117,126],[112,140],[109,150]],
 25:[[120,113],[115,126],[111,139]],
 26:[[118,113],[113,126],[110,139]],
 27:[[116,115],[111,127],[108,139]],
 28:[[114,117],[110,128],[107,139]]},
 (652,144203):{
 24:[[267,100],[276,103],[283,109]],
 25:[[269,103],[281,111],[290,120]],
 26:[[270,106],[282,116],[291,125]],
 27:[[271,108],[284,119],[294,131]],
 28:[[273,111],[288,123],[300,138]]}}
# Only coronal inferior capsular cleft; remove sagittal U across humeral metaphysis.
S={(658,143201):{
 17:[[151,207],[146,216],[143,226],[147,231]],
 18:[[155,208],[150,217],[147,227],[151,233]],
 19:[[154,207],[149,216],[145,226],[149,231]],
 20:[[153,207],[147,216],[143,224],[147,230]]}}
audit=[]
for mod,edits in [('knee-mri',K),('shoulder-mri',S)]:
 d=json.loads((A/(mod+'-data.json')).read_text());e=json.loads((A/(mod+'-anatomy144.json')).read_text());e['revision']='1.45'
 for s in d['series']:
  if s['id'] not in e['seriesSlices']:continue
  for n,f in enumerate(s['frames'],1):
   a=e['seriesSlices'][s['id']][f['annotation']];new=[]
   for r in a['regions']:
    if mod=='shoulder-mri' and r['structure']!=143201:new.append(r);continue
    vs=edits.get((s['sourceSeries'],r['structure']),{}).get(n)
    record={'module':mod,'series':s['id'],'frame':n,'annotation':f['annotation'],'imageSha256':f['sha256'],'structure':r['structure'],'before':r['vertices'],'beforeWidth':r['width'],'after':vs,'afterWidth':3 if vs else None,'decision':'redrawn' if vs else 'removed'}
    if vs:
     record['reason']='Shortened to the visually reviewed cleft/fluid portion; no extension onto adjacent cortex, retinaculum or muscle.'
     r['vertices']=vs;r['width']=3;new.append(r)
    else:record['reason']='The old path crosses bone/other tissue or the collapsed bursa/recess cannot be separated confidently on this slice; no replacement contour inferred.'
    audit.append(record)
   a['regions']=new
 # Inform the user where contours are intentionally absent, without arbitrary replacement dots.
 removed=set(r['structure'] for r in audit if r['module']==mod and r['decision']=='removed')
 for id in removed:
  e['structureNotes'][str(id)]+=' Проверка 1.45: ленты на срезах с неразличимыми границами или наложением на кость/другие ткани удалены. Отсутствие ленты не означает отсутствия анатомической структуры.'
 e['limitations'].insert(0,'Проверка 1.45: исправлены только ленты сумок/заворотов колена и аксиллярного заворота плеча. Оставлены короткие ориентировочные участки; это не сегментация полости. Остальные ленты плеча и стопы в эту проверку не входят.')
 (A/(mod+'-anatomy145.json')).write_text(json.dumps(e,ensure_ascii=False,separators=(',',':'))+'\n')
(Path(__file__).resolve().parents[1]/'review/joint-audit-1.45.json').write_text(json.dumps({'version':'1.45','review':'Visual inspection of all 72 knee ribbons and 20 axillary ribbons on the 1.44 source slice contact sheets, with pixel-grid enlargement for retained paths. No independent expert verification.','edits':audit},ensure_ascii=False,indent=2)+'\n')
print({k:sum(r['decision']==k for r in audit) for k in ['redrawn','removed']})
