type Row = { label: string; value: string };

export type PrintPayload = {
  docTitle: string;
  heading: string;
  subheading?: string;
  inputs: Row[];
  results: Row[];
  basis?: string;
  footNote?: string;
  body?: string;
};

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const rows = (list: Row[]) =>
  list.map((r) => `<tr><td class="l">${esc(r.label)}</td><td class="v">${esc(r.value)}</td></tr>`).join('');

export const printDoc = (p: PrintPayload) => {
  const date = new Date().toLocaleDateString('ru-RU');
  const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8">
<title>${esc(p.docTitle)}</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #16181c; margin: 0; padding: 28px; }
  .brand { font-size: 11px; letter-spacing: .22em; text-transform: uppercase; color: #6b7280; }
  h1 { font-size: 24px; margin: 10px 0 4px; font-weight: 600; }
  .sub { font-size: 13px; color: #4b5563; margin-bottom: 22px; }
  h2 { font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: #6b7280; margin: 26px 0 8px; font-family: Arial, sans-serif; }
  table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  td { padding: 9px 0; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
  td.l { color: #4b5563; }
  td.v { text-align: right; font-weight: 600; }
  .basis { margin-top: 22px; font-size: 11.5px; color: #6b7280; font-family: Arial, sans-serif; line-height: 1.6; }
  .foot { margin-top: 26px; padding-top: 14px; border-top: 1px solid #d1d5db; font-size: 10.5px; color: #6b7280; font-family: Arial, sans-serif; line-height: 1.6; }
  .meta { display: flex; justify-content: space-between; font-size: 11px; color: #6b7280; font-family: Arial, sans-serif; }
  .doc { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.65; margin-top: 18px; }
  .doc h3 { font-size: 12.5px; text-transform: uppercase; letter-spacing: .08em; margin: 18px 0 6px; }
  .doc p { margin: 0 0 8px; }
  .doc .fill { border-bottom: 1px solid #9ca3af; display: inline-block; min-width: 180px; }
  .doc table { font-size: 11.5px; }
  .doc table td, .doc table th { border: 1px solid #9ca3af; padding: 5px 6px; text-align: left; }
  .doc .sign { display: flex; justify-content: space-between; margin-top: 26px; gap: 30px; }
  .doc .sign div { flex: 1; border-top: 1px solid #9ca3af; padding-top: 6px; font-size: 10.5px; color: #4b5563; }
</style></head><body>
<div class="meta"><span class="brand">ООО «Цифра» · Цифровой институт развития архитектуры</span><span>${date}</span></div>
<h1>${esc(p.heading)}</h1>
${p.subheading ? `<div class="sub">${esc(p.subheading)}</div>` : ''}
${p.body ?? ''}
${p.inputs.length ? `<h2>Исходные данные</h2><table>${rows(p.inputs)}</table>` : ''}
${p.results.length ? `<h2>Результат расчёта</h2><table>${rows(p.results)}</table>` : ''}
${p.basis ? `<div class="basis">Основание: ${esc(p.basis)}</div>` : ''}
<div class="foot">${esc(
    p.footNote ??
      'Расчёт носит информационный характер, не является проектной документацией и публичной офертой (ст. 437 ГК РФ). Окончательные решения принимаются проектной организацией.',
  )}</div>
<script>window.onload = function(){ setTimeout(function(){ window.print(); }, 250); };<\/script>
</body></html>`;

  const w = window.open('', '_blank', 'width=860,height=1000');
  if (!w) return false;
  w.document.open();
  w.document.write(html);
  w.document.close();
  return true;
};

export default printDoc;
