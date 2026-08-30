const SUBS: Record<string, string> = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
  '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
};

export const normKey = (s: string) =>
  s
    .split('')
    .map((c) => SUBS[c] ?? c)
    .join('')
    .toLowerCase()
    .replace(/[_\s.,]/g, '');

const TR: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
  й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ы: 'y', э: 'e',
  ю: 'yu', я: 'ya', ь: '', ъ: '',
  α: 'a', β: 'b', γ: 'g', δ: 'd', ε: 'e', λ: 'l', μ: 'm', ν: 'v', ρ: 'r',
  σ: 's', τ: 't', φ: 'f', ψ: 'p', ω: 'w', θ: 't', η: 'n', π: 'p',
};

const translit = (s: string) =>
  normKey(s)
    .split('')
    .map((c) => TR[c] ?? c)
    .join('');

export const fmtNum = (v: number, d = 4) =>
  new Intl.NumberFormat('ru-RU', { maximumFractionDigits: d }).format(
    Number.isFinite(v) ? Number(v.toFixed(d)) : 0,
  );

const OPS = '+-*/^';

type Tok = { t: 'n' | 'op' | 'f' | '(' | ')'; v: string; n?: number };

const FUNCS = ['arcsin', 'arccos', 'arctg', 'arctan', 'sin', 'cos', 'tg', 'tan', 'ctg', 'lg', 'ln', 'log', 'exp', 'abs', 'sqrt'];

const clean = (raw: string) =>
  raw
    .replace(/\|([^|]+)\|/g, 'abs($1)')
    .replace(/[×·∙]/g, '*')
    .replace(/[÷:]/g, '/')
    .replace(/[−–—]/g, '-')
    .replace(/,(?=\d)/g, '.')
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (src: string): Tok[] | null => {
  const s = clean(src);
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === ' ') { i++; continue; }
    if (/\d/.test(c) || (c === '.' && /\d/.test(s[i + 1] ?? ''))) {
      let j = i;
      while (j < s.length && /[\d.]/.test(s[j])) j++;
      const n = Number(s.slice(i, j));
      if (!Number.isFinite(n)) return null;
      out.push({ t: 'n', v: s.slice(i, j), n });
      i = j;
      continue;
    }
    if (c === '√') { out.push({ t: 'f', v: 'sqrt' }); i++; continue; }
    if (c === '²') { out.push({ t: 'op', v: '^' }); out.push({ t: 'n', v: '2', n: 2 }); i++; continue; }
    if (c === '³') { out.push({ t: 'op', v: '^' }); out.push({ t: 'n', v: '3', n: 3 }); i++; continue; }
    if (c === 'π') { out.push({ t: 'n', v: 'π', n: Math.PI }); i++; continue; }
    if (c === '(' || c === ')') { out.push({ t: c, v: c }); i++; continue; }
    if (OPS.includes(c)) { out.push({ t: 'op', v: c }); i++; continue; }
    const rest = s.slice(i).toLowerCase();
    const fn = FUNCS.find((f) => rest.startsWith(f));
    if (fn) { out.push({ t: 'f', v: fn }); i += fn.length; continue; }
    return null;
  }
  return out.length ? out : null;
};

let DEG_MODE = false;

const applyFn = (name: string, x: number): number => {
  const a = DEG_MODE ? (x * Math.PI) / 180 : x;
  const back = (v: number) => (DEG_MODE ? (v * 180) / Math.PI : v);
  switch (name) {
    case 'sqrt': return Math.sqrt(x);
    case 'sin': return Math.sin(a);
    case 'cos': return Math.cos(a);
    case 'tg': case 'tan': return Math.tan(a);
    case 'ctg': return 1 / Math.tan(a);
    case 'arcsin': return back(Math.asin(x));
    case 'arccos': return back(Math.acos(x));
    case 'arctg': case 'arctan': return back(Math.atan(x));
    case 'lg': case 'log': return Math.log10(x);
    case 'ln': return Math.log(x);
    case 'exp': return Math.exp(x);
    case 'abs': return Math.abs(x);
    default: return NaN;
  }
};

