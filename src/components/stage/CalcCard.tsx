import { useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import { downloadCalcDoc } from '@/lib/calcDoc';
import { verifiedSubstitution } from '@/lib/formulaSteps';
import { useAuth } from '@/context/AuthContext';
import type { Calc, Palette } from '@/data/stages';

type Props = { calc: Calc; palette: Palette; stageTitle: string };

const CalcCard = ({ calc, palette, stageTitle }: Props) => {
  const { trackDownload } = useAuth();
  const [vals, setVals] = useState<Record<string, number>>(() =>
    Object.fromEntries(calc.fields.map((f) => [f.key, f.def])),
  );
  const [shown, setShown] = useState<Record<string, number>>(() =>
    Object.fromEntries(calc.fields.map((f) => [f.key, f.def])),
  );
  const [fresh, setFresh] = useState(true);
  const results = useMemo(() => calc.compute(shown), [calc, shown]);
  const subst = useMemo(
    () => verifiedSubstitution(calc.formula, calc.fields, shown, results),
    [calc, shown, results],
  );
  const fg = palette.leftFg;

  const set = (key: string, raw: string) => {
    const n = Number(raw.replace(',', '.'));
    setVals((prev) => ({ ...prev, [key]: Number.isFinite(n) ? n : 0 }));
    setFresh(false);
  };

  const run = () => {
    setShown(vals);
    setFresh(true);
  };

  const main = results.find((r) => r.accent) ?? results[0];

  const download = () => {
    trackDownload('calc', calc.title, stageTitle);
    return downloadCalcDoc({ calc, values: shown, results, stageTitle });
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
          {subst.length ? (
            <div className="mt-3 space-y-1">
              <p className="text-[0.68rem] uppercase tracking-[0.14em]" style={{ color: `${fg}90` }}>
                Подстановка
              </p>
              {subst.map((s) => (
                <p key={s.symbolic} className="font-mono text-[0.78rem] leading-relaxed" style={{ color: fg }}>
                  {[s.numeric, ...s.steps].filter(Boolean).join(' = ')}
                </p>
              ))}
            </div>
          ) : null}
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

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={run}
          className="inline-flex items-center gap-2 px-5 py-3 text-[0.74rem] font-medium uppercase tracking-[0.12em] transition-opacity hover:opacity-90"
          style={{ background: fg, color: palette.leftBg }}
        >
          <Icon name="Calculator" size={15} />
          Рассчитать
        </button>
        {!fresh ? (
          <span className="text-[0.72rem]" style={{ color: `${fg}90` }}>
            Данные изменились — нажмите «Рассчитать»
          </span>
        ) : null}
      </div>

      {main ? (
        <div
          className="mt-4 flex flex-wrap items-baseline justify-between gap-3 border px-4 py-3.5"
          style={{ borderColor: `${fg}55`, background: `${fg}12`, opacity: fresh ? 1 : 0.45 }}
        >
          <span className="text-[0.7rem] uppercase tracking-[0.14em]" style={{ color: `${fg}a0` }}>
            Итого · {main.label}
          </span>
          <span className="font-display text-[1.6rem] leading-none" style={{ color: fg }}>
            {main.value}
          </span>
        </div>
      ) : null}

      <dl className="mt-4 divide-y" style={{ borderColor: `${fg}22`, opacity: fresh ? 1 : 0.45 }}>
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
        className="mt-4 inline-flex items-center gap-2 border px-5 py-3 text-[0.74rem] font-medium uppercase tracking-[0.12em] transition-colors"
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