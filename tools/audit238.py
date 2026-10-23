"""Structural audit of every catalog entry and nested clinical entry points.
This is not a new medical validation of the clinical criteria.
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,re,collections,hashlib,html
ROOT=Path(__file__).resolve().parents[1];A=ROOT/'app/src/main/assets';R=ROOT/'review';OUT=ROOT.parent/'output238';OUT.mkdir(exist_ok=True)
s=(A/'anatomy-regions.js').read_text();regions=json.loads(s[s.index('['):s.rindex(']')+1]);runtime=ROOT.parent/'runtime238'
class Links(HTMLParser):
 def __init__(self):super().__init__();self.local=[]
 def handle_starttag(self,tag,attrs):
  for k,v in attrs:
   if k in ('href','src')and v and not urlsplit(v).scheme and not v.startswith(('#','//')):self.local.append(v)
missing=[];html_count=0
for p in A.glob('*.html'):
 html_count+=1;parser=Links();parser.feed(p.read_text())
 for u in parser.local:
  target=unquote(urlsplit(u).path)
  if target and not(A/target).exists():missing.append({'page':p.name,'target':u})
# Only associated local JS/data are evidence for a page; vendor libraries are not clinical references.
cache={}
def evidence(name,seen=None):
 seen=set()if seen is None else seen
 if name in seen:return ''
 seen.add(name);p=A/name
 if not p.exists()or p.suffix not in ('.html','.js','.json')or name.startswith(('vendor/','three')):return ''
 text=p.read_text();deps=re.findall(r'''(?:src|href)=["']([^"']+\.(?:js|json))["']|(?:from|import)\s*["']\./([^"']+\.(?:js|json))["']|fetch\(["']([^"']+\.(?:js|json))["']''',text)
 for parts in deps:
  dep=next((v for v in parts if v),'')
  if dep and not urlsplit(dep).scheme:text+='\n'+evidence(dep,seen)
 return text
entries=[];frame_checks=[]
for r in regions:
 for i in r['items']:
  name=i['url'].split('?')[0];text=cache.setdefault(name,evidence(name));urls=sorted(set(re.findall(r'https?://[^\s"<>\\]+',text)))
  urls=[u.rstrip('.,);')for u in urls if not any(x in u for x in ['w3.org','localhost','127.0.0.1'])]
  reports=[p.name for p in R.glob('*.md')if name in p.read_text()]
  row={'region':r['id'],'region_name':r['name'],**i,'sources_found':urls,'source_note':'Обнаружены ссылки, актуальность и медицинские критерии заново не сверялись','review_files':reports,'clinical_revalidated_this_audit':False}
  if i['contentKind']in ('mri','ct'):
   stem='brain'if name=='brain.html'else name[:-5];data=json.loads((A/(stem+'-data.json')).read_text());group='contrast'if 'set=contrast'in i['url']else 'multiplanar';series=[ss for ss in data['series']if ss['group']==group];frames=[f for ss in series for f in ss['frames']];assert frames,i['url']
   for f in frames:
    p=runtime/f['src'];assert p.is_file(),f['src']
    if f.get('sha256'):assert hashlib.sha256(p.read_bytes()).hexdigest()==f['sha256'],f['src']
   row['real_image_frames']=len(frames);row['real_image_series']=len(series);frame_checks.append({'route':i['url'],'kind':i['contentKind'],'series':len(series),'frames':len(frames),'all_frame_files_and_sha256_pass':True})
  entries.append(row)
by=collections.defaultdict(list)
for e in entries:by[e['url'].split('?')[0]].append(e['region'])
nested=[]
for hub in ['brain-tumors.html','brain-metastases-module.html']:
 for u in re.findall(r'href="([^"#]+\.html[^"#]*)"',(A/hub).read_text()):
  n=u.split('?')[0]
  if n in ['region.html','brain-tumors.html','brain-metastases-module.html']:continue
  assert(A/n).exists();text=evidence(n);nested.append({'hub':hub,'route':u,'page_exists':True,'external_source_links_detected':bool(re.search(r'https?://',text)),'clinical_revalidated_this_audit':False})
result={'date':'23.10.2026','scope':'Navigation, catalog, local links, real-image assets, source/review presence; not full medical or per-label anatomical validation','regions':len(regions),'cards':len(entries),'unique_entry_html_files':len(by),'kind_counts':dict(collections.Counter(e['contentKind']for e in entries)),'all_top_level_html_checked':html_count,'missing_local_html_references':missing,'frame_checks':frame_checks,'shared_entry_files':{k:v for k,v in by.items()if len(v)>1},'entries':entries,'nested_clinical_entries':nested}
(R/'global-audit238.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');assert not missing
print(json.dumps({k:v for k,v in result.items()if k not in ['entries','nested_clinical_entries','shared_entry_files','frame_checks']},ensure_ascii=False));print('PASS: verified real image frames',sum(f['frames']for f in frame_checks),'in',len(frame_checks),'entry routes')
labels={'mri':'МР-анатомия','ct':'КТ-снимки','clinical':'Клинический модуль','model':'3D / схема','reference':'Общий справочник'}
rows=''.join('<tr>'+''.join('<td>'+html.escape(str(v))+'</td>'for v in [e['region_name'],e['title'],labels[e['contentKind']],e.get('real_image_frames','—'),len(e['sources_found']),'; '.join(e['review_files'])or 'Не сопоставлен автоматически',e['url']])+'</tr>'for e in entries)
report='''<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MRIAtlas · аудит структуры 2.38</title><style>body{background:#101923;color:#e1ebf5;font:16px/1.55 system-ui;margin:0}main{max-width:1250px;margin:auto;padding:24px}h1{font-size:clamp(26px,5vw,40px)}h2{margin-top:36px;color:#7dddd0}a{color:#7dddd0}.note{padding:18px;background:#1d3039;border-left:3px solid #78d9c5}.table{overflow:auto}table{width:100%;border-collapse:collapse;font-size:14px}th,td{border-bottom:1px solid #344657;padding:12px;text-align:left;vertical-align:top}th{color:#8bdfcf}td:last-child{overflow-wrap:anywhere}small{color:#a3b7cc}input{font:inherit;width:100%;box-sizing:border-box;padding:12px;background:#1b2c3b;color:white;border:1px solid #526e82;border-radius:10px}li{margin:10px 0}</style><main><small>23.10.2026 · MRIAtlas 2.38</small><h1>Проверка структуры приложения</h1><p class="note">Проверены все 116 карточек в 14 областях, 80 стартовых HTML-страниц и дочерние входы опухолевых разделов. Это аудит структуры, ссылок и доступности снимков. Он не заменяет медицинскую сверку каждого диагностического критерия или врачебную проверку каждой анатомической метки.</p><h2>Что исправлено</h2><ul><li>17 входов в реальные МР-серии стоят первыми в своих областях; 2 КТ-входа — первыми в брюшной полости.</li><li>Клинические темы, 3D и общие справочники визуально разделены. Исходные маршруты, снимки и метки сохранены.</li><li>33 карточки четырёх общих справочников собраны в нижний блок. Это ссылки на общие страницы, а не 33 копии содержимого.</li><li>Добавлен поиск модулей внутри каждой области. Полные названия карточек больше не обрезаются до двух строк.</li><li>Исправлены подписи «Малый таз · меню» в пяти чужих МР-атласах: колено, ТБС, позвоночник, лицо/шея, стопа.</li><li>«Предплюсна · стопа» переименована в «Голеностоп и стопа»; уточнены описания позвоночника, живота и молочных желёз. В груди пока справочник со схемами, отдельной серии реальных снимков нет.</li></ul><h2>Что улучшать следующим</h2><div class="table"><table><tr><th>Приоритет</th><th>Раздел</th><th>Предложение</th><th>Основание</th></tr><tr><td>1</td><td>Запястье / TFCC</td><td>Обновить клинический справочник по примеру менисков и манжеты; сохранить 3D внутри него.</td><td>Основные входы связок, сухожилий и TFCC сейчас представлены моделями. Нужно единообразно вынести признаки, ограничения, протокол и формулировки.</td></tr><tr><td>2</td><td>Плечо</td><td>Общий вход «Нестабильность плеча»: губа/Bankart/SLAP и Hill–Sachs, с переходами к прежним моделям.</td><td>Соседние аспекты одной диагностической задачи сейчас открываются отдельными карточками; манжету оставить самостоятельной.</td></tr><tr><td>3</td><td>Колено</td><td>Развить клинические блоки по хрящу, пателлофеморальному суставу и нативным связкам.</td><td>Мениски и ПКС после пластики уже переработаны, соседние разделы остаются в формате 3D.</td></tr><tr><td>4</td><td>Малый таз</td><td>Добавить подгруппы «Женский таз», «Простата», «Прямая кишка и перианальная область» при дальнейшем росте.</td><td>15 карточек: полезнее разделять по органу и задаче. Миомы и аденомиоз оставить разными темами с взаимными ссылками.</td></tr><tr><td>5</td><td>Общие справочники</td><td>Фильтр по текущей области внутри справочника, если это оправдано содержанием.</td><td>Входы уже передают from=; следующий шаг — выбирать релевантные локализации, не дублировать весь модуль.</td></tr></table></div><h2>Что объединять не нужно</h2><p>Миомы и аденомиоз, кистозные и солидные образования поджелудочной, МР-атлас длинной конечности и атласы отдельных суставов решают разные задачи. Сохранить отдельными; связывать переходами. У метастазов мозга уже есть общий вход «до / после лечения», повторное объединение не требуется.</p><h2>Реестр карточек</h2><p>Счётчик ссылок означает лишь наличие внешних адресов в странице и связанных скриптах. Современность, полнота источников и медицинская достоверность заново не подтверждались. Найденный отчёт — историческое свидетельство работы, не повторная валидация сегодня.</p><input id="q" type="search" aria-label="Фильтр реестра" placeholder="Найти область или модуль"><div class="table"><table id="inventory"><thead><tr><th>Область</th><th>Модуль</th><th>Формат</th><th>МР/КТ кадров</th><th>Внешних ссылок</th><th>Исторические отчёты</th><th>Маршрут</th></tr></thead><tbody>'''+rows+'''</tbody></table></div><h2>Ограничения</h2><p>Доступность каждого кадра и соответствие сохранённой SHA256 проверены. Это не проверка исходного диагноза, качества исследования, параметров DICOM или точности каждой метки. Исходные JPEG не превращались в DICOM. Рекомендации по объединению — предложения к следующей переработке, эти модули в 2.38 не слиты.</p></main><script>document.querySelector('#q').oninput=e=>{const q=e.target.value.toLocaleLowerCase('ru');document.querySelectorAll('#inventory tbody tr').forEach(r=>r.hidden=!r.textContent.toLocaleLowerCase('ru').includes(q))}</script></html>'''
(OUT/'MRIAtlas-structure-audit-2.38.html').write_text(report)
