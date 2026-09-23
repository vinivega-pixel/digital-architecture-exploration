import Icon from '@/components/ui/icon';
import type { Stage } from '@/data/stages';
import type { MobileTab } from './mobileTabs';

export const TAB_ROWS: { id: MobileTab; icon: string; label: string; side: 'free' | 'premium' }[] = [
  { id: 'calcs', icon: 'Calculator', label: 'Расчёт', side: 'free' },
  { id: 'templates', icon: 'FileText', label: 'Документ', side: 'free' },
  { id: 'norms', icon: 'BookOpen', label: 'База знаний', side: 'free' },
  { id: 'audit', icon: 'ScanSearch', label: 'Найди ошибки', side: 'free' },
];

type Props = {
  stage: Stage;
  counts: Record<string, number>;
  onOpen: (tab: MobileTab) => void;
  variant: 'mobile' | 'desktop';
  active?: MobileTab | null;
};

/** Блок «Сделай сейчас»: четыре равные вкладки этапа. */
const StageTabs = ({ stage, counts, onOpen, variant, active }: Props) => {
  const { palette } = stage;
  const fg = palette.leftFg;
  const toTariffs = () => document.getElementById('premium')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div
      className={variant === 'mobile' ? 'px-4 py-5' : 'px-8 py-8'}
      style={{ background: palette.leftBg, color: fg }}
    >
      <p className="text-[0.62rem] uppercase tracking-[0.2em]" style={{ color: `${fg}99` }}>
        Сделай сейчас
      </p>

      <div className={`mt-3.5 grid gap-2 ${variant === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'}`}>
        {TAB_ROWS.map((r) => {
          const on = active === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onOpen(r.id)}
              className="flex min-h-[54px] flex-col items-center justify-center gap-1.5 border px-2 py-3 text-center transition-colors"
              style={{
                borderColor: on ? fg : `${fg}30`,
                background: on ? `${fg}0f` : 'transparent',
              }}
            >
              <Icon name={r.icon} size={17} style={{ color: `${fg}b5` }} />
              <span className="text-[0.8rem] font-medium leading-tight">{r.label}</span>
              {counts[r.id] ? (
                <span className="text-[0.66rem] tabular-nums" style={{ color: `${fg}7d` }}>
                  {counts[r.id]}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={toTariffs}
        className="mt-4 text-[0.76rem] leading-relaxed transition-opacity hover:opacity-70"
        style={{ color: `${fg}9e` }}
      >
        Активация личного кабинета строителя —{' '}
        <span className="underline underline-offset-4" style={{ color: fg }}>
          подробнее
        </span>
      </button>
    </div>
  );
};

export default StageTabs;
