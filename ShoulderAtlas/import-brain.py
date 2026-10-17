"""Import unmodified full-resolution MRI JPEGs in ZIP member order."""
from pathlib import Path
from PIL import Image
import io, json, zipfile, hashlib

root = Path(__file__).resolve().parent
source = root.parent / 'eanatomy-unpacked/data'
assets = root / 'app/src/main/assets'
out = assets / 'brain-images'
out.mkdir(exist_ok=True)
sets = {}
for module in ['brain3dmri', 'cerveau']:
    with zipfile.ZipFile(next(source.rglob(module + '.zip'))) as z:
        frames = []
        for member in z.infolist():
            data = z.read(member)
            im = Image.open(io.BytesIO(data))
            if im.format == 'JPEG' and im.width > 400:
                frames.append((member.filename, data, im.size))
        sets[module] = frames
assert len(sets['brain3dmri']) == 379 and len(sets['cerveau']) == 144
spec = [
    ('ax', 'T1-подобная · аксиальная', 'brain3dmri', 0, 132, 'Аксиальная', 'multiplanar'),
    ('cor', 'T1-подобная · коронарная', 'brain3dmri', 132, 289, 'Коронарная', 'multiplanar'),
    ('sag', 'T1-подобная · сагиттальная', 'brain3dmri', 289, 353, 'Сагиттальная', 'multiplanar'),
    ('adc', '1 · Карта диффузии*', 'cerveau', 0, 24, 'Аксиальная', 'contrast'),
    ('flair', '2 · FLAIR*', 'cerveau', 24, 48, 'Аксиальная', 'contrast'),
    ('t1c', '3 · T1 с контрастом*', 'cerveau', 48, 72, 'Аксиальная', 'contrast'),
    ('t2', '4 · T2*', 'cerveau', 72, 96, 'Аксиальная', 'contrast'),
    ('dwi', '5 · DWI*', 'cerveau', 96, 120, 'Аксиальная', 'contrast'),
    ('t1', '6 · T1*', 'cerveau', 120, 144, 'Аксиальная', 'contrast'),
]
series = []
for sid, title, module, start, end, plane, group in spec:
    frames = []
    for i, (original, data, size) in enumerate(sets[module][start:end]):
        name = f'{sid}-{i+1:03}.jpg'
        (out / name).write_bytes(data)
        frames.append({'src': 'brain-images/' + name, 'original': original,
                       'sha256': hashlib.sha256(data).hexdigest(), 'width': size[0], 'height': size[1]})
    series.append({'id': sid, 'title': title, 'module': module, 'plane': plane,
                   'group': group, 'frames': frames})
manifest = {'source': 'IMAIOS e-Anatomy · пользовательский архив net.imaios.eanatomy.zip',
            'version': 1, 'series': series}
(assets / 'brain-data.json').write_text(json.dumps(manifest, ensure_ascii=False, separators=(',', ':')))
print('Imported', sum(len(s['frames']) for s in series), 'MRI images,', len(series), 'series')
