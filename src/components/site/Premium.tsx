import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import Reveal from './Reveal';
import ProductFlow from './ProductFlow';
import { useAuth } from '@/context/AuthContext';
import { useUi } from '@/context/UiContext';
import { products, type Product } from '@/data/products';

const MAIL = 'cifrainst@mail.ru';

const CONTOUR = [
  {
    title: 'Бесплатно',
    icon: 'Compass',
    fg: '#34d399',
    bg: 'rgba(52,211,153,.14)',
    note: 'Всё, что нужно, чтобы посчитать, свериться с нормой и оформить документ. Без регистрации и оплаты.',
    items: ['Расчёты', 'Нормы', 'Документы', 'База знаний'],
  },
  {
    title: 'В рабочем пространстве',
    icon: 'LayoutGrid',
    fg: '#2f6df6',
    bg: 'rgba(47,109,246,.14)',
    accent: true,
    note: 'Проект живёт целиком: документы, сроки, деньги и решения собраны в одном контуре, команда работает рядом.',
    items: ['Проект', 'Документы объекта', 'РОЙ', 'Аналитика', 'Командная работа', 'Контроль', 'История решений'],
  },
  {
    title: 'С профессиональной поддержкой',
    icon: 'HardHat',
    fg: '#f2a65a',
    bg: 'rgba(242,166,90,.14)',
    note: 'Там, где нужен живой инженер: изыскания, проектирование и защита решений перед экспертизой.',
    items: ['Изыскания', 'Проектирование', 'Экспертиза', 'Авторский надзор', 'Аудит'],
  },
];

