# Актуальная подпись

Сначала SIGNING.md: с1.83 текущий сертификат cb7d43e1…3624fe. Постоянный ключ восстанавливает tools/restore_signing_key.py. Старые требования 9cc66233 ниже относятся к историческим выпускам.

# GitHub Actions и выпуск APK

Актуальное состояние: [CONTINUE.md](CONTINUE.md). Эта инструкция заменяет старую схему с временным ключом и артефактом1.23.

## Продолжение разработки
Открывайте существующий репозиторий `gregoryshapoval-byte/mri-atlas-app`. Контрольная точка1.49 находится на ветке `work/hip-knee-tendons-1-49`, PR #16; сначала проверьте наличие более поздних коммитов/слияния. Для следующей задачи создавайте ветку от актуальной проверенной основы, а не от старого main. Перенос в новый чат сам по себе не требует менять код или собирать новый APK.

## Workflow
`.github/workflows/build-apk.yml` — **Build Android APK**:
1. Восстановление точных offline-ресурсов `python3 tools/materialize_assets142.py`.
2. Установка JDK17, SDK35/build-tools35.0.0 и тестовых зависимостей.
3. Проверки данных/меню/просмотрщиков; генерация offline-миниатюр.
4. Сборка с `UNSIGNED_ONLY=1`.
5. Артефакты APK, миниатюр и контрольных скриншотов.

Запуск вручную: GitHub → Actions → Build Android APK → Run workflow → выбрать нужную ветку. Автоматические push-триггеры перечислены в workflow; новые ветки не считаются покрытыми автоматически. Изменения только Markdown игнорируются push-сборкой. Документация не требует нового APK.

Успешная сборка1.49: https://github.com/gregoryshapoval-byte/mri-atlas-app/actions/runs/39203069102
Артефакт: `MRIAtlas-1.49-unsigned`. Артефакты имеют ограниченный срок хранения; это не постоянная ссылка на подписанный релиз.

## Подпись
Unsigned-артефакт из Actions нельзя выдавать за готовый подписанный APK. Ключ хранится отдельно; не коммитить `*.jks`, `*.keystore`, исходные backups и открытую базу. Не загружать ключ в CI-артефакты.

`build-apk.sh` допускает сборку unsigned либо подпись прежним ключом из `SIGNING_DIR/atlas.jks`; отсутствие ключа — ошибка, не повод создать новый. Для обновлений поверх1.48/1.49 applicationId должен оставаться `ru.grigory.shoulderatlas.restored`, сертификат SHA-256:
`9cc66233387f434c95059fc032f12bf3fbed77345bca5d976e32e45b877cec14`.

Пример сборки после восстановления ресурсов и установки toolchain:
```sh
ANDROID_SDK_ROOT=/path/android-sdk UNSIGNED_ONLY=1 bash build-apk.sh
```
Локальную подписанную сборку выполнять только при доступном прежнем ключе:
```sh
ANDROID_SDK_ROOT=/path/android-sdk SIGNING_DIR=/private/signing bash build-apk.sh
```
Перед передачей APK проверить apksigner, applicationId/versionCode/versionName, целостность и сохранение исходных assets. Новый релиз требует увеличения версии в обоих местах (`app/build.gradle`, `build-apk.sh`) и обновления имён CI-артефактов.

## Исходные данные
`.github/workflows/source-anatomy-import.yml` — отдельная процедура подготовки импорта, не сборка APK и не замена инструкции восстановления. Правила и SQLCipher-процедура: [SOURCE_RECOVERY.md](SOURCE_RECOVERY.md).
