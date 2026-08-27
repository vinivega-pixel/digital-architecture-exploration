import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { useReveal, scrollToId } from '@/hooks/use-reveal';

const TWIN_IMG =
  'https://cdn.poehali.dev/projects/973263ae-4d11-4e93-b52f-fdb346792765/files/12368d89-05dc-4d51-a169-b8881fe0245f.jpg';

const LAYERS = [
  { icon: 'Building2', title: 'Геометрия и конструктив', text: 'BIM-модель с осями, отметками и узлами.' },
  { icon: 'Cable', title: 'Инженерные сети', text: 'Электрика, ОВ, ВК и слаботочка в одной модели.' },
  { icon: 'Activity', title: 'Данные эксплуатации', text: 'Датчики, показания, регламенты обслуживания.' },
  { icon: 'FileSearch', title: 'Документы у объекта', text: 'Акт, паспорт и сертификат привязаны к элементу.' },
];

const DigitalTwin = () => {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [layer, setLayer] = useState(0);
  const [depth, setDepth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const p = 1 - rect.top / window.innerHeight;
      setDepth(Math.max(-1, Math.min(1, p)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref]);

  return (
    <section id="twin" className="relative overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,hsl(var(--primary)/0.14),transparent_60%)]" />

      <div ref={ref} className="relative mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className={visible ? 'opacity-0 animate-fade-in' : 'opacity-0'}>
            <p className="mono-label">05 · Цифровой двойник</p>
            <h2 className="mt-4 font-display text-4xl font-semibold uppercase leading-[0.95] tracking-tight sm:text-6xl">
              Объект живёт <span className="text-primary text-glow">в модели</span>
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
              Двойник собирается ещё на стадии проектирования и растёт вместе со
              стройкой. К моменту приёмки заказчик получает не папку с чертежами, а
              работающую модель: любой элемент связан с документами, расчётами и
              историей работ.
            </p>

            <div className="mt-10 space-y-px border border-border bg-border">
              {LAYERS.map((l, i) => (
                <button
                  key={l.title}
                  onMouseEnter={() => setLayer(i)}
                  onFocus={() => setLayer(i)}
                  onClick={() => setLayer(i)}
                  className={`flex w-full items-center gap-5 p-5 text-left transition-colors duration-300 ${
                    layer === i ? 'bg-secondary' : 'bg-background hover:bg-secondary/60'
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center border transition-colors ${
                      layer === i
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    <Icon name={l.icon} size={19} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-base uppercase tracking-[0.08em] text-foreground">
                      {l.title}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">{l.text}</span>
                  </span>
                  <Icon
                    name="ChevronRight"
                    size={16}
                    className={`ml-auto shrink-0 transition-all ${
                      layer === i ? 'text-primary opacity-100' : 'opacity-30'
                    }`}
                  />
                </button>
              ))}
            </div>

            <Button
              onClick={() => scrollToId('contacts')}
              size="lg"
              className="mt-10 h-12 bg-primary px-7 font-mono text-[12px] uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/85"
            >
              Заказать двойник объекта
              <Icon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </div>

          <div className="relative">
            <div
              className="relative aspect-square overflow-hidden border border-border"
              style={{ transform: `translate3d(0, ${depth * -26}px, 0)` }}
            >
              <img
                src={TWIN_IMG}
                alt="Цифровой двойник здания: каркас и инженерные сети"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms]"
                style={{ transform: `scale(${1.05 + layer * 0.03})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
              <div className="grid-lines-fine absolute inset-0 opacity-30 mix-blend-overlay" />

              <div className="absolute bottom-6 left-6 right-6 border border-primary/40 bg-background/85 p-5 backdrop-blur-md">
                <p className="mono-label">Активный слой</p>
                <p className="mt-2 font-display text-xl uppercase tracking-[0.08em] text-primary">
                  {LAYERS[layer].title}
                </p>
              </div>

              <span className="absolute right-6 top-6 flex items-center gap-2 border border-accent/50 bg-background/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-accent" />
                Live-модель
              </span>
            </div>

            <div className="mt-px grid grid-cols-3 gap-px border border-border bg-border">
              {[
                { k: 'LOD 400', v: 'детализация' },
                { k: '6 разделов', v: 'в модели' },
                { k: 'IFC · RVT', v: 'форматы' },
              ].map((s) => (
                <div key={s.v} className="bg-card px-4 py-5 text-center">
                  <p className="font-display text-lg uppercase tracking-[0.06em] text-foreground">
                    {s.k}
                  </p>
                  <p className="mono-label mt-1">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DigitalTwin;
