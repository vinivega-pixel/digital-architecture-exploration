import { HERO_IMAGE } from '@/data/stages';

const Hero = () => (
  <section id="hero" className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-background">
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
          'linear-gradient(180deg, var(--hero-x-veil-top) 0%, rgba(14,22,38,.42) 38%, var(--hero-x-veil-bottom) 100%)',
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse 70% 55% at 50% 48%, rgba(10,16,28,.72) 0%, rgba(10,16,28,.30) 62%, transparent 100%)',
      }}
    />

    <div className="absolute inset-0 z-[2] grid grid-cols-1 items-center px-6 md:grid-cols-[1fr_auto_1fr] md:px-[60px]">
      <p className="ml-auto hidden max-w-[15em] animate-fade-in border-r-2 border-foreground/40 pr-6 text-right text-[0.78rem] uppercase leading-[1.5] tracking-[0.12em] text-foreground [animation-delay:560ms] md:block">
        Полезная сторона
        <span className="mt-2 block text-[0.9em] normal-case tracking-[0.02em] text-foreground/75">
          Бесплатный доступ при регистрации к дорожным картам проектов, шаблонам документов, загрузка расчётов PDF
        </span>
      </p>

      <div className="text-center">
        <p className="mb-[18px] animate-fade-in text-[0.82rem] uppercase tracking-[0.2em] text-foreground [animation-delay:240ms]">
          Институт цифрового развития архитектуры
        </p>
        <h1 className="animate-fade-in font-display text-[34px] font-normal leading-[1.05] [animation-delay:400ms] sm:text-[46px] md:text-[60px]">
          <span className="block text-[2.3em] leading-[0.96] tracking-[0.01em] text-foreground">ЦИФРА</span>
        </h1>
        <p className="mx-auto mt-[22px] max-w-[32em] animate-fade-in text-[0.95rem] leading-[1.6] text-muted-foreground [animation-delay:560ms]">
          Слева — полезное и бесплатное: считаете и решаете сами, мы даём расчёты, шаблоны и нормы. Справа — премиум:
          цифровые продукты института, с которыми строителю проще.
        </p>
      </div>

      <p className="mr-auto hidden max-w-[15em] animate-fade-in border-l-2 border-primary/60 pl-6 text-left text-[0.78rem] uppercase leading-[1.5] tracking-[0.12em] text-foreground [animation-delay:560ms] md:block">
        Премиум-сторона
        <span className="mt-2 block text-[0.9em] normal-case tracking-[0.02em] text-foreground/75">
          Офлайн-агенты, CRM, ИИ-анализ документации. Разработка документов под ключ
        </span>
      </p>
    </div>

    <div className="absolute bottom-[34px] left-6 right-6 z-[3] flex animate-fade-in justify-between border-t border-foreground/20 pt-3.5 text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground [animation-delay:720ms] md:left-[60px] md:right-[60px] md:text-[0.75rem]">
      <span>ООО «Цифра»</span>
      <span className="hidden sm:inline">В помощь строителям</span>
    </div>
  </section>
);

export default Hero;
