"""Recover only atlas data from the user's Android backup. Never print the DB key."""
import argparse, base64, zlib, zipfile
from pathlib import Path

MODULES = ['wrist-mri-3d', 'elbow-mri-3d', 'Pelvis-Male-MR']

def recover(archive, out):
    out.mkdir(parents=True, exist_ok=True)
    tar = out / 'backup.tar'
    with zipfile.ZipFile(archive) as z, z.open('net.imaios.eanatomy.ab') as f, tar.open('wb') as dst:
        header = [f.readline().strip() for _ in range(4)]
        if header != [b'ANDROID BACKUP', b'1', b'1', b'none']:
            raise ValueError('Unsupported backup header')
        decoder = zlib.decompressobj()
        while chunk := f.read(1024 * 1024):
            dst.write(decoder.decompress(chunk))
        dst.write(decoder.flush())
        if not decoder.eof: raise ValueError('Truncated backup')
    targets = {'apps/net.imaios.eanatomy/db/eAnatomy.db': 'source.db',
               'apps/net.imaios.eanatomy/a/base.apk': 'source.apk'}
    targets.update({'apps/net.imaios.eanatomy/ef/v5/.files/' + m + '.zip': m + '.zip' for m in MODULES})
    found = set()
    # This backup has nonstandard tar checksums. Exact-name whitelist, bounded reads;
    # never extract paths from the archive or account/preferences databases.
    with tar.open('rb') as f:
        while header := f.read(512):
            if len(header) != 512: raise ValueError('Truncated tar header')
            if not any(header): break
            name = header[:100].split(b'\0')[0].decode()
            prefix = header[345:500].split(b'\0')[0].decode()
            if prefix: name = prefix + '/' + name
            size = int(header[124:136].strip(b'\0 '), 8)
            if size < 0 or size > tar.stat().st_size - f.tell(): raise ValueError('Invalid member size')
            if name in targets:
                (out / targets[name]).write_bytes(f.read(size)); found.add(name)
            else: f.seek(size, 1)
            f.seek((-size) % 512, 1)
    if found != set(targets): raise ValueError('Required atlas members missing')
    from loguru import logger
    logger.remove()
    from androguard.core.dex import DEX
    from sqlcipher3 import dbapi2 as sql
    with zipfile.ZipFile(out / 'source.apk') as apk:
        dex = DEX(apk.read('classes.dex'))
    method = next(m for m in dex.get_class('Leanatomy/library/a/a;').get_methods()
                  if m.get_name() == 'b' and m.get_descriptor() == '()Ljava/lang/String;')
    instruction = next(i for i in method.get_instructions() if i.get_name() == 'const-string')
    encoded = instruction.get_operands()[-1][-1]
    key = ''.join(chr(ord(c) ^ 128) for c in base64.b64decode(encoded).decode('utf-8'))[::-1]
    db = sql.connect(str(out / 'source.db'))
    db.execute("PRAGMA key='" + key.replace("'", "''") + "'")
    db.execute('PRAGMA cipher_compatibility=3')
    db.execute('SELECT count(*) FROM sqlite_master').fetchone()
    plain = out / 'readable.db'
    if plain.exists(): raise FileExistsError(plain)
    db.execute("ATTACH DATABASE ? AS plain KEY ''", (str(plain.resolve()),))
    db.execute("SELECT sqlcipher_export('plain')")
    db.execute('DETACH DATABASE plain'); db.close()
    tar.unlink()
    print('Atlas database recovered:', plain)

if __name__ == '__main__':
    p = argparse.ArgumentParser(); p.add_argument('archive', type=Path); p.add_argument('output', type=Path)
    args = p.parse_args(); recover(args.archive, args.output)
