import { useState } from 'react';
import Icon from '@/components/ui/icon';
import Reveal from './Reveal';
import { useAuth } from '@/context/AuthContext';
import { useUi } from '@/context/UiContext';

const PLANS = [
  { id: 'month', name: 'Месяц', price: '4 900 ₽', period: 'в месяц', items: ['Все калькуляторы с выгрузкой PDF', 'База шаблонов и норм', 'Офлайн-программы HTML'] },
  { id: 'year', name: 'Год', price: '39 000 ₽', period: 'в год · выгоднее на 34 %', items: ['Всё из месячного доступа', 'ИИ-агенты по разделам проекта', 'Карты согласований и горького опыта', 'Приоритетные ответы института'], best: true },
  { id: 'team', name: 'Команда', price: '129 000 ₽', period: 'в год · до 15 сотрудников', items: ['Всё из годового доступа', 'Автоматизация бизнес-процессов и CRM', 'Цифровой двойник объекта', 'Обучение команды'] },
];

const Premium = () => {
  const { user, premium, startPayment } = useAuth();
  const { openAuth, openAccount } = useUi();
  const [plan, setPlan] = useState('year');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const pay = async () => {
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
            Полезная сторона остаётся открытой и бесплатной всегда. Премиум добавляет автономных ИИ-агентов,
            офлайн-программы, готовые комплекты проектов и карты процессов.
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
                <ul className="mt-6 space-y-2.5">
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
          <div className="mt-10 border border-border bg-card p-7 md:p-10">
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
                  disabled={busy}
                  className="flex shrink-0 items-center justify-center gap-2 bg-primary px-8 py-4 text-[0.78rem] font-medium uppercase tracking-[0.12em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  <Icon name="CreditCard" size={16} />
                  {user ? 'Оплатить премиум' : 'Создать аккаунт и оплатить'}
                </button>
              </div>
            )}
            {note && (
              <p className="mt-4 border border-border px-4 py-3 text-[0.82rem] text-foreground">{note}</p>
            )}
            <p className="mt-5 text-[0.72rem] leading-relaxed text-muted-foreground">
              Оформляя подписку, вы соглашаетесь на обработку адреса электронной почты в соответствии с ФЗ-152 «О
              персональных данных». Условия доступа не являются публичной офертой (ст. 437 ГК РФ).
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Premium;
