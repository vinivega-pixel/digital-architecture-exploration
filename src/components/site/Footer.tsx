import { useState } from 'react';
import Icon from '@/components/ui/icon';
import BrandMark from '@/components/ui/Logo';
import { projectCloud } from '@/data/projectCloud';
import { useUi } from '@/context/UiContext';
import { scrollTo } from './Header';
import { openStage } from '@/lib/openStage';

/** Размер плитки зависит от длины названия — облако выглядит живым. */
const sizeOf = (name: string) => {
  const n = name.length;
  if (n < 26) return 'text-[0.8rem] px-4 py-2';
  if (n < 40) return 'text-[0.76rem] px-3.5 py-2';
  return 'text-[0.72rem] px-3 py-1.5';
};

const Footer = () => {
  const { openOffer, openAuth } = useUi();
  const [mail, setMail] = useState('');

  const COLS = [
    {
      title: 'Продукт',
      items: [
        { label: 'Инструменты', fn: () => scrollTo('tools') },
        { label: 'Нормы', fn: () => scrollTo('knowledge') },
        { label: 'Документы', fn: () => scrollTo('knowledge') },
        { label: 'Услуги', fn: () => scrollTo('premium') },
      ],
    },
    {
      title: 'Компания',
      items: [
        { label: 'О нас', fn: () => scrollTo('about') },
        { label: 'Этапы', fn: () => scrollTo('path') },
        { label: 'Кому это нужно', fn: () => scrollTo('audience') },
        { label: 'Контакты', fn: () => scrollTo('about') },
      ],
    },
    {
      title: 'Поддержка',
      items: [
        { label: 'Вопросы и ответы', fn: () => scrollTo('about') },
        { label: 'ИИ-ассистент', fn: () => scrollTo('ai') },
        { label: 'Договор оферты', fn: openOffer },
        { label: 'Политика конфиденциальности', fn: openOffer },
      ],
    },
  ];

  return (
    <footer className="bg-[hsl(var(--ink))] pt-20 text-white">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mx-auto max-w-[44em] text-center">
          <p className="text-[0.72rem] uppercase tracking-[0.18em] text-white/45">Состав документации</p>
          <h2 className="mt-4 font-display text-[1.6rem] leading-[1.15] md:text-[2.1rem]">
            Каждый проект — на своём этапе
          </h2>
          <p className="mt-4 text-[0.88rem] leading-[1.7] text-white/55">
            Полный перечень разделов, которые разрабатывает институт. Нажмите на любой — перейдёте к этапу с
            расчётами, шаблонами и нормами.
          </p>
        </div>

        <div className="mt-9 flex flex-wrap justify-center gap-2">
          {projectCloud.map((p) => (
            <button
              key={p.name}
              onClick={() => openStage(p.stage)}
              className={`rounded-full border border-white/12 bg-white/[0.04] leading-snug text-white/70 transition-colors duration-300 hover:border-primary hover:text-white ${sizeOf(p.name)}`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="mt-16 grid gap-10 border-t border-white/10 pt-12 lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,0.8fr))_minmax(0,1.2fr)]">
          <div>
            <span className="flex items-center gap-2.5">
              <BrandMark size={36} tone="light" />
              <span className="font-display text-[1.28rem] tracking-[0.04em]">ЦИФРА</span>
            </span>
            <p className="mt-4 max-w-[22em] text-[0.82rem] leading-[1.7] text-white/45">
              Цифровой институт фундаментального развития архитектуры
            </p>
          </div>

          {COLS.map((c) => (
            <div key={c.title}>
              <p className="text-[0.8rem] font-medium text-white">{c.title}</p>
              <ul className="mt-4 space-y-2.5">
                {c.items.map((it) => (
                  <li key={it.label}>
                    <button onClick={it.fn} className="text-left text-[0.82rem] text-white/50 transition-colors hover:text-white">
                      {it.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-[0.8rem] font-medium text-white">Будьте в курсе</p>
            <p className="mt-3 text-[0.8rem] text-white/45">Подписывайтесь на обновления ЦИФРЫ</p>
            <div className="mt-4 flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] pl-4 pr-1.5">
              <input
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                placeholder="Ваш email"
                className="min-w-0 flex-1 bg-transparent py-3 text-[0.82rem] text-white outline-none placeholder:text-white/35"
              />
              <button
                onClick={() => openAuth('register')}
                aria-label="Подписаться"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary"
              >
                <Icon name="ArrowRight" size={14} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 py-7 text-[0.74rem] text-white/40 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} ЦИФРА. Все права защищены</span>
          <span>В помощь строителям</span>
        </div>

        <p className="pb-10 text-[0.72rem] leading-[1.8] text-white/30">
          Вся информация, представленная на сайте, носит исключительно информационный характер и не является публичной
          офертой в соответствии со ст. 437 ГК РФ. Использование материалов сайта без письменного разрешения
          правообладателя запрещено.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
