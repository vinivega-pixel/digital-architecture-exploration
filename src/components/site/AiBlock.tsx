import { useState } from 'react';
import Icon from '@/components/ui/icon';
import Reveal from './Reveal';
import AgentModal from './AgentModal';

const ABILITIES = [
  'Анализ документации',
  'Проверка нормативов',
  'Поиск противоречий',
  'Подготовка документов',
];

const AiBlock = () => {
  const [agent, setAgent] = useState(false);

  return (
    <section id="ai" className="scroll-mt-20 bg-[hsl(var(--ink))] py-20 md:py-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.3fr)]">
          <Reveal>
            <p className="text-[0.7rem] uppercase tracking-[0.18em] text-white/45">ИИ в ЦИФРЕ</p>
            <h2 className="mt-5 font-display text-[1.8rem] leading-[1.15] text-white md:text-[2.3rem]">
              ИИ, который понимает строительство
            </h2>
            <p className="mt-5 max-w-[30em] text-[0.92rem] leading-[1.75] text-white/60">
              Анализирует документы, проверяет нормы, находит противоречия и помогает принимать правильные решения.
            </p>
            <button
              onClick={() => setAgent(true)}
              className="mt-8 flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 text-[0.86rem] font-medium text-white transition-opacity hover:opacity-90"
            >
              Узнать больше
              <Icon name="ArrowRight" size={15} />
            </button>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid gap-6 sm:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] sm:items-center">
              <button
                onClick={() => setAgent(true)}
                className="rounded-2xl border border-white/12 bg-white/[0.04] p-5 text-left transition-colors hover:border-primary/60"
              >
                <p className="flex items-center gap-2 text-[0.78rem] font-medium text-white/85">
                  <Icon name="Sparkles" size={14} className="text-primary" />
                  ИИ-ассистент
                </p>
                <p className="mt-4 rounded-xl bg-white/[0.06] px-4 py-3.5 text-[0.82rem] leading-relaxed text-white/70">
                  Проверить соответствие проектной документации требованиям СП и ГОСТ
                </p>
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/12 px-4 py-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                    <Icon name="FileText" size={14} className="text-primary" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.78rem] text-white/80">Проектная документация.pdf</span>
                    <span className="block text-[0.68rem] text-white/40">2.4 МБ</span>
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                    <Icon name="ArrowUp" size={14} className="text-white" />
                  </span>
                </div>
              </button>

              <div>
                <p className="text-[0.8rem] font-medium text-white/85">Возможности:</p>
                <ul className="mt-4 space-y-3">
                  {ABILITIES.map((a) => (
                    <li key={a} className="flex items-start gap-2.5 text-[0.84rem] leading-snug text-white/65">
                      <Icon name="Check" size={14} className="mt-0.5 shrink-0 text-primary" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <AgentModal open={agent} onClose={() => setAgent(false)} />
    </section>
  );
};

export default AiBlock;
