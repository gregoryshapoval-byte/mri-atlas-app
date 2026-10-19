"""Presentation-only wrist review: no coordinate, MRI or historical overlay changes."""
from pathlib import Path
import json,hashlib
R=Path(__file__).resolve().parents[1];A=R/'app/src/main/assets'
short={
1632:'Диск ТФХК',1636:'DRC · тыльная лучезапястная',1637:'Ладонная лучезапястная · общая',1638:'≈ Тыльная локтезапястная область',1639:'≈ Ладонные локтезапястные · общие',1640:'≈ Локтевая периферия ТФХК',1641:'RCL · лучевая коллатеральная',1644:'Лучистая связка · общая',1645:'Тыльные межзапястные · общие',1646:'Ладонные межзапястные · общие',1647:'Межзапястные · общий ориентир',1649:'Гороховидно-крючковидная',1650:'Гороховидно-пястная',1654:'Тыльные CMC · общие',1655:'Ладонные CMC · общие',
912701:'≈ SL · мембранозная часть',912702:'≈ LT · мембранозная часть',912703:'≈ Диск · центр',912704:'≈ Диск · лучевое прикрепление',912706:'≈ ТФХК · фовеальное прикрепление',912707:'≈ ТФХК · шиловидное прикрепление',
913001:'≈ DRUJ · ладонная связка',913002:'≈ DRUJ · тыльная связка',913003:'≈ SL · ладонная часть',913004:'≈ SL · тыльная часть',913005:'≈ LT · ладонная часть',913006:'≈ LT · тыльная часть',913007:'≈ ECU · фиброзный футляр',913008:'≈ UT · локтево-трёхгранная',913009:'≈ UL · локтево-полулунная',
146101:'≈ RSC',146102:'≈ LRL',146103:'≈ SRL',146104:'≈ RSL · Тестю',146105:'≈ DIC',146106:'≈ DCSS',146107:'≈ STT · общий ориентир',146108:'≈ Ладьевидно-трёхгранная',146109:'≈ UC · локтево-головчатая',146110:'≈ Гомолог мениска',
155101:'≈ CH · общая область',155102:'≈ CT · общая область',155103:'≈ SC',155104:'≈ TC · прикрепление',155105:'≈ TH · прикрепление',155106:'≈ TT',
156201:'≈ rpSTL',156202:'≈ STT · ладонная капсула',156203:'≈ STT · тыльная капсула',
156211:'≈ AOL · I CMC',156212:'≈ DRL · I CMC',156213:'≈ DCL · I CMC',156214:'≈ POL · I CMC',156215:'≈ IML · I–II',156216:'≈ UCL · I CMC',156217:'≈ I тыльная трапецие-пястная',
156221:'≈ CH · тыльная часть',156222:'≈ CH · ладонная часть',156223:'≈ CH · глубокая часть',156224:'≈ CT · тыльная часть',156225:'≈ CT · ладонная часть',156226:'≈ CT · глубокая часть',
156231:'≈ Тыльные CMC II',156232:'≈ Тыльные CMC III',156233:'≈ Тыльные CMC IV',156234:'≈ Тыльные CMC V',156235:'≈ Ладонные CMC II',156236:'≈ Ладонные CMC III',156237:'≈ Ладонные CMC IV',156238:'≈ Ладонные CMC V',156239:'≈ Межкостный CMC III–IV'}
d=json.loads((A/'wrist-mri-data.json').read_text());coincident={};pairs=[]
for sid,n,old,new in [('667-contraste_dpfs',16,1647,156223),('668-contraste_dpfs',17,1654,156232)]:
 s=next(s for s in d['series'] if s['id']==sid);f=s['frames'][n-1]
 coincident.setdefault(sid,{})[f['annotation']]={str(old):[new]};pairs.append({'series':sid,'frame':n,'annotation':f['annotation'],'general':old,'detail':new,'imageSha256':f['sha256']})
e={'revision':'1.57','shortNames':short,'coincident':coincident,'filterNames':{'15501':'CH / CT / SC · общие ориентиры'},'limitations':'Только представление. Полные названия и координаты сохранены; общая точка скрыта только при видимой включённой детальной точке, кроме явно выбранной общей структуры.'}
(A/'wrist-mri-review157.json').write_text(json.dumps(e,ensure_ascii=False,separators=(',',':'))+'\n')
report={'revision':'1.57','base':'bdc9407db93fa929db8798adecc8b553e5363b35','shortNames':len(short),'coincident':pairs,'newLandmarks':0,'sourceHashes':{n:hashlib.sha256((A/n).read_bytes()).hexdigest() for n in ['wrist-mri-data.json','wrist-mri-labels.json','wrist-mri-anatomy146.json','wrist-mri-joints154.json','wrist-mri-capitate155.json','wrist-mri-ligaments156.json']}}
(R/'review/wrist-review-1.57.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(len(short),'short labels, 2 conditional pairs, no new coordinates')
