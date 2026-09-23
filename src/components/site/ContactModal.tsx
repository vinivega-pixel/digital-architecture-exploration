import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { useBodyLock } from '@/lib/bodyLock';

type Props = { open: boolean; onClose: () => void };

const MAIL = 'cifrainst@mail.ru';

/** Окно связи с институтом: письмо уходит на почту с заполненными данными. */
const ContactModal = ({ open, onClose }: Props) => {
  useBodyLock(open);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open, onClose]);

  if (!open) return null;

  const send = () => {
    const body = `Имя: ${name}\nКонтакт: ${contact}\n\n${text}`;
    window.location.href = `mailto:${MAIL}?subject=${encodeURIComponent('Обращение с сайта ЦИФРА')}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="fixed inset-0 z-[85] flex animate-fade-in items-center justify-center bg-background/95 px-5 backdrop-blur-sm">
      <div className="w-full max-w-lg border border-border bg-card p-7 md:p-9">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <p className="rubric">Связаться с институтом</p>
            <h3 className="mt-2 font-display text-[1.5rem] leading-tight text-foreground">Напишите нам</h3>
          </div>
          <button onClick={onClose} aria-label="Закрыть" className="p-1.5 text-muted-foreground">
            <Icon name="X" size={20} />
          </button>
        </div>

        <p className="mt-3 text-[0.85rem] leading-relaxed text-muted-foreground">
          Опишите задачу — ответим по будням в течение рабочего дня. Почта института:{' '}
          <a href={`mailto:${MAIL}`} className="link-underline text-primary">
            {MAIL}
          </a>
        </p>

        <div className="mt-5 space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Как к вам обращаться"
            className="w-full border border-border bg-background px-4 py-3 text-[0.88rem] text-foreground outline-none focus:border-primary"
          />
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Почта или телефон для ответа"
            className="w-full border border-border bg-background px-4 py-3 text-[0.88rem] text-foreground outline-none focus:border-primary"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Коротко о задаче: объект, этап, что нужно"
            className="w-full resize-none border border-border bg-background px-4 py-3 text-[0.88rem] text-foreground outline-none focus:border-primary"
          />
        </div>

        <button
          type="button"
          onClick={send}
          disabled={!text.trim()}
          className="mt-5 flex w-full items-center justify-center gap-2 bg-primary px-6 py-4 text-[0.78rem] font-medium uppercase tracking-[0.12em] text-primary-foreground disabled:opacity-40"
        >
          <Icon name="Send" size={16} />
          Отправить обращение
        </button>
      </div>
    </div>
  );
};

export default ContactModal;
