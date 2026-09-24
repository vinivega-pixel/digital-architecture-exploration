import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import BrandMark from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';
import { useUi } from '@/context/UiContext';
import ShareQr from './ShareQr';
import InfoModal from './InfoModal';
import LibraryModal from './LibraryModal';
import ArchiveModal from './ArchiveModal';
import AgentModal from './AgentModal';
import AdminPanel from '@/components/admin/AdminPanel';

export const NAV = [
  { id: 'tools', label: 'Инструменты' },
  { id: 'path', label: 'Этапы' },
  { id: 'ai', label: 'ИИ' },
  { id: 'audience', label: 'Кому это нужно' },
  { id: 'premium', label: 'Услуги' },
  { id: 'about', label: 'О компании' },
];

export const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const Logo = ({ light }: { light?: boolean }) => (
  <span className="flex items-center gap-2.5">
    <BrandMark size={36} tone={light ? 'light' : 'brand'} />
    <span
      className="font-display text-[1.28rem] tracking-[0.04em]"
      style={{ color: light ? '#ffffff' : 'hsl(var(--foreground))' }}
    >
      ЦИФРА
    </span>
  </span>
);

const Header = () => {
  const { user, premium, isAdmin } = useAuth();
  const { openAuth, openAccount } = useUi();
  const [open, setOpen] = useState(false);
  const [qr, setQr] = useState(false);
  const [info, setInfo] = useState(false);
  const [lib, setLib] = useState(false);
  const [archive, setArchive] = useState(false);
  const [agent, setAgent] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollTo(id);
  };

  const light = !scrolled;
  const fg = light ? '#ffffff' : 'hsl(var(--foreground))';

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? 'border-b border-border bg-background/95 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-[68px] max-w-[1400px] items-center gap-6 px-5 md:px-10">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Наверх">
            <Logo light={light} />
          </button>

          <nav className="ml-4 hidden flex-1 items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className="text-[0.86rem] transition-opacity hover:opacity-70"
                style={{ color: fg }}
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <button
              onClick={() => setLib(true)}
              aria-label="Поиск по базе знаний"
              className="p-2 transition-opacity hover:opacity-70"
              style={{ color: fg }}
            >
              <Icon name="Search" size={19} />
            </button>
            {isAdmin ? (
              <button onClick={() => setAdmin(true)} aria-label="Администратор" className="p-2" style={{ color: fg }}>
                <Icon name="ShieldHalf" size={19} />
              </button>
            ) : null}
            {user ? (
              <button
                onClick={openAccount}
                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.84rem] font-medium"
                style={light ? { background: '#ffffff', color: '#0f1d2e' } : { background: 'hsl(var(--primary))', color: '#fff' }}
              >
                <Icon name={premium ? 'ShieldCheck' : 'User'} size={15} />
                Кабинет
              </button>
            ) : (
              <>
                <button
                  onClick={() => openAuth('login')}
                  className="text-[0.86rem] transition-opacity hover:opacity-70"
                  style={{ color: fg }}
                >
                  Войти
                </button>
                <button
                  onClick={() => openAuth('register')}
                  className="rounded-full px-5 py-2.5 text-[0.84rem] font-medium transition-opacity hover:opacity-90"
                  style={light ? { background: '#ffffff', color: '#0f1d2e' } : { background: 'hsl(var(--primary))', color: '#fff' }}
                >
                  Начать работу
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Меню"
            className="ml-auto p-2 lg:hidden"
            style={{ color: open ? 'hsl(var(--foreground))' : fg }}
          >
            <Icon name={open ? 'X' : 'Menu'} size={24} />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 animate-fade-in overflow-y-auto bg-background px-5 pb-10 pt-24 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className="rounded-xl px-4 py-3.5 text-left font-display text-lg text-foreground hover:bg-secondary"
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="mt-6 grid grid-cols-4 gap-2">
            {[
              { icon: 'Library', label: 'Нормы', fn: () => setLib(true) },
              { icon: 'Archive', label: 'Архив', fn: () => setArchive(true) },
              { icon: 'Bot', label: 'ИИ', fn: () => setAgent(true) },
              { icon: 'Info', label: 'Инфо', fn: () => setInfo(true) },
            ].map((b) => (
              <button
                key={b.label}
                onClick={() => {
                  setOpen(false);
                  b.fn();
                }}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-border py-4 text-[0.72rem] text-muted-foreground"
              >
                <Icon name={b.icon} size={19} className="text-primary" />
                {b.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setOpen(false);
              if (user) openAccount();
              else openAuth('register');
            }}
            className="mt-5 w-full rounded-full bg-primary px-8 py-4 text-[0.88rem] font-medium text-primary-foreground"
          >
            {user ? 'Личный кабинет' : 'Начать работу'}
          </button>
          <button
            onClick={() => {
              setOpen(false);
              setQr(true);
            }}
            className="mt-3 w-full rounded-full border border-border px-8 py-4 text-[0.88rem] text-foreground"
          >
            Поделиться сайтом
          </button>
        </div>
      )}

      <ShareQr open={qr} onClose={() => setQr(false)} />
      <InfoModal open={info} onClose={() => setInfo(false)} />
      <LibraryModal open={lib} onClose={() => setLib(false)} />
      <ArchiveModal open={archive} onClose={() => setArchive(false)} />
      <AgentModal open={agent} onClose={() => setAgent(false)} />
      <AdminPanel open={admin} onClose={() => setAdmin(false)} />
    </>
  );
};

export default Header;
