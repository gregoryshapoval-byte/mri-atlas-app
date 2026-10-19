"""Presentation bounds only: union of non-black image extents across each series.
No source pixels, coordinates, masks, or perianal crop metadata are edited.
"""
from pathlib import Path
from PIL import Image,ImageChops
import json,hashlib
R=Path(__file__).resolve().parents[1];A=R/'app/src/main/assets';out={};report=[]
modules=['brain','wrist-mri','elbow-mri','male-pelvis-mri','female-pelvis-mri','shoulder-mri','foot-mri','knee-mri','face-neck-mri','hip-mri','spine-mri','upper-limb-mri','lower-limb-mri','brachial-plexus-mri','hand-mri','brain-3d','knee-3d']
for mod in modules:
 d=json.loads((A/(mod+'-data.json')).read_text());out[mod]={}
 for s in d['series']:
  if s['group']=='vascular':continue
  w,h=s['frames'][0]['width'],s['frames'][0]['height'];boxes=[]
  if any((f['width'],f['height'])!=(w,h)for f in s['frames']):continue
  for f in s['frames']:
   im=Image.open(A/f['src']).convert('RGB');r,g,b=im.split();grey=ImageChops.lighter(ImageChops.lighter(r,g),b);box=grey.point(lambda x:255 if x>8 else 0).getbbox()
   if box:boxes.append(box)
  if not boxes:continue
  x0=max(0,min(b[0]for b in boxes)-3);y0=max(0,min(b[1]for b in boxes)-3);x1=min(w,max(b[2]for b in boxes)+3);y1=min(h,max(b[3]for b in boxes)+3)
  if x1-x0<max(64,w*.25)or y1-y0<max(64,h*.25):x0,y0,x1,y1=0,0,w,h
  bounds=[x0,y0,x1-x0,y1-y0];out[mod][s['id']]=bounds
  report.append({'module':mod,'series':s['id'],'title':s['title'],'frames':len(s['frames']),'size':[w,h],'bounds':bounds})
(A/'viewer-fit-bounds.json').write_text(json.dumps(out,ensure_ascii=False,separators=(',',':'))+'\n')
(R/'review/viewer-fit-1.59.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('Fit bounds:',len(report),'series;',sum(r['frames']for r in report),'frames; source unchanged')
for r in report:
 if r['module']in ['hand-mri','lower-limb-mri']:print(r['module'],r['title'],r['bounds'])
