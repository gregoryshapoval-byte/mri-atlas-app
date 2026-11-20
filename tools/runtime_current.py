"""The pinned published APK is the authoritative base, never historical assets."""
from pathlib import Path, PurePosixPath
import hashlib, json, os, shutil, tempfile, urllib.request, zipfile
from functools import lru_cache
ROOT = Path(__file__).resolve().parents[1]
CONFIG = json.loads((ROOT / 'release-inputs/current.json').read_text())
ASSETS = ROOT / 'build/runtime-assets'
OVERRIDES = ROOT / CONFIG['override_directory']

def is_signature(name):
    return name.startswith('META-INF/') and name.count('/') == 1 and (
        name == 'META-INF/MANIFEST.MF' or name.endswith(('.SF', '.RSA', '.DSA', '.EC'))
    )

def sha(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for part in iter(lambda: f.read(1024 * 1024), b''): h.update(part)
    return h.hexdigest()

def base_apk(supplied=None):
    path = Path(supplied or os.environ.get('ATLAS_BASE_APK', ROOT / 'build/cache' / f"MRIAtlas-{CONFIG['base']['version']}.apk")).resolve()
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile(dir=path.parent, prefix=path.name + '.', delete=False) as temp:
            temporary = Path(temp.name)
        try:
            with urllib.request.urlopen(CONFIG['base']['url'], timeout=60) as source, temporary.open('wb') as target:
                shutil.copyfileobj(source, target)
            if sha(temporary) != CONFIG['base']['sha256']: raise ValueError('Base APK checksum mismatch')
            temporary.replace(path)
        finally:
            temporary.unlink(missing_ok=True)
    if path.stat().st_size != CONFIG['base']['bytes'] or sha(path) != CONFIG['base']['sha256']:
        raise ValueError(f"Wrong base APK: expected published {CONFIG['base']['version']}; existing file was not overwritten")
    return path

@lru_cache(maxsize=1)
def inventory(apk):
    assets, native = {}, {}
    with zipfile.ZipFile(apk) as archive:
        if len(archive.namelist()) != len(set(archive.namelist())):
            raise ValueError('Duplicate ZIP entries in base APK')
        for entry in archive.infolist():
            if entry.is_dir() or is_signature(entry.filename):
                continue
            data = archive.read(entry)
            row = {'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}
            if entry.filename.startswith('assets/'):
                assets[asset_name(entry.filename[7:])] = row
            else:
                native[entry.filename] = row
    return {'assets': assets, 'native': native}

def manifest(base=None):
    return inventory(base_apk(base))

def asset_name(name):
    p = PurePosixPath(name)
    if not p.parts or p.as_posix() != name or p.is_absolute() or '..' in p.parts or '\\' in name: raise ValueError('Unsafe asset path')
    return name

def validate_assets(root=ASSETS, base=None):
    root = Path(root)
    expected = manifest(base)['assets']
    additions = set(CONFIG.get('additions', []))
    if additions & set(expected):
        raise ValueError('Added assets already exist in the base')
    expected_names = set(expected) | additions
    allowed = set(CONFIG['overrides'] + CONFIG['generated'])
    files = {p.relative_to(root).as_posix(): p for p in root.rglob('*') if p.is_file()}
    if set(files) != expected_names:
        raise ValueError('Runtime file set differs from the pinned APK: missing=%r added=%r' % (sorted(expected_names-set(files)), sorted(set(files)-expected_names)))
    changed = []
    for name, row in expected.items():
        if sha(files[name]) != row['sha256']:
            if name not in allowed: raise ValueError('Unexpected change to preserved asset: ' + name)
            changed.append(name)
    for name in set(CONFIG['overrides']) | additions:
        if files[name].read_bytes() != (OVERRIDES / name).read_bytes():
            raise ValueError('Source override differs from prepared runtime: ' + name)
    return {'assets': len(files), 'changed_assets': sorted(changed), 'added_assets': sorted(additions), 'preserved_assets': len(expected)-len(changed)}

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser(); p.add_argument('--base'); p.add_argument('--read-asset'); args=p.parse_args()
    apk = base_apk(args.base)
    if args.read_asset:
        import sys
        with zipfile.ZipFile(apk) as z: sys.stdout.buffer.write(z.read('assets/' + asset_name(args.read_asset)))
    else: print(apk)
