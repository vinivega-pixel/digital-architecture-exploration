import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { adminApi, type AdminUser, type AdminWorkspace } from '@/lib/adminApi';

const STATUS: Record<string, string> = {
  active: 'выдан',
  reserved: 'в резерве',
  blocked: 'заблокирован',
};

const AdminWorkspaces = ({
  items,
  users,
  onChange,
}: {
  items: AdminWorkspace[];
  users: AdminUser[];
  onChange: () => void;
}) => {
  const [open, setOpen] = useState<string | null>(null);
  const [pick, setPick] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const run = async (fn: () => Promise<unknown>, done: string) => {
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

  const free = items.filter((w) => w.status === 'reserved').length;

  return (
    <>
      <p className="mb-3 text-[0.8rem] text-muted-foreground">
        Всего кабинетов {items.length} · свободно {free} · выдано {items.length - free}
      </p>

      <ul className="border-t border-border">
        {items.map((w) => {
          const isOpen = open === w.code;
          return (
            <li key={w.code} className="border-b border-border">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : w.code)}
                className="flex w-full items-center gap-3 py-3 text-left"
              >
                <Icon
                  name={isOpen ? 'ChevronDown' : 'ChevronRight'}
                  size={14}
                  className="shrink-0 text-muted-foreground"
                />
                <span className="w-[74px] shrink-0 font-mono text-[0.82rem] text-foreground">{w.code}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.84rem] text-foreground">{w.title}</span>
                  <span className="block truncate text-[0.72rem] text-muted-foreground">
                    {w.owner_email ?? 'без владельца'} · проектов {w.projects} · файлов {w.files}
                  </span>
                </span>
                <span
                  className={`shrink-0 border px-2 py-0.5 text-[0.64rem] uppercase tracking-[0.08em] ${
                    w.status === 'active' ? 'border-primary text-primary' : 'border-border text-muted-foreground'
                  }`}
                >
                  {STATUS[w.status] ?? w.status}
                </span>
              </button>

              {isOpen ? (
                <div className="flex flex-wrap items-center gap-2 pb-4 pl-7">
                  <select
                    value={pick[w.code] ?? ''}
                    onChange={(e) => setPick((p) => ({ ...p, [w.code]: e.target.value }))}
                    className="border border-border bg-background px-2 py-2 text-[0.78rem] text-foreground"
                  >
                    <option value="">— выбрать пользователя —</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.email}
                      </option>
                    ))}
                  </select>
                  <button
                    disabled={busy || !pick[w.code]}
                    onClick={() => run(() => adminApi.wsAssign(w.code, Number(pick[w.code])), 'Кабинет выдан')}
                    className="border border-primary px-3 py-2 text-[0.72rem] uppercase tracking-[0.1em] text-primary disabled:opacity-40"
                  >
                    Выдать
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => run(() => adminApi.wsAssign(w.code, 0), 'Кабинет освобождён')}
                    className="border border-border px-3 py-2 text-[0.72rem] uppercase tracking-[0.1em] text-foreground"
                  >
                    Освободить
                  </button>
                  <button
                    disabled={busy}
                    onClick={() =>
                      run(
                        () => adminApi.wsUpdate(w.code, { status: w.status === 'blocked' ? 'reserved' : 'blocked' }),
                        'Статус обновлён',
                      )
                    }
                    className="border border-border px-3 py-2 text-[0.72rem] uppercase tracking-[0.1em] text-foreground"
                  >
                    {w.status === 'blocked' ? 'Разблокировать' : 'Заблокировать'}
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => {
                      const t = window.prompt('Название кабинета', w.title ?? '');
                      if (t !== null) run(() => adminApi.wsUpdate(w.code, { title: t }), 'Название сохранено');
                    }}
                    className="border border-border px-3 py-2 text-[0.72rem] uppercase tracking-[0.1em] text-foreground"
                  >
                    Переименовать
                  </button>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      {msg ? <p className="mt-3 text-[0.78rem] text-muted-foreground">{msg}</p> : null}
    </>
  );
};

export default AdminWorkspaces;
