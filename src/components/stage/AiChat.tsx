import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import func2url from '../../../backend/func2url.json';

type Msg = { role: 'user' | 'assistant'; content: string };

const CHAT_URL = (func2url as Record<string, string>)['ai-chat'];

const HINTS: Record<string, string[]> = {
  uchastok: [
    'Какие исходные документы нужны на этом этапе?',
    'А не кинут ли меня при покупке участка?',
    'Как проверить обременения и охранные зоны?',
  ],
  izyskaniya: [
    'Какие исходные документы нужны на этом этапе?',
    'А если геологи наврут и дом поедет?',
    'Сколько скважин действительно нужно по нормам?',
  ],
  pd: [
    'Какие исходные документы нужны на этом этапе?',
    'А если экспертиза завернёт проект и сроки сгорят?',
    'Как заранее снять типовые замечания экспертизы?',
  ],
  arkr: [
    'Какие исходные документы нужны на этом этапе?',
    'А не треснет ли монолит и не придётся ли всё переделывать?',
    'Достаточно ли армирования по расчёту?',
  ],
  eom: [
    'Какие исходные документы нужны на этом этапе?',
    'А не сгорят ли провода от перегрузки?',
    'Правильно ли подобраны сечения и автоматы защиты?',
  ],
  vk: [
    'Какие исходные документы нужны на этом этапе?',
    'А если зальёт соседей снизу — кто виноват?',
    'Хватит ли напора на верхних этажах?',
  ],
  ovik: [
    'Какие исходные документы нужны на этом этапе?',
    'А не будет ли зимой холодно, а летом душно?',
    'Верно ли посчитаны теплопотери и воздухообмен?',
  ],
  ss: [
    'Какие исходные документы нужны на этом этапе?',
    'А если пожарная сигнализация не сработает при пожаре?',
    'Что требует МЧС при приёмке систем?',
  ],
  roof: [
    'Какие исходные документы нужны на этом этапе?',
    'А не потечёт ли кровля через первую же зиму?',
    'Правильно ли рассчитана снеговая нагрузка?',
  ],
  blago: [
    'Какие исходные документы нужны на этом этапе?',
    'А не провалится ли плитка и не смоет ли газон весной?',
    'Как обеспечить водоотвод с территории?',
  ],
  priemka: [
    'Какие исходные документы нужны на этом этапе?',
    'А если объект не примут и деньги зависнут?',
    'Какой комплект исполнительной документации нужен?',
  ],
};

const DEFAULT_HINTS = [
  'Какие исходные документы нужны на этом этапе?',
  'Где здесь чаще всего попадают на деньги?',
  'На какие нормы опираться в расчёте?',
];

const AiChat = ({ stageId, stagePhase, fg, bg }: { stageId: string; stagePhase: string; fg: string; bg: string }) => {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content: `Здравствуйте. Я инженер-консультант института по этапу «${stagePhase}». Опишите объект — площадь, этажность, регион — или перечислите документы, которые у вас уже есть. Разберу состав, найду нехватку данных и подскажу, что делать дальше.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...messages, { role: 'user', content: q }];
    setMessages(next);
    setInput('');
    setBusy(true);

    try {
      const res = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: stagePhase, messages: next.map((m) => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      setMessages([
        ...next,
        {
          role: 'assistant',
          content: data.reply ?? 'Связь с агентом прервалась. Попробуйте отправить вопрос ещё раз.',
        },
      ]);
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Связь с агентом прервалась. Попробуйте ещё раз.' }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div
        ref={boxRef}
        className="max-h-[320px] space-y-3 overflow-y-auto border p-3.5"
        style={{ borderColor: `${fg}2e`, background: `${fg}08` }}
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <Icon
              name={m.role === 'user' ? 'User' : 'Bot'}
              size={14}
              className="mt-1 shrink-0"
              style={{ color: `${fg}90` }}
            />
            <div
              className="max-w-[85%] whitespace-pre-wrap px-3 py-2 text-[0.8rem] leading-relaxed"
              style={{
                background: m.role === 'user' ? `${fg}18` : `${fg}0d`,
                color: m.role === 'user' ? fg : `${fg}d0`,
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {busy ? (
          <div className="flex gap-2.5">
            <Icon name="Bot" size={14} className="mt-1 shrink-0" style={{ color: `${fg}90` }} />
            <div className="px-3 py-2 text-[0.8rem]" style={{ color: `${fg}90` }}>
              Агент печатает…
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {(HINTS[stageId] ?? DEFAULT_HINTS).map((h) => (
          <button
            key={h}
            type="button"
            onClick={() => send(h)}
            disabled={busy}
            className="border px-2.5 py-1.5 text-left text-[0.72rem] leading-snug transition-opacity disabled:opacity-40"
            style={{ borderColor: `${fg}35`, color: `${fg}c0` }}
          >
            {h}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ваш вопрос по этапу…"
          className="w-full border bg-transparent px-3 py-2.5 text-sm outline-none"
          style={{ borderColor: `${fg}40`, color: fg }}
        />
        <button
          type="submit"
          disabled={busy}
          className="shrink-0 px-4 py-2.5 text-[0.74rem] font-medium uppercase tracking-[0.1em] disabled:opacity-40"
          style={{ background: fg, color: bg }}
        >
          <Icon name="Send" size={15} />
        </button>
      </form>
    </div>
  );
};

export default AiChat;
