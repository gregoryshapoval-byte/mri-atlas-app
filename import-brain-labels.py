from pathlib import Path
import sqlite3,json,hashlib
root=Path(__file__).resolve().parent;assets=root/'app/src/main/assets';source=root.parent/'eanatomy-unpacked/modules'
c=sqlite3.connect('/tmp/eanatomy-readable.db');c.row_factory=sqlite3.Row
translations={r['imaios_key']:r['value'] for r in c.execute('select * from translation where lang_id=10')}
def tr(n):return translations.get(n) or next((r[0] for r in c.execute('select value from translation where imaios_key=? and lang_id=2',(n,))),str(n))
m=json.loads((assets/'brain-data.json').read_text());payload={'source':m['source'],'filters':{},'slices':{}}
seriesmap={'ax':568,'cor':569,'sag':570};codes={'adc':'contraste_diffusion','flair':'contraste_flair','t1c':'contraste_T1gado','t2':'contraste_T2','dwi':'contraste_T2et','t1':'contraste_'}
counts={'points':0,'masks':0};maskdir=assets/'brain-masks';maskdir.mkdir(exist_ok=True)
for module,mid in [('brain3dmri',74),('cerveau',99)]:
 filters=[dict(r) for r in c.execute('select * from filter where module_id=? order by sort_order,_id',(mid,))]
 payload['filters'][module]=[{'id':r['_id'],'name':tr(r['name_id']),'parent':r['parent_id'],'layer':r['layer'],'default':bool(r['default_active'])} for r in filters]
for s in m['series']:
 sid=seriesmap.get(s['id'],747);sl=list(c.execute('select * from slice where series_id=? order by sort_order',(sid,)))
 assert len(sl)==len(s['frames'])
 code=codes.get(s['id'],'contraste_');s['title']=('T1 · '+s['plane'].lower()) if sid!=747 else tr(c.execute('select name_id from contrast where series_id=747 and imaios_code=?',(code,)).fetchone()[0])
 for f,row in zip(s['frames'],sl):
  original=hashlib.sha256(f"{s['module']}#{code}#images-{row['sort_order']:04}.jpg".encode()).hexdigest()
  assert original==f['original'],(s['id'],row['sort_order'])
  key=str(row['_id']);f['annotation']=key
  if key in payload['slices']:continue
  points=[]
  for r in c.execute('select p.*,s.name_id from point p join structure s on p.structure_id=s._id where p.slice_id=? order by p._id',(row['_id'],)):
   assert 0<=r['x_pixel']<=f['width'] and 0<=r['y_pixel']<=f['height']
   points.append({'id':r['_id'],'structure':r['structure_id'],'name':tr(r['name_id']),'x':r['x_pixel'],'y':r['y_pixel'],'color':'#'+r['color'],'filter':r['filter_id']})
  masks=[]
  for fl in payload['filters'][s['module']]:
   if not fl['layer']:continue
   name=hashlib.sha256(f"{s['module']}#{fl['layer']}#images-{row['sort_order']:04}.png".encode()).hexdigest();p=source/s['module']/name
   if p.exists():
    dest=maskdir/f"{key}-{fl['id']}.png";dest.write_bytes(p.read_bytes());masks.append({'filter':fl['id'],'src':'brain-masks/'+dest.name});counts['masks']+=1
  payload['slices'][key]={'points':points,'masks':masks};counts['points']+=len(points)
(assets/'brain-data.json').write_text(json.dumps(m,ensure_ascii=False,separators=(',',':')))
(assets/'brain-labels.json').write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':')))
print('Verified image-to-slice mapping for 497 frames;',counts)
