"""Recover only the three 1.52 module ZIPs from the user's Android Backup.
First recover readable.db/source.apk with recover_source_database.py.
This reads bounded TAR blocks without trusting backup paths or checksums.
"""
import argparse, tempfile, zipfile, zlib
from pathlib import Path
MODULES=('hand-mr','brain3dmri','knee')
def extract(archive, out):
 out.mkdir(parents=True,exist_ok=True)
 targets={f'apps/net.imaios.eanatomy/ef/v5/.files/{m}.zip':out/(m+'.zip') for m in MODULES}
 if any(p.exists() for p in targets.values()):raise FileExistsError('Use a destination without existing module ZIPs')
 with tempfile.TemporaryFile() as tar:
  with zipfile.ZipFile(archive) as z,z.open('net.imaios.eanatomy.ab') as f:
   if [f.readline().strip() for _ in range(4)]!=[b'ANDROID BACKUP',b'1',b'1',b'none']:raise ValueError('Unsupported backup')
   decoder=zlib.decompressobj()
   while chunk:=f.read(1024*1024):tar.write(decoder.decompress(chunk))
   tar.write(decoder.flush())
   if not decoder.eof:raise ValueError('Truncated backup')
  end=tar.tell();tar.seek(0);found=set()
  while header:=tar.read(512):
   if len(header)!=512:raise ValueError('Truncated TAR header')
   if not any(header):break
   name=header[:100].split(b'\0')[0].decode();prefix=header[345:500].split(b'\0')[0].decode()
   if prefix:name=prefix+'/'+name
   size=int(header[124:136].strip(b'\0 '),8)
   if not 0<=size<=end-tar.tell():raise ValueError('Invalid member size')
   if name in targets:
    if name in found:raise ValueError('Duplicate target')
    targets[name].write_bytes(tar.read(size));found.add(name)
   else:tar.seek(size,1)
   tar.seek((-size)%512,1)
  if found!=set(targets):raise ValueError('Required media missing')
 print('Recovered exactly three source media ZIPs')
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('archive',type=Path);p.add_argument('output',type=Path);a=p.parse_args();extract(a.archive,a.output)
