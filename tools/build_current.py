"""Build an asset-only update; preserve verified executable/resources byte-for-byte."""
import argparse, copy, hashlib, os, struct, subprocess, zipfile
from pathlib import Path
from runtime_current import ROOT, CONFIG, ASSETS, base_apk, is_signature, validate_assets
from prepare_runtime import prepare
from apk_manifest import patch
from verify_current import verify

def main():
    p=argparse.ArgumentParser();p.add_argument('--base');p.add_argument('--unsigned',action='store_true');p.add_argument('--prepared',action='store_true');p.add_argument('--output',type=Path);a=p.parse_args()
    base=base_apk(a.base)
    if not a.prepared:prepare(str(base))
    validate_assets(base=base)
    output=a.output or ROOT/'build'/('MRIAtlas-'+CONFIG['version']+('-unsigned' if a.unsigned else '')+'.apk');output=output.resolve();output.parent.mkdir(parents=True,exist_ok=True)
    unsigned=output if a.unsigned else output.with_name(output.stem+'-unsigned.apk')
    with zipfile.ZipFile(base) as source,zipfile.ZipFile(unsigned,'w') as target:
        for old in source.infolist():
            if is_signature(old.filename):continue
            raw=source.read(old)
            if old.filename=='AndroidManifest.xml':raw=patch(raw,CONFIG)
            elif old.filename.startswith('assets/') and not old.is_dir():raw=(ASSETS/old.filename[7:]).read_bytes()
            entry=copy.copy(old);entry.extra=b''
            if entry.compress_type==zipfile.ZIP_STORED:
                pad=(-(target.fp.tell()+30+len(entry.filename.encode('utf8'))))%4
                if pad:entry.extra=struct.pack('<HH',0xd935,pad)+b'\0'*pad
            target.writestr(entry,raw)
        for name in sorted(CONFIG.get('additions', [])):
            target.write(ASSETS / name, f'assets/{name}', compress_type=zipfile.ZIP_DEFLATED)
    if a.unsigned:verify(output, base=base);return
    signer=Path(os.environ['APKSIGNER_JAR']).resolve();key=Path(os.environ.get('KEYSTORE_FILE',ROOT.parent/'atlas-signing/atlas.keystore')).resolve()
    cert=subprocess.check_output(['keytool','-exportcert','-keystore',str(key),'-storepass','android','-alias','atlas'],stderr=subprocess.DEVNULL)
    if hashlib.sha256(cert).hexdigest()!=CONFIG['certificate_sha256']:raise ValueError('Wrong signing key')
    schemes = [argument for version in ('v1', 'v2', 'v3', 'v4')
               for argument in (f'--{version}-signing-enabled', str(CONFIG['signing'][version]).lower())]
    subprocess.run(['java','-jar',str(signer),'sign' ,'--ks',str(key),'--ks-key-alias','atlas','--ks-pass','pass:android','--key-pass','pass:android',*schemes,'--out',str(output),str(unsigned)],check=True)
    verify(output,signer,base=base)

if __name__=='__main__':main()
