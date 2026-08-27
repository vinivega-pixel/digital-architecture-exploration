import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { scrollToId } from '@/hooks/use-reveal';

const NAV = [
  { id: 'map', label: 'Маршруты' },
  { id: 'design', label: 'Проектирование' },
  { id: 'automation', label: 'Автоматизация' },
  { id: 'products', label: 'Продукты' },
  { id: 'calculators', label: 'Калькуляторы' },
  { id: 'twin', label: 'Цифровой двойник' },
  { id: 'about', label: 'О нас' },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('map');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const found = [...NAV]
        .reverse()
        .find((item) => {
          const el = document.getElementById(item.id);
          return el && el.getBoundingClientRect().top <= 140;
        });
      if (found) setActive(found.id);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    setTimeout(() => scrollToId(id), 60);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-border bg-background/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-6 px-5 lg:px-10">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group flex items-center gap-3 text-left"
        >
          <span className="relative flex h-10 w-10 items-center justify-center border border-primary/50 bg-primary/10">
            <span className="absolute inset-0 animate-pulse-glow bg-primary/10" />
            <Icon name="Hexagon" size={20} className="relative text-primary" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-xl font-semibold uppercase tracking-[0.24em] text-foreground">
              Цифра
            </span>
            <span className="mono-label hidden sm:block">ООО · институт архитектуры</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 xl:flex">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                active === item.id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => go('contacts')}
            className="hidden bg-accent font-mono text-[11px] uppercase tracking-[0.18em] text-accent-foreground hover:bg-accent/85 sm:inline-flex"
          >
            Заявка
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Меню"
                className="flex h-10 w-10 items-center justify-center border border-border text-foreground transition-colors hover:border-primary hover:text-primary xl:hidden"
              >
                <Icon name="Menu" size={18} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] border-border bg-card sm:w-[380px]">
              <div className="mt-10 flex flex-col gap-1">
                <p className="mono-label mb-4">Навигация</p>
                {NAV.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => go(item.id)}
                    className="group flex items-center justify-between border-b border-border/70 py-4 text-left"
                  >
                    <span className="font-display text-lg uppercase tracking-[0.14em] text-foreground group-hover:text-primary">
                      {item.label}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </button>
                ))}
                <Button
                  onClick={() => go('contacts')}
                  className="mt-8 w-full bg-accent font-mono text-[11px] uppercase tracking-[0.18em] text-accent-foreground hover:bg-accent/85"
                >
                  Оставить заявку
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;