import { useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useReveal } from '@/hooks/use-reveal';

type Field = { key: string; label: string; unit: string; def: number; hint?: string };

type Calc = {
  id: string;
  name: string;
  icon: string;
  stage: string;
  formula: string;
  norm: string;
  unit: string;
  fields: Field[];
  compute: (v: Record<string, number>) => number;
  note: (v: Record<string, number>, r: number) => string;
};

const CALCS: Calc[] = [
  {
    id: 'snow',
    name: 'Снеговая нагрузка на кровлю',
    icon: 'Snowflake',
    stage: 'Этап 9 · Кровля',
    formula: 'S = S₀ · μ · γ_f',
    norm: 'СП 20.13330',
    unit: 'кПа',
    fields: [
      { key: 's0', label: 'Нормативная нагрузка S₀', unit: 'кПа', def: 1.8, hint: 'по снеговому району' },
      { key: 'mu', label: 'Коэффициент формы μ', unit: '—', def: 1, hint: 'α ≤ 30° → 1' },
      { key: 'gf', label: 'Коэффициент надёжности γ_f', unit: '—', def: 1.4 },
    ],
    compute: (v) => v.s0 * v.mu * v.gf,
    note: (_v, r) =>
      r > 3
        ? 'Высокая нагрузка: требуется усиление стропильной системы.'
        : 'Нагрузка в типовом диапазоне для скатной кровли.',
  },
  {
    id: 'insul',
    name: 'Толщина утеплителя',
    icon: 'Thermometer',
    stage: 'Этап 4 · Теплотехника',
    formula: 'δ = (R_тр − R_констр) · λ',
    norm: 'СП 50.13330',
    unit: 'м',
    fields: [
      { key: 'rtr', label: 'Требуемое сопротивление R_тр', unit: 'м²·°C/Вт', def: 3.2 },
      { key: 'rk', label: 'Сопротивление конструкции R_констр', unit: 'м²·°C/Вт', def: 0.9 },
      { key: 'lam', label: 'Теплопроводность λ', unit: 'Вт/(м·°C)', def: 0.041, hint: 'минвата ≈ 0.041' },
    ],
    compute: (v) => (v.rtr - v.rk) * v.lam,
    note: (_v, r) => `Округляем вверх до стандартной толщины плиты: ≈ ${Math.ceil((r * 1000) / 50) * 50} мм.`,
  },
  {
    id: 'ext',
    name: 'Количество огнетушителей',
    icon: 'Flame',
    stage: 'Этап 8 · Пожарная безопасность',
    formula: 'N = S_помещ / S_норм',
    norm: 'ППР РФ',
    unit: 'шт',
    fields: [
      { key: 's', label: 'Площадь помещения', unit: 'м²', def: 1200 },
      { key: 'sn', label: 'Норма на 1 огнетушитель', unit: 'м²', def: 200, hint: 'общественные здания' },
    ],
    compute: (v) => Math.ceil(v.s / v.sn),
    note: (_v, r) => `К установке принимается ${r} шт. с округлением в большую сторону.`,
  },
  {
    id: 'evac',
    name: 'Ширина эвакуационного выхода',
    icon: 'DoorOpen',
    stage: 'Этап 8 · Эвакуация',
    formula: 'B = N / (q · t)',
    norm: 'СП 1.13130',
    unit: 'м',
    fields: [
      { key: 'n', label: 'Число людей N', unit: 'чел', def: 300 },
      { key: 'q', label: 'Пропускная способность q', unit: 'чел/(м·мин)', def: 50 },
      { key: 't', label: 'Время эвакуации t', unit: 'мин', def: 3 },
    ],
    compute: (v) => v.n / (v.q * v.t),
    note: (_v, r) =>
      r < 1.2
        ? 'Меньше минимума — принимаем нормативные 1.2 м для основного выхода.'
        : 'Ширина удовлетворяет расчёту, проверьте минимумы по типу здания.',
  },
  {
    id: 'lamps',
    name: 'Количество светильников',
    icon: 'Lightbulb',
    stage: 'Этап 10 · Подсветка',
    formula: 'N = (E · S) / (Ф · η · K_з)',
    norm: 'СП 52.13330',
    unit: 'шт',
    fields: [
      { key: 'e', label: 'Требуемая освещённость E', unit: 'лк', def: 10, hint: 'дорожки — 10 лк' },
      { key: 's', label: 'Площадь S', unit: 'м²', def: 800 },
      { key: 'f', label: 'Световой поток лампы Ф', unit: 'лм', def: 3000 },
      { key: 'eta', label: 'КПД светильника η', unit: '—', def: 0.7 },
      { key: 'kz', label: 'Коэффициент запаса K_з', unit: '—', def: 1.4 },
    ],
    compute: (v) => Math.ceil((v.e * v.s) / (v.f * v.eta * v.kz)),
    note: (_v, r) => `Размещаем ${r} опор равномерно, шаг уточняется точечным методом.`,
  },
  {
    id: 'cable',
    name: 'Сечение кабеля подсветки',
    icon: 'Cable',
    stage: 'Этап 10 · Электрика',
    formula: 'S = (2 · I · L) / (γ · ΔU_доп)',
    norm: 'ПУЭ',
    unit: 'мм²',
    fields: [
      { key: 'i', label: 'Ток линии I', unit: 'А', def: 12 },
      { key: 'l', label: 'Длина линии L', unit: 'м', def: 120 },
      { key: 'g', label: 'Проводимость меди γ', unit: 'м/(Ом·мм²)', def: 57 },
      { key: 'du', label: 'Допустимая потеря ΔU', unit: 'В', def: 6.6, hint: '3% от 220 В' },
    ],
    compute: (v) => (2 * v.i * v.l) / (v.g * v.du),
    note: (_v, r) => {
      const std = [1.5, 2.5, 4, 6, 10, 16, 25, 35].find((s) => s >= r) ?? 50;
      return `Принимаем ближайшее стандартное сечение: ${std} мм².`;
    },
  },
];