const evalToks = (toks: Tok[]): number | null => {
  let pos = 0;
  const peek = () => toks[pos];

  const parsePrimary = (): number | null => {
    const tk = peek();
    if (!tk) return null;
    if (tk.t === 'op' && (tk.v === '-' || tk.v === '+')) {
      pos++;
      const v = parsePrimary();
      return v === null ? null : tk.v === '-' ? -v : v;
    }
    if (tk.t === 'f') {
      pos++;
      const v = parsePrimary();
      return v === null ? null : applyFn(tk.v, v);
    }
    if (tk.t === '(') {
      pos++;
      const v = parseAdd();
      if (peek()?.t !== ')') return null;
      pos++;
      return v;
    }
    if (tk.t === 'n') { pos++; return tk.n ?? null; }
    return null;
  };

  const parsePow = (): number | null => {
    const base = parsePrimary();
    if (base === null) return null;
    if (peek()?.t === 'op' && peek()?.v === '^') {
      pos++;
      const e = parsePow();
      return e === null ? null : Math.pow(base, e);
    }
    return base;
  };

  const parseMul = (): number | null => {
    let v = parsePow();
    if (v === null) return null;
    while (peek()?.t === 'op' && (peek()!.v === '*' || peek()!.v === '/')) {
      const op = toks[pos].v;
      pos++;
      const rhs = parsePow();
      if (rhs === null) return null;
      v = op === '*' ? v * rhs : rhs === 0 ? NaN : v / rhs;
    }
    return v;
  };

  const parseAdd = (): number | null => {
    let v = parseMul();
    if (v === null) return null;
    while (peek()?.t === 'op' && (peek()!.v === '+' || peek()!.v === '-')) {
      const op = toks[pos].v;
      pos++;
      const rhs = parseMul();
      if (rhs === null) return null;
      v = op === '+' ? v + rhs : v - rhs;
    }
    return v;
  };

  const res = parseAdd();
  if (res === null || pos !== toks.length || !Number.isFinite(res)) return null;
  return res;
};

export const evalExpr = (src: string): number | null => {
  const toks = tokenize(src);
  return toks ? evalToks(toks) : null;
};

