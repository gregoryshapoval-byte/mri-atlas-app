#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
# Do not run historical materializers/generators over the current snapshot.
if [ "${UNSIGNED_ONLY:-0}" = "1" ]; then
  exec python3 tools/build_current.py --unsigned "$@"
fi
if [ -z "${APKSIGNER_JAR:-}" ]; then
  SDK_ROOT="${ANDROID_SDK_ROOT:-${ANDROID_HOME:-}}"
  export APKSIGNER_JAR="${SDK_ROOT}/build-tools/35.0.0/lib/apksigner.jar"
fi
if [ ! -f "$APKSIGNER_JAR" ]; then
  echo 'Set APKSIGNER_JAR to the Android SDK apksigner.jar.' >&2
  exit 1
fi
exec python3 tools/build_current.py "$@"
