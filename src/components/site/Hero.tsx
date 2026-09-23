import { HERO_IMAGE } from '@/data/stages';

const FREE = [
  'Строительные калькуляторы',
  'Библиотека документации в PDF',
  'Архив шаблонов документов',
  'Ассистент на базе OpenAI',
];

const PREMIUM = [
  'Автоматизация строительных процессов',
  'Аудит проектной и сметной документации',
  'Разработка проекта под ключ',
  'CRM-сопровождение объекта',
  'Мультиагентная аналитическая сеть',
];

const Column = ({
  kicker,
  items,
  accent,
  delay,
}: {
  kicker: string;
  items: string[];
  accent: string;
  delay: string;
}) => (
  <div className="animate-fade-in text-center" style={{ animationDelay: delay }}>
    <p
      className="text-[0.7rem] uppercase tracking-[0.18em] md:text-[0.76rem]"
      style={{ color: accent }}
    >
      {kicker}
    </p>
    <span className="mx-auto mt-2.5 block h-px w-10" style={{ background: accent, opacity: 0.5 }} />
    <ul className="mt-3 space-y-1.5">
      {items.map((t) => (
        <li key={t} className="text-[0.78rem] leading-[1.5] text-foreground/80 md:text-[0.85rem]">
          {t}
        </li>
      ))}
    </ul>
  </div>
);

const Hero = () => (
  <section id="hero" className="relative min-h-[100svh] w-full overflow-hidden bg-background">
    <img
      src={HERO_IMAGE}
      alt="Готовый жилой район: квартал башен, парк, школа, детский сад, магазины и парковки — вид сверху"
      decoding="async"
      className="absolute inset-0 h-full w-full animate-rise object-cover"
      style={{ objectPosition: 'center 46%' }}
    />
    <div
      className="absolute inset-0"
      style={{
        background:
          'linear-gradient(180deg, var(--hero-x-veil-top) 0%, rgba(14,22,38,.45) 34%, var(--hero-x-veil-bottom) 100%)',
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse 78% 60% at 50% 46%, rgba(10,16,28,.74) 0%, rgba(10,16,28,.32) 62%, transparent 100%)',
      }}
    />

    <div className="relative z-[2] flex min-h-[100svh] flex-col justify-center px-6 pb-28 pt-24 md:px-[60px] md:pb-32">
      <div className="text-center">
        <p className="animate-fade-in text-[0.68rem] uppercase leading-[1.5] tracking-[0.18em] text-foreground [animation-delay:240ms] sm:text-[0.78rem] sm:tracking-[0.2em]">
          Цифровой институт фундаментального развития архитектуры
        </p>
        <h1 className="mt-4 animate-fade-in font-display text-[34px] font-normal leading-[1.05] [animation-delay:400ms] sm:text-[46px] md:text-[60px]">
          <span className="block text-[2.3em] leading-[0.96] tracking-[0.01em] text-foreground">ЦИФРА</span>
        </h1>
      </div>

      <div className="mx-auto mt-10 grid w-full max-w-4xl grid-cols-2 gap-5 sm:gap-10 md:mt-14">
        <Column kicker="Уже доступно" items={FREE} accent="hsl(var(--foreground))" delay="560ms" />
        <Column kicker="Премиум-доступ" items={PREMIUM} accent="var(--hero-accent)" delay="680ms" />
      </div>
    </div>

    <div className="absolute bottom-[26px] left-6 right-6 z-[3] animate-fade-in border-t border-foreground/20 pt-3.5 [animation-delay:800ms] md:left-[60px] md:right-[60px]">
      <p className="mx-auto max-w-[62em] text-center text-[0.76rem] leading-[1.65] text-muted-foreground md:text-[0.84rem]">
        Здесь рады всем: заказчику, застройщику, проектировщику и производственно-техническому отделу — каждый найдёт
        нужный инструмент. Прямо сейчас заказчик проверит смету на достоверность и не переплатит, проектировщик
        возьмёт готовый шаблон и выполнит расчёт по действующим нормам, а специалист ПТО закроет исполнительную
        документацию без разногласий на сдаче.
      </p>
    </div>
  </section>
);

export default Hero;
