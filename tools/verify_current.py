"""Verify prepared files and optionally the full APK against the pinned baseline."""
import argparse, hashlib, json, os, struct, subprocess, zipfile
from pathlib import Path
from runtime_current import ROOT,CONFIG,ASSETS,base_apk, is_signature, manifest,validate_assets,sha
from apk_manifest import patch,info

def verify(apk=None, signer=None, base=None):
    base=base_apk(base)
    report=validate_assets(base=base)
    subprocess.run(['python3',str(ROOT/'tools/release_metadata.py'),'--check'],check=True,cwd=ROOT)
    subprocess.run(['node',str(ROOT/'tools/generate_search252.mjs'),'--check','--base',str(base)],check=True,cwd=ROOT)
    if apk:
        baseline=manifest(base);apk=Path(apk)
        with zipfile.ZipFile(apk) as z:
            if z.testzip() is not None:raise ValueError('Corrupt APK')
            if len(z.namelist())!=len(set(z.namelist())):raise ValueError('Duplicate ZIP entries')
            assets={n[7:] for n in z.namelist() if n.startswith('assets/') and not n.endswith('/')}
            if assets != set(baseline['assets']) | set(CONFIG.get('additions', [])):raise ValueError('APK lost or added an asset')
            for name in assets:
                if z.read('assets/'+name)!=(ASSETS/name).read_bytes():raise ValueError('APK asset differs: '+name)
            extra={n for n in z.namelist() if not n.endswith('/') and not n.startswith('assets/') and not is_signature(n)}-set(baseline['native'])
            if extra:raise ValueError('Unexpected native files: '+repr(sorted(extra)))
            for name,row in baseline['native'].items():
                if name=='AndroidManifest.xml':continue
                if hashlib.sha256(z.read(name)).hexdigest()!=row['sha256']:raise ValueError('Native payload changed: '+name)
            values=info(z.read('AndroidManifest.xml'))
            if values!={'package':CONFIG['package'],'versionName':CONFIG['version'],'versionCode':CONFIG['versionCode']}:raise ValueError('APK version mismatch')
            with apk.open('rb') as f:
                for entry in z.infolist():
                    if entry.compress_type==zipfile.ZIP_STORED:
                        f.seek(entry.header_offset+26);n,e=struct.unpack('<HH',f.read(4))
                        if (entry.header_offset+30+n+e)%4:raise ValueError('Unaligned stored entry: '+entry.filename)
        report.update({'version':CONFIG['version'],'versionCode':CONFIG['versionCode'],'package':CONFIG['package'],'bytes':apk.stat().st_size,'sha256':sha(apk),'native_payload_preserved':True,'stored_entries_aligned':True})
        if signer:
            result=subprocess.check_output(['java','-jar',str(signer),'verify','--verbose','--print-certs','--min-sdk-version',str(CONFIG['signing']['verify_min_sdk']),str(apk)],text=True)
            enabled = [version for version in ('v1', 'v2', 'v3') if CONFIG['signing'][version]]
            labels = {'v1':'JAR signing', 'v2':'APK Signature Scheme v2', 'v3':'APK Signature Scheme v3'}
            for s in [CONFIG['certificate_sha256'], *(f'{v} scheme ({labels[v]}): true' for v in enabled)]:
                if s not in result:raise ValueError('APK signature verification failed: '+s)
            report['certificate_sha256']=CONFIG['certificate_sha256'];report['verified_signature_schemes']=enabled
        if (CONFIG['version'], CONFIG['versionCode']) == (CONFIG['base']['version'], CONFIG['base']['versionCode']):
            with zipfile.ZipFile(base) as original, zipfile.ZipFile(apk) as rebuilt:
                if original.read('AndroidManifest.xml') != rebuilt.read('AndroidManifest.xml'):
                    raise ValueError('Rebuilt baseline changed AndroidManifest.xml')
            report['published_apk_sha256']=CONFIG['base']['sha256']
            report['matches_published_apk_sha256']=report['sha256']==report['published_apk_sha256']
    (ROOT/'build/current-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(report,ensure_ascii=False));return report

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--apk',type=Path);p.add_argument('--signer',type=Path);p.add_argument('--base',type=Path);a=p.parse_args();verify(a.apk,a.signer,a.base)
