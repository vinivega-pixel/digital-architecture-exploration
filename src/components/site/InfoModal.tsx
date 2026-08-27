import { useEffect } from 'react';
import Icon from '@/components/ui/icon';

type Props = { open: boolean; onClose: () => void };

const AGENTS = [
  {
    icon: 'ClipboardList',
    name: 'Аналитик требований',
    text: 'Переводит вашу задачу с обычного языка в структурированное техническое задание: размеры, материалы, нормативы. Сразу проверяет, не противоречит ли замысел требованиям.',
  },
  {
    icon: 'PenTool',
    name: 'Архитектор',
    text: 'Строит геометрическую основу — оси, высотные отметки, расстановку стен и колонн. Выдаёт десятки вариантов планировок за минуты вместо недель.',
  },
  {
    icon: 'Calculator',
    name: 'Инженер-сметчик',
    text: 'Считает стоимость работ и материалов на основании действующих сметных расценок с применением региональных коэффициентов — смета отражает реальные цены вашего региона.',
  },
  {
    icon: 'ShieldCheck',
    name: 'Валидатор',
    text: 'Сверяет каждое решение со сводами правил, ГОСТами и кодексами по базе нормативов. Находит коллизии и отправляет на доработку до того, как ошибка уйдёт в экспертизу.',
  },
  {
    icon: 'FileStack',
    name: 'Оформитель',
    text: 'Выпускает чертежи, спецификации и рабочую документацию в форматах, готовых к работе в ваших программах.',
  },
];

const STAGES = [
  { n: '01', t: 'Участок и изыскания', d: 'Анализ геоданных и подбор оптимального пятна застройки.' },
  { n: '02', t: 'Концепция и эскиз', d: 'Варианты планировок этажей и кварталов с учётом задания и норм.' },
  { n: '03', t: 'Конструктив', d: 'Расчётные схемы, раскладка несущих стен, армирование по сводам правил.' },
  { n: '04', t: 'Инженерные разделы', d: 'Отопление, вентиляция, водоснабжение и электрика с проверкой на пересечения.' },
  { n: '05', t: 'Рабочая документация', d: 'Чертежи, спецификации и ведомости — раздел, где экономится больше всего времени.' },
  { n: '06', t: 'Экспертиза', d: 'Сквозная проверка согласованности разделов до подачи на согласование.' },
  { n: '07', t: 'Строительство', d: 'Календарные графики, логистика материалов и контроль этапов на площадке.' },
];

const InfoModal = ({ open, onClose }: Props) => {
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Как работает институт"
    >
      <div
        className="max-h-[92vh] w-full max-w-[720px] overflow-y-auto border border-border bg-card p-6 md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="rubric">Об институте</p>
            <h3 className="mt-2 font-display text-2xl leading-tight text-foreground md:text-3xl">
              Как мы работаем
            </h3>
          </div>
          <button onClick={onClose} aria-label="Закрыть" className="text-muted-foreground hover:text-foreground">
            <Icon name="X" size={22} />
          </button>
        </div>

        <p className="mt-5 text-[0.9rem] leading-relaxed text-muted-foreground">
          Институт соединяет опыт практикующих инженеров с нейросетями. Машина берёт на себя рутину — черновые
          планировки, расчёты, спецификации, сверку с нормами. Инженер института управляет процессом и отвечает за
          финальное решение. Такой порядок экономит до 40% времени на документации, но подпись под проектом всегда
          ставит человек.
        </p>

        <div className="mt-8">
          <p className="rubric">Команда цифровых специалистов</p>
          <ul className="mt-4 space-y-4">
            {AGENTS.map((a) => (
              <li key={a.name} className="flex gap-3">
                <Icon name={a.icon} size={17} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <p className="text-[0.92rem] font-semibold text-foreground">{a.name}</p>
                  <p className="mt-1 text-[0.85rem] leading-relaxed text-muted-foreground">{a.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[0.85rem] leading-relaxed text-muted-foreground">
            Специалисты работают конвейером и передают результат друг другу. Вы ставите задачу обычными словами и
            проверяете итог — как заказчик, который общается с проектной группой.
          </p>
        </div>

        <div className="mt-8">
          <p className="rubric">Полный цикл — от участка до сдачи</p>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {STAGES.map((s) => (
              <li key={s.n} className="flex gap-4 py-3.5">
                <span className="font-display text-base text-primary">{s.n}</span>
                <div>
                  <p className="text-[0.9rem] font-semibold text-foreground">{s.t}</p>
                  <p className="mt-0.5 text-[0.84rem] leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <p className="rubric">Что получает заказчик</p>
          <ul className="mt-4 space-y-2.5">
            {[
              'Документы в привычных форматах — для работы в ваших программах и подачи на согласование.',
              'Каждое решение с обоснованием: свод правил, ГОСТ или статья кодекса.',
              'Проверка человеком: инженер института отвечает за результат.',
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <Icon name="Check" size={16} className="mt-0.5 shrink-0 text-primary" />
                <span className="text-[0.85rem] leading-relaxed text-muted-foreground">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 border-t border-border pt-5 text-[0.82rem] leading-relaxed text-muted-foreground">
          Честно о границах: нейросети готовят модель и документацию на уровне концепции и рабочих заготовок. Узлы,
          сложные расчёты и окончательные решения остаются за инженером — именно поэтому институт работает как связка
          человека и машины, а не как автомат.
        </p>
      </div>
    </div>
  );
};

export default InfoModal;