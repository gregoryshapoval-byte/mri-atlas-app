"""Apply reviewed teaching landmarks separately from the immutable source import."""
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
ASSETS=ROOT/'app/src/main/assets'
path=ASSETS/'wrist-mri-labels.json'
data=json.loads(path.read_text())
original=ROOT/'review/wrist-source-labels-before-1.27.json'
if not original.exists(): original.write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')))
data=json.loads(original.read_text())
filters=data['filters']['wrist-mri-3d']
for f in filters:
    f['default']=f['id'] in (1254,1255,1256,1257)
    if f['id']==1259: f['name']='Другие связки · исходные метки'
filters[:0]=[
 {'id':91270,'name':'SL / LT · межкостные связки','parent':None,'default':True,'icon':'wrist-mri-source/group-1259.png'},
 {'id':91271,'name':'ТФХК · диск и прикрепления','parent':None,'default':True,'icon':'wrist-mri-source/group-1258.png'}]
data['storageKey']='wrist-mri-anatomy-v2'
data.setdefault('structureNotes',{}).update({
 '1632':'Исходная общая метка диска. Не обозначает весь ТФХК или отдельные его прикрепления.',
 '1638':'Исходное общее название. Не эквивалент тыльной лучелоктевой связки; не использовать для её идентификации.',
 '1639':'Исходное общее обозначение ладонных локтезапястных связок. Локтеполулунная и локтетрёхгранная отдельно не разграничены.',
 '1640':'Исходное название сохранено для сопоставления. Не считать эту точку доказательством отдельно различимой коллатеральной связки или гомолога мениска.',
 '1647':'Общее название нескольких межзапястных связок. Не заменяет отдельные метки SL/LT.',
 '2405':'Синовиальное влагалище ECU. Собственный фиброзный удерживающий футляр (subsheath) отдельно не размечен.'})

definitions={
 912701:('≈ SL · центральный компонент',91270,'Ладьевидно-полулунная связка. Ручной учебный ориентир центрального (мембранозного) компонента; не контур всей связки. Тыльный и ладонный пучки отдельно не размечены.'),
 912702:('≈ LT · центральный компонент',91270,'Полулунно-трёхгранная связка. Ручной учебный ориентир центрального компонента; не контур всей связки. Тыльный и ладонный пучки отдельно не размечены.'),
 912703:('≈ Диск ТФХК · центральная часть',91271,'Ручной учебный ориентир диска. ТФХК включает и другие компоненты; точка не обозначает весь комплекс.'),
 912704:('≈ Лучевое прикрепление диска · область',91271,'Ориентировочная область лучевого прикрепления диска к краю локтевой вырезки лучевой кости. Граница волокон на JPEG не сегментирована.'),
 912706:('≈ Фовеальное прикрепление · примерно',91271,'Ожидаемая область глубокого прикрепления ТФХК к ямке у основания шиловидного отростка локтевой кости. Приблизительный анатомический ориентир, а не уверенно выделенные волокна или граница прикрепления.'),
 912707:('≈ Шиловидное прикрепление · примерно',91271,'Ожидаемая область поверхностного прикрепления ТФХК к шиловидному отростку локтевой кости. Приблизительный анатомический ориентир, а не уверенно выделенные волокна или граница прикрепления.')}
# Coordinates selected separately on adjacent coronal source slices, not interpolated.
coordinates={
 '18698':[(912701,356,249),(912702,449,249),(912703,435,225),(912704,415,222),(912706,472,218),(912707,497,244)],
 '18699':[(912701,359,250),(912702,451,249),(912703,437,224),(912704,417,221),(912706,474,218),(912707,498,244)],
 '18700':[(912701,359,248),(912702,450,248),(912703,437,226),(912704,418,224),(912706,475,220),(912707,499,245)]}
# Keep source disc landmarks elsewhere; reviewed central landmarks replace the three ambiguous duplicates.
for sid,sl in data['slices'].items():
    sl['points']=[p for p in sl['points'] if not (sid in coordinates and p['structure']==1632)]
    for p in sl['points']:
        if p['structure']==1632:
            p['filter']=91271
            p['name']='Диск ТФХК · исходная метка'
review=[]
for sid,items in coordinates.items():
    for structure,x,y in items:
        name,group,note=definitions[structure]
        point={'id':int(sid)*100+structure%100,'structure':structure,'name':name,'x':x,'y':y,'filter':group,'color':'#FFD27A','approximate':True,'provenance':'manual-teaching-review-1.28'}
        data['slices'][sid]['points'].append(point)
        review.append({'slice':sid,**point})
        data['structureNotes'][str(structure)]=note
data['searchAliases']={
 '912701':'ладьевидно-полулунная scapholunate SLL SL',
 '912702':'полулунно-трехгранная lunotriquetral LTL LT',
 '912703':'суставной диск треугольный фиброзно хрящевой комплекс TFCC ТФХК',
 '912706':'фовеа fovea глубокое проксимальная пластинка TFCC ТФХК',
 '912707':'шиловидное styloid поверхностное дистальная пластинка TFCC ТФХК'}
data['coverage']=[
 {'filter':91270,'name':'SL: тыльный и ладонный пучки','status':'Отдельно не размечены'},
 {'filter':91270,'name':'LT: тыльный и ладонный пучки','status':'Отдельно не размечены'},
 {'filter':91271,'name':'Ладонная лучелоктевая связка','status':'Отдельно не размечена'},
 {'filter':91271,'name':'Тыльная лучелоктевая связка','status':'Отдельно не размечена'},
 {'filter':91271,'name':'Фовеальное / шиловидное прикрепления','status':'Два приблизительных ориентира; волокна не выделены'},
 {'filter':91271,'name':'Локтеполулунная / локтетрёхгранная связки','status':'В исходнике только общее обозначение'},
 {'filter':91271,'name':'Гомолог мениска','status':'Отдельно не размечен'},
 {'filter':91271,'name':'Ligamentum subcruentum','status':'Отдельно не размечено'},
 {'filter':91271,'name':'Собственный футляр ECU (subsheath)','status':'Отдельно не размечен; влагалище есть в исходнике'}]
data['review']={'version':'1.28','scope':'Coronal frames 12–14, source series 668; shared source coordinates for T1 and PD-SPIR','limitations':'All added landmarks approximate; no segmentation or independent expert validation. No new axial/sagittal/3D landmarks.','source':'https://pmc.ncbi.nlm.nih.gov/articles/PMC7509702/'}
path.write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')))
(ROOT/'review/wrist-landmarks-1.28.json').write_text(json.dumps({'review':data['review'],'points':review,'coverage':data['coverage']},ensure_ascii=False,indent=2))
print('Added',len(review),'reviewable teaching points; original source snapshot preserved.')
