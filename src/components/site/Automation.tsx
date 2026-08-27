import Icon from '@/components/ui/icon';
import { useReveal } from '@/hooks/use-reveal';

const BLOCKS = [
  {
    tag: 'Цифровые инструменты',
    icon: 'MousePointerClick',
    title: 'Инструменты вместо ручной рутины',
    text: 'Автоматическая проверка комплектности томов, сверка спецификаций с ведомостями, генерация титульных листов и штампов по шаблону заказчика.',
    metrics: [
      { k: '−68%', v: 'времени на комплектацию' },
      { k: '1 клик', v: 'до выгрузки тома' },
    ],
  },
  {
    tag: 'Роботизация',
    icon: 'Bot',
    title: 'Роботы для отчётности и согласований',
    text: 'Сценарии-роботы собирают исполнительную документацию, рассылают её по подрядчикам, отслеживают сроки и напоминают о просроченных актах.',
    metrics: [
      { k: '24/7', v: 'работа сценариев' },
      { k: '0', v: 'потерянных актов' },
    ],
  },
  {
    tag: 'ИИ-решения',
    icon: 'BrainCircuit',
    title: 'ИИ, который читает замечания',
    text: 'Модель разбирает замечания экспертизы, находит нужный пункт норматива, предлагает формулировку ответа и подсказывает, какой раздел править.',
    metrics: [
      { k: '3 мин', v: 'на разбор замечания' },
      { k: '900+', v: 'документов в базе' },
    ],
  },
];

const Automation = () => {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="automation" className="relative border-y border-border bg-card/40 py-24 lg:py-32">
      <div className="grid-lines pointer-events-none absolute inset-0 animate-grid-drift opacity-25" />
      <div ref={ref} className="relative mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className={visible ? 'opacity-0 animate-fade-in' : 'opacity-0'}>
            <p className="mono-label">02 · Автоматизация</p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold uppercase leading-[0.95] tracking-tight sm:text-6xl">
              Процессы стройки <span className="text-primary">на автопилоте</span>
            </h2>
          </div>
          <p
            className={`max-w-md text-sm leading-relaxed text-muted-foreground ${
              visible ? 'opacity-0 animate-fade-in' : 'opacity-0'
            }`}
            style={{ animationDelay: '120ms' }}
          >
            Мы не продаём «внедрение ради внедрения». Каждый инструмент закрывает конкретную
            потерю времени в проектном офисе или на площадке.
          </p>
        </div>

        <div className="mt-16 space-y-px border border-border bg-border">
          {BLOCKS.map((b, i) => (
            <article
              key={b.tag}
              className="group grid gap-8 bg-background p-8 transition-colors duration-500 hover:bg-card lg:grid-cols-[auto_1fr_auto] lg:items-center lg:p-12"
            >
              <div className="flex items-center gap-5">
                <span className="font-mono text-sm text-muted-foreground">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex h-16 w-16 items-center justify-center border border-border bg-secondary text-primary transition-all duration-500 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon name={b.icon} size={26} />
                </span>
              </div>

              <div className="max-w-2xl">
                <p className="mono-label">{b.tag}</p>
                <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.04em] text-foreground sm:text-3xl">
                  {b.title}
                </h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">{b.text}</p>
              </div>

              <div className="flex gap-8 lg:flex-col lg:gap-5 lg:border-l lg:border-border lg:pl-10">
                {b.metrics.map((m) => (
                  <div key={m.v}>
                    <p className="font-display text-3xl font-semibold text-accent">{m.k}</p>
                    <p className="mono-label mt-1">{m.v}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Automation;
