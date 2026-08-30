import { useState } from 'react';
import Icon from '@/components/ui/icon';
import CalcCard from './CalcCard';
import { downloadDoc } from '@/lib/printDoc';
import { downloadRemote } from '@/lib/downloadFile';
import { findDocForm } from '@/data/docForms';
import { resolveNorm } from '@/data/normLinks';
import { findLibDoc, libDocUrl } from '@/data/libDocs';
import { stageExtras } from '@/data/stageExtras';
import { extraCalcs } from '@/data/extraCalcs';
import { formulaCalcs } from '@/data/formulaCalcs';
import { hiddenCalcIds } from '@/data/hiddenCalcs';
import { mobileCopy } from '@/data/mobileCopy';
import { useAuth } from '@/context/AuthContext';
import type { Stage } from '@/data/stages';
import type { MobileTab } from './MobileStage';

export const stageCalcs = (stage: Stage) => {
  const extra = stageExtras[stage.id];
  return [
    stage.calc,
    ...(extra?.calcs ?? []),
    ...(extraCalcs[stage.id] ?? []),
    ...(formulaCalcs[stage.id] ?? []),
  ].filter((c) => !hiddenCalcIds.has(c.id));
};

const MobileFree = ({ stage, tab }: { stage: Stage; tab: MobileTab }) => {
  const { trackDownload } = useAuth();
  const { palette } = stage;
  const fg = palette.leftFg;
  const extra = stageExtras[stage.id];
  const calcs = stageCalcs(stage);
  const templates = extra?.templates ?? stage.templates;
  const norms = extra?.norms ?? stage.norms;
  const [openCalc, setOpenCalc] = useState<string | null>(null);
  const active = calcs.find((c) => c.id === openCalc);

  const downloadTemplate = (title: string) => {
    trackDownload('template', title, stage.phase);
    const form = findDocForm(title);
    downloadDoc({
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

  const downloadNorm = (title: string) => {
    const lib = findLibDoc(title);
    if (!lib) return;
    trackDownload('norm', `${lib.code} — ${lib.title}`, stage.phase);
    downloadRemote(libDocUrl(lib), `${lib.code} ${lib.title}.pdf`);
  };

  if (tab === 'calcs') {
    if (active) {
      return (
        <div>
          <button
            type="button"
            onClick={() => setOpenCalc(null)}
            className="mb-4 inline-flex items-center gap-2 text-[0.76rem] uppercase tracking-[0.1em]"
            style={{ color: `${fg}b0` }}
          >
            <Icon name="ChevronLeft" size={15} />
            Все расчёты ({calcs.length})
          </button>
          <CalcCard calc={active} palette={palette} stageTitle={stage.title} />
        </div>
      );
    }
    return (
      <>
        <p className="mb-4 text-[0.82rem] leading-relaxed" style={{ color: `${fg}a0` }}>
          {mobileCopy.free.calcHint}
        </p>
        <div className="space-y-2">
          {calcs.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setOpenCalc(c.id)}
              className="flex w-full items-center gap-3 border px-3.5 py-3 text-left"
              style={{ borderColor: `${fg}30` }}
            >
              <span className="flex-1 text-[0.86rem] leading-snug">{c.title}</span>
              <Icon name="ChevronRight" size={15} className="shrink-0" style={{ color: `${fg}80` }} />
            </button>
          ))}
        </div>
      </>
    );
  }

  if (tab === 'templates') {
    return (
      <>
        <div className="space-y-2">
          {templates.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => downloadTemplate(t)}
              className="flex w-full items-start gap-3 border px-3.5 py-3 text-left"
              style={{ borderColor: `${fg}30` }}
            >
              <Icon name="Download" size={15} className="mt-0.5 shrink-0" style={{ color: `${fg}90` }} />
              <span className="text-[0.86rem] leading-snug">{t}</span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-[0.76rem] leading-relaxed" style={{ color: `${fg}90` }}>
          {mobileCopy.free.templatesHint}
        </p>
      </>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {norms.map((n) => {
          const lib = findLibDoc(n);
          const link = resolveNorm(n);
          const inner = (
            <>
              <Icon
                name={lib ? 'Download' : link ? 'ExternalLink' : 'BookOpen'}
                size={15}
                className="mt-0.5 shrink-0"
                style={{ color: `${fg}90` }}
              />
              <span className="text-[0.86rem] leading-snug">
                {n}
                {lib ? (
                  <span className="ml-1.5 text-[0.7rem]" style={{ color: `${fg}80` }}>
                    PDF · {(lib.size / 1048576).toFixed(1)} МБ
                  </span>
                ) : null}
              </span>
            </>
          );
          return (
            <div key={n}>
              {lib ? (
                <button
                  type="button"
                  onClick={() => downloadNorm(n)}
                  className="flex w-full items-start gap-3 border px-3.5 py-3 text-left"
                  style={{ borderColor: `${fg}30` }}
                >
                  {inner}
                </button>
              ) : link ? (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 border px-3.5 py-3"
                  style={{ borderColor: `${fg}30` }}
                >
                  {inner}
                </a>
              ) : (
                <span className="flex items-start gap-3 border px-3.5 py-3" style={{ borderColor: `${fg}22` }}>
                  {inner}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-[0.76rem] leading-relaxed" style={{ color: `${fg}90` }}>
        {mobileCopy.free.normsHint}
      </p>
    </>
  );
};

export default MobileFree;
