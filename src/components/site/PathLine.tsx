import Icon from '@/components/ui/icon';
import Reveal from './Reveal';
import { stages } from '@/data/stages';
import { stageShort } from '@/data/stageShort';
import { openStage } from '@/lib/openStage';

/** Изометрическая иконка подбирается по смыслу этапа. */
const ICONS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];

const CHIPS = [
  { icon: 'Calculator', label: 'Расчёты' },
  { icon: 'FileText', label: 'Документы' },
  { icon: 'BookOpen', label: 'Нормы' },
  { icon: 'Briefcase', label: 'Услуги' },
  { icon: 'Sparkles', label: 'ИИ-инструменты' },
];

const PathLine = () => (
  <section id="path" className="scroll-mt-20 border-y border-border bg-card py-20 md:py-24">
    <div className="mx-auto max-w-[1400px] px-5 md:px-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,3fr)] lg:gap-12">
        <Reveal>
          <h2 className="font-display text-[1.7rem] leading-[1.15] text-foreground md:text-[2.1rem]">
            Весь строительный путь в одной системе
          </h2>
          <p className="mt-4 text-[0.9rem] leading-[1.7] text-muted-foreground">
            От участка до эксплуатации — все одиннадцать этапов в единой цифровой среде.
          </p>
          <button
            onClick={() => openStage('premium')}
            className="mt-5 flex items-center gap-2 text-[0.88rem] font-medium text-primary"
          >
            Подробнее о системе
            <Icon name="ArrowRight" size={15} />
          </button>
        </Reveal>

        <div>
          <div className="-mx-5 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
            <div className="flex min-w-[900px] items-start gap-1">
              {stages.map((s, i) => (
                <div key={s.id} className="flex flex-1 items-start">
                  <button onClick={() => openStage(s.id)} className="group flex-1 text-center">
                    <span className="flex h-[92px] items-center justify-center">
                      <img
                        src={`/iso/${ICONS[i]}.png`}
                        alt=""
                        className="h-[82px] object-contain transition-transform duration-300 group-hover:-translate-y-1"
                      />
                    </span>
                    <span className="mt-2 block text-[0.74rem] tabular-nums text-muted-foreground">{s.num}</span>
                    <span className="mt-1 block px-1 text-[0.76rem] leading-snug text-foreground group-hover:text-primary">
                      {stageShort[s.id] ?? s.phase}
                    </span>
                  </button>
                  {i < stages.length - 1 ? (
                    <Icon name="ChevronRight" size={14} className="mt-[42px] shrink-0 text-border" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6">
            <span className="text-[0.78rem] text-muted-foreground">На каждом этапе:</span>
            {CHIPS.map((c) => (
              <span key={c.label} className="flex items-center gap-2 text-[0.82rem] text-foreground">
                <Icon name={c.icon} size={15} className="text-primary" />
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default PathLine;
