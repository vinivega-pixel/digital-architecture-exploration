import { stages } from './stages';
import { stageExtras } from './stageExtras';
import { extraCalcs } from './extraCalcs';
import { formulaCalcs } from './formulaCalcs';
import { hiddenCalcIds } from './hiddenCalcs';
import { libDocs } from './libDocs';
import { stageLabels } from './stageLabels';

const esc = (s: string) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const calcsOf = (id: string) => {
  const stage = stages.find((s) => s.id === id);
  if (!stage) return [];
  const extra = stageExtras[id];
  return [
    stage.calc,
    ...(extra?.calcs ?? []),
    ...(extraCalcs[id] ?? []),
    ...(formulaCalcs[id] ?? []),
  ].filter((c) => !hiddenCalcIds.has(c.id));
};

/**
 * Собирает полный текст сайта статической разметкой.
 * Нужен для поисковых роботов, которые не выполняют скрипты.
 */
export const buildSeoHtml = (): string => {
  const parts: string[] = [];

  parts.push(`<header>
<h1>ЦИФРА — Цифровой институт фундаментального развития архитектуры</h1>
<p>Строительные калькуляторы с формулами и выгрузкой расчёта документом, шаблоны документов по государственным формам и библиотека действующих норм. Проектирование, инженерные изыскания, проектная и рабочая документация, сопровождение экспертизы, цифровые продукты института.</p>
<p>Организация: ООО «ЦИФРА». Электронная почта: info@cifra-institute.ru. Регион работы: Российская Федерация. Год основания: 2016. Выполнено более 240 проектов и комплектов документации в 19 регионах.</p>
</header>`);

  parts.push('<nav><h2>Этапы строительного проекта</h2><ul>');
  stages.forEach((s) => {
    parts.push(`<li><a href="#${s.id}">Этап ${s.num}. ${esc(stageLabels[s.id] ?? s.kicker)}</a></li>`);
  });
  parts.push('</ul></nav>');

  stages.forEach((s) => {
    const extra = stageExtras[s.id];
    const calcs = calcsOf(s.id);
    const templates = extra?.templates ?? s.templates;
    const norms = extra?.norms ?? s.norms;

    parts.push(`<section id="${s.id}">
<h2>Этап ${s.num}. ${esc(stageLabels[s.id] ?? s.kicker)}</h2>
<p>${esc(s.lead)}</p>
<h3>Калькуляторы этапа «${esc(s.phase)}» — ${calcs.length} расчётов</h3>
<ul>`);
    calcs.forEach((c) => {
      const bits = [`<strong>${esc(c.title)}</strong>`];
      if (c.note) bits.push(esc(c.note));
      if (c.formula) bits.push(`Формула: ${esc(c.formula)}`);
      if (c.basis) bits.push(`Основание: ${esc(c.basis)}`);
      parts.push(`<li>${bits.join('. ')}</li>`);
    });
    parts.push('</ul>');

    parts.push(`<h3>Шаблоны документов: ${templates.length}</h3><ul>`);
    templates.forEach((t) => parts.push(`<li>${esc(t)}</li>`));
    parts.push('</ul>');

    parts.push(`<h3>Нормы и правила: ${norms.length}</h3><ul>`);
    norms.forEach((n) => parts.push(`<li>${esc(n)}</li>`));
    parts.push('</ul>');

    parts.push(`<h3>Услуги института по этапу</h3>
<p>${esc(s.offer.title)}. ${esc(s.offer.scope.join('. '))}. Срок: ${esc(s.offer.term)}.</p>
</section>`);
  });

  parts.push(`<section id="library">
<h2>Библиотека нормативных документов — ${libDocs.length} документов</h2>
<ul>`);
  libDocs.forEach((d) => parts.push(`<li>${esc(d.code)} — ${esc(d.title)}</li>`));
  parts.push('</ul></section>');

  parts.push(`<section id="premium">
<h2>Премиум-доступ института ЦИФРА</h2>
<h3>Сутки — 999 ₽</h3>
<p>Круглосуточный доступ: личный кабинет премиум, общение с ИИ по вашему проекту, построение карты задач и решений, разработка простых документов, поиск и проверка норм с обоснованием.</p>
<h3>Работа — 5 990 ₽ в месяц</h3>
<p>До пяти проектов в работе, CRM-система управления объектами, офлайн-программы для расчётов без интернета, личный кабинет стройки.</p>
<h3>Месяц, всё включено — 99 999 ₽</h3>
<p>Все функции открыты: разработка проекта включена в подписку, все цифровые продукты института, CRM и офлайн-помощники без доплат, приоритетная поддержка инженеров.</p>
<h3>Цифровые продукты института</h3>
<ul>
<li>Частичная разработка проекта: текстовая, графическая и расчётная части.</li>
<li>Полная разработка проекта: вся документация по ГОСТ с сопровождением инженера.</li>
<li>CRM для управления объектами и документацией.</li>
<li>Цифровой главный инженер-архитектор: разработка разделов онлайн в премиум-кабинете.</li>
<li>Сопровождение экспертизы и отработка замечаний.</li>
<li>Комплекты DWG для строителей.</li>
<li>BIM-модели RVT для согласования заказчиком.</li>
</ul>
</section>`);

  parts.push(`<section id="about">
<h2>Об институте</h2>
<p>ЦИФРА — Цифровой институт фундаментального развития архитектуры. Мы проектируем, считаем и автоматизируем. На каждом этапе строительства доступны бесплатные расчёты, шаблоны документов и нормы, а также цифровые продукты института: ИИ-агенты, офлайн-программы и готовые комплекты проектной и рабочей документации.</p>
<p>Инженерная точность: каждое решение опирается на норматив и расчёт. Одна среда данных: изыскания, модель, документация и стройка живут в общем контуре. Сотрудничество: мы встраиваемся в процесс заказчика.</p>
<p>Контакт: <a href="mailto:info@cifra-institute.ru">info@cifra-institute.ru</a></p>
<p>Сайт разработан на платформе продуктов ЦИФРА.</p>
</section>`);

  return parts.join('\n');
};

export default buildSeoHtml;
