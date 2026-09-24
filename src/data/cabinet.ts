/** Данные демонстрационного кабинета: проекты, разделы, задачи и финансы. */

export type RowStatus = 'ok' | 'wait' | 'risk';

export type Row = { title: string; meta: string; status: RowStatus };

export type Section = {
  id: string;
  icon: string;
  label: string;
  rows: Row[];
};

export type Task = { title: string; who: string; due: string; status: RowStatus };

export type Payment = { name: string; sum: string; date: string; done: boolean };

export type Money = { label: string; part: number; color: string };

export type Meeting = { day: number; title: string; time: string };

export type StageReport = {
  verdict: string;
  cost: string;
  costNote: string;
  docs: string;
  term: string;
  termNote: string;
};

export type Project = {
  id: string;
  name: string;
  place: string;
  stage: number;
  ready: number;
  budget: number;
  issues: number;
  sheet: { code: string; name: string; scale: string; author: string; plan: 'flat' | 'school' | 'house' };
  board: string;
  files: { name: string; kind: string; size: string }[];
  sections: Section[];
  tasks: Task[];
  payments: Payment[];
  money: Money[];
  calendar: { month: string; days: number; first: number; today: number; meeting: Meeting };
  report: StageReport;
  chat: { who: string; role: 'crm' | 'ai' | 'eng' | 'doc' | 'buh'; text: string; time: string; file?: string }[];
  hint: { text: string; source: string; save: string };
  events: { icon: string; text: string; tone: string }[];
};

const MONEY_BASE = (a: number, b: number, c: number, d: number): Money[] => [
  { label: 'Материалы', part: a, color: '#2f6df6' },
  { label: 'ФОТ', part: b, color: '#34d399' },
  { label: 'Логистика', part: c, color: '#f2a65a' },
  { label: 'Накладные', part: d, color: '#8b8fa3' },
];

