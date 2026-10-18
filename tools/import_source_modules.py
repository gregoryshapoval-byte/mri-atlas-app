"""Import exact source images, per-slice points, masks, groups and icons."""
import argparse, collections, hashlib, io, json, sqlite3, zipfile
from pathlib import Path
from PIL import Image

MODULES = [('wrist-mri-3d','wrist-mri'), ('elbow-mri-3d','elbow-mri'), ('Pelvis-Male-MR','male-pelvis-mri')]
def digest(b): return hashlib.sha256(b).hexdigest()
def run(source, assets):
    c=sqlite3.connect(source/'readable.db'); c.row_factory=sqlite3.Row
    ru=dict(c.execute('select imaios_key,value from translation where lang_id=10'))
    en=dict(c.execute('select imaios_key,value from translation where lang_id=2'))
    def tr(key): return ru.get(key) or en.get(key) or str(key)
    report={}
    with zipfile.ZipFile(source/'source.apk') as apk:
      for code, prefix in MODULES:
        m=c.execute('select * from module where imaios_code=?',(code,)).fetchone()
        old=json.loads((assets/(prefix+'-data.json')).read_text())
        oldhash=collections.Counter(digest((assets/f['src']).read_bytes()) for s in old['series'] for f in s['frames'])
        byhash={digest((assets/f['src']).read_bytes()):f['src'] for s in old['series'] for f in s['frames']}
        root=assets/(prefix+'-source');root.mkdir(exist_ok=True)
        manifest={'source':code,'series':[]}
        labels={'source':'User-provided IMAIOS archive; original per-frame coordinates', 'storageKey':prefix+'-anatomy-v1','useSourceDefaults':True,'filters':{code:[]},'slices':{}}
        filters=list(c.execute('select * from filter where module_id=? order by sort_order,_id',(m['_id'],)))
        for f in filters:
          entry={'id':f['_id'],'name':tr(f['name_id']),'parent':f['parent_id'] or None,'layer':f['layer'],'default':bool(f['default_active'])}
          icon=c.execute('select name from icon where _id=?',(f['icon_id'],)).fetchone()
          if icon:
            name='assets/cats/'+icon['name']+'.png'
            if name in apk.namelist():
              dest=root/('group-'+str(f['_id'])+'.png');dest.write_bytes(apk.read(name));entry['icon']=dest.relative_to(assets).as_posix()
          labels['filters'][code].append(entry)
        with zipfile.ZipFile(source/(code+'.zip')) as z:
          members=set(z.namelist())
          for s in c.execute('select * from series where module_id=? order by sort_order',(m['_id'],)):
            slices=list(c.execute('select * from slice where series_id=? order by sort_order',(s['_id'],)))
            assert len(slices)==s['number_of_images']
            contrasts=list(c.execute('select * from contrast where series_id=? order by sort_order',(s['_id'],))) or [{'imaios_code':'contraste_','name_id':None}]
            for contrast in contrasts:
              plane=tr(s['name_id']);cn=tr(contrast['name_id']) if contrast['name_id'] else ''
              ser={'id':str(s['_id'])+'-'+contrast['imaios_code'],'module':code,'sourceSeries':s['_id'],'group':'vascular' if s['modality_id']==6 else 'multiplanar','plane':plane,'title':(cn+' · ' if cn else '')+plane,'frames':[]}
              for sl in slices:
                stem=f"images-{sl['sort_order']:04}"
                original=digest(f"{code}#{contrast['imaios_code']}#{stem}.jpg".encode());raw=z.read(original);sha=digest(raw)
                src=byhash.get(sha)
                if not src:
                  dest=root/(original+'.jpg');dest.write_bytes(raw);src=dest.relative_to(assets).as_posix()
                width,height=Image.open(io.BytesIO(raw)).size
                frame={'src':src,'original':original,'sha256':sha,'width':width,'height':height,'annotation':str(sl['_id']),'sourceFrame':sl['sort_order']}
                ser['frames'].append(frame)
                if str(sl['_id']) not in labels['slices']:
                  points=[]
                  for p in c.execute('select p.*,s.name_id from point p join structure s on p.structure_id=s._id where p.slice_id=? order by p._id',(sl['_id'],)):
                    assert 0<=p['x_pixel']<=width and 0<=p['y_pixel']<=height, (code,sl['_id'],dict(p))
                    points.append({'id':p['_id'],'structure':p['structure_id'],'name':tr(p['name_id']),'x':p['x_pixel'],'y':p['y_pixel'],'color':'#'+p['color'].lstrip('#'),'filter':p['filter_id']})
                  masks=[]
                  for f in filters:
                    if not f['layer']: continue
                    name=digest(f"{code}#{f['layer']}#{stem}.png".encode())
                    if name in members:
                      dest=root/(name+'.png');dest.write_bytes(z.read(name));masks.append({'filter':f['_id'],'src':dest.relative_to(assets).as_posix()})
                  labels['slices'][str(sl['_id'])]={'points':points,'masks':masks}
              manifest['series'].append(ser)
        newhash=collections.Counter(f['sha256'] for s in manifest['series'] for f in s['frames'])
        assert oldhash==newhash, (prefix,'Image content differs from uploaded app')
        for suffix,data in [('data',manifest),('labels',labels)]:
          (assets/(prefix+'-'+suffix+'.json')).write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')))
        report[prefix]={'images':sum(newhash.values()),'sourceSlices':len(labels['slices']),'points':sum(len(a['points']) for a in labels['slices'].values()),'structures':len({p['structure'] for a in labels['slices'].values() for p in a['points']}),'masks':sum(len(a['masks']) for a in labels['slices'].values()),'allImageBytesPreserved':True,'series':[{k:s[k] for k in ['id','title']}|{'frames':len(s['frames'])} for s in manifest['series']]}
    return report
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('source',type=Path);p.add_argument('assets',type=Path);p.add_argument('--report',type=Path,required=True);a=p.parse_args()
    report=run(a.source,a.assets);a.report.write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False,indent=2))
