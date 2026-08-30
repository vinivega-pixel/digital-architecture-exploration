import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { mobileCopy } from '@/data/mobileCopy';

const KEY = 'cifra_desktop_hint';

/** Подсказка на телефоне: полная версия удобнее с компьютера или планшета. */
const DesktopHint = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) return;
    setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="border-b border-border bg-card px-4 py-3 md:hidden">
      <div className="flex items-start gap-3">
        <Icon name="MonitorSmartphone" size={17} className="mt-0.5 shrink-0 text-primary" />
        <p className="flex-1 text-[0.78rem] leading-relaxed text-muted-foreground">{mobileCopy.hero.tip}</p>
        <button
          type="button"
          aria-label="Скрыть подсказку"
          onClick={() => {
            sessionStorage.setItem(KEY, '1');
            setShow(false);
          }}
          className="-mr-1 shrink-0 p-1 text-muted-foreground"
        >
          <Icon name="X" size={16} />
        </button>
      </div>
    </div>
  );
};

export default DesktopHint;
