import { useEffect, useState } from 'react';
import { stages } from '@/data/stages';
import { navLabels } from '@/data/stageLabels';

const StageNav = () => {
  const [active, setActive] = useState(-1);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const line = window.innerHeight * 0.4;
      let found = -1;
      stages.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) found = i;
      });
      setActive(found);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <nav aria-label="Этапы проекта" className="fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 md:block">
      <ul
        className="flex flex-col items-center gap-2 rounded-full px-2 py-3.5 shadow-[0_8px_28px_-10px_rgba(6,10,20,.55)] backdrop-blur-sm"
        style={{ background: 'rgba(243,238,226,.94)', border: '1px solid rgba(20,32,47,.10)' }}
      >
        {stages.map((s, i) => {
          const isActive = i === active;
          const label = navLabels[s.id] ?? s.phase;
          return (
            <li key={s.id} className="relative flex justify-center">
              <button
                onClick={() => go(s.id)}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                aria-label={`${s.phase}: ${s.title}`}
                aria-current={isActive}
                className="flex items-center justify-center overflow-hidden rounded-full transition-all duration-500 ease-out"
                style={{
                  width: isActive ? 22 : 6,
                  height: isActive ? 132 : 22,
                  background: s.palette.accent,
                  opacity: isActive ? 1 : hover === i ? 1 : 0.78,
                  boxShadow: isActive ? 'none' : 'inset 0 0 0 1px rgba(20,32,47,.22)',
                }}
              >
                <span
                  className="whitespace-nowrap text-[0.62rem] font-medium uppercase tracking-[0.16em] transition-opacity duration-300"
                  style={{
                    writingMode: 'vertical-rl',
                    color: s.palette.rightFg,
                    opacity: isActive ? 1 : 0,
                  }}
                >
                  {s.num} · {label}
                </span>
              </button>

              {hover === i && !isActive && (
                <span
                  className="pointer-events-none absolute left-[20px] top-1/2 z-10 -translate-y-1/2 whitespace-nowrap rounded px-2.5 py-1.5 text-[0.68rem] shadow-lg"
                  style={{ background: s.palette.rightBg, color: s.palette.rightFg }}
                >
                  {s.num} · {label}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default StageNav;