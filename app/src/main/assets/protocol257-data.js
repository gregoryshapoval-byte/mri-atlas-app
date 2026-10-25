// Explicit mapping of existing protocol rows; no inference of clinical indications.
export const profiles={
  "acl-postop.html": {
    "panel": "scan",
    "labels": [
      "Перед исследованием",
      "Базово",
      "Базово",
      "Разрешение",
      "При металле",
      "По показаниям"
    ],
    "groups": "PBBQEE"
  },
  "adrenal-masses.html": {
    "panel": "scan",
    "labels": [
      "Обязательно · происхождение",
      "Обязательно · CSI",
      "Обязательно · жир/кровь",
      "По показаниям",
      "Дополнительно",
      "Уточнение / сравнение"
    ],
    "groups": "BBBEEQ"
  },
  "ankle-impingement.html": {
    "panel": "scan",
    "labels": [
      "База · техника",
      "База · контрасты",
      "База · параметры",
      "Покрытие",
      "Дополнительно",
      "Другие методы"
    ],
    "groups": "PBBPEE"
  },
  "ankle-ligaments.html": {
    "panel": "scan",
    "labels": [
      "База · укладка",
      "База · геометрия",
      "База · серии",
      "База · параметры",
      "Дополнительно",
      "Другие методы"
    ],
    "groups": "PPBBEE"
  },
  "ankle-tendons.html": {
    "panel": "scan",
    "labels": [
      "База · техника",
      "База · контрасты",
      "База · параметры",
      "Покрытие",
      "Дополнительно",
      "Другие методы"
    ],
    "groups": "PBBPEE"
  },
  "atrophy.html": {
    "panel": "scanning",
    "labels": [
      "3D T1 нативная · основа",
      "T2 + FLAIR · основа",
      "DWI + ADC · основа",
      "SWI / SWAN или T2* GRE · основа",
      "Контраст / ангиография · по показаниям",
      "Динамика / волюметрия · дополнительно"
    ],
    "groups": "BBBBCE"
  },
  "biliary-mrcp.html": {
    "panel": "scan",
    "labels": [
      "Подготовка",
      "Обязательно · карта",
      "Обязательно · ткань",
      "PSC / опухоль",
      "По показаниям",
      "Дополнительно"
    ],
    "groups": "PBBECE"
  },
  "bladder-urethra.html": {
    "panel": "neck-scanning",
    "labels": [
      "Пузырь: подготовка",
      "T2 высокого разрешения",
      "DWI / ADC",
      "DCE и нативный T1",
      "Женская уретра",
      "Покрытие и дополнения"
    ],
    "groups": "PBBCBE"
  },
  "bone-lesions.html": {
    "panel": "scan",
    "labels": [
      "До МРТ",
      "Основная",
      "Основная",
      "По вопросу",
      "Дополнительная",
      "Планирование"
    ],
    "groups": "PBBEEQ"
  },
  "bone-marrow.html": {
    "panel": "scanning",
    "labels": [
      "Базовый регионарный",
      "Тонкая линия / поверхность",
      "CSI по показаниям",
      "DWI по показаниям",
      "Контраст по задаче",
      "Расширенное покрытие"
    ],
    "groups": "BBEECE"
  },
  "brain-cysts.html": {
    "panel": "scanning",
    "labels": [
      "Основа · T1/T2/FLAIR",
      "Основа · DWI + ADC",
      "Прицельно · тонкая 3D T2",
      "По составу · T1 fat-sat / Dixon, SWI/GRE",
      "По показаниям · T1 до/после Gd",
      "Если EPI недостаточна · специальная DWI"
    ],
    "groups": "BBEECE"
  },
  "brain-infections.html": {
    "panel": "scanning",
    "labels": [
      "Основа",
      "Диффузия",
      "Кровь / сосуды",
      "Оболочки",
      "Кисты / источник",
      "Срочность / динамика"
    ],
    "groups": "BBBCEQ"
  },
  "brain-metastases-followup.html": {
    "panel": "scanning",
    "labels": [
      "Данные до сканирования",
      "3D T1 до / после Gd",
      "T2 / FLAIR",
      "DWI / ADC и SWI",
      "При неопределённом росте · перфузия",
      "Дополнительно · MRS / ПЭТ / LM"
    ],
    "groups": "PCBBEE"
  },
  "brain-metastases.html": {
    "panel": "scanning",
    "labels": [
      "3D T1 до / после Gd",
      "AX T2 и FLAIR",
      "DWI + ADC",
      "Доп. T1 после Gd"
    ],
    "groups": "CBBC"
  },
  "brain-trauma.html": {
    "panel": "scanning",
    "labels": [
      "Выбор метода",
      "Базовый МР-протокол",
      "Геометрия · рабочий пример",
      "Сосудистая задача",
      "Контраст и специальные серии",
      "Сравнение и ограничения"
    ],
    "groups": "PBQECQ"
  },
  "breast-mri.html": {
    "panel": "scan",
    "labels": [
      "Основа",
      "Основа",
      "Основа",
      "Аккредитационный минимум ACR2025",
      "Клиническая динамика",
      "Рекомендуемое дополнение",
      "Отдельная задача",
      "По показаниям",
      "Перед завершением"
    ],
    "groups": "PBCQCEEEQ"
  },
  "cervical-cancer.html": {
    "panel": "scan",
    "labels": [
      "Подготовка",
      "База · T2",
      "База · DWI / ADC",
      "База · обзор",
      "Дополнительно · контраст",
      "Распространённость"
    ],
    "groups": "PBBBCE"
  },
  "cns-lymphoma.html": {
    "panel": "scanning",
    "labels": [
      "DWI + ADC",
      "T1 до / после Gd",
      "T2 до / FLAIR после Gd",
      "Если T1 — IR-GRE",
      "Перфузия"
    ],
    "groups": "BCBQE"
  },
  "craniopharyngioma.html": {
    "panel": "scanning",
    "labels": [
      "Прицельные T1 до / после Gd · основа",
      "Прицельная T2 · основа",
      "Весь мозг · основа",
      "Нативная КТ / SWI · по задаче",
      "Дополнения · по задаче"
    ],
    "groups": "CBBEE"
  },
  "csf-disorders.html": {
    "panel": "scanning",
    "labels": [
      "Основа · T1/T2/FLAIR + DWI/ADC",
      "Блок · тонкая 3D T2",
      "DESH / измерения · MPR",
      "SIH · мозг с Gd + весь позвоночник",
      "Подозрение на IIH · орбиты + венография",
      "Кровь / причина / контроль · по задаче"
    ],
    "groups": "BBEEEB"
  },
  "demyelination.html": {
    "panel": "scanning",
    "labels": [
      "Головной мозг",
      "Спинной мозг",
      "Орбиты",
      "Susceptibility",
      "Контраст / динамика",
      "Если нетипично"
    ],
    "groups": "BEEECE"
  },
  "diffuse-gliomas.html": {
    "panel": "scanning",
    "labels": [
      "3D T1 до / после Gd",
      "T2 + FLAIR",
      "DWI + ADC",
      "SWI / T2*",
      "DSC / другие методы"
    ],
    "groups": "CBBBE"
  },
  "diffuse-liver.html": {
    "panel": "scan",
    "labels": [
      "Обязательно · морфология",
      "Для количественного жира",
      "Для количественного железа",
      "По показаниям · фиброз",
      "При сосудистой / очаговой задаче",
      "Дополнительно"
    ],
    "groups": "BEEECE"
  },
  "disc-nerve.html": {
    "panel": "scan",
    "labels": [
      "Базовые",
      "Базовые",
      "Ориентир качества",
      "Дополнительные",
      "По показаниям"
    ],
    "groups": "BBQEC"
  },
  "endometrial-cancer.html": {
    "panel": "scan",
    "labels": [
      "Подготовка",
      "База · T2",
      "База · DWI / ADC",
      "База · обзор",
      "Рекомендуется · контраст",
      "При невозможности контраста"
    ],
    "groups": "PBBBCQ"
  },
  "endometriosis.html": {
    "panel": "scanning",
    "labels": [
      "Подготовка",
      "Основа · T2 без FS",
      "Основа · T1",
      "Основа · почки",
      "Дополнительно · DWI / ADC и Gd",
      "Прицельное покрытие"
    ],
    "groups": "PBBBEE"
  },
  "ependymal.html": {
    "panel": "scanning",
    "labels": [
      "T1 до / после Gd · основа",
      "T2 + FLAIR · основа",
      "DWI + ADC · основа",
      "SWI / T2* и КТ · по задаче",
      "Весь нейроаксис · стадирование эпендимомы"
    ],
    "groups": "CBBEE"
  },
  "epilepsy.html": {
    "panel": "scanning",
    "labels": [
      "HARNESS · 3D T1",
      "HARNESS · 3D FLAIR",
      "HARNESS · COR T2",
      "Дополнения по задаче",
      "Аппарат / качество",
      "МР-негативный случай / дети"
    ],
    "groups": "BBBEQQ"
  },
  "glioblastoma.html": {
    "panel": "scanning",
    "labels": [
      "3D T1 до Gd",
      "FLAIR до Gd",
      "DWI + ADC до Gd",
      "AX T2 FSE",
      "3D T1 после Gd"
    ],
    "groups": "BBBBC"
  },
  "glioma-followup.html": {
    "panel": "scanning",
    "labels": [
      "Базовый набор",
      "Измерения",
      "Контраст / порядок",
      "После операции",
      "Неопределённый рост",
      "Дополнительно"
    ],
    "groups": "BQCEEE"
  },
  "glioneuronal.html": {
    "panel": "scanning",
    "labels": [
      "3D T1 нативная · HARNESS",
      "3D FLAIR · HARNESS",
      "COR T2 · HARNESS",
      "T1 после Gd + SWI/T2* · опухолевое дополнение",
      "DWI + ADC · опухолевое дополнение"
    ],
    "groups": "BBBEE"
  },
  "heel-pain.html": {
    "panel": "scan",
    "labels": [
      "База · техника",
      "База · контрасты",
      "База · параметры",
      "Покрытие",
      "Дополнительно",
      "Другие методы"
    ],
    "groups": "PBBPEE"
  },
  "hemangioblastoma.html": {
    "panel": "scanning",
    "labels": [
      "T1 до / после Gd · основа",
      "T2 + FLAIR · основа",
      "DWI + ADC · основа",
      "SWI / T2* · дополнение",
      "Перфузия / ангиография · по задаче"
    ],
    "groups": "CBBEE"
  },
  "inflammatory-arthritis.html": {
    "panel": "neck-scanning",
    "labels": [
      "Планирование",
      "T1 без подавления жира",
      "Жидкостно-чувствительные серии",
      "Контраст при оценке синовии",
      "По дополнительной задаче",
      "Динамика"
    ],
    "groups": "PBBCEQ"
  },
  "knee.html": {
    "panel": "scan",
    "labels": [
      "Базово",
      "Базово",
      "Базово",
      "Геометрия",
      "Дополнительно",
      "По показаниям"
    ],
    "groups": "BBBQEC"
  },
  "liver-lesions.html": {
    "panel": "scanning",
    "labels": [
      "Базовые серии",
      "DWI + ADC",
      "Динамика",
      "Выбор агента / HBP",
      "Уточняющие серии",
      "Контекст и ограничения"
    ],
    "groups": "BBCCEQ"
  },
  "meningioma.html": {
    "panel": "scanning",
    "labels": [
      "3D T1 до / после Gd",
      "T2 FSE и FLAIR",
      "DWI + ADC",
      "Прицельные серии"
    ],
    "groups": "CBBE"
  },
  "neck-nodes.html": {
    "panel": "neck-scanning",
    "labels": [
      "Покрытие",
      "T1 без подавления жира",
      "T2 FS / STIR",
      "DWI / ADC",
      "Постконтрастная T1 FS",
      "Дополнения по задаче"
    ],
    "groups": "PBBBCE"
  },
  "neck-spaces.html": {
    "panel": "neck-scanning",
    "labels": [
      "Покрытие",
      "T1 без подавления жира",
      "T2 FS / STIR",
      "DWI / ADC",
      "Постконтрастная T1 FS",
      "Дополнения по задаче"
    ],
    "groups": "PBBBCE"
  },
  "neurocytoma.html": {
    "panel": "scanning",
    "labels": [
      "T1 до / после Gd · основа",
      "T2 + FLAIR · основа",
      "DWI + ADC · основа",
      "SWI / T2* · дополнение",
      "Тонкая T2 / дополнительные методы · по задаче"
    ],
    "groups": "CBBEE"
  },
  "orbits-optic.html": {
    "panel": "neck-scanning",
    "labels": [
      "Планирование",
      "T2 FS / STIR",
      "Нативный T1",
      "T1 FS после контраста",
      "DWI / ADC",
      "По клинической задаче"
    ],
    "groups": "PBBCEE"
  },
  "osteonecrosis.html": {
    "panel": "scan",
    "labels": [
      "Базовые",
      "Базовые",
      "Качество",
      "Рентген / КТ",
      "По показаниям"
    ],
    "groups": "BBQEE"
  },
  "pancreatic-cysts.html": {
    "panel": "scan",
    "labels": [
      "Обязательно · покрытие",
      "Обязательно · морфология",
      "Обязательно · протоки",
      "Обязательно · T1",
      "При характеризации риска",
      "Дополнительно"
    ],
    "groups": "BBBBCE"
  },
  "pancreatic-solid.html": {
    "panel": "scan",
    "labels": [
      "Обязательно · покрытие",
      "Обязательно · T2",
      "Обязательно · T1",
      "Обязательно для характеризации",
      "Обязательно · диффузия",
      "Дополнительно"
    ],
    "groups": "BBBCBE"
  },
  "pilocytic.html": {
    "panel": "scanning",
    "labels": [
      "T1 до / после Gd · основа",
      "T2 + FLAIR · основа",
      "DWI + ADC · основа",
      "Зрительные пути · при их поражении",
      "SWI / перфузия / нейроаксис · по задаче"
    ],
    "groups": "CBBEE"
  },
  "prostate-cancer.html": {
    "panel": "scanning",
    "labels": [
      "T2 FSE / TSE",
      "DWI + ADC",
      "ADC",
      "High-b DWI",
      "DCE · T1 GRE",
      "T1 до Gd"
    ],
    "groups": "BBBBCB"
  },
  "rectal-cancer.html": {
    "panel": "protocol",
    "labels": [
      "Sag T2 FSE HR",
      "Ax T2 frFSE PELVIS",
      "Ax Obl T2 frFSE HR",
      "Cor Obl T2 frFSE HR",
      "Ax Obl DWI + ADC"
    ],
    "groups": "BBBBB"
  },
  "renal-bosniak.html": {
    "panel": "scan",
    "labels": [
      "Обязательно · покрытие",
      "Обязательно · морфология",
      "Обязательно · исходный T1",
      "Для полной характеризации",
      "Обязательно при T1-ярком / слабом усилении",
      "Дополнительно / ограничения"
    ],
    "groups": "BBBCCE"
  },
  "sacroiliitis.html": {
    "panel": "scan",
    "labels": [
      "Базовая 1",
      "Базовая 2",
      "Базовая 3",
      "Базовая 4",
      "Планирование / качество",
      "По показаниям"
    ],
    "groups": "BBBBQE"
  },
  "salivary-glands.html": {
    "panel": "neck-scanning",
    "labels": [
      "Покрытие",
      "T1 без подавления жира",
      "T2 FS / STIR",
      "DWI / ADC",
      "Постконтрастная T1 FS",
      "Дополнения по задаче"
    ],
    "groups": "PBBBCE"
  },
  "sellar.html": {
    "panel": "scanning",
    "labels": [
      "Прицельные T1 до Gd",
      "Прицельная T2",
      "T1 после Gd",
      "Динамика · по показаниям",
      "Дополнения по задаче"
    ],
    "groups": "BBCEE"
  },
  "small-vessel.html": {
    "panel": "scanning",
    "labels": [
      "T2 + FLAIR · основа",
      "T1 нативная · основа",
      "DWI + ADC · основа",
      "SWI / SWAN или T2* GRE · основа",
      "МРА · по задаче",
      "Gd / дополнительные серии · по показаниям"
    ],
    "groups": "BBBBEC"
  },
  "soft-tissue-tumors.html": {
    "panel": "neck-scanning",
    "labels": [
      "Планирование",
      "Нативный T1 без жироподавления",
      "T2 / PD с подавлением жира",
      "Контраст по задаче",
      "Дополнительные серии",
      "Дополнительные методы"
    ],
    "groups": "PBBCEE"
  },
  "spinal-cord.html": {
    "panel": "scanning",
    "labels": [
      "Базовый набор",
      "Воспалительный процесс",
      "Контраст",
      "Острая ишемия",
      "Кровь и сосуды",
      "Контроль"
    ],
    "groups": "BECEEQ"
  },
  "spinal-infection.html": {
    "panel": "scanning",
    "labels": [
      "До исследования",
      "Базовые серии",
      "Контраст",
      "DWI по задаче",
      "Расширение покрытия",
      "КТ / металл / дополнительные методы"
    ],
    "groups": "PBCEEE"
  },
  "stroke.html": {
    "panel": "scanning",
    "labels": [
      "DWI + ADC · в первую очередь",
      "FLAIR ± T2 · основа",
      "SWI / T2* GRE · основа",
      "Артерии головы и шеи · срочно по маршруту",
      "Перфузия · по задаче отбора",
      "T1 / Gd / МРВ · по вопросу"
    ],
    "groups": "BBBEEE"
  },
  "talar-olt.html": {
    "panel": "scan",
    "labels": [
      "База · техника",
      "База · контрасты",
      "База · параметры",
      "Покрытие",
      "Дополнительно",
      "Другие методы"
    ],
    "groups": "PBBPEE"
  },
  "toxic-hypoxic.html": {
    "panel": "scanning",
    "labels": [
      "До сканирования",
      "Базовый протокол",
      "Геометрия · рабочий пример",
      "Прицельные дополнения",
      "Gd и альтернативы",
      "Срок / контроль"
    ],
    "groups": "PBQECQ"
  },
  "vascular-malformations.html": {
    "panel": "scanning",
    "labels": [
      "T1 нативная + T2 · основа",
      "SWI / SWAN / эквивалент · основа",
      "FLAIR + DWI/ADC · основа",
      "T1 после Gd · по задаче",
      "TOF / динамическая МРА · при подозрении на шунт",
      "МРВ / КТВ / ДСА · по конкретному вопросу"
    ],
    "groups": "BBBCEE"
  },
  "venous-aneurysm-sah.html": {
    "panel": "scanning",
    "labels": [
      "Острая ситуация",
      "Паренхима и кровь",
      "Венозная задача",
      "Артериальная задача",
      "Геометрия · рабочий пример",
      "Контраст / устройства / контроль"
    ],
    "groups": "PBEEQC"
  },
  "vestibular.html": {
    "panel": "scanning",
    "labels": [
      "Высокоразрешающая 3D T2",
      "T1 до / после Gd",
      "T2 + FLAIR мозга",
      "DWI + ADC",
      "Дополнения по задаче"
    ],
    "groups": "BCBBE"
  },
  "brain-oncology247.html?topic=medulloblastoma": {
    "panel": "topic-scanning",
    "labels": [
      "Основа",
      "Прицельные серии",
      "Динамика",
      "Стадирование нейроаксиса"
    ],
    "groups": "BEQE"
  },
  "brain-oncology247.html?topic=pediatric-gliomas": {
    "panel": "topic-scanning",
    "labels": [
      "Основа",
      "Прицельные серии",
      "Динамика",
      "Покрытие по центру"
    ],
    "groups": "BEQE"
  },
  "brain-oncology247.html?topic=germ-cell": {
    "panel": "topic-scanning",
    "labels": [
      "Основа",
      "Прицельные серии",
      "Динамика",
      "Прицельные зоны",
      "Нейроаксис"
    ],
    "groups": "BEQEE"
  },
  "brain-oncology247.html?topic=skull-base": {
    "panel": "topic-scanning",
    "labels": [
      "Базовые серии",
      "Прицельное основание",
      "Костная КТ",
      "Сосуды",
      "Контроль"
    ],
    "groups": "BEEEQ"
  },
  "brain-oncology247.html?topic=sft": {
    "panel": "topic-scanning",
    "labels": [
      "Базовая МРТ",
      "Прикрепление и сосуды",
      "Венозные синусы",
      "Кость",
      "Контроль"
    ],
    "groups": "BEEEQ"
  },
  "brain-oncology247.html?topic=choroid-plexus": {
    "panel": "topic-scanning",
    "labels": [
      "Базовые серии",
      "Прикрепление",
      "После контраста",
      "Дополнительные методики",
      "Нейроаксис / контроль"
    ],
    "groups": "BECEE"
  },
  "brain-oncology247.html?topic=pineal-parenchymal": {
    "panel": "topic-scanning",
    "labels": [
      "Базовая МРТ",
      "Прицельная область",
      "После контраста",
      "Нейроаксис",
      "КТ и контроль"
    ],
    "groups": "BECEQ"
  },
  "brain-oncology247.html?topic=pxa": {
    "panel": "topic-scanning",
    "labels": [
      "Базовые серии",
      "Кора и оболочки",
      "После контраста",
      "Дополнение по задаче",
      "Контроль"
    ],
    "groups": "BECEQ"
  },
  "multiple-sclerosis.html": {
    "panel": "scanning",
    "adapter": "ms",
    "labels": [
      "3D FLAIR",
      "AX T2 FSE",
      "Серия для CVS",
      "T1 после Gd",
      "DWI + ADC; T1 до Gd",
      "SAG T2 + STIR или PD",
      "AX T2 / T2*; T1 после Gd",
      "COR T2 FS / STIR",
      "COR T1 FS после Gd"
    ],
    "groups": "BBECEBEEC"
  }
};
