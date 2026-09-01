import func2url from '../../backend/func2url.json';

const AUTH_URL = (func2url as Record<string, string>).auth;
const AI_URL = (func2url as Record<string, string>)['ai-chat'];
const TOKEN_KEY = 'cifra_token';

export type WsInfo = { id: number; code: string; title: string; status: string; theme: string; note?: string };
export type WsProject = { id: number; name: string; kind: string; data: string; created_at: string; updated_at: string };
export type WsFile = {
  id: number;
  folder: string;
  name: string;
  url: string;
  mime?: string;
  size_bytes: number;
  version: number;
  tags?: string;
  author: string;
  attached_to?: string;
  created_at: string;
};
export type WsNote = {
  id: number;
  project_id?: number | null;
  kind: 'question' | 'info' | 'fix';
  author: string;
  body: string;
  target?: string;
  resolved: boolean;
  created_at: string;
};
export type WsState = {
  workspace: WsInfo;
  codes?: { code: string; title: string; status: string }[];
  premium: boolean;
  projects: WsProject[];
  files: WsFile[];
  notes: WsNote[];
};

export const FOLDERS = [
  { id: 'tz', label: 'ТЗ', icon: 'ClipboardList' },
  { id: 'drawings', label: 'Чертежи', icon: 'PenTool' },
  { id: 'estimates', label: 'Сметы', icon: 'Calculator' },
  { id: 'norms', label: 'Нормы', icon: 'BookOpen' },
  { id: 'letters', label: 'Письма', icon: 'Mail' },
  { id: 'refs', label: 'Референсы', icon: 'Image' },
];

const call = async <T,>(payload: Record<string, unknown>): Promise<T> => {
  const token = localStorage.getItem(TOKEN_KEY) ?? '';
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Ошибка запроса');
  return data as T;
};

export const wsApi = {
  state: (code?: string) => call<WsState>({ action: 'ws_state', code: code ?? '' }),
  setTheme: (theme: string) => call<{ ok: boolean }>({ action: 'ws_set_theme', theme }),
  createProject: (name: string, data: unknown = {}) =>
    call<{ id: number }>({ action: 'ws_create_project', name, data }),
  saveProject: (projectId: number, data: unknown, name?: string) =>
    call<{ ok: boolean }>({ action: 'ws_save_project', projectId, data, name }),
  archiveProject: (projectId: number) => call<{ ok: boolean }>({ action: 'ws_archive_project', projectId }),
  upload: (p: { folder: string; name: string; mime: string; data: string; projectId?: number; tags?: string }) =>
    call<{ id: number; url: string; version: number }>({ action: 'ws_upload', ...p }),
  versions: (folder: string, name: string) =>
    call<{ items: { id: number; version: number; url: string; size_bytes: number; created_at: string; archived: boolean }[] }>(
      { action: 'ws_file_versions', folder, name },
    ),
  restore: (fileId: number) => call<{ ok: boolean }>({ action: 'ws_restore_version', fileId }),
  deleteFile: (fileId: number) => call<{ ok: boolean }>({ action: 'ws_delete_file', fileId }),
  addNote: (p: { body: string; kind?: string; author?: string; target?: string; projectId?: number }) =>
    call<{ id: number }>({ action: 'ws_add_note', ...p }),
  resolveNote: (noteId: number, resolved = true) =>
    call<{ ok: boolean }>({ action: 'ws_resolve_note', noteId, resolved }),
};

export type AssistantRole = 'analyst' | 'architect' | 'estimator';

export const askAssistant = async <T,>(role: AssistantRole, prompt: string, context?: unknown) => {
  const res = await fetch(AI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, prompt, context: context ?? {} }),
  });
  const data = await res.json();
  return data as { configured: boolean; message?: string; data?: T; raw?: string };
};

export default wsApi;
