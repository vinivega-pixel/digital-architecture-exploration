import FreePanel from './FreePanel';
import PremiumPanel from './PremiumPanel';
import { stageLabels } from '@/data/stageLabels';
import type { Stage } from '@/data/stages';

const StageSection = ({ stage }: { stage: Stage }) => {
  const { palette } = stage;
  const heading = stageLabels[stage.id] ?? stage.kicker;

  return (
    <section id={stage.id} data-stage={stage.id} className="relative scroll-mt-16" style={{ background: palette.rightBg }}>
      <div className="relative h-[62vh] min-h-[384px] w-full overflow-hidden md:h-[79vh]">
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
            background: `radial-gradient(ellipse 62% 48% at 50% 50%, ${palette.rightBg}b8 0%, ${palette.rightBg}55 58%, transparent 100%)`,
          }}
        />

        <div className="absolute inset-0 z-[2] grid grid-cols-1 items-center px-6 md:grid-cols-[1fr_auto_1fr] md:gap-8 md:px-[48px] lg:gap-12">
          <p
            className="ml-auto hidden max-w-[12em] border-r-2 pr-5 text-right text-[0.6rem] uppercase leading-[1.5] tracking-[0.1em] md:block lg:text-[0.68rem]"
            style={{ color: palette.rightFg, borderColor: `${palette.rightFg}66` }}
          >
            Полезная сторона
            <span className="mt-1.5 block text-[0.95em] normal-case leading-snug tracking-[0.02em]" style={{ color: `${palette.rightFg}bf` }}>
              Выполни самостоятельно — мы даём инструмент
            </span>
          </p>

          <div className="mx-auto max-w-[19em] px-2 text-center md:max-w-[21em]">
            <p
              className="text-[0.6rem] uppercase tracking-[0.24em] md:text-[0.64rem]"
              style={{ color: `${palette.rightFg}cc` }}
            >
              Этап {stage.num}
            </p>
            <h2
              className="mt-2 font-display text-[1.15rem] uppercase leading-[1.12] tracking-[0.03em] sm:text-[1.35rem] md:text-[1.7rem]"
              style={{ color: palette.rightFg }}
            >
              {heading}
            </h2>
            <p
              className="mx-auto mt-3 text-[0.72rem] leading-relaxed md:text-[0.76rem]"
              style={{ color: `${palette.rightFg}cc` }}
            >
              {stage.lead}
            </p>
          </div>

          <p
            className="mr-auto hidden max-w-[12em] border-l-2 pl-5 text-left text-[0.6rem] uppercase leading-[1.5] tracking-[0.1em] md:block lg:text-[0.68rem]"
            style={{ color: palette.rightFg, borderColor: `${palette.rightFg}66` }}
          >
            Премиум-сторона
            <span className="mt-1.5 block text-[0.95em] normal-case leading-snug tracking-[0.02em]" style={{ color: `${palette.rightFg}bf` }}>
              Доверьте институту — получите результат
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <FreePanel stage={stage} />
        <PremiumPanel stage={stage} />
      </div>
    </section>
  );
};

export default StageSection;