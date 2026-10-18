#!/usr/bin/env python3
"""Recover user-supplied e-Anatomy backup into a local readable SQLite DB.
Never log or persist the SQLCipher passphrase. No network access is needed.
"""
import argparse, base64, io, sqlite3, struct, zipfile, zlib
from pathlib import Path
from sqlcipher3 import dbapi2 as cipher
from androguard.core.dex import DEX

WANTED={
 "apps/net.imaios.eanatomy/a/base.apk":"base.apk",
 "apps/net.imaios.eanatomy/db/eAnatomy.db":"eAnatomy.db",
 "apps/net.imaios.eanatomy/ef/v5/.files/pelvis.zip":"pelvis.zip",
}

def extract_backup(archive, dest):
    with zipfile.ZipFile(archive) as z:
        members=z.namelist()
        if members != ["net.imaios.eanatomy.ab"]:
            raise ValueError("Expected exactly one Android Backup member")
        with z.open(members[0]) as f:
            prefix=b"".join(f.readline() for _ in range(4))
            if prefix != b"ANDROID BACKUP\\n1\\n1\\nnone\\n":
                raise ValueError("Unexpected AB version or encrypted container")
            decomp=zlib.decompressobj()
            # Only these three exact paths are written. Streaming avoids large RAM use.
            with (dest/"data.tar").open("wb") as tar:
                while True:
                    chunk=f.read(1024*1024)
                    if not chunk: break
                    tar.write(decomp.decompress(chunk))
                tar.write(decomp.flush())
    with (dest/"data.tar").open("rb") as f:
        found=set()
        while True:
            header=f.read(512)
            if not header or header==b"\\x00"*512: break
            name=header[:100].split(b"\\x00")[0].decode("utf-8")
            size=int(header[124:136].strip(b"\\x00 ") or b"0",8)
            prefix=header[345:500].split(b"\\x00")[0].decode("utf-8")
            if prefix: name=prefix+"/"+name
            if size < 0 or size > 1024**3: raise ValueError("Invalid TAR entry size")
            if name in WANTED:
                with (dest/WANTED[name]).open("wb") as out:
                    remaining=size
                    while remaining:
                        chunk=f.read(min(1024*1024,remaining))
                        if not chunk: raise EOFError(name)
                        out.write(chunk);remaining-=len(chunk)
                found.add(name)
            else: f.seek(size,1)
            f.seek((-size)%512,1)
    (dest/"data.tar").unlink()
    if found!=set(WANTED): raise ValueError("Missing source files: "+str(set(WANTED)-found))

def recover_passphrase(apk):
    with zipfile.ZipFile(apk) as z:
        dex=DEX(z.read("classes.dex"))
    expected_class="Leanatomy/library/a/a;"
    matched=[c for c in dex.get_classes() if c.get_name()==expected_class]
    if len(matched)!=1: raise ValueError("Expected class not found; unsupported source APK")
    matching=[m for m in matched[0].get_methods() if m.get_name()=="b" and m.get_descriptor()=="()Ljava/lang/String;"]
    if len(matching)!=1: raise ValueError("Expected passphrase method not found")
    code=matching[0].get_code()
    if code is None: raise ValueError("Expected method has no code")
    encoded=[]
    for instruction in code.get_bc().get_instructions():
        if instruction.get_name() not in ("const-string","const-string/jumbo"):continue
        for operand in instruction.get_operands():
            if isinstance(operand,tuple) and len(operand)>2 and isinstance(operand[-1],str):
                encoded.append(operand[-1])
    for candidate in encoded:
        try:
            result=base64.b64decode(candidate,validate=True).decode("utf-8")
            key="".join(chr(ord(char)^128) for char in result)[::-1]
            if key and len(key)>4: yield key
        except (ValueError,UnicodeError):continue

def export_db(src, output, keys):
    for key in keys:
        db=None
        try:
            db=cipher.connect(str(src))
            safe=key.replace("'","''")
            db.execute("PRAGMA key='"+safe+"'")
            db.execute("PRAGMA cipher_compatibility=3")
            db.execute("SELECT count(*) FROM sqlite_master").fetchone()
            if output.exists(): output.unlink()
            outname=str(output).replace("'","''")
            db.execute("ATTACH DATABASE '"+outname+"' AS readable KEY ''")
            db.execute("SELECT sqlcipher_export('readable')")
            db.execute("DETACH DATABASE readable")
            db.close()
            with sqlite3.connect(output) as check:
                check.execute("SELECT count(*) FROM module").fetchone()
            return
        except Exception:
            if db is not None: db.close()
            if output.exists():output.unlink()
    raise ValueError("Unable to recover readable database from supported source APK")

def main():
    p=argparse.ArgumentParser()
    p.add_argument("archive",type=Path)
    p.add_argument("destination",type=Path)
    args=p.parse_args()
    args.destination.mkdir(parents=True,exist_ok=True)
    extract_backup(args.archive,args.destination)
    export_db(args.destination/"eAnatomy.db",args.destination/"eanatomy-readable.db",
              recover_passphrase(args.destination/"base.apk"))
    print("Readable database and pelvis images recovered. No key emitted.")

if __name__=="__main__": main()
