import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { useBodyLock } from '@/lib/bodyLock';
import type { Product } from '@/data/products';

type Props = {
  product: Product | null;
  onClose: () => void;
  onPay: (id: string) => void;
  onRequest: (product: Product, text: string, contact: string) => void;
  busy?: boolean;
};

/** Оформление продукта: подробности → согласие → подтверждение → оплата или заявка. */
const ProductFlow = ({ product, onClose, onPay, onRequest, busy }: Props) => {
  const [agree, setAgree] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [text, setText] = useState('');
  const [contact, setContact] = useState('');

  useBodyLock(Boolean(product));

  useEffect(() => {
    if (!product) return;
    setAgree(false);
    setConfirm(false);
    setText('');
    setContact('');
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [product, onClose]);

  if (!product) return null;

  const isRequest = product.id === 'pd';
  const isOnce = product.id === 'smeta' || product.id === 'express';
  const question = isOnce
    ? 'Вы подтверждаете, что намерены приобрести разовую услугу проверки документации?'
    : 'Вы подтверждаете, что желаете оформить подписку «Цифровой кабинет»?';

  return (
    <div className="fixed inset-0 z-[88] flex animate-fade-in items-center justify-center bg-background/95 px-4 py-8 backdrop-blur-sm">
      <div className="max-h-full w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-card p-6 md:p-9">
        {confirm ? (
          <>
            <p className="rubric">Подтверждение</p>
            <h3 className="mt-3 font-display text-[1.4rem] leading-tight text-foreground md:text-[1.8rem]">
              {question}
            </h3>
            <p className="mt-4 text-[0.88rem] leading-relaxed text-muted-foreground">
              {product.name} — {product.price}, {product.period}.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => onPay(product.id)}
                disabled={busy}
                className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-[0.86rem] font-medium text-primary-foreground disabled:opacity-50"
              >
                {busy ? <Icon name="Loader" size={16} className="animate-spin" /> : <Icon name="Check" size={16} />}
                Да, оформить
              </button>
              <button
                onClick={() => setConfirm(false)}
                className="rounded-full border border-border px-8 py-4 text-[0.86rem] text-foreground"
              >
                Нет, вернуться к выбору
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start gap-4">
              <div className="min-w-0 flex-1">
                <p className="rubric">{isRequest ? 'Заявка на разработку' : 'Что входит в продукт'}</p>
                <h3 className="mt-2 font-display text-[1.4rem] leading-tight text-foreground md:text-[1.9rem]">
                  {product.name}
                </h3>
                <p className="mt-2 text-[0.92rem] text-muted-foreground">
                  {product.price} · {product.period}
                </p>
              </div>
              <button onClick={onClose} aria-label="Закрыть" className="shrink-0 p-2 text-muted-foreground">
                <Icon name="X" size={22} />
              </button>
            </div>

            <p className="mt-5 text-[0.9rem] leading-[1.75] text-muted-foreground">{product.lead}</p>

            <ul className="mt-6 space-y-3 border-t border-border pt-6">
              {product.items.map((it) => (
                <li key={it} className="flex gap-3 text-[0.88rem] leading-relaxed text-foreground/85">
                  <Icon name="Check" size={16} className="mt-0.5 shrink-0 text-primary" />
                  {it}
                </li>
              ))}
            </ul>

            {isRequest ? (
              <div className="mt-6 space-y-3">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  placeholder="Опишите объект и задачу: назначение, площадь, этап, какие разделы нужны"
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-[0.88rem] text-foreground outline-none focus:border-primary"
                />
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Телефон или почта для связи"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-[0.88rem] text-foreground outline-none focus:border-primary"
                />
              </div>
            ) : null}

            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-border px-4 py-3.5">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
              />
              <span className="text-[0.84rem] leading-relaxed text-muted-foreground">
                Согласен на обработку персональных данных в соответствии с ФЗ-152 и с условиями публичной оферты
              </span>
            </label>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => (isRequest ? onRequest(product, text, contact) : setConfirm(true))}
                disabled={!agree || (isRequest && !text.trim())}
                className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-[0.86rem] font-medium text-primary-foreground disabled:opacity-40"
              >
                <Icon name={isRequest ? 'Send' : 'CreditCard'} size={16} />
                {isRequest ? 'Отправить заявку' : 'Оформить'}
              </button>
              <button onClick={onClose} className="rounded-full border border-border px-8 py-4 text-[0.86rem] text-foreground">
                Вернуться к выбору
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductFlow;
