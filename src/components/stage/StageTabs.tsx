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
  const toTariffs = () => document.getElementById('premium')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className={`bg-background ${variant === 'mobile' ? 'px-4 py-6' : 'mx-auto max-w-[1400px] px-5 py-10 md:px-10'}`}>
      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">Сделай сейчас</p>

      <div className={`mt-4 grid gap-3 ${variant === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'}`}>
        {TAB_ROWS.map((r) => {
          const on = active === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onOpen(r.id)}
              className={`flex min-h-[86px] flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-5 text-center transition-colors ${
                on ? 'border-primary bg-primary/5 text-foreground' : 'border-border bg-card text-foreground hover:border-primary/50'
              }`}
            >
              <Icon name={r.icon} size={19} className={on ? 'text-primary' : 'text-muted-foreground'} />
              <span className="text-[0.85rem] font-medium leading-tight">{r.label}</span>
              {counts[r.id] ? (
                <span className="text-[0.7rem] tabular-nums text-muted-foreground">
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
        className="mt-5 text-[0.82rem] leading-relaxed text-muted-foreground transition-opacity hover:opacity-70"
      >
        Активация личного кабинета строителя —{' '}
        <span className="font-medium text-primary underline underline-offset-4">подробнее</span>
      </button>
    </div>
  );
};

export default StageTabs;
