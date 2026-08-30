import type { SceneVariant } from '@/components/workspace/Canvas';
import type { Estimate } from '@/components/workspace/EstimatorWidget';

export type Brief = {
  length: number;
  width: number;
  floors: number;
  region: string;
};

const R = /(\d+(?:[.,]\d+)?)\s*[x×хX*]\s*(\d+(?:[.,]\d+)?)/;

/** Разбирает свободное описание объекта: «дом 10х12, 2 этажа, Подмосковье». */
export const parseBrief = (text: string): Brief => {
  const t = text.toLowerCase();
  const m = t.match(R);
  const length = m ? Number(m[1].replace(',', '.')) : 10;
  const width = m ? Number(m[2].replace(',', '.')) : 12;
  const fl = t.match(/(\d+)\s*(?:-|\s)?эт/);
  const floors = fl ? Math.min(9, Math.max(1, Number(fl[1]))) : 2;
  const reg = text.match(/(?:в|регион[:\s]+)\s*([А-ЯЁ][а-яё-]+(?:\s+(?:область|край|обл\.?))?)/);
  return { length, width, floors, region: reg?.[1] ?? 'Московская область' };
};

const SCHEMES: { name: string; idea: string; mix: [string, number][] }[] = [
  {
    name: 'Открытая гостиная',
    idea: 'Кухня-гостиная единым объёмом, спальни отдельным крылом.',
    mix: [['Кухня-гостиная', 0.32], ['Спальня', 0.17], ['Спальня', 0.14], ['Санузел', 0.07], ['Прихожая', 0.09], ['Котельная', 0.06], ['Кладовая', 0.05], ['Коридор', 0.1]],
  },
  {
    name: 'Классическая раздельная',
    idea: 'Кухня и гостиная разделены, чёткое зонирование по функциям.',
    mix: [['Гостиная', 0.22], ['Кухня', 0.15], ['Спальня', 0.16], ['Спальня', 0.13], ['Санузел', 0.08], ['Прихожая', 0.09], ['Гардероб', 0.07], ['Коридор', 0.1]],
  },
  {
    name: 'С мастер-спальней',
    idea: 'Главная спальня с гардеробной и собственным санузлом.',
    mix: [['Кухня-гостиная', 0.28], ['Мастер-спальня', 0.2], ['Гардеробная', 0.08], ['Санузел при спальне', 0.07], ['Спальня', 0.14], ['Санузел', 0.06], ['Прихожая', 0.08], ['Коридор', 0.09]],
  },
  {
    name: 'Компактная экономичная',
    idea: 'Минимум коридоров, максимум полезной площади.',
    mix: [['Кухня-гостиная', 0.34], ['Спальня', 0.19], ['Спальня', 0.16], ['Санузел', 0.09], ['Прихожая', 0.1], ['Кладовая', 0.06], ['Котельная', 0.06]],
  },
  {
    name: 'С кабинетом',
    idea: 'Отдельный кабинет для удалённой работы, тихая зона.',
    mix: [['Кухня-гостиная', 0.28], ['Кабинет', 0.12], ['Спальня', 0.17], ['Спальня', 0.13], ['Санузел', 0.08], ['Прихожая', 0.08], ['Котельная', 0.05], ['Коридор', 0.09]],
  },
  {
    name: 'Для большой семьи',
    idea: 'Три спальни и два санузла, увеличенная столовая зона.',
    mix: [['Кухня-столовая', 0.24], ['Гостиная', 0.16], ['Спальня', 0.13], ['Спальня', 0.12], ['Спальня', 0.12], ['Санузел', 0.07], ['Санузел', 0.06], ['Коридор', 0.1]],
  },
  {
    name: 'С террасой',
    idea: 'Гостиная выходит на крытую террасу, панорамное остекление.',
    mix: [['Кухня-гостиная', 0.3], ['Терраса', 0.12], ['Спальня', 0.16], ['Спальня', 0.13], ['Санузел', 0.08], ['Прихожая', 0.08], ['Котельная', 0.05], ['Коридор', 0.08]],
  },
  {
    name: 'С гостевой зоной',
    idea: 'Гостевая спальня с отдельным входом и санузлом.',
    mix: [['Кухня-гостиная', 0.27], ['Спальня', 0.16], ['Спальня', 0.13], ['Гостевая', 0.13], ['Санузел', 0.08], ['Санузел', 0.06], ['Прихожая', 0.08], ['Коридор', 0.09]],
  },
];

