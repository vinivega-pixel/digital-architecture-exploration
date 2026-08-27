import Icon from '@/components/ui/icon';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useReveal } from '@/hooks/use-reveal';

const PRINCIPLES = [
  {
    icon: 'Ruler',
    title: 'Норма прежде красоты',
    text: 'Любое решение опирается на действующий свод правил и подтверждается расчётом.',
  },
  {
    icon: 'GitBranch',
    title: 'Единый маршрут',
    text: 'Изыскания, проект, стройка и эксплуатация живут в одном контуре данных.',
  },
  {
    icon: 'Gauge',
    title: 'Скорость без потерь',
    text: 'Автоматизируем рутину, чтобы инженер занимался инженерией, а не бумагой.',
  },
];

const FAQ = [
  {
    q: 'Работаете ли вы с чужой проектной документацией?',
    a: 'Да. Проводим аудит комплектности и соответствия ПП РФ № 87, готовим ответы на замечания экспертизы, при необходимости дорабатываем разделы и выпускаем рабочую документацию.',
  },
  {
    q: 'Берёте ли вы на себя согласования?',
    a: 'Ведём получение ГПЗУ, технических условий на сети, взаимодействие с градостроительными и земельными службами. Заказчик получает график согласований и статус по каждому обращению.',
  },
  {
    q: 'Можно ли пользоваться только калькуляторами и базой знаний?',
    a: 'Да, доступ к расчётным модулям, шаблонам и поиску норм выдаётся отдельно от проектных услуг — по подписке для проектной организации или подрядчика.',
  },
  {
    q: 'Как платформа связывается с нашей CRM?',
    a: 'Через API и вебхуки: заявки, сделки и статусы объектов синхронизируются в обе стороны. Формы с сайта попадают в вашу воронку без ручного переноса.',
  },
  {
    q: 'Что входит в цифровой двойник при сдаче объекта?',
    a: 'Модель геометрии и инженерных сетей, привязанные к элементам паспорта, сертификаты и акты, регламенты обслуживания и точки подключения данных с датчиков.',
  },
];

const TIMELINE = [
  { year: '2014', text: 'Проектное бюро: первые объекты жилой и общественной застройки.' },
  { year: '2018', text: 'Собственная база шаблонов и расчётных модулей для внутренних нужд.' },
  { year: '2021', text: 'Запуск платформы: калькуляторы, поиск норм, исполнительная документация.' },
  { year: '2024', text: 'Роботизация процессов и ИИ-разбор замечаний экспертизы.' },
  { year: '2026', text: 'Цифровой двойник как обязательный результат сдачи объекта.' },
];

const About = () => {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="about" className="relative border-y border-border bg-card/40 py-24 lg:py-32">
      <div ref={ref} className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <div className={visible ? 'opacity-0 animate-fade-in' : 'opacity-0'}>
              <p className="mono-label">06 · О нас</p>
              <h2 className="mt-4 font-display text-4xl font-semibold uppercase leading-[0.95] tracking-tight sm:text-6xl">
                Институт, <br />
                <span className="text-accent">а не подрядчик</span>
              </h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                ООО «ЦИФРА» — Цифровой институт фундаментального развития архитектуры.
                Мы соединили проектное бюро и продуктовую команду: инженеры формулируют
                задачу, разработчики превращают её в инструмент, которым пользуется
                вся отрасль.
              </p>
            </div>

            <div className="mt-10 space-y-px border border-border bg-border">
              {PRINCIPLES.map((p) => (
                <div key={p.title} className="flex gap-5 bg-background p-6">
                  <Icon name={p.icon} size={22} className="mt-0.5 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-display text-base uppercase tracking-[0.08em] text-foreground">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <p className="mono-label">Хроника</p>
              <div className="mt-6 space-y-0">
                {TIMELINE.map((t) => (
                  <div key={t.year} className="group flex gap-6 border-l border-border pl-6">
                    <span className="relative -ml-[29px] mt-1 flex h-2.5 w-2.5 shrink-0 rounded-full bg-border transition-colors group-hover:bg-primary" />
                    <div className="pb-7">
                      <p className="font-mono text-sm tracking-[0.16em] text-accent">{t.year}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {t.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="mono-label">Частые вопросы</p>
            <Accordion type="single" collapsible className="mt-6 border-t border-border">
              {FAQ.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`} className="border-border">
                  <AccordionTrigger className="py-6 text-left font-display text-lg uppercase tracking-[0.05em] text-foreground hover:text-primary hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 grid grid-cols-2 gap-px border border-border bg-border">
              {[
                { k: '12 лет', v: 'в проектировании' },
                { k: '64', v: 'инженера и разработчика' },
                { k: '38', v: 'регионов присутствия' },
                { k: '96%', v: 'проектов с первого захода' },
              ].map((s) => (
                <div key={s.v} className="bg-background p-7">
                  <p className="font-display text-3xl font-semibold text-primary">{s.k}</p>
                  <p className="mono-label mt-2">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
