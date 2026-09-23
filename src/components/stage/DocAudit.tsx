import { useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import type { Stage } from '@/data/stages';
import func2url from '../../../backend/func2url.json';

const AI_URL = (func2url as Record<string, string>)['ai-chat'];
const LIMIT_KEY = 'cifra_audit_used';
const FREE_LIMIT = 2;

const used = () => Number(localStorage.getItem(LIMIT_KEY) ?? '0');

/** Бесплатный анализ документа: не более двух файлов, по одному за запрос. */
const DocAudit = ({ stage }: { stage: Stage }) => {
  const fg = 'hsl(var(--foreground))';
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState('');
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [left, setLeft] = useState(Math.max(0, FREE_LIMIT - used()));
  const inputRef = useRef<HTMLInputElement>(null);

  const readText = (f: File) =>
    new Promise<string>((res) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result ?? '').slice(0, 12000));
      r.onerror = () => res('');
      r.readAsText(f);
    });

  const run = async () => {
    if (!file || busy) return;
    if (left <= 0) {
      setNote('Бесплатный лимит исчерпан: два документа. Полный аудит — в личном кабинете.');
      return;
    }
    setBusy(true);
    setNote('');
    setAnswer('');
    try {
      const body = await readText(file);
      const prompt = body
        ? `Проверь документ по этапу «${stage.phase}». Найди ошибки, несоответствия нормам и риски. Кратко, по пунктам.\n\nДокумент «${file.name}»:\n${body}`
        : `Документ «${file.name}» не читается как текст. Подскажи, что обычно проверяют в таких документах на этапе «${stage.phase}»: типовые ошибки, ссылки на нормы, риски.`;

      const res = await fetch(AI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: stage.phase, messages: [{ role: 'user', content: prompt }] }),
      });
      const data = await res.json();
      setAnswer(data.reply ?? 'Ассистент временно недоступен.');
      const next = used() + 1;
      localStorage.setItem(LIMIT_KEY, String(next));
      setLeft(Math.max(0, FREE_LIMIT - next));
      setFile(null);
    } catch {
      setNote('Нет связи с ассистентом. Попробуйте ещё раз.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="text-[0.86rem] leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>
        Загрузите документ этапа — ассистент найдёт ошибки, несоответствия нормам и риски. Бесплатно два документа,
        по одному за запрос.
      </p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-4 flex w-full items-center justify-center gap-2.5 border px-4 py-5 text-[0.85rem]"
        style={{ borderColor: 'hsl(var(--border))', borderStyle: 'dashed', color: 'hsl(var(--muted-foreground))' }}
      >
        <Icon name={file ? 'FileCheck' : 'Upload'} size={17} />
        {file ? file.name : 'Выбрать документ'}
      </button>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept=".txt,.csv,.xml,.json,.pdf,.doc,.docx,.xls,.xlsx"
        onChange={(e) => {
          setFile(e.target.files?.[0] ?? null);
          setAnswer('');
          setNote('');
        }}
      />

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-[0.74rem]" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Осталось бесплатных проверок: {left}
        </span>
        <button
          type="button"
          onClick={run}
          disabled={!file || busy}
          className="flex items-center gap-2 px-5 py-3 text-[0.78rem] font-medium uppercase tracking-[0.1em] disabled:opacity-40"
          style={{ background: fg, color: 'hsl(var(--background))' }}
        >
          {busy ? <Icon name="Loader" size={15} className="animate-spin" /> : <Icon name="ScanSearch" size={15} />}
          Проверить
        </button>
      </div>

      {note ? (
        <p className="mt-3 text-[0.8rem] leading-relaxed" style={{ color: fg }}>
          {note}
        </p>
      ) : null}

      {answer ? (
        <div className="mt-4 whitespace-pre-line border px-4 py-4 text-[0.85rem] leading-relaxed" style={{ borderColor: 'hsl(var(--border))' }}>
          {answer}
        </div>
      ) : null}
    </div>
  );
};

export default DocAudit;
