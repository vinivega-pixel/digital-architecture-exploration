import { useState } from 'react';
import Icon from '@/components/ui/icon';
import Disclosure from './Disclosure';
import CalcCard from './CalcCard';
import printDoc from '@/lib/printDoc';
import { findDocForm } from '@/data/docForms';
import { resolveNorm } from '@/data/normLinks';
import { stageExtras } from '@/data/stageExtras';
import { extraCalcs } from '@/data/extraCalcs';
import { formulaCalcs } from '@/data/formulaCalcs';
import type { Stage } from '@/data/stages';

const FreePanel = ({ stage }: { stage: Stage }) => {
  const { palette } = stage;
  const bg = palette.leftBg;
  const fg = palette.leftFg;
  const extra = stageExtras[stage.id];
  const calcs = [stage.calc, ...(extra?.calcs ?? []), ...(extraCalcs[stage.id] ?? []), ...(formulaCalcs[stage.id] ?? [])];
  const templates = extra?.templates ?? stage.templates;
  const norms = extra?.norms ?? stage.norms;
  const [openCalc, setOpenCalc] = useState<string | null>(null);
  const active = calcs.find((c) => c.id === openCalc);

  const downloadTemplate = (title: string) => {
    const form = findDocForm(title);
    printDoc({
      docTitle: title,
      heading: title,
      subheading: `${stage.title} · типовая форма`,
      inputs: [],
      results: [],
      body: form?.body,
      basis: form?.basis ?? 'Форма подготовлена по действующим требованиям к документации в строительстве.',
      footNote:
        'Форма подготовлена по государственному типовому образцу. Перед применением проверьте актуальную редакцию нормативного документа и требования вашего заказчика.',
    });
  };

  return (
    <div className="flex h-full flex-col px-6 py-10 md:px-10 md:py-12 lg:px-14" style={{ background: bg, color: fg }}>
      <div className="flex items-center gap-3">
        <span
          className="inline-flex items-center gap-1.5 border px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.18em]"
          style={{ borderColor: `${fg}55` }}
        >
          <Icon name="Unlock" size={12} />
          Полезное
        </span>
        <span className="text-[0.68rem] uppercase tracking-[0.18em]" style={{ color: `${fg}88` }}>
          Бесплатно
        </span>
      </div>

      <div className="mt-6 space-y-3">
        <Disclosure icon="Calculator" label="Калькуляторы" count={calcs.length} fg={fg}>
          <div className="flex flex-wrap gap-2">
            {calcs.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setOpenCalc(openCalc === c.id ? null : c.id)}
                className="border px-3 py-2 text-left text-[0.78rem] leading-snug transition-colors"
                style={{
                  borderColor: openCalc === c.id ? fg : `${fg}40`,
                  background: openCalc === c.id ? `${fg}14` : 'transparent',
                }}
              >
                {c.title}
              </button>
            ))}
          </div>
          {active ? (
            <div className="mt-4">
              <CalcCard calc={active} palette={palette} stageTitle={stage.title} />
            </div>
          ) : (
            <p className="mt-3 text-[0.78rem]" style={{ color: `${fg}90` }}>
              Выберите калькулятор — откроется формула с расшифровкой, поля и выгрузка в PDF.
            </p>
          )}
        </Disclosure>

        <Disclosure icon="FileText" label="Шаблоны документов" count={templates.length} fg={fg}>
          <ul className="space-y-1">
            {templates.map((t) => (
              <li key={t}>
                <button
                  type="button"
                  onClick={() => downloadTemplate(t)}
                  className="flex w-full items-start gap-2.5 py-1.5 text-left text-[0.82rem] leading-snug transition-opacity hover:opacity-70"
                >
                  <Icon name="Download" size={13} className="mt-0.5 shrink-0" style={{ color: `${fg}90` }} />
                  <span>{t}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.7rem] leading-relaxed" style={{ color: `${fg}90` }}>
            Формы по государственным образцам: КС-2 и КС-3 (пост. Госкомстата № 100), КС-11 и КС-14 (№ 71а), акты
            освидетельствования по РД-11-02-2006, журналы по РД-11-05-2007.
          </p>
        </Disclosure>

        <Disclosure icon="BookOpen" label="Нормы и правила" count={norms.length} fg={fg}>
          <ul className="space-y-1">
            {norms.map((n) => {
              const link = resolveNorm(n);
              return (
                <li key={n}>
                  {link ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2.5 py-1.5 text-[0.82rem] leading-snug transition-opacity hover:opacity-70"
                    >
                      <Icon name="ExternalLink" size={13} className="mt-0.5 shrink-0" style={{ color: `${fg}90` }} />
                      <span>
                        {n}
                        <span className="ml-1.5 text-[0.68rem]" style={{ color: `${fg}80` }}>
                          {link.source}
                        </span>
                      </span>
                    </a>
                  ) : (
                    <span className="flex items-start gap-2.5 py-1.5 text-[0.82rem] leading-snug">
                      <Icon name="BookOpen" size={13} className="mt-0.5 shrink-0" style={{ color: `${fg}90` }} />
                      <span>{n}</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-[0.7rem] leading-relaxed" style={{ color: `${fg}90` }}>
            Ссылки ведут на официальные публикации: портал правовой информации pravo.gov.ru и электронный фонд
            нормативно-технической документации. Проверяйте действующую редакцию на дату применения.
          </p>
        </Disclosure>
      </div>
    </div>
  );
};

export default FreePanel;