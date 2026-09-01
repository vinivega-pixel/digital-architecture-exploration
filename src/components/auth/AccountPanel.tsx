import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { wsApi } from '@/lib/workspaceApi';
import { useAuth, type DownloadItem } from '@/context/AuthContext';

const fmtDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

const fmtDateTime = (value: string) =>
  new Date(value).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });

const KIND_LABEL: Record<string, string> = {
  calc: 'Расчёт',
  template: 'Шаблон документа',
  norm: 'Норматив',
  offer: 'Расчёт стоимости',
};

const daysLeft = (value?: string | null) => {
  if (!value) return 0;
  return Math.max(0, Math.ceil((new Date(value).getTime() - Date.now()) / 86400000));
};

const AccountPanel = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { user, logout, history } = useAuth();
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [cabinet, setCabinet] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !user) return;
    setLoading(true);
    history()
      .then(setItems)
      .finally(() => setLoading(false));
  }, [open, user, history]);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const access = user?.access ?? { premium: false, plan: null, expiresAt: null };

  useEffect(() => {
    if (!open || !access.premium) return;
    wsApi
      .state()
      .then((s) => setCabinet(s.workspace?.code ?? null))
      .catch(() => setCabinet(null));
  }, [open, access.premium]);

  if (!open || !user) return null;

  const left = daysLeft(access.expiresAt);

  return (
    <div
      className="fixed inset-0 z-[90] flex justify-end bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Личный кабинет"
    >
      <div
        className="flex h-full w-full max-w-[520px] flex-col overflow-y-auto border-l border-border bg-card p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="rubric">Личный кабинет</p>
            <h3 className="mt-2 font-display text-2xl leading-tight text-foreground">
              {user.name || user.email}
            </h3>
            <p className="mt-1 text-[0.84rem] text-muted-foreground">{user.email}</p>
            {user.company ? <p className="text-[0.84rem] text-muted-foreground">{user.company}</p> : null}
          </div>
          <button onClick={onClose} aria-label="Закрыть" className="shrink-0 text-foreground opacity-70">
            <Icon name="X" size={22} />
          </button>
        </div>

        <div
          className="mt-6 border p-5"
          style={{
            borderColor: access.premium ? 'hsl(var(--primary))' : 'hsl(var(--border))',
            background: access.premium ? 'hsl(var(--primary) / 0.08)' : 'transparent',
          }}
        >
          <div className="flex items-center gap-2">
            <Icon
              name={access.premium ? 'ShieldCheck' : 'Lock'}
              size={18}
              className={access.premium ? 'text-primary' : 'text-muted-foreground'}
            />
            <p className="text-[0.78rem] font-medium uppercase tracking-[0.12em] text-foreground">
              {access.premium ? 'Премиум-доступ активен' : 'Бесплатный доступ'}
            </p>
          </div>

          {access.premium ? (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="rubric">Тариф</p>
                <p className="mt-1 text-[0.9rem] text-foreground">
                  {access.plan === 'month' ? 'Месяц' : access.plan === 'team' ? 'Команда' : 'Год'}
                </p>
              </div>
              <div>
                <p className="rubric">Действует до</p>
                <p className="mt-1 text-[0.9rem] text-foreground">{fmtDate(access.expiresAt)}</p>
              </div>
              <div className="col-span-2">
                <p className="rubric">Осталось</p>
                <p className="mt-1 font-display text-2xl text-primary">{left} дн.</p>
              </div>
              <a
                href={cabinet ? `/${cabinet.toLowerCase()}` : '/cabinet'}
                className="col-span-2 flex items-center justify-center gap-2 bg-primary px-5 py-3.5 text-[0.76rem] font-medium uppercase tracking-[0.12em] text-primary-foreground"
              >
                <Icon name="LayoutDashboard" size={16} />
                Открыть рабочий стол{cabinet ? ` · ${cabinet}` : ''}
              </a>
            </div>
          ) : (
            <>
              <p className="mt-3 text-[0.85rem] leading-relaxed text-muted-foreground">
                Открыты калькуляторы, шаблоны документов и нормы. Премиум добавляет ИИ-агента, готовые документы и
                автопроверку по нормам.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  document.getElementById('premium')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 bg-primary px-5 py-3 text-[0.76rem] font-medium uppercase tracking-[0.12em] text-primary-foreground"
              >
                <Icon name="Sparkles" size={15} />
                Подключить премиум
              </button>
            </>
          )}
        </div>

        <div className="mt-8">
          <div className="flex items-baseline justify-between gap-3">
            <p className="rubric">История скачиваний</p>
            <span className="text-[0.78rem] text-muted-foreground">{items.length}</span>
          </div>

          {loading ? (
            <p className="mt-4 text-[0.85rem] text-muted-foreground">Загружаем…</p>
          ) : items.length === 0 ? (
            <p className="mt-4 text-[0.85rem] leading-relaxed text-muted-foreground">
              Пока пусто. Скачайте расчёт или шаблон — он появится здесь с датой и названием этапа.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {items.map((it) => (
                <li key={it.id} className="flex items-start gap-3 py-3">
                  <Icon
                    name={it.kind === 'template' ? 'FileText' : it.kind === 'offer' ? 'FileDown' : 'Calculator'}
                    size={15}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.86rem] leading-snug text-foreground">{it.title}</p>
                    <p className="mt-0.5 text-[0.72rem] text-muted-foreground">
                      {KIND_LABEL[it.kind] ?? 'Документ'}
                      {it.stage ? ` · ${it.stage}` : ''} · {fmtDateTime(it.created_at)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="button"
          onClick={async () => {
            await logout();
            onClose();
          }}
          className="mt-auto flex items-center justify-center gap-2 border border-border px-5 py-3 text-[0.76rem] font-medium uppercase tracking-[0.12em] text-foreground transition-colors hover:border-primary"
        >
          <Icon name="LogOut" size={15} />
          Выйти
        </button>
      </div>
    </div>
  );
};

export default AccountPanel;