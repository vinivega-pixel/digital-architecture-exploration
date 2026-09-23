import { useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import MobileFree, { stageCalcs } from './MobileFree';
import StageTabs, { TAB_ROWS } from './StageTabs';
import { useBodyLock } from '@/lib/bodyLock';
import { stageExtras } from '@/data/stageExtras';
import { stageLabels } from '@/data/stageLabels';
import { stageLeads } from '@/data/stageLeads';
import { stages } from '@/data/stages';
import type { MobileTab } from './mobileTabs';

/** Мобильная версия: этапы листаются по кругу свайпом, разделы открываются во весь экран. */
const MobileGallery = () => {
  const [idx, setIdx] = useState(0);
  const [tab, setTab] = useState<MobileTab | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const stage = stages[idx];
  const { palette } = stage;
  const extra = stageExtras[stage.id];
  const counts: Record<string, number> = {
    calcs: stageCalcs(stage).length,
    templates: (extra?.templates ?? stage.templates).length,
    norms: (extra?.norms ?? stage.norms).length,
  };

  useBodyLock(Boolean(tab));

  const shift = (step: number) => setIdx((i) => (i + step + stages.length) % stages.length);

  const active = TAB_ROWS.find((r) => r.id === tab);

  if (active) {
    const fg = palette.leftFg;
    return (
      <div className="fixed inset-0 z-[95] flex flex-col md:hidden" style={{ background: palette.leftBg, color: fg }}>
        <div className="flex items-center gap-3 border-b px-4 py-3.5" style={{ borderColor: `${fg}26` }}>
          <button type="button" onClick={() => setTab(null)} aria-label="Назад" className="-ml-1.5 p-1.5" style={{ color: fg }}>
            <Icon name="ArrowLeft" size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-[1rem] leading-tight">{active.label}</p>
            <p className="truncate text-[0.68rem] uppercase tracking-[0.12em]" style={{ color: `${fg}88` }}>
              Этап {stage.num} · {stage.phase}
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 pb-16">
          <MobileFree stage={stage} tab={active.id} />
        </div>
      </div>
    );
  }

  return (
    <section id="stages-mobile" className="md:hidden" style={{ background: palette.rightBg }}>
      <div
        className="relative h-[56vh] min-h-[330px] w-full overflow-hidden"
        onTouchStart={(e) => {
          const t = e.touches[0];
          touch.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          if (!touch.current) return;
          const t = e.changedTouches[0];
          const dx = t.clientX - touch.current.x;
          const dy = t.clientY - touch.current.y;
          touch.current = null;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) shift(dx < 0 ? 1 : -1);
          else if (Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx)) shift(dy < 0 ? 1 : -1);
        }}
      >
        {stages.map((s, i) => (
          <img
            key={s.id}
            src={s.image}
            alt={s.imageAlt}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
            style={{ opacity: i === idx ? 1 : 0 }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${palette.rightBg}5c 0%, ${palette.rightBg}1a 42%, ${palette.rightBg}f2 100%)`,
          }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-7 text-center">
          <p className="text-[0.6rem] uppercase tracking-[0.24em]" style={{ color: `${palette.rightFg}cc` }}>
            Этап {stage.num}
          </p>
          <h2
            className="mt-2 font-display text-[1.4rem] uppercase leading-[1.15] tracking-[0.02em]"
            style={{ color: palette.rightFg }}
          >
            {stageLabels[stage.id] ?? stage.kicker}
          </h2>
        </div>

        <p
          className="absolute inset-x-5 bottom-4 text-center text-[0.7rem] leading-[1.6]"
          style={{ color: `${palette.rightFg}bb` }}
        >
          {stageLeads[stage.id] ?? stage.lead}
        </p>
      </div>

      <div className="flex items-center gap-2.5 px-4 py-3" style={{ background: palette.rightBg }}>
        <button
          type="button"
          onClick={() => shift(-1)}
          aria-label="Предыдущий этап"
          className="shrink-0 p-1.5"
          style={{ color: palette.rightFg }}
        >
          <Icon name="ChevronLeft" size={19} />
        </button>

        <div
          className="flex flex-1 items-center gap-[3px] rounded-full px-2 py-2"
          style={{ background: `${palette.rightFg}12` }}
        >
          {stages.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Этап ${s.num}`}
              className="h-[4px] flex-1 rounded-full transition-all duration-300"
              style={{
                background: i === idx ? palette.rightFg : `${palette.rightFg}40`,
                transform: i === idx ? 'scaleY(2)' : 'none',
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => shift(1)}
          aria-label="Следующий этап"
          className="shrink-0 p-1.5"
          style={{ color: palette.rightFg }}
        >
          <Icon name="ChevronRight" size={19} />
        </button>
      </div>

      <StageTabs stage={stage} counts={counts} onOpen={setTab} variant="mobile" />
    </section>
  );
};

export default MobileGallery;
