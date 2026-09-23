import { useState } from 'react';
import Icon from '@/components/ui/icon';
import type { Stage } from '@/data/stages';
import func2url from '../../../backend/func2url.json';

const NORM_URL = (func2url as Record<string, string>)['norm-check'];

/** Быстрый поиск норматива по вопросу — внутри вкладки «База знаний». */
const NormSearch = ({ stage }: { stage: Stage }) => {
  const fg = 'hsl(var(--foreground))';
  const [q, setQ] = useState('');
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);

  const ask = async () => {
    if (!q.trim() || busy) return;
    setBusy(true);
    setAnswer('');
    try {
      const res = await fetch(NORM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: stage.phase, question: q.trim() }),
      });
      const data = await res.json();
      setAnswer(data.answer ?? 'Ассистент временно недоступен.');
    } catch {
      setAnswer('Нет связи с ассистентом. Попробуйте ещё раз.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-5 border px-4 py-4" style={{ borderColor: 'hsl(var(--border))' }}>
      <p className="flex items-center gap-2 text-[0.8rem] font-medium" style={{ color: fg }}>
        <Icon name="Sparkles" size={15} />
        Быстрый поиск норматива
      </p>
      <div className="mt-2.5 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ask()}
          placeholder="Например: уклон плоской кровли"
          className="min-w-0 flex-1 border bg-transparent px-3 py-2.5 text-[0.84rem] outline-none"
          style={{ borderColor: 'hsl(var(--border))', color: fg }}
        />
        <button
          type="button"
          onClick={ask}
          disabled={busy}
          aria-label="Найти"
          className="shrink-0 px-4 disabled:opacity-40"
          style={{ background: fg, color: 'hsl(var(--background))', minHeight: 44 }}
        >
          {busy ? <Icon name="Loader" size={15} className="animate-spin" /> : <Icon name="Search" size={15} />}
        </button>
      </div>
      {answer ? (
        <p className="mt-3 whitespace-pre-line text-[0.82rem] leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>
          {answer}
        </p>
      ) : null}
    </div>
  );
};

export default NormSearch;
