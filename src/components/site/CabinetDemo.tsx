import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import MiniCalendar from './cabinet/MiniCalendar';
import MoneyDonut from './cabinet/MoneyDonut';
import SheetView from './cabinet/SheetView';
import { archive, projects, tools, type RowStatus } from '@/data/cabinet';
import { stages } from '@/data/stages';
import { stageShort } from '@/data/stageShort';

const STATUS: Record<RowStatus, { color: string; label: string }> = {
  ok: { color: '#34d399', label: 'Готово' },
  wait: { color: '#8fb4ff', label: 'В работе' },
  risk: { color: '#f2a65a', label: 'Внимание' },
};

const CHAT_STYLE = {
  crm: { icon: 'Users', bg: 'rgba(255,255,255,.14)', mine: false },
  ai: { icon: 'Sparkles', bg: '#2f6df6', mine: false },
  eng: { icon: 'HardHat', bg: 'rgba(52,211,153,.24)', mine: true },
  doc: { icon: 'FileSignature', bg: 'rgba(242,166,90,.26)', mine: false },
  buh: { icon: 'Receipt', bg: 'rgba(168,140,255,.26)', mine: false },
} as const;

/** Живое демо рабочего окна кабинета: проекты, этапы, разделы, финансы и чат. */
const CabinetDemo = ({ compact = false }: { compact?: boolean }) => {
  const [projectIdx, setProjectIdx] = useState(0);
  const [sectionId, setSectionId] = useState('pd');
  const [eventIdx, setEventIdx] = useState(1);
  const [stageIdx, setStageIdx] = useState(projects[0].stage);
  const [saved, setSaved] = useState(false);
  const [hint, setHint] = useState(false);
  const [archOpen, setArchOpen] = useState(false);

  const project = projects[projectIdx];
  const section = project.sections.find((s) => s.id === sectionId) ?? project.sections[0];
  const event = project.events[eventIdx] ?? project.events[0];
  const report = project.report;

  useEffect(() => {
    setStageIdx(project.stage);
    setEventIdx(0);
  }, [project]);

  useEffect(() => {
    const t = setTimeout(() => setHint(true), 2600);
    return () => clearTimeout(t);
  }, []);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  const done = stageIdx < project.stage;
  const stageName = stageShort[stages[stageIdx].id] ?? stages[stageIdx].phase;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-[#0d1928] shadow-[0_30px_80px_-30px_rgba(0,0,0,.8)]">
      <div className="border-b border-white/10 px-3 py-2.5 md:px-4 md:py-3">
        <div className="flex items-center gap-[3px]">
          {stages.map((s, i) => {
            const isDone = i < project.stage;
            const isNow = i === project.stage;
            const picked = i === stageIdx;
            return (
              <button key={s.id} onClick={() => setStageIdx(i)} className="min-w-0 flex-1 text-left" aria-label={stageShort[s.id] ?? s.phase}>
                <span
                  className="block h-[5px] w-full rounded-full transition-all duration-300"
                  style={{
                    background: isDone ? '#34d399' : isNow ? '#2f6df6' : 'rgba(255,255,255,.14)',
                    transform: picked ? 'scaleY(1.8)' : 'none',
                  }}
                />
                {!compact ? (
                  <span
                    className="mt-1 block truncate text-[0.52rem] transition-colors duration-300"
                    style={{ color: picked ? '#fff' : isDone ? '#34d399b8' : isNow ? '#8fb4ff' : 'rgba(255,255,255,.3)' }}
                  >
                    {stageShort[s.id] ?? s.phase}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2">
          <div className="flex items-center gap-1.5">
            <Icon name={done ? 'CircleCheck' : 'Clock'} size={11} className="shrink-0" style={{ color: done ? '#34d399' : '#8fb4ff' }} />
            <p className="truncate text-[0.56rem] text-white/85">
              {stageName}: {done ? report.verdict : 'этап в работе — данные накапливаются'}
            </p>
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-4">
            {[
              ['Стоимость факт', report.cost, report.costNote],
              ['Документация', report.docs, 'передана заказчику'],
              ['Срок', report.term, report.termNote],
              ['Замечаний', done ? 'нет' : String(project.issues), done ? 'этап закрыт' : 'в работе'],
            ].map(([k, v, n]) => (
              <div key={k}>
                <p className="text-[0.46rem] uppercase tracking-[0.06em] text-white/35">{k}</p>
                <p className="text-[0.55rem] text-white/85">{v}</p>
                <p className="truncate text-[0.45rem] text-white/40">{n}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <div
            className="flex min-w-0 flex-1 items-start gap-2 rounded-lg border px-2.5 py-2 transition-colors duration-300"
            style={{ borderColor: `${event.tone}4d`, background: `${event.tone}1a` }}
          >
            <Icon name={event.icon} size={11} className="mt-0.5 shrink-0" style={{ color: event.tone }} />
            <p className="text-[0.56rem] leading-snug text-white/75">{event.text}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {project.events.map((e, i) => (
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

      <div className={compact ? 'block' : 'flex'}>
        <div className={compact ? 'border-b border-white/10 px-3 py-2.5' : 'w-[15%] shrink-0 border-r border-white/10 px-2 py-3'}>
          <p className="mb-1.5 px-1 text-[0.5rem] uppercase tracking-[0.1em] text-white/35">Проекты</p>
          <div className={compact ? 'flex gap-2 overflow-x-auto pb-1' : ''}>
            {projects.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setProjectIdx(i)}
                className={`rounded-md px-2 py-1.5 text-left text-[0.53rem] leading-tight transition-colors ${
                  compact ? 'shrink-0 whitespace-nowrap' : 'mb-1 block w-full'
                } ${i === projectIdx ? 'bg-white/[0.12] text-white' : 'text-white/45 hover:text-white/75'}`}
              >
                {p.name}
                <span className="block text-[0.45rem] text-white/35">{p.place}</span>
              </button>
            ))}
          </div>
          <div className={compact ? 'mt-2' : 'mt-2.5 border-t border-white/10 pt-2'}>
            <button
              onClick={() => setArchOpen((v) => !v)}
              className="flex w-full items-center gap-1 px-1 text-[0.5rem] uppercase tracking-[0.1em] text-white/35 transition-colors hover:text-white/60"
            >
              <Icon name={archOpen ? 'ChevronDown' : 'ChevronRight'} size={9} />
              Архив · выполнено {archive.length}
            </button>
            {archOpen ? (
              <div className={compact ? 'mt-1.5 flex gap-2 overflow-x-auto pb-1' : 'mt-1.5'}>
                {archive.map((a) => (
                  <div
                    key={a.name}
                    className={`rounded-md px-2 py-1 ${compact ? 'shrink-0 whitespace-nowrap' : 'mb-[3px]'}`}
                  >
                    <p className="flex items-center gap-1 text-[0.5rem] leading-tight text-white/55">
                      <Icon name="CircleCheck" size={8} className="shrink-0 text-[#34d399]" />
                      {a.name}
                    </p>
                    <p className="pl-[13px] text-[0.44rem] text-white/30">
                      {a.kind} · {a.year}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className={compact ? 'mt-2.5' : 'mt-2.5 space-y-1 border-t border-white/10 pt-2.5'}>
            <button onClick={save} className="flex w-full items-center gap-1 rounded-md bg-[#2f6df6] px-1.5 py-1.5 text-[0.53rem] text-white transition-opacity hover:opacity-90">
              <Icon name={saved ? 'Check' : 'Save'} size={9} />
              {saved ? 'Сохранено' : 'Сохранить'}
            </button>
            <button className="flex w-full items-center gap-1 rounded-md px-1.5 py-1.5 text-[0.53rem] text-white/45 hover:text-white/75">
              <Icon name="Download" size={9} />
              Выгрузить
            </button>

            <div className={compact ? 'flex gap-1.5 overflow-x-auto pb-1' : 'border-t border-white/10 pt-1.5'}>
              {tools.map((t) => (
                <button
                  key={t.label}
                  className={`flex items-center gap-1.5 rounded-md px-1.5 py-[5px] text-left text-[0.5rem] leading-tight transition-colors hover:bg-white/[0.06] ${
                    compact ? 'shrink-0 whitespace-nowrap' : 'w-full'
                  } ${t.tone === 'urgent' ? 'text-[#f2a65a]' : 'text-white/55'}`}
                >
                  <Icon name={t.icon} size={9} className="shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{t.label}</span>
                  {t.badge ? (
                    <span
                      className="shrink-0 rounded-full px-1 text-[0.42rem] leading-[13px] text-white"
                      style={{ background: t.tone === 'urgent' ? '#f2624a' : '#2f6df6' }}
                    >
                      {t.badge}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={compact ? 'border-b border-white/10 px-3 py-2.5' : 'w-[19%] shrink-0 border-r border-white/10 px-2 py-3'}>
          <div className={compact ? 'flex gap-1.5 overflow-x-auto pb-1' : ''}>
            {project.sections.map((m) => (
              <button
                key={m.id}
                onClick={() => setSectionId(m.id)}
                className={`flex items-center gap-1.5 rounded-md px-2 py-[7px] text-left text-[0.55rem] leading-tight transition-colors ${
                  compact ? 'shrink-0 whitespace-nowrap' : 'mb-[3px] w-full'
                } ${m.id === sectionId ? 'bg-white/[0.1] text-white' : 'text-white/50 hover:text-white/80'}`}
              >
                <Icon name={m.icon} size={10} className="shrink-0" />
                <span className="truncate">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0 flex-1 px-3 py-3">
          <p className="text-[0.55rem] text-white/40">
            {project.name} · {section.label}
          </p>
          <div className="mt-2 space-y-1.5">
            {section.rows.map((row) => (
              <div key={row.title} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-2">
                <div className="flex items-start gap-2">
                  <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: STATUS[row.status].color }} />
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

          {sectionId === 'pd' ? (
            <div className="mt-2 space-y-1.5">
              <p className="text-[0.5rem] uppercase tracking-[0.1em] text-white/35">Файлы во вложении</p>
              {project.files.map((fl) => (
                <button
                  key={fl.name}
                  className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1.5 text-left transition-colors hover:border-white/25"
                >
                  <Icon name="Paperclip" size={10} className="shrink-0 text-white/40" />
                  <span className="min-w-0 flex-1 truncate text-[0.52rem] text-white/80">{fl.name}</span>
                  <span className="shrink-0 text-[0.46rem] text-white/40">
                    {fl.kind} · {fl.size}
                  </span>
                </button>
              ))}
              <SheetView sheet={project.sheet} project={project.name} />
            </div>
          ) : null}
        </div>

        <div className={compact ? 'border-t border-white/10 px-3 py-3' : 'w-[25%] shrink-0 border-l border-white/10 px-2.5 py-3'}>
          <div className={compact ? 'grid gap-4 sm:grid-cols-2' : 'space-y-3.5'}>
            <div>
              <p className="mb-1.5 text-[0.5rem] uppercase tracking-[0.1em] text-white/35">Текущие задачи</p>
              {project.tasks.map((t) => (
                <div key={t.title} className="mb-1 flex items-start gap-1.5">
                  <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: STATUS[t.status].color }} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.5rem] text-white/80">{t.title}</p>
                    <p className="truncate text-[0.45rem] text-white/40">
                      {t.who} · {t.due}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="mb-1.5 text-[0.5rem] uppercase tracking-[0.1em] text-white/35">График оплат</p>
              {project.payments.map((p) => (
                <div key={p.name} className="mb-1 flex items-center gap-1.5">
                  <Icon name={p.done ? 'CircleCheck' : 'Circle'} size={9} className="shrink-0" style={{ color: p.done ? '#34d399' : 'rgba(255,255,255,.3)' }} />
                  <span className="min-w-0 flex-1 truncate text-[0.48rem] text-white/60">{p.name}</span>
                  <span className="shrink-0 text-[0.48rem] tabular-nums text-white/80">{p.sum}</span>
                </div>
              ))}
            </div>

            <div>
              <p className="mb-1.5 text-[0.5rem] uppercase tracking-[0.1em] text-white/35">Движение денежных средств</p>
              <MoneyDonut items={project.money} />
            </div>

            <div>
              <MiniCalendar data={project.calendar} />
            </div>

            <div>
              <p className="mb-1 text-[0.5rem] uppercase tracking-[0.1em] text-white/35">Сводка</p>
              {[
                ['Готовность', `${project.ready} %`],
                ['Бюджет освоен', `${project.budget} %`],
                ['Замечаний', String(project.issues)],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-1 py-[2px]">
                  <span className="text-[0.5rem] text-white/40">{k}</span>
                  <span className="text-[0.52rem] tabular-nums text-white/80">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-3 py-2.5">
        <div className={compact ? 'space-y-3' : 'flex gap-3'}>
          <div className={compact ? '' : 'w-1/2 shrink-0'}>
            <div className="space-y-2">
              {project.chat.map((m) => {
                const st = CHAT_STYLE[m.role];
                return (
                  <div key={m.who + m.time} className={`flex items-end gap-2 ${st.mine ? 'flex-row-reverse' : ''}`}>
                    <span className="mb-1 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full" style={{ background: st.bg }}>
                      <Icon name={st.icon} size={9} className="text-white" />
                    </span>
                    <div
                      className={`max-w-[84%] rounded-2xl px-2.5 py-1.5 ${st.mine ? 'rounded-br-md' : 'rounded-bl-md'}`}
                      style={{ background: st.mine ? 'rgba(52,211,153,.14)' : 'rgba(255,255,255,.06)' }}
                    >
                      <p className="text-[0.46rem] text-white/45">{m.who}</p>
                      <p className="mt-0.5 text-[0.53rem] leading-snug text-white/80">{m.text}</p>
                      {m.file ? (
                        <span className="mt-1 flex items-center gap-1 rounded-md border border-white/12 px-1.5 py-1">
                          <Icon name="FileText" size={8} className="shrink-0 text-white/50" />
                          <span className="truncate text-[0.46rem] text-white/60">{m.file}</span>
                        </span>
                      ) : null}
                      <p className={`mt-0.5 text-[0.42rem] text-white/30 ${st.mine ? 'text-right' : ''}`}>{m.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-2 flex items-center gap-2 rounded-full border border-white/12 px-3 py-1.5">
              <span className="flex-1 text-[0.53rem] text-white/30">Написать в рабочий чат…</span>
              <Icon name="Send" size={10} className="text-white/45" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <button className="flex w-full items-center gap-2 rounded-lg border border-dashed border-white/20 px-3 py-2 text-left transition-colors hover:border-[#2f6df6]">
              <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#2f6df6]">
                <Icon name="UserPlus" size={11} className="text-white" />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.55rem] text-white/85">Пригласить в чат</span>
                <span className="block text-[0.46rem] text-white/40">заказчик, подрядчик, смежник или эксперт</span>
              </span>
            </button>

            <div className="mt-2 overflow-hidden rounded-lg border border-white/10 bg-[#0a1421]">
              <img
                src={project.board}
                alt={`Модель объекта ${project.name}`}
                className="block w-full object-cover"
                style={{ height: compact ? 130 : 168 }}
              />
              <div className="flex items-center justify-between gap-2 px-2.5 py-1.5">
                <span className="truncate text-[0.5rem] text-white/60">Модель · {project.name}</span>
                <span className="flex shrink-0 items-center gap-1 text-[0.46rem] text-white/40">
                  <Icon name="Box" size={8} />
                  3D
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {hint ? (
        <div className="pointer-events-none absolute right-3 top-[52%] max-w-[260px] animate-fade-in rounded-xl border border-[#34d39959] bg-[#0f2320f2] p-3 shadow-[0_18px_40px_-14px_rgba(0,0,0,.8)] backdrop-blur-sm">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#34d399]">
              <Icon name="TrendingDown" size={11} className="text-[#0f2320]" />
            </span>
            <div className="min-w-0">
              <p className="text-[0.55rem] leading-snug text-white/85">{project.hint.text}</p>
              <p className="mt-1 truncate text-[0.48rem] text-white/45">{project.hint.source}</p>
              <p className="mt-1 text-[0.52rem] font-medium text-[#34d399]">{project.hint.save}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CabinetDemo;
