import { useState } from 'react';
import Icon from '@/components/ui/icon';
import Disclosure from './Disclosure';
import AiChat from './AiChat';
import OfferModal from './OfferModal';
import { stageExtras } from '@/data/stageExtras';
import { extraCalcs } from '@/data/extraCalcs';
import { formulaCalcs } from '@/data/formulaCalcs';
import type { Stage } from '@/data/stages';

const nf = (v: number) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(v);

const goPremium = () => document.getElementById('premium')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

const PremiumPanel = ({ stage }: { stage: Stage }) => {
  const { palette, offer, premiumItems } = stage;
  const bg = palette.rightBg;
  const fg = palette.rightFg;
  const extra = stageExtras[stage.id];
  const calcs = [stage.calc, ...(extra?.calcs ?? []), ...(extraCalcs[stage.id] ?? []), ...(formulaCalcs[stage.id] ?? [])];
  const templates = extra?.templates ?? stage.templates;
  const norms = extra?.norms ?? stage.norms;
  const projects = extra?.projects ?? [offer.title];

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

        <Disclosure icon="Bot" label="Расчёты делает ИИ" count={calcs.length} fg={fg} locked>
          <ul className="space-y-1.5">
            {calcs.map((c) => (
              <li key={c.id} className="flex gap-2.5 text-[0.82rem] leading-snug">
                <Icon name="Sparkles" size={13} className="mt-0.5 shrink-0" style={{ color: `${fg}90` }} />
                <span>{c.title} — считает агент, проверяет инженер</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={goPremium}
            className="mt-4 flex w-full items-center justify-center gap-2 px-5 py-3 text-[0.74rem] font-medium uppercase tracking-[0.12em]"
            style={{ background: fg, color: bg }}
          >
            <Icon name="Lock" size={14} />
            Перейти в премиум
          </button>
        </Disclosure>

        <Disclosure icon="FileCheck" label="Заполненные документы" count={templates.length} fg={fg} locked>
          <ul className="space-y-1.5">
            {templates.slice(0, 8).map((t) => (
              <li key={t} className="flex gap-2.5 text-[0.82rem] leading-snug">
                <Icon name="FileCheck" size={13} className="mt-0.5 shrink-0" style={{ color: `${fg}90` }} />
                <span>{t} — заполнен по вашему объекту</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={goPremium}
            className="mt-4 flex w-full items-center justify-center gap-2 px-5 py-3 text-[0.74rem] font-medium uppercase tracking-[0.12em]"
            style={{ background: fg, color: bg }}
          >
            <Icon name="Lock" size={14} />
            Перейти в премиум
          </button>
        </Disclosure>

        <Disclosure icon="ShieldCheck" label="Автопроверка по нормам" count={norms.length} fg={fg} locked>
          <ul className="space-y-1.5">
            {norms.map((n) => (
              <li key={n} className="flex gap-2.5 text-[0.82rem] leading-snug">
                <Icon name="ShieldCheck" size={13} className="mt-0.5 shrink-0" style={{ color: `${fg}90` }} />
                <span>{n} — сверка со ссылкой на пункт</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={goPremium}
            className="mt-4 flex w-full items-center justify-center gap-2 px-5 py-3 text-[0.74rem] font-medium uppercase tracking-[0.12em]"
            style={{ background: fg, color: bg }}
          >
            <Icon name="Lock" size={14} />
            Перейти в премиум
          </button>
        </Disclosure>

        <Disclosure icon="Cpu" label="Цифровые продукты института" count={premiumItems.length} fg={fg}>
          <ul className="space-y-3">
            {premiumItems.map((p) => (
              <li key={p.name}>
                <p className="text-[0.86rem] font-semibold">{p.name}</p>
                <p className="mt-0.5 text-[0.8rem] leading-relaxed" style={{ color: `${fg}b0` }}>
                  {p.text}
                </p>
              </li>
            ))}
          </ul>
        </Disclosure>

        <Disclosure icon="ClipboardList" label="Заказать проект на этом этапе" count={projects.length} fg={fg}>
          <div className="flex flex-wrap gap-2">
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

          <div className="mt-4 border p-4" style={{ borderColor: `${fg}33`, background: `${fg}0d` }}>
            <label className="block text-[0.68rem] uppercase tracking-[0.14em]" style={{ color: `${fg}99` }}>
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
            <p className="mt-1 text-[0.72rem]" style={{ color: `${fg}88` }}>
              Срок: {offer.term}
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
          </div>
        </Disclosure>
      </div>

      {showOffer ? (
        <OfferModal
          stage={stage}
          offer={{ ...offer, title: project }}
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