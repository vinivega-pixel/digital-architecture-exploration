import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import Canvas, { type SceneVariant } from '@/components/workspace/Canvas';
import AnalystWidget, { type Tz } from '@/components/workspace/AnalystWidget';
import ArchitectWidget from '@/components/workspace/ArchitectWidget';
import EstimatorWidget from '@/components/workspace/EstimatorWidget';
import EngineerWidget from '@/components/workspace/EngineerWidget';
import LibraryPanel from '@/components/workspace/LibraryPanel';
import { DARK, LIGHT } from '@/components/workspace/theme';
import { wsApi, type WsState } from '@/lib/workspaceApi';

type Side = 'projects' | 'library';

const Workspace = () => {
  const [state, setState] = useState<WsState | null>(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(() => {
    const h = new Date().getHours();
    return h >= 20 || h < 7;
  });
  const [bright, setBright] = useState(100);
  const [side, setSide] = useState<Side>('projects');
  const [pid, setPid] = useState<number | null>(null);
  const [tz, setTz] = useState<Tz | null>(null);
  const [variant, setVariant] = useState<SceneVariant | null>(null);
  const [mode, setMode] = useState<'3d' | '2d'>('3d');
  const [picked, setPicked] = useState<string | null>(null);
  const [pinned, setPinned] = useState<Tz | null>(null);

  const theme = dark ? DARK : LIGHT;

  const load = useCallback(async () => {
    try {
      const s = await wsApi.state();
      setState(s);
      setErr('');
      if (!pid && s.projects[0]) setPid(s.projects[0].id);
    } catch (e) {
      const m = e instanceof Error ? e.message : '';
      setErr(
        m && m !== 'Ошибка запроса'
          ? m
          : 'Войдите в аккаунт — премиум-кабинет открывается владельцу выделенного номера.',
      );
    } finally {
      setLoading(false);
    }
  }, [pid]);

  useEffect(() => {
    load();
  }, [load]);

  const project = useMemo(() => state?.projects.find((p) => p.id === pid) ?? null, [state, pid]);
  const notes = useMemo(
    () => (state?.notes ?? []).filter((n) => !pid || !n.project_id || n.project_id === pid),
    [state, pid],
  );

  useEffect(() => {
    if (!project?.data) return;
    try {
      const d = JSON.parse(project.data) as { tz?: Tz; variant?: SceneVariant };
      setTz(d.tz ?? null);
      setVariant(d.variant ?? null);
    } catch {
      /* пустой проект */
    }
  }, [project?.id]);

  const persist = useCallback(
    (next: { tz?: Tz | null; variant?: SceneVariant | null }) => {
      if (!pid) return;
      wsApi.saveProject(pid, { tz: next.tz ?? tz, variant: next.variant ?? variant }).catch(() => undefined);
    },
    [pid, tz, variant],
  );

  const newProject = async () => {
    const name = window.prompt('Название проекта', 'Жилой дом');
    if (!name) return;
    const r = await wsApi.createProject(name, {});
    await load();
    setPid(r.id);
    setTz(null);
    setVariant(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: LIGHT.bg, color: LIGHT.text }}>
        <Icon name="Loader" size={22} className="animate-spin" />
      </div>
    );
  }

  if (err) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center"
        style={{ background: theme.bg, color: theme.text }}
      >
        <Icon name="Lock" size={30} style={{ color: theme.warn }} />
        <p className="max-w-[26em] text-[0.95rem] leading-relaxed">{err}</p>
        <Link to="/" className="px-5 py-3 text-[0.8rem] font-medium" style={{ background: theme.accent, color: '#fff' }}>
          На главную
        </Link>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen flex-col overflow-hidden"
      style={{
        background: theme.bg,
        color: theme.text,
        filter: `brightness(${bright}%)`,
        transition: 'background .3s ease, color .3s ease',
        fontFamily: 'Inter, Roboto, system-ui, sans-serif',
      }}
    >
      <header
        className="flex shrink-0 items-center gap-3 px-4 py-2.5"
        style={{ background: theme.panel, borderBottom: `1px solid ${theme.line}` }}
      >
        <Link to="/" className="shrink-0 p-1.5" style={{ color: `${theme.text}b0` }} aria-label="На главную">
          <Icon name="ArrowLeft" size={18} />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.9rem] font-semibold" style={{ color: theme.head }}>
            {state?.workspace.title ?? 'Премиум-кабинет'}
          </p>
          <p className="text-[0.68rem] uppercase tracking-[0.12em]" style={{ color: `${theme.text}88` }}>
            кабинет {state?.workspace.code}
          </p>
        </div>

        <div className="hidden items-center gap-1 sm:flex">
          {(['3d', '2d'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className="px-3 py-2 text-[0.74rem] uppercase"
              style={{
                border: `1px solid ${mode === m ? theme.accent : theme.line}`,
                color: mode === m ? theme.accent : `${theme.text}a0`,
                minHeight: 40,
              }}
            >
              {m === '3d' ? '3D сцена' : 'План'}
            </button>
          ))}
        </div>

        <input
          type="range"
          min={70}
          max={115}
          value={bright}
          onChange={(e) => setBright(Number(e.target.value))}
          className="hidden w-24 lg:block"
          aria-label="Яркость"
        />

        <button
          type="button"
          onClick={() => {
            setDark((v) => !v);
            wsApi.setTheme(dark ? 'light' : 'dark').catch(() => undefined);
          }}
          aria-label="Сменить тему"
          className="shrink-0 p-2"
          style={{ color: theme.accent }}
        >
          <Icon name={dark ? 'Sun' : 'Moon'} size={19} />
        </button>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside
          className="hidden w-[248px] shrink-0 flex-col md:flex"
          style={{ background: theme.panel, borderRight: `1px solid ${theme.line}` }}
        >
          <div className="flex gap-1 px-3 pt-3">
            {([
              { id: 'projects', label: 'Проекты', icon: 'FolderKanban' },
              { id: 'library', label: 'Библиотека', icon: 'Library' },
            ] as const).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSide(t.id)}
                className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-[0.74rem]"
                style={{
                  border: `1px solid ${side === t.id ? theme.accent : theme.line}`,
                  color: side === t.id ? theme.accent : `${theme.text}a0`,
                  minHeight: 44,
                }}
              >
                <Icon name={t.icon} size={14} />
                {t.label}
              </button>
            ))}
          </div>

          {side === 'projects' ? (
            <div className="flex-1 overflow-y-auto px-3 py-3">
              <button
                type="button"
                onClick={newProject}
                className="mb-3 flex w-full items-center justify-center gap-2 py-2.5 text-[0.78rem] font-medium"
                style={{ background: theme.accent, color: '#fff', minHeight: 44 }}
              >
                <Icon name="Plus" size={15} />
                Новый проект
              </button>
              {state?.projects.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPid(p.id)}
                  className="mb-1.5 flex w-full items-center gap-2 px-3 py-2.5 text-left"
                  style={{
                    border: `1px solid ${pid === p.id ? theme.accent : theme.line}`,
                    background: pid === p.id ? `${theme.accent}10` : 'transparent',
                    minHeight: 44,
                  }}
                >
                  <Icon name="Box" size={14} style={{ color: `${theme.text}90` }} />
                  <span className="min-w-0 flex-1 truncate text-[0.8rem]" style={{ color: theme.text }}>
                    {p.name}
                  </span>
                </button>
              ))}
              {!state?.projects.length ? (
                <p className="pt-2 text-[0.78rem]" style={{ color: `${theme.text}90` }}>
                  Создайте первый проект — дальше подключатся ассистенты.
                </p>
              ) : null}
            </div>
          ) : (
            <LibraryPanel theme={theme} files={state?.files ?? []} projectId={pid ?? undefined} onChange={load} />
          )}
        </aside>

        <main className="relative min-w-0 flex-1">
          <Canvas theme={theme} dark={dark} variant={variant} mode={mode} picked={picked} onPick={setPicked} />

          {pinned ? (
            <div
              className="absolute left-4 top-4 w-[260px] px-3.5 py-3"
              style={{ background: theme.panel, border: `1px solid ${theme.line}`, boxShadow: theme.shadow }}
            >
              <div className="flex items-start gap-2">
                <Icon name="Pin" size={14} className="mt-0.5 shrink-0" style={{ color: theme.accent }} />
                <p className="flex-1 text-[0.8rem] font-semibold" style={{ color: theme.head }}>
                  {pinned.title ?? 'ТЗ'}
                </p>
                <button type="button" onClick={() => setPinned(null)} style={{ color: `${theme.text}80` }}>
                  <Icon name="X" size={14} />
                </button>
              </div>
              <p className="mt-1.5 text-[0.74rem] leading-relaxed" style={{ color: `${theme.text}b0` }}>
                {pinned.summary}
              </p>
            </div>
          ) : null}

          <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
            <div className="pointer-events-auto">
              <AnalystWidget
                theme={theme}
                onReady={(t) => {
                  setTz(t);
                  persist({ tz: t });
                }}
                onPin={setPinned}
              />
            </div>
            <div className="pointer-events-auto hidden lg:block">
              <ArchitectWidget
                theme={theme}
                tz={tz}
                active={variant}
                onPick={(v) => {
                  setVariant(v);
                  setMode('2d');
                  persist({ variant: v });
                }}
              />
            </div>
            <div className="pointer-events-auto">
              <EngineerWidget theme={theme} dark={dark} notes={notes} projectId={pid ?? undefined} onChange={load} />
            </div>
          </div>
        </main>

        <aside className="hidden w-[300px] shrink-0 xl:block">
          <EstimatorWidget theme={theme} variant={variant} region={String(tz?.rows?.find((r) => /регион/i.test(r.param))?.value ?? '')} />
        </aside>
      </div>
    </div>
  );
};

export default Workspace;
