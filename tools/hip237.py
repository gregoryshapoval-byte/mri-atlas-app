"""Original conditional teaching diagrams and offline clinical hip guide."""
from pathlib import Path
import re, json, math
A=Path(__file__).resolve().parents[1]/'app/src/main/assets'
def txt(x,y,s,size=16,color='#c4d4e4'):
 return f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}">{s}</text>'
def line(x,y,a,b,color='#f5c481',dash=False):
 return f'<path d="M{x} {y} L{a} {b}" fill="none" stroke="{color}" stroke-width="2.5"'+(' stroke-dasharray="6 5"' if dash else '')+'/>'
def svg(title,body):
 return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 350" role="img" aria-label="{title}"><title>{title}</title><rect width="440" height="350" rx="14" fill="#10202d"/>{body}</svg>'
def morph(kind):
 cam=kind in ('cam','mixed');pin=kind in ('pincer','mixed')
 b='<path d="M110 75 Q195 30 276 107 L264 127 Q193 66 132 114 Z" fill="#47627b" stroke="#b1c7d8" stroke-width="2"/>'
 b+='<path d="M246 130 A70 70 0 1 0 246 230 L325 304 L365 263 '+('L294 158 Q275 120 246 130' if cam else 'L280 180 Q261 151 246 130')+' Z" fill="#617b91" stroke="#c6d5e0" stroke-width="2"/>'
 b+='<path d="M137 121 Q196 76 251 134" fill="none" stroke="#75d9c2" stroke-width="8"/>'
 b+=('<path d="M263 108 L285 142 L272 165 L258 128 Z" fill="#b1c7d8"/>' if pin else '')
 b+=f'<path d="M{271 if pin else 260} {158 if pin else 127} l18 20 l-22 -4 Z" fill="#b89cde"/>'
 b+=txt(25,30,{'normal':'Без cam/pincer','cam':'Cam: головка–шейка','pincer':'Pincer: край впадины','mixed':'Смешанная морфология'}[kind],20)
 b+=txt(22,327,'Условный профиль: таз слева, бедро справа',14)
 if cam:b+=line(297,163,365,112)+txt(300,96,'Асферичность',15)
 if pin:b+=line(280,140,359,67)+txt(292,51,'Покрытие ↑',16)
 if kind=='normal':b+=txt(32,280,'Плавный переход')+line(150,269,270,180)
 return svg(kind,b)
def lab(kind):
 b='<path d="M55 64 H252 V214 H55 Z" fill="#4d647a"/><path d="M70 224 H259" stroke="#75d9c2" stroke-width="15"/>'
 b+='<path d="M253 152 L343 225 L256 225 Z" fill="#b89cde" stroke="#d8c7f2" stroke-width="2"/>'
 b+='<path d="M62 298 Q215 242 375 298" fill="none" stroke="#75d9c2" stroke-width="12"/><path d="M62 308 Q215 252 375 308 V340 H62Z" fill="#526e86"/>'
 if kind=='signal':b+='<path d="M275 187 L294 204" stroke="#e8c8e6" stroke-width="5"/>'
 if kind=='tear':b+='<path d="M285 178 L294 206 L317 224" fill="none" stroke="#faad72" stroke-width="7"/>'
 if kind in ('detach','cyst'):b+='<path d="M258 219 L260 172" stroke="#faad72" stroke-width="7"/>'
 if kind=='recess':b+='<path d="M258 219 L258 201" stroke="#f5d798" stroke-width="4"/>'
 if kind=='cyst':b+='<path d="M261 179 Q299 135 319 144" stroke="#78c9ff" stroke-width="5" fill="none"/><ellipse cx="340" cy="133" rx="38" ry="25" fill="#23628a" stroke="#78c9ff" stroke-width="3"/>'
 b+=txt(27,32,{'normal':'Нормальная губа','signal':'Внутренний сигнал','tear':'Разрыв тела губы','detach':'Хондролабральное отделение','cyst':'Паралабральная киста','recess':'Сублабральный recess'}[kind],19)
 b+=txt(79,107,'Впадина')+txt(284,260,'Губа',15,'#cfb5ee')+txt(40,278,'Головка',15)
 b+=txt(26,58,'Увеличенный фрагмент края впадины',13)
 return svg(kind,b)
