#!/usr/bin/env python3
"""Import verified JPEGs; preserve archive entry order without claiming anatomical slice order."""
import io, json, pathlib, zipfile
root=pathlib.Path(__file__).resolve().parent
assets=root/'app/src/main/assets'
with zipfile.ZipFile(root/'female-pelvis-source-minimal.zip') as outer:
    with zipfile.ZipFile(io.BytesIO(outer.read('pelvis.zip'))) as inner:
        names=[n for n in inner.namelist() if not n.endswith('/')]
        dest=assets/'female-pelvis-mri-images'
        dest.mkdir(exist_ok=True)
        frames=[]
        for i,name in enumerate(names,1):
            blob=inner.read(name)
            if not blob[:3] == bytes([255,216,255]):
                raise ValueError('Non-JPEG image '+name)
            filename=f'frame-{i:03}.jpg'
            (dest/filename).write_bytes(blob)
            frames.append({'src':f'female-pelvis-mri-images/{filename}'})
        assert len(frames)==270, f'Unexpected file count: {len(frames)}'
data={'series':[{'id':'source','title':'Исходные изображения (порядок ZIP)','group':'mri','plane':'Не установлена','contrast':'Не установлен','frames':frames}]}
(assets/'female-pelvis-mri-data.json').write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')),encoding='utf8')
(assets/'female-pelvis-mri-labels.json').write_text('{"series":{}}',encoding='utf8')
js=(assets/'male-pelvis-mri.js').read_text(encoding='utf8')
js=js.replace('male-pelvis-mri-', 'female-pelvis-mri-')
js=js.replace("'male-pelvis-mri-view-v1'", "'female-pelvis-mri-view-v1'")
js=js.replace("'220 МРТ-срезов: AX, SAG и COR. Подписи можно отключить в панели.'","'270 JPEG-изображений; порядок и плоскости срезов не подтверждены.'")
js=js.replace("const f=$('#filter').value;if(['ax','cor','sag'].includes(f))ss=ss.filter(s=>s.id===f);return ss;","return ss;")
(assets/'female-pelvis-mri.js').write_text(js,encoding='utf8')
html=(assets/'male-pelvis-mri.html').read_text(encoding='utf8')
html=html.replace('Мужской таз','Женский таз').replace('мужского таза','женского таза').replace('male-pelvis-mri','female-pelvis-mri')
html=html.replace('220 МРТ-срезов: AX, SAG и COR.','270 JPEG-изображений (порядок и плоскости не подтверждены).')
html=html.replace('<span class="groupLabel">Плоскость:</span><select id="filter"><option value="all">Все</option><option value="ax">AX</option><option value="sag">SAG</option><option value="cor">COR</option></select>', '<select id="filter" hidden><option value="all">Все изображения</option></select>')
html=html.replace('<label><input id="compare" type="checkbox"> Два окна</label>', '<label hidden><input id="compare" type="checkbox"> Два окна</label>')
html=html.replace('220 МРТ-срезов мужского таза:</b> 65 аксиальных, 80 сагиттальных и 75 коронарных. Изображения перенесены из пользовательского архива IMAIOS e-Anatomy.', '270 JPEG-изображений женского таза.</b> Снимки перенесены из пользовательского архива IMAIOS e-Anatomy в исходном порядке записей ZIP, который не является проверенным порядком срезов. База соответствий зашифрована, поэтому анатомические координаты, подписи, последовательности и плоскости пока не восстановлены.')
(assets/'female-pelvis-mri.html').write_text(html,encoding='utf8')
path=assets/'regions.js'
text=path.read_text(encoding='utf8')
needle="pelvis:{name:'Малый таз',items:["
assert needle in text
text=text.replace(needle,needle+"['МРТ женского таза · исходные изображения','270 JPEG: просмотр без подтверждённой сортировки по плоскостям. Анатомические метки ещё не восстановлены.','female-pelvis-mri.html','НОВОЕ'],")
path.write_text(text,encoding='utf8')
print('Imported',len(frames),'source images, no speculative anatomical labels')
