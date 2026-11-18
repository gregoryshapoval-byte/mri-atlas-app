"""Read binary Android manifest values and patch only equal-length version fields."""
import struct

def parse(raw):
    if struct.unpack_from('<HH',raw)!=(3,8): raise ValueError('Expected binary Android XML')
    strings=[];locations=[];attrs={};pos=8
    while pos<len(raw):
        kind,header,size=struct.unpack_from('<HHI',raw,pos)
        if size<header or pos+size>len(raw):raise ValueError('Invalid XML chunk')
        if kind==1:
            count,_,flags,start,_=struct.unpack_from('<IIIII',raw,pos+8)
            if flags&0x100:raise ValueError('Expected pinned UTF-16 pool')
            for i in range(count):
                offset=struct.unpack_from('<I',raw,pos+header+i*4)[0];p=pos+start+offset;length=struct.unpack_from('<H',raw,p)[0]
                if length&0x8000:raise ValueError('Unsupported long string')
                strings.append(raw[p+2:p+2+length*2].decode('utf-16le'));locations.append((p+2,length*2))
        if kind==0x102:
            _,name,ast,ast_size,count=struct.unpack_from('<IIHHH',raw,pos+16)
            if strings[name]=='manifest':
                for i in range(count):
                    p=pos+16+ast+i*ast_size
                    _,key,_,_,_,dtype,value=struct.unpack_from('<IIIHBBI',raw,p)
                    attrs[strings[key]]={'value':strings[value] if dtype==3 else value,'type':dtype,'offset':p+16,'stringIndex':value if dtype==3 else None}
        pos+=size
    return attrs,locations

def info(raw):
    attrs,_=parse(raw)
    return {k:attrs[k]['value'] for k in ['package','versionCode','versionName']}

def patch(raw,config):
    attrs,locations=parse(raw)
    expected={'package':config['package'],'versionCode':config['base']['versionCode'],'versionName':config['base']['version']}
    if info(raw)!=expected:raise ValueError('Unexpected base manifest metadata')
    data=bytearray(raw);struct.pack_into('<I',data,attrs['versionCode']['offset'],config['versionCode'])
    loc,length=locations[attrs['versionName']['stringIndex']];replacement=config['version'].encode('utf-16le')
    if len(replacement)!=length:raise ValueError('Version length changed; a new manifest encoding step is required')
    data[loc:loc+length]=replacement
    result=bytes(data)
    if info(result)!={'package':config['package'],'versionCode':config['versionCode'],'versionName':config['version']}:raise ValueError('Patched manifest mismatch')
    return result
