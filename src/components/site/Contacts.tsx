import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useReveal } from '@/hooks/use-reveal';

const TOPICS = [
  'Проектная документация',
  'Рабочая документация',
  'Инженерные изыскания',
  'Автоматизация процессов',
  'Доступ к платформе',
  'Цифровой двойник',
];

type Errors = Partial<Record<'name' | 'contact' | 'topic' | 'message', string>>;

const CONTACTS = [
  { icon: 'Phone', label: 'Телефон', value: '+7 (495) 120-45-90', href: 'tel:+74951204590' },
  { icon: 'Mail', label: 'Почта', value: 'project@cifra-institute.ru', href: 'mailto:project@cifra-institute.ru' },
  { icon: 'MapPin', label: 'Офис', value: 'Москва, Пресненская наб., 12, этаж 21', href: undefined },
  { icon: 'Clock', label: 'Режим', value: 'Пн–Пт, 09:00 — 19:00 (МСК)', href: undefined },
];

const Contacts = () => {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const { toast } = useToast();

  const [form, setForm] = useState({ name: '', contact: '', topic: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const validate = (): Errors => {
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = 'Укажите имя — минимум 2 символа';

    const c = form.contact.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c);
    const isPhone = /^\+?[\d\s()-]{10,18}$/.test(c);
    if (!isEmail && !isPhone) e.contact = 'Введите телефон или e-mail для связи';

    if (!form.topic) e.topic = 'Выберите тему обращения';
    if (form.message.trim().length < 10) e.message = 'Опишите задачу подробнее (от 10 символов)';
    return e;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast({
        title: 'Проверьте форму',
        description: 'Некоторые поля заполнены некорректно.',
        variant: 'destructive',
      });
      return;
    }
    setSent(true);
    toast({
      title: 'Заявка принята',
      description: 'Инженер свяжется с вами в течение рабочего дня.',
    });
  };

  const field = (k: keyof typeof form, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  return (
    <section id="contacts" className="relative overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_100%,hsl(var(--accent)/0.12),transparent_60%)]" />
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-20" />

      <div ref={ref} className="relative mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="grid gap-px border border-border bg-border lg:grid-cols-[1fr_1.15fr]">
          {/* Контактная колонка */}
          <div className="bg-card p-8 lg:p-12">
            <div className={visible ? 'opacity-0 animate-fade-in' : 'opacity-0'}>
              <p className="mono-label">07 · Контакты</p>
              <h2 className="mt-4 font-display text-4xl font-semibold uppercase leading-[0.95] tracking-tight sm:text-5xl">
                Начнём <span className="text-primary">с задачи</span>
              </h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                Опишите объект и стадию — мы вернёмся с составом работ, сроком и
                предварительной стоимостью. Консультация инженера бесплатна.
              </p>
            </div>

            <div className="mt-10 space-y-px border border-border bg-border">
              {CONTACTS.map((c) => {
                const inner = (
                  <div className="flex items-center gap-5 bg-background p-5 transition-colors hover:bg-secondary">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-border text-primary">
                      <Icon name={c.icon} size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="mono-label block">{c.label}</span>
                      <span className="mt-1 block truncate text-sm text-foreground">{c.value}</span>
                    </span>
                  </div>
                );
                return c.href ? (
                  <a key={c.label} href={c.href} className="block">
                    {inner}
                  </a>
                ) : (
                  <div key={c.label}>{inner}</div>
                );
              })}
            </div>

            <div className="mt-8 border border-accent/30 bg-accent/5 p-5">
              <p className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
                <Icon name="ShieldCheck" size={18} className="mt-0.5 shrink-0 text-accent" />
                Данные объекта передаются под NDA. Материалы не используются
                в портфолио без письменного согласия заказчика.
              </p>
            </div>
          </div>

          {/* Форма */}
          <div className="bg-background p-8 lg:p-12">
            {sent ? (
              <div className="flex h-full animate-scale-in flex-col items-center justify-center gap-6 py-16 text-center">
                <span className="flex h-20 w-20 items-center justify-center border border-primary/50 bg-primary/10 text-primary glow-ring">
                  <Icon name="Check" size={34} />
                </span>
                <h3 className="font-display text-3xl font-semibold uppercase tracking-tight">
                  Заявка отправлена
                </h3>
                <p className="max-w-sm leading-relaxed text-muted-foreground">
                  {form.name}, спасибо. Мы получили обращение по теме «{form.topic}» и
                  свяжемся с вами в течение рабочего дня.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSent(false);
                    setForm({ name: '', contact: '', topic: '', message: '' });
                  }}
                  className="border-border font-mono text-[11px] uppercase tracking-[0.18em]"
                >
                  Отправить ещё одну
                </Button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-6">
                <div>
                  <p className="mono-label">Заявка на проект</p>
                  <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.05em]">
                    Форма обращения
                  </h3>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name" className="mono-label normal-case tracking-[0.12em]">
                      Имя и компания
                    </Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => field('name', e.target.value)}
                      placeholder="Алексей, СтройПроект"
                      className="mt-2 h-11 border-border bg-card focus-visible:ring-primary"
                    />
                    {errors.name && (
                      <p className="mt-1.5 font-mono text-[11px] text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="contact" className="mono-label normal-case tracking-[0.12em]">
                      Телефон или e-mail
                    </Label>
                    <Input
                      id="contact"
                      value={form.contact}
                      onChange={(e) => field('contact', e.target.value)}
                      placeholder="+7 900 000-00-00"
                      className="mt-2 h-11 border-border bg-card focus-visible:ring-primary"
                    />
                    {errors.contact && (
                      <p className="mt-1.5 font-mono text-[11px] text-destructive">
                        {errors.contact}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="mono-label normal-case tracking-[0.12em]">Тема обращения</Label>
                  <Select value={form.topic} onValueChange={(v) => field('topic', v)}>
                    <SelectTrigger className="mt-2 h-11 border-border bg-card focus:ring-primary">
                      <SelectValue placeholder="Выберите направление" />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-card">
                      {TOPICS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.topic && (
                    <p className="mt-1.5 font-mono text-[11px] text-destructive">{errors.topic}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="message" className="mono-label normal-case tracking-[0.12em]">
                    Задача
                  </Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => field('message', e.target.value)}
                    rows={5}
                    placeholder="Объект, стадия, сроки, что уже готово"
                    className="mt-2 resize-none border-border bg-card focus-visible:ring-primary"
                  />
                  {errors.message && (
                    <p className="mt-1.5 font-mono text-[11px] text-destructive">
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="h-12 w-full bg-primary font-mono text-[12px] uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/85"
                >
                  Отправить заявку
                  <Icon name="Send" size={15} className="ml-2" />
                </Button>

                <p className="font-mono text-[10px] leading-relaxed text-muted-foreground">
                  Нажимая кнопку, вы соглашаетесь на обработку персональных данных
                  в соответствии с политикой конфиденциальности.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacts;