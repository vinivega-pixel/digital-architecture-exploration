import func2url from '../../backend/func2url.json';

const ADMIN_URL = (func2url as Record<string, string>).admin;
const TOKEN_KEY = 'cifra_token';

export type AdminStats = {
  usersTotal: number;
  wsActive?: number;
  wsTotal?: number;
  usersWeek: number;
  premiumNow: number;
  blocked: number;
  revenue: number;
  revenueMonth: number;
  downloadsTotal: number;
  downloadsWeek: number;
};

export type AdminUser = {
  id: number;
  email: string;
  name?: string;
  company?: string;
  role: string;
  blocked: boolean;
  note?: string;
  created_at: string;
  plan?: string | null;
  expires_at?: string | null;
  downloads: number;
  paid: number;
};

export type AdminPayment = {
  id: number;
  inv_id: number;
  plan: string;
  amount: number;
  status: string;
  paid_at?: string | null;
  created_at: string;
  email?: string | null;
  name?: string | null;
};

export type AdminDownload = {
  id: number;
  kind: string;
  title: string;
  stage?: string;
  created_at: string;
  email?: string | null;
};

export type AdminWorkspace = {
  id: number;
  code: string;
  title: string;
  status: string;
  note?: string;
  assigned_at?: string | null;
  owner_id?: number | null;
  owner_email?: string | null;
  owner_name?: string | null;
  projects: number;
  files: number;
};

export type AdminLogItem = {
  id: number;
  action: string;
  details?: string;
  created_at: string;
  target_user_id?: number | null;
  admin_email?: string | null;
};

const call = async <T,>(payload: Record<string, unknown>): Promise<T> => {
  const token = localStorage.getItem(TOKEN_KEY) ?? '';
  const res = await fetch(ADMIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Ошибка запроса');
  return data as T;
};

export const adminApi = {
  overview: () => call<{ stats: AdminStats; top: { title: string; kind: string; c: number }[] }>({ action: 'overview' }),
  users: (q = '') => call<{ items: AdminUser[] }>({ action: 'users', q }),
  user: (userId: number) =>
    call<{
      user: AdminUser;
      subscriptions: { id: number; plan: string; status: string; expires_at: string }[];
      payments: AdminPayment[];
      downloads: AdminDownload[];
    }>({ action: 'user', userId }),
  grant: (userId: number, plan: string) => call<{ ok: boolean }>({ action: 'grant', userId, plan }),
  revoke: (userId: number) => call<{ ok: boolean }>({ action: 'revoke', userId }),
  block: (userId: number, blocked: boolean) => call<{ ok: boolean }>({ action: 'block', userId, blocked }),
  setRole: (userId: number, role: string) => call<{ ok: boolean }>({ action: 'set_role', userId, role }),
  setNote: (userId: number, note: string) => call<{ ok: boolean }>({ action: 'set_note', userId, note }),
  resetPassword: (userId: number, password: string) =>
    call<{ ok: boolean }>({ action: 'reset_password', userId, password }),
  deleteUser: (userId: number) => call<{ ok: boolean }>({ action: 'delete_user', userId }),
  workspaces: () => call<{ items: AdminWorkspace[] }>({ action: 'workspaces' }),
  wsAssign: (code: string, userId: number) => call<{ ok: boolean }>({ action: 'ws_assign', code, userId }),
  wsUpdate: (code: string, patch: { title?: string; note?: string; status?: string }) =>
    call<{ ok: boolean }>({ action: 'ws_update', code, ...patch }),
  payments: () => call<{ items: AdminPayment[] }>({ action: 'payments' }),
  downloads: () => call<{ items: AdminDownload[] }>({ action: 'downloads' }),
  log: () => call<{ items: AdminLogItem[] }>({ action: 'log' }),
};

export default adminApi;