def alpha():
 cx,cy,r=162,172,84
 point=lambda deg:(cx+r*math.cos(math.radians(deg)),cy+r*math.sin(math.radians(deg)))
 x,y=point(-35);a,b=point(25)
 s='<circle cx="162" cy="172" r="84" fill="#506c83" stroke="#bfd0de" stroke-width="2"/>'
 s+='<path d="M231 124 Q278 108 300 173 L389 214 L359 277 L210 238" fill="#506c83" stroke="#bfd0de" stroke-width="2"/>'
 s+='<circle cx="162" cy="172" r="84" fill="none" stroke="#75d9c2" stroke-width="2" stroke-dasharray="5 5"/>'
 s+=line(cx,cy,373,270)+line(cx,cy,x,y)+line(x,y,270,73)+txt(239,56,'Выход за окружность',14)
 s+='<path d="M195 149 A40 40 0 0 1 198 189" stroke="#fac27b" stroke-width="3" fill="none"/>'
 s+=txt(210,173,'α',23,'#fac27b')+txt(273,308,'Ось шейки',15)+txt(22,30,'α-угол: центр → две линии',19)
 s+=txt(22,333,'Круг по головке, а не по костному выступу',14)
 return svg('Измерение альфа-угла',s)
def coverage():
 s='<circle cx="200" cy="213" r="74" fill="#506c83" stroke="#bfd0de" stroke-width="2"/><path d="M100 130 Q175 70 254 119" stroke="#75d9c2" stroke-width="12" fill="none"/>'
 s+=line(200,213,200,68)+line(200,213,254,119)+line(254,119,354,87)
 s+='<path d="M200 167 A46 46 0 0 1 223 174" stroke="#fac27b" stroke-width="3" fill="none"/>'
 s+=txt(209,155,'LCEA',16,'#fac27b')+txt(267,66,'Край sourcil',16)+txt(19,30,'LCEA: корональная оценка',20)+txt(23,317,'Вертикаль ⟂ межголовочной линии',14)+txt(23,338,'Sourcil — несущая склерозированная крыша',13)
 return svg('Латеральный угол Виберга LCEA',s)
def offset():
 s='<path d="M95 97 Q41 161 105 217 Q154 250 213 212 L389 212 V158 H224 Q209 80 140 78 Z" fill="#506c83" stroke="#bfd0de" stroke-width="2"/>'
 s+=line(100,79,388,79,'#75d9c2',True)+line(225,158,389,158,'#75d9c2',True)
 s+=line(326,79,326,158)+line(316,79,336,79)+line(316,158,336,158)
 s+=txt(343,122,'d',22,'#fac27b')+txt(22,30,'Передний head–neck offset',20)+txt(22,293,'Параллельные касательные к передним')+txt(22,316,'контурам головки и шейки; d в мм',15)
 return svg('Передний offset',s)
def clock():
 s='<circle cx="217" cy="178" r="103" fill="#31475c" stroke="#b89cde" stroke-width="13"/><path d="M217 75 A103 103 0 0 1 320 178" stroke="#faad72" stroke-width="17" fill="none"/>'
 s+=txt(207,54,'12',22)+txt(336,186,'3',22)+txt(208,315,'6',22)+txt(81,186,'9',22)+txt(287,132,'1–3',20,'#10202d')+txt(37,30,'Часы: единая анатомическая система',18)
 s+=txt(342,214,'Перед',14)+txt(24,214,'Зад',14)+txt(32,343,'12 верх · 3 перед · 6 низ · 9 зад, обе стороны',13)
 return svg('Часовая локализация суставной губы',s)
