import {examples as originalExamples} from './nav327-examples.js';

const ccBy = 'https://creativecommons.org/licenses/by/4.0/';
const epidermoidFigure = 'nav327/epidermoid-fig2.jpg';

const epidermoid = {
  id: 'epidermoid-alosaimi-fig2',
  case_id: 'PMC12186845-case1',
  entity: 'epidermoid',
  title: 'Эпидермоидная киста левого мостомозжечкового угла',
  source: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12186845/',
  authors: 'Alosaimi et al., 2025 · рис. 2A, C',
  license: 'CC BY 4.0 · в атласе показаны отдельные панели оригинала',
  license_url: ccBy,
  link: 'brain-cysts.html',
  tags: {loc: ['cpa'], comp: ['extra'], structure: ['csf']},
  note: 'Дооперационная МРТ. Диагноз подтверждён гистологически.',
  trap: 'Сравните ADC с прилежащим ликвором и тканью мозга. В этом случае ADC неоднороден и местами близок к паренхиме. Оцените также подавление сигнала на FLAIR.',
  panels: [
    {file: epidermoidFigure, box: [0, 0, 1445, 1444], label: 'A · DWI · аксиально', note: 'Стрелка указывает на яркое содержимое в цистерне левого ММУ.', modality: 'MRI', sequence: ['DWI']},
    {file: epidermoidFigure, box: [0, 1445, 1445, 1444], label: 'C · ADC · аксиально', note: 'На том же уровне ADC содержимого ниже, чем у прилежащего ликвора.', modality: 'MRI', sequence: ['ADC']},
  ],
};

const ischemia = {
  id: 'ischemia-lu-fig1',
  case_id: '10.1097-MD.0000000000048436-case1',
  title: 'Острый водораздельный инфаркт',
  source: 'https://doi.org/10.1097/MD.0000000000048436',
  authors: 'Lu et al., 2026 · рис. 1C, D',
  license: 'CC BY 4.0',
  license_url: ccBy,
  link: 'stroke.html?condition306=ischemia&case306=ischemia-2',
  note: 'Первый день по публикации. Сопоставьте очаги в левой лобно-теменной водораздельной зоне.',
  trap: 'При оценке ишемии учитывайте распределение очагов и время от начала симптомов.',
  panels: [
    {file: 'neuro289/ischemia-2.png', label: 'C · DWI · аксиально', note: 'Очаги высокого сигнала в водораздельной зоне.', modality: 'MRI', sequence: ['DWI']},
    {file: 'neuro289/ischemia-3.png', label: 'D · ADC · аксиально', note: 'Снижение ADC в соответствующих очагах.', modality: 'MRI', sequence: ['ADC']},
  ],
};

const verifiedCases = {
  'brain-infections--abscess-gd': {
    case_id: '10.3389-fnins.2023.1248493-case2',
    authors: 'Zhang et al., 2023 · рис. 3',
    adc: 'center_low',
  },
  'review338-hiv-lymphoma': {
    case_id: '10.3389-fmed.2026.1779221-fig13',
    authors: 'Talybov et al., 2026 · рис. 13',
    adc: 'solid_low',
  },
  'brain-oncology247--pediatric-medullo': {
    case_id: '10.3390-diagnostics12040961-medulloblastoma',
    adc: 'solid_low',
  },
};

export const examples = [...originalExamples.map(example => {
  const verified = verifiedCases[example.id];
  if (!verified) return example;
  const {adc, ...metadata} = verified;
  return {...example, ...metadata, license_url: ccBy, tags: {...example.tags, adc: [adc]}};
}), epidermoid];

const byId = new Map(examples.map(example => [example.id, example]));

export const diffusionCases = [
  {example: byId.get('brain-infections--abscess-gd'), pattern: 'Жидкостный центр', finding: 'В полости абсцесса высокий DWI соответствует низкому ADC. Сопоставьте полость с кольцом усиления на T1 после контраста.'},
  {example: byId.get('review338-hiv-lymphoma'), pattern: 'Солидная ткань', finding: 'Сопоставьте снижение ADC с солидным усиливающимся компонентом. Пример морфологически подтверждённой лимфомы при ВИЧ.'},
  {example: byId.get('brain-oncology247--pediatric-medullo'), pattern: 'Солидная ткань в ЗЧЯ', finding: 'Высокий DWI и низкий ADC в солидном компоненте опухоли ЗЧЯ у ребёнка. Такой диффузионный паттерн встречается у разных опухолей.'},
  {example: epidermoid, pattern: 'Ликвороподобное образование', finding: 'В цистерне ММУ содержимое яркое на DWI. На ADC сопоставьте его с прилежащим ликвором.'},
  {example: ischemia, pattern: 'Водораздельная зона', finding: 'Высокий DWI и низкий ADC совпадают в очагах водораздельной зоны в первый день.'},
];
