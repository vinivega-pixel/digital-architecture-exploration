export type WsTheme = {
  bg: string;
  panel: string;
  text: string;
  head: string;
  accent: string;
  line: string;
  warn: string;
  shadow: string;
};

export const LIGHT: WsTheme = {
  bg: '#F5F6F8',
  panel: '#FFFFFF',
  text: '#2C3E50',
  head: '#1B2733',
  accent: '#2A7DE1',
  line: '#BDC3C7',
  warn: '#E67E22',
  shadow: '0 1px 3px rgba(44,62,80,.10), 0 6px 18px rgba(44,62,80,.06)',
};

export const DARK: WsTheme = {
  bg: '#1A1D23',
  panel: '#242830',
  text: '#D0D4DC',
  head: '#F0F2F5',
  accent: '#3B8BDB',
  line: '#3A3F47',
  warn: '#E8A838',
  shadow: 'none',
};

export const ROLES = {
  analyst: { name: 'Аналитик', dot: '#27AE60', icon: 'ClipboardList' },
  architect: { name: 'Архитектор', dot: '#8E44AD', icon: 'Building2' },
  estimator: { name: 'Сметчик', dot: '#F1C40F', icon: 'Calculator' },
  engineer: { name: 'Инженер', dot: '#2980B9', icon: 'UserRound' },
} as const;

export const NOTE_COLORS = (dark: boolean) => ({
  question: '#F1C40F',
  info: dark ? '#3B8BDB' : '#2A7DE1',
  fix: dark ? '#F06292' : '#E74C3C',
});

export const NOTE_LABELS = {
  question: 'Вопрос',
  info: 'Пояснение',
  fix: 'Доработка',
} as const;

export default LIGHT;