def cartilage(kind):
 s='<path d="M50 80 H388 V177 H50Z" fill="#506c83"/>'
 if kind=='delam':s+='<path d="M50 187 H180 Q258 212 322 187 H388" stroke="#75d9c2" stroke-width="19" fill="none"/><path d="M182 179 Q255 197 319 179" fill="none" stroke="#faad72" stroke-width="6"/>'
 else:s+='<path d="M50 187 H202 M287 187 H388" stroke="#75d9c2" stroke-width="19"/><path d="M205 177 H285" stroke="#faad72" stroke-width="5"/>'
 s+='<path d="M50 255 H388" stroke="#75d9c2" stroke-width="17"/><path d="M50 266 H388 V319 H50Z" fill="#506c83"/>'
 s+=txt(25,32,'Деламинация хряща' if kind=='delam' else 'Полнослойный дефект хряща',20)+txt(66,119,'Кость впадины')+txt(69,302,'Головка бедра')
 s+=txt(32,342,'Зелёный — хрящ · оранжевый — дефект/щель',13)
 return svg(kind,s)
figs={**{'m-'+k:morph(k) for k in ['normal','cam','pincer','mixed']},**{'l-'+k:lab(k) for k in ['normal','signal','tear','detach','cyst','recess']},'alpha':alpha(),'lcea':coverage(),'offset':offset(),'clock':clock(),'delam':cartilage('delam'),'loss':cartilage('loss')}
patterns=[
 ('Без cam/pincer','m-normal','Плавный переход головка–шейка и отсутствие явного избыточного покрытия.','Нормальная костная форма не исключает повреждение губы и хряща.','При боли оценить весь сустав и внесуставные структуры, а не только углы.'),
 ('Cam','m-cam','Асферичность и уменьшение вогнутости перехода головка–шейка, чаще спереди и сверху.','Указать максимальный α-угол, плоскость и локализацию выступа.','Один аксиальный срез может пропустить передневерхний cam; нужны радиальные изображения.'),
 ('Pincer','m-pincer','Избыточное покрытие головки: глобальное либо фокальное. Оценить LCEA, наклон крыши и версию впадины.','Костное покрытие и состояние губы/хряща описывать отдельно.','Coxa profunda и изолированный crossover не доказывают pincer: важны позиционирование и совокупность признаков.'),
 ('Смешанная','m-mixed','Сочетание cam и признаков избыточного покрытия.','Привести измерения обеих сторон конфликта, а не только слово «смешанный».','Морфология сама по себе не устанавливает синдром ФАИ и не определяет лечение.')]
labs=[
 ('Норма','l-normal','Обычно низкосигнальная треугольная губа с непрерывным основанием.','Размер и форма варьируют.','Не считать любую округлую форму или неоднородность разрывом.'),
 ('Внутренний сигнал','l-signal','Повышенный внутритканевой сигнал без убедительного сообщения с суставной поверхностью.','Описание: внутритканевые/дегенеративные изменения, если соответствуют морфологии.','Изолированный сигнал на коротком TE не равен разрыву; проверить T2 и соседние срезы.'),
 ('Разрыв','l-tear','Жидкостная щель до поверхности, расщепление или деформация губы; подтверждение в согласованных плоскостях повышает уверенность.','Описать сектор, протяжённость, смещение и состояние хряща.','При ограниченном разрешении писать степень уверенности; бессимптомные разрывы встречаются.'),
 ('Отделение','l-detach','Щель вдоль основания на границе губа–хрящ, частичное или полное отделение.','Хондролабральное отделение ≠ автоматически деламинация суставного хряща.','Небольшой ровный recess может имитировать отделение; оценить края и сопутствующие изменения.'),
 ('Киста','l-cyst','Жидкостное образование рядом с губой; искать сообщение через дефект.','Указать размеры, распространение и отношение к сосудисто-нервным структурам.','Киста поддерживает наличие повреждения, но щель может не визуализироваться; сама киста не доказывает источник боли.'),
 ('Recess / вариант','l-recess','Тонкая гладкая частичная щель без деформации и повреждения соседнего хряща может быть вариантом.','Сверить локализацию и направление щели; при сомнении — нейтральная формулировка.','Не называть нормой любую гладкую щель: важны весь комплекс признаков и качество исследования.')]
