import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import AuthModal from '@/components/auth/AuthModal';
import AccountPanel from '@/components/auth/AccountPanel';
import { useAuth } from './AuthContext';

type UiValue = {
  openAuth: (mode?: 'login' | 'register') => void;
  openAccount: () => void;
};

const UiContext = createContext<UiValue | null>(null);

export const UiProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [account, setAccount] = useState(false);

  const openAuth = useCallback((mode: 'login' | 'register' = 'login') => setAuthMode(mode), []);
  const openAccount = useCallback(() => {
    if (user) setAccount(true);
    else setAuthMode('login');
  }, [user]);

  const value = useMemo(() => ({ openAuth, openAccount }), [openAuth, openAccount]);

  return (
    <UiContext.Provider value={value}>
      {children}
      <AuthModal open={authMode !== null} initialMode={authMode ?? 'login'} onClose={() => setAuthMode(null)} />
      <AccountPanel open={account} onClose={() => setAccount(false)} />
    </UiContext.Provider>
  );
};

export const useUi = () => {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUi должен использоваться внутри UiProvider');
  return ctx;
};

export default UiProvider;
