import Icon from '@/components/ui/icon';
import Reveal from './Reveal';
import { scrollTo } from './Header';

const LIST = [
  'Инженерные изыскания',
  'Проектная документация',
  'Рабочая документация',
  'Сопровождение экспертизы',
  'Авторский надзор',
  'Аудит смет и проектов',
  'Исполнительная документация',
];

const Services = () => (
  <section className="relative overflow-hidden bg-[hsl(var(--ink))] py-20 md:py-24">
    <img
      src="/services-bg.jpg"
      alt=""
      loading="lazy"
      className="absolute inset-y-0 right-0 h-full w-[58%] object-cover opacity-70"
    />
    <div
      className="absolute inset-0"
      style={{ background: 'linear-gradient(95deg, hsl(var(--ink)) 34%, hsl(var(--ink) / .9) 48%, transparent 100%)' }}
    />

    <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Reveal>
          <p className="text-[0.82rem] text-white/50">Нужен не только инструмент?</p>
          <h2 className="mt-3 font-display text-[1.8rem] leading-[1.15] text-white md:text-[2.3rem]">
            Мы сделаем работу за вас
          </h2>
          <p className="mt-5 max-w-[30em] text-[0.92rem] leading-[1.75] text-white/60">
            ЦИФРА предлагает полный спектр инженерных и проектных услуг — от изысканий до сопровождения экспертизы и
            авторского надзора.
          </p>
          <button
            onClick={() => scrollTo('premium')}
            className="mt-8 flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-[0.86rem] font-medium text-[#0f1d2e] transition-opacity hover:opacity-90"
          >
            Заказать услугу
            <Icon name="ArrowRight" size={15} />
          </button>
        </Reveal>

        <Reveal delay={120}>
          <p className="font-display text-[1.15rem] text-white">Цифровые услуги</p>
          <div className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {LIST.map((t, i) => (
              <button
                key={t}
                onClick={() => scrollTo('premium')}
                className="flex items-baseline gap-3 border-b border-white/10 pb-3 text-left transition-colors hover:border-white/40"
              >
                <span className="text-[0.78rem] tabular-nums text-white/35">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1 text-[0.88rem] text-white/80">{t}</span>
                <Icon name="ArrowUpRight" size={14} className="shrink-0 text-white/35" />
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

export default Services;
