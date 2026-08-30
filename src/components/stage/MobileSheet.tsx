import { useEffect, type ReactNode } from 'react';
import Icon from '@/components/ui/icon';

type Props = {
  open: boolean;
  title: string;
  subtitle?: string;
  fg: string;
  bg: string;
  onClose: () => void;
  children: ReactNode;
};

/** Полноэкранная мобильная вкладка: заголовок закреплён сверху, содержимое во всю ширину. */
const MobileSheet = ({ open, title, subtitle, fg, bg, onClose, children }: Props) => {
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex flex-col md:hidden" style={{ background: bg, color: fg }}>
      <div
        className="flex items-center gap-3 border-b px-4 py-3.5"
        style={{ borderColor: `${fg}26`, background: bg }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Назад"
          className="-ml-1.5 shrink-0 p-1.5"
          style={{ color: fg }}
        >
          <Icon name="ArrowLeft" size={20} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[1rem] leading-tight">{title}</p>
          {subtitle ? (
            <p className="mt-0.5 truncate text-[0.68rem] uppercase tracking-[0.12em]" style={{ color: `${fg}88` }}>
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 pb-16">{children}</div>
    </div>
  );
};

export default MobileSheet;
