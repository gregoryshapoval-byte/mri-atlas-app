# MRIAtlas 3.45 / 245

Текущий runtime = проверенный APK 3.44 + `runtime-overrides/` + детерминированные метаданные/индекс поиска.

- Основа: atlas-3.44 / MRIAtlas-3.44.apk, 543197400 байт.
- SHA-256: `1a36bd546a34212c77c700a63b2a3c15a330fcc89a28dd92baa9e34d9759fa6b`.
- Полный манифест базы: release-inputs/344/manifest.json.
- Подготовка: `python3 tools/prepare_runtime.py`.
- Рабочие assets: build/runtime-assets/; 12401 файлов, из них 12395 побайтно сохранены, 6 изменены.
- Исходные изменения: runtime-overrides/search252-core.js, perianal-report.js, perianal-cases.html; release-inputs/search-routes.json.
- Генерируемые изменения: app-version-data.js, search252-data.js, search252-catalog.js.
- Сборка: build-apk.sh / tools/build_current.py, сохраняя нативную полезную нагрузку 3.44.
- Android-пакет: ru.grigory.shoulderatlas.restored; версия 3.45, код 245.
- Факт публикации: проверять Release atlas-3.45 и результат Publish current signed MRIAtlas.

Старое дерево app/src/main/assets/ и предыдущие release-inputs — история, не альтернативная основа 3.45. Сохранённые снимки и метки не удалять. Прежняя точка продолжения — docs/history/CURRENT-SNAPSHOT-before-3.45.md.
