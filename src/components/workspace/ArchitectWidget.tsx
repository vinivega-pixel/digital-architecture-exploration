import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { buildVariants, parseBrief } from '@/lib/planner';
import { ROLES, type WsTheme } from './theme';
import type { SceneVariant } from './Canvas';
import type { Tz } from './AnalystWidget';

type Props = {
  theme: WsTheme;
  tz: Tz | null;
  active: SceneVariant | null;
  onPick: (v: SceneVariant) => void;
};

const ArchitectWidget = ({ theme, tz, active, onPick }: Props) => {
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState<SceneVariant[]>([]);
  const [err, setErr] = useState('');

  const run = () => {
    setBusy(true);
    setErr('');
    const src = tz
      ? `${tz.title ?? ''} ${tz.summary ?? ''} ${(tz.rows ?? []).map((r) => `${r.param} ${r.value}`).join(' ')}`
      : 'дом 10х12, 2 этажа';
    const list = buildVariants(parseBrief(src));
    setItems(list);
    setBusy(false);
  };

  const r = ROLES.architect;

  return (
    <div
      className="w-[300px] max-w-[calc(100vw-24px)]"
      style={{ background: theme.panel, border: `1px solid ${theme.line}`, boxShadow: theme.shadow }}
    >
      <div className="flex items-center gap-2.5 px-3.5 py-3">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: r.dot }} />
        <span className="flex-1 text-[0.86rem] font-semibold" style={{ color: theme.head }}>
          {r.name}
        </span>
        <button
          type="button"
          onClick={run}
          disabled={busy}
          className="px-3 py-1.5 text-[0.74rem] font-medium disabled:opacity-50"
          style={{ background: theme.accent, color: '#fff' }}
        >
          {busy ? <Icon name="Loader" size={14} className="animate-spin" /> : 'Варианты'}
        </button>
      </div>

      {err ? (
        <p className="px-3.5 pb-3 text-[0.76rem]" style={{ color: theme.warn }}>
          {err}
        </p>
      ) : null}

      {items.length ? (
        <div className="grid max-h-[360px] grid-cols-2 gap-2 overflow-y-auto border-t px-3.5 py-3" style={{ borderColor: theme.line }}>
          {items.map((v) => {
            const on = active?.name === v.name;
            return (
              <button
                key={v.name}
                type="button"
                onClick={() => onPick(v)}
                className="p-2 text-left"
                style={{
                  border: `1px solid ${on ? theme.accent : theme.line}`,
                  background: on ? `${theme.accent}12` : theme.bg,
                }}
              >
                <div
                  className="mb-1.5 flex h-12 items-center justify-center text-[0.66rem]"
                  style={{ background: `${theme.line}44`, color: `${theme.text}b0` }}
                >
                  {v.footprint ?? '—'}
                </div>
                <p className="text-[0.74rem] font-medium leading-tight" style={{ color: theme.head }}>
                  {v.name}
                </p>
                <p className="mt-0.5 text-[0.68rem]" style={{ color: `${theme.text}90` }}>
                  {v.floors ?? 1} эт. · {v.area ?? '—'} м²
                </p>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default ArchitectWidget;
