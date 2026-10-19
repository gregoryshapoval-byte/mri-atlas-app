"""Restore byte-identical offline CT assets from versioned chunks, without network.
Archives contain images/masks only; validate every path and digest before writing.
"""
from pathlib import Path,PurePosixPath
import hashlib,json,zipfile,tempfile,shutil
R=Path(__file__).resolve().parents[1];pack=R/'source-assets/ct165';dest=R/'app/src/main/assets'
manifest=json.loads((pack/'manifest.json').read_text());expected={x['path']:x for x in manifest['files']}
for name in expected:
 p=PurePosixPath(name)
 if p.is_absolute() or '..' in p.parts or p.parts[0] not in {'abdomen-ct-source', 'abdomen-pelvis-ct-source'}:raise ValueError('Unexpected packed path')
 if p.suffix not in {'.jpg','.png'}:raise ValueError('Unexpected packed asset type')
missing=[]
for name,entry in expected.items():
 p=dest/name
 if p.exists():
  if hashlib.sha256(p.read_bytes()).hexdigest()!=entry['sha256']:raise ValueError('Existing asset mismatch: '+name)
 else:missing.append(name)
if missing:
 with tempfile.TemporaryFile() as f:
  digest=hashlib.sha256()
  for part in manifest['parts']:
   raw=(pack/part['file']).read_bytes();assert len(raw)==part['size'] and hashlib.sha256(raw).hexdigest()==part['sha256'];digest.update(raw);f.write(raw)
  assert digest.hexdigest()==manifest['zipSha256'];f.seek(0)
  with zipfile.ZipFile(f) as z:
   assert set(z.namelist())==set(expected)
   for name in missing:
    raw=z.read(name);entry=expected[name];assert len(raw)==entry['size'] and hashlib.sha256(raw).hexdigest()==entry['sha256']
    p=dest/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(raw)
print('Verified exact offline CT image assets:',len(expected),'restored:',len(missing))
