import Icon from '@/components/ui/icon';
import Disclosure from './Disclosure';
import AiChat from './AiChat';
import NormCheck from './NormCheck';
import { useAuth } from '@/context/AuthContext';
import { useUi } from '@/context/UiContext';
import type { Stage } from '@/data/stages';

const goPremium = (plan?: string) => {
  if (plan) window.dispatchEvent(new CustomEvent('select-plan', { detail: plan }));
  document.getElementById('premium')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const PRODUCTS = [
  {
    icon: 'Map',
    name: 'Карты согласований',
    text: 'Маршрут инстанций по этапу: кто согласует, что требует, сколько ждать и где чаще всего срывается срок.',
  },
  {
    icon: 'FolderKanban',
    name: 'Проекты под ключ',
    text: 'Разделы проекта разрабатываются полностью — от исходных данных до выпуска в производство работ.',
  },
  {
    icon: 'FileText',
    name: 'Комплект текстовой части',
    text: 'Пояснительные записки, ведомости, спецификации и общие данные — по ГОСТ Р 21.101-2020.',
  },
  {
    icon: 'PenTool',
    name: 'Комплект графической части',
    text: 'Планы, разрезы, схемы и узлы в рабочем виде, готовые к выпуску в производство работ.',
  },
  {
    icon: 'Calculator',
    name: 'Комплект расчётной части',
    text: 'Расчёты с формулами, исходными данными и ссылками на нормы — в составе, который принимает экспертиза.',
  },
  {
    icon: 'MonitorDown',
    name: 'HTML офлайн-помощники',
    text: 'Программы, работающие на компьютере без интернета: расчёты, подбор решений и проверка по нормам.',
  },
];

const PremiumPanel = ({ stage }: { stage: Stage }) => {
  const { premium } = useAuth();
  const { openAccount } = useUi();
  const { palette } = stage;
  const bg = palette.rightBg;
  const fg = palette.rightFg;

  return (
    <div className="flex h-full flex-col px-6 py-10 md:px-10 md:py-12 lg:px-14" style={{ background: bg, color: fg }}>
      <div className="flex items-center gap-3">
        <span
          className="inline-flex items-center gap-1.5 border px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.18em]"
          style={{ borderColor: `${fg}55` }}
        >
          <Icon name="Sparkles" size={12} />
          Премиум
        </span>
        <span className="text-[0.68rem] uppercase tracking-[0.18em]" style={{ color: `${fg}88` }}>
          Институт делает за вас
        </span>
      </div>

      <p className="mt-4 text-[0.78rem] leading-relaxed" style={{ color: `${fg}b0` }}>
        {premium
          ? 'Премиум-доступ активен: все разделы открыты.'
          : 'ИИ-агент доступен всем. Автопроверка по нормам и цифровые продукты — по премиум-подписке.'}
      </p>

      <div className="mt-5 space-y-3">
        <Disclosure icon="MessagesSquare" label="ИИ-агент ведёт диалог" count={0} fg={fg}>
          <AiChat stagePhase={stage.phase} fg={fg} bg={bg} />
          <p className="mt-3 text-[0.74rem] leading-relaxed" style={{ color: `${fg}90` }}>
            Диалог с ИИ-агентом открыт всем без подписки.
          </p>
        </Disclosure>

        <Disclosure icon="ShieldCheck" label="Автопроверка по нормам" count={0} fg={fg} locked={!premium}>
          {premium ? (
            <NormCheck stagePhase={stage.phase} fg={fg} bg={bg} />
          ) : (
            <p className="text-[0.82rem] leading-relaxed" style={{ color: `${fg}b5` }}>
              Задаёте вопрос по нормам — получаете ответ с юридическим обоснованием: конкретный свод правил, ГОСТ или
              статья кодекса и что это значит для проекта. Открывается по подписке.
            </p>
          )}
          {!premium && (
            <button
              type="button"
              onClick={() => goPremium('day')}
              className="mt-4 flex w-full items-center justify-center gap-2 px-5 py-3 text-[0.74rem] font-medium uppercase tracking-[0.12em]"
              style={{ background: fg, color: bg }}
            >
              <Icon name="Sparkles" size={15} />
              Подключить премиум
            </button>
          )}
        </Disclosure>

        <Disclosure icon="Cpu" label="Цифровые продукты" count={0} fg={fg} locked={!premium}>
          <p className="font-display text-lg leading-tight" style={{ color: fg }}>
            Разработка полного комплекта документов под ключ на весь этап строительства
          </p>
          <p className="mt-2 text-[0.82rem] leading-relaxed" style={{ color: `${fg}b5` }}>
            Разделы проекта, договоры и коммерческие предложения, технические задания, акты, журналы и расчёты —
            заполнено по вашему объекту и проверено инженером института.
          </p>

          <ul className="mt-5 space-y-3.5">
            {PRODUCTS.map((p) => (
              <li key={p.name} className="flex gap-2.5">
                <Icon name={p.icon} size={15} className="mt-0.5 shrink-0" style={{ color: `${fg}90` }} />
                <div>
                  <p className="text-[0.86rem] font-semibold">{p.name}</p>
                  <p className="mt-0.5 text-[0.8rem] leading-relaxed" style={{ color: `${fg}b0` }}>
                    {p.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-4 flex items-center gap-2 text-[0.78rem]" style={{ color: `${fg}b5` }}>
            <Icon name="Clock" size={14} style={{ color: `${fg}90` }} />
            Срок изготовления — 8–12 часов
          </p>

          {premium ? (
            <button
              type="button"
              onClick={openAccount}
              className="mt-4 flex w-full items-center justify-center gap-2 px-5 py-3 text-[0.74rem] font-medium uppercase tracking-[0.12em]"
              style={{ background: fg, color: bg }}
            >
              <Icon name="LayoutDashboard" size={15} />
              Открыть личный кабинет
            </button>
          ) : (
            <button
              type="button"
              onClick={() => goPremium('month')}
              className="mt-4 flex w-full items-center justify-center gap-2 px-5 py-3 text-center text-[0.74rem] font-medium uppercase leading-snug tracking-[0.1em]"
              style={{ background: fg, color: bg }}
            >
              <Icon name="Sparkles" size={15} className="shrink-0" />
              Воспользоваться цифровыми продуктами в личном кабинете премиум
            </button>
          )}
        </Disclosure>
      </div>

    </div>
  );
};

export default PremiumPanel;