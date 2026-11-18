# Продолжение MRIAtlas 3.45 / 245

Сначала **START-HERE.md**, затем `release-inputs/current.json` и `review/release-current.md`.

Актуальные редактируемые файлы — `runtime-overrides/`; полный текущий runtime готовит `tools/prepare_runtime.py` в `build/runtime-assets/`. Основа — закреплённый и проверяемый APK 3.44. Историческое дерево `app/src/main/assets/` не является входом сборки. Старые генераторы и импорты поверх новых assets не запускать.

Одна законченная правка — один набор изменений в main. APK — только в Releases, ключи и промежуточные изображения не коммитить. Проверять неизменность остальных assets, версии, native payload, v2/v3 и прежний сертификат. Текущие workflow запускаются вручную.

3.45 исправляет поиск SMART/RIFIL/HOPE и приоритет основного PI-RR. Физический Android и независимая клиническая валидация не проверены. Прежняя длинная история сохранена в docs/history/CONTINUE-before-3.45.md.