def fig(key):return f'<button class="figurebtn" data-figure="{key}" aria-label="Увеличить схему">{figs[key]}</button>'
def card(title,text):return f'<article class="card"><h3>{title}</h3>{text}</article>'
def table(rows):return '<div class="card scroll"><table><thead><tr><th>Параметр</th><th>Как оценивать</th><th>Ограничение</th></tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+v+'</td>' for v in row)+'</tr>' for row in rows)+'</tbody></table></div>'
def selector(prefix,items):
 return '<div class="patterns">'+''.join(f'<button data-{prefix}="{i}" aria-pressed="false">{p[0]}</button>' for i,p in enumerate(items))+f'</div><article class="card figogrid"><div id="{prefix}figure"></div><div><h2 id="{prefix}title"></h2><p id="{prefix}look"></p><p class="note" id="{prefix}key"></p><p class="note warn" id="{prefix}trap"></p></div></article>'
panels=[]
panels.append('<p class="note">ФАИ-синдром = симптомы + клинические признаки + соответствующая морфология. По одной МРТ описываем <b>cam/pincer-морфологию</b>, а не устанавливаем причину боли. [1]</p>'+selector('m',patterns)+card('Порядок оценки','<ol><li>Качество исследования и сторона.</li><li>Головка–шейка, покрытие и версия впадины.</li><li>Губа, хрящ впадины и головки отдельно.</li><li>Субхондральная кость, выпот, свободные тела.</li><li>Альтернативные причины боли и ограничения метода.</li></ol>')+'<p class="foot">Все схемы условные, не МР-срезы и не динамическая модель контакта. Цвета обозначают ткани, а не МР-сигнал.</p>')
panels.append('<h2>Измерения с указанием метода</h2><p class="note">Порог — ориентир морфологии, а не самостоятельный диагноз. Рентгенограмма таза AP + Dunn 45° дополняют МРТ; измерения на разных плоскостях не взаимозаменяемы. [2–4]</p>'+''.join(card(title,fig(k)+'<p>'+p+'</p>') for k,title,p in [
 ('alpha','α-угол','На радиальном срезе вдоль оси шейки: круг по сферической части головки; линия центр–ось шейки и линия центр–первая точка выхода костного контура за круг. Указать максимальное значение и позицию. <b>≥60°</b> — принятый ориентир cam; диапазон 50–59° сам по себе не подтверждает и не исключает синдром. [2,4]'),
 ('lcea','LCEA / угол Виберга','От центра головки: вертикаль, перпендикулярная межголовочной линии, и луч к латеральному краю несущей крыши (sourcil). Не включать губу, os acetabuli и остеофит. На МРТ нужен стандартизированный корональный срез через центр; при сомнении сверить с корректной AP-рентгенограммой. [2]'),
 ('offset','Передний offset','Расстояние между параллельными касательными к переднему контуру головки и шейки на согласованной аксиальной косой/профильной оценке. <b>&lt;8 мм</b> — дополнительный ориентир; зависит от размеров и плоскости. Не заменяет α-угол. [2]')])+table([
 ('LCEA &lt;20°','Недостаточное покрытие.','Искать дисплазию и возможную нестабильность; не трактовать как pincer.'),
 ('LCEA 20–25°','Пограничное недостаточное покрытие.','В литературе граница 25° перекрывается с обычным диапазоном. При 25° сообщать точное число и другие признаки.'),
 ('LCEA &gt;25° и &lt;40°','Обычно достаточное латеральное покрытие.','Не исключает фокальную ретроверсию; 39,5° не округлять автоматически в pincer.'),
 ('LCEA ≥40°','Ориентир избыточного латерального покрытия.','Не доказывает симптомный конфликт.'),
 ('Индекс крыши (Tönnis)','Угол горизонтали и линии между медиальным и латеральным краями sourcil. &lt;0°: избыточное; &gt;13°: недостаточное покрытие.','Прежде всего рентгенографические ориентиры. Не путать с градацией артроза Tönnis.'),
 ('Версия / торсия','Версия впадины и бедренная торсия — разные измерения. Для торсии нужны проксимальные и дистальные ориентиры бедра.','Без дистальных мыщелков торсию не вычислять. Указывать метод; произвольный аксиальный срез не даёт глобальную версию.')])+'<p class="source">LCEA и индекс: классические интервалы Lisbon; в исходной таблице 25° относится к соседним диапазонам. Здесь пограничное значение выделено явно, автоматической категоризации нет. [2]</p>')
