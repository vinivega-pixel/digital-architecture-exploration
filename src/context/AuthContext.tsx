import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import func2url from '../../backend/func2url.json';

const AUTH_URL = (func2url as Record<string, string>).auth;
const PAY_URL = (func2url as Record<string, string>).payment;
const TOKEN_KEY = 'cifra_token';

export type Access = { premium: boolean; plan: string | null; expiresAt: string | null };
export type User = { id: number; email: string; name?: string; company?: string; created_at?: string; access: Access };
export type DownloadItem = { id: number; kind: string; title: string; stage?: string; created_at: string };

type AuthValue = {
  user: User | null;
  loading: boolean;
  premium: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (data: { email: string; password: string; name?: string; company?: string }) => Promise<string | null>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  trackDownload: (kind: string, title: string, stage?: string) => void;
  history: () => Promise<DownloadItem[]>;
  startPayment: (plan: string) => Promise<{ ok: boolean; message?: string }>;
};

const AuthContext = createContext<AuthValue | null>(null);

const getToken = () => localStorage.getItem(TOKEN_KEY) ?? '';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(AUTH_URL, { headers: { 'X-Auth-Token': token } });
      if (!res.ok) {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      } else {
        const data = await res.json();
        setUser(data.user ?? null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const submit = useCallback(
    async (action: 'login' | 'register', payload: Record<string, string>) => {
      try {
        const res = await fetch(AUTH_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, ...payload }),
        });
        const data = await res.json();
        if (!res.ok) return data.message ?? 'Не удалось выполнить операцию';
        localStorage.setItem(TOKEN_KEY, data.token);
        setUser(data.user);
        return null;
      } catch {
        return 'Нет связи с сервером. Попробуйте ещё раз.';
      }
    },
    [],
  );

  const value = useMemo<AuthValue>(
    () => ({
      user,
      loading,
      premium: Boolean(user?.access?.premium),
      login: (email, password) => submit('login', { email, password }),
      register: (data) =>
        submit('register', {
          email: data.email,
          password: data.password,
          name: data.name ?? '',
          company: data.company ?? '',
        }),
      logout: async () => {
        const token = getToken();
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
        if (token) {
          await fetch(AUTH_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
            body: JSON.stringify({ action: 'logout' }),
          }).catch(() => undefined);
        }
      },
      refresh,
      trackDownload: (kind, title, stage) => {
        const token = getToken();
        if (!token) return;
        fetch(AUTH_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
          body: JSON.stringify({ action: 'track', kind, title, stage: stage ?? '' }),
        }).catch(() => undefined);
      },
      history: async () => {
        const token = getToken();
        if (!token) return [];
        try {
          const res = await fetch(AUTH_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
            body: JSON.stringify({ action: 'history' }),
          });
          const data = await res.json();
          return (data.items ?? []) as DownloadItem[];
        } catch {
          return [];
        }
      },
      startPayment: async (plan) => {
        const token = getToken();
        if (!token) return { ok: false, message: 'Сначала войдите или создайте аккаунт' };
        try {
          const res = await fetch(PAY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
            body: JSON.stringify({ action: 'create', plan }),
          });
          const data = await res.json();
          if (!res.ok) return { ok: false, message: data.message ?? 'Не удалось создать счёт' };
          if (!data.configured) return { ok: false, message: data.message };
          window.location.href = data.paymentUrl;
          return { ok: true };
        } catch {
          return { ok: false, message: 'Нет связи с платёжным сервисом' };
        }
      },
    }),
    [user, loading, submit, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth должен использоваться внутри AuthProvider');
  return ctx;
};

export default AuthProvider;
