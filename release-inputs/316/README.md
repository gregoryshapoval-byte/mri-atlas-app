# MRIAtlas 3.16 · Повреждения связок запястья

Проверенный пакет для APK 3.15. Содержит модуль в меню запястья, восемь офлайн-иллюстраций, классификации Palmer, Atzei, Geissler и EWAS, поисковые ссылки и сборщик.

```sh
cat part[0-9][0-9][0-9] > MRIAtlas-3.16-wrist-ligaments-patch.zip
echo '112907bfdd35e7a76caebd31c828d27b87510d6c6bdd981f3f2495f1c90573db  MRIAtlas-3.16-wrist-ligaments-patch.zip' | sha256sum -c -
unzip MRIAtlas-3.16-wrist-ligaments-patch.zip -d MRIAtlas-3.16
```

Дальнейшие шаги описаны в README распакованного пакета. Сборка проверена на опубликованном MRIAtlas 3.15. Для установочного APK нужна подпись прежним сертификатом.

[Скачать базовый MRIAtlas 3.15](https://github.com/gregoryshapoval-byte/mri-atlas-app/releases/download/atlas-3.15/MRIAtlas-3.15.apk)
