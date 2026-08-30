import Icon from '@/components/ui/icon';
import type { AdminStats as Stats } from '@/lib/adminApi';

const money = (v: number) => new Intl.NumberFormat('ru-RU').format(Math.round(v));

const Tile = ({ label, value, hint, icon }: { label: string; value: string; hint?: string; icon: string }) => (
  <div className="border border-border p-4">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon name={icon} size={14} />
      <span className="text-[0.66rem] uppercase tracking-[0.14em]">{label}</span>
    </div>
    <div className="mt-2 font-display text-2xl text-foreground">{value}</div>
    {hint ? <div className="mt-1 text-[0.72rem] text-muted-foreground">{hint}</div> : null}
  </div>
);

const AdminStats = ({ stats, top }: { stats: Stats; top: { title: string; kind: string; c: number }[] }) => (
  <div>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Tile label="Всего кабинетов" value={String(stats.usersTotal)} hint={`+${stats.usersWeek} за неделю`} icon="Users" />
      <Tile label="Премиум активен" value={String(stats.premiumNow)} hint="действующие подписки" icon="ShieldCheck" />
      <Tile label="Выручка всего" value={`${money(stats.revenue)} ₽`} hint={`${money(stats.revenueMonth)} ₽ за месяц`} icon="Wallet" />
      <Tile
        label="Скачиваний"
        value={String(stats.downloadsTotal)}
        hint={`${stats.downloadsWeek} за неделю · заблокировано ${stats.blocked}`}
        icon="Download"
      />
    </div>

    {top.length ? (
      <div className="mt-6">
        <p className="rubric mb-2">Самое востребованное</p>
        <ul className="divide-y divide-border border-y border-border">
          {top.map((t) => (
            <li key={`${t.kind}-${t.title}`} className="flex items-center justify-between gap-4 py-2.5">
              <span className="text-[0.82rem] text-foreground">{t.title}</span>
              <span className="shrink-0 text-[0.72rem] uppercase tracking-[0.1em] text-muted-foreground">
                {t.kind} · {t.c}
              </span>
            </li>
          ))}
        </ul>
      </div>
    ) : null}
  </div>
);

export default AdminStats;
