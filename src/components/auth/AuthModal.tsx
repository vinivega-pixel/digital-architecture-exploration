import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/context/AuthContext';

type Props = { open: boolean; onClose: () => void; initialMode?: 'login' | 'register' };

const AuthModal = ({ open, onClose, initialMode = 'login' }: Props) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, open]);

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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const err =
      mode === 'login' ? await login(email, password) : await register({ email, password, name, company });
    setBusy(false);
    if (err) setError(err);
    else onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'login' ? 'Вход' : 'Регистрация'}
    >
      <div
        className="max-h-[92vh] w-full max-w-[440px] overflow-y-auto border border-border bg-card p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="rubric">{mode === 'login' ? 'Вход' : 'Регистрация'}</p>
            <h3 className="mt-2 font-display text-2xl leading-tight text-foreground">
              {mode === 'login' ? 'С возвращением' : 'Создайте аккаунт'}
            </h3>
          </div>
          <button onClick={onClose} aria-label="Закрыть" className="shrink-0 text-foreground opacity-70">
            <Icon name="X" size={22} />
          </button>
        </div>

        <p className="mt-3 text-[0.85rem] leading-relaxed text-muted-foreground">
          {mode === 'login'
            ? 'Войдите, чтобы видеть статус доступа и историю скачанных расчётов.'
            : 'Бесплатно: доступ к калькуляторам, шаблонам и истории расчётов. Премиум подключается отдельно.'}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === 'register' && (
            <>
              <label className="block">
                <span className="rubric">Имя</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван Петров"
                  className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </label>
              <label className="block">
                <span className="rubric">Компания</span>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="ООО «Стройпроект»"
                  className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </label>
            </>
          )}

          <label className="block">
            <span className="rubric">Электронная почта</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.ru"
              className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="rubric">Пароль</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="не менее 6 символов"
              className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </label>

          {error && (
            <p className="border border-destructive/50 bg-destructive/10 px-4 py-3 text-[0.82rem] text-foreground">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 bg-primary px-6 py-3.5 text-[0.78rem] font-medium uppercase tracking-[0.12em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Icon name={mode === 'login' ? 'LogIn' : 'UserPlus'} size={16} />
            {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError(null);
          }}
          className="link-underline mt-5 text-[0.84rem] text-primary"
        >
          {mode === 'login' ? 'Нет аккаунта — зарегистрироваться' : 'Уже есть аккаунт — войти'}
        </button>

        <p className="mt-5 text-[0.7rem] leading-relaxed text-muted-foreground">
          Регистрируясь, вы соглашаетесь на обработку электронной почты в соответствии с ФЗ-152 «О персональных
          данных».
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
