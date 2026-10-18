#!/usr/bin/env python3
"""Patch only the designated 1.4-from-1.30 APK, preserving all unrelated entries."""
import argparse, zipfile, re, json
from pathlib import Path
p=argparse.ArgumentParser()
p.add_argument("base",type=Path)
p.add_argument("assets",type=Path)
p.add_argument("output",type=Path)
a=p.parse_args()
assert a.base.is_file(), "BASE_APK_MISSING: upload MRIAtlas-1.4-from-1.30.apk as a release asset first"
with zipfile.ZipFile(a.base) as z:
 names=set(z.namelist())
 prefix=next((x for x in ("assets/","assets/www/") if x+"regions.js" in names),None)
 assert prefix, "Base APK region navigation not found; refusing to replace UI"
 old=z.read(prefix+"regions.js").decode("utf-8")
 assert "shoulder-mri.html" not in old, "Shoulder module already exists; manual review needed"
 needle="shoulder:{name:'Плечо',items:["
 assert old.count(needle)==1, "Unexpected base navigation; refusing unsafe replacement"
 new=old.replace(needle,needle+"['МРТ плечевого сустава','Исходные МРТ-срезы с анатомическими подписями.','shoulder-mri.html','НОВОЕ'],",1)
 additions={prefix+"regions.js":new.encode()}
 for name in ("shoulder-mri.html","shoulder-mri.js","shoulder-mri-data.json","shoulder-mri-labels.json"):
  f=a.assets/name
  assert f.is_file(), "Missing imported asset: "+name
  additions[prefix+name]=f.read_bytes()
 images=list((a.assets/"shoulder-mri-images").glob("*"))
 assert len(images)>=115, "Expected at least 115 shoulder images"
 for f in images:additions[prefix+"shoulder-mri-images/"+f.name]=f.read_bytes()
 assert all(n not in names for n in additions if n!=prefix+"regions.js"), "Refusing to overwrite existing shoulder assets"
 a.output.parent.mkdir(parents=True,exist_ok=True)
 with zipfile.ZipFile(a.output,"w") as out:
  for info in z.infolist():
   if info.filename in ("META-INF/MANIFEST.MF",) or (info.filename.startswith("META-INF/") and info.filename.endswith((".RSA",".SF",".DSA",".EC"))):continue
   if info.filename in additions:
    out.writestr(info,additions.pop(info.filename))
   else:out.writestr(info,z.read(info.filename))
  for name,data in additions.items():out.writestr(name,data,compress_type=zipfile.ZIP_DEFLATED)
 print("Patched designated base APK with shoulder assets; unrelated entries retained")
