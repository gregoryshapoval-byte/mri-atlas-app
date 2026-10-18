#!/usr/bin/env python3
"""Emit metadata only: no images, labels, or decrypted database in artifacts."""
import json,sqlite3,zipfile,collections,os
from pathlib import Path
source=Path('/tmp/shoulder-source')
db=sqlite3.connect(source/'eanatomy-readable.db')
db.row_factory=sqlite3.Row
def query(sql,args=()):
 return [dict(x) for x in db.execute(sql,args)]
mods=query("SELECT _id,imaios_code FROM module WHERE lower(imaios_code) LIKE '%shoulder%' OR lower(imaios_code) LIKE '%arthro%'")
tables={r[0] for r in db.execute("SELECT name FROM sqlite_master WHERE type='table'")}
output={'modules':[],'archives':[]}
for filename in ['shoulder.zip','shoulder-ct-arthrogram.zip']:
 with zipfile.ZipFile(source/filename) as z:
  names=z.namelist()
  suffix=collections.Counter(Path(x).suffix.lower() for x in names)
  output['archives'].append({'file':filename,'entries':len(names),'extensions':dict(suffix),'sample_names':names[:5]})
for m in mods:
 item={'code':m['imaios_code'],'series':[]}
 for s in query("SELECT _id,name_id,sort_order FROM series WHERE module_id=? ORDER BY sort_order,_id",(m['_id'],)):
  slices=query("SELECT _id,sort_order FROM slice WHERE series_id=? ORDER BY sort_order,_id",(s['_id'],))
  contrasts=query("SELECT imaios_code FROM contrast WHERE series_id=? ORDER BY sort_order,_id",(s['_id'],))
  annotations=db.execute("SELECT count(*) FROM point WHERE slice_id IN (SELECT _id FROM slice WHERE series_id=?)",(s['_id'],)).fetchone()[0] if 'point' in tables else None
  item['series'].append({'id':s['_id'],'name_id':s['name_id'],'slice_count':len(slices),'contrasts':[c['imaios_code'] for c in contrasts],'points':annotations})
 output['modules'].append(item)
Path('shoulder-source-metadata.json').write_text(json.dumps(output,ensure_ascii=False,indent=2))
print(json.dumps(output,ensure_ascii=False,indent=2))
