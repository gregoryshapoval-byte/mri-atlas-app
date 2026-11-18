"""Prepare current runtime atomically from verified 3.44 plus reviewed overrides."""
import argparse, hashlib, json, shutil, subprocess, tempfile, zipfile
from pathlib import Path
from runtime_current import ROOT, CONFIG, ASSETS, base_apk, manifest, asset_name, validate_assets

def prepare(base=None):
    apk = base_apk(base)
    baseline = manifest()['assets']
    actual_overrides = {p.relative_to(ROOT/'runtime-overrides').as_posix() for p in (ROOT/'runtime-overrides').rglob('*') if p.is_file()}
    if actual_overrides != set(CONFIG['overrides']): raise ValueError('Override files must be explicitly registered')
    ASSETS.parent.mkdir(parents=True, exist_ok=True)
    staging = Path(tempfile.mkdtemp(prefix='runtime-staging-', dir=ASSETS.parent))
    try:
        with zipfile.ZipFile(apk) as z:
            names={n[7:] for n in z.namelist() if n.startswith('assets/') and not n.endswith('/')}
            if names != set(baseline): raise ValueError('Base file inventory mismatch')
            for name, row in baseline.items():
                raw=z.read('assets/'+asset_name(name))
                if len(raw)!=row['bytes'] or hashlib.sha256(raw).hexdigest()!=row['sha256']: raise ValueError('Base asset mismatch: '+name)
                out=staging/name;out.parent.mkdir(parents=True,exist_ok=True);out.write_bytes(raw)
        for name in CONFIG['overrides']:
            shutil.copyfile(ROOT/'runtime-overrides'/name,staging/name)
        subprocess.run(['python3', str(ROOT/'tools/release_metadata.py'), '--root', str(staging)],check=True,cwd=ROOT)
        subprocess.run(['node', str(ROOT/'tools/generate_search252.mjs'), '--root', str(staging), '--base',str(apk)],check=True,cwd=ROOT)
        report=validate_assets(staging)
        # Only derived build output is replaced; sources and historical assets are never touched.
        previous=ASSETS.with_name('runtime-previous')
        if previous.exists(): shutil.rmtree(previous)
        if ASSETS.exists(): ASSETS.replace(previous)
        try: staging.replace(ASSETS)
        except BaseException:
            if previous.exists(): previous.replace(ASSETS)
            raise
        if previous.exists(): shutil.rmtree(previous)
        print(json.dumps(report,ensure_ascii=False))
        return apk
    finally:
        if staging.exists(): shutil.rmtree(staging)

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--base');parser.add_argument('--check',action='store_true');args=parser.parse_args()
    if args.check: print(json.dumps(validate_assets(),ensure_ascii=False))
    else: prepare(args.base)
