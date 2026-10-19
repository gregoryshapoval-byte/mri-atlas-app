"""Pack only CT images, masks and group icons for offline reproduction."""
from pathlib import Path
import hashlib,io,json,zipfile
A=Path('app/src/main/assets');P=Path('source-assets/ct165');P.mkdir(parents=True,exist_ok=True)
files=sorted(p for mod in ['abdomen-ct','abdomen-pelvis-ct'] for p in (A/(mod+'-source')).iterdir())
h=lambda raw:hashlib.sha256(raw).hexdigest()
manifest={'files':[],'parts':[]}
buf=io.BytesIO()
with zipfile.ZipFile(buf,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in files:
  assert p.suffix in {'.jpg','.png'}
  raw=p.read_bytes();name=p.relative_to(A).as_posix();info=zipfile.ZipInfo(name,(2026,10,19,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;z.writestr(info,raw);manifest['files'].append({'path':name,'size':len(raw),'sha256':h(raw)})
raw=buf.getvalue();manifest['zipSha256']=h(raw)
for i,start in enumerate(range(0,len(raw),1024*1024)):
 data=raw[start:start+1024*1024];name=f'ct165-{i:03}.part';(P/name).write_bytes(data);manifest['parts'].append({'file':name,'size':len(data),'sha256':h(data)})
(P/'manifest.json').write_text(json.dumps(manifest,separators=(',',':')))
print(len(files),'files',len(raw),'packed bytes',len(manifest['parts']),'parts')
