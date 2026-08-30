import { useState } from 'react';
import Icon from '@/components/ui/icon';
import MobileSheet from './MobileSheet';
import MobileFree from './MobileFree';
import MobilePremium from './MobilePremium';
import { mobileCopy } from '@/data/mobileCopy';
import type { Stage } from '@/data/stages';

export type MobileTab = 'calcs' | 'templates' | 'norms' | 'agent' | 'repair' | 'products';

type Row = { id: MobileTab; icon: string; label: string; side: 'free' | 'premium' };

const MobileStage = ({ stage, counts }: { stage: Stage; counts: Record<string, number> }) => {
  const [tab, setTab] = useState<MobileTab | null>(null);
  const { palette } = stage;

  const rows: Row[] = [
    { id: 'calcs', icon: 'Calculator', label: mobileCopy.labels.calcs, side: 'free' },
    { id: 'templates', icon: 'FileText', label: mobileCopy.labels.templates, side: 'free' },
    { id: 'norms', icon: 'BookOpen', label: mobileCopy.labels.norms, side: 'free' },
    { id: 'agent', icon: 'MessagesSquare', label: mobileCopy.labels.agent, side: 'premium' },
    { id: 'repair', icon: 'ShieldCheck', label: mobileCopy.labels.repair, side: 'premium' },
    { id: 'products', icon: 'Cpu', label: mobileCopy.labels.products, side: 'premium' },
  ];

  const free = rows.filter((r) => r.side === 'free');
  const prem = rows.filter((r) => r.side === 'premium');
  const active = rows.find((r) => r.id === tab);
  const sheetFree = active?.side === 'free';
  const fg = sheetFree ? palette.leftFg : palette.rightFg;
  const bg = sheetFree ? palette.leftBg : palette.rightBg;

  const Group = ({
    items,
    label,
    icon,
    itemBg,
    itemFg,
  }: {
    items: Row[];
    label: string;
    icon: string;
    itemBg: string;
    itemFg: string;
  }) => (
    <div className="px-4 py-6" style={{ background: itemBg, color: itemFg }}>
      <span
        className="inline-flex items-center gap-1.5 border px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.16em]"
        style={{ borderColor: `${itemFg}55` }}
      >
        <Icon name={icon} size={12} />
        {label}
      </span>

      <div className="mt-4 space-y-2">
        {items.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setTab(r.id)}
            className="flex w-full items-center gap-3 border px-3.5 py-3.5 text-left"
            style={{ borderColor: `${itemFg}30`, color: itemFg }}
          >
            <Icon name={r.icon} size={17} className="shrink-0" style={{ color: `${itemFg}b0` }} />
            <span className="flex-1 text-[0.86rem] font-medium leading-tight">{r.label}</span>
            {counts[r.id] ? (
              <span className="text-[0.74rem] tabular-nums" style={{ color: `${itemFg}80` }}>
                {counts[r.id]}
              </span>
            ) : null}
            <Icon name="ChevronRight" size={16} className="shrink-0" style={{ color: `${itemFg}80` }} />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="md:hidden">
      <Group items={free} label="Полезное" icon="Unlock" itemBg={palette.leftBg} itemFg={palette.leftFg} />
      <Group items={prem} label="Премиум" icon="Sparkles" itemBg={palette.rightBg} itemFg={palette.rightFg} />

      <MobileSheet
        open={Boolean(active)}
        title={active?.label ?? ''}
        subtitle={stage.phase}
        fg={fg}
        bg={bg}
        onClose={() => setTab(null)}
      >
        {active && sheetFree ? <MobileFree stage={stage} tab={active.id} /> : null}
        {active && !sheetFree ? <MobilePremium stage={stage} tab={active.id} /> : null}
      </MobileSheet>
    </div>
  );
};

export default MobileStage;