panels.append('<h2>Губа: структура важнее одного яркого сигнала</h2>'+selector('l',labs)+card('Карта локализации',fig('clock')+'<p>В модуле: 12 — верх, 3 — перед, 6 — низ, 9 — зад для <b>обоих</b> суставов. Всегда дописывать анатомический сектор: «передневерхний, 12–3 ч». Это условная карта en face; левую сторону не зеркалить автоматически. В публикациях встречаются другие системы часов.</p>')+'<p class="source">Морфология разрыва [5,6]; варианты/recess [7,8]; находки у бессимптомных [9,10]. Схема recess показывает идею частичной щели, а не разрешает признать её нормой на любом уровне.</p>')
panels.append('<h2>Хрящ впадины и головки — отдельно</h2><div class="grid2">'+card('Деламинация',fig('delam')+'<p>Отслоение от субхондральной пластинки: жидкостная линия под хрящом, приподнятый или волнистый участок. Поверхность может оставаться целой. Не равнозначно полнослойной утрате. [11,12]</p>')+card('Полнослойная утрата',fig('loss')+'<p>Дефект до субхондральной кости. Указать локализацию и площадь/два размера, состояние противоположной поверхности и субхондральной кости. [6]</p>')+'</div>'+card('Что включить в описание','<ul><li>Поверхность: ацетабулярная или бедренная; сектор.</li><li>Частичная/полнослойная утрата, трещина, отделение; размеры в двух направлениях.</li><li>Изменения субхондральной кости: отёк, кисты, склероз; остеофиты и сужение щели.</li><li>Связь с хондролабральным отделением и свободными телами.</li></ul>')+'<p class="note warn">Отрицательная МРТ не исключает раннюю деламинацию/wave sign; чувствительность зависит от техники и критериев. Не присваивать артроскопическую степень по одному изменению сигнала. [11–13]</p>')
panels.append('<h2>Протокол и ловушки</h2>'+table([
 ('Обзор таза','Корональная жидкостно-чувствительная серия с подавлением жира; T1 для костной структуры и контекста.','Покрыть оба сустава и таз: внесуставная причина боли может быть вне малого FOV. [3,14]'),
 ('Прицельно сустав','Небольшой FOV; cor/sag/ax-oblique PD или T2 FS, T1 без FS. Аксиальная косая плоскость вдоль шейки.','Практический старт: FOV 16–20 см, срез 2–3 мм, минимальный зазор; адаптировать к катушке/SNR и размеру пациента. [14; локальная адаптация]'),
 ('Радиальные изображения','Вокруг оси шейки: отдельная серия либо качественные реконструкции из изотропного объёма.','Обычная толстосрезовая серия не становится радиальной после произвольной MPR. Нужна достаточная детализация. [3]'),
 ('Торсия бедра','Дополнительные изображения дистальных мыщелков по согласованному методу.','Часть комплексного протокола Lisbon у молодого пациента с болью, особенно перед планированием коррекции. [3]'),
 ('МР-артрография','Прямое внутрисуставное контрастирование — отдельное исследование по клиническому запросу/неясной прицельной МРТ.','На 1,5 Т может уточнить губу/хрящ; качественная 3 Т МРТ часто достаточна. В/в контраст не равнозначен прямой артрографии. [3,5,6]')])+card('Что чаще приводит к ошибке','<ul><li><b>Морфология = диагноз:</b> симптомы и осмотр обязательны для синдрома. [1]</li><li><b>Один яркий участок губы:</b> внутритканевой сигнал, magic angle и partial volume могут имитировать повреждение. Сверять жидкостно-чувствительные серии, морфологию и плоскости. [5,10]</li><li><b>Изолированный crossover:</b> ротация/наклон таза и вариант передней нижней подвздошной ости могут искажать оценку; сверять другие признаки ретроверсии. [2]</li><li><b>Os acetabuli:</b> описать фрагмент и его вклад в покрытие; не делать вывод о необходимости удаления.</li><li><b>«Губа не изменена» при низком разрешении:</b> корректнее указать пределы оценки.</li></ul>')+card('Альтернативные причины боли','<p>Проверить остеонекроз и субхондральный перелом, артроз/синовит, сухожилия ягодичных мышц и подвздошно-поясничной мышцы, приводящие мышцы и лонное сочленение. Диспластическая нестабильность может сопровождаться гипертрофией и разрывом губы. Наличие cam не отменяет другую причину.</p><a href="osteonecrosis.html?from=hip">Остеонекроз и имитаторы →</a><br><a href="stress-fractures.html?from=hip">Стрессовые и недостаточностные переломы →</a>'))
