import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import Reveal from './Reveal';
import ProductFlow from './ProductFlow';
import { useAuth } from '@/context/AuthContext';
import { useUi } from '@/context/UiContext';
import { products, type Product } from '@/data/products';

const MAIL = 'cifrainst@mail.ru';

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
              Бесплатной части хватает для работы. Что тогда в кабинете?
            </h2>
            <p className="mt-6 text-[0.95rem] leading-[1.8] text-muted-foreground">
              Инструмент, который экономит время и деньги на стройке. Цифровая платформа института — это база знаний и
              вторая память объекта, инженер, контролёр и ассистент в одном контуре. За решениями стоит мультиагентная
              аналитическая сеть под наблюдением инженеров и юристов: она собирает данные о ходе работ, держит связь с
              исполнителями, ведёт CRM с уведомлениями и показывает объект наглядно — от первой идеи до ввода в
              эксплуатацию.
            </p>
          </div>
        </Reveal>

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
