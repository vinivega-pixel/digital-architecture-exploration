import Icon from '@/components/ui/icon';
import Reveal from './Reveal';
import CabinetDemo from './CabinetDemo';
import { stages } from '@/data/stages';
import { stageShort } from '@/data/stageShort';

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
          <p className="mb-4 text-center text-[0.82rem] text-white/45">
            Живое демо рабочего окна — переключайте проекты, разделы и события
          </p>
          <div className="hidden md:block">
            <CabinetDemo />
          </div>
          <div className="md:hidden">
            <CabinetDemo compact />
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default Workspace;