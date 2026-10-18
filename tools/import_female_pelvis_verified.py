"""Restore verified female-pelvis annotations from user's archived IMAIOS data.
The derived database key stays in memory, never in the repository or build logs.
"""
import base64, hashlib, io, json, sqlite3, tempfile, zipfile
from pathlib import Path
from PIL import Image
from androguard.core.dex import DEX
from sqlcipher3 import dbapi2 as sql
from loguru import logger
logger.remove()

ROOT=Path(__file__).resolve().parent.parent
ASSETS=ROOT/'app/src/main/assets'
def digest(value): return hashlib.sha256(value).hexdigest()

with zipfile.ZipFile(ROOT/'female-pelvis-source-minimal.zip') as outer:
    apkbytes=outer.read('base.apk')
    dbbytes=outer.read('eAnatomy.db')
    jpegzip=outer.read('pelvis.zip')
with zipfile.ZipFile(io.BytesIO(apkbytes)) as apk:
    dex=DEX(apk.read('classes.dex'))
method=next(m for m in dex.get_class('Leanatomy/library/a/a;').get_methods()
            if m.get_name()=='b' and m.get_descriptor()=='()Ljava/lang/String;')
instruction=next(i for i in method.get_instructions() if i.get_name()=='const-string')
encoded=instruction.get_operands()[-1][-1]
key=''.join(chr(ord(c)^128) for c in base64.b64decode(encoded).decode('utf-8'))[::-1]
with tempfile.TemporaryDirectory() as d:
    encrypted=Path(d)/'encrypted.db';encrypted.write_bytes(dbbytes)
    readable=Path(d)/'readable.db'
    con=sql.connect(str(encrypted))
    con.execute("PRAGMA key='"+key.replace("'","''")+"'")
    con.execute('PRAGMA cipher_compatibility=3')
    con.execute('select count(*) from sqlite_master').fetchone()
    con.execute("ATTACH DATABASE ? AS plain KEY ''",(str(readable),))
    con.execute("SELECT sqlcipher_export('plain')")
    con.execute("DETACH DATABASE plain")
    con.close()
    db=sqlite3.connect(str(readable));db.row_factory=sqlite3.Row
    ru=dict(db.execute('select imaios_key,value from translation where lang_id=10'))
    en=dict(db.execute('select imaios_key,value from translation where lang_id=2'))
    def tr(n): return ru.get(n) or en.get(n) or str(n)
    module=db.execute('select * from module where imaios_code=?',('pelvis',)).fetchone()
    assert module is not None,'Female pelvis source module not found'
    filters=list(db.execute('select * from filter where module_id=? order by sort_order,_id',(module['_id'],)))
    annotations={'source':'IMAIOS e-Anatomy / user-supplied backup','filters':{'pelvis':[]},'slices':{}}
    for f in filters:
        annotations['filters']['pelvis'].append({'id':f['_id'],'name':tr(f['name_id']),'parent':f['parent_id'] or None,'layer':f['layer'],'default':bool(f['default_active'])})
    manifest={'source':'IMAIOS e-Anatomy / user-supplied backup','series':[]}
    dest=ASSETS/'female-pelvis-mri-images';dest.mkdir(exist_ok=True)
    with zipfile.ZipFile(io.BytesIO(jpegzip)) as source:
        members=set(source.namelist())
        for s in db.execute('select * from series where module_id=? order by sort_order',(module['_id'],)):
            slices=list(db.execute('select * from slice where series_id=? order by sort_order',(s['_id'],)))
            contrasts=list(db.execute('select * from contrast where series_id=? order by sort_order',(s['_id'],))) or [{'imaios_code':'contraste_','name_id':None}]
            for contrast in contrasts:
                cn=tr(contrast['name_id']) if contrast['name_id'] else ''
                plane=tr(s['name_id'])
                sid=str(s['_id'])+'-'+contrast['imaios_code']
                ser={'id':sid,'title':(cn+' · ' if cn else '')+plane,'module':'pelvis','sourceSeries':s['_id'],'group':'mri','plane':plane,'frames':[]}
                for sl in slices:
                    stem=f"images-{sl['sort_order']:04}"
                    original=digest(f"pelvis#{contrast['imaios_code']}#{stem}.jpg".encode())
                    if original not in members:raise ValueError('Missing source frame '+original)
                    raw=source.read(original)
                    width,height=Image.open(io.BytesIO(raw)).size
                    filename=f"{sid}-{sl['sort_order']:04}.jpg"
                    (dest/filename).write_bytes(raw)
                    slkey=str(sl['_id'])
                    ser['frames'].append({'src':'female-pelvis-mri-images/'+filename,'annotation':slkey,'original':original,'sha256':digest(raw),'width':width,'height':height,'sourceFrame':sl['sort_order']})
                    if slkey in annotations['slices']:continue
                    points=[]
                    for p in db.execute('select p.*,st.name_id from point p join structure st on p.structure_id=st._id where p.slice_id=? order by p._id',(sl['_id'],)):
                        assert 0<=p['x_pixel']<=width and 0<=p['y_pixel']<=height
                        points.append({'id':p['_id'],'structure':p['structure_id'],'name':tr(p['name_id']),'x':p['x_pixel'],'y':p['y_pixel'],'color':'#'+p['color'].lstrip('#'),'filter':p['filter_id']})
                    masks=[]
                    for f in filters:
                        if not f['layer']:continue
                        name=digest(f"pelvis#{f['layer']}#{stem}.png".encode())
                        if name in members:
                            maskfile=f"{slkey}-{f['_id']}.png"
                            (dest/maskfile).write_bytes(source.read(name))
                            masks.append({'filter':f['_id'],'src':'female-pelvis-mri-images/'+maskfile})
                    annotations['slices'][slkey]={'points':points,'masks':masks}
                manifest['series'].append(ser)
    db.close()
counts=(sum(len(s['frames']) for s in manifest['series']),len(annotations['slices']),sum(len(v['points']) for v in annotations['slices'].values()),sum(len(v['masks']) for v in annotations['slices'].values()),len(filters))
assert counts==(116,70,2737,51,11),f'Unexpected source counts: {counts}'
(ASSETS/'female-pelvis-mri-data.json').write_text(json.dumps(manifest,ensure_ascii=False,separators=(',',':')))
(ASSETS/'female-pelvis-mri-labels.json').write_text(json.dumps(annotations,ensure_ascii=False,separators=(',',':')))
print('Verified female pelvis data: frames, slices, points, masks, groups:',counts)
