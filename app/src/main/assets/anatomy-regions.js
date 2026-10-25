export const regions=[
  {
    "id": "brain",
    "name": "Головной мозг",
    "description": "МРТ и сосудистая анатомия",
    "image": "menu-art/brain.webp",
    "items": [
      {
        "title": "МРТ · три плоскости",
        "description": "353 кадра · AX / COR / SAG",
        "url": "brain.html?set=multiplanar",
        "type": "МРТ",
        "thumb": "menu-thumbs/brain-set-multiplanar.webp",
        "contentKind": "mri"
      },
      {
        "title": "МРТ · разные контрасты",
        "description": "T1, T2, FLAIR, DWI · 144 кадра",
        "url": "brain.html?set=contrast",
        "type": "МРТ",
        "thumb": "menu-thumbs/brain-set-contrast.webp",
        "contentKind": "mri"
      },
      {
        "title": "Болезнь мелких сосудов",
        "description": "Fazekas · лакуны · ПВП · микрокровоизлияния · ЦАА",
        "url": "small-vessel.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/small-vessel.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Атрофия и когнитивные нарушения",
        "description": "MTA · GCA · Koedam · возраст · паттерны · протокол МРТ",
        "url": "atrophy.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/atrophy.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Гидроцефалия и ликворные нарушения",
        "description": "Обструкция · DESH · ex vacuo · измерения · SIH / IIH",
        "url": "csf-disorders.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/csf-disorders.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Кисты и кистозные изменения",
        "description": "Арахноидальная · пинеальная · эпидермоид · состав · отличия",
        "url": "brain-cysts.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/brain-cysts.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Инсульты",
        "description": "Ишемия · давность · кровь · сосуды · протокол МРТ",
        "url": "stroke.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/stroke.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Сосудистые мальформации",
        "description": "Кавернома · телеангиэктазия · ВАР / DVA · АВМ · фистулы",
        "url": "vascular-malformations.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/vascular-malformations.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Венозный тромбоз, аневризмы и САК",
        "description": "Вены и синусы · артериальные аневризмы · субарахноидальная кровь",
        "url": "venous-aneurysm-sah.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/venous-aneurysm-sah.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Метастазы головного мозга",
        "description": "До лечения · сигналы / оболочки · после лечения · рецидив / радионекроз",
        "url": "brain-metastases-module.html",
        "type": "КЛИНИЧЕСКИЙ РАЗДЕЛ",
        "thumb": "menu-thumbs/brain-metastases-followup.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Первичные опухоли головного мозга",
        "description": "15 тем · диагностический навигатор · реальные примеры · протоколы МРТ",
        "url": "brain-tumors.html",
        "type": "КЛИНИЧЕСКИЕ МОДУЛИ",
        "thumb": "menu-thumbs/brain-tumors.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Глиомы · после лечения",
        "description": "Псевдопрогрессия · радионекроз · псевдоответ · RANO 2.0",
        "url": "glioma-followup.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/glioma-followup.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Демиелинизация",
        "description": "РС · NMOSD · MOGAD · ОДЭМ · тумефактивный очаг",
        "url": "demyelination.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/demyelination.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Инфекции",
        "description": "Абсцесс · эмпиема · энцефалит · ПМЛ · иммунный статус",
        "url": "brain-infections.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/brain-infections.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Эпилептогенные изменения",
        "description": "Гиппокамп · ФКД · мальформации · HARNESS-MRI",
        "url": "epilepsy.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/epilepsy.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Черепно-мозговая травма",
        "description": "Ушибы · аксональное повреждение · кровь · вторичные осложнения",
        "url": "brain-trauma.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/brain-trauma.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Токсические и гипоксические поражения",
        "description": "Гипоксия · токсические воздействия · метаболические имитаторы",
        "url": "toxic-hypoxic.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/toxic-hypoxic.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Артерии · 3D",
        "description": "Вращаемая модель · цветные сегменты ВСА C1–C7",
        "url": "cerebral-arteries.html",
        "type": "3D-МОДЕЛЬ",
        "thumb": "menu-thumbs/cerebral-arteries.webp",
        "contentKind": "model"
      },
      {
        "title": "Артерии · исходные ракурсы",
        "description": "5 изображений реконструкций · исходная анатомическая разметка",
        "url": "brain.html?set=vascular&series=arteries3d",
        "type": "3D-РАКУРСЫ",
        "thumb": "menu-thumbs/brain-set-vascular-series-arteries3d.webp",
        "contentKind": "model"
      },
      {
        "title": "Вены и синусы · 3D",
        "description": "Вены и венозные синусы · 3 ракурса",
        "url": "brain.html?set=vascular&series=veins3d",
        "type": "3D-РАКУРСЫ",
        "thumb": "menu-thumbs/brain-set-vascular-series-veins3d.webp",
        "contentKind": "model"
      },
      {
        "title": "Анатомия мозга · 3D",
        "description": "18 готовых ракурсов · исходные подписи",
        "url": "brain-3d.html?set=vascular",
        "type": "3D-РАКУРСЫ",
        "thumb": "menu-thumbs/brain-3d.webp",
        "contentKind": "model"
      }
    ]
  },
  {
    "id": "spine",
    "name": "Позвоночник",
    "description": "МР-анатомия поясницы · клинические модули",
    "image": "menu-art/spine.webp",
    "items": [
      {
        "title": "МРТ поясничного отдела",
        "description": "T1 и T2 · исходные серии и мультипланарные реконструкции.",
        "url": "spine-mri.html",
        "type": "МРТ",
        "thumb": "menu-thumbs/spine-mri.webp",
        "contentKind": "mri"
      },
      {
        "title": "Спинной мозг · очаги и миелопатии",
        "description": "Реальные МРТ · компрессия · РС / NMOSD / MOGAD · ишемия · опухоли",
        "url": "spinal-cord.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/spinal-cord.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Диски, рецессусы и корешки",
        "description": "Выбухание · протрузия · экструзия · компрессия · отверстия Lee",
        "url": "disc-nerve.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/disc-nerve.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Центральный стеноз · Schizas",
        "description": "A1–A4 · B · C · D · семь схем · формулировки заключения",
        "url": "schizas.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/schizas.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Сакроилиит и имитаторы",
        "description": "BME · эрозии · backfill · OCI · механика · протокол КПС",
        "url": "sacroiliitis.html?from=spine",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/sacroiliitis.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Спондилодисцит и имитаторы",
        "description": "Реальные снимки · Modic I · эпидуральное распространение · контроль",
        "url": "spinal-infection.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/spinal-infection.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Сакрализация · Castellvi",
        "description": "7 схем · типы Ia–IV",
        "url": "castellvi.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/castellvi.webp",
        "contentKind": "clinical"
      },
      {
        "title": "Костный мозг",
        "description": "Отёк · реконверсия · перелом · замещение · CSI / DWI",
        "url": "bone-marrow.html?from=spine",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/bone-marrow.svg",
        "contentKind": "reference"
      },
      {
        "title": "Очаговые образования костей",
        "description": "Агрессивность · матрикс · типичные очаги · SSR Bone-RADS",
        "url": "bone-lesions.html?from=spine",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/bone-lesions.svg",
        "contentKind": "reference"
      },
      {
        "title": "Стрессовые и недостаточностные переломы",
        "description": "Крестец · тазовое кольцо · компрессионные переломы",
        "url": "stress-fractures.html?from=spine",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "module231/stress-fractures.svg",
        "contentKind": "reference"
      }
    ]
  },
  {
    "id": "face-neck",
    "name": "Лицо и шея",
    "description": "МР-анатомия · слюнные железы · лимфоузлы · пространства",
    "image": "menu-art/face-neck.webp",
    "items": [
      {
        "title": "МРТ лица и шеи",
        "description": "418 срезов · три плоскости · группы и поиск структур.",
        "url": "face-neck-mri.html",
        "type": "МРТ",
        "thumb": "menu-thumbs/face-neck-mri.webp",
        "contentKind": "mri"
      },
      {
        "title": "Слюнные железы · очаги и имитаторы",
        "description": "Околоушная · подчелюстная · ADC · периневральное распространение",
        "url": "salivary-glands.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/salivary-glands.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Лимфоузлы шеи",
        "description": "Уровни · некроз · iENE · кистозный узел · дифряд",
        "url": "neck-nodes.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/neck-nodes.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Образования по пространствам шеи",
        "description": "Центр · парафарингеальный жир · сосуды · дно рта",
        "url": "neck-spaces.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/neck-spaces.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Орбиты и зрительные нервы",
        "description": "Неврит · мышцы · слёзные железы · орбитальные образования",
        "url": "orbits-optic.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/face-neck-mri.webp",
        "contentKind": "clinical"
      }
    ]
  },
  {
    "id": "shoulder",
    "name": "Плечо",
    "description": "Сустав, манжета и плечевое сплетение",
    "image": "menu-art/shoulder.webp",
    "items": [
      {
        "title": "МРТ плечевого сустава",
        "description": "230 кадров · T1 / PD-SPIR в трёх плоскостях",
        "url": "shoulder-mri.html",
        "type": "МРТ",
        "thumb": "menu-thumbs/shoulder-mri.webp",
        "contentKind": "mri"
      },
      {
        "title": "МРТ · плечевое сплетение",
        "description": "160 кадров · три плоскости · исходные анатомические метки",
        "url": "brachial-plexus-mri.html",
        "type": "МРТ",
        "thumb": "menu-thumbs/brachial-plexus-mri.webp",
        "contentKind": "mri"
      },
      {
        "title": "Вращательная манжета",
        "description": "Все сухожилия · разрывы · Ellman / Patte · мышцы и заключения",
        "url": "cuff.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/cuff.webp",
        "contentKind": "clinical"
      },
      {
        "title": "Нестабильность плеча",
        "description": "Губа / капсула · Hill–Sachs · glenoid track · костная потеря",
        "url": "shoulder-instability.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/clinical-shoulder239.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Сумки плеча",
        "description": "Сумки, завороты и влагалище бицепса",
        "url": "shoulder.html",
        "type": "3D-МОДЕЛЬ",
        "thumb": "menu-thumbs/shoulder.webp",
        "contentKind": "model"
      },
      {
        "title": "Костный мозг",
        "description": "Отёк · реконверсия · перелом · замещение · CSI / DWI",
        "url": "bone-marrow.html?from=shoulder",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/bone-marrow.svg",
        "contentKind": "reference"
      },
      {
        "title": "Очаговые образования костей",
        "description": "Агрессивность · матрикс · типичные очаги · SSR Bone-RADS",
        "url": "bone-lesions.html?from=shoulder",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/bone-lesions.svg",
        "contentKind": "reference"
      },
      {
        "title": "Туннельные невропатии",
        "description": "13 локализаций · нервы · карта денервации · причины компрессии",
        "url": "tunnel-neuropathies.html?from=shoulder",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "module231/tunnel-neuropathies.svg",
        "contentKind": "reference"
      },
      {
        "title": "Воспалительные заболевания суставов",
        "description": "Синовит · теносиновит · эрозии · РА / ПсА · инфекция",
        "url": "inflammatory-arthritis.html",
        "type": "ОБЩИЙ СПРАВОЧНИК",
        "thumb": "menu-thumbs/sacroiliitis.svg",
        "contentKind": "reference"
      }
    ]
  },
  {
    "id": "elbow",
    "name": "Локтевой сустав",
    "description": "МРТ и исходные ракурсы",
    "image": "menu-art/elbow.webp",
    "items": [
      {
        "title": "МРТ локтевого сустава · исходный атлас",
        "description": "321 кадр · T1 / PD-SPIR и 3D-ракурсы",
        "url": "elbow-mri.html",
        "type": "МРТ",
        "thumb": "menu-thumbs/elbow-mri.webp",
        "contentKind": "mri"
      },
      {
        "title": "Локоть · сухожилия и связки",
        "description": "Эпикондилиты · бицепс / трицепс · UCL / LUCL · бурситы",
        "url": "elbow-clinical.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/elbow-clinical240.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Костный мозг",
        "description": "Отёк · реконверсия · перелом · замещение · CSI / DWI",
        "url": "bone-marrow.html?from=elbow",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/bone-marrow.svg",
        "contentKind": "reference"
      },
      {
        "title": "Очаговые образования костей",
        "description": "Агрессивность · матрикс · типичные очаги · SSR Bone-RADS",
        "url": "bone-lesions.html?from=elbow",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/bone-lesions.svg",
        "contentKind": "reference"
      },
      {
        "title": "Туннельные невропатии",
        "description": "13 локализаций · нервы · карта денервации · причины компрессии",
        "url": "tunnel-neuropathies.html?from=elbow",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "module231/tunnel-neuropathies.svg",
        "contentKind": "reference"
      },
      {
        "title": "Воспалительные заболевания суставов",
        "description": "Синовит · теносиновит · эрозии · РА / ПсА · инфекция",
        "url": "inflammatory-arthritis.html",
        "type": "ОБЩИЙ СПРАВОЧНИК",
        "thumb": "menu-thumbs/sacroiliitis.svg",
        "contentKind": "reference"
      }
    ]
  },
  {
    "id": "wrist",
    "name": "Кисть и запястье",
    "description": "МРТ кисти и лучезапястного сустава",
    "image": "menu-art/wrist.webp",
    "items": [
      {
        "title": "МРТ кисти",
        "description": "280 изображений · T1 / PD-SPIR · три плоскости",
        "url": "hand-mri.html",
        "type": "МРТ",
        "thumb": "menu-thumbs/hand-mri.webp",
        "contentKind": "mri"
      },
      {
        "title": "МРТ ЛЗС · исходный атлас",
        "description": "T1 / PD-SPIR · три плоскости и 3D-ракурсы",
        "url": "wrist-mri.html",
        "type": "МРТ",
        "thumb": "menu-thumbs/wrist-mri.webp",
        "contentKind": "mri"
      },
      {
        "title": "Запястье · TFCC, связки и сухожилия",
        "description": "Palmer · фовеальное прикрепление · SL/LT · сухожилия · протокол и заключения",
        "url": "wrist-clinical.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/clinical-wrist239.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Костный мозг",
        "description": "Отёк · реконверсия · перелом · замещение · CSI / DWI",
        "url": "bone-marrow.html?from=wrist",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/bone-marrow.svg",
        "contentKind": "reference"
      },
      {
        "title": "Очаговые образования костей",
        "description": "Агрессивность · матрикс · типичные очаги · SSR Bone-RADS",
        "url": "bone-lesions.html?from=wrist",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/bone-lesions.svg",
        "contentKind": "reference"
      },
      {
        "title": "Туннельные невропатии",
        "description": "13 локализаций · нервы · карта денервации · причины компрессии",
        "url": "tunnel-neuropathies.html?from=wrist",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "module231/tunnel-neuropathies.svg",
        "contentKind": "reference"
      },
      {
        "title": "Воспалительные заболевания суставов",
        "description": "Синовит · теносиновит · эрозии · РА / ПсА · инфекция",
        "url": "inflammatory-arthritis.html",
        "type": "ОБЩИЙ СПРАВОЧНИК",
        "thumb": "menu-thumbs/sacroiliitis.svg",
        "contentKind": "reference"
      }
    ]
  },
  {
    "id": "knee",
    "name": "Коленный сустав",
    "description": "МРТ, анатомия и патология",
    "image": "menu-art/knee.webp",
    "items": [
      {
        "title": "МРТ коленного сустава",
        "description": "Три плоскости · T1 и PD-SPIR · исходные метки.",
        "url": "knee-mri.html",
        "type": "МРТ",
        "thumb": "menu-thumbs/knee-mri.webp",
        "contentKind": "mri"
      },
      {
        "title": "Мениски",
        "description": "Разрывы, корни, экструзия, после операции и 3D",
        "url": "knee.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/knee.webp",
        "contentKind": "clinical"
      },
      {
        "title": "Связки колена · нативные",
        "description": "ПКС / ЗКС · МКС · PLC · разрывы · мукоидная дегенерация",
        "url": "ligaments.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/clinical-ligaments239.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Хрящ колена",
        "description": "Дефекты · глубина и площадь · ICRS · кость · формулировки",
        "url": "cartilage.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/clinical-cartilage239.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Пателлофеморальный сустав",
        "description": "Вывих · MPFL · форма блока · TT–TG / LTI · высота",
        "url": "patellofemoral.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/clinical-patellofemoral239.svg",
        "contentKind": "clinical"
      },
      {
        "title": "ПКС после пластики",
        "description": "Трансплантат · каналы · фиксаторы · осложнения",
        "url": "acl-postop.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/acl-postop.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Сумки и завороты",
        "description": "Сумки, завороты и окружающие структуры",
        "url": "knee-bursae.html",
        "type": "3D-МОДЕЛЬ",
        "thumb": "menu-thumbs/knee-bursae.webp",
        "contentKind": "model"
      },
      {
        "title": "Коленный сустав · 3D-ракурсы",
        "description": "6 готовых ракурсов · исходные подписи",
        "url": "knee-3d.html?set=vascular",
        "type": "3D-РАКУРСЫ",
        "thumb": "menu-thumbs/knee-3d.webp",
        "contentKind": "model"
      },
      {
        "title": "Костный мозг",
        "description": "Отёк · реконверсия · перелом · замещение · CSI / DWI",
        "url": "bone-marrow.html?from=knee",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/bone-marrow.svg",
        "contentKind": "reference"
      },
      {
        "title": "Очаговые образования костей",
        "description": "Агрессивность · матрикс · типичные очаги · SSR Bone-RADS",
        "url": "bone-lesions.html?from=knee",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/bone-lesions.svg",
        "contentKind": "reference"
      },
      {
        "title": "Туннельные невропатии",
        "description": "13 локализаций · нервы · карта денервации · причины компрессии",
        "url": "tunnel-neuropathies.html?from=knee",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "module231/tunnel-neuropathies.svg",
        "contentKind": "reference"
      },
      {
        "title": "Стрессовые и недостаточностные переломы",
        "description": "Стресс-реакция · опасные зоны · SIFK · крестец · Fredericson",
        "url": "stress-fractures.html?from=knee",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "module231/stress-fractures.svg",
        "contentKind": "reference"
      },
      {
        "title": "Воспалительные заболевания суставов",
        "description": "Синовит · теносиновит · эрозии · РА / ПсА · инфекция",
        "url": "inflammatory-arthritis.html",
        "type": "ОБЩИЙ СПРАВОЧНИК",
        "thumb": "menu-thumbs/sacroiliitis.svg",
        "contentKind": "reference"
      }
    ]
  },
  {
    "id": "hip",
    "name": "Тазобедренный сустав",
    "description": "МРТ и анатомические ракурсы",
    "image": "menu-art/hip.webp",
    "items": [
      {
        "title": "МРТ тазобедренного сустава",
        "description": "Три плоскости · T1 и PD-SPIR · исходные метки.",
        "url": "hip-mri.html",
        "type": "МРТ",
        "thumb": "menu-thumbs/hip-mri.webp",
        "contentKind": "mri"
      },
      {
        "title": "ФАИ и суставная губа",
        "description": "Cam / pincer · измерения · губа · хрящ · протокол и заключения",
        "url": "hip-impingement.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/hip-impingement.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Аваскулярный некроз",
        "description": "МР-признаки · ARCO 2019 · перелом и коллапс · SIF / транзиторный отёк",
        "url": "osteonecrosis.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/osteonecrosis.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Анатомия · 3D-ракурсы",
        "description": "60 исходных ракурсов с анатомическими подписями.",
        "url": "hip-mri.html?set=vascular",
        "type": "3D-РАКУРСЫ",
        "thumb": "menu-thumbs/hip-mri-set-vascular.webp",
        "contentKind": "model"
      },
      {
        "title": "Костный мозг",
        "description": "Отёк · реконверсия · перелом · замещение · CSI / DWI",
        "url": "bone-marrow.html?from=hip",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/bone-marrow.svg",
        "contentKind": "reference"
      },
      {
        "title": "Очаговые образования костей",
        "description": "Агрессивность · матрикс · типичные очаги · SSR Bone-RADS",
        "url": "bone-lesions.html?from=hip",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/bone-lesions.svg",
        "contentKind": "reference"
      },
      {
        "title": "Туннельные невропатии",
        "description": "13 локализаций · нервы · карта денервации · причины компрессии",
        "url": "tunnel-neuropathies.html?from=hip",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "module231/tunnel-neuropathies.svg",
        "contentKind": "reference"
      },
      {
        "title": "Стрессовые и недостаточностные переломы",
        "description": "Стресс-реакция · опасные зоны · SIFK · крестец · Fredericson",
        "url": "stress-fractures.html?from=hip",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "module231/stress-fractures.svg",
        "contentKind": "reference"
      },
      {
        "title": "Воспалительные заболевания суставов",
        "description": "Синовит · теносиновит · эрозии · РА / ПсА · инфекция",
        "url": "inflammatory-arthritis.html",
        "type": "ОБЩИЙ СПРАВОЧНИК",
        "thumb": "menu-thumbs/sacroiliitis.svg",
        "contentKind": "reference"
      }
    ]
  },
  {
    "id": "pelvis",
    "name": "Малый таз",
    "description": "Мужской и женский таз",
    "image": "menu-art/pelvis.webp",
    "items": [
      {
        "title": "Перианальная область · мужчина",
        "description": "Сфинктеры, мышцы и пространства · анатомия для описания свищей",
        "url": "perianal-mri.html",
        "type": "МРТ",
        "thumb": "menu-thumbs/perianal-mri.webp",
        "contentKind": "mri"
      },
      {
        "title": "МРТ мужского таза · исходный атлас",
        "description": "Предстательная железа, органы и структуры таза",
        "url": "male-pelvis-mri.html",
        "type": "МРТ",
        "thumb": "menu-thumbs/male-pelvis-mri.webp",
        "contentKind": "mri"
      },
      {
        "title": "МРТ женского таза · исходный атлас",
        "description": "Матка, придатки и структуры таза · T1 / T2",
        "url": "female-pelvis-mri.html",
        "type": "МРТ",
        "thumb": "menu-thumbs/female-pelvis-mri.webp",
        "contentKind": "mri"
      },
      {
        "title": "Сакроилиит и имитаторы",
        "description": "BME · эрозии · backfill · OCI · механика · протокол КПС",
        "url": "sacroiliitis.html?from=pelvis",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/sacroiliitis.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Рак простаты · PI-RADS",
        "description": "Зоны простаты · требования к МРТ · оценка очагов",
        "url": "prostate-cancer.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/prostate-cancer.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Образования придатков · O-RADS MRI",
        "description": "Категория риска · признаки · контрастирование · заключение",
        "url": "orads-mri.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/orads-mri.webp",
        "contentKind": "clinical"
      },
      {
        "title": "Эндометриоз",
        "description": "Сигнал · глубокие очаги · карта таза · протокол и описание",
        "url": "endometriosis.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/endometriosis.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Пролапс тазовых органов у женщин",
        "description": "Три компартмента · PCL / H / M · ректоцеле · МР-дефекография",
        "url": "pelvic-prolapse.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/pelvic-prolapse.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Рак эндометрия",
        "description": "МР-критерии · FIGO · распространение · протокол и заключение",
        "url": "endometrial-cancer.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/endometrial-cancer.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Рак шейки матки",
        "description": "МР-критерии · FIGO · распространение · протокол и заключение",
        "url": "cervical-cancer.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/cervical-cancer.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Рак прямой кишки",
        "description": "Стадирование · MRF / EMVI · ответ на лечение · протокол GE",
        "url": "rectal-cancer.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/rectal-cancer.webp",
        "contentKind": "clinical"
      },
      {
        "title": "Миомы матки · МР-справочник",
        "description": "FIGO со схемами, дегенерации, атипичные узлы и заключения",
        "url": "fibroids.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/fibroids.webp",
        "contentKind": "clinical"
      },
      {
        "title": "Аденомиоз",
        "description": "Формы · JZ и прямые признаки · аденомиома · ловушки",
        "url": "adenomyosis.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/adenomyosis.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Мочевой пузырь и уретра",
        "description": "VI-RADS · стенка · дивертикулы и периуретральные образования",
        "url": "bladder-urethra.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/male-pelvis-mri.webp",
        "contentKind": "clinical"
      },
      {
        "title": "Костный мозг",
        "description": "Отёк · реконверсия · перелом · замещение · CSI / DWI",
        "url": "bone-marrow.html?from=pelvis",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/bone-marrow.svg",
        "contentKind": "reference"
      },
      {
        "title": "Очаговые образования костей",
        "description": "Агрессивность · матрикс · типичные очаги · SSR Bone-RADS",
        "url": "bone-lesions.html?from=pelvis",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/bone-lesions.svg",
        "contentKind": "reference"
      }
    ]
  },
  {
    "id": "abdomen",
    "name": "Брюшная полость",
    "description": "КТ-анатомия · клинические модули органов живота",
    "image": "home-icons/abdomen.svg",
    "items": [
      {
        "title": "КТ · нормальная анатомия",
        "description": "182 среза · сегменты печени, IVa и IVb",
        "url": "abdomen-ct.html",
        "type": "КТ",
        "thumb": "menu-thumbs/abdomen-ct.webp",
        "contentKind": "ct"
      },
      {
        "title": "КТ · цирроз и асцит",
        "description": "303 среза · три плоскости · органы, сосуды и брюшина",
        "url": "abdomen-pelvis-ct.html",
        "type": "КТ",
        "thumb": "menu-thumbs/abdomen-pelvis-ct.webp",
        "contentKind": "ct"
      },
      {
        "title": "Диффузные заболевания печени",
        "description": "Стеатоз · PDFF · железо / LIC · цирроз · портальные и печёночные вены",
        "url": "diffuse-liver.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/diffuse-liver.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Очаговые образования печени",
        "description": "Киста · гемангиома · ФНГ · аденома · ГЦР · метастазы",
        "url": "liver-lesions.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/liver-lesions.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Желчные протоки · МРХПГ",
        "description": "Камни · стриктуры · PSC · уровень обструкции · ловушки",
        "url": "biliary-mrcp.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/biliary-mrcp.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Кистозные образования поджелудочной",
        "description": "IPMN · SCN · MCN · Kyoto2024 · узелки · наблюдение",
        "url": "pancreatic-cysts.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/pancreatic-cysts.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Солидные образования поджелудочной и имитаторы",
        "description": "PDAC · Pan-NET · панкреатит / AIP · протоки · сосуды",
        "url": "pancreatic-solid.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/pancreatic-solid.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Образования почек · Bosniak",
        "description": "Bosniak2019 I–IV · усиление · субтракция · солидные массы",
        "url": "renal-bosniak.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/renal-bosniak.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Образования надпочечников",
        "description": "Аденома · CSI · жир / кровь · феохромоцитома · рост",
        "url": "adrenal-masses.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/adrenal-masses.svg",
        "contentKind": "clinical"
      }
    ]
  },
  {
    "id": "breast",
    "name": "Молочные железы",
    "description": "Клинический справочник · BI-RADS · импланты",
    "image": "home-icons/breast.svg",
    "items": [
      {
        "title": "МРТ молочных желёз · BI-RADS v2025",
        "description": "Узлы и NME · кинетика · категории0–6 · импланты · протокол и заключение",
        "url": "breast-mri.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "home-icons/breast.svg",
        "contentKind": "clinical"
      }
    ]
  },
  {
    "id": "foot",
    "name": "Голеностоп и стопа",
    "description": "МР-анатомия · голеностопный сустав и стопа",
    "image": "menu-art/foot.webp",
    "items": [
      {
        "title": "МРТ предплюсны и стопы",
        "description": "284 кадра · три плоскости и исходные метки",
        "url": "foot-mri.html",
        "type": "МРТ",
        "thumb": "menu-thumbs/foot-mri.webp",
        "contentKind": "mri"
      },
      {
        "title": "Связки голеностопа",
        "description": "ATFL / CFL / PTFL · синдесмоз · дельтовидная · повреждения",
        "url": "ankle-ligaments.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/ankle-ligaments.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Сухожилия голеностопа",
        "description": "Ахилл · PB / PL · PTT · разрывы · влагалища · после шва",
        "url": "ankle-tendons.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/ankle-tendons.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Остеохондральные поражения таранной кости",
        "description": "Hepple I–V · карта купола · хрящ · кисты · стабильность",
        "url": "talar-olt.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/talar-olt.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Импинджмент голеностопа",
        "description": "Передние / задние · os trigonum · латеральный конфликт",
        "url": "ankle-impingement.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/ankle-impingement.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Боль в пятке",
        "description": "Фасция · ахиллов энтезис · бурсы · стресс-перелом",
        "url": "heel-pain.html",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/heel-pain.svg",
        "contentKind": "clinical"
      },
      {
        "title": "Костный мозг",
        "description": "Отёк · реконверсия · перелом · замещение · CSI / DWI",
        "url": "bone-marrow.html?from=foot",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/bone-marrow.svg",
        "contentKind": "reference"
      },
      {
        "title": "Очаговые образования костей",
        "description": "Агрессивность · матрикс · типичные очаги · SSR Bone-RADS",
        "url": "bone-lesions.html?from=foot",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/bone-lesions.svg",
        "contentKind": "reference"
      },
      {
        "title": "Туннельные невропатии",
        "description": "13 локализаций · нервы · карта денервации · причины компрессии",
        "url": "tunnel-neuropathies.html?from=foot",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "module231/tunnel-neuropathies.svg",
        "contentKind": "reference"
      },
      {
        "title": "Стрессовые и недостаточностные переломы",
        "description": "Стресс-реакция · опасные зоны · SIFK · крестец · Fredericson",
        "url": "stress-fractures.html?from=foot",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "module231/stress-fractures.svg",
        "contentKind": "reference"
      },
      {
        "title": "Воспалительные заболевания суставов",
        "description": "Синовит · теносиновит · эрозии · РА / ПсА · инфекция",
        "url": "inflammatory-arthritis.html",
        "type": "ОБЩИЙ СПРАВОЧНИК",
        "thumb": "menu-thumbs/sacroiliitis.svg",
        "contentKind": "reference"
      }
    ]
  },
  {
    "id": "upper-limb",
    "name": "Верхняя конечность",
    "description": "Плечевой пояс, плечо, предплечье и кисть",
    "image": "menu-art/upper-limb.svg",
    "items": [
      {
        "title": "МРТ · верхняя конечность",
        "description": "194 кадра · 6 областей · исходные анатомические метки",
        "url": "upper-limb-mri.html",
        "type": "МРТ",
        "thumb": "menu-thumbs/upper-limb-mri.webp",
        "contentKind": "mri"
      },
      {
        "title": "Костный мозг",
        "description": "Отёк · реконверсия · перелом · замещение · CSI / DWI",
        "url": "bone-marrow.html?from=upper-limb",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/bone-marrow.svg",
        "contentKind": "reference"
      },
      {
        "title": "Очаговые образования костей",
        "description": "Агрессивность · матрикс · типичные очаги · SSR Bone-RADS",
        "url": "bone-lesions.html?from=upper-limb",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/bone-lesions.svg",
        "contentKind": "reference"
      },
      {
        "title": "Туннельные невропатии",
        "description": "13 локализаций · нервы · карта денервации · причины компрессии",
        "url": "tunnel-neuropathies.html?from=upper-limb",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "module231/tunnel-neuropathies.svg",
        "contentKind": "reference"
      },
      {
        "title": "Опухоли мягких тканей",
        "description": "Жир · миксоидный матрикс · нервы · сосуды · подозрение на саркому",
        "url": "soft-tissue-tumors.html",
        "type": "ОБЩИЙ СПРАВОЧНИК",
        "thumb": "menu-thumbs/bone-lesions.svg",
        "contentKind": "reference"
      }
    ]
  },
  {
    "id": "lower-limb",
    "name": "Нижняя конечность",
    "description": "От ягодичной области до стопы",
    "image": "menu-art/lower-limb.svg",
    "items": [
      {
        "title": "МРТ · нижняя конечность",
        "description": "277 кадров · 6 областей · исходные анатомические метки",
        "url": "lower-limb-mri.html",
        "type": "МРТ",
        "thumb": "menu-thumbs/lower-limb-mri.webp",
        "contentKind": "mri"
      },
      {
        "title": "Костный мозг",
        "description": "Отёк · реконверсия · перелом · замещение · CSI / DWI",
        "url": "bone-marrow.html?from=lower-limb",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/bone-marrow.svg",
        "contentKind": "reference"
      },
      {
        "title": "Очаговые образования костей",
        "description": "Агрессивность · матрикс · типичные очаги · SSR Bone-RADS",
        "url": "bone-lesions.html?from=lower-limb",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "menu-thumbs/bone-lesions.svg",
        "contentKind": "reference"
      },
      {
        "title": "Туннельные невропатии",
        "description": "13 локализаций · нервы · карта денервации · причины компрессии",
        "url": "tunnel-neuropathies.html?from=lower-limb",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "module231/tunnel-neuropathies.svg",
        "contentKind": "reference"
      },
      {
        "title": "Стрессовые и недостаточностные переломы",
        "description": "Стресс-реакция · опасные зоны · SIFK · крестец · Fredericson",
        "url": "stress-fractures.html?from=lower-limb",
        "type": "КЛИНИЧЕСКИЙ МОДУЛЬ",
        "thumb": "module231/stress-fractures.svg",
        "contentKind": "reference"
      },
      {
        "title": "Опухоли мягких тканей",
        "description": "Жир · миксоидный матрикс · нервы · сосуды · подозрение на саркому",
        "url": "soft-tissue-tumors.html",
        "type": "ОБЩИЙ СПРАВОЧНИК",
        "thumb": "menu-thumbs/bone-lesions.svg",
        "contentKind": "reference"
      }
    ]
  }
];
