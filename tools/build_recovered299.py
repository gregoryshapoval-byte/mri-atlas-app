"""Build the recovered asset snapshot using its preserved Android payload.
Usage: APKSIGNER_JAR=/path/apksigner.jar KEYSTORE_FILE=/path/atlas.keystore python3 tools/build_recovered299.py /absolute/output.apk
The preserved owner-approved key is required; this tool never generates keys.
"""
from pathlib import Path
from zipfile import ZipFile,ZipInfo,ZIP_DEFLATED,ZIP_STORED
import os,sys,hashlib,subprocess,struct,json
from repack299 import patch_manifest
R=Path(__file__).resolve().parents[1];A=R/'app/src/main/assets';N=R/'native-base290'
def main():
 out=Path(sys.argv[1]).resolve();out.parent.mkdir(parents=True,exist_ok=True);unsigned=out.with_name(out.stem+'-unsigned.apk')
 expected='cb7d43e1eb8ff4c1eee663e918b5413b70fb9d6f8221790075f83c7e153624fe'
 key=Path(os.environ['KEYSTORE_FILE']);jar=Path(os.environ['APKSIGNER_JAR'])
 cert=subprocess.check_output(['keytool','-exportcert','-keystore',str(key),'-storepass','android','-alias','atlas'],stderr=subprocess.DEVNULL)
 assert hashlib.sha256(cert).hexdigest()==expected,'Wrong certificate; refusing to sign'
 with ZipFile(unsigned,'w')as z:
  for prefix,root in [('',N),('assets/',A)]:
   for p in sorted(root.rglob('*')):
    if not p.is_file():continue
    name=prefix+p.relative_to(root).as_posix();raw=p.read_bytes()
    if name=='AndroidManifest.xml':raw=patch_manifest(raw)
    info=ZipInfo(name,date_time=(2026,11,2,0,0,0));info.compress_type=ZIP_STORED if name=='resources.arsc'else ZIP_DEFLATED
    if info.compress_type==ZIP_STORED:
     pad=(-(z.fp.tell()+30+len(name.encode())))%4
     if pad:info.extra=struct.pack('<HH',0xd935,pad)+b'\0'*pad
    z.writestr(info,raw)
 subprocess.run(['java','-jar',str(jar),'sign','--ks',str(key),'--ks-key-alias','atlas','--ks-pass','pass:android','--key-pass','pass:android','--v2-signing-enabled','true','--v3-signing-enabled','true','--out',str(out),str(unsigned)],check=True)
 verification=subprocess.check_output(['java','-jar',str(jar),'verify','--verbose','--print-certs',str(out)],text=True)
 assert expected in verification and 'v2): true'in verification and 'v3): true'in verification
 with ZipFile(out)as z:
  assert z.testzip()is None
  for p in A.rglob('*'):
   if p.is_file():assert z.read('assets/'+p.relative_to(A).as_posix())==p.read_bytes()
  assert z.read('classes.dex')==(N/'classes.dex').read_bytes()
 print(verification);print(json.dumps(dict(file=str(out),sha256=hashlib.sha256(out.read_bytes()).hexdigest(),bytes=out.stat().st_size)))
if __name__=='__main__':main()
