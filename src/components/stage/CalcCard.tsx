import { useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import { downloadCalcDoc } from '@/lib/calcDoc';
import { useAuth } from '@/context/AuthContext';
import type { Calc, Palette } from '@/data/stages';

type Props = { calc: Calc; palette: Palette; stageTitle: string };

const CalcCard = ({ calc, palette, stageTitle }: Props) => {
  const { trackDownload } = useAuth();
  const [vals, setVals] = useState<Record<string, number>>(() =>
    Object.fromEntries(calc.fields.map((f) => [f.key, f.def])),
  );
  const results = useMemo(() => calc.compute(vals), [calc, vals]);
  const fg = palette.leftFg;

  const set = (key: string, raw: string) => {
    const n = Number(raw.replace(',', '.'));
    setVals((prev) => ({ ...prev, [key]: Number.isFinite(n) ? n : 0 }));
  };

  const download = () => {
    trackDownload('calc', calc.title, stageTitle);
    return downloadCalcDoc({ calc, values: vals, results, stageTitle });
  };

  return (
    <div className="border p-5 md:p-6" style={{ borderColor: `${fg}33`, background: `${fg}0a` }}>
      <div className="flex items-start gap-3">
        <Icon name="Calculator" size={18} style={{ color: fg }} />
        <div>
          <h4 className="font-display text-lg leading-tight" style={{ color: fg }}>
            {calc.title}
          </h4>
          <p className="mt-1 text-[0.78rem] leading-relaxed" style={{ color: `${fg}b0` }}>
            {calc.note}
          </p>
        </div>
      </div>

      {calc.formula ? (
        <div className="mt-4 border-l-2 pl-3.5" style={{ borderColor: `${fg}55` }}>
          <p className="text-[0.68rem] uppercase tracking-[0.14em]" style={{ color: `${fg}90` }}>
            Формула
          </p>
          <p className="mt-1 font-mono text-[0.86rem] leading-relaxed" style={{ color: fg }}>
            {calc.formula}
          </p>
          {calc.legend?.length ? (
            <ul className="mt-2.5 space-y-1">
              {calc.legend.map((l) => (
                <li key={l} className="text-[0.76rem] leading-relaxed" style={{ color: `${fg}b0` }}>
                  {l}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {calc.fields.map((f) => (
          <label key={f.key} className="block">
            <span className="block text-[0.68rem] uppercase tracking-[0.14em]" style={{ color: `${fg}a0` }}>
              {f.label}
              {f.unit ? `, ${f.unit}` : ''}
            </span>
            <input
              type="number"
              inputMode="decimal"
              step={f.step ?? 1}
              value={vals[f.key]}
              onChange={(e) => set(f.key, e.target.value)}
              className="mt-1.5 w-full border bg-transparent px-3 py-2 text-sm outline-none transition-colors"
              style={{ borderColor: `${fg}40`, color: fg }}
            />
          </label>
        ))}
      </div>

      <dl className="mt-5 divide-y" style={{ borderColor: `${fg}22` }}>
        {results.map((r) => (
          <div
            key={r.label}
            className="flex items-baseline justify-between gap-4 border-t py-2.5 first:border-t-0"
            style={{ borderColor: `${fg}22` }}
          >
            <dt className="text-[0.82rem]" style={{ color: `${fg}b0` }}>
              {r.label}
            </dt>
            <dd className={`text-right text-sm font-semibold ${r.accent ? 'text-base' : ''}`} style={{ color: fg }}>
              {r.value}
            </dd>
          </div>
        ))}
      </dl>

      <button
        onClick={download}
        className="mt-5 inline-flex items-center gap-2 border px-5 py-3 text-[0.74rem] font-medium uppercase tracking-[0.12em] transition-colors"
        style={{ borderColor: fg, color: fg }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = fg;
          e.currentTarget.style.color = palette.leftBg;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = fg;
        }}
      >
        <Icon name="Download" size={15} />
        Скачать расчёт документом
      </button>

      <p className="mt-3 text-[0.68rem] leading-relaxed" style={{ color: `${fg}90` }}>
        Основание: {calc.basis}
      </p>
    </div>
  );
};

export default CalcCard;