const pretty = (s: string) =>
  s
    .replace(/\*/g, ' × ')
    .replace(/\//g, ' / ')
    .replace(/\s+/g, ' ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .trim();

const innerParen = (s: string): [number, number] | null => {
  let open = -1;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') open = i;
    else if (s[i] === ')' && open >= 0) return [open, i];
  }
  return null;
};

const FN_RE = new RegExp(`(${FUNCS.join('|')}|√)\\s*$`, 'i');

/** Последовательно упрощает числовое выражение: 6 × (3 + 1) = 6 × 4 = 24 */
export const reduceSteps = (numeric: string, maxSteps = 6): string[] => {
  const steps: string[] = [];
  let cur = clean(numeric);

  for (let guard = 0; guard < maxSteps; guard++) {
    const par = innerParen(cur);
    if (par) {
      const [a, b] = par;
      const head = cur.slice(0, a);
      const fnMatch = head.match(FN_RE);
      const from = fnMatch ? a - fnMatch[0].length : a;
      const piece = cur.slice(from, b + 1);
      const val = evalExpr(piece);
      if (val === null) return steps;
      cur = cur.slice(0, from) + fmtNum(val).replace(/\s/g, '').replace(',', '.') + cur.slice(b + 1);
      steps.push(pretty(cur));
      continue;
    }

    const val = evalExpr(cur);
    if (val === null) return steps;

    if (/[+\-*/^√²³]/.test(cur.replace(/^-/, ''))) {
      const hasMul = /[*/^√²³]/.test(cur);
      const hasAdd = /\d\s*[+-]\s*\d/.test(cur);
      if (hasMul && hasAdd) {
        const parts = cur.split(/(?<=[\d.)])\s*([+-])\s*(?=[\d(√])/);
        const rebuilt: string[] = [];
        let okAll = true;
        for (let i = 0; i < parts.length; i += 2) {
          const v = evalExpr(parts[i]);
          if (v === null) { okAll = false; break; }
          rebuilt.push(fmtNum(v).replace(/\s/g, '').replace(',', '.'));
          if (parts[i + 1]) rebuilt.push(parts[i + 1]);
        }
        if (okAll && rebuilt.length > 1) {
          cur = rebuilt.join(' ');
          steps.push(pretty(cur));
          continue;
        }
      }
      steps.push(fmtNum(val));
      return steps;
    }
    return steps;
  }
  return steps;
};

export type SubstResult = { symbolic: string; numeric: string; steps: string[]; value: number | null };

/** Подставляет значения полей в формулу и раскладывает вычисление по шагам. */
export const substitute = (
  formula: string,
  fields: { key: string; label: string }[],
  values: Record<string, number>,
): SubstResult[] => {
  const parts = formula.split(/\s*;\s*/).filter(Boolean);
  const byKey = new Map(fields.map((f) => [normKey(f.key), f.key]));

  return parts.map((part) => {
    const eq = part.indexOf('=');
    const lhs = eq >= 0 ? part.slice(0, eq).trim() : '';
    const rhs = eq >= 0 ? part.slice(eq + 1) : part;

    let numeric = rhs;
    const tokens = [...rhs.matchAll(/[A-Za-zА-Яа-яΑ-Ωα-ωёЁ][A-Za-zА-Яа-яΑ-Ωα-ωёЁ0-9_₀-₉]*/g)]
      .map((m) => m[0])
      .filter((t) => !FUNCS.includes(t.toLowerCase()));

    const uniq = [...new Set(tokens)].sort((a, b) => b.length - a.length);
    const used = new Set<string>();
    const pool = fields.filter((f) => values[f.key] !== undefined);

    const resolve = (tok: string): string | undefined => {
      const n = normKey(tok);
      const direct = byKey.get(n);
      if (direct && !used.has(direct)) return direct;

      const tn = translit(tok);
      const byTr = pool.find((f) => !used.has(f.key) && translit(f.key) === tn);
      if (byTr) return byTr.key;

      const byLabel = pool.find((f) => !used.has(f.key) && translit(f.label).startsWith(tn) && tn.length > 1);
      if (byLabel) return byLabel.key;

      const byPrefix = pool.find(
        (f) => !used.has(f.key) && tn.length > 1 && translit(f.key).startsWith(tn.slice(0, 2)),
      );
      if (byPrefix) return byPrefix.key;

      const byFirst = pool.find((f) => !used.has(f.key) && translit(f.key)[0] === tn[0]);
      if (byFirst) return byFirst.key;

      return pool.find((f) => !used.has(f.key))?.key;
    };

    let matched = 0;
    const order = [...uniq].sort((a, b) => rhs.indexOf(a) - rhs.indexOf(b));
    const map = new Map<string, string>();
    for (const tok of order) {
      const key = resolve(tok);
      if (!key) continue;
      used.add(key);
      map.set(tok, String(values[key]));
      matched++;
    }

    for (const tok of uniq) {
      const val = map.get(tok);
      if (val === undefined) continue;
      const safe = tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      numeric = numeric.replace(new RegExp(safe, 'g'), val);
    }

    const hasLetters = /[A-Za-zА-Яа-яΑ-Ωα-ωёЁ]/.test(
      numeric.replace(new RegExp(FUNCS.join('|'), 'gi'), ''),
    );
    if (!matched || hasLetters) {
      return { symbolic: part.trim(), numeric: '', steps: [], value: null };
    }

    const value = evalExpr(numeric);
    const steps = value === null ? [] : reduceSteps(numeric);
    return {
      symbolic: part.trim(),
      numeric: `${lhs ? `${lhs} = ` : ''}${pretty(numeric)}`,
      steps,
      value,
    };
  });
};

const parseValue = (s: string): number | null => {
  const m = String(s).match(/-?\d[\d\s\u00a0]*(?:[.,]\d+)?/);
  if (!m) return null;
  const n = Number(m[0].replace(/[\s\u00a0]/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

const close = (a: number, b: number) => {
  const scale = Math.max(Math.abs(a), Math.abs(b), 1e-9);
  return Math.abs(a - b) / scale < 0.005;
};

const FN_ALT = new RegExp(FUNCS.join('|'), 'gi');

const tokensOf = (rhs: string) =>
  [...new Set(
    [...rhs.matchAll(/[A-Za-zА-Яа-яΑ-Ωα-ωёЁ][A-Za-zА-Яа-яΑ-Ωα-ωёЁ0-9_₀-₉]*/g)]
      .map((m) => m[0])
      .filter((t) => !FUNCS.includes(t.toLowerCase())),
  )];

const applyMap = (rhs: string, map: Map<string, number>) => {
  let out = rhs;
  for (const tok of [...map.keys()].sort((a, b) => b.length - a.length)) {
    const safe = tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(new RegExp(safe, 'g'), String(map.get(tok)));
  }
  return out;
};

/**
 * Подбирает соответствие обозначений формулы полям калькулятора так,
 * чтобы вычисленное значение совпало с результатом. Если совпадения нет —
 * разбор в документ не попадает.
 */
export const verifiedSubstitution = (
  formula: string | undefined,
  fields: { key: string; label: string }[],
  values: Record<string, number>,
  results: { label: string; value: string }[],
): SubstResult[] => {
  if (!formula) return [];
  const main = results.find((r) => (r as { accent?: boolean }).accent) ?? results[results.length - 1];
  const mainVal = main ? parseValue(main.value) : null;
  const targets = mainVal === null ? [] : [mainVal];
  if (!targets.length) return [];

  const pool: { key: string; label: string; val: number }[] = [
    ...fields.filter((f) => Number.isFinite(values[f.key])).map((f) => ({ key: f.key, label: f.label, val: values[f.key] })),
    ...results
      .map((r, i) => ({ key: `__r${i}`, label: r.label, val: parseValue(r.value) }))
      .filter((r): r is { key: string; label: string; val: number } => r.val !== null),
  ];
  const out: SubstResult[] = [];

  for (const part of formula.split(/\s*;\s*/).filter(Boolean)) {
    const eq = part.indexOf('=');
    const lhs = eq >= 0 ? part.slice(0, eq).trim() : '';
    const rhs = eq >= 0 ? part.slice(eq + 1) : part;
    const toks = tokensOf(rhs);
    if (!toks.length || toks.length > 7) continue;

    const cands = toks.map((t) => {
      const tn = translit(t);
      const scored = pool
        .map((f) => {
          const fk = translit(f.key);
          const fl = translit(f.label);
          const own = f.key.startsWith('__r') ? -25 : 0;
          let s = 0;
          if (fk === tn) s = 100;
          else if (fl.startsWith(tn) && tn.length > 1) s = 60;
          else if (fk.startsWith(tn[0]) || tn.startsWith(fk[0])) s = 30;
          else s = 5;
          return { f, s: s + own };
        })
        .sort((a, b) => b.s - a.s)
        .map((x) => x.f.key);
      return scored;
    });

    let best: SubstResult | null = null;
    const assign = new Map<string, number>();
    const taken = new Set<string>();

    const walk = (i: number) => {
      if (best) return;
      if (i === toks.length) {
        const numeric = applyMap(rhs, assign);
        if (/[A-Za-zА-Яа-яΑ-Ωα-ωёЁ]/.test(numeric.replace(FN_ALT, ''))) return;
        for (const deg of [false, true]) {
          DEG_MODE = deg;
          const value = evalExpr(numeric);
          if (value !== null && targets.some((t) => close(value, t))) {
            best = {
              symbolic: part.trim(),
              numeric: `${lhs ? `${lhs} = ` : ''}${pretty(numeric)}`,
              steps: reduceSteps(numeric),
              value,
            };
            DEG_MODE = false;
            return;
          }
        }
        DEG_MODE = false;
        return;
      }
      for (const key of cands[i]) {
        if (taken.has(key)) continue;
        const src = pool.find((f) => f.key === key);
        if (!src) continue;
        taken.add(key);
        assign.set(toks[i], src.val);
        walk(i + 1);
        assign.delete(toks[i]);
        taken.delete(key);
        if (best) return;
      }
    };

    walk(0);
    if (best) out.push(best);
  }

  return out;
};

export default substitute;