"""Map original figure panels to viewports; never rewrite medical image bytes.
Coordinates were reviewed against all 56 original compositions. Requires Pillow.
"""
from pathlib import Path
import json,hashlib
from PIL import Image
ASSETS=Path(__file__).resolve().parents[1]/'app/src/main/assets'
layouts={}
def put(module,file,rows):
 p=ASSETS/(module+'-cases')/file;w,h=Image.open(p).size;panels=[]
 for y0,y1,xs,labels in rows:
  assert len(xs)==len(labels)+1
  for x0,x1,label in zip(xs,xs[1:],labels):
   box=[round(x0*w),round(y0*h),round(x1*w)-round(x0*w),round(y1*h)-round(y0*h)]
   panels.append({'label':label,'box':box})
 layouts[str(p.relative_to(ASSETS))]={'width':w,'height':h,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'panels':panels}
def grid(module,file,labels,cols,ys=None,xs=None):
 rows=(len(labels)+cols-1)//cols;ys=ys or [i/rows for i in range(rows+1)];xs=xs or [i/cols for i in range(cols+1)]
 put(module,file,[(ys[r],ys[r+1],xs,labels[r*cols:(r+1)*cols])for r in range(rows)])
def L(file,labels,cols=2,ys=None,xs=None):grid('liver',file,labels,cols,ys,xs)
def R(file,labels,cols=2,ys=None,xs=None):grid('rectal',file,labels,cols,ys,xs)
def E(file,labels,cols=2,ys=None,xs=None):grid('endometriosis',file,labels,cols,ys,xs)
L('frontiers-01.jpg',['A · МРТ T2, аксиально','B · МРТ, артериальная фаза','C · МРТ, портальная фаза','D · МРТ, поздняя фаза, коронально'])
L('frontiers-02.jpg',['A · МРТ T2','B · DWI b=880','C · Карта ADC','D · Артериальная фаза','E · Портальная фаза','F · Поздняя фаза'],3)
L('frontiers-03.jpg',['A · МРТ T1','B · МРТ T2 FS','C · DWI b=880; ADC не показан','D · Артериальная фаза','E · Портальная фаза','F · Поздняя фаза'],3)
L('frontiers-04.jpg',['A · МРТ T1 FS, артериальная фаза','B · МРТ T1 FS, портальная фаза'])
L('frontiers-05.jpg',['A · Артериальная фаза','B · Портальная фаза','C · Переходная фаза','D · Гепатобилиарная фаза'])
L('frontiers-06.jpg',['A · Артериальная субфаза 1','B · Артериальная субфаза 2','C · Артериальная субфаза 3'],3)
put('liver','frontiers-07.jpg',[(0,.516,[0,.300,.631,1],['A · МРТ T1 in-phase','B · МРТ T1 opposed-phase','C · МРТ T2 FS']),(.516,1,[0,.191,.407,.601,1],['D · Артериальная фаза','E · Портальная фаза','F · Переходная фаза','G · Гепатобилиарная фаза'])])
L('frontiers-08.jpg',['A · МРТ T2','B · МРТ T1 in-phase','C · МРТ T1 opposed-phase','D · Артериальная фаза','E · Портальная фаза','F · Гепатобилиарная фаза'],3)
L('frontiers-09.jpg',['A · МРТ T2','B · МРТ T1','C · DWI b=800','D · Карта ADC'])
L('frontiers-10.jpg',['A · МРТ T2','B · МРТ T1 opposed-phase','C · DWI b=800','D · Карта ADC'])
L('mimickers-03.png',['a · МРТ T2','b · DWI, высокий b','c · Карта ADC','d · МРТ T1','e · Артериальная фаза','f · Гепатобилиарная фаза'],3)
L('mimickers-04.png',['a · МРТ, артериальная фаза','b · МРТ, портальная фаза','c · МРТ T2','d · Контрастное УЗИ, ранняя артериальная фаза','e · Контрастное УЗИ, артериальная фаза','f · Контрастное УЗИ, поздняя артериальная фаза'],3)
L('mimickers-06.png',['a · Обычное УЗИ','b · Контрастное УЗИ','c · Контрастное УЗИ','d · МРТ T1 in-phase','e · МРТ T1 opposed-phase','f · МРТ T2','g · МРТ, артериальная фаза','h · МРТ, портальная фаза','i · МРТ, гепатобилиарная фаза'],3)
put('liver','mimickers-07.png',[(0,.5,[0,1/3,2/3,1],['a · МРТ, артериальная фаза','b · МРТ, портальная фаза','c · МРТ T2 FS']),(.5,1,[0,2/3],['d · Допплеровское УЗИ'])])
L('mimickers-08.png',['a · УЗИ','b · МРТ T2','c · МРТ T2 с подавлением жира','d · МРТ T1','e · Артериальная фаза','f · Портальная фаза'],3)
L('mimickers-09.png',['a · МРТ T2','b · Артериальная фаза','c · Портальная фаза','d · Равновесная фаза'],4)
put('liver','mimickers-10.png',[(0,.25,[0,1/3],['a · УЗИ']),(.25,.5,[0,1/3,2/3,1],['b · КТ без контраста','c · КТ, портальная фаза','d · КТ, равновесная фаза']),(.5,.75,[0,1/3,2/3,1],['e · МРТ T2','f · DWI','g · Карта ADC']),(.75,1,[0,1/3,2/3,1],['h · МРТ, артериальная фаза','i · МРТ, портальная фаза','j · МРТ, гепатобилиарная фаза'])])
L('peripheral-02.jpg',['a · МРТ T2 FS','b · DWI','c · Карта ADC','d · МРТ T1 до контраста','e · Артериальная фаза','f · Поздняя фаза'],3)
L('peripheral-03.jpg',['a · МРТ T2 FS','b · DWI','c · Карта ADC','d · МРТ T1 до контраста','e · Артериальная фаза','f · Портальная фаза','g · Поздняя фаза','h · HBP через 2 ч после гадобената'],4)
L('peripheral-07.jpg',['a · МРТ T2 FS','b · МРТ T1','c · Артериальная фаза','d · Портальная фаза','e · Поздняя фаза, 3 мин','f · Поздняя фаза, 5 мин'],3)
L('cystic-03.jpg',['a · УЗИ','b · МРТ T2','c · КТ до контраста','d · КТ, портальная фаза'])
L('cystic-07.jpg',['a · МРТ T1 FS','b · МРТ T2','c · МРТ T1 FS после контраста','d · Субтракция'])
L('cystic-19.jpg',['a · МРТ T2, обзор','a · МРТ T2, деталь','b · МРТ T1, портальная фаза, обзор','b · МРТ T1, портальная фаза, деталь'])
L('cystic-29.jpg',['a · КТ без контраста','b · КТ, портальная фаза','c · МРТ T2','d · Корональная 3D MRCP'])
R('staging-12.png',['a · T1sm3 / ранний T2 · пример из источника','b · T1sm3 / ранний T2 · другая плоскость','c · T2 · пример из источника','d · T2 · другой пример','e · T3b · пример из источника','f · T3b · другая плоскость','g · T4b · пример из источника','h · T4b · другая плоскость'],ys=[0,.23,.49,.75,1],xs=[0,.527,1])
R('anatomy-01.jpg',['a · Аксиальная T2 · пациент 1','b · Аксиальная T2 · пациент 2'])
R('anatomy-09.jpg',['a · Корональная T2','b · Аксиальная T2, уровень B','c · Аксиальная T2, уровень C'],3)
R('staging-13.png',['a · MRF · клинический пример 1','b · MRF · клинический пример 2'])
R('anatomy-05.png',['a · Анатомическая схема','b · Корональная T2','c · Корональная T2'],3,xs=[0,.377,.69,1])
R('anatomy-11.jpg',['a · Аксиальная T2 · пациент 1','b · Аксиальная T2 · пациент 2'])
R('staging-15.png',['a · МРТ · мезоректальная область','b · МРТ · латеральная область'])
R('staging-10.png',['a · МРТ · плоскость 1','b · МРТ · плоскость 2','c · МРТ · плоскость 3'],3)
R('staging-16.png',['a · МРТ · плоскость 1','b · МРТ · плоскость 2'])
R('anatomy-03.jpg',['a · Сагиттальная T2 · норма','b · Аксиальная T2 · норма'])
R('staging-06.png',['a · Косо-аксиальное изображение','b · Сагиттальное изображение','c · Пример с небольшим количеством жидкости'],3)
R('staging-21.png',['a · T2 · пример 1','b · T2 · пример 2','c · T2 · пример 3','d · DWI b0','e · T2 · низкий муцинозный рак','f · T1 · тот же низкий муцинозный рак'])
R('anatomy-13.jpg',['a · T2 · ранняя опухоль до лечения','b · T2 · ранняя опухоль после лечения','c · T2 · инвазия пузыря до лечения','d · T2 · после лечения'])
R('mdpi-02.png',['A · Аксиальная T2 до лечения','B · T2 после лечения','C · DWI','D · Эндоскопия'],4,xs=[0,.2517,.5035,.7547,1])
R('mdpi-03.png',['A · Аксиальная T2 до лечения','B · T2 после лечения','C · DWI','D · Карта ADC'],4,xs=[0,.2511,.4997,.7495,1])
R('mdpi-04.png',['A · T2 до лечения','B · T2 после лечения','C · DWI','D · Эндоскопия'],4,xs=[0,.2528,.5068,.7587,1])
R('mdpi-05.png',['A · Косо-аксиальная T2 до лечения','B · T2 после TNT','C · DWI b800','D · Карта ADC','E · Эндоскопия'],5,xs=[0,.194,.3851,.576,.766,1])
R('mdpi-06.png',['A · T2 после лечения','B · DWI','C · Карта ADC'],3,xs=[0,.3329,.6672,1])
R('mdpi-07.png',['A · T2 после лечения','B · DWI','C · Карта ADC'],3,xs=[0,.3357,.6692,1])
R('mdpi-08.png',['A · Аксиальная T2 до лечения','B · Аксиальная T2 после лечения'],xs=[0,.4967,1])
E('figure-07.png',['A · Аксиальная T1','B · Аксиальная T1 FS'])
E('figure-08.png',['A · Аксиальная T2','B · Аксиальная T1 FS'])
E('figure-03.png',['Одиночное МР-изображение; серия не уточнена в источнике'],1)
E('figure-04.png',['A · Аксиальная T2','B · Аксиальная T2','C · Корональная T2'],3)
E('figure-05.png',['Сагиттальная T2'],1)
E('figure-06.png',['Одиночное МР-изображение; серия не уточнена в источнике'],1)
E('figure-01.png',['A · Сагиттальная T2','B · Сагиттальная T1 FS','C · Корональная T2'],3)
E('figure-16.png',['A · Аксиальная T2','B · Сагиттальная T2','C · Аксиальная T2','D · Аксиальная T1 FS'],ys=[0,.518,1],xs=[0,.514,1])
E('figure-09.png',['A · Сагиттальная T2','B · Аксиальная T2'],xs=[0,.418,1])
E('figure-10.png',['A · Сагиттальная T2','B · Сагиттальная T2','C · Сагиттальная T1 FS'],3,xs=[0,.356,.683,1])
E('figure-12.png',['A · Аксиальная T2','B · Аксиальная T1','C · Аксиальная T1 FS','D · Аксиальная T1 после контраста'])
E('figure-14.png',['A · Корональная T2','B · Корональная T1 FS','C · Аксиальная T2','D · Аксиальная T1'],ys=[0,.535,1])
# The Frontiers compositions use uneven columns/rows; equal grids clip letters.
def revise(file,rows):
 labels=[p['label']for p in layouts['liver-cases/'+file]['panels']];out=[];offset=0
 for y0,y1,xs in rows:
  n=len(xs)-1;out.append((y0,y1,xs,labels[offset:offset+n]));offset+=n
 assert offset==len(labels);put('liver',file,out)
