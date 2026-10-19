"""Derived focused module. Canvas crops preserve decoded pixels; source assets stay untouched.
All new contours/landmarks below are explicit, approximate teaching topography.
No interpolation, synthesis or assumed DICOM geometry.
"""
from pathlib import Path
import json,hashlib,copy
R=Path(__file__).resolve().parents[1];A=R/'app/src/main/assets'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
D=json.loads((A/'male-pelvis-mri-data.json').read_text());L=json.loads((A/'male-pelvis-mri-labels.json').read_text())
# Separate groups allow either sphincter to be switched off independently.
groups=[(15801,'Внутренний сфинктер',True),(15802,'Наружный сфинктер',True),(15803,'Puborectalis и леваторы',True),(15804,'Пространства и ориентиры',True),(15805,'Мышцы промежности',False),(15806,'Фасции и опорные структуры',False),(15807,'Сосуды и нервы',False)]
mapping={2848:15801,2135:15802,2124:15803,2125:15803,2129:15803,2130:15803,2131:15803,2134:15803,2270:15803,2838:15804,2840:15804,2839:15804,3722:15804,3707:15804,3724:15804,3711:15804,3716:15804,3708:15804,9199:15804,3713:15805,3714:15805,3715:15805,3719:15805,2109:15806,2121:15806,2122:15806,2139:15806,3717:15806,3712:15806,980:15806,4751:15807,4752:15807,5211:15807,5208:15807,7438:15807,7439:15807}
short={2848:'Внутренний сфинктер',2135:'Наружный сфинктер',2130:'Puborectalis',2124:'Леватор',3722:'Седалищно-анальная ямка',2838:'Анальный канал',3707:'Тело промежности',3724:'Канал Алькока',2139:'Анокопчиковое тело',2839:'Аноректальный изгиб',2840:'Аноректальный переход'}
notes={2848:'Продолжение циркулярного гладкомышечного слоя прямой кишки. Расположен внутри межсфинктерного пространства. Цвет: бирюзовый. Контуры ≈ — учебная топография, не точная сегментация.',2135:'Поперечнополосатый сфинктер, снаружи от межсфинктерного пространства. Цвет: розовый. Для свища важны уровень пересечения и объём вовлечения. Подкожная, поверхностная и глубокая части не размечены отдельно на этих JPEG.',2130:'Петля puborectalis охватывает аноректальный переход сзади. Ключевой ориентир для супрасфинктерного хода. Не отождествлять с наружным сфинктером.',2124:'Мышца, поднимающая задний проход: граница тазовой полости и седалищно-анальных ямок. Важно указать распространение выше или через леватор.',3722:'Жировая клетчатка латеральнее сфинктерного комплекса и ниже леватора. Более высокие отделы также называют седалищно-прямокишечной ямкой; это непрерывная область.',3707:'Фибромышечное тело промежности кпереди от анального канала. Ориентир переднего распространения.',3724:'Канал Алькока в запирательной фасции на латеральной стенке седалищно-анальной ямки; содержит половой сосудисто-нервный пучок.'}
baseNote='Исходная точка пользовательского атласа; координаты сохранены с поправкой только на обрезку. Не является независимой врачебной верификацией. '
labels={'source':'Focused male perianal anatomy derived from existing user-provided pelvis; original data preserved','storageKey':'perianal-mri-anatomy-v158','useSourceDefaults':True,'filters':{'perianal':[{'id':i,'name':n,'default':v,'parent':None,'layer':None,'icon':'menu-art/pelvis.webp'} for i,n,v in groups]},'slices':{},'seriesSlices':{},'structureNotes':{str(i):baseNote+notes.get(i,'') for i in mapping},'searchAliases':{'2130':'puborectalis пуборектальная лобково-прямокишечная','3724':'Алькок Alcock','2848':'IAS внутренний','2135':'EAS наружный'},'shortNames':{str(k):v for k,v in short.items()}}
module={'source':'Derived crop of male-pelvis-mri; no new acquisition or DICOM spatial geometry','series':[]};provenance=[]
# Native axis names retained: these are not anal-canal-aligned reconstructions.
settings={312:(17,48,(145,260,505,600)),313:(1,20,(220,180,570,510)),314:(32,67,(145,290,505,620))}

for s in D['series']:
 lo,hi,box=settings[s['sourceSeries']];x0,y0,x1,y1=box
 ns={**s,'id':'perianal-'+str(s['sourceSeries']),'module':'perianal','title':s['plane']+' · область анального канала','frames':[]}
 for sourceIndex,f in enumerate(s['frames'][lo-1:hi],lo):
  src=A/f['src'];target=f['src'] # Render native ROI directly from preserved source JPEG.
  nf={**f,'sourceIndex':sourceIndex,'src':target,'width':x1-x0,'height':y1-y0,'sourceImage':f['src'],'sourceSha256':sha(src),'crop':list(box),'sha256':sha(src)};ns['frames'].append(nf)
  points=[]
  for p in L['slices'][f['annotation']]['points']:
   if p['structure'] not in mapping or not(x0<=p['x']<x1 and y0<=p['y']<y1):continue
   g=mapping[p['structure']];q={**p,'x':p['x']-x0,'y':p['y']-y0,'sourceX':p['x'],'sourceY':p['y'],'filter':g,'category':{15801:'internalSphincter',15802:'externalSphincter',15803:'muscles',15804:'perianalSpaces',15805:'muscles',15806:'ligaments'}.get(g,'nerves' if p['structure'] in [7438,7439] else 'veins' if p['structure'] in [5211,5208] else 'arteries')}
   points.append(q)
  labels['slices'][f['annotation']]={'points':points,'masks':[]}
  provenance.append({'src':target,'source':f['src'],'crop':list(box),'sourceSha256':sha(src),'sha256':sha(src)})
 module['series'].append(ns)
# Explicit paired wall contours on individually reviewed control frames, in original coordinates.
# Outer + inner polygons are rendered using even-odd fill, leaving lumen/central tissue visible.
controls=[
(312,34,2848,[[299,382],[319,379],[337,392],[340,414],[328,436],[310,442],[293,431],[285,410],[289,392]],[[303,391],[318,390],[329,399],[330,413],[322,428],[310,431],[301,423],[296,410]]),
(312,34,2135,[[284,376],[307,367],[331,372],[350,389],[358,417],[349,443],[328,461],[305,461],[285,448],[273,425],[271,401]],[[293,383],[314,376],[336,387],[346,409],[341,432],[326,449],[307,450],[290,437],[280,415],[282,395]]),
(312,38,2848,[[296,390],[312,385],[327,392],[334,406],[329,425],[317,439],[302,437],[291,426],[286,409]],[[300,399],[312,395],[322,400],[324,410],[319,425],[308,428],[299,421],[296,409]]),
(312,38,2135,[[282,382],[303,374],[327,380],[344,396],[349,415],[338,442],[320,454],[301,451],[283,436],[274,415],[275,396]],[[293,390],[313,383],[331,392],[340,411],[332,432],[317,445],[302,442],[289,429],[282,410]]),
(314,50,2848,[[303,467],[315,469],[321,491],[323,515],[315,540],[303,550],[297,537],[298,513],[297,488]],[[306,480],[312,482],[314,499],[314,520],[308,537],[305,534],[306,514]]),
(314,50,2135,[[285,482],[297,490],[297,517],[301,542],[313,553],[329,539],[332,513],[331,490],[343,478],[344,508],[340,539],[325,561],[307,568],[288,554],[278,531],[277,507]],[[291,496],[292,520],[298,545],[311,561],[326,548],[335,528],[338,504],[337,491],[331,489],[332,513],[329,539],[313,553],[301,542],[297,517],[297,496]]),
(314,54,2848,[[301,479],[314,482],[321,499],[321,519],[311,537],[301,533],[297,514],[297,496]],[[305,490],[311,492],[315,504],[313,520],[307,527],[304,515]]),
(314,54,2135,[[285,478],[294,485],[294,507],[298,530],[308,543],[320,536],[327,515],[329,490],[338,479],[341,505],[335,534],[320,553],[303,557],[287,542],[278,520],[278,497]],[[290,491],[287,511],[294,534],[305,547],[317,545],[330,529],[336,506],[334,489],[329,490],[327,515],[320,536],[308,543],[298,530],[294,507],[294,491]]),
(313,1,2848,[[362,340],[374,345],[383,365],[391,387],[387,409],[376,414],[369,397],[367,377]],None),
(313,1,2135,[[392,361],[408,367],[420,390],[418,419],[404,440],[390,448],[377,444],[372,432],[391,422],[401,405],[402,387]],None),
]
for sid,n,structure,outer,inner in controls:
 s=next(s for s in module['series'] if s['sourceSeries']==sid);f=next(f for f in s['frames'] if f['sourceIndex']==n);x0,y0,*_=f['crop'];a=labels['seriesSlices'].setdefault(s['id'],{}).setdefault(f['annotation'],{'regions':[]})
 region={'structure':structure,'name':'≈ '+short[structure]+' · учебный контур','shortName':'≈ '+short[structure],'filter':mapping[structure],'category':'internalSphincter' if structure==2848 else 'externalSphincter','vertices':[[x-x0,y-y0] for x,y in outer],'closed':True,'labelAnchor':False,'width':2,'approximate':True,'observedBoundary':False,'provenance':'manual-control-frame-158'}
 if inner:region['holes']=[[[x-x0,y-y0] for x,y in inner]]
 a['regions'].append(region)
