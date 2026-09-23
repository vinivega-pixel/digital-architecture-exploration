import Icon from '@/components/ui/icon';
import Reveal from './Reveal';
import { stages } from '@/data/stages';
import { stageShort } from '@/data/stageShort';

const LEFT_MENU = [
  { icon: 'Users', label: 'CRM' },
  { icon: 'Briefcase', label: 'Заказчики' },
  { icon: 'HardHat', label: 'Исполнители' },
  { icon: 'FileSignature', label: 'Договоры и акты' },
  { icon: 'FileText', label: 'Проектная документация' },
  { icon: 'ClipboardCheck', label: 'Исполнительная документация' },
];

const RIGHT_SHEETS = [
  { code: 'АР-12', name: 'План кровли' },
  { code: 'КР-07', name: 'Узлы примыкания' },
  { code: 'ИОС4-3', name: 'Схема отопления' },
];

const PROJECTS = ['ЖК «Северный»', 'Склад №4', 'Школа на 550 мест'];

/** Макет рабочего окна личного кабинета строителя. */
const CabinetMock = () => (
  <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#0d1928] shadow-[0_30px_80px_-30px_rgba(0,0,0,.8)]">
    {/* Верх: временная линия проекта */}
    <div className="border-b border-white/10 px-4 py-3">
      <div className="flex items-center gap-1">
        {stages.map((s, i) => {
          const done = i < 6;
          const now = i === 6;
          return (
            <div key={s.id} className="flex flex-1 items-center gap-1">
              <div className="min-w-0 flex-1">
                <div
                  className="h-[5px] w-full rounded-full"
                  style={{ background: done ? '#34d399' : now ? '#2f6df6' : 'rgba(255,255,255,.14)' }}
                />
                <p
                  className="mt-1 truncate text-[0.52rem]"
                  style={{ color: done ? '#34d399b8' : now ? '#8fb4ff' : 'rgba(255,255,255,.32)' }}
                >
                  {stageShort[s.id] ?? s.phase}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2.5 flex items-start gap-2 rounded-lg border border-[#2f6df64d] bg-[#2f6df61a] px-2.5 py-2">
        <Icon name="Bell" size={11} className="mt-0.5 shrink-0 text-[#8fb4ff]" />
        <p className="text-[0.58rem] leading-snug text-white/75">
          Завтра утром: отправить Калайтанову Д. В. уведомление о поставке материала по заявке №45 «Утепление кровли»
        </p>
      </div>
    </div>

    <div className="flex">
      {/* Мини-панель проектов */}
      <div className="w-[16%] shrink-0 border-r border-white/10 px-2 py-3">
        <p className="mb-2 px-1 text-[0.5rem] uppercase tracking-[0.1em] text-white/35">Проекты</p>
        {PROJECTS.map((p, i) => (
          <div
            key={p}
            className={`mb-1 rounded-md px-1.5 py-1.5 text-[0.53rem] leading-tight ${
              i === 0 ? 'bg-white/[0.12] text-white' : 'text-white/45'
            }`}
          >
            {p}
          </div>
        ))}
        <div className="mt-3 space-y-1 border-t border-white/10 pt-2.5">
          <div className="flex items-center gap-1 rounded-md bg-[#2f6df6] px-1.5 py-1.5 text-[0.53rem] text-white">
            <Icon name="Save" size={9} />
            Сохранить
          </div>
          <div className="flex items-center gap-1 rounded-md px-1.5 py-1.5 text-[0.53rem] text-white/45">
            <Icon name="Download" size={9} />
            Выгрузить
          </div>
        </div>
      </div>

      {/* Левая панель разделов */}
      <div className="w-[22%] shrink-0 border-r border-white/10 px-2 py-3">
        {LEFT_MENU.map((m, i) => (
          <div
            key={m.label}
            className={`mb-[3px] flex items-center gap-1.5 rounded-md px-2 py-[7px] text-[0.55rem] leading-tight ${
              i === 3 ? 'bg-white/[0.1] text-white' : 'text-white/50'
            }`}
          >
            <Icon name={m.icon} size={10} className="shrink-0" />
            <span className="truncate">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Рабочее окно */}
      <div className="min-w-0 flex-1 px-3 py-3">
        <p className="text-[0.55rem] text-white/40">Рабочее окно · Договоры и акты</p>
        <div className="mt-2 flex h-[128px] items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-[#0a1421]">
          <img src="/iso/08.png" alt="" className="h-[108px] object-contain opacity-80" />
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {['КС-2 №14', 'КС-3 №14', 'Акт СР №61'].map((t) => (
            <div key={t} className="rounded-md border border-white/10 px-2 py-1.5 text-[0.5rem] text-white/55">
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* Правая панель листов */}
      <div className="w-[21%] shrink-0 border-l border-white/10 px-2 py-3">
        <p className="mb-2 px-1 text-[0.5rem] uppercase tracking-[0.1em] text-white/35">Листы</p>
        {RIGHT_SHEETS.map((s) => (
          <div key={s.code} className="mb-1.5 rounded-md border border-white/10 px-2 py-1.5">
            <p className="text-[0.52rem] text-white/80">{s.code}</p>
            <p className="truncate text-[0.48rem] text-white/40">{s.name}</p>
          </div>
        ))}
        <div className="mt-3 border-t border-white/10 pt-2.5">
          <p className="text-[0.5rem] uppercase tracking-[0.1em] text-white/35">Сводка</p>
          {[
            ['Готовность', '64 %'],
            ['Бюджет', '82 %'],
            ['Замечаний', '3'],
          ].map(([k, v]) => (
            <div key={k} className="mt-1.5 flex items-center justify-between gap-1">
              <span className="text-[0.5rem] text-white/40">{k}</span>
              <span className="text-[0.52rem] tabular-nums text-white/80">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Низ: диалог с ИИ и инженером */}
    <div className="border-t border-white/10 px-3 py-2.5">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md bg-[#2f6df6]">
          <Icon name="Sparkles" size={9} className="text-white" />
        </span>
        <p className="text-[0.55rem] leading-snug text-white/65">
          <span className="text-white/85">ИИ:</span> В акте КС-2 №14 объём утеплителя на 8 % больше проектного. Проверьте
          ведомость АР-12.
        </p>
      </div>
      <div className="mt-2 flex items-start gap-2">
        <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md bg-white/12">
          <Icon name="HardHat" size={9} className="text-white/80" />
        </span>
        <p className="text-[0.55rem] leading-snug text-white/65">
          <span className="text-white/85">Инженер:</span> Расхождение из-за нахлёста по узлу КР-07 — согласовано, готовлю
          дополнение к акту.
        </p>
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-full border border-white/12 px-3 py-1.5">
        <span className="flex-1 text-[0.53rem] text-white/30">Написать в рабочий чат…</span>
        <Icon name="Send" size={10} className="text-white/45" />
      </div>
    </div>
  </div>
);

const ABILITIES = [
  { icon: 'Calculator', title: 'Рассчитать', text: 'Инженерные расчёты по всем этапам — более трёхсот инструментов.' },
  { icon: 'ShieldCheck', title: 'Проверить', text: 'Сверка решений с СП и ГОСТ без ручного поиска по нормам.' },
  { icon: 'FileText', title: 'Создать', text: 'Документы, задания, журналы и акты по готовым формам.' },
  { icon: 'Users', title: 'Спроектировать', text: 'Проектирование и инженерное сопровождение силами института.' },
];

/** Итоговый блок: возможности, полный путь и кабинет под контролем инженера. */
const Workspace = () => (
  <section id="workspace" className="scroll-mt-20 bg-[hsl(var(--ink))] py-20 text-white md:py-24">
    <div className="mx-auto max-w-[1400px] px-5 md:px-10">
      <Reveal>
        <div className="mx-auto max-w-[50em] text-center">
          <p className="text-[0.72rem] uppercase tracking-[0.18em] text-white/45">Всё вместе</p>
          <h2 className="mt-4 font-display text-[1.9rem] leading-[1.15] md:text-[2.7rem]">
            ИИ понимает стройку, а опытный инженер контролирует результат
          </h2>
          <p className="mt-5 text-[0.95rem] leading-[1.8] text-white/60">
            Расчёты, нормы, документы и весь путь объекта — от участка до эксплуатации — живут в одном рабочем окне.
            Машина считает и проверяет, инженер института принимает решения и ставит подпись.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ABILITIES.map((a, i) => (
          <Reveal key={a.title} delay={i * 70}>
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.08]">
                <Icon name={a.icon} size={18} className="text-white" />
              </span>
              <p className="mt-5 font-display text-[1.1rem]">{a.title}</p>
              <p className="mt-2.5 text-[0.82rem] leading-[1.65] text-white/55">{a.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5">
          <span className="text-[0.8rem] text-white/45">Весь путь в одной системе:</span>
          {stages.map((s, i) => (
            <span key={s.id} className="flex items-center gap-3">
              <span className="text-[0.8rem] text-white/75">{stageShort[s.id] ?? s.phase}</span>
              {i < stages.length - 1 ? <Icon name="ChevronRight" size={12} className="text-white/25" /> : null}
            </span>
          ))}
        </div>
      </Reveal>

      <Reveal delay={180}>
        <div className="mt-10">
          <p className="mb-4 text-center text-[0.82rem] text-white/45">Так выглядит рабочее окно кабинета</p>
          <CabinetMock />
        </div>
      </Reveal>
    </div>
  </section>
);

export default Workspace;
