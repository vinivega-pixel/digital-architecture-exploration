import { useCallback, useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { buildEstimate } from '@/lib/planner';
import { ROLES, type WsTheme } from './theme';
import type { SceneVariant } from './Canvas';

export type Estimate = {
  currency?: string;
  regionK?: number;
  items?: { name: string; unit: string; qty: number; price: number; sum: number }[];
  total?: number;
  note?: string;
};

const money = (v: number) => new Intl.NumberFormat('ru-RU').format(Math.round(v || 0));

const EstimatorWidget = ({
  theme,
  variant,
  region,
}: {
  theme: WsTheme;
  variant: SceneVariant | null;
  region: string;
}) => {
  const [busy, setBusy] = useState(false);
  const [est, setEst] = useState<Estimate | null>(null);
  const [err, setErr] = useState('');

  const run = useCallback(() => {
    if (!variant) return;
    setErr('');
    setEst(buildEstimate(variant, region || 'Московская область'));
  }, [variant, region]);

  useEffect(() => {
    if (variant) run();
    else setEst(null);
  }, [variant, run]);

  const r = ROLES.estimator;

  return (
    <div
      className="flex h-full flex-col"
      style={{ background: theme.panel, borderLeft: `1px solid ${theme.line}` }}
    >
      <div className="flex items-center gap-2.5 border-b px-4 py-3" style={{ borderColor: theme.line }}>
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: r.dot }} />
        <span className="flex-1 text-[0.86rem] font-semibold" style={{ color: theme.head }}>
          {r.name}
        </span>
        <button
          type="button"
          onClick={run}
          disabled={busy || !variant}
          className="px-3 py-1.5 text-[0.74rem] font-medium disabled:opacity-40"
          style={{ background: theme.accent, color: '#fff' }}
        >
          {busy ? <Icon name="Loader" size={14} className="animate-spin" /> : 'Считать'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {!variant ? (
          <p className="text-[0.8rem]" style={{ color: `${theme.text}90` }}>
            Выберите вариант планировки — смета посчитается по нему.
          </p>
        ) : null}

        {err ? (
          <p className="text-[0.78rem]" style={{ color: theme.warn }}>
            {err}
          </p>
        ) : null}

        {est?.items?.length ? (
          <table className="w-full text-[0.76rem]">
            <thead>
              <tr style={{ color: `${theme.text}80` }}>
                <th className="pb-1.5 text-left font-normal">Раздел</th>
                <th className="pb-1.5 text-right font-normal">Кол-во</th>
                <th className="pb-1.5 text-right font-normal">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {est.items.map((it) => (
                <tr key={it.name} style={{ borderTop: `1px solid ${theme.line}` }}>
                  <td className="py-1.5 pr-2" style={{ color: theme.text }}>
                    {it.name}
                  </td>
                  <td className="py-1.5 text-right tabular-nums" style={{ color: `${theme.text}a0` }}>
                    {it.qty} {it.unit}
                  </td>
                  <td className="py-1.5 text-right tabular-nums font-medium" style={{ color: theme.head }}>
                    {money(it.sum)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}

        {est?.total ? (
          <div className="mt-4 border-t pt-3" style={{ borderColor: theme.line }}>
            <p className="text-[0.7rem] uppercase tracking-[0.1em]" style={{ color: `${theme.text}80` }}>
              Итого · коэф. региона {est.regionK ?? 1}
            </p>
            <p className="mt-1 text-[1.35rem] font-semibold tabular-nums" style={{ color: theme.head }}>
              {money(est.total)} ₽
            </p>
            {est.note ? (
              <p className="mt-1.5 text-[0.74rem] leading-relaxed" style={{ color: `${theme.text}90` }}>
                {est.note}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EstimatorWidget;
