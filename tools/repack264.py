"""Repackage an asset-only 2.64 update from the verified 2.63 APK.

No signing keys are accessed. Output is unsigned and must be signed with the
existing identity before installation. Executable and Android resource payloads
are retained byte-for-byte; binary XML version attributes alone are updated.
"""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_STORED
import copy
import hashlib
import json
import re
import struct
import sys

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'app/src/main/assets'
BASE_SHA = 'b818329eee34c7b54c0e10d7ba2c1f7c7846015e2ab16ae3a8abda801bc906ea'


def patch_manifest(raw):
    data = bytearray(raw)
    assert struct.unpack_from('<HH', data) == (3, 8)
    strings = []
    locations = []
    changed = []
    pos = 8
    while pos < len(data):
        kind, header, size = struct.unpack_from('<HHI', data, pos)
        assert size >= header and pos + size <= len(data)
        if kind == 1:
            count, _, flags, start, _ = struct.unpack_from('<IIIII', data, pos + 8)
            assert not flags & 0x100, 'Expected verified UTF-16 pool'
            for i in range(count):
                offset = struct.unpack_from('<I', data, pos + header + i * 4)[0]
                p = pos + start + offset
                length = struct.unpack_from('<H', data, p)[0]
                assert not length & 0x8000
                strings.append(bytes(data[p + 2:p + 2 + length * 2]).decode('utf-16le'))
                locations.append((p + 2, length * 2))
        if kind == 0x102:
            _, name, ast, ast_size, count = struct.unpack_from('<IIHHH', data, pos + 16)
            if strings[name] == 'manifest':
                for i in range(count):
                    p = pos + 16 + ast + i * ast_size
                    _, key, _, _, _, dtype, value = struct.unpack_from('<IIIHBBI', data, p)
                    if strings[key] == 'versionCode':
                        assert dtype == 0x10 and value == 163
                        struct.pack_into('<I', data, p + 16, 164)
                        changed.append('versionCode')
                    elif strings[key] == 'versionName':
                        assert dtype == 3 and strings[value] == '2.63'
                        loc, length = locations[value]
                        replacement = '2.64'.encode('utf-16le')
                        assert len(replacement) == length
                        data[loc:loc + length] = replacement
                        changed.append('versionName')
                    elif strings[key] == 'package':
                        assert strings[value] == 'ru.grigory.shoulderatlas.restored'
        pos += size
    assert sorted(changed) == ['versionCode', 'versionName']
    assert len(data) == len(raw)
    return bytes(data)


def main():
    base, output = map(Path, sys.argv[1:])
    assert hashlib.sha256(base.read_bytes()).hexdigest() == BASE_SHA, 'Wrong base APK'
    output.parent.mkdir(parents=True, exist_ok=True)
    changes, added = [], []
    with ZipFile(base) as source, ZipFile(output, 'w') as target:
        assert source.testzip() is None
        originals = set(source.namelist())
        for old in source.infolist():
            if old.filename.startswith('META-INF/') and old.filename.endswith(('.SF', '.RSA', '.DSA', '.EC', 'MANIFEST.MF')):
                continue
            raw = source.read(old)
            if old.filename == 'AndroidManifest.xml':
                raw = patch_manifest(raw)
            elif old.filename.startswith('assets/') and not old.is_dir():
                path = ASSETS / old.filename[7:]
                assert path.is_file(), 'Lost asset: ' + old.filename
                replacement = path.read_bytes()
                if replacement != raw:
                    changes.append(old.filename)
                    raw = replacement
            info = copy.copy(old)
            info.extra = b''
            if info.compress_type == ZIP_STORED:
                pad = (-(target.fp.tell() + 30 + len(info.filename.encode('utf-8')))) % 4
                if pad:
                    info.extra = struct.pack('<HH', 0xd935, pad) + b'\0' * pad
            target.writestr(info, raw)
        for path in sorted(ASSETS.rglob('*')):
            if not path.is_file():
                continue
            name = 'assets/' + path.relative_to(ASSETS).as_posix()
            if name not in originals:
                target.writestr(name, path.read_bytes(), compress_type=8)
                added.append(name)
    with ZipFile(base) as source, ZipFile(output) as target:
        assert target.testzip() is None
        assert not set(source.namelist()) - set(target.namelist())
        for info in target.infolist():
            raw = target.read(info)
            if info.filename.startswith('assets/') and not info.is_dir():
                assert raw == (ASSETS / info.filename[7:]).read_bytes()
            elif info.filename != 'AndroidManifest.xml':
                assert raw == source.read(info.filename), 'Changed native payload'
            if info.compress_type == ZIP_STORED:
                with output.open('rb') as f:
                    f.seek(info.header_offset + 26)
                    name_len, extra_len = struct.unpack('<HH', f.read(4))
                assert (info.header_offset + 30 + name_len + extra_len) % 4 == 0
        assets = sum(n.startswith('assets/') and not n.endswith('/') for n in target.namelist())
    report = dict(version='2.64', code=164, unsigned=True, base_sha256=BASE_SHA,
                  size=output.stat().st_size, sha256=hashlib.sha256(output.read_bytes()).hexdigest(),
                  assets=assets, changed_assets=changes, new_assets=added,
                  executable_payload_preserved=True, stored_entries_4byte_aligned=True,
                  signing_blocker='Automatic approval rejected restoring the existing key; explicit in-thread consent requested.')
    (ROOT / 'review/knee-tendons-2.64-build-info.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report))


if __name__ == '__main__':
    main()
