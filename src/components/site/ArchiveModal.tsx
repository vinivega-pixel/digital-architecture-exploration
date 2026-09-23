import { useEffect, useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import { useBodyLock } from '@/lib/bodyLock';
import { stages } from '@/data/stages';
import { stageExtras } from '@/data/stageExtras';
import { stageLabels } from '@/data/stageLabels';
import { openStage } from '@/lib/openStage';

type Props = { open: boolean; onClose: () => void };

/** Архив шаблонов документов по всем этапам строительства. */
const ArchiveModal = ({ open, onClose }: Props) => {
  useBodyLock(open);
  const [q, setQ] = useState('');

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open, onClose]);

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return stages
      .map((s) => ({
        id: s.id,
        title: stageLabels[s.id] ?? s.kicker,
        num: s.num,
        items: (stageExtras[s.id]?.templates ?? s.templates).filter(
          (t) => !needle || t.toLowerCase().includes(needle),
        ),
      }))
      .filter((g) => g.items.length);
  }, [q]);

  const total = groups.reduce((n, g) => n + g.items.length, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex animate-fade-in items-stretch justify-center bg-background/95 backdrop-blur-sm">
      <div className="flex w-full max-w-4xl flex-col px-5 py-6 md:px-10 md:py-10">
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <p className="rubric">Архив документов</p>
            <h2 className="mt-2 font-display text-[1.6rem] leading-tight text-foreground md:text-[2.2rem]">
              Шаблоны по всем этапам строительства
            </h2>
            <p className="mt-2 text-[0.85rem] leading-relaxed text-muted-foreground">
              {total} форм и бланков: акты, журналы, ведомости, договоры и отчётные формы. Откройте нужный этап —
              документ подготовится с вашими данными.
            </p>
          </div>
          <button onClick={onClose} aria-label="Закрыть" className="shrink-0 p-2 text-muted-foreground">
            <Icon name="X" size={22} />
          </button>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск: акт, журнал, КС-2, ведомость…"
          className="mt-5 w-full border border-border bg-card px-4 py-3 text-[0.9rem] text-foreground outline-none focus:border-primary"
        />

        <div className="mt-5 flex-1 overflow-y-auto">
          {groups.map((g) => (
            <div key={g.id} className="mb-7">
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => openStage(g.id), 200);
                }}
                className="flex w-full items-baseline gap-3 border-b border-border pb-2 text-left"
              >
                <span className="font-display text-[0.8rem] text-primary">{g.num}</span>
                <span className="flex-1 font-display text-[1.05rem] text-foreground">{g.title}</span>
                <Icon name="ArrowRight" size={15} className="text-muted-foreground" />
              </button>
              <ul className="mt-2.5 space-y-1.5">
                {g.items.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-[0.85rem] leading-relaxed text-muted-foreground">
                    <Icon name="FileText" size={14} className="mt-0.5 shrink-0 text-primary/70" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {!groups.length ? (
            <p className="py-10 text-center text-[0.88rem] text-muted-foreground">Ничего не найдено</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ArchiveModal;