export const projects: Project[] = [
  {
    id: 'south',
    name: 'ЖК «Южный»',
    place: 'Москва',
    stage: 4,
    ready: 62,
    budget: 78,
    issues: 3,
    sheet: { code: 'АР-12', name: 'План типового этажа', scale: '1:100', author: 'Ковалёв А. С.', plan: 'flat' },
    board: 'https://cdn.poehali.dev/projects/973263ae-4d11-4e93-b52f-fdb346792765/bucket/aff4e159-1fe8-4fe0-a3a7-6bdbcd3f6e17.jpg',
    files: [
      { name: 'АР-12 План типового этажа.pdf', kind: 'PDF', size: '4.2 МБ' },
      { name: 'ЭОМ-11 План силовой сети.dwg', kind: 'DWG', size: '1.8 МБ' },
      { name: 'Акт скрытых работ №61.docx', kind: 'DOCX', size: '0.3 МБ' },
    ],
    sections: [
      {
        id: 'crm',
        icon: 'Users',
        label: 'CRM',
        rows: [
          { title: 'Согласовать схему заземления', meta: 'Срок 12.10 · Ковалёв А. С.', status: 'wait' },
          { title: 'Звонок поставщику по контуру', meta: 'Сегодня 16:30 · Ерохин П. Л.', status: 'risk' },
          { title: 'Планёрка по электрике', meta: 'Проведена 04.10', status: 'ok' },
        ],
      },
      {
        id: 'clients',
        icon: 'Briefcase',
        label: 'Заказчики',
        rows: [
          { title: 'ООО «Южный берег»', meta: 'Договор 14/25 · оплата по графику', status: 'ok' },
          { title: 'Калайтанов Д. В. · технадзор', meta: 'Ждёт ответ по подсветке фасада', status: 'risk' },
          { title: 'Мосгосстройнадзор', meta: 'Плановая проверка 21.10', status: 'wait' },
        ],
      },
      {
        id: 'contractors',
        icon: 'HardHat',
        label: 'Исполнители',
        rows: [
          { title: 'ЭлектроМонтажСервис · контур заземления', meta: 'На площадке с 08.10', status: 'wait' },
          { title: 'Прораб Савельев А. И.', meta: 'Подтверждает приёмку материала', status: 'risk' },
          { title: 'СтройКровля · утепление', meta: 'Работы закрыты актом', status: 'ok' },
        ],
      },
      {
        id: 'docs',
        icon: 'FileSignature',
        label: 'Договоры и акты',
        rows: [
          { title: 'КС-2 №14 · электромонтаж', meta: 'Подписан 06.10', status: 'ok' },
          { title: 'КС-3 №14 · справка о стоимости', meta: 'На подписи у заказчика', status: 'wait' },
          { title: 'Акт скрытых работ №61', meta: 'Расхождение по объёму 8 %', status: 'risk' },
        ],
      },
      {
        id: 'pd',
        icon: 'FileText',
        label: 'Проектная документация',
        rows: [
          { title: 'ИОС1 · Электроснабжение', meta: 'Выдана в производство работ', status: 'ok' },
          { title: 'ЭОМ · Силовое оборудование', meta: 'Корректировка по замечанию 4', status: 'wait' },
          { title: 'АПФ · Подсветка фасада', meta: 'Срок через 8 дней', status: 'risk' },
        ],
      },
      {
        id: 'id',
        icon: 'ClipboardCheck',
        label: 'Исполнительная документация',
        rows: [
          { title: 'Журнал электромонтажных работ', meta: 'Заполнен по 07.10', status: 'ok' },
          { title: 'Протокол замера изоляции', meta: 'Ожидает лабораторию', status: 'wait' },
          { title: 'Исполнительная схема заземления', meta: 'После поставки материала', status: 'wait' },
        ],
      },
      {
        id: 'buh',
        icon: 'Receipt',
        label: 'Бухгалтерия',
        rows: [
          { title: 'Счёт №312 · кабель ВВГнг 5×16', meta: 'Оплачен 07.10 · 486 200 ₽', status: 'ok' },
          { title: 'Счёт №318 · полоса заземления', meta: 'К оплате до 11.10 · 214 800 ₽', status: 'wait' },
          { title: 'НДС за III квартал', meta: 'Декларация подана', status: 'ok' },
        ],
      },
      {
        id: 'econ',
        icon: 'ChartColumn',
        label: 'Экономика',
        rows: [
          { title: 'Отклонение от сметы', meta: '+1.8 % по разделу ЭОМ', status: 'risk' },
          { title: 'Освоено на текущем этапе', meta: '34.2 млн из 44.1 млн ₽', status: 'wait' },
          { title: 'Экономия по закупкам', meta: '1.24 млн ₽ с начала работ', status: 'ok' },
        ],
      },
    ],
    tasks: [
      { title: 'Подтвердить поставку заземления', who: 'Савельев А. И.', due: 'сегодня', status: 'risk' },
      { title: 'Выдать ЭОМ в производство', who: 'Ковалёв А. С.', due: '11.10', status: 'wait' },
      { title: 'Закрыть замечание №4', who: 'Тимофеева Н. Р.', due: '14.10', status: 'wait' },
      { title: 'Принять кровлю по акту', who: 'Савельев А. И.', due: 'выполнено', status: 'ok' },
    ],
    payments: [
      { name: 'Аванс по договору 14/25', sum: '12.4 млн ₽', date: '05.09', done: true },
      { name: 'Этап «АР и КР»', sum: '9.8 млн ₽', date: '28.09', done: true },
      { name: 'Этап «Электрика»', sum: '7.2 млн ₽', date: '18.10', done: false },
      { name: 'Финальный расчёт', sum: '5.6 млн ₽', date: '20.12', done: false },
    ],
    money: MONEY_BASE(46, 28, 14, 12),
    calendar: { month: 'Октябрь', days: 31, first: 3, today: 9, meeting: { day: 21, title: 'Проверка надзора', time: '10:00' } },
    report: {
      verdict: 'Этап «АР и КР» успешно завершён',
      cost: '9.84 млн ₽',
      costNote: 'сметная 10.10 млн ₽ · экономия 2.6 %',
      docs: '34 листа, все согласованы',
      term: '42 дня',
      termNote: 'план 45 дней · с опережением на 3 дня',
    },
    chat: [
      { who: 'CRM-система', role: 'crm', text: 'Заявка №45 переведена в статус «Поставка». Ответственный — Савельев А. И.', time: '09:02' },
      { who: 'ИИ-ассистент', role: 'ai', text: 'В акте №61 объём полосы заземления на 8 % больше проектного. Сверьте с листом ЭОМ-11.', time: '09:15' },
      { who: 'Инженер Дмитрий', role: 'eng', text: 'Расхождение из-за обхода фундамента по факту. Согласовано, готовлю дополнение к акту.', time: '09:22' },
      { who: 'Екатерина, делопроизводитель', role: 'doc', text: 'Направляю комплект на подписание. Требуется подписать электронной подписью до конца дня.', time: '10:04', file: 'Комплект КС-2 №14.pdf · 3.1 МБ' },
      { who: 'Светлана, бухгалтер', role: 'buh', text: 'Акты КС-2 и КС-3 за апрель по ЖК «Южный» направлены Юдину Р. В. Он подтвердил получение.', time: '10:31' },
    ],
    hint: {
      text: 'Полоса заземления 40×4 мм найдена дешевле, чем в смете',
      source: 'ozon.ru · в наличии, доставка 2 дня',
      save: 'экономия 38 400 ₽',
    },
    events: [
      { icon: 'Bell', text: 'Завтра утром: уведомление Калайтанову Д. В. о поставке по заявке №45 «Утепление кровли»', tone: '#8fb4ff' },
      { icon: 'Truck', text: 'Поставка материалов для контура заземления — подтвердить время у поставщика и прораба', tone: '#f2a65a' },
      { icon: 'CalendarClock', text: 'Через 8 дней истекает срок проектных работ по подсветке фасада — отправляю запрос', tone: '#f2a65a' },
    ],
  },

  {
    id: 'dacha',
    name: 'Дача зама Владимировича',
    place: 'Горки-12',
    stage: 8,
    ready: 84,
    budget: 91,
    issues: 1,
    sheet: { code: 'АР-04', name: 'План первого этажа', scale: '1:50', author: 'Лебедева И. К.', plan: 'house' },
    board: 'https://cdn.poehali.dev/projects/973263ae-4d11-4e93-b52f-fdb346792765/bucket/aeae3fbd-b1cf-444c-8035-69b8f84afd51.jpg',
    files: [
      { name: 'АР-04 План первого этажа.pdf', kind: 'PDF', size: '2.6 МБ' },
      { name: 'Узлы фальцевой кровли.dwg', kind: 'DWG', size: '1.1 МБ' },
      { name: 'Доп. соглашение №2.docx', kind: 'DOCX', size: '0.2 МБ' },
    ],
    sections: [
      {
        id: 'crm',
        icon: 'Users',
        label: 'CRM',
        rows: [
          { title: 'Согласовать цвет фальцевой кровли', meta: 'Срок 10.10 · Лебедева И. К.', status: 'wait' },
          { title: 'Выезд на объект с заказчиком', meta: 'Суббота 11:00', status: 'ok' },
          { title: 'Замер площадки под террасу', meta: 'Выполнен 02.10', status: 'ok' },
        ],
      },
      {
        id: 'clients',
        icon: 'Briefcase',
        label: 'Заказчики',
        rows: [
          { title: 'Владимирович С. П. · частное лицо', meta: 'Договор 08/25 · оплата авансами', status: 'ok' },
          { title: 'Супруга заказчика · интерьер', meta: 'Выбор отделки террасы', status: 'wait' },
          { title: 'Управляющий посёлка', meta: 'Согласование вывоза мусора', status: 'ok' },
        ],
      },
      {
        id: 'contractors',
        icon: 'HardHat',
        label: 'Исполнители',
        rows: [
          { title: 'КровляПро · фальцевая кровля', meta: 'Монтаж 60 %', status: 'wait' },
          { title: 'Бригада Мартиросяна Г. А.', meta: 'Фасадные работы завершены', status: 'ok' },
          { title: 'ЛандшафтСтрой', meta: 'Выходит 15.10', status: 'ok' },
        ],
      },
      {
        id: 'docs',
        icon: 'FileSignature',
        label: 'Договоры и акты',
        rows: [
          { title: 'Доп. соглашение №2 · терраса', meta: 'Подписано 30.09', status: 'ok' },
          { title: 'Акт приёмки фасада', meta: 'Подписан 05.10', status: 'ok' },
          { title: 'Акт на кровлю', meta: 'После завершения монтажа', status: 'wait' },
        ],
      },
      {
        id: 'pd',
        icon: 'FileText',
        label: 'Проектная документация',
        rows: [
          { title: 'АР · Архитектурные решения', meta: 'Согласованы заказчиком', status: 'ok' },
          { title: 'КР · Узлы кровли', meta: 'Выданы на площадку', status: 'ok' },
          { title: 'Генплан · благоустройство', meta: 'Корректировка по террасе', status: 'wait' },
        ],
      },
      {
        id: 'id',
        icon: 'ClipboardCheck',
        label: 'Исполнительная документация',
        rows: [
          { title: 'Журнал общих работ', meta: 'Заполнен по 08.10', status: 'ok' },
          { title: 'Акты скрытых работ по фасаду', meta: 'Подшиты в дело', status: 'ok' },
          { title: 'Исполнительная съёмка участка', meta: 'После благоустройства', status: 'wait' },
        ],
      },
      {
        id: 'buh',
        icon: 'Receipt',
        label: 'Бухгалтерия',
        rows: [
          { title: 'Счёт №104 · фальц оцинкованный', meta: 'Оплачен 28.09 · 742 000 ₽', status: 'ok' },
          { title: 'Счёт №109 · террасная доска', meta: 'К оплате до 12.10 · 318 500 ₽', status: 'wait' },
          { title: 'Авансовый отчёт бригады', meta: 'Принят', status: 'ok' },
        ],
      },
      {
        id: 'econ',
        icon: 'ChartColumn',
        label: 'Экономика',
        rows: [
          { title: 'Отклонение от сметы', meta: '−0.6 % · в пределах нормы', status: 'ok' },
          { title: 'Освоено по договору', meta: '18.6 млн из 20.4 млн ₽', status: 'wait' },
          { title: 'Доп. работы по террасе', meta: '+1.2 млн ₽ согласовано', status: 'ok' },
        ],
      },
    ],
    tasks: [
      { title: 'Согласовать цвет кровли', who: 'Лебедева И. К.', due: 'завтра', status: 'wait' },
      { title: 'Закрыть монтаж фальца', who: 'Мартиросян Г. А.', due: '13.10', status: 'wait' },
      { title: 'Вывести ландшафтников', who: 'Прораб Гусев Р. Т.', due: '15.10', status: 'wait' },
      { title: 'Принять фасад', who: 'Лебедева И. К.', due: 'выполнено', status: 'ok' },
    ],
    payments: [
      { name: 'Аванс 40 %', sum: '8.2 млн ₽', date: '12.05', done: true },
      { name: 'Каркас и фасад', sum: '6.4 млн ₽', date: '22.08', done: true },
      { name: 'Кровля и терраса', sum: '4.0 млн ₽', date: '25.10', done: false },
      { name: 'Благоустройство', sum: '1.8 млн ₽', date: '30.11', done: false },
    ],
    money: MONEY_BASE(52, 24, 11, 13),
    calendar: { month: 'Октябрь', days: 31, first: 3, today: 9, meeting: { day: 12, title: 'Выезд с заказчиком', time: '11:00' } },
    report: {
      verdict: 'Этап «Кровля» в завершающей стадии',
      cost: '3.92 млн ₽',
      costNote: 'сметная 4.05 млн ₽ · экономия 3.2 %',
      docs: '18 листов, замечаний нет',
      term: '26 дней',
      termNote: 'план 24 дня · отставание 2 дня',
    },
    chat: [
      { who: 'CRM-система', role: 'crm', text: 'Заявка на фальц переведена в «Ожидает подтверждения цвета».', time: '18:20' },
      { who: 'ИИ-ассистент', role: 'ai', text: 'Графит есть у поставщика, поставка 4 дня. Сдвиг по кровле 2 дня, в общий срок укладываемся.', time: '18:41' },
      { who: 'Инженер Дмитрий', role: 'eng', text: 'Переоформляю заявку. Доплата за цвет 46 тысяч, сегодня пришлю на согласование.', time: '18:52' },
      { who: 'Екатерина, делопроизводитель', role: 'doc', text: 'Подготовила дополнение к договору по цвету кровли. Нужна электронная подпись заказчика.', time: '19:05', file: 'Доп. соглашение №3.pdf · 0.9 МБ' },
      { who: 'Светлана, бухгалтер', role: 'buh', text: 'Счёт №109 на террасную доску выставлен, оплата запланирована на 12 октября.', time: '19:18' },
    ],
    hint: {
      text: 'Террасная доска лиственница найдена дешевле сметной цены',
      source: 'ozon.ru · в наличии на складе в Москве',
      save: 'экономия 52 100 ₽',
    },
    events: [
      { icon: 'Palette', text: 'Заказчик меняет цвет кровли на графит — переоформить заявку поставщику', tone: '#f2a65a' },
      { icon: 'CalendarCheck', text: 'Суббота 11:00 — выезд на объект вместе с Владимировичем С. П.', tone: '#8fb4ff' },
      { icon: 'Truck', text: 'Террасная доска приходит 15.10 — согласовать разгрузку с управляющим посёлка', tone: '#8fb4ff' },
    ],
  },

  {
    id: 'school',
    name: 'Школа на 550 мест',
    place: 'Подольск',
    stage: 2,
    ready: 28,
    budget: 41,
    issues: 5,
    sheet: { code: 'АР-07', name: 'План блока начальных классов', scale: '1:200', author: 'Гаврилов Е. Н.', plan: 'school' },
    board: 'https://cdn.poehali.dev/projects/973263ae-4d11-4e93-b52f-fdb346792765/bucket/64cb710c-a80b-4b77-978e-ca675a38a865.jpg',
    files: [
      { name: 'АР-07 Планировки блоков.pdf', kind: 'PDF', size: '8.4 МБ' },
      { name: 'Отчёт по инженерным изысканиям.pdf', kind: 'PDF', size: '12.1 МБ' },
      { name: 'Замечания экспертизы.docx', kind: 'DOCX', size: '0.5 МБ' },
    ],
    sections: [
      {
        id: 'crm',
        icon: 'Users',
        label: 'CRM',
        rows: [
          { title: 'Собрать замечания экспертизы', meta: 'Срок 15.10 · Гаврилов Е. Н.', status: 'risk' },
          { title: 'Совещание с управлением образования', meta: 'Четверг 14:00', status: 'wait' },
          { title: 'Передать ТЗ смежникам', meta: 'Выполнено 01.10', status: 'ok' },
        ],
      },
      {
        id: 'clients',
        icon: 'Briefcase',
        label: 'Заказчики',
        rows: [
          { title: 'МУП «Школьный» · заказчик', meta: 'Муниципальный контракт 44-ФЗ', status: 'wait' },
          { title: 'Управление образования', meta: 'Согласование планировок', status: 'risk' },
          { title: 'Роспотребнадзор', meta: 'Замечания по инсоляции классов', status: 'risk' },
        ],
      },
      {
        id: 'contractors',
        icon: 'HardHat',
        label: 'Исполнители',
        rows: [
          { title: 'ГеоИзыскания · отчёт по грунтам', meta: 'Сдан 29.09', status: 'ok' },
          { title: 'Субподряд ОВиК · Панкратов В. Д.', meta: 'Задержка выдачи схем', status: 'risk' },
          { title: 'Смежники по сетям', meta: 'Ожидают техусловия', status: 'wait' },
        ],
      },
      {
        id: 'docs',
        icon: 'FileSignature',
        label: 'Договоры и акты',
        rows: [
          { title: 'Контракт 44-ФЗ №7/2025', meta: 'Действует до 30.06.2026', status: 'ok' },
          { title: 'Акт сдачи изысканий', meta: 'Подписан 30.09', status: 'ok' },
          { title: 'Соглашение о продлении срока ПД', meta: 'На рассмотрении заказчика', status: 'risk' },
        ],
      },
      {
        id: 'pd',
        icon: 'FileText',
        label: 'Проектная документация',
        rows: [
          { title: 'ПЗУ · Схема планировочной организации', meta: 'В разработке', status: 'wait' },
          { title: 'АР · Планировки блоков', meta: '5 замечаний по инсоляции', status: 'risk' },
          { title: 'ИОС · Наружные сети', meta: 'Ждём техусловия', status: 'wait' },
        ],
      },
      {
        id: 'id',
        icon: 'ClipboardCheck',
        label: 'Исполнительная документация',
        rows: [
          { title: 'Отчёт по инженерным изысканиям', meta: 'Принят заказчиком', status: 'ok' },
          { title: 'Журнал авторского надзора', meta: 'Откроется на стройке', status: 'wait' },
          { title: 'Исполнительная документация', meta: 'Этап не начат', status: 'wait' },
        ],
      },
      {
        id: 'buh',
        icon: 'Receipt',
        label: 'Бухгалтерия',
        rows: [
          { title: 'Счёт №21 · инженерные изыскания', meta: 'Оплачен 03.10 · 2.84 млн ₽', status: 'ok' },
          { title: 'Обеспечение контракта', meta: 'Банковская гарантия действует', status: 'ok' },
          { title: 'Счёт №26 · экспертиза', meta: 'К оплате до 20.10 · 1.12 млн ₽', status: 'wait' },
        ],
      },
      {
        id: 'econ',
        icon: 'ChartColumn',
        label: 'Экономика',
        rows: [
          { title: 'Риск срыва срока ПД', meta: 'Штраф до 0.8 млн ₽', status: 'risk' },
          { title: 'Освоено по контракту', meta: '8.9 млн из 31.5 млн ₽', status: 'wait' },
          { title: 'Резерв на непредвиденные', meta: '2 % не израсходован', status: 'ok' },
        ],
      },
    ],
    tasks: [
      { title: 'Закрыть замечания по инсоляции', who: 'Гаврилов Е. Н.', due: '15.10', status: 'risk' },
      { title: 'Получить техусловия на сети', who: 'Панкратов В. Д.', due: '17.10', status: 'risk' },
      { title: 'Подготовить ПЗУ к выдаче', who: 'Сорокина М. В.', due: '22.10', status: 'wait' },
      { title: 'Сдать отчёт по изысканиям', who: 'ГеоИзыскания', due: 'выполнено', status: 'ok' },
    ],
    payments: [
      { name: 'Аванс по контракту', sum: '6.3 млн ₽', date: '18.07', done: true },
      { name: 'Инженерные изыскания', sum: '2.6 млн ₽', date: '03.10', done: true },
      { name: 'Проектная документация', sum: '14.2 млн ₽', date: '25.12', done: false },
      { name: 'Рабочая документация', sum: '8.4 млн ₽', date: '30.04', done: false },
    ],
    money: MONEY_BASE(31, 44, 9, 16),
    calendar: { month: 'Октябрь', days: 31, first: 3, today: 9, meeting: { day: 16, title: 'Совещание с УО', time: '14:00' } },
    report: {
      verdict: 'Этап «Изыскания» успешно завершён',
      cost: '2.61 млн ₽',
      costNote: 'сметная 2.84 млн ₽ · экономия 8.1 %',
      docs: '6 томов, отчёт принят',
      term: '38 дней',
      termNote: 'план 35 дней · отставание 3 дня',
    },
    chat: [
      { who: 'CRM-система', role: 'crm', text: 'Получены замечания экспертизы: 5 пунктов по инсоляции. Срок ответа — 15 октября.', time: '10:40' },
      { who: 'ИИ-ассистент', role: 'ai', text: 'Три класса северного блока не добирают 2 часа по СанПиН 1.2.3685-21. Разворот блока на 12° закрывает вопрос.', time: '11:03' },
      { who: 'Инженер Дмитрий', role: 'eng', text: 'Считаем два варианта: разворот блока либо перенос классов в южное крыло. Решение к 15.10.', time: '11:20' },
      { who: 'Екатерина, делопроизводитель', role: 'doc', text: 'Направляю соглашение о продлении срока ПД. Подпишите электронной подписью до заседания.', time: '11:48', file: 'Соглашение о продлении.pdf · 1.4 МБ' },
      { who: 'Светлана, бухгалтер', role: 'buh', text: 'Счёт за экспертизу на 1.12 млн поставлен в оплату до 20 октября, гарантия действует.', time: '12:02' },
    ],
    hint: {
      text: 'Светопрозрачные конструкции класса А найдены дешевле сметы',
      source: 'ozon.ru · поставка под заказ, 14 дней',
      save: 'экономия 164 000 ₽',
    },
    events: [
      { icon: 'TriangleAlert', text: 'Пять замечаний экспертизы по инсоляции классов — решение до 15.10', tone: '#f2a65a' },
      { icon: 'CalendarClock', text: 'Четверг 14:00 — совещание с управлением образования по планировкам', tone: '#8fb4ff' },
      { icon: 'FileWarning', text: 'Техусловия на наружные сети не получены — риск сдвига срока ПД', tone: '#f2a65a' },
    ],
  },
];

