import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { askAssistant } from '@/lib/workspaceApi';
import { buildTz } from '@/lib/planner';
import { ROLES, type WsTheme } from './theme';

export type Tz = {
  title?: string;
  summary?: string;
  rows?: { param: string; value: string }[];
  norms?: string[];
  questions?: string[];
};

type Props = {
  theme: WsTheme;
  onReady: (tz: Tz) => void;
  onPin: (tz: Tz) => void;
};

const AnalystWidget = ({ theme, onReady, onPin }: Props) => {
  const [open, setOpen] = useState(true);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [tz, setTz] = useState<Tz | null>(null);
  const [err, setErr] = useState('');

  const run = async () => {
    if (!q.trim() || busy) return;
    setBusy(true);
    setErr('');

    const quick = buildTz(q.trim());
    setTz(quick);
    onReady(quick);

    try {
      const res = await askAssistant<Tz>('analyst', q.trim());
      if (res.configured && res.data?.rows?.length) {
        setTz(res.data);
        onReady(res.data);
      }
    } catch {
      /* базовое ТЗ уже построено */
    } finally {
      setBusy(false);
    }
  };

  const r = ROLES.analyst;

  return (
    <div
      className="w-[340px] max-w-[calc(100vw-24px)]"
      style={{ background: theme.panel, border: `1px solid ${theme.line}`, boxShadow: theme.shadow }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left"
        style={{ color: theme.head }}
      >
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: r.dot }} />
        <span className="flex-1 text-[0.86rem] font-semibold">{r.name}</span>
        <Icon name={open ? 'ChevronDown' : 'ChevronUp'} size={16} style={{ color: `${theme.text}90` }} />
      </button>

      {open ? (
        <div className="border-t px-3.5 py-3" style={{ borderColor: theme.line }}>
          <div className="flex gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && run()}
              placeholder="дом 10х12, 2 этажа, Подмосковье"
              className="min-w-0 flex-1 px-3 py-2.5 text-[0.84rem] outline-none"
              style={{ background: theme.bg, color: theme.text, border: `1px solid ${theme.line}` }}
            />
            <button
              type="button"
              onClick={run}
              disabled={busy}
              className="shrink-0 px-3.5 text-[0.8rem] font-medium disabled:opacity-50"
              style={{ background: theme.accent, color: '#fff', minHeight: 44 }}
            >
              {busy ? <Icon name="Loader" size={16} className="animate-spin" /> : 'ТЗ'}
            </button>
          </div>

          {err ? (
            <p className="mt-2.5 text-[0.78rem]" style={{ color: theme.warn }}>
              {err}
            </p>
          ) : null}

          {tz ? (
            <div className="mt-3 max-h-[320px] overflow-y-auto">
              <p className="text-[0.88rem] font-semibold" style={{ color: theme.head }}>
                {tz.title ?? 'Техническое задание'}
              </p>
              {tz.summary ? (
                <p className="mt-1 text-[0.8rem] leading-relaxed" style={{ color: `${theme.text}c0` }}>
                  {tz.summary}
                </p>
              ) : null}

              {tz.rows?.length ? (
                <table className="mt-3 w-full text-[0.78rem]">
                  <tbody>
                    {tz.rows.map((row) => (
                      <tr key={row.param} style={{ borderBottom: `1px solid ${theme.line}` }}>
                        <td className="py-1.5 pr-3" style={{ color: `${theme.text}a0` }}>
                          {row.param}
                        </td>
                        <td className="py-1.5 text-right font-medium" style={{ color: theme.text }}>
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : null}

              {tz.norms?.length ? (
                <div className="mt-3">
                  <p className="text-[0.7rem] uppercase tracking-[0.1em]" style={{ color: `${theme.text}80` }}>
                    Нормы
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {tz.norms.map((n) => (
                      <li key={n} className="text-[0.78rem]" style={{ color: theme.text }}>
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => onPin(tz)}
                className="mt-3 flex w-full items-center justify-center gap-2 py-2.5 text-[0.78rem] font-medium"
                style={{ border: `1px solid ${theme.accent}`, color: theme.accent, minHeight: 44 }}
              >
                <Icon name="Pin" size={14} />
                Закрепить ТЗ на поле
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default AnalystWidget;
