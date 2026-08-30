import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/context/AuthContext';
import { useUi } from '@/context/UiContext';
import ShareQr from './ShareQr';
import InfoModal from './InfoModal';
import LibraryModal from './LibraryModal';
import AdminPanel from '@/components/admin/AdminPanel';

export const NAV = [
  { id: 'uchastok', label: 'Участок' },
  { id: 'izyskaniya', label: 'Изыскания' },
  { id: 'pd', label: 'Проектная документация' },
  { id: 'arkr', label: 'АР и КР' },
  { id: 'eom', label: 'Электроснабжение' },
  { id: 'vk', label: 'Водоснабжение' },
  { id: 'ovik', label: 'Отопление и вентиляция' },
  { id: 'ss', label: 'Безопасность' },
  { id: 'roof', label: 'Кровля' },
  { id: 'blago', label: 'Благоустройство' },
  { id: 'priemka', label: 'Приёмка' },
  { id: 'premium', label: 'Премиум' },
];

export const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const Logo = () => (
  <svg viewBox="0 0 30 34" fill="none" aria-hidden="true" className="h-[34px] w-[30px]">
    <path d="M4 6h22M4 6v22h22V6" stroke="currentColor" strokeWidth="1.4" />
    <path d="M11 6v22M19 6v22M4 14h22M4 21h22" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const Header = () => {
  const { user, premium, isAdmin } = useAuth();
  const { openAuth, openAccount, openOffer } = useUi();
  const [open, setOpen] = useState(false);
  const [qr, setQr] = useState(false);
  const [info, setInfo] = useState(false);
  const [lib, setLib] = useState(false);
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

  return (
    <>
      <header
        className={`fixed left-6 right-6 z-50 flex animate-fade-in items-center px-6 transition-all duration-500 md:left-[60px] md:right-[60px] md:px-12 ${
          scrolled ? 'top-0 h-[64px]' : 'top-5 h-[84px]'
        }`}
        style={{ background: 'var(--hero-x-bar)' }}
      >
        <nav className="hidden flex-1 gap-9 xl:flex">
          {NAV.slice(0, 3).map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className="link-underline text-[0.82rem] font-medium uppercase tracking-[0.1em] text-primary"
            >
              {n.label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => go('hero')}
          aria-label="ЦИФРА — на главную"
          className="text-primary xl:absolute xl:left-1/2 xl:top-1/2 xl:-translate-x-1/2 xl:-translate-y-1/2"
        >
          <Logo />
        </button>
        <div className="ml-auto hidden items-center gap-3 xl:flex">
          {(premium || isAdmin) && (
            <a
              href="/cabinet"
              aria-label="Премиум-кабинет"
              title="Премиум-кабинет"
              className="text-primary transition-opacity hover:opacity-70"
            >
              <Icon name="LayoutDashboard" size={21} />
            </a>
          )}
          {isAdmin ? (
            <button
              onClick={() => setAdmin(true)}
              aria-label="Кабинет администратора"
              title="Кабинет администратора"
              className="text-primary transition-opacity hover:opacity-70"
            >
              <Icon name="ShieldHalf" size={21} />
            </button>
          ) : null}
          <button
            onClick={() => setLib(true)}
            aria-label="Библиотека норм"
            title="Библиотека норм и сводов правил"
            className="text-primary transition-opacity hover:opacity-70"
          >
            <Icon name="Library" size={21} />
          </button>
          <button
            onClick={() => setInfo(true)}
            aria-label="Как работает институт"
            title="Как работает институт"
            className="text-primary transition-opacity hover:opacity-70"
          >
            <Icon name="Info" size={21} />
          </button>
          <button
            onClick={openOffer}
            aria-label="Публичная оферта"
            title="Публичная оферта"
            className="text-primary transition-opacity hover:opacity-70"
          >
            <Icon name="FileText" size={21} />
          </button>
          <button
            onClick={() => setQr(true)}
            aria-label="QR-код и ссылка на сайт"
            title="QR-код и ссылка"
            className="text-primary transition-opacity hover:opacity-70"
          >
            <Icon name="QrCode" size={21} />
          </button>
          {user ? (
            <button
              onClick={openAccount}
              className="flex items-center gap-2 border border-primary px-5 py-[14px] text-[0.78rem] font-medium uppercase tracking-[0.1em] text-primary transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
            >
              <Icon name={premium ? 'ShieldCheck' : 'User'} size={15} />
              {premium ? 'Премиум активен' : 'Кабинет'}
            </button>
          ) : (
            <button
              onClick={() => openAuth('login')}
              className="link-underline text-[0.82rem] font-medium uppercase tracking-[0.1em] text-primary"
            >
              Войти
            </button>
          )}
          <button
            onClick={() => go('premium')}
            className="border border-primary px-[26px] py-[15px] text-[0.8rem] font-medium uppercase tracking-[0.12em] text-primary transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            Премиум
          </button>
        </div>
        {isAdmin ? (
          <button
            onClick={() => setAdmin(true)}
            aria-label="Кабинет администратора"
            className="ml-auto text-primary xl:hidden"
          >
            <Icon name="ShieldHalf" size={23} />
          </button>
        ) : null}
        <button
          onClick={() => setLib(true)}
          aria-label="Библиотека норм"
          className={`text-primary xl:hidden ${isAdmin ? 'ml-4' : 'ml-auto'}`}
        >
          <Icon name="Library" size={23} />
        </button>
        <button
          onClick={() => setInfo(true)}
          aria-label="Как работает институт"
          className="ml-4 text-primary xl:hidden"
        >
          <Icon name="Info" size={23} />
        </button>
        <button
          onClick={openOffer}
          aria-label="Публичная оферта"
          className="ml-4 text-primary xl:hidden"
        >
          <Icon name="FileText" size={23} />
        </button>
        <button
          onClick={() => setQr(true)}
          aria-label="QR-код и ссылка"
          className="ml-4 text-primary xl:hidden"
        >
          <Icon name="QrCode" size={23} />
        </button>
        <button
          onClick={() => (user ? openAccount() : openAuth('login'))}
          aria-label={user ? 'Личный кабинет' : 'Войти'}
          className="ml-4 text-primary xl:hidden"
        >
          <Icon name={user ? (premium ? 'ShieldCheck' : 'User') : 'LogIn'} size={24} />
        </button>
        <button onClick={() => setOpen((v) => !v)} aria-label="Меню" className="ml-4 text-primary xl:hidden">
          <Icon name={open ? 'X' : 'Menu'} size={26} />
        </button>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-40 animate-fade-in overflow-y-auto bg-background/95 px-6 pb-10 pt-28 backdrop-blur-sm xl:hidden"
          style={{ animationDuration: '0.3s' }}
        >
          <nav className="flex flex-col divide-y divide-border border-y border-border">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => go(n.id)} className="py-3.5 text-left font-display text-xl text-foreground">
                {n.label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => go('premium')}
            className="mt-8 w-full border border-primary px-8 py-4 text-[0.82rem] font-medium uppercase tracking-[0.12em] text-primary"
          >
            Премиум
          </button>
        </div>
      )}

      <ShareQr open={qr} onClose={() => setQr(false)} />
      <InfoModal open={info} onClose={() => setInfo(false)} />
      <LibraryModal open={lib} onClose={() => setLib(false)} />
      <AdminPanel open={admin} onClose={() => setAdmin(false)} />
    </>
  );
};

export default Header;
