import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { scrollToId } from '@/hooks/use-reveal';

const PLAN_IMG =
  'https://cdn.poehali.dev/projects/973263ae-4d11-4e93-b52f-fdb346792765/files/04bcf983-fe5a-44dd-b13a-2fa1e599c379.jpg';

const STATS = [
  { value: '480+', label: 'объектов в работе' },
  { value: '17', label: 'разделов ПП РФ 87' },
  { value: '200+', label: 'расчётных формул' },
  { value: '24/7', label: 'доступ к платформе' },
];

const Hero = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="hero" className="relative isolate min-h-[100svh] overflow-hidden pt-[72px]">
      {/* Слой 1 — градостроительный план */}
      <div
        className="absolute inset-0 -z-30 bg-cover bg-[position:70%_35%] opacity-90"
        style={{
          backgroundImage: `url(${PLAN_IMG})`,
          transform: `translate3d(0, ${offset * 0.25}px, 0) scale(1.14)`,
        }}
      />
      {/* Слой 2 — сетка */}
      <div
        className="grid-lines absolute inset-0 -z-20 opacity-40"
        style={{ transform: `translate3d(0, ${offset * 0.1}px, 0)` }}
      />
      {/* Слой 3 — виньетки и свечение */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,hsl(var(--primary)/0.22),transparent_60%)]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/45 to-background" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/75 to-background/10" />
      <div className="noise-overlay pointer-events-none absolute inset-0 -z-10 opacity-[0.05] mix-blend-overlay" />

      {/* Сканирующая линия */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[100svh] overflow-hidden">
        <div className="h-px w-full animate-scan bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-72px)] max-w-[1400px] flex-col justify-center px-5 py-16 lg:px-10 lg:pb-32">
        <div className="max-w-4xl">
          <div
            className="mb-8 flex flex-wrap items-center gap-3 opacity-0 animate-fade-in"
            style={{ animationDelay: '80ms' }}
          >
            <span className="flex items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
              <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-primary" />
              Вариант 6 · генплан
            </span>
            <span className="mono-label">ООО «ЦИФРА» · с 2014 года</span>
          </div>

          <h1
            className="font-display text-[11vw] font-semibold uppercase leading-[0.88] tracking-[-0.01em] text-foreground opacity-0 animate-fade-in sm:text-[7vw] lg:text-[4.6rem] xl:text-[5.4rem]"
            style={{ animationDelay: '160ms' }}
          >
            Цифровой институт
            <span className="block text-glow text-primary">фундаментального</span>
            <span className="block">
              развития{' '}
              <span className="text-accent">архитектуры</span>
            </span>
          </h1>

          <p
            className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground opacity-0 animate-fade-in sm:text-lg"
            style={{ animationDelay: '260ms' }}
          >
            Проектируем, считаем и автоматизируем. Ведём объект от инженерных изысканий
            до акта приёмки: рабочая и проектная документация, согласования,
            строительные калькуляторы, база норм и цифровой двойник — в одной платформе.
          </p>

          <div
            className="mt-10 flex flex-wrap items-center gap-4 opacity-0 animate-fade-in"
            style={{ animationDelay: '360ms' }}
          >
            <Button
              size="lg"
              onClick={() => scrollToId('map')}
              className="group h-12 bg-primary px-7 font-mono text-[12px] uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/85"
            >
              Карта маршрутов
              <Icon
                name="ArrowRight"
                size={16}
                className="ml-2 transition-transform group-hover:translate-x-1"
              />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToId('calculators')}
              className="h-12 border-accent/50 bg-transparent px-7 font-mono text-[12px] uppercase tracking-[0.2em] text-accent hover:bg-accent/10 hover:text-accent"
            >
              <Icon name="Calculator" size={16} className="mr-2" />
              Открыть калькуляторы
            </Button>
          </div>
        </div>

        <div
          className="mt-16 grid grid-cols-2 gap-px border border-border bg-border opacity-0 animate-fade-in lg:mt-24 lg:grid-cols-4"
          style={{ animationDelay: '460ms' }}
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className="group bg-background/70 px-5 py-6 backdrop-blur-sm transition-colors hover:bg-card"
            >
              <p className="font-display text-4xl font-semibold text-foreground transition-colors group-hover:text-primary">
                {s.value}
              </p>
              <p className="mono-label mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => scrollToId('map')}
        aria-label="Прокрутить вниз"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-primary lg:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <Icon name="ChevronsDown" size={18} className="animate-float-slow" />
      </button>
    </section>
  );
};

export default Hero;