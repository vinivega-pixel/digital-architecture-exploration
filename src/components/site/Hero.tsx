import type { ReactNode } from 'react';
import Icon from '@/components/ui/icon';
import { useUi } from '@/context/UiContext';
import { scrollTo } from './Header';

const TAGS = ['Расчёты', 'Нормы', 'Документы', 'Проектирование'];

const PANEL_ROWS = [
  { icon: 'FolderOpen', label: 'Проект' },
  { icon: 'Calculator', label: 'Расчёты' },
  { icon: 'BookOpen', label: 'Нормы' },
  { icon: 'FileText', label: 'Документы' },
  { icon: 'Box', label: '3D-модель' },
  { icon: 'ChartColumn', label: 'Аналитика' },
  { icon: 'Sparkles', label: 'ИИ-помощник' },
];

const LOADS = [
  ['Постоянная нагрузка', '512 кН'],
  ['Временная нагрузка', '248 кН'],
  ['Снеговая нагрузка', '186 кН'],
  ['Ветровая нагрузка', '132 кН'],
];

const Glass = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div
    className={`rounded-2xl border border-white/15 bg-[#0e1a2bcc] p-3.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,.7)] backdrop-blur-md ${className}`}
  >
    {children}
  </div>
);

const Hero = () => {
  const { openAuth } = useUi();

  return (
    <section id="hero" className="relative min-h-[100svh] overflow-hidden bg-[#0b1420]">
      <img
        src="/hero-city.jpg"
        alt="Вечерний вид современного жилого района у реки"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: 'center 60%' }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(110deg, #08111c 0%, #08111cf2 34%, #0a1524c4 58%, #0a152480 100%)' }}
      />

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1400px] items-center gap-12 px-5 pb-16 pt-28 md:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:pt-24">
        <div className="animate-fade-in">
          <p className="text-[0.72rem] uppercase tracking-[0.18em] text-white/55">Цифровая среда для строительства</p>
          <h1 className="mt-5 font-display text-[2.1rem] leading-[1.08] text-white sm:text-[2.9rem] lg:text-[3.4rem]">
            Всё, что нужно для строительного проекта — в одной системе
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
            {TAGS.map((t, i) => (
              <span key={t} className="flex items-center gap-3 text-[0.9rem] text-white/75">
                {t}
                {i < TAGS.length - 1 ? <span className="text-white/30">·</span> : null}
              </span>
            ))}
          </div>

          <p className="mt-6 max-w-[34em] text-[0.95rem] leading-[1.75] text-white/65">
            От выбора участка до ввода в эксплуатацию — все инструменты и профессиональные решения для строительного
            проекта в одной системе.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              onClick={() => openAuth('register')}
              className="flex items-center gap-2.5 rounded-full bg-white px-7 py-4 text-[0.88rem] font-medium text-[#0f1d2e] transition-opacity hover:opacity-90"
            >
              Начать работу
              <Icon name="ArrowRight" size={16} />
            </button>
            <button
              onClick={() => scrollTo('tools')}
              className="rounded-full border border-white/30 px-7 py-4 text-[0.88rem] text-white transition-colors hover:bg-white/10"
            >
              Посмотреть инструменты
            </button>
          </div>
        </div>

        <div className="relative hidden animate-fade-in lg:block [animation-delay:200ms]">
          <Glass className="ml-auto w-[88%] translate-y-[-34px]">
            <div className="flex gap-3">
              <div className="w-[32%] shrink-0">
                <p className="mb-2 flex items-center gap-1.5 px-1 text-[0.62rem] font-medium text-white/80">
                  <Icon name="Hexagon" size={11} />
                  ЦИФРА
                </p>
                {PANEL_ROWS.map((r, i) => (
                  <div
                    key={r.label}
                    className={`mb-[3px] flex items-center gap-1.5 rounded-lg px-2 py-[6px] text-[0.62rem] ${
                      i === 0 ? 'bg-white/[0.12] text-white' : 'text-white/55'
                    }`}
                  >
                    <Icon name={r.icon} size={10} />
                    {r.label}
                  </div>
                ))}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex h-[190px] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#0c1826]">
                  <img src="/iso/06.png" alt="" className="h-[155px] object-contain opacity-90" />
                </div>
              </div>

              <div className="w-[29%] shrink-0 space-y-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
                  <p className="mb-2 text-[0.6rem] font-medium text-white/85">Расчёт нагрузок</p>
                  {LOADS.map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-2 py-[3px]">
                      <span className="truncate text-[0.55rem] text-white/50">{k}</span>
                      <span className="shrink-0 text-[0.58rem] tabular-nums text-white/90">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
                  <p className="mb-1.5 text-[0.6rem] font-medium text-white/85">Нормативная база</p>
                  <div className="flex items-center gap-1.5 rounded-md bg-white/[0.06] px-2 py-1.5">
                    <Icon name="BookOpen" size={10} className="text-white/60" />
                    <span className="text-[0.55rem] text-white/70">СП 20.13330</span>
                  </div>
                </div>
              </div>
            </div>
          </Glass>

          <Glass className="absolute -left-4 top-[calc(100%-18px)] w-[46%]">
            <p className="mb-2 flex items-center gap-1.5 text-[0.62rem] font-medium text-white/85">
              <Icon name="Sparkles" size={11} className="text-primary" />
              ИИ-ассистент
            </p>
            <p className="rounded-lg bg-white/[0.06] px-2.5 py-2 text-[0.6rem] leading-relaxed text-white/70">
              Проверить соответствие проектной документации требованиям СП и ГОСТ
            </p>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 px-2.5 py-2">
              <Icon name="FileText" size={11} className="text-white/50" />
              <span className="flex-1 truncate text-[0.58rem] text-white/60">Проектная документация.pdf</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary">
                <Icon name="ArrowUp" size={10} className="text-white" />
              </span>
            </div>
          </Glass>
        </div>
      </div>
    </section>
  );
};

export default Hero;
