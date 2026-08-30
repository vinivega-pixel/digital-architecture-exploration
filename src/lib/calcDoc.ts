import { safeName, saveBlob } from '@/lib/downloadFile';
import type { Calc, CalcRow } from '@/data/stages';

const esc = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const sub = (s: string) =>
  esc(s).replace(/([A-Za-zА-Яа-яΑ-Ωα-ω0-9)])_([A-Za-zА-Яа-я0-9.,]+)/g, '$1<sub>$2</sub>');

const nfmt = (v: number) =>
  new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 4 }).format(Number.isFinite(v) ? v : 0);

const symbolOf = (line: string) => {
  const m = line.split(/[—–−-]/)[0]?.trim();
  return m && m.length <= 24 ? m : '';
};

const legendRows = (legend: string[]) =>
  legend
    .map((l) => {
      const sym = symbolOf(l);
      const rest = l.slice(sym.length).replace(/^\s*[—–−-]\s*/, '');
      return `<tr><td class="sym">${sub(sym || '—')}</td><td>${sub(rest || l)}</td></tr>`;
    })
    .join('');

export type CalcDocPayload = {
  calc: Calc;
  values: Record<string, number>;
  results: CalcRow[];
  stageTitle: string;
};

export const buildCalcHtml = ({ calc, values, results, stageTitle }: CalcDocPayload) => {
  const date = new Date().toLocaleDateString('ru-RU');
  const answer = results.find((r) => r.accent) ?? results[results.length - 1];
  const steps = results.filter((r) => r !== answer);

  const inputRows = calc.fields
    .map(
      (f, i) =>
        `<tr><td class="n">${i + 1}</td><td>${sub(f.label)}</td><td class="u">${esc(f.unit ?? '—')}</td><td class="v">${esc(
          nfmt(values[f.key] ?? f.def),
        )}</td></tr>`,
    )
    .join('');

  const stepRows = steps
    .map(
      (r, i) =>
        `<tr><td class="n">${i + 1}</td><td>${sub(r.label)}</td><td class="v">${sub(r.value)}</td></tr>`,
    )
    .join('');

  return `<!doctype html><html lang="ru"><head><meta charset="utf-8">
<title>${esc(`Расчёт — ${calc.title}`)}</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #16181c; margin: 0; padding: 28px; }
  .meta { display: flex; justify-content: space-between; font-size: 11px; color: #6b7280; font-family: Arial, sans-serif; }
  .brand { letter-spacing: .22em; text-transform: uppercase; }
  h1 { font-size: 23px; margin: 12px 0 4px; font-weight: 600; line-height: 1.25; }
  .sub { font-size: 13px; color: #4b5563; margin-bottom: 6px; }
  .note { font-size: 12.5px; color: #4b5563; line-height: 1.6; margin-bottom: 20px; }
  h2 { font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: #111827; margin: 26px 0 10px;
       font-family: Arial, sans-serif; padding-bottom: 6px; border-bottom: 1px solid #111827; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; font-family: Arial, sans-serif; }
  th { text-align: left; font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase; color: #6b7280;
       padding: 0 8px 6px 0; border-bottom: 1px solid #d1d5db; font-weight: 600; }
  td { padding: 8px 8px 8px 0; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
  td.n { width: 26px; color: #9ca3af; }
  td.u { width: 74px; color: #6b7280; }
  td.v { text-align: right; font-weight: 700; white-space: nowrap; }
  td.sym { width: 110px; font-family: 'Courier New', monospace; font-weight: 700; }
  sub { font-size: 0.72em; }
  .formula { font-family: 'Courier New', monospace; font-size: 15px; font-weight: 700; line-height: 1.5;
             padding: 14px 16px; border-left: 3px solid #111827; background: #f6f6f4; margin: 0 0 14px; }
  .text { font-size: 12.5px; line-height: 1.7; font-family: Arial, sans-serif; color: #1f2937; margin: 0 0 10px; }
  .law { font-size: 12.5px; line-height: 1.7; font-family: Arial, sans-serif; padding: 12px 14px;
         border: 1px solid #d1d5db; background: #fafafa; }
  .law b { display: block; font-size: 10.5px; letter-spacing: .1em; text-transform: uppercase; color: #6b7280; margin-bottom: 5px; }
  .answer { margin-top: 12px; padding: 16px 18px; border: 2px solid #111827; }
  .answer .lbl { font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase; color: #6b7280; font-family: Arial, sans-serif; }
  .answer .val { font-size: 21px; font-weight: 700; margin-top: 6px; line-height: 1.3; }
  .foot { margin-top: 30px; padding-top: 14px; border-top: 1px solid #d1d5db; font-size: 10.5px; color: #6b7280;
          font-family: Arial, sans-serif; line-height: 1.6; }
</style></head><body>
<div class="meta"><span class="brand">ООО «Цифра» · Институт цифрового развития архитектуры</span><span>${date}</span></div>
<h1>${esc(calc.title)}</h1>
<div class="sub">${esc(stageTitle)}</div>
<p class="note">${esc(calc.note)}</p>

<h2>1. Вводные данные</h2>
<table><tr><th>№</th><th>Наименование параметра</th><th>Ед. изм.</th><th style="text-align:right">Значение</th></tr>
${inputRows}</table>

<h2>2. Методика расчёта и правовое обоснование</h2>
<p class="text">Расчёт выполнен по методике, установленной действующими нормативными документами. Ниже приведён документ и пункт, требованиями которого следует руководствоваться при выполнении и проверке расчёта.</p>
<div class="law"><b>Нормативное обоснование</b>${esc(calc.basis)}</div>

<h2>3. Формула расчёта и условные обозначения</h2>
<p class="formula">${sub(calc.formula ?? '—')}</p>
${
  calc.legend?.length
    ? `<table><tr><th>Символ</th><th>Расшифровка условного обозначения</th></tr>${legendRows(calc.legend)}</table>`
    : '<p class="text">Условные обозначения приведены в наименованиях параметров вводных данных.</p>'
}

<h2>4. Ход расчёта</h2>
<p class="text">Вычисления выполнены последовательно, каждый промежуточный результат приведён отдельной строкой.</p>
${
  stepRows
    ? `<table><tr><th>Шаг</th><th>Вычисляемая величина</th><th style="text-align:right">Результат</th></tr>${stepRows}</table>`
    : '<p class="text">Расчёт выполняется в одно действие по приведённой выше формуле.</p>'
}

<h2>5. Ответ</h2>
<div class="answer">
  <div class="lbl">Итого по расчёту</div>
  <div class="val">${sub(answer?.label ?? 'Результат')} составляет ${sub(answer?.value ?? '—')}</div>
</div>

<div class="foot">Расчёт носит информационный характер, не является проектной документацией и публичной офертой (ст. 437 ГК РФ).
Окончательные решения принимаются проектной организацией с проверкой действующей редакции нормативных документов на дату применения.</div>
</body></html>`;
};

export const downloadCalcDoc = (p: CalcDocPayload) => {
  const blob = new Blob(['\ufeff' + buildCalcHtml(p)], { type: 'application/msword;charset=utf-8' });
  saveBlob(blob, `${safeName(`Расчёт — ${p.calc.title}`)}.doc`);
  return true;
};

export default downloadCalcDoc;