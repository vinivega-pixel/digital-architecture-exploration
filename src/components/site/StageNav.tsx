import { useEffect, useState } from 'react';
import { stages } from '@/data/stages';

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
  const cur = active >= 0 ? stages[active] : null;

  return (
    <nav aria-label="Этапы проекта" className="fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 md:block">
      <p
        className="mb-3 text-[0.58rem] uppercase tracking-[0.2em]"
        style={{ color: cur ? cur.palette.rightFg : 'rgba(243,238,226,.6)', writingMode: 'vertical-rl' }}
      >
        {cur ? cur.phase : stages[0].phase}
      </p>
      <ul className="flex flex-col gap-1.5">
        {stages.map((s, i) => (
          <li key={s.id} className="relative">
            <button
              onClick={() => go(s.id)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              aria-label={`${s.phase}: ${s.title}`}
              aria-current={i === active}
              className="block rounded-full transition-all duration-300"
              style={{
                width: i === active ? 8 : 5,
                height: i === active ? 34 : 22,
                background: s.palette.accent,
                opacity: i === active ? 1 : 0.55,
                outline: i === active ? '1px solid rgba(255,255,255,.55)' : 'none',
                outlineOffset: 2,
              }}
            />
            {hover === i && (
              <span
                className="pointer-events-none absolute left-[18px] top-1/2 z-10 -translate-y-1/2 whitespace-nowrap px-2.5 py-1.5 text-[0.68rem] shadow-lg"
                style={{ background: s.palette.rightBg, color: s.palette.rightFg }}
              >
                {s.num} · {s.kicker}
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default StageNav;
