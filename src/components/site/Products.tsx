import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useReveal, scrollToId } from '@/hooks/use-reveal';

type Product = {
  id: string;
  name: string;
  icon: string;
  tag: string;
  short: string;
  full: string;
  includes: string[];
  format: string;
};

const PRODUCTS: Product[] = [
  {
    id: 'templates',
    name: 'База шаблонов',
    icon: 'FolderOpen',
    tag: 'Документы',
    short: 'Более 340 бланков и форм: от задания на проектирование до акта приёмки.',
    full: 'Структурированная библиотека документов проектного офиса и стройплощадки. Каждый шаблон привязан к этапу маршрута и снабжён комментарием: кто заполняет, кто подписывает, куда подшивается.',
    includes: [
      'Задания на проектирование и ТЗ',
      'Договоры и допсоглашения',
      'Формы КС-2, КС-3, КС-6а',
      'Акты скрытых работ и журналы',
    ],
    format: 'DOCX · XLSX · PDF',
  },
  {
    id: 'calc',
    name: 'Расчётные модули',
    icon: 'Sigma',
    tag: 'Инженерия',
    short: 'Формулы по 10 этапам объекта — с пояснением каждой переменной.',
    full: 'Расчётное ядро платформы: нагрузки и фундаменты, теплотехника, электрика, слаботочка, пожарная безопасность, кровля и молниезащита, благоустройство и подсветка. Формулы сопровождаются нормативной ссылкой и допустимыми диапазонами.',
    includes: [
      'Снеговые и ветровые нагрузки',
      'Теплотехника ограждающих конструкций',
      'Сечения кабелей и падение напряжения',
      'Эвакуация, дымоудаление, огнетушители',
    ],
    format: 'Онлайн-калькуляторы',
  },
  {
    id: 'exec',
    name: 'Исполнительная документация',
    icon: 'ClipboardList',
    tag: 'Стройка',
    short: 'Автосбор комплекта исполнительной с контролем сроков и подписантов.',
    full: 'Модуль ведёт реестр актов, журналов и схем по каждому объекту. Видно, что уже подписано, что просрочено и чего не хватает для передачи комплекта заказчику.',
    includes: [
      'Реестр АОСР и АОК',
      'Общий и специальные журналы',
      'Паспорта и сертификаты материалов',
      'Комплектация тома к сдаче',
    ],
    format: 'Веб-модуль',
  },
  {
    id: 'planner',
    name: 'Планеры и CRM',
    icon: 'KanbanSquare',
    tag: 'Управление',
    short: 'Задачи проектного офиса, сроки, загрузка команды и воронка заявок.',
    full: 'Планер строится вокруг маршрута объекта: этап — задачи — ответственные — сроки. CRM подхватывает заявки с сайта и из форм, ведёт клиента до договора и связывает сделку с проектом.',
    includes: [
      'Доски задач по этапам',
      'Загрузка и график специалистов',
      'Воронка заявок и сделок',
      'Интеграция с формами сайта',
    ],
    format: 'Веб-платформа',
  },
  {
    id: 'knowledge',
    name: 'База знаний',
    icon: 'Library',
    tag: 'Нормы',
    short: 'СП, ГОСТ, ПУЭ и регламенты — с поиском по смыслу, а не по номеру.',
    full: 'Поиск по нормативной базе с подсказками: вводите задачу словами — получаете пункт норматива, формулу и типовое решение. База обновляется вместе с изменениями документов.',
    includes: [
      'Своды правил и ГОСТ',
      'ПУЭ и отраслевые регламенты',
      'Разъяснения по ПП РФ 87',
      'Типовые решения и узлы',
    ],
    format: 'Поисковый сервис',
  },
  {
    id: 'integration',
    name: 'Интеграции',
    icon: 'Workflow',
    tag: 'Связка',
    short: 'Формы, почта, мессенджеры и внешние CRM — в одном контуре.',
    full: 'Заявки с сайта, письма и сообщения попадают в единый контур: ничего не теряется, каждая заявка получает ответственного и срок ответа.',
    includes: [
      'Формы заявок на сайте',
      'Почтовые уведомления',
      'Обмен с внешними CRM',
      'Выгрузка отчётов',
    ],
    format: 'API · вебхуки',
  },
];

const Products = () => {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [open, setOpen] = useState<Product | null>(null);

  return (
    <section id="products" className="relative py-24 lg:py-32">
      <div ref={ref} className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className={visible ? 'opacity-0 animate-fade-in' : 'opacity-0'}>
          <p className="mono-label">03 · Цифровые продукты и программы</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold uppercase leading-[0.95] tracking-tight sm:text-6xl">
            Шесть модулей, которые <span className="text-primary">закрывают офис</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <button
              key={p.id}
              onClick={() => setOpen(p)}
              className="group relative flex flex-col items-start overflow-hidden bg-card p-8 text-left transition-colors duration-300 hover:bg-secondary lg:p-10"
            >
              <span className="absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-primary to-accent transition-transform duration-500 group-hover:scale-x-100" />
              <div className="flex w-full items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center border border-border bg-background text-primary transition-colors group-hover:border-primary/60">
                  <Icon name={p.icon} size={22} />
                </span>
                <Badge
                  variant="outline"
                  className="border-accent/40 font-mono text-[10px] uppercase tracking-[0.18em] text-accent"
                >
                  {p.tag}
                </Badge>
              </div>
              <h3 className="mt-8 font-display text-2xl uppercase tracking-[0.04em] text-foreground">
                {p.name}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{p.short}</p>
              <span className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                Подробнее
                <Icon
                  name="ArrowRight"
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-card sm:max-w-2xl">
          {open && (
            <>
              <DialogHeader>
                <div className="mb-4 flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center border border-primary/50 bg-primary/10 text-primary">
                    <Icon name={open.icon} size={22} />
                  </span>
                  <span className="mono-label">{open.tag}</span>
                </div>
                <DialogTitle className="text-left font-display text-3xl font-semibold uppercase tracking-tight">
                  {open.name}
                </DialogTitle>
                <DialogDescription className="text-left leading-relaxed text-muted-foreground">
                  {open.full}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-2 border-t border-border pt-6">
                <p className="mono-label">Что внутри</p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {open.includes.map((i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                      <Icon name="CircleCheck" size={16} className="mt-0.5 shrink-0 text-accent" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Формат: {open.format}
                </p>
                <Button
                  onClick={() => {
                    setOpen(null);
                    setTimeout(() => scrollToId('contacts'), 150);
                  }}
                  className="bg-accent font-mono text-[11px] uppercase tracking-[0.18em] text-accent-foreground hover:bg-accent/85"
                >
                  Запросить доступ
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Products;
