"""Repackage known 2.59 payload without changing executable or resources."""
from pathlib import Path
import struct,zipfile,json,hashlib,sys
base=Path(sys.argv[1]);out=Path(sys.argv[2]);A=Path(__file__).resolve().parents[1]/'app/src/main/assets'
assert hashlib.sha256(base.read_bytes()).hexdigest()=='1efff9b03687b60750f9616d5412b155eb864dc6e832e806ebcac4f370006111'
with zipfile.ZipFile(base) as z:
 old={n[7:] for n in z.namelist() if n.startswith('assets/')}
 changed=[n for n in old if (A/n).exists() and z.read('assets/'+n)!=(A/n).read_bytes()]
 added=[str(p.relative_to(A)) for p in A.rglob('*') if p.is_file() and str(p.relative_to(A)) not in old]
def patch_manifest(raw):
 b=bytearray(raw); pos=8; strings=[];code=False
 while pos<len(b):
  typ,head,size=struct.unpack_from('<HHI',b,pos)
  if typ==1:
   count,styles,flags,offset,styleoff=struct.unpack_from('<IIIII',b,pos+8)
   for i in range(count):
    q=pos+offset+struct.unpack_from('<I',b,pos+head+4*i)[0]
    def length(q,utf):
     if utf:
      n=b[q];return (((n&127)<<8)|b[q+1],q+2) if n&128 else (n,q+1)
     n=struct.unpack_from('<H',b,q)[0];return (((n&32767)<<16)|struct.unpack_from('<H',b,q+2)[0],q+4) if n&32768 else (n,q+2)
    utf=bool(flags&256);n,q=length(q,utf)
    if utf:n,q=length(q,True)
    s=bytes(b[q:q+n*(1 if utf else 2)]).decode('utf-8' if utf else 'utf-16-le');strings.append(s)
    if s=='2.59':b[q:q+n*(1 if utf else 2)]='2.60'.encode('utf-8' if utf else 'utf-16-le')
  if typ==0x102:
   # ResXMLTree_attrExt begins after node header (16 bytes).
   start,asize,count=struct.unpack_from('<HHH',b,pos+24)
   for i in range(count):
    q=pos+16+start+i*asize;ns,name,rawidx=struct.unpack_from('<III',b,q)
    if strings[name]=='versionCode':
     assert struct.unpack_from('<I',b,q+16)[0]==159
     struct.pack_into('<I',b,q+16,160);code=True
  pos+=size
 assert code and '2.59' in strings
 return b
with zipfile.ZipFile(base)as z,zipfile.ZipFile(out,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6)as w:
 for i in z.infolist():
  if i.filename.startswith('META-INF/'):continue
  data=z.read(i.filename)
  if i.filename=='AndroidManifest.xml':data=patch_manifest(data)
  elif i.filename.startswith('assets/') and i.filename[7:]in changed:data=(A/i.filename[7:]).read_bytes()
  # Add harmless ZIP padding so every uncompressed entry starts on a 4-byte boundary.
  info=zipfile.ZipInfo(i.filename,i.date_time);info.compress_type=i.compress_type;info.external_attr=i.external_attr
  if info.compress_type==0:
   start=w.fp.tell()+30+len(info.filename.encode());pad=(-start)%4
   if pad:info.extra=struct.pack('<HH',0xd935,pad)+b'\0'*pad
  w.writestr(info,data)
 for n in added:w.write(A/n,'assets/'+n)
with zipfile.ZipFile(base)as z,zipfile.ZipFile(out)as w:
 assert w.testzip()is None
 old={n for n in z.namelist()if n.startswith('assets/')};new={n for n in w.namelist()if n.startswith('assets/')};assert new-old=={'assets/'+n for n in added}
 for n in z.namelist():
  if n.startswith('META-INF/')or n=='AndroidManifest.xml'or n in {'assets/'+n for n in changed}:continue
  assert z.read(n)==w.read(n),n
 info=dict(version='2.60',code=160,signed=False,base_sha256=hashlib.sha256(base.read_bytes()).hexdigest(),sha256=hashlib.sha256(out.read_bytes()).hexdigest(),old_assets=len(old),assets=len(new),changed_assets=changed,new_assets=added,unchanged_payload_verified=True)
 (out.parent/'build-info260.json').write_text(json.dumps(info,indent=2));print(json.dumps(info))

