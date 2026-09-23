import { useState } from 'react';
import MobileFree, { stageCalcs } from './MobileFree';
import StageTabs, { TAB_ROWS } from './StageTabs';
import { stageExtras } from '@/data/stageExtras';
import { stageLabels } from '@/data/stageLabels';
import { stageLeads } from '@/data/stageLeads';
import type { Stage } from '@/data/stages';
import type { MobileTab } from './mobileTabs';

const StageSection = ({ stage }: { stage: Stage }) => {
  const { palette } = stage;
  const heading = stageLabels[stage.id] ?? stage.kicker;
  const extra = stageExtras[stage.id];
  const [tab, setTab] = useState<MobileTab | null>(null);

  const counts: Record<string, number> = {
    calcs: stageCalcs(stage).length,
    templates: (extra?.templates ?? stage.templates).length,
    norms: (extra?.norms ?? stage.norms).length,
  };

  const active = TAB_ROWS.find((r) => r.id === tab);

  return (
    <section
      id={stage.id}
      data-stage={stage.id}
      className="relative hidden scroll-mt-16 md:block"
      style={{ background: palette.rightBg }}
    >
      <div className="relative h-[62vh] min-h-[384px] w-full overflow-hidden md:h-[72vh]">
        <img
          src={stage.image}
          alt={stage.imageAlt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{ background: `linear-gradient(180deg, transparent, ${palette.rightBg}f2)` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 64% 50% at 50% 50%, ${palette.rightBg}b8 0%, ${palette.rightBg}55 58%, transparent 100%)`,
          }}
        />

        <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center px-8 text-center">
          <p className="text-[0.62rem] uppercase tracking-[0.24em]" style={{ color: `${palette.rightFg}cc` }}>
            Этап {stage.num}
          </p>
          <h2
            className="mt-2.5 font-display text-[1.6rem] uppercase leading-[1.12] tracking-[0.03em] lg:text-[2.1rem]"
            style={{ color: palette.rightFg }}
          >
            {heading}
          </h2>
          <p
            className="mx-auto mt-5 max-w-[46em] text-[0.86rem] leading-[1.75]"
            style={{ color: `${palette.rightFg}c4` }}
          >
            {stageLeads[stage.id] ?? stage.lead}
          </p>
        </div>
      </div>

      <StageTabs stage={stage} counts={counts} onOpen={(t) => setTab((v) => (v === t ? null : t))} variant="desktop" active={tab} />

      {active ? (
        <div className="px-8 pb-10" style={{ background: palette.leftBg, color: palette.leftFg }}>
          <div className="mx-auto max-w-5xl border-t pt-7" style={{ borderColor: `${palette.leftFg}26` }}>
            <MobileFree stage={stage} tab={active.id} />
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default StageSection;
