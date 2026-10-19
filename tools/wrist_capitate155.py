"""Separate capitate ligament supplement. Native pixel landmarks, no interpolation.
Source images/labels and supplements146/154 remain immutable.
"""
from pathlib import Path
import json,hashlib
R=Path(__file__).resolve().parents[1];A=R/'app/src/main/assets'
load=lambda p:json.loads(p.read_text())
d=load(A/'wrist-mri-data.json');l=load(A/'wrist-mri-labels.json')
LIMIT='≈ — приблизительный учебный ориентир ожидаемого участка связки по костным границам и капсулярной топографии. Отдельные волокна и их целость здесь не доказаны. Это не сегментация и не независимая врачебная верификация. Соседние кадры автоматически не размечаются.'
DEFS={
155101:('CH · головчато-крючковидные связки','CH · межкостная область','Между головчатой и крючковидной костями. Тыльная, глубокая и ладонная части описаны анатомически, но на текущих JPEG не разделены уверенно; показана общая межкостная область, не три отдельных пучка.'),
155102:('CT · головчато-трапециевидные связки','CT · область','Между головчатой и трапециевидной костями (trapezoid). Не связка к кости-трапеции (trapezium). Поверхностные и глубокая части здесь не разделены; точки показывают ожидаемый участок межкостного соединения.'),
155103:('SC · ладьевидно-головчатая связка','SC · ладонная область','Ладонное соединение дистального отдела ладьевидной с головчатой. Не RSC: последняя начинается на лучевой кости. Вместе с TC относится к дугообразному ладонному комплексу; общей меткой лучистой связки не заменяется.'),
155104:('TC · трёхгранно-головчатая связка','TC · ладонная область','Ладонное соединение трёхгранной с головчатой; отличается от TH, идущей к крючковидной. TC и SC описываются как две части дугообразного комплекса. Отдельный ход от UC/TH надёжно не отделён; собственная точка не добавлена.')}
# Independently reviewed native coordinates. These are points, not joint-gap lines.
ROWS=[
[155101,667,13,393,405],[155101,667,14,396,404],[155101,668,13,417,373],[155101,669,11,365,340],
[155102,667,16,287,366],[155102,668,10,338,371],[155102,669,16,356,330],
[155103,667,13,312,333],[155103,668,9,338,354],[155103,669,17,354,308],
[155104,667,12,451,343],[155104,668,9,444,331],
]
CANDIDATES=ROWS
ROWS=[r for r in ROWS if r[0]!=155104 and not (r[1]==669 and r[0] in [155102,155103])]
gid=15501;e={'revision':'1.55','filters':[{'id':gid,'parent':91270,'name':'Связки вокруг головчатой кости','default':True,'icon':'wrist-mri-source/group-1259.png'}],'displayNames':{},'shortNames':{},'pointPresentation':{},'structureNotes':{},'searchAliases':{},'seriesSlices':{},'catalogNames':{},'guideTitle':'Связки запястья и ТФХК · подробнее','guideHint':LIMIT,'guideChapters':[['Связки вокруг головчатой кости',[155101,155102,155103,155104,146101,146109,1644]],['Соседние межзапястные структуры · пределы',[155105,155106]]],'sources':[{'title':'Gheno et al. · MR and cadaveric intercarpal ligament anatomy, 2009','url':'https://doi.org/10.1007/s00256-009-0796-5'},{'title':'Ritt et al. · Gross and histologic capitohamate ligament anatomy, 1996','url':'https://pubmed.ncbi.nlm.nih.gov/8969426/'}],'limitations':[LIMIT,'TC не получила отдельной точки: уверенно отделить её от ладонной капсулы, UC, TH и суставной щели не удалось. SC и CT в сагиттале также не добавлены из-за неоднозначных костных границ. По три плоскости для каждой связки не заявляются.'],'catalog':[]}
for k,(name,short,note) in DEFS.items():
 e['catalogNames'][str(k)]=name;e['structureNotes'][str(k)]=note+' '+LIMIT;e['searchAliases'][str(k)]={155101:'capitohamate головчатая крючковидная CH',155102:'capitotrapezoid головчатая трапециевидная CT',155103:'scaphocapitate головчатая ладьевидная SC дугообразная',155104:'triquetrocapitate головчатая трёхгранная TC дугообразная'}[k]
 e['catalog'].append({'id':'capitate155-'+str(k),'name':name,'filter':gid,'structures':[k] if any(r[0]==k for r in ROWS) else [],'reason':note+' '+LIMIT})
