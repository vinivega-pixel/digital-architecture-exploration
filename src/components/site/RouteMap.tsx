import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useReveal, scrollToId } from '@/hooks/use-reveal';

type Node = {
  code: string;
  title: string;
  icon: string;
  summary: string;
  points: string[];
  target?: string;
};

const NODES: Node[] = [
  {
    code: '01',
    title: 'Изыскания',
    icon: 'Compass',
    summary: 'Геодезия, геология, экология и гидрометеорология по площадке.',
    points: [
      'Топографическая съёмка М 1:500',
      'Инженерно-геологические скважины',
      'Отчёты по СП 47.13330',
    ],
    target: 'design',
  },
  {
    code: '02',
    title: 'Градплан и земля',
    icon: 'MapPinned',
    summary: 'ГПЗУ, ТУ на сети, согласования с земельными службами.',
    points: ['Получение ГПЗУ', 'Технические условия сетей', 'Схема планировочной организации'],
    target: 'design',
  },
  {
    code: '03',
    title: 'Проектная документация',
    icon: 'FileStack',
    summary: 'Полный состав разделов по ПП РФ № 87 под экспертизу.',
    points: ['Разделы ПЗУ, АР, КР, ИОС', 'Пожарная безопасность', 'Сметная документация'],
    target: 'design',
  },
  {
    code: '04',
    title: 'Рабочая документация',
    icon: 'PencilRuler',
    summary: 'Чертежи и спецификации, по которым реально строят.',
    points: ['Марки АР, КЖ, КМ, ЭОМ, ОВ, ВК', 'Ведомости объёмов', 'Узлы и детали'],
    target: 'design',
  },
  {
    code: '05',
    title: 'Расчёты и нормы',
    icon: 'Calculator',
    summary: 'Калькуляторы по 10 этапам: от фундамента до подсветки.',
    points: ['200+ формул с пояснениями', 'Поиск по СП, ГОСТ, ПУЭ', 'Выгрузка расчёта'],
    target: 'calculators',
  },
  {
    code: '06',
    title: 'Автоматизация стройки',
    icon: 'Bot',
    summary: 'Цифровые инструменты, роботизация процессов и ИИ-помощники.',
    points: ['Проверка комплектности', 'ИИ-разбор замечаний', 'Роботизация отчётности'],
    target: 'automation',
  },
  {
    code: '07',
    title: 'Исполнительная документация',
    icon: 'ClipboardCheck',
    summary: 'Акты, журналы, схемы — шаблоны и автозаполнение.',
    points: ['АОСР и АОК', 'Общий и специальные журналы', 'Исполнительные схемы'],
    target: 'products',
  },
  {
    code: '08',
    title: 'Сертификаты и приёмка',
    icon: 'BadgeCheck',
    summary: 'Комплектация паспортов, испытания и акт приёмки объекта.',
    points: ['Реестр паспортов и сертификатов', 'Протоколы испытаний', 'Акт ввода в эксплуатацию'],
    target: 'twin',
  },
];

const RouteMap = () => {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [activeIdx, setActiveIdx] = useState(0);
  const active = NODES[activeIdx];

  return (
    <section id="map" className="relative border-y border-border py-24 lg:py-32">
      <div className="grid-lines-fine pointer-events-none absolute inset-0 opacity-[0.35]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,hsl(var(--accent)/0.1),transparent_55%)]" />

      <div ref={ref} className="relative mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className={visible ? 'opacity-0 animate-fade-in' : 'opacity-0'}>
            <p className="mono-label">Карта маршрутов</p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold uppercase leading-[0.95] tracking-tight sm:text-6xl">
              Путь объекта — <span className="text-primary">от изысканий</span> до акта
              приёмки
            </h2>
          </div>
          <p
            className={`max-w-md text-sm leading-relaxed text-muted-foreground ${
              visible ? 'opacity-0 animate-fade-in' : 'opacity-0'
            }`}
            style={{ animationDelay: '120ms' }}
          >
            Выберите этап на маршруте — увидите, какие документы и сервисы ЦИФРЫ
            закрывают его целиком. Каждый узел связан с рабочим разделом платформы.
          </p>
        </div>

        {/* Линия маршрута */}
        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-[27px] hidden h-px bg-border lg:block" />
          <div
            className="absolute left-0 top-[27px] hidden h-px bg-gradient-to-r from-primary to-accent transition-all duration-700 lg:block"
            style={{ width: `${((activeIdx + 1) / NODES.length) * 100}%` }}
          />

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8 lg:gap-3">
            {NODES.map((node, i) => {
              const isActive = i === activeIdx;
              const isDone = i < activeIdx;
              return (
                <button
                  key={node.code}
                  onClick={() => setActiveIdx(i)}
                  className="group relative flex flex-col items-start gap-3 text-left"
                >
                  <span
                    className={`relative z-10 flex h-14 w-14 items-center justify-center border transition-all duration-300 ${
                      isActive
                        ? 'border-primary bg-primary text-primary-foreground glow-ring'
                        : isDone
                          ? 'border-accent/60 bg-background text-accent'
                          : 'border-border bg-background text-muted-foreground group-hover:border-primary/60 group-hover:text-primary'
                    }`}
                  >
                    <Icon name={node.icon} size={20} />
                  </span>
                  <span className="block">
                    <span
                      className={`block font-mono text-[10px] tracking-[0.24em] ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {node.code}
                    </span>
                    <span
                      className={`mt-1 block font-display text-sm uppercase leading-tight tracking-[0.08em] transition-colors ${
                        isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                      }`}
                    >
                      {node.title}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Панель активного узла */}
        <div
          key={active.code}
          className="mt-14 grid animate-fade-in gap-px border border-border bg-border lg:grid-cols-[1.2fr_1fr]"
        >
          <div className="bg-card p-8 lg:p-12">
            <span className="mono-label">Этап {active.code}</span>
            <h3 className="mt-4 font-display text-3xl font-semibold uppercase tracking-tight sm:text-4xl">
              {active.title}
            </h3>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">{active.summary}</p>
            <button
              onClick={() => active.target && scrollToId(active.target)}
              className="story-link mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary"
            >
              Перейти в раздел
              <Icon name="ArrowUpRight" size={14} />
            </button>
          </div>
          <div className="bg-background p-8 lg:p-12">
            <p className="mono-label">Что входит</p>
            <ul className="mt-6 space-y-4">
              {active.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-foreground">
                  <Icon name="Check" size={16} className="mt-0.5 shrink-0 text-accent" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RouteMap;