revise('frontiers-01.jpg',[(0,.4844,[0,.509,1]),(.4844,1,[0,.520,1])])
revise('frontiers-02.jpg',[(0,.497,[0,.313,.628,1]),(.497,1,[0,.313,.631,1])])
revise('frontiers-03.jpg',[(0,.477,[0,.333,.633,1]),(.477,1,[0,.333,.633,1])])
revise('frontiers-06.jpg',[(0,1,[0,.311,.629,1])])
revise('frontiers-08.jpg',[(0,.475,[0,.336,.646,1]),(.475,1,[0,.308,.646,1])])
revise('frontiers-09.jpg',[(0,.4844,[0,.528,1]),(.4844,1,[0,.528,1])])
revise('frontiers-10.jpg',[(0,.52,[0,.513,1]),(.52,1,[0,.513,1])])
# Figure d itself contains two adjacent ultrasound views.
put('liver','mimickers-07.png',[(0,.5,[0,1/3,2/3,1],['a · МРТ, артериальная фаза','b · МРТ, портальная фаза','c · МРТ T2 FS']),(.5,1,[0,1/3,2/3],['d · УЗИ, B-режим','d · Цветовой допплер'])])
assert len(layouts)==56
(ASSETS/'case-panel-layouts.js').write_text('export const layouts='+json.dumps(layouts,ensure_ascii=False,indent=2)+';\n')
print(len(layouts),'compositions;',sum(len(x['panels'])for x in layouts.values()),'panels')
