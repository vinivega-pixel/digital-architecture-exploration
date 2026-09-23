import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import MobileFree from './MobileFree';
import StageTabs, { TAB_ROWS } from './StageTabs';
import { stageLabels } from '@/data/stageLabels';
import { stageLeads } from '@/data/stageLeads';
import { stageShort } from '@/data/stageShort';
import { stages } from '@/data/stages';
import type { MobileTab } from './mobileTabs';

/** Изометрическая иллюстрация по этапу: этажность нарастает от сетей к приёмке. */
export const STAGE_ICON: Record<string, string> = {
  uchastok: '01',
  izyskaniya: '02',
  pd: '03',
  arkr: '04',
  eom: '05',
  vk: '06',
  ovik: '07',
  ss: '08',
  roof: '09',
  blago: '10',
  priemka: '11',
};

/** Единый экран этапов: лента переключения и раскрытие разделов на одной странице. */
const StagesBoard = () => {
  const [idx, setIdx] = useState(0);
  const [tab, setTab] = useState<MobileTab | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      const n = stages.findIndex((s) => s.id === id);
      if (n >= 0) {
        setIdx(n);
        setTab(null);
      }
    };
    window.addEventListener('open-stage', onOpen);
    return () => window.removeEventListener('open-stage', onOpen);
  }, []);

  const stage = stages[idx];
  const active = TAB_ROWS.find((r) => r.id === tab);

  const openTab = (t: MobileTab) => {
    const next = tab === t ? null : t;
    setTab(next);
    if (next) {
      requestAnimationFrame(() =>
        setTimeout(() => {
          const panel = document.getElementById('stage-panel');
          if (!panel) return;
          const top = panel.getBoundingClientRect().top + window.scrollY - 76;
          window.scrollTo({ top, behavior: 'smooth' });
        }, 60),
      );
    }
  };

  const shift = (step: number) => {
    setIdx((i) => (i + step + stages.length) % stages.length);
    setTab(null);
  };

  return (
    <section id="stages" className="hidden scroll-mt-[68px] bg-background pt-7 md:block">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="relative h-[34vh] max-h-[300px] min-h-[220px] w-full overflow-hidden rounded-3xl">
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
              background: 'linear-gradient(180deg, rgba(8,17,28,.5) 0%, rgba(8,17,28,.24) 42%, rgba(8,17,28,.9) 100%)',
            }}
          />

          <button
            onClick={() => shift(-1)}
            aria-label="Предыдущий этап"
            className="absolute left-4 top-1/2 z-[2] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/45"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>
          <button
            onClick={() => shift(1)}
            aria-label="Следующий этап"
            className="absolute right-4 top-1/2 z-[2] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/45"
          >
            <Icon name="ChevronRight" size={20} />
          </button>

          <div className="absolute inset-0 flex flex-col items-center justify-center px-16 text-center">
            <span className="rounded-full border border-white/25 px-3.5 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-white/75">
              Этап {stage.num} из {stages.length}
            </span>
            <h2 className="mt-3 font-display text-[1.45rem] leading-[1.14] text-white lg:text-[1.85rem]">
              {stageLabels[stage.id] ?? stage.kicker}
            </h2>
            <p className="mx-auto mt-3 line-clamp-2 max-w-[46em] text-[0.82rem] leading-[1.6] text-white/70">
              {stageLeads[stage.id] ?? stage.lead}
            </p>
          </div>
        </div>

        <div className="-mx-5 mt-4 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0">
          <div className="flex min-w-[900px] items-start gap-1">
            {stages.map((s, i) => {
              const on = i === idx;
              return (
                <div key={s.id} className="flex flex-1 items-start">
                  <button
                    onClick={() => {
                      setIdx(i);
                      setTab(null);
                    }}
                    className="group flex-1 rounded-xl px-1 py-1.5 text-center transition-colors"
                    style={on ? { background: 'hsl(var(--primary) / 0.07)' } : undefined}
                  >
                    <span className="flex h-[54px] items-center justify-center">
                      <img
                        src={`/iso/${STAGE_ICON[s.id]}.png`}
                        alt=""
                        className="h-[48px] object-contain transition-transform duration-300 group-hover:-translate-y-1"
                        style={{ opacity: on ? 1 : 0.5 }}
                      />
                    </span>
                    <span className="mt-1.5 block text-[0.72rem] tabular-nums text-muted-foreground">{s.num}</span>
                    <span
                      className={`mt-0.5 block px-1 text-[0.76rem] leading-snug ${
                        on ? 'font-medium text-primary' : 'text-foreground'
                      }`}
                    >
                      {stageShort[s.id] ?? s.phase}
                    </span>
                  </button>
                  {i < stages.length - 1 ? (
                    <Icon name="ChevronRight" size={12} className="mt-[24px] shrink-0 text-border" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <StageTabs onOpen={openTab} variant="desktop" active={tab} />

      {active ? (
        <div id="stage-panel" className="scroll-mt-[76px] bg-background px-5 pb-14 md:px-10">
          <div className="mx-auto max-w-[1400px] border-t border-border pt-8">
            <MobileFree stage={stage} tab={active.id} />
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default StagesBoard;
