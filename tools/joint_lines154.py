"""Explicit joint-gap landmarks; immutable source images/labels, no interpolation.
Recovered after environment loss: every published path was reviewed again on native JPEG.
"""
from pathlib import Path
import json,hashlib
R=Path(__file__).resolve().parents[1];A=R/'app/src/main/assets'
COMMON=' Короткая пунктирная линия — приблизительный учебный ориентир щели на явно указанном срезе, не сегментация хряща или всей полости. На соседние срезы автоматически не переносится.'
NAMES={1631:'Дистальный лучелоктевой сустав',1635:'Лучезапястный сустав',1642:'Межзапястные суставы',1643:'Среднезапястный сустав',1648:'Гороховидно-трёхгранный сустав',1653:'Запястно-пястные суставы II–V',1656:'Запястно-пястный сустав большого пальца',1657:'Межпястные суставы оснований',1662:'Пястно-фаланговые суставы',9622:'Межфаланговые суставы кисти',9675:'Проксимальные межфаланговые суставы',9676:'Дистальные межфаланговые суставы',1623:'Плечелоктевой сустав',1624:'Плечелучевой сустав',1625:'Проксимальный лучелоктевой сустав',1692:'Тазобедренный сустав',1677:'Крестцово-подвздошный сустав',1555:'Дугоотростчатые суставы',1556:'Пояснично-крестцовое соединение',1558:'Крестцово-копчиковое соединение',154301:'Бедренно-надколенниковое сочленение',154302:'Медиальная часть бедренно-большеберцового сочленения',154303:'Латеральная часть бедренно-большеберцового сочленения',154304:'Проксимальный большеберцово-малоберцовый сустав'}
# sourceSeries, 1-based frame, identity, explicit native-pixel vertices, local short label
ROWS={
'hand':[
 [165,5,1631,[[423,378],[419,391],[415,404]],'Дистальный лучелоктевой'],
 [166,26,1635,[[311,80],[324,80],[339,85]],'Лучезапястный'],
 [166,26,1643,[[311,118],[324,117],[337,120]],'Среднезапястный'],
 [166,26,1653,[[319,184],[329,185],[341,188]],'Запястно-пястный III'],
 [166,26,1662,[[307,379],[320,383],[335,381]],'Пястно-фаланговый III'],
 [166,26,9675,[[314,515],[324,518],[336,517]],'Проксимальный МФС III'],
 [166,26,9676,[[324,603],[334,605],[343,603]],'Дистальный МФС III'],
 [167,12,1635,[[354,57],[370,60],[387,65]],'Лучезапястный'],
 [167,12,1643,[[346,94],[359,99],[370,109]],'Среднезапястный'],
 [167,12,1656,[[239,144],[250,149],[260,153]],'Запястно-пястный I'],
],
'wrist':[
 [668,13,1631,[[420,181],[421,195],[422,209]],'Дистальный лучелоктевой'],
 [668,13,1635,[[344,230],[367,224],[390,224]],'Лучезапястный'],
 [668,13,1643,[[346,278],[366,282],[386,291]],'Среднезапястный'],
 [668,13,1642,[[411,332],[410,342],[411,351]],'Головчато-крючковидный'],
 [668,13,1653,[[406,406],[421,405],[435,401]],'Запястно-пястный IV'],
 [668,13,1657,[[343,424],[343,434],[344,444]],'Межпястный II–III'],
 [669,15,1635,[[383,205],[399,210],[412,219]],'Лучезапястный'],
 [669,15,1643,[[363,272],[378,276],[393,279]],'Среднезапястный'],
 [669,15,1653,[[371,391],[385,392],[398,392]],'Запястно-пястный III'],
],
'elbow':[
 [643,20,1623,[[377,350],[396,342],[412,345]],'Плечелоктевой'],
 [643,20,1624,[[263,363],[284,368],[306,366]],'Плечелучевой'],
 [643,20,1625,[[351,379],[351,392],[350,405]],'Проксимальный лучелоктевой'],
 [644,12,1624,[[323,350],[342,354],[363,354],[383,349]],'Плечелучевой'],
],
'knee':[
 [652,28,154301,[[165,112],[186,117],[208,124],[230,120],[248,114]],'Бедренно-надколенниковое'],
 [654,18,154303,[[153,350],[174,350],[194,344]],'Бедренно-большеберцовое · лат.'],
 [654,18,154302,[[273,348],[292,352],[311,356]],'Бедренно-большеберцовое · мед.'],
 [653,18,154302,[[174,360],[192,361],[211,358]],'Бедренно-большеберцовое · мед.'],
],
'hip':[
 [632,20,1692,[[381,256],[386,277],[382,299]],'Тазобедренный'],
 [633,16,1692,[[285,286],[302,280],[319,282],[336,289]],'Тазобедренный'],
 [634,20,1692,[[277,259],[294,254],[313,257],[330,267]],'Тазобедренный'],
]}
GROUPS={'hand':409,'wrist':1258,'elbow':1193,'knee':15431,'hip':1163}
RECLASS={
 'hand':{}, # existing 1.53 subgroups retained
 'wrist':{15421:('Каналы и межкостные промежутки',[1651,1652,1661]),15422:('Капсула и завороты',[1633])},
 'elbow':{15423:('Капсула, полость и складки',[1420,1424,1427,1630])},
 'knee':{},
 'hip':{15441:('Отверстия и каналы',[1672,1684,1685]),15442:('Лобковый симфиз',[1673]),15443:('Другие соединения позвоночника',[1556,1558])}}
