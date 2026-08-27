import { useState, type ReactNode } from 'react';
import Icon from '@/components/ui/icon';

type Props = {
  icon: string;
  label: string;
  count: number;
  fg: string;
  locked?: boolean;
  onToggle?: (open: boolean) => void;
  children: ReactNode;
};

const Disclosure = ({ icon, label, count, fg, locked, onToggle, children }: Props) => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    onToggle?.(next);
  };

  return (
    <div className="border" style={{ borderColor: `${fg}2e` }}>
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center gap-1.5 px-2 py-3 text-left transition-colors sm:gap-3 sm:px-4 sm:py-3.5"
        style={{ background: open ? `${fg}0f` : 'transparent', color: fg }}
      >
        <Icon name={icon} size={15} className="shrink-0" style={{ color: `${fg}b0` }} />
        <span className="flex-1 text-[0.62rem] font-medium uppercase leading-tight tracking-[0.06em] sm:text-[0.78rem] sm:tracking-[0.12em]">
          {label}
        </span>
        {count > 0 ? (
          <span className="hidden text-[0.72rem] tabular-nums sm:inline" style={{ color: `${fg}80` }}>
            {count}
          </span>
        ) : null}
        {locked ? <Icon name="Lock" size={12} className="shrink-0" style={{ color: `${fg}80` }} /> : null}
        <Icon
          name="ChevronDown"
          size={15}
          className="shrink-0 transition-transform duration-300"
          style={{ color: `${fg}90`, transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </button>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="border-t px-2.5 py-3.5 sm:px-4 sm:py-4" style={{ borderColor: `${fg}1f` }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclosure;