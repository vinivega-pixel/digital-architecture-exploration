import { projectCloud } from '@/data/projectCloud';

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

/** Размер плитки зависит от длины названия — облако выглядит живым. */
const sizeOf = (name: string) => {
  const n = name.length;
  if (n < 26) return 'text-[0.82rem] px-4 py-2.5';
  if (n < 40) return 'text-[0.78rem] px-3.5 py-2.5';
  return 'text-[0.74rem] px-3 py-2';
};

const Footer = () => (
  <footer className="border-t border-border bg-card py-16">
    <div className="container">
      <div className="mx-auto max-w-[44em] text-center">
        <p className="rubric">Состав документации</p>
        <h2 className="mt-4 font-display text-[1.7rem] leading-[1.15] text-foreground md:text-[2.3rem]">
          Каждый проект — на своём этапе
        </h2>
        <p className="mt-4 text-[0.9rem] leading-[1.75] text-muted-foreground">
          Полный перечень разделов, которые разрабатывает институт. Нажмите на любой — перейдёте к этапу, где он
          готовится, с расчётами, шаблонами и нормами.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {projectCloud.map((p) => (
          <button
            key={p.name}
            onClick={() => go(p.stage)}
            className={`rounded-full border border-border bg-background/60 leading-snug text-foreground/85 transition-colors duration-300 hover:border-primary hover:text-primary ${sizeOf(p.name)}`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="mt-16 flex flex-col gap-3 border-t border-border pt-6 text-[0.72rem] uppercase tracking-[0.14em] text-muted-foreground sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} ЦИФРА</span>
        <span>В помощь строителям</span>
      </div>

      <p className="mt-6 max-w-[70em] text-[0.74rem] leading-[1.8] text-muted-foreground">
        Вся информация, представленная на сайте, носит исключительно информационный характер и не является публичной
        офертой в соответствии со ст. 437 ГК РФ. Все права защищены. Использование материалов сайта без письменного
        разрешения правообладателя запрещено.
      </p>
    </div>
  </footer>
);

export default Footer;