export type ArchiveItem = { name: string; kind: string; year: string };

/** Завершённые проекты в архиве кабинета. */
export const archive: ArchiveItem[] = [
  { name: 'Завод металлоконструкций', kind: 'Производство', year: '2024' },
  { name: 'ТРЦ «Меридиан»', kind: 'Торговля', year: '2024' },
  { name: 'Частный дом, Лесные дали', kind: 'ИЖС', year: '2023' },
  { name: 'Пожарная часть на 4 выезда', kind: 'Госзаказ', year: '2023' },
  { name: 'ЖК «Речной», 3 очередь', kind: 'Жильё', year: '2022' },
  { name: 'Склад класса А, 12 тыс. м²', kind: 'Логистика', year: '2022' },
  { name: 'Детский сад на 220 мест', kind: 'Госзаказ', year: '2021' },
];

export type ToolItem = { icon: string; label: string; badge?: number; tone?: 'urgent' };

/** Рабочие инструменты кабинета — общие для всех проектов. */
export const tools: ToolItem[] = [
  { icon: 'Users', label: 'CRM — одна на все проекты', badge: 12 },
  { icon: 'FileSearch', label: 'Проверить документ' },
  { icon: 'Repeat', label: 'Конвертировать' },
  { icon: 'GitCompare', label: 'Сравнить' },
  { icon: 'PenLine', label: 'Изменить' },
  { icon: 'RefreshCw', label: 'Повторная аналитика', badge: 2 },
  { icon: 'Signature', label: 'На подпись', badge: 4 },
  { icon: 'Mail', label: 'Почта', badge: 7 },
  { icon: 'Inbox', label: 'Входящие уведомления', badge: 9 },
  { icon: 'Send', label: 'Исходящие уведомления' },
  { icon: 'ListChecks', label: 'Лист расхождений', badge: 3 },
  { icon: 'TrendingUp', label: 'Прогнозируемый бюджет' },
  { icon: 'TriangleAlert', label: 'СРОЧНО — ВАЖНО', badge: 2, tone: 'urgent' },
];

export default projects;
