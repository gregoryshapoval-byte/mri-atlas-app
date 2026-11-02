"""Restore the complete recovered runtime from saved 2.90 APK plus this patch.
python3 tools/restore_delta299.py /path/MRIAtlas-2.90.apk /path/restored-project
Run from the extracted patch folder. No keys are created or bundled.
"""
from pathlib import Path
from zipfile import ZipFile
import hashlib,shutil,sys,json
ROOT=Path(__file__).resolve().parents[1]
def main():
 base=Path(sys.argv[1]);target=Path(sys.argv[2]).resolve();assert not target.exists(),'Choose a new destination'
 assert hashlib.sha256(base.read_bytes()).hexdigest()=='cd77066eba745d9be02e81ca03094020a20ecd58cc5fd481f1077153061edb07','Not the saved 2.90 APK'
 target.mkdir(parents=True)
 with ZipFile(base)as z:
  assert z.testzip()is None
  for n in z.namelist():
   if n.endswith('/')or n.startswith('META-INF/'):continue
   dest=target/'app/src/main'/n if n.startswith('assets/')else target/'native-base290'/n
   dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(z.read(n))
 for name in ['app','tools','review']:
  if (ROOT/name).exists():shutil.copytree(ROOT/name,target/name,dirs_exist_ok=True)
 for name in ['RECOVERY.md','PATCH-MANIFEST.json']:
  if (ROOT/name).exists():shutil.copyfile(ROOT/name,target/name)
 manifest=json.loads((ROOT/'PATCH-MANIFEST.json').read_text())
 for n,sha in manifest['complete_assets'].items():
  assert hashlib.sha256((target/'app/src/main/assets'/n).read_bytes()).hexdigest()==sha,n
 print('Restored complete runtime:',target,'assets:',len(manifest['complete_assets']))
if __name__=='__main__':main()
