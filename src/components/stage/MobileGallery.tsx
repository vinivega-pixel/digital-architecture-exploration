import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import MobileFree, { stageCalcs } from './MobileFree';
import MobilePremium from './MobilePremium';
import { mobileCopy } from '@/data/mobileCopy';
import { stageExtras } from '@/data/stageExtras';
import { stageLabels } from '@/data/stageLabels';
import { stages } from '@/data/stages';
import type { MobileTab } from './mobileTabs';

const ROWS: { id: MobileTab; icon: string; label: string; side: 'free' | 'premium' }[] = [
  { id: 'calcs', icon: 'Calculator', label: mobileCopy.labels.calcs, side: 'free' },
  { id: 'templates', icon: 'FileText', label: mobileCopy.labels.templates, side: 'free' },
  { id: 'norms', icon: 'BookOpen', label: mobileCopy.labels.norms, side: 'free' },
  { id: 'agent', icon: 'MessagesSquare', label: mobileCopy.labels.agent, side: 'premium' },
  { id: 'repair', icon: 'ShieldCheck', label: mobileCopy.labels.repair, side: 'premium' },
  { id: 'products', icon: 'Cpu', label: mobileCopy.labels.products, side: 'premium' },
];

/** Мобильная версия: этапы листаются свайпом, разделы открываются во весь экран. */
const MobileGallery = () => {
  const [idx, setIdx] = useState(0);
  const [tab, setTab] = useState<MobileTab | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const stage = stages[idx];
  const { palette } = stage;
  const extra = stageExtras[stage.id];
  const counts: Record<string, number> = {
    calcs: stageCalcs(stage).length,
    templates: (extra?.templates ?? stage.templates).length,
    norms: (extra?.norms ?? stage.norms).length,
  };

  useEffect(() => {
    if (!tab) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [tab]);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    if (next !== idx && next >= 0 && next < stages.length) setIdx(next);
  };

  const goTo = (n: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: n * el.clientWidth, behavior: 'smooth' });
  };

  const active = ROWS.find((r) => r.id === tab);
  const sheetFree = active?.side === 'free';
  const fg = sheetFree ? palette.leftFg : palette.rightFg;
  const bg = sheetFree ? palette.leftBg : palette.rightBg;

  if (active) {
    return (
      <div className="fixed inset-0 z-[95] flex flex-col md:hidden" style={{ background: bg, color: fg }}>
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
          {sheetFree ? <MobileFree stage={stage} tab={active.id} /> : <MobilePremium stage={stage} tab={active.id} />}
        </div>
      </div>
    );
  }

  return (
    <section className="md:hidden" style={{ background: palette.rightBg }}>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        {stages.map((s) => (
          <div key={s.id} id={s.id} className="relative w-full shrink-0 snap-center">
            <div className="relative h-[54vh] min-h-[330px] w-full overflow-hidden">
              <img
                src={s.image}
                alt={s.imageAlt}
                loading={s.id === stages[0].id ? 'eager' : 'lazy'}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, ${s.palette.rightBg}55 0%, ${s.palette.rightBg}22 42%, ${s.palette.rightBg}f5 100%)`,
                }}
              />
              <div className="absolute inset-x-0 bottom-0 px-5 pb-6">
                <p className="text-[0.6rem] uppercase tracking-[0.22em]" style={{ color: `${s.palette.rightFg}cc` }}>
                  Этап {s.num} из {String(stages.length).padStart(2, '0')}
                </p>
                <h2
                  className="mt-1.5 font-display text-[1.25rem] uppercase leading-[1.15] tracking-[0.02em]"
                  style={{ color: s.palette.rightFg }}
                >
                  {stageLabels[s.id] ?? s.kicker}
                </h2>
                <p className="mt-2 text-[0.78rem] leading-relaxed" style={{ color: `${s.palette.rightFg}cc` }}>
                  {s.lead}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ background: palette.rightBg }}>
        <button
          type="button"
          onClick={() => goTo(Math.max(0, idx - 1))}
          disabled={idx === 0}
          aria-label="Предыдущий этап"
          className="p-2 disabled:opacity-30"
          style={{ color: palette.rightFg }}
        >
          <Icon name="ChevronLeft" size={22} />
        </button>

        <div className="flex flex-1 justify-center gap-1.5">
          {stages.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Этап ${s.num}`}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === idx ? 20 : 6,
                background: i === idx ? palette.rightFg : `${palette.rightFg}55`,
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(Math.min(stages.length - 1, idx + 1))}
          disabled={idx === stages.length - 1}
          aria-label="Следующий этап"
          className="p-2 disabled:opacity-30"
          style={{ color: palette.rightFg }}
        >
          <Icon name="ChevronRight" size={22} />
        </button>
      </div>

      <div className="px-4 py-5" style={{ background: palette.leftBg, color: palette.leftFg }}>
        <span
          className="inline-flex items-center gap-1.5 border px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.16em]"
          style={{ borderColor: `${palette.leftFg}55` }}
        >
          <Icon name="Unlock" size={12} />
          Полезное
        </span>
        <div className="mt-3.5 space-y-2">
          {ROWS.filter((r) => r.side === 'free').map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setTab(r.id)}
              className="flex w-full items-center gap-3 border px-3.5 py-3.5 text-left"
              style={{ borderColor: `${palette.leftFg}30` }}
            >
              <Icon name={r.icon} size={17} className="shrink-0" style={{ color: `${palette.leftFg}b0` }} />
              <span className="flex-1 text-[0.86rem] font-medium">{r.label}</span>
              {counts[r.id] ? (
                <span className="text-[0.74rem] tabular-nums" style={{ color: `${palette.leftFg}80` }}>
                  {counts[r.id]}
                </span>
              ) : null}
              <Icon name="ChevronRight" size={16} className="shrink-0" style={{ color: `${palette.leftFg}80` }} />
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-5" style={{ background: palette.rightBg, color: palette.rightFg }}>
        <span
          className="inline-flex items-center gap-1.5 border px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.16em]"
          style={{ borderColor: `${palette.rightFg}55` }}
        >
          <Icon name="Sparkles" size={12} />
          Премиум
        </span>
        <div className="mt-3.5 space-y-2">
          {ROWS.filter((r) => r.side === 'premium').map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setTab(r.id)}
              className="flex w-full items-center gap-3 border px-3.5 py-3.5 text-left"
              style={{ borderColor: `${palette.rightFg}30` }}
            >
              <Icon name={r.icon} size={17} className="shrink-0" style={{ color: `${palette.rightFg}b0` }} />
              <span className="flex-1 text-[0.86rem] font-medium">{r.label}</span>
              <Icon name="ChevronRight" size={16} className="shrink-0" style={{ color: `${palette.rightFg}80` }} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MobileGallery;
