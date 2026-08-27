import { useState, type ReactNode } from 'react';
import Icon from '@/components/ui/icon';

type Props = {
  icon: string;
  label: string;
  count: number;
  fg: string;
  locked?: boolean;
  children: ReactNode;
};

const Disclosure = ({ icon, label, count, fg, locked, children }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border" style={{ borderColor: `${fg}2e` }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors"
        style={{ background: open ? `${fg}0f` : 'transparent', color: fg }}
      >
        <Icon name={icon} size={16} style={{ color: `${fg}b0` }} />
        <span className="flex-1 text-[0.78rem] font-medium uppercase tracking-[0.12em]">{label}</span>
        <span className="text-[0.72rem] tabular-nums" style={{ color: `${fg}80` }}>
          {count}
        </span>
        {locked ? <Icon name="Lock" size={13} style={{ color: `${fg}80` }} /> : null}
        <Icon
          name="ChevronDown"
          size={16}
          className="transition-transform duration-300"
          style={{ color: `${fg}90`, transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </button>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="border-t px-4 py-4" style={{ borderColor: `${fg}1f` }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclosure;