# Only selected frames receive expected-space points. No copying between slices.
landmarks=[(312,38,158801,'Межсфинктерное пространство',280,410),(314,50,158801,'Межсфинктерное пространство',295,516),(313,1,158801,'Межсфинктерное пространство',391,399),(314,50,158802,'Супралеваторное пространство',289,367),(312,30,158803,'Глубокое позадианальное пространство',319,510),(313,1,158804,'Продольный мышечный слой',392,374)]
spaceNotes={158801:'Потенциальное пространство между внутренним и наружным сфинктерами; содержит продольную мышцу. Основной путь межсфинктерного распространения. Точка ≈ показывает ожидаемую область, а не видимую полость.',158802:'Клетчатка выше мышцы, поднимающей задний проход. Указать источник и путь распространения; супралеваторное распространение само по себе не определяет тип Parks.',158803:'Глубокое позадианальное пространство кзади от сфинктерного комплекса и ниже леваторной пластинки. Здесь возможно заднее подковообразное распространение. Ожидаемая область, не отдельная видимая фасциальная полость.',158804:'Тонкий продольный мышечный слой проходит между сфинктерами. На этих JPEG надёжно не отделяется; указан только ожидаемый ход.'}
for sid,n,k,name,x,y in landmarks:
 s=next(s for s in module['series'] if s['sourceSeries']==sid);f=next(f for f in s['frames'] if f['sourceIndex']==n);x0,y0,*_=f['crop'];labels['slices'][f['annotation']]['points'].append({'id':k*100+sid,'structure':k,'name':'≈ '+name,'x':x-x0,'y':y-y0,'filter':15804,'category':'perianalSpaces','approximate':True,'observedBoundary':False,'provenance':'expected-topography-158'});labels['structureNotes'][str(k)]=spaceNotes[k]
# Clock anchors follow each frame's original canal point, never an interpolated range.
labels['perianalOrientation']={s['id']:{'plane':{312:'axial',313:'sagittal',314:'coronal'}[s['sourceSeries']],'clock':{}} for s in module['series']}
for s in module['series']:
 if s['sourceSeries']!=312:continue
 for f in s['frames']:
  canal=next((p for p in labels['slices'][f['annotation']]['points'] if p['structure']==2838),None)
  if canal:labels['perianalOrientation'][s['id']]['clock'][f['annotation']]={'x':canal['x'],'y':canal['y'],'r':66}
for name,obj in [('perianal-mri-data.json',module),('perianal-mri-labels.json',labels)]: (A/name).write_text(json.dumps(obj,ensure_ascii=False,separators=(',',':'))+'\n')
(R/'review/perianal-1.58.json').write_text(json.dumps({'sourceFiles':{f:sha(A/f) for f in ['male-pelvis-mri-data.json','male-pelvis-mri-labels.json']},'frames':len(provenance),'contours':len(controls),'landmarks':len(landmarks),'images':provenance,'limitations':['Native pelvic JPEGs, sequence not confirmed by source metadata','No STIR, no dedicated oblique anal acquisition, no DICOM geometry','Contour positions approximate; no independent physician verification','Dentate line not marked on MRI']},ensure_ascii=False,indent=2))
print('perianal158',len(provenance),'frames',len(controls),'explicit teaching contours',len(landmarks),'expected-space points')
