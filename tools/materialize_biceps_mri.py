#!/usr/bin/env python3
"""Download CC-licensed clinical MRI figures into Android assets before packaging.
Fails closed: do not publish an APK with missing/HTML masquerading as images.
"""
from pathlib import Path
from urllib.request import Request, urlopen
import hashlib
import json

OUT = Path("app/src/main/assets/biceps-mri")
SOURCES = [
 ("proximal-normal.jpg","https://cdn.ncbi.nlm.nih.gov/pmc/blobs/3121/6625571/0289484b1997/ACTA-90-84-g001.jpg","PMC6625571","CC BY 4.0"),
 ("proximal-pulley.jpg","https://cdn.ncbi.nlm.nih.gov/pmc/blobs/3121/6625571/043a4e0ac755/ACTA-90-84-g006.jpg","PMC6625571","CC BY 4.0"),
 ("proximal-tendinopathy.jpg","https://cdn.ncbi.nlm.nih.gov/pmc/blobs/3121/6625571/0cadc92d6f1a/ACTA-90-84-g014.jpg","PMC6625571","CC BY 4.0"),
 ("proximal-variant.jpg","https://cdn.ncbi.nlm.nih.gov/pmc/blobs/3121/6625571/ea21c3e6b2b9/ACTA-90-84-g004.jpg","PMC6625571","CC BY 4.0"),
 ("distal-long-head.jpg","https://cdn.ncbi.nlm.nih.gov/pmc/blobs/a543/10698130/5c5962091492/cise-2023-00458f1.jpg","PMC10698130","CC BY-NC 4.0"),
 ("distal-short-head.jpg","https://cdn.ncbi.nlm.nih.gov/pmc/blobs/a543/10698130/3906a48932a7/cise-2023-00458f2.jpg","PMC10698130","CC BY-NC 4.0"),
 ("distal-combined.jpg","https://cdn.ncbi.nlm.nih.gov/pmc/blobs/a543/10698130/9b85e0259bb2/cise-2023-00458f3.jpg","PMC10698130","CC BY-NC 4.0"),
 ("distal-peel-off.jpg","https://cdn.ncbi.nlm.nih.gov/pmc/blobs/a543/10698130/9feda5932cb5/cise-2023-00458f4.jpg","PMC10698130","CC BY-NC 4.0"),
]
OUT.mkdir(parents=True, exist_ok=True)
records=[]
for name,url,pmc,licence in SOURCES:
    target=OUT/name
    if not target.exists() or target.stat().st_size < 1000:
        req=Request(url, headers={"User-Agent":"MRIAtlas-personal-educational/1.0"})
        with urlopen(req, timeout=40) as response:
            data=response.read(15_000_000)
        if len(data) < 1000 or not data.startswith(b"\\xff\\xd8\\xff"):
            raise RuntimeError(f"Not a valid JPEG: {name}, bytes={len(data)}")
        target.write_bytes(data)
    raw=target.read_bytes()
    if not raw.startswith(b"\\xff\\xd8\\xff") or len(raw)<1000:
        raise RuntimeError(f"Missing/corrupt image: {name}")
    records.append({"file":name,"url":url,"pmcid":pmc,"licence":licence,"bytes":len(raw),"sha256":hashlib.sha256(raw).hexdigest()})
(OUT/"sources.json").write_text(json.dumps(records,ensure_ascii=False,indent=2)+"\\n")
print(f"Verified {len(records)} clinical MRI illustrations, total {sum(r['bytes'] for r in records)} bytes")
