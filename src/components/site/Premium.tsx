import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import Reveal from './Reveal';
import { useAuth } from '@/context/AuthContext';
import { useUi } from '@/context/UiContext';
import { products } from '@/data/products';

const Premium = () => {
  const { user, premium, startPayment } = useAuth();
  const { openAuth, openAccount, openOffer } = useUi();
  const [plan, setPlan] = useState('cabinet');
  const [busy, setBusy] = useState(false);
  const [agree, setAgree] = useState(false);
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

  const pay = async () => {
    if (!agree) {
      setNote('Подтвердите ознакомление с условиями публичной оферты');
      return;
    }
    if (!user) {
      openAuth('register');
      return;
    }
    setBusy(true);
    setNote(null);
    const res = await startPayment(plan);
    setBusy(false);
    if (!res.ok) setNote(res.message ?? 'Не удалось перейти к оплате');
  };

  const chosen = products.find((p) => p.id === plan);

  return (
    <section id="premium" className="scroll-mt-16 border-t border-border bg-background py-20">
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-[52em] text-center">
            <p className="rubric">Личный кабинет строителя</p>
            <h2 className="mt-4 font-display text-[1.9rem] leading-[1.15] text-foreground md:text-[2.7rem]">
              Бесплатной части хватает для работы. Что тогда в кабинете?
            </h2>
            <p className="mt-6 text-[0.95rem] leading-[1.8] text-muted-foreground">
              Инструмент, который экономит время и деньги на стройке. Цифровая платформа института — это база знаний
              и вторая память объекта, инженер, контролёр и ассистент в одном контуре. За решениями стоит
              мультиагентная аналитическая сеть под наблюдением инженеров и юристов: она собирает данные о ходе работ,
              держит связь с исполнителями, ведёт CRM с уведомлениями и показывает объект наглядно — от первой идеи до
              ввода в эксплуатацию, в любой отрасли и любом масштабе.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 70}>
              <button
                onClick={() => setPlan(p.id)}
                className={`flex h-full w-full flex-col border p-7 text-left transition-colors ${
                  plan === p.id ? 'border-primary bg-card' : 'border-border bg-card/40 hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[0.72rem] uppercase leading-snug tracking-[0.14em] text-muted-foreground">
                    {p.name}
                  </p>
                  {p.best && (
                    <span className="shrink-0 bg-primary px-2 py-0.5 text-[0.58rem] uppercase tracking-[0.12em] text-primary-foreground">
                      Выбор института
                    </span>
                  )}
                </div>
                <p className="mt-4 font-display text-[1.75rem] leading-none text-foreground">{p.price}</p>
                <p className="mt-2 text-[0.76rem] text-muted-foreground">{p.period}</p>
                <p className="mt-4 border-t border-border pt-4 text-[0.82rem] leading-relaxed text-muted-foreground">
                  {p.lead}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-2.5 text-[0.84rem] leading-relaxed text-foreground/85">
                      <Icon name="Check" size={15} className="mt-0.5 shrink-0 text-primary" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-6 border border-border bg-card p-7 md:p-10">
            {premium ? (
              <div className="flex items-start gap-3">
                <Icon name="ShieldCheck" size={22} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <p className="font-display text-xl text-foreground">Доступ активен</p>
                  <p className="mt-2 text-[0.88rem] text-muted-foreground">
                    Все разделы открыты. Срок действия и историю работы видно в личном кабинете.
                  </p>
                  <button type="button" onClick={openAccount} className="link-underline mt-3 text-[0.86rem] text-primary">
                    Открыть личный кабинет
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="rubric">Выбрано</p>
                  <p className="mt-1 font-display text-xl text-foreground">
                    {chosen?.name} — {chosen?.price}
                  </p>
                  <p className="mt-1 text-[0.8rem] text-muted-foreground">
                    {user
                      ? 'Оплата через Робокассу, доступ откроется сразу после платежа.'
                      : 'Зарегистрируйтесь — это займёт минуту, и получите ознакомительный доступ.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={pay}
                  disabled={busy || !agree}
                  className="flex shrink-0 items-center justify-center gap-2 bg-primary px-8 py-4 text-[0.78rem] font-medium uppercase tracking-[0.12em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  <Icon name={user ? 'CreditCard' : 'UserPlus'} size={16} />
                  {user ? 'Оплатить и открыть кабинет' : 'Зарегистрироваться и получить доступ'}
                </button>
              </div>
            )}

            {!premium && (
              <label className="mt-5 flex cursor-pointer items-start gap-3 border border-border px-4 py-3.5">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => {
                    setAgree(e.target.checked);
                    if (e.target.checked) setNote(null);
                  }}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                />
                <span className="text-[0.82rem] leading-relaxed text-muted-foreground">
                  С условиями{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      openOffer();
                    }}
                    className="link-underline text-primary"
                  >
                    публичной оферты
                  </button>{' '}
                  ознакомлен и согласен
                </span>
              </label>
            )}
            {note && <p className="mt-4 border border-border px-4 py-3 text-[0.82rem] text-foreground">{note}</p>}
            <p className="mt-5 text-[0.72rem] leading-relaxed text-muted-foreground">
              Оформляя доступ, вы соглашаетесь на обработку адреса электронной почты в соответствии с ФЗ-152 «О
              персональных данных». Намерение приобрести услугу является подтверждением согласия с условиями публичной
              оферты.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Premium;
