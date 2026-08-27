import { useState } from 'react';
import Icon from '@/components/ui/icon';
import func2url from '../../../backend/func2url.json';

const NORM_URL = (func2url as Record<string, string>)['norm-check'];

const HINTS = [
  'Какие документы обязательны на этом этапе?',
  'Что проверяет экспертиза в этом разделе?',
  'Какие требования к оформлению документации?',
];

const NormCheck = ({ stagePhase, fg, bg }: { stagePhase: string; fg: string; bg: string }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [asked, setAsked] = useState('');
  const [busy, setBusy] = useState(false);

  const ask = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    setBusy(true);
    setAsked(q);
    setAnswer(null);
    setQuestion('');

    try {
      const res = await fetch(NORM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: stagePhase, question: q }),
      });
      const data = await res.json();
      setAnswer(data.answer ?? 'Не удалось получить ответ. Попробуйте задать вопрос ещё раз.');
    } catch {
      setAnswer('Связь с сервисом прервалась. Попробуйте ещё раз.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="text-[0.8rem] leading-relaxed" style={{ color: `${fg}b5` }}>
        Задайте вопрос по нормам — получите ответ с юридическим обоснованием: конкретный свод правил, ГОСТ или
        статья кодекса, на которых основано требование, и что это значит для вашего проекта.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
        }}
        className="mt-4"
      >
        <label className="block text-[0.68rem] uppercase tracking-[0.14em]" style={{ color: `${fg}99` }}>
          Узнать норму
        </label>
        <div className="mt-2 flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Например: какой минимальный уклон плоской кровли?"
            className="w-full border bg-transparent px-3 py-2.5 text-sm outline-none"
            style={{ borderColor: `${fg}40`, color: fg }}
          />
          <button
            type="submit"
            disabled={busy}
            className="shrink-0 px-4 py-2.5 text-[0.74rem] font-medium uppercase tracking-[0.1em] disabled:opacity-40"
            style={{ background: fg, color: bg }}
          >
            <Icon name="Search" size={15} />
          </button>
        </div>
      </form>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {HINTS.map((h) => (
          <button
            key={h}
            type="button"
            onClick={() => ask(h)}
            disabled={busy}
            className="border px-2.5 py-1.5 text-left text-[0.72rem] leading-snug transition-opacity disabled:opacity-40"
            style={{ borderColor: `${fg}35`, color: `${fg}c0` }}
          >
            {h}
          </button>
        ))}
      </div>

      {busy ? (
        <p className="mt-4 flex items-center gap-2 text-[0.8rem]" style={{ color: `${fg}90` }}>
          <Icon name="Loader" size={14} />
          Сверяем с нормативной базой…
        </p>
      ) : null}

      {answer ? (
        <div className="mt-4 border p-4" style={{ borderColor: `${fg}2e`, background: `${fg}0a` }}>
          <p className="text-[0.68rem] uppercase tracking-[0.14em]" style={{ color: `${fg}90` }}>
            Вопрос
          </p>
          <p className="mt-1 text-[0.82rem] leading-relaxed" style={{ color: fg }}>
            {asked}
          </p>
          <div className="mt-3 border-t pt-3" style={{ borderColor: `${fg}22` }}>
            <p className="whitespace-pre-wrap text-[0.82rem] leading-relaxed" style={{ color: `${fg}d0` }}>
              {answer}
            </p>
          </div>
          <p className="mt-3 text-[0.68rem] leading-relaxed" style={{ color: `${fg}88` }}>
            Ответ носит справочный характер. Перед применением сверьте действующую редакцию документа.
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default NormCheck;
