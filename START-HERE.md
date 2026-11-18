# MRIAtlas 3.45 — актуальная основа проекта

Версия проекта: **3.45 / 245**, package `ru.grigory.shoulderatlas.restored`.
Изменения выпуска: поиск SMART/RIFIL/HOPE с прямыми переходами и приоритет основного справочника PI-RR. Клинические тексты, снимки, исходные метки и Android-код сохраняются.

## Единственная рабочая основа

1. `release-inputs/current.json` фиксирует опубликованный APK **3.44** и его SHA-256. Это неизменяемая база, а не ссылка `latest`.
2. `release-inputs/344/manifest.json` перечисляет все **12 401 assets** и Android-полезную нагрузку базы с размерами и SHA-256.
3. `runtime-overrides/` — проверяемые исходники трёх изменяемых файлов. Новую правку надо зарегистрировать в current.json; незарегистрированные файлы отвергаются.
4. `release-inputs/search-routes.json` хранит дополнительные поисковые назначения и точные псевдонимы основного справочника.
5. `python3 tools/prepare_runtime.py` восстанавливает полный текущий runtime в **build/runtime-assets/**. Его и упаковывает сборщик. Старое `app/src/main/assets/` — историческое дерево 2.64; оно исключено из Gradle assets и не является источником текущего APK.

Это воспроизводимая сборка обновления ресурсов поверх проверенной Android-полезной нагрузки 3.44. Полная пересборка восстановленного нативного исходного проекта этим не заявляется. `classes.dex` и Android-ресурсы сохраняются побайтно; в AndroidManifest изменяются только версия и код. GitHub Source code ZIP содержит рецепт восстановления и overrides; для сборки требуется закреплённый APK базы, который скачивается и проверяется автоматически. Не удалять релиз atlas-3.44 как сборочную зависимость.

## Продолжение работы

```sh
python3 tools/prepare_runtime.py
node tests/current345.mjs
python3 tests/runtime-integrity345.py
python3 tools/verify_current.py
```

Если база уже скачана, задайте `ATLAS_BASE_APK=/absolute/path/MRIAtlas-3.44.apk`.
Подготовленные `build/runtime-assets/` — производный результат. Для постоянной правки скопируйте нужный текущий файл в runtime-overrides, внесите изменение и явно зарегистрируйте его в current.json. Исторические генераторы/materialize/import поверх актуального runtime не запускать. Поиск генерирует текущая версия `tools/generate_search252.mjs`, сохраняющая все назначения 3.44; исторический рекурсивный генератор не используется.

Подпись: `python3 tools/restore_signing_key.py`, затем `APKSIGNER_JAR=/absolute/path/apksigner.jar bash build-apk.sh`. Прежний сертификат `cb7d43e1eb8ff4c1eee663e918b5413b70fb9d6f8221790075f83c7e153624fe`, подписи v2/v3. Новый ключ не создавать. Выход: `build/MRIAtlas-3.45.apk`.

## Проверка и публикация

- Workflow **Verify current MRIAtlas APK** — ручная проверка реального current runtime, поиска, прямых переходов, браузера и unsigned APK.
- Workflow **Publish current signed MRIAtlas** — ручная проверка, подпись прежним ключом, публикация только APK и обратное скачивание со сравнением.
- Зелёный **Source anatomy import environment** подтверждает только свои шаги импорта/зависимостей, а не сборку текущего APK.
- Результаты текущего запуска: workflow summary/artifact; локально `build/current-verification.json` и `build/browser-current345.json`.
- Цель релиза: https://github.com/gregoryshapoval-byte/mri-atlas-app/releases/tag/atlas-3.45 . Факт публикации и совпадение скачанного APK подтверждаются только успешным Publish workflow.

Полноценная проверка физического Android и независимая клиническая валидация не выполнены. Сохраняется очередь клинических улучшений из ревизии 18.11.2026; пункты DWI/ADC, Hepple IIB и семь геометрий Ramp не закрываются этим выпуском.

Исторические точки продолжения: [docs/history](docs/history/). Их номера версий не относятся к текущей сборке.
