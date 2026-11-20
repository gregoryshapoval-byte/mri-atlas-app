# MRIAtlas 3.57 / 257

Актуальная основа — [опубликованный APK 3.57](https://github.com/gregoryshapoval-byte/mri-atlas-app/releases/tag/atlas-3.57). Размер 556 647 208 байт. SHA‑256 `688b43b37105e64ee6cd04ea63b83f8f83dd8fecfb564a0aba9cd7892b75de37`. Пакет `ru.grigory.shoulderatlas.restored`.

## Восстановление и сборка

```sh
python3 tools/prepare_runtime.py
node tests/current345.mjs
python3 tests/runtime-integrity345.py
UNSIGNED_ONLY=1 bash build-apk.sh --prepared
```

Python скачивает закреплённый APK, сверяет размер и SHA‑256, составляет опись файлов и извлекает 12 486 ресурсов в `build/runtime-assets/`. Можно указать уже скачанный APK через `ATLAS_BASE_APK`. В базе также закреплены нативный код и Android-ресурсы. Сборочный скрипт перепаковывает APK и проверяет сохранность каждого файла. Компиляция нативного приложения с нуля по историческому дереву `app/src/main` в этот процесс не входит.

## Следующая правка

1. Возьмите актуальный файл из `build/runtime-assets/` и сохраните изменения в `runtime-overrides/357/` по тому же относительному пути.
2. Зарегистрируйте путь в `overrides` или `additions` в `release-inputs/current.json`. Для новых поисковых маршрутов используйте `release-inputs/search-routes.json`; при пустом списке исходные поисковые файлы сохраняются побайтно.
3. Для нового выпуска согласованно измените `versionName` и `versionCode` в `app/build.gradle` и `release-inputs/current.json`. Базовый APK 3.57 остаётся закреплённым в `base`. Старые overrides в корне `runtime-overrides/` и дерево `app/src/main/assets/` относятся к предыдущим версиям.
4. Для подписи восстановите прежний ключ через `python3 tools/restore_signing_key.py` и запустите `APKSIGNER_JAR=/путь/к/apksigner.jar bash build-apk.sh`. Проверяются сертификат и схемы v1/v2/v3. На GitHub используются ручные workflow проверки и выпуска. Workflow выпуска сравнивает опубликованный APK с собранным после повторного скачивания.

Состав базы и происхождение изменений описаны в [CURRENT-SNAPSHOT.md](CURRENT-SNAPSHOT.md). Релиз 3.57 и резервная копия ключа нужны для последующих сборок.
