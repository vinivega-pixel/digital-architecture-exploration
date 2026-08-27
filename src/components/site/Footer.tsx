import { stages } from '@/data/stages';

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const Footer = () => {
  const half = Math.ceil(stages.length / 2);

  return (
    <footer className="border-t border-border bg-card py-16">
      <div className="container">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-[2rem] leading-none text-foreground">ЦИФРА</p>
            <p className="mt-4 max-w-[26em] text-[0.85rem] leading-[1.7] text-muted-foreground">
              ООО «Цифровой институт фундаментального развития архитектуры». Расчёты, шаблоны и нормы — бесплатно.
              Цифровые продукты, ИИ-агенты и проекты — по подписке премиум.
            </p>
            <a href="mailto:info@cifra-institute.ru" className="link-underline mt-5 inline-block text-[0.88rem] text-primary">
              info@cifra-institute.ru
            </a>
          </div>
          {[stages.slice(0, half), stages.slice(half)].map((group, gi) => (
            <div key={gi}>
              <p className="rubric">{gi === 0 ? 'Этапы 01–06' : 'Этапы 07–11'}</p>
              <ul className="mt-5 space-y-3">
                {group.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => go(s.id)}
                      className="link-underline text-left text-[0.88rem] text-foreground/85 hover:text-primary"
                    >
                      {s.num} · {s.kicker}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 text-[0.72rem] uppercase tracking-[0.14em] text-muted-foreground sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} ООО «Цифра»</span>
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
};

export default Footer;
