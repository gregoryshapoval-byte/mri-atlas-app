#!/usr/bin/env python3
"""Import source-verified pelvic MRI frames and annotations to a staging folder.
The importer never changes the existing brain atlas. Verify report before release.
"""
import argparse, hashlib, json, sqlite3, zipfile, io
from pathlib import Path
from PIL import Image

def source_name(module, contrast, order, extension):
    return hashlib.sha256(f"{module}#{contrast}#images-{order:04}.{extension}".encode()).hexdigest()

def rows(db, statement, args=()):
    return [dict(x) for x in db.execute(statement,args)]

def translate(db, key):
    r=db.execute("SELECT value FROM translation WHERE imaios_key=? AND lang_id=10 LIMIT 1",(key,)).fetchone()
    if r:return r[0]
    r=db.execute("SELECT value FROM translation WHERE imaios_key=? AND lang_id=2 LIMIT 1",(key,)).fetchone()
    return r[0] if r else str(key)

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("source",type=Path)
    parser.add_argument("assets",type=Path)
    parser.add_argument("--modules",default="pelvis",choices=["pelvis"])
    parser.add_argument("--report",type=Path,required=True)
    opt=parser.parse_args()
    opt.assets.mkdir(parents=True,exist_ok=True)
    opt.report.parent.mkdir(parents=True,exist_ok=True)
    db=sqlite3.connect(opt.source/"eanatomy-readable.db")
    db.row_factory=sqlite3.Row
    mod=db.execute("SELECT * FROM module WHERE imaios_code=?",(opt.modules,)).fetchone()
    if mod is None:raise ValueError("pelvis module missing from database")
    module="pelvis"
    image_zip=zipfile.ZipFile(opt.source/"pelvis.zip")
    filenames=set(image_zip.namelist())
    series=rows(db,"SELECT * FROM series WHERE module_id=? ORDER BY sort_order,_id",(mod["_id"],))
    if not series:raise ValueError("No source MRI series found")
    fil=rows(db,"SELECT * FROM filter WHERE module_id=? ORDER BY sort_order,_id",(mod["_id"],))
    filters=[dict(id=r["_id"],name=translate(db,r["name_id"]),parent=r["parent_id"],layer=r["layer"],default=bool(r["default_active"])) for r in fil]
    payload={"source":"IMAIOS e-Anatomy / user-supplied Android backup","filters":{module:filters},"slices":{}}
    manifest={"source":payload["source"],"series":[]}
    staging=opt.assets/"female-pelvis-mri-images"
    staging.mkdir(exist_ok=True)
    used=[]
    points_total=0
    masks_total=0
    frame_total=0
    for ser in series:
        slices=rows(db,"SELECT * FROM slice WHERE series_id=? ORDER BY sort_order,_id",(ser["_id"],))
        contrasts=rows(db,"SELECT * FROM contrast WHERE series_id=? ORDER BY sort_order,_id",(ser["_id"],))
        if not contrasts:contrasts=[{"imaios_code":"contraste_"}]
        for contrast in contrasts:
            code=contrast["imaios_code"]
            frames=[]
            for sl in slices:
                fname=source_name(module,code,sl["sort_order"],"jpg")
                if fname not in filenames:
                    # Some source contrasts have no offline JPEG; skip missing contrast entirely below.
                    frames=[];break
                image_bytes=image_zip.read(fname)
                with Image.open(io.BytesIO(image_bytes)) as img:
                    width,height=img.size
                if width < 400 or height < 400:raise ValueError("Unexpected thumbnail instead of MRI JPEG")
                # Filename unique per source slice and contrast; use manifest ordering, not heuristics.
                dest=f"{ser['_id']}-{code}-{sl['sort_order']:04}.jpg".replace("/","_")
                (staging/dest).write_bytes(image_bytes)
                key=str(sl["_id"])
                if key not in payload["slices"]:
                    pts=[]
                    for p in rows(db,"SELECT p.*, s.name_id FROM point p JOIN structure s ON s._id=p.structure_id WHERE p.slice_id=? ORDER BY p._id",(sl["_id"],)):
                        if not (0<=p["x_pixel"]<=width and 0<=p["y_pixel"]<=height):
                            raise ValueError(f"Out of bounds annotation {p['_id']} on slice {key}")
                        pts.append(dict(id=p["_id"],structure=p["structure_id"],name=translate(db,p["name_id"]),x=p["x_pixel"],y=p["y_pixel"],color="#"+p["color"],filter=p["filter_id"]))
                    overlays=[]
                    for f in fil:
                        if not f["layer"]:continue
                        png=source_name(module,f["layer"],sl["sort_order"],"png")
                        if png in filenames:
                            path=staging/f"{key}-{f['_id']}.png"
                            path.write_bytes(image_zip.read(png))
                            overlays.append({"filter":f["_id"],"src":"female-pelvis-mri-images/"+path.name})
                            masks_total+=1
                    payload["slices"][key]={"points":pts,"masks":overlays}
                    points_total+=len(pts)
                frames.append(dict(src="female-pelvis-mri-images/"+dest,annotation=key,
                                   original=fname,sha256=hashlib.sha256(image_bytes).hexdigest(),
                                   width=width,height=height,sourceFrame=sl["sort_order"]))
                used.append(fname)
            if not frames:continue
            manifest["series"].append(dict(id=f"{ser['_id']}-{code}",title=translate(db,ser["name_id"]),
                                          module=module,sourceSeries=ser["_id"],group="mri",
                                          frames=frames))
            frame_total+=len(frames)
    if not manifest["series"]:raise ValueError("Unable to match any source image series")
    if frame_total<50:raise ValueError(f"Only {frame_total} matched frames, expected >=50")
    (opt.assets/"female-pelvis-mri-data.json").write_text(json.dumps(manifest,ensure_ascii=False,separators=(",",":")))
    (opt.assets/"female-pelvis-mri-labels.json").write_text(json.dumps(payload,ensure_ascii=False,separators=(",",":")))
    report=dict(module=module,series=len(manifest["series"]),frames=frame_total,
                uniqueSlices=len(payload["slices"]),points=points_total,masks=masks_total,
                filterGroups=len(filters),unmatchedJpg=len([n for n in filenames if n not in used and image_zip.read(n)[:3]==b"\\xff\\xd8\\xff"]))
    opt.report.write_text(json.dumps(report,ensure_ascii=False,indent=2))
    print(json.dumps(report,ensure_ascii=False))
    if points_total==0:raise ValueError("No source anatomical points matched")

if __name__=="__main__":main()
