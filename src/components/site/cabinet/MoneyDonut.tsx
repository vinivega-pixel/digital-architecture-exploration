import type { Money } from '@/data/cabinet';

/** Круговая диаграмма движения денежных средств. */
const MoneyDonut = ({ items }: { items: Money[] }) => {
  const total = items.reduce((s, i) => s + i.part, 0) || 1;
  const R = 15.9155;
  const C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 42 42" className="h-[68px] w-[68px] shrink-0 -rotate-90">
        <circle cx="21" cy="21" r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="5" />
        {items.map((i) => {
          const len = (i.part / total) * C;
          const dash = `${len} ${C - len}`;
          const el = (
            <circle
              key={i.label}
              cx="21"
              cy="21"
              r={R}
              fill="none"
              stroke={i.color}
              strokeWidth="5"
              strokeDasharray={dash}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return el;
        })}
      </svg>

      <div className="min-w-0 flex-1 space-y-[3px]">
        {items.map((i) => (
          <div key={i.label} className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: i.color }} />
            <span className="flex-1 truncate text-[0.5rem] text-white/50">{i.label}</span>
            <span className="text-[0.5rem] tabular-nums text-white/75">{i.part} %</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoneyDonut;
