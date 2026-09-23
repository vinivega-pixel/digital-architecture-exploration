import Icon from '@/components/ui/icon';
import Reveal from './Reveal';
import { scrollTo } from './Header';

const ITEMS = [
  {
    img: '/people/client.jpg',
    alt: 'Заказчик на фоне жилых корпусов',
    title: 'Заказчикам',
    text: 'Контроль проекта, аудит сметы и решений, документы и расчёты.',
    to: 'premium',
  },
  {
    img: '/people/designer.jpg',
    alt: 'Проектировщица за работой с чертежами',
    title: 'Проектировщикам',
    text: 'Расчёты, нормы, шаблоны документов и инженерные инструменты.',
    to: 'path',
  },
  {
    img: '/people/builder.jpg',
    alt: 'Прораб на строительной площадке',
    title: 'Строителям',
    text: 'Рабочая документация, нормативы, контроль и сопровождение.',
    to: 'path',
  },
  {
    img: '/people/org.jpg',
    alt: 'Инженеры проектной организации',
    title: 'Проектным организациям',
    text: 'Цифровые инструменты и автоматизация процессов на объектах.',
    to: 'premium',
  },
];

const Audience = () => (
  <section id="audience" className="scroll-mt-20 bg-background py-20 md:py-24">
    <div className="mx-auto max-w-[1400px] px-5 md:px-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,3fr)] lg:gap-12">
        <Reveal>
          <h2 className="font-display text-[1.7rem] leading-[1.15] text-foreground md:text-[2.1rem]">
            Кому это нужно
          </h2>
          <p className="mt-4 text-[0.9rem] leading-[1.7] text-muted-foreground">
            ЦИФРА — для всех, кто работает в строительстве.
          </p>
          <button
            onClick={() => scrollTo('premium')}
            className="mt-5 flex items-center gap-2 text-[0.88rem] font-medium text-primary"
          >
            Подробнее
            <Icon name="ArrowRight" size={15} />
          </button>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ITEMS.map((it, i) => (
            <Reveal key={it.title} delay={i * 70}>
              <button
                onClick={() => scrollTo(it.to)}
                className="group flex h-full w-full flex-col overflow-hidden rounded-2xl bg-card text-left transition-colors hover:bg-secondary"
              >
                <img
                  src={it.img}
                  alt={it.alt}
                  loading="lazy"
                  className="h-[150px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="flex flex-1 flex-col p-6">
                  <span className="font-display text-[1.05rem] text-foreground">{it.title}</span>
                  <span className="mt-2.5 flex-1 text-[0.82rem] leading-[1.65] text-muted-foreground">{it.text}</span>
                  <Icon name="ArrowRight" size={15} className="mt-5 self-end text-muted-foreground group-hover:text-primary" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Audience;
