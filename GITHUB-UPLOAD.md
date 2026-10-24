# Сборка и выпуск MRIAtlas

Актуальная версия2.42/versionCode142, веткаmain. Подробности состояния — CONTINUE.md. Android SDK35/build-tools35.0.0, JDK17.

## Локальная сборка

```sh
python3 tools/restore_signing_key.py
ANDROID_SDK_ROOT=/path/android-sdk bash build-apk.sh
```

Результат — build/MRIAtlas-2.42-restored.apk. Для проверки без ключа передать UNSIGNED_ONLY=1; такой APK не является устанавливаемым подписанным выпуском. Подпись и постоянная копия ключа — SIGNING.md.

build-apk.sh сначала восстанавливает точные локальные ресурсы из source-assets. Ключ хранится вне репозитория. Проверяются текущий сертификат и подписьAPK. Перед выпуском сверить package,versionCode/versionName,ZIP и assets.

## GitHub Actions

Build Android APK запускается вручную. Обычные push не должны автоматически запускать полную сборку и все браузерные проверки.

Уборка GitHub24.10.2026 выполнена успешно: осталась main, актуальный релиз2.41, архив ключа и исходный архив снимков. Одноразовая процедура удаления убрана после успеха. Реестр и результат — review/github-cleanup-2026-10-24*.json. Историякоммитов сохранена.

Publish current signed MRIAtlas — отдельная ручная публикация актуального APK в Releases с проверкой подписи,каждогоassets и контрольнымскачиванием;необычнаясборканакаждыйpush.
