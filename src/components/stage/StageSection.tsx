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
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 62% 48% at 50% 50%, ${palette.rightBg}b8 0%, ${palette.rightBg}55 58%, transparent 100%)`,
          }}
        />

        <div className="absolute inset-0 z-[2] flex items-center justify-center px-6 text-center md:px-10">
          <div>
            <p
              className="text-[0.68rem] uppercase tracking-[0.24em] md:text-[0.72rem]"
              style={{ color: `${palette.rightFg}cc` }}
            >
              Этап {stage.num}
            </p>
            <h2
              className="mt-3 font-display text-[1.5rem] uppercase leading-[1.08] tracking-[0.03em] sm:text-[1.9rem] md:text-[2.4rem]"
              style={{ color: palette.rightFg }}
            >
              {stage.kicker}
            </h2>
            <p
              className="mx-auto mt-4 max-w-[34em] text-[0.82rem] leading-relaxed md:text-[0.9rem]"
              style={{ color: `${palette.rightFg}cc` }}
            >
              {stage.lead}
            </p>
          </div>
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