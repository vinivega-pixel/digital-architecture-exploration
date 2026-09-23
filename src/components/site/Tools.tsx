import { useState } from 'react';
import Icon from '@/components/ui/icon';
import Reveal from './Reveal';
import { scrollTo } from './Header';

const CARDS = [
  {
    icon: 'Calculator',
    title: 'Рассчитать',
    text: 'Инженерные и строительные расчёты. Более ста инструментов по всем этапам.',
    to: 'path',
  },
  {
    icon: 'ShieldCheck',
    title: 'Проверить',
    text: 'СП, ГОСТ, нормативные требования и исходные данные — сверка без ручного поиска.',
    to: 'ai',
  },
  {
    icon: 'FileText',
    title: 'Создать',
    text: 'Документы, задания, программы, журналы и другие материалы по готовым формам.',
    to: 'path',
  },
  {
    icon: 'Users',
    title: 'Спроектировать',
    text: 'Профессиональное проектирование и инженерное сопровождение силами института.',
    to: 'premium',
  },
];

const Tools = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="tools" className="scroll-mt-20 bg-background py-20 md:py-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,3fr)] lg:gap-12">
          <Reveal>
            <h2 className="font-display text-[1.7rem] leading-[1.15] text-foreground md:text-[2.1rem]">
              Что вы можете сделать в ЦИФРЕ
            </h2>
            <p className="mt-4 text-[0.9rem] leading-[1.7] text-muted-foreground">
              Инструменты, нормативы, документы и услуги для всех этапов строительного проекта.
            </p>
            <button
              onClick={() => scrollTo('path')}
              className="mt-5 flex items-center gap-2 text-[0.88rem] font-medium text-primary"
            >
              Все возможности
              <Icon name="ArrowRight" size={15} />
            </button>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {CARDS.map((c, i) => {
              const on = active === i;
              return (
                <Reveal key={c.title} delay={i * 70}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => scrollTo(c.to)}
                    className={`flex h-full w-full flex-col rounded-2xl p-7 text-left transition-colors duration-300 ${
                      on ? 'bg-[hsl(var(--ink))] text-white' : 'bg-card text-foreground hover:bg-secondary'
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        on ? 'bg-white/10' : 'bg-background'
                      }`}
                    >
                      <Icon name={c.icon} size={20} className={on ? 'text-white' : 'text-foreground'} />
                    </span>
                    <p className="mt-6 font-display text-[1.15rem]">{c.title}</p>
                    <p className={`mt-3 flex-1 text-[0.84rem] leading-[1.65] ${on ? 'text-white/65' : 'text-muted-foreground'}`}>
                      {c.text}
                    </p>
                    <Icon name="ArrowRight" size={16} className={`mt-6 ${on ? 'text-white' : 'text-muted-foreground'}`} />
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tools;
