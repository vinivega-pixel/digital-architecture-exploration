import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { stages } from '@/data/stages';
import { stageShort } from '@/data/stageShort';

type Row = { title: string; meta: string; status: 'ok' | 'wait' | 'risk' };
type Section = { id: string; icon: string; label: string; rows: Row[]; sheets: { code: string; name: string }[] };

const STATUS: Record<Row['status'], { color: string; label: string }> = {
  ok: { color: '#34d399', label: 'Готово' },
  wait: { color: '#8fb4ff', label: 'В работе' },
  risk: { color: '#f2a65a', label: 'Внимание' },
};

const SECTIONS: Section[] = [
  {
    id: 'crm',
    icon: 'Users',
    label: 'CRM',
    rows: [
      { title: 'Задача: согласовать схему заземления', meta: 'Срок 12.10 · Ответственный Ковалёв', status: 'wait' },
      { title: 'Звонок поставщику по контуру', meta: 'Сегодня 16:30', status: 'risk' },
      { title: 'Планёрка по электрике', meta: 'Проведена 04.10', status: 'ok' },
    ],
    sheets: [
      { code: 'Задач', name: '14 активных' },
      { code: 'Просрочено', name: '1 задача' },
    ],
  },
  {
    id: 'clients',
    icon: 'Briefcase',
    label: 'Заказчики',
    rows: [
      { title: 'Калайтанов Д. В. · ЖК «Северный»', meta: 'Договор 14/25 · оплата по графику', status: 'ok' },
      { title: 'ООО «Южный берег» · Проект «Южный»', meta: 'Ждёт ответ по подсветке фасада', status: 'risk' },
      { title: 'МУП «Школьный» · Школа на 550 мест', meta: 'Согласование ПД', status: 'wait' },
    ],
    sheets: [
      { code: 'Активных', name: '3 заказчика' },
      { code: 'Оплаты', name: '82 % графика' },
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
    sheets: [
      { code: 'Бригад', name: '4 на объекте' },
      { code: 'Замечаний', name: '3 открытых' },
    ],
  },
  {
    id: 'docs',
    icon: 'FileSignature',
    label: 'Договоры и акты',
    rows: [
      { title: 'КС-2 №14 · электромонтажные работы', meta: 'Подписан 06.10', status: 'ok' },
      { title: 'КС-3 №14 · справка о стоимости', meta: 'На подписи у заказчика', status: 'wait' },
      { title: 'Акт скрытых работ №61 · заземление', meta: 'Расхождение по объёму 8 %', status: 'risk' },
    ],
    sheets: [
      { code: 'КС-2 №14', name: 'Электромонтаж' },
      { code: 'КС-3 №14', name: 'Стоимость работ' },
      { code: 'АСР №61', name: 'Контур заземления' },
    ],
  },
  {
    id: 'pd',
    icon: 'FileText',
    label: 'Проектная документация',
    rows: [
      { title: 'ИОС1 · Система электроснабжения', meta: 'Выдана в производство работ', status: 'ok' },
      { title: 'ЭОМ · Силовое оборудование и освещение', meta: 'Корректировка по замечанию 4', status: 'wait' },
      { title: 'АПФ · Архитектурная подсветка фасада', meta: 'Проект «Южный» · срок через 8 дней', status: 'risk' },
    ],
    sheets: [
      { code: 'ИОС1-4', name: 'Схема ВРУ' },
      { code: 'ЭОМ-11', name: 'План силовой сети' },
      { code: 'ЭН-03', name: 'Наружное освещение' },
    ],
  },
  {
    id: 'id',
    icon: 'ClipboardCheck',
    label: 'Исполнительная документация',
    rows: [
      { title: 'Журнал электромонтажных работ', meta: 'Заполнен по 07.10', status: 'ok' },
      { title: 'Протокол замера сопротивления изоляции', meta: 'Ожидает лабораторию', status: 'wait' },
      { title: 'Исполнительная схема контура заземления', meta: 'После поставки материала', status: 'wait' },
    ],
    sheets: [
      { code: 'ЖЭМ-1', name: 'Журнал работ' },
      { code: 'ПР-07', name: 'Протокол замеров' },
    ],
  },
];

const PROJECTS = [
  { id: 'north', name: 'ЖК «Северный»', stage: 4, ready: 64, budget: 82, issues: 3 },
  { id: 'south', name: 'Проект «Южный»', stage: 9, ready: 78, budget: 71, issues: 2 },
  { id: 'school', name: 'Школа на 550 мест', stage: 2, ready: 31, budget: 44, issues: 5 },
];

const EVENTS = [
  {
    icon: 'Bell',
    text: 'Завтра утром: отправить Калайтанову Д. В. уведомление о поставке материала по заявке №45 «Утепление кровли»',
    tone: '#8fb4ff',
  },
  {
    icon: 'Truck',
    text: 'Поставка материалов для контура заземления — подтвердить время у поставщика и прораба',
    tone: '#f2a65a',
  },
  {
    icon: 'CalendarClock',
    text: 'Через 8 дней истекает срок проектных работ по архитектурной подсветке фасада, проект «Южный» — отправляю запрос',
    tone: '#f2a65a',
  },
];

const CHAT = [
  {
    who: 'ИИ',
    icon: 'Sparkles',
    accent: true,
    text: 'В акте скрытых работ №61 объём полосы заземления на 8 % больше проектного. Сверьте с листом ЭОМ-11.',
  },
  {
    who: 'Инженер',
    icon: 'HardHat',
    accent: false,
    text: 'Расхождение из-за обхода фундамента по факту — решение согласовано, готовлю дополнение к акту.',
  },
];

/** Живое демо рабочего окна кабинета: разделы, проекты и события переключаются. */
const CabinetDemo = () => {
  const [projectId, setProjectId] = useState('north');
  const [sectionId, setSectionId] = useState('pd');
  const [eventIdx, setEventIdx] = useState(1);
  const [saved, setSaved] = useState(false);

  const project = PROJECTS.find((p) => p.id === projectId) ?? PROJECTS[0];
  const section = SECTIONS.find((s) => s.id === sectionId) ?? SECTIONS[0];
  const event = EVENTS[eventIdx];

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#0d1928] shadow-[0_30px_80px_-30px_rgba(0,0,0,.8)]">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-1">
          {stages.map((s, i) => {
            const done = i < project.stage;
            const now = i === project.stage;
            return (
              <div key={s.id} className="min-w-0 flex-1">
                <div
                  className="h-[5px] w-full rounded-full transition-colors duration-300"
                  style={{ background: done ? '#34d399' : now ? '#2f6df6' : 'rgba(255,255,255,.14)' }}
                />
                <p
                  className="mt-1 truncate text-[0.52rem] transition-colors duration-300"
                  style={{ color: done ? '#34d399b8' : now ? '#8fb4ff' : 'rgba(255,255,255,.32)' }}
                >
                  {stageShort[s.id] ?? s.phase}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-2.5 flex items-center gap-2">
          <div
            className="flex min-w-0 flex-1 items-start gap-2 rounded-lg border px-2.5 py-2 transition-colors duration-300"
            style={{ borderColor: `${event.tone}4d`, background: `${event.tone}1a` }}
          >
            <Icon name={event.icon} size={11} className="mt-0.5 shrink-0" style={{ color: event.tone }} />
            <p className="text-[0.58rem] leading-snug text-white/75">{event.text}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {EVENTS.map((e, i) => (
              <button
                key={e.text}
                onClick={() => setEventIdx(i)}
                aria-label={`Событие ${i + 1}`}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: i === eventIdx ? 16 : 6, background: i === eventIdx ? '#8fb4ff' : 'rgba(255,255,255,.22)' }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="w-[16%] shrink-0 border-r border-white/10 px-2 py-3">
          <p className="mb-2 px-1 text-[0.5rem] uppercase tracking-[0.1em] text-white/35">Проекты</p>
          {PROJECTS.map((p) => (
            <button
              key={p.id}
              onClick={() => setProjectId(p.id)}
              className={`mb-1 block w-full rounded-md px-1.5 py-1.5 text-left text-[0.53rem] leading-tight transition-colors ${
                p.id === projectId ? 'bg-white/[0.12] text-white' : 'text-white/45 hover:text-white/75'
              }`}
            >
              {p.name}
            </button>
          ))}
          <div className="mt-3 space-y-1 border-t border-white/10 pt-2.5">
            <button
              onClick={save}
              className="flex w-full items-center gap-1 rounded-md bg-[#2f6df6] px-1.5 py-1.5 text-[0.53rem] text-white transition-opacity hover:opacity-90"
            >
              <Icon name={saved ? 'Check' : 'Save'} size={9} />
              {saved ? 'Сохранено' : 'Сохранить'}
            </button>
            <button className="flex w-full items-center gap-1 rounded-md px-1.5 py-1.5 text-[0.53rem] text-white/45 transition-colors hover:text-white/75">
              <Icon name="Download" size={9} />
              Выгрузить
            </button>
          </div>
        </div>

        <div className="w-[22%] shrink-0 border-r border-white/10 px-2 py-3">
          {SECTIONS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSectionId(m.id)}
              className={`mb-[3px] flex w-full items-center gap-1.5 rounded-md px-2 py-[7px] text-left text-[0.55rem] leading-tight transition-colors ${
                m.id === sectionId ? 'bg-white/[0.1] text-white' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Icon name={m.icon} size={10} className="shrink-0" />
              <span className="truncate">{m.label}</span>
            </button>
          ))}
        </div>

        <div className="min-w-0 flex-1 px-3 py-3">
          <p className="text-[0.55rem] text-white/40">
            {project.name} · {section.label}
          </p>
          <div className="mt-2 space-y-1.5">
            {section.rows.map((row) => (
              <div key={row.title} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-2">
                <div className="flex items-start gap-2">
                  <span
                    className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: STATUS[row.status].color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.55rem] text-white/85">{row.title}</p>
                    <p className="truncate text-[0.5rem] text-white/40">{row.meta}</p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-1.5 py-[2px] text-[0.45rem]"
                    style={{ background: `${STATUS[row.status].color}1f`, color: STATUS[row.status].color }}
                  >
                    {STATUS[row.status].label}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex h-[62px] items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-[#0a1421]">
            <img src="/iso/05.png" alt="" className="h-[54px] object-contain opacity-70" />
          </div>
        </div>

        <div className="w-[21%] shrink-0 border-l border-white/10 px-2 py-3">
          <p className="mb-2 px-1 text-[0.5rem] uppercase tracking-[0.1em] text-white/35">Листы</p>
          {section.sheets.map((s) => (
            <div key={s.code} className="mb-1.5 rounded-md border border-white/10 px-2 py-1.5">
              <p className="text-[0.52rem] text-white/80">{s.code}</p>
              <p className="truncate text-[0.48rem] text-white/40">{s.name}</p>
            </div>
          ))}
          <div className="mt-3 border-t border-white/10 pt-2.5">
            <p className="text-[0.5rem] uppercase tracking-[0.1em] text-white/35">Сводка</p>
            {[
              ['Готовность', `${project.ready} %`],
              ['Бюджет', `${project.budget} %`],
              ['Замечаний', String(project.issues)],
            ].map(([k, v]) => (
              <div key={k} className="mt-1.5 flex items-center justify-between gap-1">
                <span className="text-[0.5rem] text-white/40">{k}</span>
                <span className="text-[0.52rem] tabular-nums text-white/80">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-3 py-2.5">
        {CHAT.map((m) => (
          <div key={m.who} className="mb-2 flex items-start gap-2 last:mb-0">
            <span
              className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md"
              style={{ background: m.accent ? '#2f6df6' : 'rgba(255,255,255,.12)' }}
            >
              <Icon name={m.icon} size={9} className={m.accent ? 'text-white' : 'text-white/80'} />
            </span>
            <p className="text-[0.55rem] leading-snug text-white/65">
              <span className="text-white/85">{m.who}:</span> {m.text}
            </p>
          </div>
        ))}
        <div className="mt-2 flex items-center gap-2 rounded-full border border-white/12 px-3 py-1.5">
          <span className="flex-1 text-[0.53rem] text-white/30">Написать в рабочий чат…</span>
          <Icon name="Send" size={10} className="text-white/45" />
        </div>
      </div>
    </div>
  );
};

export default CabinetDemo;
