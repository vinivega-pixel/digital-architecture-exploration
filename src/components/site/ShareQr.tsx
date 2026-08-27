import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Icon from '@/components/ui/icon';

type Props = { open: boolean; onClose: () => void };

const ShareQr = ({ open, onClose }: Props) => {
  const [copied, setCopied] = useState<'link' | 'pay' | null>(null);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const siteLink = origin || 'https://tsifra.institute';
  const payLink = `${siteLink}/?plan=day#premium`;

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  if (!open) return null;

  const copy = async (text: string, kind: 'link' | 'pay') => {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
  };

  const share = async () => {
    if (navigator.share) await navigator.share({ title: 'Институт цифрового развития архитектуры', url: siteLink });
    else copy(siteLink, 'link');
  };

  const goPay = () => {
    onClose();
    window.dispatchEvent(new CustomEvent('select-plan', { detail: 'day' }));
    document.getElementById('premium')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Поделиться и оплатить"
    >
      <div
        className="max-h-[92vh] w-full max-w-[440px] overflow-y-auto border border-border bg-card p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="rubric">Премиум на сутки</p>
            <h3 className="mt-2 font-display text-2xl leading-tight text-foreground">Наведите камеру телефона</h3>
          </div>
          <button onClick={onClose} aria-label="Закрыть" className="text-muted-foreground hover:text-foreground">
            <Icon name="X" size={22} />
          </button>
        </div>

        <div className="mt-6 flex justify-center border border-border bg-white p-4">
          <QRCodeSVG value={payLink} size={188} level="M" bgColor="#ffffff" fgColor="#111A2B" />
        </div>

        <p className="mt-4 text-center text-[0.82rem] leading-relaxed text-muted-foreground">
          Код открывает оплату суточного доступа — 999 ₽ за 24 часа полного премиума.
        </p>

        <button
          onClick={goPay}
          className="mt-4 flex w-full items-center justify-center gap-2 bg-primary px-5 py-3.5 text-[0.78rem] font-medium uppercase tracking-[0.12em] text-primary-foreground"
        >
          <Icon name="Sparkles" size={15} />
          Оплатить 999 ₽
        </button>

        <div className="mt-7 border-t border-border pt-6">
          <p className="rubric">Ссылка на сайт</p>
          <div className="mt-3 flex items-center gap-2 border border-border bg-background px-3 py-2.5">
            <Icon name="Link" size={15} className="shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate text-[0.8rem] text-foreground">{siteLink}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              onClick={() => copy(siteLink, 'link')}
              className="flex items-center justify-center gap-2 border border-primary px-4 py-3 text-[0.74rem] font-medium uppercase tracking-[0.1em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Icon name={copied === 'link' ? 'Check' : 'Copy'} size={15} />
              {copied === 'link' ? 'Скопировано' : 'Копировать'}
            </button>
            <button
              onClick={share}
              className="flex items-center justify-center gap-2 border border-primary px-4 py-3 text-[0.74rem] font-medium uppercase tracking-[0.1em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Icon name="Share2" size={15} />
              Поделиться
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareQr;