const Premium = () => {
  const { user, premium, startPayment } = useAuth();
  const { openAuth, openAccount } = useUi();
  const [plan, setPlan] = useState<string | null>(null);
  const [flow, setFlow] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('plan');
    if (fromUrl && products.some((p) => p.id === fromUrl)) setPlan(fromUrl);
  }, []);

  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (id) setPlan(id);
    };
    window.addEventListener('select-plan', onSelect);
    return () => window.removeEventListener('select-plan', onSelect);
  }, []);

  const pay = async (id: string) => {
    if (!user) {
      setFlow(null);
      openAuth('register');
      return;
    }
    setBusy(true);
    setNote(null);
    const res = await startPayment(id);
    setBusy(false);
    if (!res.ok) {
      setFlow(null);
      setNote(res.message ?? 'Не удалось перейти к оплате');
    }
  };

  const sendRequest = (product: Product, text: string, contact: string) => {
    const body = `Продукт: ${product.name} (${product.price})\nКонтакт: ${contact}\n\n${text}`;
    window.location.href = `mailto:${MAIL}?subject=${encodeURIComponent('Заявка на разработку документации')}&body=${encodeURIComponent(body)}`;
    setFlow(null);
    setNote('Заявка сформирована — отправьте письмо из почтовой программы, мы ответим в течение рабочего дня.');
  };

  return (
    <section id="premium" className="scroll-mt-20 border-t border-border bg-background py-20 md:py-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <div className="mx-auto max-w-[52em] text-center">
            <p className="rubric">Цифровой кабинет строителя</p>
            <h2 className="mt-4 font-display text-[1.9rem] leading-[1.15] text-foreground md:text-[2.7rem]">
              Соберите свой цифровой контур проекта
            </h2>
            <p className="mt-6 text-[0.95rem] leading-[1.8] text-muted-foreground">
              Контур растёт вместе с объектом. Начинается с расчётов и норм, превращается в рабочее пространство с
              документами, аналитикой и командой, а на сложных участках подключается живая поддержка инженеров. Всё
              собрано в одном месте: от первой идеи до ввода в эксплуатацию.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {CONTOUR.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <div
                className="flex h-full flex-col rounded-2xl border p-7"
                style={{ borderColor: c.accent ? 'hsl(var(--primary) / 0.4)' : undefined }}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: c.bg }}
                  >
                    <Icon name={c.icon} size={17} style={{ color: c.fg }} />
                  </span>
                  <span className="font-display text-[1.15rem] leading-tight text-foreground">{c.title}</span>
                </span>
                <p className="mt-3 text-[0.84rem] leading-relaxed text-muted-foreground">{c.note}</p>
                <ul className="mt-5 space-y-2 border-t border-border pt-5">
                  {c.items.map((it) => (
                    <li key={it} className="flex items-center gap-2.5 text-[0.88rem] text-foreground/85">
                      <Icon name="Check" size={14} className="shrink-0" style={{ color: c.fg }} />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {premium ? (
          <Reveal>
            <div className="mx-auto mt-10 flex max-w-2xl items-start gap-3 rounded-2xl border border-border bg-card p-7">
              <Icon name="ShieldCheck" size={22} className="mt-0.5 shrink-0 text-primary" />
              <div>
                <p className="font-display text-xl text-foreground">Доступ активен</p>
                <p className="mt-2 text-[0.88rem] text-muted-foreground">
                  Все разделы открыты. Срок действия и историю работы видно в личном кабинете.
                </p>
                <button onClick={openAccount} className="link-underline mt-3 text-[0.86rem] text-primary">
                  Открыть личный кабинет
                </button>
              </div>
            </div>
          </Reveal>
        ) : null}

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => {
            const on = plan === p.id;
            return (
              <Reveal key={p.id} delay={i * 70}>
                <div
                  className={`flex h-full flex-col rounded-2xl border p-7 transition-colors ${
                    on ? 'border-primary bg-card' : 'border-border bg-card/40'
                  }`}
                >
                  <button onClick={() => setPlan(on ? null : p.id)} className="flex flex-1 flex-col text-left">
                    <span className="flex items-start justify-between gap-3">
                      <span className="text-[0.72rem] uppercase leading-snug tracking-[0.14em] text-muted-foreground">
                        {p.name}
                      </span>
                      {p.best && (
                        <span className="shrink-0 rounded-full bg-primary px-2.5 py-0.5 text-[0.58rem] uppercase tracking-[0.1em] text-primary-foreground">
                          Выбор института
                        </span>
                      )}
                    </span>
                    {p.audience?.length ? (
                      <span className="mt-1.5 block text-[0.66rem] leading-snug text-emerald-600 dark:text-emerald-400">
                        {p.audience.join(' · ')}
                      </span>
                    ) : null}
                    <span className="mt-3 block font-display text-[1.75rem] leading-none text-foreground">{p.price}</span>
                    <span className="mt-2 block text-[0.76rem] text-muted-foreground">{p.period}</span>
                    <span className="mt-4 block border-t border-border pt-4 text-[0.82rem] leading-relaxed text-muted-foreground">
                      {p.lead}
                    </span>
                  </button>

                  {on ? (
                    <div className="mt-5 flex flex-wrap gap-2.5 border-t border-border pt-5">
                      <button
                        onClick={() => setFlow(p)}
                        className="flex items-center gap-2 rounded-full border border-border px-5 py-3 text-[0.82rem] text-foreground transition-colors hover:border-primary"
                      >
                        <Icon name="Info" size={15} />
                        Подробнее
                      </button>
                      <button
                        onClick={() => setFlow(p)}
                        className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[0.82rem] font-medium text-primary-foreground"
                      >
                        <Icon name={p.id === 'pd' ? 'Send' : 'CreditCard'} size={15} />
                        {p.id === 'pd' ? 'Оставить заявку' : 'Заказать'}
                      </button>
                    </div>
                  ) : (
                    <p className="mt-5 border-t border-border pt-5 text-[0.78rem] text-muted-foreground">
                      Нажмите на карточку, чтобы выбрать
                    </p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {note ? (
          <p className="mx-auto mt-6 max-w-2xl rounded-xl border border-border bg-card px-5 py-4 text-center text-[0.85rem] text-foreground">
            {note}
          </p>
        ) : null}

        <p className="mx-auto mt-8 max-w-[60em] text-center text-[0.74rem] leading-[1.8] text-muted-foreground">
          Оформляя доступ, вы соглашаетесь на обработку адреса электронной почты в соответствии с ФЗ-152 «О
          персональных данных». Намерение приобрести услугу является подтверждением согласия с условиями публичной
          оферты.
        </p>
      </div>

      <ProductFlow product={flow} onClose={() => setFlow(null)} onPay={pay} onRequest={sendRequest} busy={busy} />
    </section>
  );
};

export default Premium;
