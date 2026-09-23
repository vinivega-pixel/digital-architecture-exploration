import { useState } from 'react';
import Icon from '@/components/ui/icon';
import Reveal from './Reveal';
import LibraryModal from './LibraryModal';
import ArchiveModal from './ArchiveModal';
import { scrollTo } from './Header';

const QUICK = ['СП 20.13330', 'расчёт свай', 'ТЗ на изыскания', 'нагрузка на фундамент'];

const Knowledge = () => {
  const [lib, setLib] = useState(false);
  const [archive, setArchive] = useState(false);
  const [q, setQ] = useState('');

  const CARDS = [
    { icon: 'BookOpen', title: 'Нормы', text: 'СП, ГОСТ, приказы и законы', fn: () => setLib(true) },
    { icon: 'FileText', title: 'Документы', text: 'Шаблоны и формы', fn: () => setArchive(true) },
    { icon: 'Calculator', title: 'Расчёты', text: 'Инженерные инструменты', fn: () => scrollTo('path') },
    { icon: 'Lightbulb', title: 'Методики', text: 'Рекомендации и справочники', fn: () => setLib(true) },
    { icon: 'GraduationCap', title: 'База знаний', text: 'Статьи и руководства', fn: () => setLib(true) },
  ];

  return (
    <section id="knowledge" className="scroll-mt-20 border-t border-border bg-card py-20 md:py-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.3fr)_minmax(0,1.5fr)] lg:gap-10">
          <Reveal>
            <h2 className="font-display text-[1.6rem] leading-[1.15] text-foreground md:text-[1.95rem]">
              База знаний ЦИФРЫ
            </h2>
            <p className="mt-4 text-[0.88rem] leading-[1.7] text-muted-foreground">
              Нормы, документы, расчёты, методики и справочники — всё в одном поиске.
            </p>
          </Reveal>

          <Reveal delay={90}>
            <div className="flex gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-full border border-border bg-background px-4">
                <Icon name="Search" size={16} className="shrink-0 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && setLib(true)}
                  placeholder="Что вам нужно найти?"
                  className="min-w-0 flex-1 bg-transparent py-3.5 text-[0.86rem] text-foreground outline-none"
                />
              </div>
              <button
                onClick={() => setLib(true)}
                aria-label="Найти"
                className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                <Icon name="Search" size={17} />
              </button>
            </div>

            <p className="mt-5 text-[0.76rem] text-muted-foreground">Популярные запросы:</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {QUICK.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setQ(t);
                    setLib(true);
                  }}
                  className="rounded-full border border-border bg-background px-4 py-2 text-[0.78rem] text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {t}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {CARDS.map((c) => (
                <button
                  key={c.title}
                  onClick={c.fn}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background px-3 py-5 text-center transition-colors hover:border-primary"
                >
                  <Icon name={c.icon} size={19} className="text-foreground" />
                  <span className="text-[0.82rem] font-medium text-foreground">{c.title}</span>
                  <span className="text-[0.68rem] leading-snug text-muted-foreground">{c.text}</span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <LibraryModal open={lib} onClose={() => setLib(false)} />
      <ArchiveModal open={archive} onClose={() => setArchive(false)} />
    </section>
  );
};

export default Knowledge;
