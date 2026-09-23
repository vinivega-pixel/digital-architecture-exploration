/**
 * Извлечение текста из загруженного документа: PDF, DOCX, XLSX и простые текстовые форматы.
 * Всё выполняется в браузере, файл никуда не загружается целиком.
 */

const readAsText = (file: File) =>
  new Promise<string>((res) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result ?? ''));
    r.onerror = () => res('');
    r.readAsText(file);
  });

const readPdf = async (file: File) => {
  const pdfjs = await import('pdfjs-dist');
  const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;

  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  const pages: string[] = [];
  const limit = Math.min(doc.numPages, 40);

  for (let i = 1; i <= limit; i += 1) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((it) => ('str' in it ? (it as { str: string }).str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (text) pages.push(`[стр. ${i}] ${text}`);
  }
  return pages.join('\n');
};

const readDocx = async (file: File) => {
  const mammoth = await import('mammoth');
  const buf = await file.arrayBuffer();
  const res = await mammoth.extractRawText({ arrayBuffer: buf });
  return (res.value ?? '').replace(/\n{3,}/g, '\n\n').trim();
};

const readXlsx = async (file: File) => {
  const buf = await file.arrayBuffer();
  const text = new TextDecoder('utf-8', { fatal: false }).decode(buf);
  const strings = text.match(/<t[^>]*>([^<]{2,})<\/t>/g) ?? [];
  return strings
    .map((s) => s.replace(/<[^>]+>/g, ''))
    .join(' | ')
    .slice(0, 20000);
};

export type ReadResult = { text: string; ok: boolean; note: string };

export const readDoc = async (file: File): Promise<ReadResult> => {
  const name = file.name.toLowerCase();
  try {
    if (name.endsWith('.pdf')) {
      const text = await readPdf(file);
      return text
        ? { text, ok: true, note: 'PDF прочитан' }
        : { text: '', ok: false, note: 'В PDF нет текстового слоя — вероятно, это скан. Нужен документ с текстом.' };
    }
    if (name.endsWith('.docx')) {
      const text = await readDocx(file);
      return text ? { text, ok: true, note: 'DOCX прочитан' } : { text: '', ok: false, note: 'Документ пуст' };
    }
    if (name.endsWith('.xlsx')) {
      const text = await readXlsx(file);
      return text ? { text, ok: true, note: 'Таблица прочитана' } : { text: '', ok: false, note: 'Таблица пуста' };
    }
    if (name.endsWith('.doc') || name.endsWith('.xls')) {
      return { text: '', ok: false, note: 'Старый формат Word/Excel. Пересохраните как DOCX или XLSX.' };
    }
    const text = await readAsText(file);
    return text ? { text, ok: true, note: 'Файл прочитан' } : { text: '', ok: false, note: 'Не удалось прочитать файл' };
  } catch {
    return { text: '', ok: false, note: 'Файл повреждён или защищён паролем' };
  }
};

export default readDoc;
