import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { adminApi, type AdminUser } from '@/lib/adminApi';

const PLANS = [
  { id: 'day', label: 'Сутки' },
  { id: 'week', label: 'Неделя' },
  { id: 'month', label: 'Месяц' },
  { id: 'quarter', label: 'Квартал' },
  { id: 'year', label: 'Год' },
  { id: 'forever', label: 'Навсегда' },
];

const fmtDate = (s?: string | null) => (s ? new Date(s).toLocaleDateString('ru-RU') : '—');

const AdminUserRow = ({ u, onChange }: { u: AdminUser; onChange: () => void }) => {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [plan, setPlan] = useState('month');
  const [pass, setPass] = useState('');
  const [note, setNote] = useState(u.note ?? '');
  const [msg, setMsg] = useState('');

  const run = async (fn: () => Promise<unknown>, done = '') => {
    setBusy(true);
    setMsg('');
    try {
      await fn();
      setMsg(done);
      onChange();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setBusy(false);
    }
  };

  const premium = Boolean(u.expires_at && new Date(u.expires_at) > new Date());

  return (
    <li className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 py-3 text-left transition-opacity hover:opacity-70"
      >
        <Icon name={open ? 'ChevronDown' : 'ChevronRight'} size={14} className="shrink-0 text-muted-foreground" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.85rem] font-medium text-foreground">
            {u.email}
            {u.role === 'admin' ? (
              <span className="ml-2 border border-primary px-1.5 py-0.5 text-[0.6rem] uppercase tracking-[0.1em] text-primary">
                админ
              </span>
            ) : null}
            {u.blocked ? (
              <span className="ml-2 border border-destructive px-1.5 py-0.5 text-[0.6rem] uppercase tracking-[0.1em] text-destructive">
                блок
              </span>
            ) : null}
          </span>
          <span className="block truncate text-[0.74rem] text-muted-foreground">
            {u.name || 'без имени'}
            {u.company ? ` · ${u.company}` : ''} · с {fmtDate(u.created_at)}
          </span>
        </span>
        <span className="shrink-0 text-right text-[0.7rem] uppercase tracking-[0.08em] text-muted-foreground">
          {premium ? `премиум до ${fmtDate(u.expires_at)}` : 'бесплатно'}
          <span className="block">
            {u.downloads} скач. · {Number(u.paid || 0)} ₽
          </span>
        </span>
      </button>

      {open ? (
        <div className="pb-5 pl-7 pr-1">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="border border-border bg-background px-2 py-2 text-[0.78rem] text-foreground"
            >
              {PLANS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <button
              disabled={busy}
              onClick={() => run(() => adminApi.grant(u.id, plan), 'Премиум выдан')}
              className="border border-primary px-3 py-2 text-[0.72rem] uppercase tracking-[0.1em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Выдать премиум
            </button>
            {premium ? (
              <button
                disabled={busy}
                onClick={() => run(() => adminApi.revoke(u.id), 'Премиум снят')}
                className="border border-border px-3 py-2 text-[0.72rem] uppercase tracking-[0.1em] text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                Снять премиум
              </button>
            ) : null}
            <button
              disabled={busy}
              onClick={() => run(() => adminApi.block(u.id, !u.blocked), u.blocked ? 'Доступ открыт' : 'Доступ закрыт')}
              className="border border-border px-3 py-2 text-[0.72rem] uppercase tracking-[0.1em] text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              {u.blocked ? 'Разблокировать' : 'Заблокировать'}
            </button>
            <button
              disabled={busy}
              onClick={() => run(() => adminApi.setRole(u.id, u.role === 'admin' ? 'user' : 'admin'), 'Права обновлены')}
              className="border border-border px-3 py-2 text-[0.72rem] uppercase tracking-[0.1em] text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              {u.role === 'admin' ? 'Убрать админа' : 'Сделать админом'}
            </button>
            <button
              disabled={busy}
              onClick={() => {
                if (window.confirm(`Удалить кабинет ${u.email}? Действие необратимо.`)) {
                  run(() => adminApi.deleteUser(u.id), 'Кабинет удалён');
                }
              }}
              className="border border-destructive px-3 py-2 text-[0.72rem] uppercase tracking-[0.1em] text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
            >
              Удалить
            </button>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Новый пароль"
                className="w-full border border-border bg-background px-3 py-2 text-[0.78rem] text-foreground outline-none"
              />
              <button
                disabled={busy || pass.length < 6}
                onClick={() => run(() => adminApi.resetPassword(u.id, pass), 'Пароль изменён').then(() => setPass(''))}
                className="shrink-0 border border-border px-3 py-2 text-[0.72rem] uppercase tracking-[0.1em] text-foreground disabled:opacity-40"
              >
                Сменить
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Заметка о клиенте"
                className="w-full border border-border bg-background px-3 py-2 text-[0.78rem] text-foreground outline-none"
              />
              <button
                disabled={busy}
                onClick={() => run(() => adminApi.setNote(u.id, note), 'Заметка сохранена')}
                className="shrink-0 border border-border px-3 py-2 text-[0.72rem] uppercase tracking-[0.1em] text-foreground"
              >
                Сохранить
              </button>
            </div>
          </div>

          {msg ? <p className="mt-2 text-[0.75rem] text-muted-foreground">{msg}</p> : null}
        </div>
      ) : null}
    </li>
  );
};

export default AdminUserRow;
