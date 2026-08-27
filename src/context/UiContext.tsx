import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import AuthModal from '@/components/auth/AuthModal';
import AccountPanel from '@/components/auth/AccountPanel';
import OfferModal from '@/components/site/OfferModal';
import { useAuth } from './AuthContext';

type UiValue = {
  openAuth: (mode?: 'login' | 'register') => void;
  openAccount: () => void;
  openOffer: () => void;
};

const UiContext = createContext<UiValue | null>(null);

export const UiProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [account, setAccount] = useState(false);
  const [offer, setOffer] = useState(false);

  const openAuth = useCallback((mode: 'login' | 'register' = 'login') => setAuthMode(mode), []);
  const openAccount = useCallback(() => {
    if (user) setAccount(true);
    else setAuthMode('login');
  }, [user]);

  const openOffer = useCallback(() => setOffer(true), []);

  const value = useMemo(() => ({ openAuth, openAccount, openOffer }), [openAuth, openAccount, openOffer]);

  return (
    <UiContext.Provider value={value}>
      {children}
      <AuthModal open={authMode !== null} initialMode={authMode ?? 'login'} onClose={() => setAuthMode(null)} />
      <AccountPanel open={account} onClose={() => setAccount(false)} />
      <OfferModal open={offer} onClose={() => setOffer(false)} />
    </UiContext.Provider>
  );
};

export const useUi = () => {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUi должен использоваться внутри UiProvider');
  return ctx;
};

export default UiProvider;
