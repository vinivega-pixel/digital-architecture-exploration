import Icon from '@/components/ui/icon';
import Reveal from './Reveal';

const VALUES = [
  { icon: 'Compass', title: 'Инженерная точность', text: 'Каждое решение опирается на норматив и расчёт, а не на привычку.' },
  { icon: 'Share2', title: 'Одна среда данных', text: 'Изыскания, модель, документация и стройка живут в общем контуре.' },
  { icon: 'Handshake', title: 'Сотрудничество', text: 'Мы не продаём услугу, а встраиваемся в процесс заказчика.' },
];

const About = () => (
  <section id="about" className="relative border-t border-border bg-secondary/40 py-24 md:py-32">
    <div className="container">
      <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
        <div>
          <div className="flex items-center gap-4">
            <span className="font-display text-[0.85rem] italic text-primary">XII</span>
            <span className="rubric">О нас</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <h2 className="mt-5 font-display text-[2rem] leading-[1.1] text-foreground sm:text-[2.75rem] md:text-[3.25rem]">
            Институт, соединяющий архитектуру и цифровые технологии
          </h2>
          <p className="mt-8 max-w-[40em] font-display text-[1.35rem] italic leading-[1.5] text-foreground">
            ЦИФРА — Цифровой институт фундаментального развития архитектуры.
          </p>
          <p className="mt-6 max-w-[42em] text-[0.95rem] leading-[1.8] text-muted-foreground">
            Мы проектируем, считаем и автоматизируем. Сайт устроен как история одного участка: от заросшего пустыря до
            красной ленточки. На каждом этапе слева — бесплатные расчёты, шаблоны и нормы, справа — цифровые продукты
            института: ИИ-агенты, офлайн-программы и готовые комплекты документации.
          </p>
          <p className="mt-5 max-w-[42em] text-[0.95rem] leading-[1.8] text-muted-foreground">
            Связь — по электронной почте:{' '}
            <a href="mailto:info@cifra-institute.ru" className="link-underline text-primary">
              info@cifra-institute.ru
            </a>
          </p>
          <div className="mt-10 grid grid-cols-3 gap-px border border-border bg-border">
            {[
              { v: '2016', l: 'год основания' },
              { v: '240+', l: 'проектов и комплектов' },
              { v: '19', l: 'регионов работы' },
            ].map((s) => (
              <div key={s.l} className="bg-card p-6">
                <p className="font-display text-2xl text-primary md:text-3xl">{s.v}</p>
                <p className="mt-2 text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center gap-px bg-border">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 90}>
              <div className="flex gap-6 bg-card p-8">
                <Icon name={v.icon} size={24} className="mt-1 shrink-0 text-primary" />
                <div>
                  <h3 className="font-display text-[1.4rem] text-card-foreground">{v.title}</h3>
                  <p className="mt-2 text-[0.9rem] leading-[1.7] text-muted-foreground">{v.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default About;
