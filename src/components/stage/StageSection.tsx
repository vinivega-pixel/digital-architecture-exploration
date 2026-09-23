import { useState } from 'react';
import MobileFree, { stageCalcs } from './MobileFree';
import StageTabs, { TAB_ROWS } from './StageTabs';
import { stageExtras } from '@/data/stageExtras';
import { stageLabels } from '@/data/stageLabels';
import { stageLeads } from '@/data/stageLeads';
import type { Stage } from '@/data/stages';
import type { MobileTab } from './mobileTabs';

const StageSection = ({ stage }: { stage: Stage }) => {
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
    <section id={stage.id} data-stage={stage.id} className="relative hidden scroll-mt-20 bg-background pt-12 md:block">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="relative h-[54vh] min-h-[340px] w-full overflow-hidden rounded-3xl">
          <img
            src={stage.image}
            alt={stage.imageAlt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(8,17,28,.55) 0%, rgba(8,17,28,.26) 42%, rgba(8,17,28,.88) 100%)',
            }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
            <span className="rounded-full border border-white/25 px-3.5 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-white/75">
              Этап {stage.num}
            </span>
            <h2 className="mt-4 font-display text-[1.7rem] leading-[1.14] text-white lg:text-[2.2rem]">{heading}</h2>
            <p className="mx-auto mt-5 max-w-[46em] text-[0.88rem] leading-[1.75] text-white/70">
              {stageLeads[stage.id] ?? stage.lead}
            </p>
          </div>
        </div>
      </div>

      <StageTabs
        stage={stage}
        counts={counts}
        onOpen={(t) => setTab((v) => (v === t ? null : t))}
        variant="desktop"
        active={tab}
      />

      {active ? (
        <div className="bg-background px-5 pb-12 md:px-10">
          <div className="mx-auto max-w-[1400px] border-t border-border pt-8">
            <MobileFree stage={stage} tab={active.id} />
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default StageSection;
