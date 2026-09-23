import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { readDoc } from '@/lib/readDoc';
import type { Stage } from '@/data/stages';
import func2url from '../../../backend/func2url.json';

const AI_URL = (func2url as Record<string, string>)['ai-chat'];
const LIMIT_KEY = 'cifra_audit_used';
const FREE_LIMIT = 2;

type Msg = { role: 'user' | 'assistant'; content: string };

const used = () => Number(localStorage.getItem(LIMIT_KEY) ?? '0');

/** Поиск ошибок: анализ документа и свободный диалог с ассистентом. */
const DocAudit = ({ stage }: { stage: Stage }) => {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const [left, setLeft] = useState(Math.max(0, FREE_LIMIT - used()));
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, busy]);

  const ask = async (prompt: string, shown: string) => {
    const next: Msg[] = [...msgs, { role: 'user', content: shown }];
    setMsgs(next);
    setBusy(true);
    try {
      const history = next.slice(-8).map((m, i) => (i === next.length - 1 ? { role: m.role, content: prompt } : m));
      const res = await fetch(AI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: stage.phase, messages: history }),
      });
      const data = await res.json();
      setMsgs([...next, { role: 'assistant', content: data.reply ?? 'Ассистент временно недоступен.' }]);
    } catch {
      setMsgs([...next, { role: 'assistant', content: 'Нет связи с ассистентом. Попробуйте ещё раз.' }]);
    } finally {
      setBusy(false);
    }
  };

  const onFile = async (file: File) => {
    if (busy) return;
    if (left <= 0) {
      setNote('Бесплатный лимит исчерпан: два документа. Полный аудит доступен в личном кабинете.');
      return;
    }
    setNote('Читаю документ…');
    const parsed = await readDoc(file);
    if (!parsed.ok) {
      setNote(parsed.note);
      return;
    }
    setNote('');
    const body = parsed.text.slice(0, 14000);
    const prompt = `Проверь документ по этапу «${stage.phase}». Найди ошибки, несоответствия действующим нормам и риски. Отвечай по пунктам, со ссылками на СП и ГОСТ.\n\nДокумент «${file.name}»:\n${body}`;
    const nextUsed = used() + 1;
    localStorage.setItem(LIMIT_KEY, String(nextUsed));
    setLeft(Math.max(0, FREE_LIMIT - nextUsed));
    await ask(prompt, `Проверить документ: ${file.name}`);
  };

  const send = async () => {
    const q = text.trim();
    if (!q || busy) return;
    setText('');
    setNote('');
    await ask(`Этап «${stage.phase}». ${q}`, q);
  };

  return (
    <div>
      <p className="text-[0.88rem] leading-relaxed text-muted-foreground">
        Загрузите документ — ассистент найдёт ошибки и несоответствия нормам. Или просто спросите его о чём угодно по
        этому этапу: диалог не ограничен, лимит в два документа действует только на разбор файлов.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex items-center gap-2 rounded-full border border-border px-5 py-3 text-[0.84rem] text-foreground transition-colors hover:border-primary disabled:opacity-50"
        >
          <Icon name="Upload" size={15} />
          Загрузить документ
        </button>
        <span className="text-[0.76rem] text-muted-foreground">Осталось разборов: {left} · PDF, DOCX, XLSX, TXT</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept=".txt,.csv,.xml,.json,.pdf,.docx,.xlsx"
        onChange={(e) => {
          const fl = e.target.files?.[0];
          e.target.value = '';
          if (fl) onFile(fl);
        }}
      />

      {note ? (
        <p className="mt-3 rounded-xl border border-border px-4 py-3 text-[0.82rem] leading-relaxed text-foreground">
          {note}
        </p>
      ) : null}

      <div className="mt-5 space-y-3">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`whitespace-pre-line rounded-2xl px-4 py-3 text-[0.86rem] leading-relaxed ${
              m.role === 'user'
                ? 'ml-auto max-w-[85%] border border-primary/40 text-foreground'
                : 'mr-auto max-w-[92%] border border-border bg-card text-card-foreground'
            }`}
          >
            {m.content}
          </div>
        ))}
        {busy ? (
          <div className="mr-auto flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-[0.84rem] text-muted-foreground">
            <Icon name="Loader" size={15} className="animate-spin" />
            Ассистент анализирует…
          </div>
        ) : null}
        <div ref={endRef} />
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Спросите ассистента об этом этапе…"
          className="min-w-0 flex-1 rounded-full border border-border bg-card px-5 py-3.5 text-[0.88rem] text-foreground outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={send}
          disabled={busy}
          aria-label="Отправить"
          className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
        >
          <Icon name="Send" size={17} />
        </button>
      </div>
    </div>
  );
};

export default DocAudit;