report={'revision':'1.54','base':'93517041f99e387a714722527c25742c26596590','recovery':'Unpublished earlier working files were lost with environment. Published geometry below was reconstructed and reviewed again; earlier 40-path test claims do not apply to this tree.','modules':{}}
for m,rows in ROWS.items():
 dp=A/f'{m}-mri-data.json';lp=A/f'{m}-mri-labels.json';d=json.loads(dp.read_text());l=json.loads(lp.read_text());code=next(iter(l['filters']));root=GROUPS[m]
 oldgroup=1219 if m=='knee' else root
 source={p['structure']:p['name'] for sl in l['slices'].values() for p in sl['points'] if p['filter']==oldgroup}
 true=set(source)-{1651,1652,1661,1633,1420,1424,1427,1630,1672,1673,1682,1684,1685} if m!='knee' else set()
 
 if m=='hip':true-={1556,1558}
 identities=set(true)|{r[2] for r in rows}; names={str(k):NAMES[k] for k in identities if k in NAMES}
 icon=next(f['icon'] for f in l['filters'][code] if f['id']==oldgroup)
 filters=[{'id':root,'name':'Суставы','parent':None,'layer':None,'default':False if m=='knee' else next(f['default'] for f in l['filters'][code] if f['id']==oldgroup),'icon':icon}]
 if m=='knee':filters.append({'id':1219,'name':'Мениски и внутрисуставные структуры','parent':None,'layer':None,'default':False,'icon':icon})
 pp={str(k):{'category':'cartilage'} for k in true};migration=[]
 for gid,(name,ids) in RECLASS[m].items():
  filters.append({'id':gid,'name':name,'parent':None,'layer':None,'default':m=='hip','icon':icon});migration.append([oldgroup,gid])
  for k in ids:pp[str(k)]={'filter':gid,'category':'cartilage' if gid in [15442,15443] else 'organs'}
 if m=='hip':pp['1682']={'filter':1164,'category':'ligaments'}
 if m=='knee':names.update({'1704':'Передний рог латерального мениска','1705':'Задний рог латерального мениска','1709':'Передний рог медиального мениска','1710':'Задний рог медиального мениска','1715':'Медиальная околонадколенниковая синовиальная складка','1716':'Наднадколенниковая синовиальная складка'})
 if m=='wrist':names.update({'1633':'Мешкообразный заворот дистального лучелоктевого сустава','1651':'Запястный канал','1652':'Локтевой канал (Гийона)'})
 if m=='elbow':names['1630']='Мешкообразный заворот проксимального лучелоктевого сустава'
 if m=='hip':names.update({'1682':'Серповидный отросток крестцово-бугорной связки','91':'Область тазобедренного сустава'})
 limitation='Линии есть только на перечисленных контрольных срезах. Полное покрытие всех суставов/пальцев не заявляется. Независимая врачебная верификация не проведена.'
 untraced=sorted(true-{r[2] for r in rows})
 notes={str(k):NAMES.get(k,source.get(k,''))+COMMON+(' В этом наборе отдельная уверенная линия не добавлена.' if k in untraced else '') for k in identities}
 if m=='hip':notes['1673']='Лобковый симфиз — фиброзно-хрящевое соединение; исходные точки сохранены в отдельной группе. Не заменяется линией синовиального сустава.'
 if m=='knee':notes['154304']=NAMES[154304]+'. Отдельная уверенная линия на проверенных кадрах не добавлена.';names['154304']=NAMES[154304]
 extra={'revision':'1.54','filters':filters,'displayNames':names,'pointPresentation':pp,'structureNotes':notes,'searchAliases':{},'seriesSlices':{},'migration':migration,'guideTitle':'Суставы · подробнее','guideHint':limitation,'guideChapters':[['Суставы · контрольные срезы',sorted(identities|({154304} if m=='knee' else set()))]],'catalogNames':names,'sources':[],'limitations':[limitation]}
 records=[]
 for s in d['series']:
  if s['group']!='multiplanar':continue
  ss=extra['seriesSlices'].setdefault(s['id'],{})
  for f in s['frames']:ss[f['annotation']]={'points':[],'regions':[],'suppress':sorted(true),'suppressMasks':[oldgroup] if m in ['hand','wrist','hip'] else []}
 for se,n,k,verts,short in rows:
  for s in d['series']:
   if s['sourceSeries']!=se or s['group']!='multiplanar':continue
   f=s['frames'][n-1];region={'structure':k,'name':NAMES[k],'shortName':short,'filter':root,'category':'cartilage','approximate':True,'kind':'joint-line','lineMarker':True,'vertices':verts,'width':3}
   extra['seriesSlices'][s['id']][f['annotation']]['regions'].append(region)
   records.append({'series':s['id'],'sourceSeries':se,'frame':n,'annotation':f['annotation'],'imageSha256':f['sha256'],'structure':k,'vertices':verts})
 (A/f'{m}-mri-joints154.json').write_text(json.dumps(extra,ensure_ascii=False,separators=(',',':'))+'\n')
 decisions=[{'annotation':sid,'pointId':p['id'],'structure':p['structure'],'x':p['x'],'y':p['y'],'decision':'MRI dot suppressed; explicit paths only; 3D points retained' if p['structure'] in true else 'retained; presentation classification only'} for sid,sl in l['slices'].items() for p in sl['points'] if p['filter']==oldgroup]
 report['modules'][m]={'manualPaths':len(rows),'renderRecords':len(records),'untraced':untraced,'sourceDataSha256':hashlib.sha256(dp.read_bytes()).hexdigest(),'sourceLabelsSha256':hashlib.sha256(lp.read_bytes()).hexdigest(),'records':records,'sourcePointDecisions':decisions}
report['manualPaths']=sum(v['manualPaths'] for v in report['modules'].values());report['renderRecords']=sum(v['renderRecords'] for v in report['modules'].values())
(R/'review/joint-lines-1.54.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(report['manualPaths'],report['renderRecords'])
