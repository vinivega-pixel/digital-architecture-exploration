import { useState } from 'react';
import Icon from '@/components/ui/icon';
import Disclosure from './Disclosure';
import AiChat from './AiChat';
import NormCheck from './NormCheck';
import OfferModal from './OfferModal';
import { stageExtras } from '@/data/stageExtras';
import { extraCalcs } from '@/data/extraCalcs';
import { formulaCalcs } from '@/data/formulaCalcs';
import type { Stage } from '@/data/stages';

const nf = (v: number) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(v);

const PRODUCTS = [
  {
    icon: 'Map',
    name: 'Карты согласований',
    text: 'Маршрут инстанций по этапу: кто согласует, что требует, сколько ждать и где чаще всего срывается срок.',
  },
  {
    icon: 'FolderKanban',
    name: 'Проекты',
    text: 'Разработка разделов проекта по вашему объекту с проверкой инженером института.',
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
  const { palette, offer } = stage;
  const bg = palette.rightBg;
  const fg = palette.rightFg;
  const extra = stageExtras[stage.id];
  const calcs = [stage.calc, ...(extra?.calcs ?? []), ...(extraCalcs[stage.id] ?? []), ...(formulaCalcs[stage.id] ?? [])];
  const templates = extra?.templates ?? stage.templates;
  const projects = extra?.projects ?? [offer.title];
  const docsTotal = templates.length + projects.length + calcs.length;

  const [amount, setAmount] = useState(Math.round(offer.minPrice / offer.rate / 100) * 100 || 1000);
  const [showOffer, setShowOffer] = useState(false);
  const [project, setProject] = useState(projects[0]);
  const price = Math.max(offer.minPrice, Math.round((amount * offer.rate) / 1000) * 1000);

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

      <div className="mt-6 space-y-3">
        <Disclosure icon="MessagesSquare" label="ИИ-агент ведёт диалог" count={0} fg={fg}>
          <AiChat stagePhase={stage.phase} fg={fg} bg={bg} />
        </Disclosure>

        <Disclosure icon="FileCheck" label="Готовые документы" count={docsTotal} fg={fg}>
          <p className="font-display text-lg leading-tight" style={{ color: fg }}>
            Готовый проект документов по этапу
          </p>
          <p className="mt-2 text-[0.82rem] leading-relaxed" style={{ color: `${fg}b5` }}>
            Всего {docsTotal} документов: разделы проекта, договор, коммерческое предложение, техническое задание,
            акты, журналы и расчёты. Всё заполнено по вашему объекту и проверено инженером института.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-px" style={{ background: `${fg}22` }}>
            {[
              { v: projects.length, l: 'разделов проекта' },
              { v: templates.length, l: 'форм и актов' },
              { v: calcs.length, l: 'расчётов' },
            ].map((s) => (
              <div key={s.l} className="p-3" style={{ background: bg }}>
                <p className="font-display text-xl" style={{ color: fg }}>
                  {s.v}
                </p>
                <p className="mt-1 text-[0.64rem] uppercase leading-tight tracking-[0.1em]" style={{ color: `${fg}88` }}>
                  {s.l}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-4 flex items-center gap-2 text-[0.78rem]" style={{ color: `${fg}b5` }}>
            <Icon name="Clock" size={14} style={{ color: `${fg}90` }} />
            Срок изготовления — 8–12 часов
          </p>

          <button
            type="button"
            onClick={() => setShowOffer(true)}
            className="mt-4 flex w-full items-center justify-center gap-2 px-5 py-3 text-[0.74rem] font-medium uppercase tracking-[0.12em]"
            style={{ background: fg, color: bg }}
          >
            <Icon name="FileText" size={15} />
            Получить коммерческое предложение
          </button>
        </Disclosure>

        <Disclosure icon="ShieldCheck" label="Автопроверка по нормам" count={0} fg={fg}>
          <NormCheck stagePhase={stage.phase} fg={fg} bg={bg} />
        </Disclosure>

        <Disclosure icon="Cpu" label="Цифровые продукты" count={PRODUCTS.length} fg={fg}>
          <ul className="space-y-3.5">
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

          <div className="mt-4 border p-4" style={{ borderColor: `${fg}33`, background: `${fg}0d` }}>
            <p className="text-[0.68rem] uppercase tracking-[0.14em]" style={{ color: `${fg}99` }}>
              Раздел для заказа
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {projects.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProject(p)}
                  className="border px-3 py-2 text-left text-[0.78rem] leading-snug transition-colors"
                  style={{
                    borderColor: project === p ? fg : `${fg}40`,
                    background: project === p ? `${fg}14` : 'transparent',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            <label className="mt-4 block text-[0.68rem] uppercase tracking-[0.14em]" style={{ color: `${fg}99` }}>
              {offer.unitLabel}
            </label>
            <input
              type="number"
              value={amount}
              step={100}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="mt-2 w-full border bg-transparent px-3 py-2.5 text-sm outline-none"
              style={{ borderColor: `${fg}40`, color: fg }}
            />
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <span className="text-[0.8rem]" style={{ color: `${fg}aa` }}>
                Стоимость работ
              </span>
              <span className="font-display text-2xl">{nf(price)} ₽</span>
            </div>
            <button
              type="button"
              onClick={() => setShowOffer(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 px-5 py-3 text-[0.74rem] font-medium uppercase tracking-[0.12em]"
              style={{ background: fg, color: bg }}
            >
              <Icon name="FileText" size={15} />
              Получить коммерческое предложение
            </button>
          </div>
        </Disclosure>
      </div>

      {showOffer ? (
        <OfferModal
          stage={stage}
          offer={{ ...offer, title: project, term: '8–12 часов' }}
          palette={palette}
          amount={amount}
          price={price}
          onClose={() => setShowOffer(false)}
        />
      ) : null}
    </div>
  );
};

export default PremiumPanel;