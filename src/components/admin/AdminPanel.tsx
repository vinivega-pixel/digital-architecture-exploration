import { useCallback, useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import AdminStats from './AdminStats';
import AdminUserRow from './AdminUserRow';
import {
  adminApi,
  type AdminDownload,
  type AdminLogItem,
  type AdminPayment,
  type AdminStats as Stats,
  type AdminUser,
} from '@/lib/adminApi';

type Tab = 'overview' | 'users' | 'payments' | 'downloads' | 'log';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Сводка', icon: 'LayoutDashboard' },
  { id: 'users', label: 'Кабинеты', icon: 'Users' },
  { id: 'payments', label: 'Платежи', icon: 'Wallet' },
  { id: 'downloads', label: 'Скачивания', icon: 'Download' },
  { id: 'log', label: 'Журнал', icon: 'History' },
];

const dt = (s?: string | null) =>
  s ? new Date(s).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' }) : '—';

const AdminPanel = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [top, setTop] = useState<{ title: string; kind: string; c: number }[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [downloads, setDownloads] = useState<AdminDownload[]>([]);
  const [log, setLog] = useState<AdminLogItem[]>([]);
  const [q, setQ] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    setErr('');
    try {
      if (tab === 'overview') {
        const d = await adminApi.overview();
        setStats(d.stats);
        setTop(d.top);
      } else if (tab === 'users') {
        setUsers((await adminApi.users(q)).items);
      } else if (tab === 'payments') {
        setPayments((await adminApi.payments()).items);
      } else if (tab === 'downloads') {
        setDownloads((await adminApi.downloads()).items);
      } else {
        setLog((await adminApi.log()).items);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Ошибка загрузки');
    } finally {
      setBusy(false);
    }
  }, [tab, q]);

  useEffect(() => {
    if (!open) return;
    load();
  }, [open, load]);

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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Кабинет администратора"
    >
      <div
        className="flex max-h-[94vh] w-full max-w-[980px] flex-col border border-border bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5 md:px-8">
          <div>
            <p className="rubric">Управление институтом</p>
            <h3 className="mt-1.5 font-display text-2xl leading-tight text-foreground">Кабинет администратора</h3>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={load} aria-label="Обновить" className="text-muted-foreground hover:text-foreground">
              <Icon name={busy ? 'Loader' : 'RefreshCw'} size={18} className={busy ? 'animate-spin' : ''} />
            </button>
            <button onClick={onClose} aria-label="Закрыть" className="text-muted-foreground hover:text-foreground">
              <Icon name="X" size={22} />
            </button>
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto border-b border-border px-6 md:px-8">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-3 text-[0.74rem] uppercase tracking-[0.1em] transition-colors ${
                tab === t.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={t.icon} size={14} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 md:px-8">
          {err ? <p className="mb-4 text-[0.82rem] text-destructive">{err}</p> : null}

          {tab === 'overview' && stats ? <AdminStats stats={stats} top={top} /> : null}

          {tab === 'users' ? (
            <>
              <div className="mb-3 flex items-center gap-2 border border-border bg-background px-3 py-2.5">
                <Icon name="Search" size={15} className="shrink-0 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Поиск по почте, имени или компании"
                  className="w-full bg-transparent text-[0.85rem] text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
              <ul className="border-t border-border">
                {users.map((u) => (
                  <AdminUserRow key={u.id} u={u} onChange={load} />
                ))}
              </ul>
              {!users.length && !busy ? (
                <p className="py-8 text-center text-[0.85rem] text-muted-foreground">Кабинеты не найдены</p>
              ) : null}
            </>
          ) : null}

          {tab === 'payments' ? (
            <ul className="divide-y divide-border border-y border-border">
              {payments.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-4 py-3">
                  <span className="min-w-0">
                    <span className="block truncate text-[0.84rem] text-foreground">{p.email ?? 'кабинет удалён'}</span>
                    <span className="block text-[0.72rem] text-muted-foreground">
                      счёт № {p.inv_id} · {p.plan} · {dt(p.created_at)}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-[0.86rem] font-semibold text-foreground">
                      {new Intl.NumberFormat('ru-RU').format(Number(p.amount))} ₽
                    </span>
                    <span
                      className={`block text-[0.68rem] uppercase tracking-[0.1em] ${
                        p.status === 'paid' ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {p.status === 'paid' ? 'оплачен' : p.status}
                    </span>
                  </span>
                </li>
              ))}
              {!payments.length && !busy ? (
                <li className="py-8 text-center text-[0.85rem] text-muted-foreground">Платежей пока нет</li>
              ) : null}
            </ul>
          ) : null}

          {tab === 'downloads' ? (
            <ul className="divide-y divide-border border-y border-border">
              {downloads.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-4 py-2.5">
                  <span className="min-w-0">
                    <span className="block truncate text-[0.84rem] text-foreground">{d.title}</span>
                    <span className="block truncate text-[0.72rem] text-muted-foreground">
                      {d.email ?? 'гость'} · {d.stage || d.kind}
                    </span>
                  </span>
                  <span className="shrink-0 text-[0.7rem] text-muted-foreground">{dt(d.created_at)}</span>
                </li>
              ))}
              {!downloads.length && !busy ? (
                <li className="py-8 text-center text-[0.85rem] text-muted-foreground">Скачиваний пока нет</li>
              ) : null}
            </ul>
          ) : null}

          {tab === 'log' ? (
            <ul className="divide-y divide-border border-y border-border">
              {log.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-4 py-2.5">
                  <span className="min-w-0">
                    <span className="block text-[0.84rem] text-foreground">{l.action}</span>
                    <span className="block truncate text-[0.72rem] text-muted-foreground">
                      {l.admin_email ?? '—'}
                      {l.target_user_id ? ` → кабинет #${l.target_user_id}` : ''}
                      {l.details ? ` · ${l.details}` : ''}
                    </span>
                  </span>
                  <span className="shrink-0 text-[0.7rem] text-muted-foreground">{dt(l.created_at)}</span>
                </li>
              ))}
              {!log.length && !busy ? (
                <li className="py-8 text-center text-[0.85rem] text-muted-foreground">Действий пока не было</li>
              ) : null}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