templates=[
 ('Cam без явного повреждения','Асферичность передневерхнего перехода головка–шейка бедренной кости; максимальный α-угол ___° на ___ радиальном срезе. Убедительного разрыва губы и значимого дефекта хряща не выявлено при данном качестве исследования. Заключение: cam-морфология. Наличие ФАИ-синдрома оценивается с учётом симптомов и осмотра.'),
 ('Cam и разрыв губы','Cam-морфология: α-угол ___° (плоскость/позиция ___). В передневерхнем отделе губы, ___–___ ч по системе 12 верх / 3 перед, жидкостная щель до ___ поверхности, протяжённость ___ мм; смещение ___. Хрящ впадины ___, головки ___. Заключение: cam-морфология; МР-признаки разрыва передневерхнего отдела суставной губы.'),
 ('Избыточное покрытие','LCEA ___° (метод ___), индекс крыши ___°; признаки локальной ретроверсии ___. Губа ___; хрящ ___. Заключение: признаки избыточного ___ покрытия головки бедра (pincer-морфология). Клиническая значимость требует сопоставления с симптомами и осмотром.'),
 ('Отделение и киста','На границе губа–хрящ в ___ секторе щель протяжённостью ___ мм с ___ отделением основания губы. Паралабральная киста ___×___×___ мм, распространение ___, отношение к сосудисто-нервным структурам ___. Заключение: хондролабральное повреждение с паралабральной кистой.'),
 ('Подозрение на деламинацию','В ___ отделе ацетабулярного хряща на участке ___×___ мм определяется жидкостная линия у субхондральной пластинки с ___ поверхностью. Заключение: МР-признаки, подозрительные на деламинацию ацетабулярного хряща. Точная протяжённость/стабильность по МРТ ограниченно оценимы.'),
 ('Неопределённая находка','В ___ отделе губы небольшой участок повышенного сигнала без убедительно прослеживаемого сообщения с поверхностью. Достоверный разрыв при данном разрешении не подтверждён. При сохраняющемся клиническом подозрении — прицельная оценка по согласованию с лечащим специалистом.')]