/** Строит 8 вариантов планировки по габаритам — мгновенно, без обращения к сети. */
export const buildVariants = (b: Brief): SceneVariant[] => {
  const foot = b.length * b.width;
  const total = Math.round(foot * b.floors * 0.86);
  return SCHEMES.map((s) => {
    const rooms = s.mix.map(([name, share]) => ({
      name,
      area: Math.max(3, Math.round(total * share)),
    }));
    return {
      name: s.name,
      idea: s.idea,
      footprint: `${b.length}x${b.width} м`,
      floors: b.floors,
      area: rooms.reduce((x, r) => x + r.area, 0),
      rooms,
      pros: s.idea,
    };
  });
};

const REGION_K: Record<string, number> = {
  'московская область': 1.15,
  москва: 1.35,
  'санкт-петербург': 1.22,
  'ленинградская область': 1.12,
  'краснодарский край': 1.05,
  'ростовская область': 0.98,
  татарстан: 1.0,
  'свердловская область': 1.02,
};

const WORKS: { name: string; unit: string; per: (v: { foot: number; area: number; floors: number }) => number; price: number }[] = [
  { name: 'Земляные работы', unit: 'м³', per: (v) => v.foot * 0.9, price: 1250 },
  { name: 'Фундамент монолитный', unit: 'м³', per: (v) => v.foot * 0.32, price: 16500 },
  { name: 'Каркас и перекрытия', unit: 'м²', per: (v) => v.area, price: 9800 },
  { name: 'Кровля', unit: 'м²', per: (v) => v.foot * 1.25, price: 4300 },
  { name: 'Фасад и утепление', unit: 'м²', per: (v) => v.area * 0.85, price: 4100 },
  { name: 'Окна и двери', unit: 'м²', per: (v) => v.area * 0.16, price: 12500 },
  { name: 'Инженерные сети', unit: 'м²', per: (v) => v.area, price: 5200 },
  { name: 'Отделочные работы', unit: 'м²', per: (v) => v.area, price: 7400 },
];

/** Укрупнённый сметный расчёт по варианту планировки. */
export const buildEstimate = (v: SceneVariant, region: string): Estimate => {
  const m = String(v.footprint ?? '').match(R);
  const L = m ? Number(m[1].replace(',', '.')) : 10;
  const W = m ? Number(m[2].replace(',', '.')) : 12;
  const foot = L * W;
  const area = v.area ?? foot * (v.floors ?? 1);
  const k = REGION_K[region.toLowerCase().trim()] ?? 1;

  const items = WORKS.map((w) => {
    const qty = Math.round(w.per({ foot, area, floors: v.floors ?? 1 }));
    const price = Math.round(w.price * k);
    return { name: w.name, unit: w.unit, qty, price, sum: qty * price };
  });

  return {
    currency: 'RUB',
    regionK: k,
    items,
    total: items.reduce((s, i) => s + i.sum, 0),
    note: 'Укрупнённый расчёт по средним рыночным ценам. Точная смета готовится инженером института по рабочей документации.',
  };
};

export default buildVariants;

export type QuickTz = {
  title: string;
  summary: string;
  rows: { param: string; value: string }[];
  norms: string[];
  questions: string[];
};

/** Мгновенное техническое задание по описанию объекта. */
export const buildTz = (text: string): QuickTz => {
  const b = parseBrief(text);
  const foot = b.length * b.width;
  const total = Math.round(foot * b.floors * 0.86);
  return {
    title: `ТЗ: объект ${b.length}×${b.width} м, ${b.floors} эт.`,
    summary: `Индивидуальный жилой дом, пятно застройки ${foot} м², общая площадь около ${total} м². Регион строительства — ${b.region}.`,
    rows: [
      { param: 'Назначение', value: 'Индивидуальный жилой дом' },
      { param: 'Габариты в осях', value: `${b.length} × ${b.width} м` },
      { param: 'Этажность', value: `${b.floors}` },
      { param: 'Пятно застройки', value: `${foot} м²` },
      { param: 'Общая площадь', value: `${total} м²` },
      { param: 'Регион', value: b.region },
      { param: 'Класс ответственности', value: 'КС-2 (нормальный)' },
      { param: 'Конструктив', value: 'Ленточный фундамент, стены из газобетона, монолитные перекрытия' },
      { param: 'Инженерные сети', value: 'Электроснабжение, водоснабжение, канализация, отопление' },
      { param: 'Стадия', value: 'Проектная документация и рабочая документация' },
    ],
    norms: [
      'СП 55.13330.2016 — дома жилые одноквартирные',
      'СП 22.13330.2016 — основания зданий и сооружений',
      'СП 63.13330.2018 — бетонные и железобетонные конструкции',
      'СП 50.13330.2012 — тепловая защита зданий',
      'ПП РФ № 87 — состав проектной документации',
    ],
    questions: [
      'Есть ли результаты инженерно-геологических изысканий?',
      'Какой источник теплоснабжения планируется?',
      'Требуется ли подвал или цокольный этаж?',
    ],
  };
};
