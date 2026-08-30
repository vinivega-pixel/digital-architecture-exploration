import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { wsApi, type WsNote } from '@/lib/workspaceApi';
import { NOTE_COLORS, NOTE_LABELS, ROLES, type WsTheme } from './theme';

type Props = {
  theme: WsTheme;
  dark: boolean;
  notes: WsNote[];
  projectId?: number;
  onChange: () => void;
};

const KINDS: { id: 'question' | 'info' | 'fix'; label: string }[] = [
  { id: 'question', label: 'Вопрос' },
  { id: 'info', label: 'Пояснение' },
  { id: 'fix', label: 'Доработка' },
];

const EngineerWidget = ({ theme, dark, notes, projectId, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [kind, setKind] = useState<'question' | 'info' | 'fix'>('question');
  const [busy, setBusy] = useState(false);
  const colors = NOTE_COLORS(dark);
  const r = ROLES.engineer;
  const unresolved = notes.filter((n) => !n.resolved).length;

  const send = async () => {
    if (!text.trim() || busy) return;
    setBusy(true);
    try {
      await wsApi.addNote({ body: text.trim(), kind, author: 'user', projectId });
      setText('');
      onChange();
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2.5 px-3.5 py-2.5"
        style={{ background: theme.panel, border: `1px solid ${theme.line}`, boxShadow: theme.shadow, minHeight: 44 }}
      >
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full" style={{ background: `${r.dot}22` }}>
          <Icon name="UserRound" size={16} style={{ color: r.dot }} />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full" style={{ background: r.dot }} />
        </span>
        <span className="text-left">
          <span className="block text-[0.8rem] font-semibold" style={{ color: theme.head }}>
            Инженер института
          </span>
          <span className="block text-[0.68rem]" style={{ color: `${theme.text}90` }}>
            онлайн{unresolved ? ` · ${unresolved} замечаний` : ''}
          </span>
        </span>
      </button>
    );
  }

  return (
    <div
      className="flex max-h-[70vh] w-[340px] max-w-[calc(100vw-24px)] flex-col"
      style={{ background: theme.panel, border: `1px solid ${theme.line}`, boxShadow: theme.shadow }}
    >
      <div className="flex items-center gap-2.5 border-b px-3.5 py-3" style={{ borderColor: theme.line }}>
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full" style={{ background: `${r.dot}22` }}>
          <Icon name="UserRound" size={16} style={{ color: r.dot }} />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full" style={{ background: r.dot }} />
        </span>
        <span className="flex-1">
          <span className="block text-[0.84rem] font-semibold" style={{ color: theme.head }}>
            Инженер института
          </span>
          <span className="block text-[0.68rem]" style={{ color: `${theme.text}90` }}>
            отвечает в рабочее время
          </span>
        </span>
        <button type="button" onClick={() => setOpen(false)} style={{ color: `${theme.text}90` }}>
          <Icon name="X" size={18} />
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-3.5 py-3">
        {notes.length ? (
          notes.map((n) => (
            <div
              key={n.id}
              className="px-3 py-2"
              style={{
                borderLeft: `3px solid ${colors[n.kind] ?? colors.info}`,
                background: theme.bg,
                opacity: n.resolved ? 0.55 : 1,
              }}
            >
              <p className="text-[0.68rem] uppercase tracking-[0.08em]" style={{ color: `${theme.text}80` }}>
                {NOTE_LABELS[n.kind] ?? 'Заметка'} · {n.author === 'user' ? 'вы' : 'инженер'}
              </p>
              <p className="mt-1 text-[0.82rem] leading-relaxed" style={{ color: theme.text }}>
                {n.body}
              </p>
              {!n.resolved ? (
                <button
                  type="button"
                  onClick={() => wsApi.resolveNote(n.id).then(onChange)}
                  className="mt-1.5 text-[0.72rem]"
                  style={{ color: theme.accent }}
                >
                  Отметить решённым
                </button>
              ) : null}
            </div>
          ))
        ) : (
          <p className="text-[0.8rem]" style={{ color: `${theme.text}90` }}>
            Замечаний нет. Напишите инженеру — он посмотрит вашу сцену и ответит.
          </p>
        )}
      </div>

      <div className="border-t px-3.5 py-3" style={{ borderColor: theme.line }}>
        <div className="mb-2 flex gap-1.5">
          {KINDS.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => setKind(k.id)}
              className="flex-1 py-1.5 text-[0.7rem]"
              style={{
                border: `1px solid ${kind === k.id ? colors[k.id] : theme.line}`,
                color: kind === k.id ? colors[k.id] : `${theme.text}a0`,
              }}
            >
              {k.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Запросить правку…"
            className="min-w-0 flex-1 px-3 py-2.5 text-[0.82rem] outline-none"
            style={{ background: theme.bg, color: theme.text, border: `1px solid ${theme.line}` }}
          />
          <button
            type="button"
            onClick={send}
            disabled={busy}
            className="shrink-0 px-3.5 disabled:opacity-50"
            style={{ background: theme.accent, color: '#fff', minHeight: 44 }}
          >
            <Icon name="Send" size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EngineerWidget;
