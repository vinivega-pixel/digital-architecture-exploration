import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useReveal } from '@/hooks/use-reveal';

const TABS = [
  {
    key: 'rd',
    label: 'Рабочая документация',
    lead: 'Чертежи марок АР, КЖ, КМ, ЭОМ, ОВ, ВК, СС — с узлами, спецификациями и ведомостями объёмов работ.',
    items: [
      { icon: 'Ruler', title: 'Марки АР и КР', text: 'Планы, разрезы, фасады, армирование, металлоконструкции.' },
      { icon: 'Cable', title: 'Инженерные марки', text: 'ЭОМ, ОВ, ВК, СС, АУПС — со схемами и раскладкой трасс.' },
      { icon: 'Boxes', title: 'Спецификации', text: 'Ведомости материалов и объёмов, готовые к закупке.' },
      { icon: 'Layers', title: 'Узлы и детали', text: 'Библиотека типовых узлов, привязанных к нормам.' },
    ],
  },
  {
    key: 'pd',
    label: 'Проектная документация',
    lead: 'Полный состав разделов по Постановлению Правительства РФ № 87 — под государственную и негосударственную экспертизу.',
    items: [
      { icon: 'FileStack', title: 'Разделы 1–12', text: 'ПЗ, ПЗУ, АР, КР, ИОС, ПОС, ООС, ПБ, ОДИ.' },
      { icon: 'ShieldCheck', title: 'Пожарная безопасность', text: 'Расчёт эвакуации, дымоудаления, огнестойкости.' },
      { icon: 'Coins', title: 'Сметная часть', text: 'Сметы по актуальной нормативной базе.' },
      { icon: 'Stamp', title: 'Сопровождение экспертизы', text: 'Ответы на замечания до положительного заключения.' },
    ],
  },
  {
    key: 'iz',
    label: 'Инженерные изыскания',
    lead: 'Данные о площадке, на которых строится весь дальнейший расчёт: рельеф, грунты, вода, экология.',
    items: [
      { icon: 'Compass', title: 'Геодезия', text: 'Топосъёмка М 1:500, вынос осей, исполнительные съёмки.' },
      { icon: 'Mountain', title: 'Геология', text: 'Бурение, лабораторные испытания грунтов, расчёт осадки.' },
      { icon: 'Droplets', title: 'Гидрометеорология', text: 'Уровень грунтовых вод, паводки, водоотведение.' },
      { icon: 'Leaf', title: 'Экология', text: 'Фоновые замеры, оценка воздействия, согласования.' },
    ],
  },
];

const DesignServices = () => {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="design" className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,hsl(var(--primary)/0.1),transparent_55%)]" />
      <div ref={ref} className="relative mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className={visible ? 'opacity-0 animate-fade-in' : 'opacity-0'}>
          <p className="mono-label">01 · Проектирование</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold uppercase leading-[0.95] tracking-tight sm:text-6xl">
            Документация, которую <span className="text-accent">принимают</span> с первого
            раза
          </h2>
        </div>

        <Tabs defaultValue="rd" className="mt-12">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-2 border border-border bg-card p-2">
            {TABS.map((t) => (
              <TabsTrigger
                key={t.key}
                value={t.key}
                className="rounded-none px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map((t) => (
            <TabsContent key={t.key} value={t.key} className="mt-10 animate-fade-in">
              <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">{t.lead}</p>
              <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
                {t.items.map((item) => (
                  <article
                    key={item.title}
                    className="group relative overflow-hidden bg-card p-8 transition-colors hover:bg-secondary"
                  >
                    <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                    <Icon
                      name={item.icon}
                      size={26}
                      className="text-primary transition-transform duration-300 group-hover:-translate-y-1"
                    />
                    <h3 className="mt-6 font-display text-lg uppercase tracking-[0.08em] text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </article>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default DesignServices;
