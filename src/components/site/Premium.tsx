import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import Reveal from './Reveal';
import { useAuth } from '@/context/AuthContext';
import { useUi } from '@/context/UiContext';

const PLANS = [
  {
    id: 'day',
    name: 'Сутки',
    price: '999 ₽',
    period: '24 часа полного доступа',
    forWhom:
      'Проектировщику с готовой ПД и РД — проверить и исправить проект по нормам, подготовиться к экспертизе. Заказчику — проверить смету и оценочную стоимость строительства.',
    items: [
      'Личный кабинет премиум',
      'Общение с ИИ по вашему проекту',
      'Построение карты задач и решений',
      'Разработка простых документов',
      'Поиск и проверка норм с обоснованием',
    ],
    best: true,
  },
  {
    id: 'work',
    name: 'Работа',
    price: '5 990 ₽',
    period: 'в месяц · до 5 проектов в работе',
    forWhom:
      'Для тех, кто ведёт несколько объектов одновременно. Всё из суточного премиума плюс инструменты для постоянной работы. Количество проектов можно расширить.',
    items: [
      'Всё из суточного премиума',
      'До 5 проектов в работе, лимит расширяется',
      'CRM-система для управления объектами',
      'Офлайн-программы HTML для расчётов без интернета',
      'Личный кабинет стройки внутри премиума',
    ],
  },
  {
    id: 'month',
    name: 'Месяц · всё включено',
    price: '99 999 ₽',
    period: '30 дней · без доплат',
    forWhom:
      'Все функции открыты бесплатно, включая полную разработку проекта. Ничего докупать не нужно.',
    items: [
      'Всё из тарифа «Работа»',
      'Разработка проекта включена в подписку',
      'Все цифровые продукты института',
      'CRM и офлайн-помощники без доплат',
      'Приоритетная поддержка инженеров',
    ],
  },
];

const Premium = () => {
  const { user, premium, startPayment } = useAuth();
  const { openAuth, openAccount, openOffer } = useUi();
  const [plan, setPlan] = useState('day');

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('plan');
    if (fromUrl && PLANS.some((p) => p.id === fromUrl)) setPlan(fromUrl);
  }, []);

  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (id) setPlan(id);
    };
    window.addEventListener('select-plan', onSelect);
    return () => window.removeEventListener('select-plan', onSelect);
  }, []);
  const [busy, setBusy] = useState(false);
  const [agree, setAgree] = useState(false);
  const [note, setNote] = useState<string | null>(null);

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

  return (
    <section id="premium" className="scroll-mt-16 border-t border-border bg-background py-20">
      <div className="container">
        <Reveal>
          <p className="rubric">Премиум-доступ</p>
          <h2 className="mt-3 max-w-[18em] font-display text-[2rem] leading-[1.1] text-foreground md:text-[2.8rem]">
            Цифровые продукты института — по подписке
          </h2>
          <p className="mt-4 max-w-[42em] text-[0.95rem] leading-[1.7] text-muted-foreground">
            Полезная сторона и диалог с ИИ-агентом открыты бесплатно всегда. Премиум добавляет автопроверку по
            нормам, цифровые продукты и разработку документов под ключ по цене института.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              <button
                onClick={() => setPlan(p.id)}
                className={`flex h-full w-full flex-col border p-7 text-left transition-colors ${
                  plan === p.id ? 'border-primary bg-card' : 'border-border bg-card/40 hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">{p.name}</p>
                  {p.best && (
                    <span className="bg-primary px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.14em] text-primary-foreground">
                      Выбор института
                    </span>
                  )}
                </div>
                <p className="mt-4 font-display text-[2.2rem] leading-none text-foreground">{p.price}</p>
                <p className="mt-2 text-[0.78rem] text-muted-foreground">{p.period}</p>
                <p className="mt-4 border-t border-border pt-4 text-[0.82rem] leading-relaxed text-muted-foreground">
                  {p.forWhom}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-2.5 text-[0.85rem] leading-relaxed text-foreground/85">
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
                  <p className="font-display text-xl text-foreground">Премиум-доступ активен</p>
                  <p className="mt-2 text-[0.88rem] text-muted-foreground">
                    Все разделы открыты. Срок действия и историю расчётов видно в личном кабинете.
                  </p>
                  <button
                    type="button"
                    onClick={openAccount}
                    className="link-underline mt-3 text-[0.86rem] text-primary"
                  >
                    Открыть личный кабинет
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="rubric">Выбран тариф</p>
                  <p className="mt-1 font-display text-xl text-foreground">
                    {PLANS.find((p) => p.id === plan)?.name} — {PLANS.find((p) => p.id === plan)?.price}
                  </p>
                  <p className="mt-1 text-[0.8rem] text-muted-foreground">
                    {user ? 'Оплата через Робокассу, доступ откроется сразу после платежа.' : 'Создайте аккаунт — займёт минуту, оплата сразу после.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={pay}
                  disabled={busy || !agree}
                  className="flex shrink-0 items-center justify-center gap-2 bg-primary px-8 py-4 text-[0.78rem] font-medium uppercase tracking-[0.12em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  <Icon name="CreditCard" size={16} />
                  {user ? 'Оплатить премиум' : 'Создать аккаунт и оплатить'}
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
            {note && (
              <p className="mt-4 border border-border px-4 py-3 text-[0.82rem] text-foreground">{note}</p>
            )}
            <p className="mt-5 text-[0.72rem] leading-relaxed text-muted-foreground">
              Оформляя подписку, вы соглашаетесь на обработку адреса электронной почты в соответствии с ФЗ-152 «О
              персональных данных». Намерение приобрести услугу является подтверждением согласия с условиями
              публичной оферты.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Premium;