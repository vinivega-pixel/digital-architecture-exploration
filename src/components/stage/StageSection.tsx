import FreePanel from './FreePanel';
import PremiumPanel from './PremiumPanel';
import type { Stage } from '@/data/stages';

const StageSection = ({ stage }: { stage: Stage }) => {
  const { palette } = stage;

  return (
    <section id={stage.id} data-stage={stage.id} className="relative scroll-mt-16" style={{ background: palette.rightBg }}>
      <div className="relative h-[52vh] min-h-[320px] w-full overflow-hidden md:h-[66vh]">
        <img
          src={stage.image}
          alt={stage.imageAlt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
          style={{ background: 'rgba(255,255,255,.35)' }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{ background: `linear-gradient(180deg, transparent, ${palette.rightBg}f2)` }}
        />

        <div className="absolute inset-x-0 bottom-0 px-6 pb-7 md:px-10 lg:px-14">
          <p className="text-[0.68rem] uppercase tracking-[0.24em]" style={{ color: `${palette.rightFg}cc` }}>
            Этап {stage.num} · {stage.phase}
          </p>
          <h2
            className="mt-2 font-display text-[2rem] uppercase leading-[1.05] tracking-[0.02em] md:text-[3.2rem]"
            style={{ color: palette.rightFg }}
          >
            {stage.kicker}
          </h2>
          <p
            className="mt-3 max-w-[46em] text-[0.88rem] leading-relaxed md:text-[0.95rem]"
            style={{ color: `${palette.rightFg}cc` }}
          >
            {stage.lead}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <FreePanel stage={stage} />
        <PremiumPanel stage={stage} />
      </div>
    </section>
  );
};

export default StageSection;
