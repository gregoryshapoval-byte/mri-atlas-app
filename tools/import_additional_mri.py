"""Exact frame/annotation import for shoulder and ankle/hindfoot from supplied backup.
Requires readable.db, source.apk and each module ZIP recovered per SOURCE_RECOVERY.md.
Never rewrites existing labels. Auxiliary shoulder diagrams are excluded.
"""
from pathlib import Path
import argparse,sqlite3,zipfile,hashlib,io,json
from PIL import Image

def run(source,assets):
 c=sqlite3.connect(source/'readable.db');c.row_factory=sqlite3.Row
 ru=dict(c.execute('select imaios_key,value from translation where lang_id=10'));en=dict(c.execute('select imaios_key,value from translation where lang_id=2'));tr=lambda k:ru.get(k) or en.get(k) or str(k)
 report={}
 with zipfile.ZipFile(source/'source.apk') as apk:
  for code,prefix in [('shoulder','shoulder-mri'),('cheville','foot-mri')]:
   mod=c.execute('select * from module where imaios_code=?',(code,)).fetchone();root=assets/(prefix+'-source');root.mkdir(exist_ok=True)
   fs=list(c.execute('select * from filter where module_id=? order by sort_order,_id',(mod['_id'],)))
   d={'source':code,'series':[]};l={'source':'User-provided atlas; original frame coordinates','storageKey':prefix+'-anatomy-v1','useSourceDefaults':True,'filters':{code:[]},'slices':{}}
   for f in fs:
    entry={'id':f['_id'],'name':tr(f['name_id']),'parent':f['parent_id'] or None,'layer':f['layer'],'default':bool(f['default_active'])}
    icon=c.execute('select name from icon where _id=?',(f['icon_id'],)).fetchone()
    if icon and 'assets/cats/'+icon['name']+'.png' in apk.namelist():
     dst=root/('group-'+str(f['_id'])+'.png');dst.write_bytes(apk.read('assets/cats/'+icon['name']+'.png'));entry['icon']=dst.relative_to(assets).as_posix()
    if 'icon' not in entry:
     name=entry['name'].lower();gid=1253 if 'кост' in name or 'скелет' in name else 1259 if 'связ' in name else 1260 if 'мышц' in name else 1261 if 'сухож' in name else 1264 if 'артери' in name else 1265 if 'вен' in name else 1266 if 'нерв' in name else 1252
     entry['icon']='wrist-mri-source/group-'+str(gid)+'.png'
    l['filters'][code].append(entry)
   with zipfile.ZipFile(source/(code+'.zip')) as z:
    names=set(z.namelist())
    for s in c.execute('select * from series where module_id=? and name_id in (37,12,13) order by sort_order',(mod['_id'],)):
     slices=list(c.execute('select * from slice where series_id=? order by sort_order',(s['_id'],)));assert len(slices)==s['number_of_images']
     contrasts=list(c.execute('select * from contrast where series_id=? order by sort_order',(s['_id'],))) or [{'imaios_code':'contraste_','name_id':None}]
     for ct in contrasts:
      def hashed(layer,n,ext):return hashlib.sha256(f'{code}#{layer}#images-{n:04}.{ext}'.encode()).hexdigest()
      missing=[sl['_id'] for sl in slices if hashed(ct['imaios_code'],sl['sort_order'],'jpg') not in names]
      if missing:raise ValueError((code,'Incomplete source series',s['_id'],missing))
      title=(tr(ct['name_id'])+' · ' if ct['name_id'] else '')+tr(s['name_id'])
      ser={'id':str(s['_id'])+'-'+ct['imaios_code'],'module':code,'sourceSeries':s['_id'],'group':'multiplanar','plane':tr(s['name_id']),'title':title,'frames':[]}
      for sl in slices:
       name=hashed(ct['imaios_code'],sl['sort_order'],'jpg');raw=z.read(name);dst=root/(name+'.jpg');dst.write_bytes(raw);w,h=Image.open(io.BytesIO(raw)).size
       ser['frames'].append({'src':dst.relative_to(assets).as_posix(),'original':name,'sha256':hashlib.sha256(raw).hexdigest(),'width':w,'height':h,'annotation':str(sl['_id']),'sourceFrame':sl['sort_order']})
       if str(sl['_id']) in l['slices']:continue
       pts=[]
       for p in c.execute('select p.*,s.name_id from point p join structure s on s._id=p.structure_id where slice_id=? order by p._id',(sl['_id'],)):
        # Off-canvas coordinates exist in the source; preserve and clip at display time.
        assert isinstance(p['x_pixel'],(int,float)) and isinstance(p['y_pixel'],(int,float))
        pts.append({'id':p['_id'],'structure':p['structure_id'],'name':tr(p['name_id']),'x':p['x_pixel'],'y':p['y_pixel'],'color':'#'+p['color'].lstrip('#'),'filter':p['filter_id']})
       masks=[]
       for f in fs:
        name=hashed(f['layer'],sl['sort_order'],'png') if f['layer'] else None
        if name in names:
         dst=root/(name+'.png');dst.write_bytes(z.read(name));masks.append({'filter':f['_id'],'src':dst.relative_to(assets).as_posix()})
       l['slices'][str(sl['_id'])]={'points':pts,'masks':masks}
      d['series'].append(ser)
   for suffix,payload in [('data',d),('labels',l)]:
    dest=assets/(prefix+'-'+suffix+'.json');raw=json.dumps(payload,ensure_ascii=False,separators=(',',':'));assert not dest.exists() or dest.read_text()==raw,'Refusing changed overwrite: '+str(dest);dest.write_text(raw)
   report[prefix]={'frames':sum(len(s['frames']) for s in d['series']),'slices':len(l['slices']),'points':sum(len(sl['points']) for sl in l['slices'].values()),'groups':len(fs),'series':[(s['title'],len(s['frames'])) for s in d['series']]}
 return report
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('source',type=Path);p.add_argument('assets',type=Path);p.add_argument('--report',type=Path,required=True);a=p.parse_args();r=run(a.source,a.assets);a.report.write_text(json.dumps(r,ensure_ascii=False,indent=2));print(json.dumps(r,ensure_ascii=False))
