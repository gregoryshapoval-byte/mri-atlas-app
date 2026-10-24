"""Restore the existing owner-requested public test identity; never generate a key."""
from pathlib import Path
import hashlib
import io
import subprocess
import sys
import urllib.request
import zipfile

ARCHIVE_SHA = '21e95c8f3b3b57579f8ad930e5dd011a7800efccc00750b003d70a5a9d9c87c6'
CERT_SHA = 'cb7d43e1eb8ff4c1eee663e918b5413b70fb9d6f8221790075f83c7e153624fe'
URL = ('https://github.com/gregoryshapoval-byte/mri-atlas-app/releases/download/'
       'atlas-1.83-personal-backup/MRIAtlas-test-signing-key.zip')


def main():
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[2] / 'atlas-signing'
    target.mkdir(mode=0o700, parents=True, exist_ok=True)
    with urllib.request.urlopen(URL, timeout=60) as response:
        data = response.read()
    if hashlib.sha256(data).hexdigest() != ARCHIVE_SHA:
        raise RuntimeError('Saved signing archive checksum mismatch')
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        certificate = archive.read('certificate.der')
        if hashlib.sha256(certificate).hexdigest() != CERT_SHA:
            raise RuntimeError('Saved certificate mismatch')
        key = archive.read('atlas.keystore')
    key_path = target / 'atlas.keystore'
    if key_path.exists() and key_path.read_bytes() != key:
        raise RuntimeError('Destination contains a different key; refusing to overwrite')
    key_path.write_bytes(key)
    key_path.chmod(0o600)
    result = subprocess.run(['keytool', '-exportcert', '-keystore', str(key_path),
                             '-storepass', 'android', '-alias', 'atlas'],
                            check=True, capture_output=True)
    if hashlib.sha256(result.stdout).hexdigest() != CERT_SHA:
        raise RuntimeError('Restored keystore certificate mismatch')
    print('Existing signing key restored; certificate matches MRIAtlas 2.40/2.41.')


if __name__ == '__main__':
    main()
