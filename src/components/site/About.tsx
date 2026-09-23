import { useState } from 'react';
import ContactModal from './ContactModal';

const About = () => {
  const [contact, setContact] = useState(false);

  return (
    <section id="about" className="relative border-t border-border bg-secondary/40 py-24 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-[46em] text-center">
          <span className="rubric">Наша философия</span>
          <h2 className="mt-5 font-display text-[2rem] leading-[1.1] text-foreground sm:text-[2.75rem] md:text-[3.25rem]">
            Институт, соединяющий архитектуру и цифровые технологии
          </h2>
          <p className="mt-8 font-display text-[1.35rem] italic leading-[1.5] text-foreground">
            ЦИФРА — Цифровой институт фундаментального развития архитектуры.
          </p>
          <p className="mt-6 text-[0.95rem] leading-[1.8] text-muted-foreground">
            Мы убеждены, что качество стройки определяется не объёмом бумаг, а достоверностью данных. Поэтому каждое
            решение здесь опирается на норматив и расчёт, а изыскания, модель, документация и работы на площадке живут
            в одном контуре, где ничего не теряется между этапами.
          </p>
          <p className="mt-5 text-[0.95rem] leading-[1.8] text-muted-foreground">
            Мы не продаём услугу в отрыве от процесса — мы встраиваемся в работу заказчика и отвечаем за результат
            вместе с ним. Открытые расчёты и нормы доступны каждому без условий: инструмент должен быть в руках у
            того, кто строит.
          </p>
          <button
            type="button"
            onClick={() => setContact(true)}
            className="mt-9 inline-flex items-center justify-center border border-primary px-8 py-4 text-[0.78rem] font-medium uppercase tracking-[0.12em] text-primary transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            Связаться с нами
          </button>
        </div>
      </div>

      <ContactModal open={contact} onClose={() => setContact(false)} />
    </section>
  );
};

export default About;
