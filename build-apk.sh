#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
python3 tools/materialize_assets142.py
python3 tools/materialize_assets150.py
python3 tools/materialize_assets152.py
SDK_ROOT="${ANDROID_SDK_ROOT:?Set ANDROID_SDK_ROOT}"
BT="$SDK_ROOT/build-tools/35.0.0"
PLATFORM="$SDK_ROOT/platforms/android-35/android.jar"
SIGNING_DIR="${SIGNING_DIR:-$PWD/../atlas-signing}"
mkdir -p build/classes build/dex
"$BT/aapt2" compile --dir app/src/main/res -o build/resources.zip
"$BT/aapt2" link -o build/base.apk -I "$PLATFORM" --manifest app/src/main/AndroidManifest.xml --min-sdk-version 26 --target-sdk-version 35 --version-code 60 --version-name 1.60 --rename-manifest-package ru.grigory.shoulderatlas.restored build/resources.zip
java -m jdk.compiler/com.sun.tools.javac.Main -source 8 -target 8 -bootclasspath "$PLATFORM:$BT/core-lambda-stubs.jar" -d build/classes app/src/main/java/ru/grigory/shoulderatlas/MainActivity.java
"$BT/d8" --lib "$PLATFORM" --min-api 26 --output build/dex build/classes/ru/grigory/shoulderatlas/*.class
python3 - <<'PY'
from zipfile import ZipFile,ZIP_DEFLATED
from pathlib import Path
with ZipFile('build/base.apk','a',ZIP_DEFLATED) as z:
 for f in Path('build/dex').glob('*.dex'): z.write(f,f.name)
 for f in sorted(Path('app/src/main/assets').rglob('*')):
  if f.is_file():z.write(f,'assets/'+f.relative_to('app/src/main/assets').as_posix())
import os
with open('build/base.apk','rb') as f:os.fsync(f.fileno())
PY
"$BT/zipalign" -f 4 build/base.apk build/aligned.apk
if [ "${UNSIGNED_ONLY:-0}" = "1" ]; then
 cp build/aligned.apk build/MRIAtlas-1.60-unsigned.apk
 "$BT/aapt2" dump badging build/MRIAtlas-1.60-unsigned.apk
 exit 0
fi
if [ ! -f "$SIGNING_DIR/atlas.jks" ]; then
 echo 'Signing key missing. Restore the release key; do not generate a replacement.' >&2
 exit 1
fi
"$BT/zipalign" -f 4 build/base.apk build/aligned.apk
"$BT/apksigner" sign --ks "$SIGNING_DIR/atlas.jks" --ks-pass pass:android --key-pass pass:android --ks-key-alias atlas --out /tmp/MRIAtlas-1.60-restored-signed.apk build/aligned.apk
python3 - <<'PYCODE'
from pathlib import Path
import os
data=Path("/tmp/MRIAtlas-1.60-restored-signed.apk").read_bytes()
with open("build/MRIAtlas-1.60-restored.apk","wb") as f:
 f.write(data); f.flush(); os.fsync(f.fileno())
PYCODE
"$BT/apksigner" verify --verbose build/MRIAtlas-1.60-restored.apk
"$BT/aapt2" dump badging build/MRIAtlas-1.60-restored.apk
