export const regions=[
  {
    "id": "brain",
    "name": "Головной мозг",
    "description": "МРТ и сосудистая анатомия",
    "image": "menu-art/brain.webp",
    "items": [
      {"title":"Инсульты","description":"Ишемия · давность · кровь · сосуды · протокол МРТ","url":"stroke.html","type":"КЛИНИЧЕСКИЙ МОДУЛЬ","thumb":"menu-thumbs/stroke.svg"},
      {"title":"Сосудистые мальформации","description":"Кавернома · телеангиэктазия · ВАР / DVA · АВМ · фистулы","url":"vascular-malformations.html","type":"КЛИНИЧЕСКИЙ МОДУЛЬ","thumb":"menu-thumbs/vascular-malformations.svg"},
      {"title":"Опухоли головного мозга","description":"Возраст и частота · 13 тем · схемы · протоколы МРТ","url":"brain-tumors.html","type":"КЛИНИЧЕСКИЕ МОДУЛИ","thumb":"menu-thumbs/brain-tumors.svg"},
      {"title":"Рассеянный склероз","description":"МР-признаки · критерии · сканирование · заключение","url":"multiple-sclerosis.html","type":"КЛИНИЧЕСКИЙ МОДУЛЬ","thumb":"menu-thumbs/multiple-sclerosis.svg"},
      {
        "title": "Артерии · 3D",
        "description": "Вращаемая модель · цветные сегменты ВСА C1–C7",
        "url": "cerebral-arteries.html",
        "type": "3D-МОДЕЛЬ",
        "thumb": "menu-thumbs/cerebral-arteries.webp"
      },
      {
        "title": "Артерии · исходные ракурсы",
        "description": "5 изображений реконструкций · исходная анатомическая разметка",
        "url": "brain.html?set=vascular&series=arteries3d",
        "type": "3D-РАКУРСЫ",
        "thumb": "menu-thumbs/brain-set-vascular-series-arteries3d.webp"
      },
      {
        "title": "Вены и синусы · 3D",
        "description": "Вены и венозные синусы · 3 ракурса",
        "url": "brain.html?set=vascular&series=veins3d",
        "type": "3D-РАКУРСЫ",
        "thumb": "menu-thumbs/brain-set-vascular-series-veins3d.webp"
      },
      {
        "title": "МРТ · три плоскости",
        "description": "353 кадра · AX / COR / SAG",
        "url": "brain.html?set=multiplanar",
        "type": "МРТ",
        "thumb": "menu-thumbs/brain-set-multiplanar.webp"
      },
      {
        "title": "МРТ · разные контрасты",
        "description": "T1, T2, FLAIR, DWI · 144 кадра",
        "url": "brain.html?set=contrast",
        "type": "МРТ",
        "thumb": "menu-thumbs/brain-set-contrast.webp"
      },
      {
        "title": "Анатомия мозга · 3D",
        "description": "18 готовых ракурсов · исходные подписи",
        "url": "brain-3d.html?set=vascular",
        "type": "3D-РАКУРСЫ",
        "thumb": "menu-thumbs/brain-3d.webp"
      }
    ]
  },
  {
    "id": "spine",
    "name": "Позвоночник",
    "description": "Поясничный отдел · МРТ",
    "image": "menu-art/spine.webp",
    "items": [
      {"title":"Сакрализация · Castellvi","description":"7 схем · типы Ia–IV","url":"castellvi.html","type":"КЛИНИЧЕСКИЙ МОДУЛЬ","thumb":"menu-thumbs/castellvi.webp"},
      {
        "title": "МРТ поясничного отдела",
        "description": "T1 и T2 · исходные серии и мультипланарные реконструкции.",
        "url": "spine-mri.html",
        "type": "МРТ",
        "thumb": "menu-thumbs/spine-mri.webp"
      }
    ]
  },
  {
    "id": "face-neck",
    "name": "Лицо и шея",
    "description": "МРТ · три плоскости",
    "image": "menu-art/face-neck.webp",
    "items": [
      {
        "title": "МРТ лица и шеи",
        "description": "418 срезов · три плоскости · группы и поиск структур.",
        "url": "face-neck-mri.html",
        "type": "МРТ",
        "thumb": "menu-thumbs/face-neck-mri.webp"
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
        "thumb": "menu-thumbs/shoulder-mri.webp"
      },
      {
        "title": "МРТ · плечевое сплетение",
        "description": "160 кадров · три плоскости · исходные анатомические метки",
        "url": "brachial-plexus-mri.html",
        "type": "МРТ",
        "thumb": "menu-thumbs/brachial-plexus-mri.webp"
      },
      {
        "title": "Суставная губа · повреждения",
        "description": "Варианты губы · Bankart/SLAP · HAGL/GAGL · киста",
        "url": "shoulder-labrum.html",
        "type": "3D-МОДЕЛЬ",
        "thumb": "menu-thumbs/shoulder-labrum.webp"
      },
      {
        "title": "Хилл—Сакс и обратный",
        "description": "Импрессия головки · передний и задний вывих · МРТ 1,5 Т",
        "url": "shoulder-hill-sachs.html",
        "type": "3D-МОДЕЛЬ",
        "thumb": "menu-thumbs/shoulder-hill-sachs.webp"
      },
      {
        "title": "Сумки плеча",
        "description": "Сумки, завороты и влагалище бицепса",
        "url": "shoulder.html",
        "type": "3D-МОДЕЛЬ",
        "thumb": "menu-thumbs/shoulder.webp"
      },
      {
        "title": "Вращательная манжета",
        "description": "Варианты разрывов надостного сухожилия",
        "url": "cuff.html",
        "type": "3D-МОДЕЛЬ",
        "thumb": "menu-thumbs/cuff.webp"
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
        "thumb": "menu-thumbs/elbow-mri.webp"
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
        "thumb": "menu-thumbs/hand-mri.webp"
      },
      {
        "title": "МРТ ЛЗС · исходный атлас",
        "description": "T1 / PD-SPIR · три плоскости и 3D-ракурсы",
        "url": "wrist-mri.html",
        "type": "МРТ",
        "thumb": "menu-thumbs/wrist-mri.webp"
      },
      {
        "title": "Связки ЛЗС",
        "description": "SL, LT и наружные связки запястья",
        "url": "wrist.html?mode=ligaments",
        "type": "3D-МОДЕЛЬ",
        "thumb": "menu-thumbs/wrist-mode-ligaments.webp"
      },
      {
        "title": "Сухожилия ЛЗС",
        "description": "Каналы разгибателей, сгибатели и удерживатели",
        "url": "wrist.html?mode=tendons",
        "type": "3D-МОДЕЛЬ",
        "thumb": "menu-thumbs/wrist-mode-tendons.webp"
      },
      {
        "title": "TFCC · Palmer",
        "description": "ТФХК: норма и варианты повреждений Palmer",
        "url": "wrist.html?mode=tfcc",
        "type": "3D-МОДЕЛЬ",
        "thumb": "menu-thumbs/wrist-mode-tfcc.webp"
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
        "thumb": "menu-thumbs/knee-mri.webp"
      },
      {
        "title": "Пателлофеморальный сустав",
        "description": "Положение надколенника и форма блока",
        "url": "patellofemoral.html",
        "type": "3D-МОДЕЛЬ",
        "thumb": "menu-thumbs/patellofemoral.webp"
      },
      {
        "title": "Мениски",
        "description": "Норма и семь вариантов разрывов менисков",
        "url": "knee.html",
        "type": "3D-МОДЕЛЬ",
        "thumb": "menu-thumbs/knee.webp"
      },
      {
        "title": "Связки",
        "description": "ПКС, ЗКС, МКС и ЛКС: норма и разрывы",
        "url": "ligaments.html",
        "type": "3D-МОДЕЛЬ",
        "thumb": "menu-thumbs/ligaments.webp"
      },
      {
        "title": "Сумки и завороты",
        "description": "Сумки, завороты и окружающие структуры",
        "url": "knee-bursae.html",
        "type": "3D-МОДЕЛЬ",
        "thumb": "menu-thumbs/knee-bursae.webp"
      },
      {
        "title": "Хрящ",
        "description": "Хрящевые и костно-хрящевые дефекты",
        "url": "cartilage.html",
        "type": "3D-МОДЕЛЬ",
        "thumb": "menu-thumbs/cartilage.webp"
      },
      {
        "title": "Коленный сустав · 3D-ракурсы",
        "description": "6 готовых ракурсов · исходные подписи",
        "url": "knee-3d.html?set=vascular",
        "type": "3D-РАКУРСЫ",
        "thumb": "menu-thumbs/knee-3d.webp"
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
        "thumb": "menu-thumbs/hip-mri.webp"
      },
      {
        "title": "Анатомия · 3D-ракурсы",
        "description": "60 исходных ракурсов с анатомическими подписями.",
        "url": "hip-mri.html?set=vascular",
        "type": "3D-РАКУРСЫ",
        "thumb": "menu-thumbs/hip-mri-set-vascular.webp"
      }
    ]
  },
  {
    "id": "pelvis",
    "name": "Малый таз",
    "description": "Мужской и женский таз",
    "image": "menu-art/pelvis.webp",
    "items": [
      {"title":"Рак простаты · PI-RADS","description":"Зоны простаты · требования к МРТ · оценка очагов","url":"prostate-cancer.html","type":"КЛИНИЧЕСКИЙ МОДУЛЬ","thumb":"menu-thumbs/prostate-cancer.svg"},
      {"title":"Образования придатков · O-RADS MRI","description":"Категория риска · признаки · контрастирование · заключение","url":"orads-mri.html","type":"КЛИНИЧЕСКИЙ МОДУЛЬ","thumb":"menu-thumbs/orads-mri.webp"},
      {"title":"Рак прямой кишки","description":"Стадирование · MRF / EMVI · ответ на лечение · протокол GE","url":"rectal-cancer.html","type":"КЛИНИЧЕСКИЙ МОДУЛЬ","thumb":"menu-thumbs/rectal-cancer.webp"},
      {
        "title": "Перианальная область · мужчина",
        "description": "Сфинктеры, мышцы и пространства · анатомия для описания свищей",
        "url": "perianal-mri.html",
        "type": "МРТ",
        "thumb": "menu-thumbs/perianal-mri.webp"
      },
      {
        "title": "МРТ мужского таза · исходный атлас",
        "description": "Предстательная железа, органы и структуры таза",
        "url": "male-pelvis-mri.html",
        "type": "МРТ",
        "thumb": "menu-thumbs/male-pelvis-mri.webp"
      },
      {
        "title": "МРТ женского таза · исходный атлас",
        "description": "Матка, придатки и структуры таза · T1 / T2",
        "url": "female-pelvis-mri.html",
        "type": "МРТ",
        "thumb": "menu-thumbs/female-pelvis-mri.webp"
      },
      {
        "title": "Матка · миомы FIGO",
        "description": "Миомы типов 0–8 и гибридный тип 2–5",
        "url": "fibroids.html",
        "type": "3D-МОДЕЛЬ",
        "thumb": "menu-thumbs/fibroids.webp"
      }
    ]
  },
  {
    "id": "abdomen",
    "name": "Брюшная полость",
    "description": "КТ · органы, сосуды и сегменты печени",
    "image": "home-icons/abdomen.svg",
    "items": [
      {
        "title": "КТ · нормальная анатомия",
        "description": "182 среза · сегменты печени, IVa и IVb",
        "url": "abdomen-ct.html",
        "type": "КТ",
        "thumb": "menu-thumbs/abdomen-ct.webp"
      },
      {
        "title": "КТ · цирроз и асцит",
        "description": "303 среза · три плоскости · органы, сосуды и брюшина",
        "url": "abdomen-pelvis-ct.html",
        "type": "КТ",
        "thumb": "menu-thumbs/abdomen-pelvis-ct.webp"
      }
    ]
  },
  {
    "id": "foot",
    "name": "Предплюсна · стопа",
    "description": "МРТ и анатомические метки",
    "image": "menu-art/foot.webp",
    "items": [
      {
        "title": "МРТ предплюсны и стопы",
        "description": "284 кадра · три плоскости и исходные метки",
        "url": "foot-mri.html",
        "type": "МРТ",
        "thumb": "menu-thumbs/foot-mri.webp"
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
        "thumb": "menu-thumbs/upper-limb-mri.webp"
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
        "thumb": "menu-thumbs/lower-limb-mri.webp"
      }
    ]
  }
];
