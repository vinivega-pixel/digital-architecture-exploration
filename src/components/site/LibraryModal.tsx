import { useEffect, useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import { libDocs, libDocUrl, type LibDoc } from '@/data/libDocs';
import { downloadRemote } from '@/lib/downloadFile';
import { useAuth } from '@/context/AuthContext';

type Props = { open: boolean; onClose: () => void };

const groupOf = (code: string) => {
  if (code.startsWith('СП')) return 'Своды правил';
  if (code.startsWith('ГОСТ')) return 'ГОСТ';
  if (code.startsWith('РД')) return 'Руководящие документы';
  return 'Законы и постановления';
};

const LibraryModal = ({ open, onClose }: Props) => {
  const { trackDownload } = useAuth();
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const groups = useMemo(() => {
    const t = q.trim().toLowerCase();
    const list = t
      ? libDocs.filter((d) => `${d.code} ${d.title}`.toLowerCase().includes(t))
      : libDocs;
    const map = new Map<string, LibDoc[]>();
    for (const d of list) {
      const g = groupOf(d.code);
      map.set(g, [...(map.get(g) ?? []), d]);
    }
    return [...map.entries()];
  }, [q]);

  const total = groups.reduce((s, [, items]) => s + items.length, 0);

  if (!open) return null;

  const get = async (d: LibDoc) => {
    setBusy(d.file);
    trackDownload('norm', `${d.code} — ${d.title}`, 'Библиотека');
    await downloadRemote(libDocUrl(d), `${d.code} ${d.title}.pdf`);
    setBusy(null);
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Библиотека нормативных документов"
    >
      <div
        className="flex h-full max-h-none w-full max-w-[720px] flex-col border-border bg-card sm:h-auto sm:max-h-[92vh] sm:border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-6 md:p-8">
          <div>
            <p className="rubric">Библиотека · {libDocs.length} документов</p>
            <h3 className="mt-2 font-display text-2xl leading-tight text-foreground">
              Нормы и своды правил
            </h3>
            <p className="mt-2 text-[0.82rem] leading-relaxed text-muted-foreground">
              Полные тексты в PDF. Клик по документу — файл сразу уходит в загрузки.
            </p>
          </div>
          <button onClick={onClose} aria-label="Закрыть" className="text-muted-foreground hover:text-foreground">
            <Icon name="X" size={22} />
          </button>
        </div>

        <div className="border-b border-border px-6 py-4 md:px-8">
          <div className="flex items-center gap-2 border border-border bg-background px-3 py-2.5">
            <Icon name="Search" size={15} className="shrink-0 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="СП 63, кровли, изыскания…"
              className="w-full bg-transparent text-[0.85rem] text-foreground outline-none placeholder:text-muted-foreground"
            />
            {q && (
              <button onClick={() => setQ('')} aria-label="Очистить" className="text-muted-foreground">
                <Icon name="X" size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 md:px-8">
          {total === 0 && (
            <p className="py-10 text-center text-[0.85rem] text-muted-foreground">
              Ничего не нашлось. Попробуйте номер свода правил или ключевое слово.
            </p>
          )}
          {groups.map(([name, items]) => (
            <div key={name} className="mb-6 last:mb-0">
              <p className="rubric mb-2">
                {name} · {items.length}
              </p>
              <ul className="divide-y divide-border border-y border-border">
                {items.map((d) => (
                  <li key={d.file}>
                    <button
                      type="button"
                      onClick={() => get(d)}
                      className="flex w-full items-center gap-3 py-3 text-left transition-opacity hover:opacity-70"
                    >
                      <Icon
                        name={busy === d.file ? 'Loader' : 'Download'}
                        size={15}
                        className={`shrink-0 text-muted-foreground ${busy === d.file ? 'animate-spin' : ''}`}
                      />
                      <span className="flex-1">
                        <span className="block text-[0.85rem] font-medium text-foreground">{d.code}</span>
                        <span className="block text-[0.78rem] leading-snug text-muted-foreground">{d.title}</span>
                      </span>
                      <span className="shrink-0 text-[0.7rem] uppercase tracking-[0.1em] text-muted-foreground">
                        {(d.size / 1048576).toFixed(1)} МБ
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border px-6 py-4 text-[0.72rem] leading-relaxed text-muted-foreground md:px-8">
          Документы приведены в справочных целях. Перед применением проверяйте действующую редакцию на дату работ.
        </div>
      </div>
    </div>
  );
};

export default LibraryModal;
