import Icon from '@/components/ui/icon';
import { scrollToId } from '@/hooks/use-reveal';

const COLUMNS = [
  {
    title: 'Услуги',
    links: [
      { label: 'Проектная документация', id: 'design' },
      { label: 'Рабочая документация', id: 'design' },
      { label: 'Инженерные изыскания', id: 'design' },
      { label: 'Автоматизация', id: 'automation' },
    ],
  },
  {
    title: 'Платформа',
    links: [
      { label: 'Цифровые продукты', id: 'products' },
      { label: 'Калькуляторы', id: 'calculators' },
      { label: 'Поиск норм', id: 'calculators' },
      { label: 'Цифровой двойник', id: 'twin' },
    ],
  },
  {
    title: 'Компания',
    links: [
      { label: 'О нас', id: 'about' },
      { label: 'Карта маршрутов', id: 'map' },
      { label: 'Контакты', id: 'contacts' },
    ],
  },
];

const Footer = () => (
  <footer className="relative border-t border-border bg-card/60">
    <div className="grid-lines-fine pointer-events-none absolute inset-0 opacity-20" />
    <div className="relative mx-auto max-w-[1400px] px-5 py-16 lg:px-10 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center border border-primary/50 bg-primary/10">
              <Icon name="Hexagon" size={20} className="text-primary" />
            </span>
            <span className="font-display text-xl font-semibold uppercase tracking-[0.24em]">
              Цифра
            </span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            ООО «ЦИФРА» — Цифровой институт фундаментального развития архитектуры.
            Проектирование, автоматизация и цифровые продукты для строительной отрасли.
          </p>
          <div className="mt-6 inline-flex w-fit gap-px border border-border bg-border">
            {['Send', 'MessageCircle', 'Mail', 'Globe'].map((ic) => (
              <a
                key={ic}
                href="#contacts"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId('contacts');
                }}
                aria-label={ic}
                className="flex h-11 w-11 items-center justify-center bg-background text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Icon name={ic} size={17} />
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="mono-label">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => scrollToId(l.id)}
                      className="story-link text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          © 2026 ООО «ЦИФРА». Все права защищены
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Политика конфиденциальности · Публичная оферта
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;