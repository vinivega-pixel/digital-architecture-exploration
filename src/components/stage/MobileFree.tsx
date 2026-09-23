import { useState } from 'react';
import Icon from '@/components/ui/icon';
import NormSearch from './NormSearch';
import DocAudit from './DocAudit';
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
import type { MobileTab } from './mobileTabs';

export /** Размер шаблона в мегабайтах — стабильно выводится из названия. */
const docSize = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) h = (h * 31 + name.charCodeAt(i)) % 997;
  return (0.2 + (h % 160) / 100).toFixed(1);
};

const stageCalcs = (stage: Stage) => {
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
  const fg = 'hsl(var(--foreground))';
  const extra = stageExtras[stage.id];
  const calcs = stageCalcs(stage);
  const templates = extra?.templates ?? stage.templates;
  const norms = extra?.norms ?? stage.norms;
  const [openCalc, setOpenCalc] = useState<string | null>(null);
  const [calcQuery, setCalcQuery] = useState('');
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
            style={{ color: 'hsl(var(--muted-foreground))' }}
          >
            <Icon name="ChevronLeft" size={15} />
            Все расчёты ({calcs.length})
          </button>
          <CalcCard calc={active} palette={palette} stageTitle={stage.title} />
        </div>
      );
    }
    const needle = calcQuery.trim().toLowerCase();
    const shown = needle
      ? calcs.filter(
          (c) =>
            c.title.toLowerCase().includes(needle) ||
            (c.note ?? '').toLowerCase().includes(needle) ||
            (c.basis ?? '').toLowerCase().includes(needle) ||
            (c.formula ?? '').toLowerCase().includes(needle),
        )
      : calcs;

    return (
      <>
        <div className="mb-4 flex items-center gap-2.5 rounded-full border border-border bg-card px-4">
          <Icon name="Search" size={16} className="shrink-0 text-muted-foreground" />
          <input
            value={calcQuery}
            onChange={(e) => setCalcQuery(e.target.value)}
            placeholder="Поиск по расчётам: свая, нагрузка, уклон…"
            className="min-w-0 flex-1 bg-transparent py-3 text-[0.86rem] text-foreground outline-none"
          />
          {calcQuery ? (
            <button type="button" onClick={() => setCalcQuery('')} aria-label="Очистить" className="p-1 text-muted-foreground">
              <Icon name="X" size={15} />
            </button>
          ) : null}
        </div>

        <p className="mb-4 text-[0.82rem] leading-relaxed text-muted-foreground">
          Найдено расчётов: {shown.length} из {calcs.length}
        </p>

        <div className="space-y-2">
          {shown.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setOpenCalc(c.id)}
              className="flex w-full items-center gap-3 rounded-xl border border-border px-4 py-3 text-left transition-colors hover:border-primary"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[0.88rem] leading-snug text-foreground">{c.title}</span>
                {c.formula ? (
                  <span className="mt-0.5 block truncate text-[0.72rem] text-muted-foreground">{c.formula}</span>
                ) : null}
              </span>
              <Icon name="ChevronRight" size={15} className="shrink-0 text-muted-foreground" />
            </button>
          ))}
          {!shown.length ? (
            <p className="py-8 text-center text-[0.86rem] text-muted-foreground">
              Ничего не найдено. Попробуйте другой запрос.
            </p>
          ) : null}
        </div>
      </>
    );
  }

  if (tab === 'audit') {
    return <DocAudit stage={stage} />;
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
              className="flex w-full items-start gap-3 rounded-xl border border-border px-4 py-3 text-left transition-colors hover:border-primary"
            >
              <Icon name="Download" size={15} className="mt-0.5 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1">
                <span className="block text-[0.88rem] leading-snug text-foreground">{t}</span>
                <span className="mt-0.5 block text-[0.72rem] text-muted-foreground">DOCX · {docSize(t)} МБ</span>
              </span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-[0.76rem] leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>
          {mobileCopy.free.templatesHint}
        </p>
      </>
    );
  }

  return (
    <>
      <NormSearch stage={stage} />
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
                style={{ color: 'hsl(var(--muted-foreground))' }}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[0.88rem] leading-snug text-foreground">{n}</span>
                <span className="mt-0.5 block text-[0.72rem] text-muted-foreground">
                  {lib ? `PDF · ${(lib.size / 1048576).toFixed(1)} МБ` : link ? 'Официальный источник' : 'Печатное издание'}
                </span>
              </span>
            </>
          );
          return (
            <div key={n}>
              {lib ? (
                <button
                  type="button"
                  onClick={() => downloadNorm(n)}
                  className="flex w-full items-start gap-3 rounded-xl border border-border px-4 py-3 text-left transition-colors hover:border-primary"
                >
                  {inner}
                </button>
              ) : link ? (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 rounded-xl border border-border px-4 py-3 transition-colors hover:border-primary"
                >
                  {inner}
                </a>
              ) : (
                <span className="flex items-start gap-3 rounded-xl border border-border px-4 py-3">
                  {inner}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-[0.76rem] leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>
        {mobileCopy.free.normsHint}
      </p>
    </>
  );
};

export default MobileFree;