const NORMS = [
  { code: 'ПП РФ № 87', title: 'Состав разделов проектной документации', tag: 'Проектирование' },
  { code: 'СП 20.13330', title: 'Нагрузки и воздействия', tag: 'Конструкции' },
  { code: 'СП 50.13330', title: 'Тепловая защита зданий', tag: 'Теплотехника' },
  { code: 'СП 1.13130', title: 'Эвакуационные пути и выходы', tag: 'Пожарная безопасность' },
  { code: 'СП 10.13130', title: 'Внутренний противопожарный водопровод', tag: 'Пожарная безопасность' },
  { code: 'ПУЭ, изд. 7', title: 'Правила устройства электроустановок', tag: 'Электрика' },
  { code: 'СП 47.13330', title: 'Инженерные изыскания для строительства', tag: 'Изыскания' },
  { code: 'СО 153-34.21.122', title: 'Устройство молниезащиты зданий', tag: 'Молниезащита' },
  { code: 'СП 52.13330', title: 'Естественное и искусственное освещение', tag: 'Освещение' },
  { code: 'ГОСТ Р 51992-2011', title: 'Устройства защиты от импульсных перенапряжений', tag: 'Слаботочка' },
];

const Calculators = () => {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [activeId, setActiveId] = useState(CALCS[0].id);
  const active = CALCS.find((c) => c.id === activeId)!;

  const [values, setValues] = useState<Record<string, Record<string, number>>>(() =>
    Object.fromEntries(
      CALCS.map((c) => [c.id, Object.fromEntries(c.fields.map((f) => [f.key, f.def]))]),
    ),
  );

  const [query, setQuery] = useState('');

  const current = values[active.id];
  const result = useMemo(() => {
    const r = active.compute(current);
    return Number.isFinite(r) ? r : 0;
  }, [active, current]);

  const filteredNorms = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NORMS;
    return NORMS.filter(
      (n) =>
        n.code.toLowerCase().includes(q) ||
        n.title.toLowerCase().includes(q) ||
        n.tag.toLowerCase().includes(q),
    );
  }, [query]);

  const setField = (key: string, raw: string) => {
    const num = parseFloat(raw.replace(',', '.'));
    setValues((prev) => ({
      ...prev,
      [active.id]: { ...prev[active.id], [key]: Number.isFinite(num) ? num : 0 },
    }));
  };

  const pretty = (n: number) =>
    Math.abs(n) >= 100 ? n.toFixed(0) : Math.abs(n) >= 1 ? n.toFixed(2) : n.toFixed(3);

  return (
    <section id="calculators" className="relative border-y border-border bg-card/40 py-24 lg:py-32">
      <div className="grid-lines-fine pointer-events-none absolute inset-0 opacity-30" />
      <div ref={ref} className="relative mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className={visible ? 'opacity-0 animate-fade-in' : 'opacity-0'}>
          <p className="mono-label">04 · Калькуляторы и нормы</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold uppercase leading-[0.95] tracking-tight sm:text-6xl">
            Считайте прямо <span className="text-accent">здесь</span>
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            Шесть демонстрационных модулей из расчётного ядра платформы. Меняйте
            значения — результат пересчитывается мгновенно, рядом видно формулу и норматив.
          </p>
        </div>

        <div className="mt-14 grid gap-px border border-border bg-border lg:grid-cols-[300px_1fr]">
          {/* Список калькуляторов */}
          <aside className="bg-background p-4">
            <p className="mono-label px-3 py-3">Модули</p>
            <div className="flex flex-col">
              {CALCS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`flex items-start gap-3 border-l-2 px-3 py-3.5 text-left transition-colors ${
                    c.id === activeId
                      ? 'border-primary bg-secondary text-foreground'
                      : 'border-transparent text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                  }`}
                >
                  <Icon
                    name={c.icon}
                    size={18}
                    className={c.id === activeId ? 'mt-0.5 text-primary' : 'mt-0.5'}
                  />
                  <span>
                    <span className="block text-sm font-medium leading-tight">{c.name}</span>
                    <span className="mono-label mt-1 block normal-case tracking-[0.14em]">
                      {c.stage}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </aside>

          {/* Рабочая область */}
          <div className="bg-card p-8 lg:p-12">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-primary/15 font-mono text-[10px] uppercase tracking-[0.18em] text-primary hover:bg-primary/15">
                {active.stage}
              </Badge>
              <Badge
                variant="outline"
                className="border-accent/40 font-mono text-[10px] uppercase tracking-[0.18em] text-accent"
              >
                {active.norm}
              </Badge>
            </div>

            <h3 className="mt-5 font-display text-3xl font-semibold uppercase tracking-tight">
              {active.name}
            </h3>
            <p className="mt-3 font-mono text-sm text-muted-foreground">{active.formula}</p>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
              <div className="grid gap-5 sm:grid-cols-2">
                {active.fields.map((f) => (
                  <div key={f.key}>
                    <Label
                      htmlFor={`${active.id}-${f.key}`}
                      className="mono-label normal-case tracking-[0.12em]"
                    >
                      {f.label}, {f.unit}
                    </Label>
                    <Input
                      id={`${active.id}-${f.key}`}
                      type="number"
                      step="any"
                      value={current[f.key]}
                      onChange={(e) => setField(f.key, e.target.value)}
                      className="mt-2 h-11 border-border bg-background font-mono text-foreground focus-visible:ring-primary"
                    />
                    {f.hint && (
                      <p className="mt-1.5 font-mono text-[10px] text-muted-foreground">{f.hint}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col justify-between border border-primary/40 bg-background p-7 glow-ring">
                <div>
                  <p className="mono-label">Результат</p>
                  <p className="mt-4 font-display text-6xl font-semibold leading-none text-primary">
                    {pretty(result)}
                  </p>
                  <p className="mt-2 font-mono text-sm text-muted-foreground">{active.unit}</p>
                </div>
                <p className="mt-8 border-t border-border pt-5 text-sm leading-relaxed text-foreground">
                  <Icon name="Info" size={14} className="mr-2 inline text-accent" />
                  {active.note(current, result)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Поиск норм */}
        <div className="mt-16 grid gap-px border border-border bg-border lg:grid-cols-[1fr_1.4fr]">
          <div className="bg-background p-8 lg:p-12">
            <p className="mono-label">Поиск норм и правил</p>
            <h3 className="mt-4 font-display text-3xl font-semibold uppercase leading-tight tracking-tight">
              Норматив за <span className="text-primary">пять секунд</span>
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Введите номер свода правил, тему или раздел — подборка отфильтруется
              на лету. В полной версии поиск идёт по пунктам и таблицам документов.
            </p>
            <div className="relative mt-8">
              <Icon
                name="Search"
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Например: эвакуация, СП 20, молниезащита"
                className="h-12 border-border bg-card pl-11 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="bg-card p-6 lg:p-8">
            <div className="max-h-[420px] space-y-px overflow-y-auto">
              {filteredNorms.map((n) => (
                <div
                  key={n.code}
                  className="group flex items-center justify-between gap-4 border-b border-border/60 px-2 py-4 transition-colors hover:bg-secondary"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
                      {n.code}
                    </p>
                    <p className="mt-1 truncate text-sm text-foreground">{n.title}</p>
                  </div>
                  <span className="mono-label shrink-0 normal-case">{n.tag}</span>
                </div>
              ))}
              {filteredNorms.length === 0 && (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                  <Icon name="SearchX" size={28} className="text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Ничего не найдено. Уточните запрос или напишите нам — добавим документ в базу.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculators;
