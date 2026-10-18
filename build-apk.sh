#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
SDK_ROOT="${ANDROID_SDK_ROOT:?Set ANDROID_SDK_ROOT}"
BT="$SDK_ROOT/build-tools/35.0.0"
PLATFORM="$SDK_ROOT/platforms/android-35/android.jar"
SIGNING_DIR="${SIGNING_DIR:-$PWD/../atlas-signing}"
mkdir -p build/classes build/dex "$SIGNING_DIR"
"$BT/aapt2" compile --dir app/src/main/res -o build/resources.zip
"$BT/aapt2" link -o build/base.apk -I "$PLATFORM" --manifest app/src/main/AndroidManifest.xml --min-sdk-version 26 --target-sdk-version 35 --version-code 40 --version-name 1.4 --rename-manifest-package ru.grigory.shoulderatlas -A app/src/main/assets build/resources.zip
java -m jdk.compiler/com.sun.tools.javac.Main -source 8 -target 8 -bootclasspath "$PLATFORM:$BT/core-lambda-stubs.jar" -d build/classes app/src/main/java/ru/grigory/shoulderatlas/MainActivity.java
"$BT/d8" --lib "$PLATFORM" --min-api 26 --output build/dex build/classes/ru/grigory/shoulderatlas/*.class
python3 - <<'PY'
from zipfile import ZipFile,ZIP_DEFLATED
from pathlib import Path
with ZipFile('build/base.apk','a',ZIP_DEFLATED) as z:
 for f in Path('build/dex').glob('*.dex'): z.write(f,f.name)
PY
if [ ! -f "$SIGNING_DIR/atlas.jks" ]; then
 keytool -genkeypair -keystore "$SIGNING_DIR/atlas.jks" -storepass android -keypass android -alias atlas -keyalg RSA -keysize 2048 -validity 10000 -dname 'CN=Shoulder Atlas Personal Build' >/dev/null
fi
"$BT/zipalign" -f 4 build/base.apk build/aligned.apk
"$BT/apksigner" sign --ks "$SIGNING_DIR/atlas.jks" --ks-pass pass:android --key-pass pass:android --ks-key-alias atlas --out /tmp/MRIAtlas-1.4-signed.apk build/aligned.apk
python3 - <<'PYCODE'
from pathlib import Path
import os
data=Path("/tmp/MRIAtlas-1.4-signed.apk").read_bytes()
with open("build/MRIAtlas-1.4.apk","wb") as f:
 f.write(data); f.flush(); os.fsync(f.fileno())
PYCODE
"$BT/apksigner" verify --verbose build/MRIAtlas-1.4.apk
"$BT/aapt2" dump badging build/MRIAtlas-1.4.apk