panels.append('<h2>Описание и заключение</h2><p class="note">Заготовки требуют заполнения и проверки. Не копировать пропуски и противоречащие исследованию фразы.</p>'+''.join(card(t,'<div class="example">'+p+'</div><button class="copy">Копировать</button>') for t,p in templates)+'<div role="status" class="status" id="copyStatus"></div>'+card('Перед завершением',''.join('<label class="check"><input type="checkbox">'+s+'</label>' for s in ['Сторона, техника и ограничения','Морфология с числами и методом измерений','Губа: сектор, щель, протяжённость, смещение','Хрящ обеих поверхностей и субхондральная кость','Паралабральные кисты и соседние структуры','Альтернативная причина боли','Морфология отделена от клинического синдрома'])))
sources=[
 ('Warwick Agreement, 2016 — определение ФАИ-синдрома','https://pubmed.ncbi.nlm.nih.gov/27629403/'),
 ('Lisbon Agreement, part 2, 2021 — параметры и отчёт','https://pubmed.ncbi.nlm.nih.gov/33411052/'),
 ('Lisbon Agreement, part 3, 2021 — техника визуализации','https://pubmed.ncbi.nlm.nih.gov/33411053/'),
 ('Oxford consensus, 2023 — cam и α-угол','https://bjsm.bmj.com/content/57/6/325'),
 ('Chopra et al., 2018 — 3 Т МРТ против 1,5 Т МР-артрографии, проспективное сравнение','https://pubmed.ncbi.nlm.nih.gov/28986631/'),
 ('Magee, 2015 — МРТ и МР-артрография 3 Т с артроскопией','https://pmc.ncbi.nlm.nih.gov/articles/PMC4743561/'),
 ('Studler et al., 2008 — recess и разрыв, хирургическая корреляция','https://pubmed.ncbi.nlm.nih.gov/18840790/'),
 ('Saddik et al., 2006 — сублабральные борозды','https://pubmed.ncbi.nlm.nih.gov/17056882/'),
 ('Register et al., 2012 — МР-находки у бессимптомных','https://pubmed.ncbi.nlm.nih.gov/23104610/'),
 ('Cotten et al., 1998 — вариабельность губы у бессимптомных','https://pubmed.ncbi.nlm.nih.gov/9448753/'),
 ('Neumann et al., 2023 — диагностика деламинации','https://pubmed.ncbi.nlm.nih.gov/35903867/'),
 ('Accuracy of MRI, 2022 — деламинация с артроскопией','https://pubmed.ncbi.nlm.nih.gov/36051975/'),
 ('Comparison of MRI and arthroscopy, 2024 — повреждения переходной зоны / wave sign','https://pubmed.ncbi.nlm.nih.gov/38225402/'),
 ('ESSR, Standard Hip MRI, 2016 — технический пример, не новый универсальный стандарт','https://www.essr.org/content-essr/uploads/2016/10/ESSR-MRI-Protocols-Standard-Hip.pdf')]
