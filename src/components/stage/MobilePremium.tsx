import Icon from '@/components/ui/icon';
import AiChat from './AiChat';
import NormCheck from './NormCheck';
import { mobileCopy } from '@/data/mobileCopy';
import { useAuth } from '@/context/AuthContext';
import { useUi } from '@/context/UiContext';
import type { Stage } from '@/data/stages';
import type { MobileTab } from './MobileStage';

const goPremium = (plan?: string) => {
  if (plan) window.dispatchEvent(new CustomEvent('select-plan', { detail: plan }));
  document.getElementById('premium')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const REPAIR = [
  'Проверка комплектности с обоснованием по нормам',
  'Разработка недостающих документов',
  'Сметные расчёты',
  'Контроль через CRM',
  'HTML-помощники',
];

const PRODUCTS = [
  { icon: 'FileStack', name: 'Частичная разработка', text: 'Текст, графика и расчёты — по выбору.' },
  { icon: 'FolderKanban', name: 'Полная разработка', text: 'Вся документация по ГОСТ с инженером института.' },
  { icon: 'LayoutDashboard', name: 'CRM', text: 'Объекты и документы в одной системе.' },
  { icon: 'UserCog', name: 'Цифровой ГИП', text: 'Разделы разрабатываются онлайн на ваших глазах.' },
  { icon: 'ShieldCheck', name: 'Экспертиза', text: 'Ведём проект и отрабатываем замечания.' },
  { icon: 'PenTool', name: 'Комплекты DWG', text: 'Чертежи CAD для работы на площадке.' },
  { icon: 'Box', name: 'BIM-модели RVT', text: 'Трёхмерная модель объекта.' },
];

const MobilePremium = ({ stage, tab }: { stage: Stage; tab: MobileTab }) => {
  const { premium } = useAuth();
  const { openAccount } = useUi();
  const { palette } = stage;
  const fg = palette.rightFg;
  const bg = palette.rightBg;

  const Cta = ({ label, plan, icon = 'Sparkles' }: { label: string; plan: string; icon?: string }) => (
    <button
      type="button"
      onClick={() => goPremium(plan)}
      className="mt-5 flex w-full items-center justify-center gap-2 px-5 py-3.5 text-center text-[0.76rem] font-medium uppercase leading-snug tracking-[0.08em]"
      style={{ background: fg, color: bg }}
    >
      <Icon name={icon} size={15} className="shrink-0" />
      {label}
    </button>
  );

  if (tab === 'agent') {
    return (
      <>
        <p className="mb-4 text-[0.84rem] leading-relaxed" style={{ color: `${fg}b5` }}>
          {mobileCopy.premium.agent}
        </p>
        <AiChat stageId={stage.id} stagePhase={stage.phase} fg={fg} bg={bg} tall />
        {!premium ? <Cta label="Премиум на сутки — 999 ₽" plan="day" /> : null}
      </>
    );
  }

  if (tab === 'repair') {
    return (
      <>
        <ul className="space-y-2.5">
          {REPAIR.map((r) => (
            <li key={r} className="flex gap-2.5">
              <Icon name="Check" size={15} className="mt-0.5 shrink-0" style={{ color: `${fg}90` }} />
              <span className="text-[0.85rem] leading-relaxed" style={{ color: `${fg}c0` }}>
                {r}
              </span>
            </li>
          ))}
        </ul>
        {premium ? (
          <div className="mt-5">
            <NormCheck stagePhase={stage.phase} fg={fg} bg={bg} />
          </div>
        ) : (
          <Cta label="Премиум «Работа» — 5 990 ₽ в месяц" plan="work" />
        )}
      </>
    );
  }

  return (
    <>
      <p className="text-[0.84rem] leading-relaxed" style={{ color: `${fg}b5` }}>
        {mobileCopy.premium.products}
      </p>
      <ul className="mt-5 space-y-4">
        {PRODUCTS.map((p) => (
          <li key={p.name} className="flex gap-3">
            <Icon name={p.icon} size={16} className="mt-0.5 shrink-0" style={{ color: `${fg}90` }} />
            <div>
              <p className="text-[0.88rem] font-semibold">{p.name}</p>
              <p className="mt-0.5 text-[0.8rem] leading-relaxed" style={{ color: `${fg}b0` }}>
                {p.text}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {premium ? (
        <button
          type="button"
          onClick={openAccount}
          className="mt-5 flex w-full items-center justify-center gap-2 px-5 py-3.5 text-[0.76rem] font-medium uppercase tracking-[0.08em]"
          style={{ background: fg, color: bg }}
        >
          <Icon name="LayoutDashboard" size={15} />
          Личный кабинет
        </button>
      ) : (
        <Cta label="Премиум «Всё включено» — 99 999 ₽ в месяц" plan="month" />
      )}
    </>
  );
};

export default MobilePremium;