for k,name,note in [(155105,'TH · трёхгранно-крючковидная связка','Соседняя ладонная связка; идёт к крючковидной, а не к головчатой. Отдельная уверенная точка не добавлена.'),(155106,'TT · связки кости-трапеции и трапециевидной кости','Соединяют две лучевые кости дистального ряда; не прикрепляются к головчатой. Отдельная уверенная точка не добавлена.')]:
 e['catalogNames'][str(k)]=name;e['structureNotes'][str(k)]=note;e['catalog'].append({'id':'capitate155-'+str(k),'name':name,'filter':gid,'structures':[],'reason':note})
e['structureNotes']['1644']='Лучистая связка запястья — общее исходное обозначение ладонных пучков у головчатой кости; не отдельная доказанно выделенная SC, TC, UC или RSC. Общие исходные точки сохранены в группе исходника.'
e['structureNotes']['1647']='Общие исходные межкостные межзапястные ориентиры: на разных кадрах относятся к разным промежуткам. Не переименованы целиком в CH или CT. На явно перечисленных кадрах ближайшая общая точка скрыта в представлении, чтобы не дублировать новый приблизительный ориентир.'
records=[]
for i,(k,se,n,x,y) in enumerate(ROWS):
 s=next(s for s in d['series'] if s['sourceSeries']==se and 'PD' in s['title']);f=s['frames'][n-1];sl=e['seriesSlices'].setdefault(s['id'],{}).setdefault(f['annotation'],{'points':[],'regions':[],'suppress':[],'suppressMasks':[]});name,short,note=DEFS[k]
 p={'id':155000000+i,'structure':k,'name':'≈ '+name+' · область','shortName':'≈ '+short,'filter':gid,'x':x,'y':y,'category':'ligaments','approximate':True,'provenance':'manual-capitate-topography-1.55'};sl['points'].append(p)
 suppressed=[q['structure'] for q in l['slices'][f['annotation']]['points'] if q['structure'] in [1644,1646,1647] and (q['x']-x)**2+(q['y']-y)**2<=12**2];sl['suppress']=sorted(set(sl['suppress']+suppressed));records.append({'series':s['id'],'sourceSeries':se,'frame':n,'annotation':f['annotation'],'imageSha256':f['sha256'],'suppressedGeneric':suppressed,**p})
(A/'wrist-mri-capitate155.json').write_text(json.dumps(e,ensure_ascii=False,separators=(',',':'))+'\n')
report={'revision':'1.55','base':'8b3b4d7e06718ca77acb929935dcbd16e50c4d6e','sourceHashes':{p:hashlib.sha256((A/p).read_bytes()).hexdigest() for p in ['wrist-mri-data.json','wrist-mri-labels.json','wrist-mri-anatomy146.json','wrist-mri-joints154.json']},'records':records,'addedPoints':len(records),'newLigamentIdentities':3,'unmarkedCatalogIdentities':[155104,155105,155106],'rejectedCandidates':[{'structure':r[0],'sourceSeries':r[1],'frame':r[2],'x':r[3],'y':r[4],'decision':'not published: cannot separate ligament from bone, capsule or joint gap'} for r in CANDIDATES if r not in ROWS],'limits':e['limitations'],'reviewedPDFrames':74,'coverage':{str(k):{str(se):[n for kk,sse,n,x,y in ROWS if kk==k and sse==se] for se in [667,668,669]} for k in DEFS}}
(R/'review/wrist-capitate-1.55.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print('Added explicit PD landmarks',len(records))
