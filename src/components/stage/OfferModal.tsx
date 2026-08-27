import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import printDoc from '@/lib/printDoc';
import type { Palette, Stage } from '@/data/stages';

const nf = (v: number) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(v);

type Offer = Stage['offer'];

type Props = {
  stage: Stage;
  offer: Offer;
  palette: Palette;
  amount: number;
  price: number;
  onClose: () => void;
};

const OfferModal = ({ stage, offer, palette, amount, price, onClose }: Props) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const bg = palette.rightBg;
  const fg = palette.rightFg;

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const num = `КП-${stage.num}-${new Date().getFullYear()}`;

  const download = () =>
    printDoc({
      docTitle: `Коммерческое предложение ${num}`,
      heading: `Коммерческое предложение ${num}`,
      subheading: `${offer.title} · этап «${stage.phase}»`,
      inputs: [
        { label: offer.unitLabel, value: nf(amount) },
        { label: 'Ставка', value: `${nf(offer.rate)} ₽ за единицу` },
        { label: 'Минимальная стоимость работ', value: `${nf(offer.minPrice)} ₽` },
      ],
      results: [
        { label: 'Состав работ', value: offer.scope.join('; ') },
        { label: 'Срок выполнения', value: offer.term },
        { label: 'Стоимость работ', value: `${nf(price)} ₽` },
      ],
      basis: 'Расчёт по укрупнённым показателям института. Точная стоимость определяется после уточнения исходных данных.',
      footNote:
        'Предложение носит информационный характер и не является публичной офертой в соответствии со ст. 437 ГК РФ. Стоимость и сроки уточняются после согласования технического задания.',
    });

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Коммерческое предложение"
    >
      <div
        className="max-h-[92vh] w-full max-w-[560px] overflow-y-auto p-6 md:p-9"
        style={{ background: bg, color: fg }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.2em]" style={{ color: `${fg}99` }}>
              {num} · этап {stage.num}
            </p>
            <h3 className="mt-2 font-display text-2xl leading-tight">{offer.title}</h3>
          </div>
          <button onClick={onClose} aria-label="Закрыть" className="shrink-0 opacity-70">
            <Icon name="X" size={22} />
          </button>
        </div>

        <dl className="mt-6 space-y-2 border-y py-4" style={{ borderColor: `${fg}2e` }}>
          <div className="flex justify-between gap-4 text-sm">
            <dt style={{ color: `${fg}aa` }}>{offer.unitLabel}</dt>
            <dd className="font-semibold">{nf(amount)}</dd>
          </div>
          <div className="flex justify-between gap-4 text-sm">
            <dt style={{ color: `${fg}aa` }}>Срок выполнения</dt>
            <dd className="font-semibold">{offer.term}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 pt-2">
            <dt className="text-sm" style={{ color: `${fg}aa` }}>
              Стоимость работ
            </dt>
            <dd className="font-display text-3xl">{nf(price)} ₽</dd>
          </div>
        </dl>

        <ul className="mt-5 space-y-2">
          {offer.scope.map((s) => (
            <li key={s} className="flex gap-2.5 text-[0.86rem] leading-relaxed">
              <Icon name="Check" size={15} className="mt-0.5 shrink-0" />
              <span>{s}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={download}
          className="mt-6 flex w-full items-center justify-center gap-2 border px-6 py-3.5 text-[0.76rem] font-medium uppercase tracking-[0.12em]"
          style={{ borderColor: fg, color: fg }}
        >
          <Icon name="FileDown" size={16} />
          Скачать коммерческое предложение
        </button>

        {sent ? (
          <p className="mt-4 border px-4 py-3 text-[0.82rem]" style={{ borderColor: `${fg}44`, color: fg }}>
            Расчёт закреплён за адресом {email}. Ответим письмом.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="mt-4"
          >
            <label className="block text-[0.68rem] uppercase tracking-[0.14em]" style={{ color: `${fg}99` }}>
              Почта для копии предложения
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.ru"
                className="w-full border bg-transparent px-3 py-3 text-sm outline-none"
                style={{ borderColor: `${fg}44`, color: fg }}
              />
              <button
                type="submit"
                className="shrink-0 px-6 py-3 text-[0.76rem] font-medium uppercase tracking-[0.12em]"
                style={{ background: fg, color: bg }}
              >
                Отправить
              </button>
            </div>
          </form>
        )}

        <p className="mt-5 text-[0.68rem] leading-relaxed" style={{ color: `${fg}88` }}>
          Информация носит справочный характер и не является публичной офертой (ст. 437 ГК РФ).
        </p>
      </div>
    </div>
  );
};

export default OfferModal;
