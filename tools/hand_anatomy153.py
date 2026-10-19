"""Presentation-only hand audit. No source image, point, ID or coordinate is edited."""
from pathlib import Path
import json,hashlib,collections,re
R=Path(__file__).resolve().parents[1];A=R/'app/src/main/assets'
def run():
 d=json.loads((A/'hand-mri-data.json').read_text());l=json.loads((A/'hand-mri-labels.json').read_text());structures={}
 for sid,sl in l['slices'].items():
  for p in sl['points']:
   v=structures.setdefault(p['structure'],{'id':p['structure'],'sourceName':p['name'],'sourceFilter':p['filter'],'points':0});v['points']+=1
 shorts={1632:'Суставной диск',1663:'Коллатеральные связки ПФС',1667:'Коллатеральные связки МФС',1664:'Ладонные пластинки ПФС',1668:'Ладонные пластинки МФС',2406:'Фиброзное влагалище',2410:'Vincula tendinum'}
 names={1651:'Запястный канал',1652:'Локтевой канал (Гийона)',1661:'Межкостные промежутки пясти',1663:'Коллатеральные связки пястно-фаланговых суставов',1664:'Ладонные пластинки пястно-фаланговых суставов',1667:'Коллатеральные связки межфаланговых суставов',1668:'Ладонные пластинки межфаланговых суставов',9622:'Межфаланговые суставы кисти',9675:'Проксимальные межфаланговые суставы (PIP)',9676:'Дистальные межфаланговые суставы (DIP)',9623:'Тыльные пальцевые вены',2195:'Межсухожильные соединения разгибателей (juncturae tendinum)',2406:'Фиброзные влагалища сухожилий сгибателей пальцев',2410:'Удерживающие связочки сухожилий (vincula tendinum)',2216:'Мышца, противопоставляющая мизинец',1632:'Суставной диск дистального лучелоктевого сустава',2244:'Удерживатель сухожилий разгибателей',2247:'Удерживатель сухожилий сгибателей',1122:'Тыльный бугорок лучевой кости (Листера)'}
 aliases={1651:'карпальный canal carpal tunnel',1652:'Guyon Гийон',1663:'MCP ПФС RCL UCL лучевая локтевая',1667:'PIP DIP ПМФС ДМФС коллатеральная',1664:'volar plate ладонная связка MCP ПФС',1668:'volar plate ладонная связка PIP DIP',2406:'pulley annular кольцевые блоки A1 A2 A3 A4 A5',2410:'vincula tendinum',2195:'juncturae tendinum',9623:'Dorsal digital veins'}
 notes={1663:'Исходные общие метки коллатеральных связок ПФС. Лучевая/локтевая стороны и собственный/добавочный пучки отдельно не идентифицированы.',1667:'Исходные общие метки коллатеральных связок межфаланговых суставов. Номер пальца и отдельный пучок не назначаются автоматически.',1664:'Ладонная пластинка ПФС. Это капсульное образование; не синоним кольцевого блока A1.',1668:'Ладонные пластинки межфаланговых суставов. Не подменяют блоки A3/A5.',2406:'Исходная метка фиброзного влагалища в целом. Поиск A1–A5 ведёт к этой группе, но не подтверждает видимость отдельного блока. Кольцевые блоки II–V пальцев: A1 у ПФС, A2 у проксимальной фаланги, A3 у ПМФС, A4 у средней фаланги, A5 у ДМФС. Отдельные точки блоков в этом наборе не добавлены.',2410:'Vincula tendinum — связочки, соединяющие сухожилия с окружающими тканями. Не переименованы в кольцевые блоки A1–A5. Исходные координаты сохранены; индивидуальная видимость всех тонких связочек не подтверждена.',2195:'Соединения соседних сухожилий разгибателей. Это сухожильно-фасциальные перемычки, а не отдельная мышца.',1632:'Диск — только часть ТФХК. Подробный разбор комплекса доступен в отдельном МРТ-наборе запястья.',153201:'Блоки A1–A5 II–V пальцев описаны в справочнике. Индивидуальные точки не добавлены: обзорный JPEG-набор не позволяет уверенно отделить все блоки.',153202:'Большой палец имеет собственную систему блоков; схема A1–A5 II–V пальцев на него автоматически не переносится.'}
 for id,v in structures.items():
  n=v['sourceName']
  if v['sourceFilter']==412:
   stem=n.split(' - Сухожилие')[0];digit=re.search(r'\[([IVX]+)\]',n);digit=digit.group(1) if digit else None
   stem={'Длинная мышца, отводящая большой палец кисти':'длинной мышцы, отводящей большой палец (APL)','Длинная ладонная мышца':'длинной ладонной мышцы (PL)'}.get(stem,stem.lower())
   stem=stem.replace('поверхностный сгибатель пальцев','поверхностного сгибателя пальцев (FDS)').replace('глубокий сгибатель пальцев','глубокого сгибателя пальцев (FDP)').replace('разгибатель пальцев','разгибателя пальцев (EDC)').replace('разгибатель указательного пальца','разгибателя указательного пальца (EIP)').replace('разгибатель мизинца','разгибателя мизинца (EDM)').replace('длинный сгибатель большого пальца кисти','длинного сгибателя большого пальца (FPL)').replace('длинный разгибатель большого пальца кисти','длинного разгибателя большого пальца (EPL)').replace('короткий разгибатель большого пальца кисти','короткого разгибателя большого пальца (EPB)').replace('длинный лучевой разгибатель запястья','длинного лучевого разгибателя запястья (ECRL)').replace('короткий лучевой разгибатель запястья','короткого лучевого разгибателя запястья (ECRB)').replace('локтевой разгибатель запястья','локтевого разгибателя запястья (ECU)').replace('лучевой сгибатель запястья','лучевого сгибателя запястья (FCR)').replace('локтевой сгибатель запястья','локтевого сгибателя запястья (FCU)')
   names[id]='Сухожилие '+stem+(' · '+digit+' палец' if digit else '')
   abbr=re.findall(r'\(([A-Z]+)\)',stem);aliases[id]=' '.join(abbr)+(' '+digit if digit else '')
   if abbr:shorts[id]='Сухожилие '+abbr[0]+(' · '+digit if digit else '')
  if v['sourceFilter']==411:
   for base in ['Червеобразные мышцы','Тыльные межкостные мышцы','Ладонные межкостные мышцы']:
    if n.startswith(base):names[id]={'Червеобразные мышцы':'Червеобразная мышца','Тыльные межкостные мышцы':'Тыльная межкостная мышца','Ладонные межкостные мышцы':'Ладонная межкостная мышца'}[base]+' · '+re.search(r'\((\d)\)',n).group(1)
   if 'головка' in n.lower():names[id]=n.replace(': Поверхностная',': поверхностная').replace(': Глубокая',': глубокая')
  if id in names:aliases[id]=(aliases.get(id,'')+' '+n).strip()
 filters=[{'id':409,'name':'Суставы'},{'id':410,'name':'Связки и ладонные пластинки'},{'id':412,'name':'Сухожилия'},{'id':413,'name':'Фасции и удерживатели'}]
 def group(id,name,parent,default=False):filters.append({'id':id,'name':name,'parent':parent,'default':default})
 group(15301,'Каналы и межкостные промежутки',None)
 for id,name,parent,default in [(15302,'Связки запястья',410,False),(15303,'Связки и пластинки пальцев',410,False),(15304,'Сгибатели · сухожилия',412,True),(15305,'Разгибатели · сухожилия',412,True),(15307,'Фиброзные влагалища и связочки',413,False),(15308,'Тенар и приводящая мышца',411,True),(15309,'Гипотенар',411,True),(15310,'Межкостные мышцы',411,True),(15311,'Червеобразные мышцы',411,True),(15312,'Мышцы предплечья',411,True)]:group(id,name,parent,default)
 presentation={}
 for id,v in structures.items():
  f=v['sourceFilter'];target=f
  if f==410:target=15303 if id in {1663,1664,1665,1667,1668} else 15302
  if f==412:target=15304 if 'сгибател' in v['sourceName'].lower() or id==9313 else 15305
  if f==411:target=15311 if 2217<=id<=2220 else 15310 if 2223<=id<=2231 else 15309 if id in {2205,2214,2215,2216} else 15308 if id in {2206,2210,2211,9673,9678} else 15312
  if id==2195:target=413
  if id in {1651,1652,1661}:target=15301
  if id in {2406,2410}:target=15307
  if target!=f:presentation[id]={'filter':target}
  if id in {1664,1668}:presentation[id]['category']='ligaments'
  if id==1632:presentation[id]['category']='cartilage'
 for id,alias in {2206:'APB abductor pollicis brevis',2210:'OP opponens pollicis',2211:'AP adductor pollicis',2214:'ADM abductor digiti minimi',2215:'FDMB flexor digiti minimi brevis',2216:'ODM opponens digiti minimi',9673:'FPB flexor pollicis brevis',9678:'FPB flexor pollicis brevis'}.items():aliases[id]=(aliases.get(id,'')+' '+alias).strip()
 chapters=[['Сгибатели и разгибатели',[id for id,v in structures.items() if v['sourceFilter']==412]],['Мышцы кисти',[id for id,v in structures.items() if v['sourceFilter']==411 and id!=2195]],['Связки и ладонные пластинки',[id for id,v in structures.items() if v['sourceFilter']==410]],['Влагалища, блоки и удерживатели',[2406,2410,2244,2247,2195,153201,153202]]]
 for id,v in structures.items():
  if v['sourceFilter'] in {410,411,412,413}:notes.setdefault(id,'Исходная покадровая метка атласа. Название и группа уточнены для просмотра; координаты сохранены. Полнота хода и прикреплений отдельно не подтверждается.')
 extra={'revision':153,'filters':filters,'displayNames':names,'shortNames':shorts,'searchAliases':aliases,'structureNotes':notes,'pointPresentation':presentation,'seriesSlices':{},'guideTitle':'Кисть · сухожилия, связки и мышцы','guideHint':'Переход к исходной метке. Для тонких блоков и связочек отдельно указаны ограничения видимости.','guideChapters':chapters,'catalogNames':{**names,153201:'Кольцевые блоки A1–A5 · II–V пальцы',153202:'Блоки большого пальца'},'sources':[{'title':'High-Resolution Finger MRI, JKSR 2023','url':'https://doi.org/10.3348/jksr.2022.0123'},{'title':'Dynamic study of the finger PIP volar plate, 2023','url':'https://doi.org/10.1007/s00256-023-04288-6'}],'limitations':['Визуальный обзор 140 исходных PD-срезов и увеличенных контрольных участков; не независимая врачебная верификация каждой точки.','Нет новых или перенесённых точек. Отдельные блоки A1–A5, пучки коллатеральных связок и все прикрепления не размечены предположительно.','Повторения одной идентичности на разных сторонах и уровнях сохранены: это разные исходные точки, а не дубли.']}
 (A/'hand-mri-anatomy153.json').write_text(json.dumps(extra,ensure_ascii=False,indent=2))
 report={'sourceHashes':{n:hashlib.sha256((A/n).read_bytes()).hexdigest() for n in ['hand-mri-data.json','hand-mri-labels.json','wrist-mri-data.json','wrist-mri-labels.json','brain-data.json','brain-labels.json']},'frames':280,'sourceSlices':140,'sourcePoints':7274,'sourceStructures':len(structures),'renamedStructures':len(names),'exactDuplicatePoints':sum(sum(n-1 for n in collections.Counter((p['structure'],p['x'],p['y']) for p in sl['points']).values()) for sl in l['slices'].values()),'newPoints':0,'coordinateChanges':0,'newFilters':len([f for f in filters if f['id']>15000]),'inventory':[{**v,'displayName':names.get(id,v['sourceName']),'displayFilter':presentation.get(id,{}).get('filter',v['sourceFilter']),'decision':'presentation-only; original coordinates retained'} for id,v in structures.items()]}
 (R/'review/hand-anatomy-1.53.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print({k:v for k,v in report.items() if k not in {'inventory','sourceHashes'}})
if __name__=='__main__':run()