panels.append('<h2>Источники и границы модуля</h2><p>Сверено 23.10.2026. Основной профиль — взрослый/молодой взрослый с нативным суставом. Послеоперационная губа, детские заболевания и выбор операции требуют отдельных алгоритмов. Независимая врачебная валидация не выполнена.</p><div class="sources">'+''.join(f'<a href="{u}" target="_blank" rel="noopener">[{i+1}] {t} ↗</a>' for i,(t,u) in enumerate(sources))+'</div><p class="foot">Схемы авторские и условные. Параметры протокола — практический старт с адаптацией к конкретному аппарату. Модуль не прогнозирует боль и не выбирает лечение автоматически.</p>')
css=re.search(r'<style>(.*?)</style>',(A/'cuff.html').read_text(),re.S).group(1)
css+=' .figurebtn{display:block}.figurebtn svg{display:block;width:100%;height:auto;max-height:360px}h1,button,td,p,a{overflow-wrap:anywhere}.sources a{font-size:15px}.card> .figurebtn{max-width:550px;margin:auto}dialog .figurebtn{cursor:default}dialog h2{margin:0 0 12px}.fallback{width:100%;min-height:160px;font:inherit;background:#0e1721;color:#e5edf7} @media(max-width:640px){.figurebtn svg{max-height:310px}.figogrid{gap:12px}}'
tabs=['Морфология','Измерения','Суставная губа','Хрящ','Протокол / ловушки','Описание','Источники']
body='<header><b>MRI <span style="color:#72d9c2">Atlas</span></b><a href="region.html?area=hip">← Тазобедренный сустав</a></header><main><span class="eyebrow">ПРАКТИЧЕСКИЙ МР-СПРАВОЧНИК</span><h1>ФАИ и суставная губа</h1><p class="lead">Фемороацетабулярный импинджмент: костная форма → губа → хрящ → заключение.</p><nav class="tabs" role="tablist">'+''.join(f'<button id="tab{i}" role="tab" aria-controls="panel{i}" aria-selected="{str(i==0).lower()}" tabindex="{0 if i==0 else -1}" data-tab="{i}" class="'+('active' if i==0 else '')+'">'+t+'</button>' for i,t in enumerate(tabs))+'</nav>'+''.join(f'<section class="panel" role="tabpanel" id="panel{i}" aria-labelledby="tab{i}" '+('hidden' if i else '')+'>'+p+'</section>' for i,p in enumerate(panels))+'</main><dialog id="zoom"><h2>Условная схема</h2><div id="zoomFigure"></div><button id="closeZoom">Закрыть</button></dialog>'
js='const FIGS='+json.dumps(figs,ensure_ascii=False)+';const MORPH='+json.dumps(patterns,ensure_ascii=False)+';const LAB='+json.dumps(labs,ensure_ascii=False)+''';
const tabs=[...document.querySelectorAll('[data-tab]')];function tab(n,focus=false){tabs.forEach((b,i)=>{b.classList.toggle('active',i===n);b.setAttribute('aria-selected',i===n);b.tabIndex=i===n?0:-1;document.getElementById('panel'+i).hidden=i!==n});if(focus)tabs[n].focus()}
tabs.forEach((b,i)=>{b.onclick=()=>tab(i);b.onkeydown=e=>{let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==undefined){e.preventDefault();tab(n,true)}}});
function choose(prefix,data,n){const p=data[n];document.getElementById(prefix+'figure').innerHTML='<button class="figurebtn" data-figure="'+p[1]+'" aria-label="Увеличить схему">'+FIGS[p[1]]+'</button>';for(const [suffix,j] of [['title',0],['look',2],['key',3],['trap',4]])document.getElementById(prefix+suffix).textContent=p[j];document.querySelectorAll('[data-'+prefix+']').forEach((b,i)=>{b.classList.toggle('active',i===n);b.setAttribute('aria-pressed',i===n)})}
document.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>choose('m',MORPH,+b.dataset.m));document.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>choose('l',LAB,+b.dataset.l));choose('m',MORPH,0);choose('l',LAB,0);
const zoom=document.getElementById('zoom');let opener;document.addEventListener('click',e=>{const b=e.target.closest('[data-figure]');if(b){opener=b;document.getElementById('zoomFigure').innerHTML=FIGS[b.dataset.figure];zoom.showModal()}});document.getElementById('closeZoom').onclick=()=>zoom.close();zoom.addEventListener('close',()=>opener?.focus());zoom.addEventListener('click',e=>{if(e.target===zoom){const r=zoom.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)zoom.close()}});
document.querySelectorAll('.copy').forEach(b=>b.onclick=async()=>{const t=b.previousElementSibling.textContent;let ok=false;try{await navigator.clipboard.writeText(t);ok=true}catch{}if(!ok){const a=document.createElement('textarea');a.value=t;a.className='fallback';b.after(a);a.focus();a.select();try{ok=document.execCommand('copy')}catch{}if(ok)a.remove();else a.setAttribute('aria-label','Текст для ручного копирования')}document.getElementById('copyStatus').textContent=ok?'Скопировано. Проверьте и заполните пропуски.':'Выделите текст и скопируйте вручную.'});
'''
html='<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0e1721"><title>ФАИ и суставная губа · MRIAtlas</title><style>'+css+'</style></head><body>'+body+'<script>'+js+'</script></body></html>'
(A/'hip-impingement.html').write_text(html)
(A/'menu-thumbs/hip-impingement.svg').write_text(morph('mixed'))
print('hip237: 7 tabs,',len(figs),'figures,',len(templates),'templates')
