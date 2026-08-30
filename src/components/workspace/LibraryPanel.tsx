import { useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { FOLDERS, wsApi, type WsFile } from '@/lib/workspaceApi';
import type { WsTheme } from './theme';

const kb = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} МБ` : `${Math.max(1, Math.round(n / 1024))} КБ`);

const LibraryPanel = ({
  theme,
  files,
  projectId,
  onChange,
}: {
  theme: WsTheme;
  files: WsFile[];
  projectId?: number;
  onChange: () => void;
}) => {
  const [folder, setFolder] = useState('tz');
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [drop, setDrop] = useState(false);
  const [msg, setMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const list = files
    .filter((f) => f.folder === folder)
    .filter((f) => !q || f.name.toLowerCase().includes(q.toLowerCase()) || (f.tags ?? '').includes(q));

  const upload = async (fl: FileList | null) => {
    if (!fl?.length) return;
    setBusy(true);
    setMsg('');
    try {
      for (const file of Array.from(fl)) {
        if (file.size > 20 * 1024 * 1024) {
          setMsg(`${file.name} больше 20 МБ`);
          continue;
        }
        const b64 = await new Promise<string>((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(String(r.result).split(',')[1] ?? '');
          r.onerror = rej;
          r.readAsDataURL(file);
        });
        await wsApi.upload({
          folder,
          name: file.name,
          mime: file.type || 'application/octet-stream',
          data: b64,
          projectId,
        });
      }
      onChange();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Не удалось загрузить');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-3 gap-1 px-3 pt-3">
        {FOLDERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFolder(f.id)}
            className="flex flex-col items-center gap-1 py-2 text-[0.68rem]"
            style={{
              border: `1px solid ${folder === f.id ? theme.accent : theme.line}`,
              color: folder === f.id ? theme.accent : `${theme.text}a0`,
              background: folder === f.id ? `${theme.accent}10` : 'transparent',
            }}
          >
            <Icon name={f.icon} size={15} />
            {f.label}
          </button>
        ))}
      </div>

      <div className="px-3 pt-2.5">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск по названию и тегам"
          className="w-full px-3 py-2 text-[0.8rem] outline-none"
          style={{ background: theme.bg, color: theme.text, border: `1px solid ${theme.line}` }}
        />
      </div>

      <div
        className="mx-3 mt-2.5 flex items-center justify-center px-3 py-4 text-center text-[0.76rem]"
        style={{
          border: `1px dashed ${drop ? theme.accent : theme.line}`,
          background: drop ? `${theme.accent}0f` : 'transparent',
          color: `${theme.text}a0`,
          cursor: 'pointer',
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrop(true);
        }}
        onDragLeave={() => setDrop(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrop(false);
          upload(e.dataTransfer.files);
        }}
      >
        {busy ? (
          <span className="flex items-center gap-2">
            <Icon name="Loader" size={14} className="animate-spin" />
            Загружаю…
          </span>
        ) : (
          'Перетащите файлы сюда — PDF, DWG, RVT, XLSX, JPG'
        )}
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={(e) => upload(e.target.files)}
        />
      </div>

      {msg ? (
        <p className="px-3 pt-2 text-[0.76rem]" style={{ color: theme.warn }}>
          {msg}
        </p>
      ) : null}

      <div className="mt-2.5 flex-1 overflow-y-auto px-3 pb-3">
        {list.map((f) => (
          <div
            key={f.id}
            className="flex items-center gap-2.5 border-b py-2.5"
            style={{ borderColor: theme.line }}
          >
            <Icon name="File" size={15} className="shrink-0" style={{ color: `${theme.text}80` }} />
            <a href={f.url} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1">
              <span className="block truncate text-[0.8rem]" style={{ color: theme.text }}>
                {f.name}
              </span>
              <span className="block text-[0.68rem]" style={{ color: `${theme.text}80` }}>
                в. {f.version} · {kb(f.size_bytes)} · {new Date(f.created_at).toLocaleDateString('ru-RU')}
              </span>
            </a>
            <button
              type="button"
              onClick={() => wsApi.deleteFile(f.id).then(onChange)}
              aria-label="Удалить"
              className="shrink-0 p-1.5"
              style={{ color: `${theme.text}80` }}
            >
              <Icon name="Trash2" size={14} />
            </button>
          </div>
        ))}
        {!list.length ? (
          <p className="pt-4 text-center text-[0.78rem]" style={{ color: `${theme.text}80` }}>
            Папка пуста
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default LibraryPanel;
