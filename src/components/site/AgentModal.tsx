import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { useBodyLock } from '@/lib/bodyLock';
import func2url from '../../../backend/func2url.json';

type Props = { open: boolean; onClose: () => void };
type Msg = { role: 'user' | 'assistant'; content: string };

const AI_URL = (func2url as Record<string, string>)['ai-chat'];

const HINTS = [
  'Какие изыскания нужны для частного дома?',
  'Состав проектной документации по ПП РФ № 87',
  'Минимальный уклон плоской кровли',
  'Кто подписывает акт освидетельствования скрытых работ?',
];

/** ИИ-ассистент института: отвечает по нормам и этапам строительства. */
const AgentModal = ({ open, onClose }: Props) => {
  useBodyLock(open);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open, onClose]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, busy]);

  const send = async (value?: string) => {
    const q = (value ?? text).trim();
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: 'user', content: q }];
    setMsgs(next);
    setText('');
    setBusy(true);
    try {
      const res = await fetch(AI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-10) }),
      });
      const data = await res.json();
      setMsgs([...next, { role: 'assistant', content: data.reply ?? 'Ассистент временно недоступен.' }]);
    } catch {
      setMsgs([...next, { role: 'assistant', content: 'Нет связи с ассистентом. Попробуйте ещё раз.' }]);
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex animate-fade-in justify-center bg-background/95 backdrop-blur-sm">
      <div className="flex w-full max-w-3xl flex-col px-5 py-6 md:px-10 md:py-10">
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <p className="rubric">Ассистент института</p>
            <h2 className="mt-2 font-display text-[1.5rem] leading-tight text-foreground md:text-[2rem]">
              Спросите о нормах, этапах и документах
            </h2>
          </div>
          <button onClick={onClose} aria-label="Закрыть" className="shrink-0 p-2 text-muted-foreground">
            <Icon name="X" size={22} />
          </button>
        </div>

        <div className="mt-5 flex-1 space-y-3 overflow-y-auto">
          {!msgs.length ? (
            <div className="space-y-2">
              <p className="text-[0.85rem] text-muted-foreground">С чего начать:</p>
              {HINTS.map((h) => (
                <button
                  key={h}
                  onClick={() => send(h)}
                  className="block w-full border border-border px-4 py-3 text-left text-[0.85rem] text-foreground transition-colors hover:border-primary"
                >
                  {h}
                </button>
              ))}
            </div>
          ) : null}

          {msgs.map((m, i) => (
            <div
              key={i}
              className={`px-4 py-3 text-[0.88rem] leading-relaxed ${
                m.role === 'user'
                  ? 'ml-auto max-w-[85%] border border-primary/40 text-foreground'
                  : 'mr-auto max-w-[92%] border border-border bg-card text-card-foreground'
              }`}
            >
              {m.content}
            </div>
          ))}

          {busy ? (
            <div className="mr-auto flex items-center gap-2 border border-border bg-card px-4 py-3 text-[0.85rem] text-muted-foreground">
              <Icon name="Loader" size={15} className="animate-spin" />
              Ассистент думает…
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ваш вопрос…"
            className="min-w-0 flex-1 border border-border bg-card px-4 py-3.5 text-[0.9rem] text-foreground outline-none focus:border-primary"
          />
          <button
            onClick={() => send()}
            disabled={busy}
            aria-label="Отправить"
            className="shrink-0 bg-primary px-5 text-primary-foreground disabled:opacity-50"
          >
            <Icon name="Send" size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentModal;
