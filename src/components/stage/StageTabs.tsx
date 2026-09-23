import Icon from '@/components/ui/icon';
import type { MobileTab } from './mobileTabs';

export const TAB_ROWS: { id: MobileTab; icon: string; label: string; note: string; side: 'free' | 'premium' }[] = [
  { id: 'calcs', icon: 'Calculator', label: 'Выполни расчёт', note: 'используя калькуляторы ЦИФРЫ', side: 'free' },
  { id: 'templates', icon: 'FileText', label: 'Разработай документ', note: 'используя шаблоны ЦИФРЫ', side: 'free' },
  { id: 'norms', icon: 'BookOpen', label: 'Найди норматив', note: 'база знаний ЦИФРЫ', side: 'free' },
  { id: 'audit', icon: 'ScanSearch', label: 'Найди ошибки', note: 'ассистент OpenAI', side: 'free' },
];

type Props = {
  onOpen: (tab: MobileTab) => void;
  variant: 'mobile' | 'desktop';
  active?: MobileTab | null;
};

/** Блок «Сделай сейчас»: четыре равные вкладки этапа. */
const StageTabs = ({ onOpen, variant, active }: Props) => {
  const toTariffs = () => document.getElementById('premium')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className={`bg-background ${variant === 'mobile' ? 'px-4 py-7' : 'mx-auto max-w-[1400px] px-5 py-12 md:px-10'}`}>
      <h3 className="text-center font-display text-[1.35rem] leading-tight text-foreground md:text-[1.8rem]">
        Сделай сейчас по выбранному этапу
      </h3>

      <div className={`mt-6 grid gap-3 ${variant === 'mobile' ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'}`}>
        {TAB_ROWS.map((r) => {
          const on = active === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onOpen(r.id)}
              className={`flex min-h-[112px] flex-col items-center justify-center gap-2 rounded-2xl border px-4 py-6 text-center transition-colors ${
                on
                  ? 'border-primary bg-primary/5 text-foreground'
                  : 'border-border bg-card text-foreground hover:border-primary/50'
              }`}
            >
              <span className="text-[0.92rem] font-medium leading-tight">{r.label}</span>
              <Icon name={r.icon} size={22} className={on ? 'text-primary' : 'text-muted-foreground'} />
              <span className="text-[0.76rem] leading-snug text-muted-foreground">{r.note}</span>
            </button>
          );
        })}
      </div>

      <p className="mx-auto mt-6 max-w-[48em] text-center text-[0.84rem] leading-relaxed text-muted-foreground">
        Ознакомились со всеми этапами, а ответа не нашли? Ознакомьтесь с возможностями в цифровом кабинете строителя{' '}
        <button
          type="button"
          onClick={toTariffs}
          className="font-medium text-primary underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          здесь
        </button>
        .
      </p>
    </div>
  );
};

export default StageTabs;
