import { useEffect, useRef, useState } from 'react';
import type { WsTheme } from './theme';

export type SceneVariant = {
  name: string;
  footprint?: string;
  floors?: number;
  area?: number;
  rooms?: { name: string; area: number }[];
  idea?: string;
};

type Props = {
  theme: WsTheme;
  dark: boolean;
  variant: SceneVariant | null;
  mode: '3d' | '2d';
  onPick?: (room: string | null) => void;
  picked?: string | null;
};

const parseFootprint = (s?: string): [number, number] => {
  const m = String(s ?? '').match(/(\d+(?:[.,]\d+)?)\s*[x×хX]\s*(\d+(?:[.,]\d+)?)/);
  if (!m) return [12, 10];
  return [Number(m[1].replace(',', '.')), Number(m[2].replace(',', '.'))];
};

/** Полотно с модульной сеткой: изометрия объёма и план этажа по данным архитектора. */
const Canvas = ({ theme, dark, variant, mode, onPick, picked }: Props) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 900, h: 560 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const [L, W] = parseFootprint(variant?.footprint);
  const floors = Math.max(1, variant?.floors ?? 2);
  const cx = size.w / 2 + pan.x;
  const cy = size.h / 2 + pan.y;

  const grid = 28 * zoom;
  const lines: JSX.Element[] = [];
  for (let x = (pan.x % grid) - grid; x < size.w + grid; x += grid) {
    lines.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={size.h} stroke={theme.line} strokeWidth={0.5} opacity={dark ? 0.35 : 0.5} />);
  }
  for (let y = (pan.y % grid) - grid; y < size.h + grid; y += grid) {
    lines.push(<line key={`h${y}`} x1={0} y1={y} x2={size.w} y2={y} stroke={theme.line} strokeWidth={0.5} opacity={dark ? 0.35 : 0.5} />);
  }

  const k = Math.min(size.w / (L * 2.6), size.h / (W * 2.6)) * zoom;
  const iso = (x: number, y: number, z = 0) => ({
    x: cx + (x - y) * k * 0.86,
    y: cy + (x + y) * k * 0.5 - z * k,
  });

  const rooms = variant?.rooms ?? [];
  const totalArea = rooms.reduce((s, r) => s + (r.area || 0), 0) || L * W;

  const planCells = () => {
    const out: JSX.Element[] = [];
    const scale = Math.min(size.w / (L * 1.5), size.h / (W * 1.5)) * zoom;
    const ox = cx - (L * scale) / 2;
    const oy = cy - (W * scale) / 2;
    let cursor = 0;
    rooms.forEach((r, i) => {
      const share = (r.area || 1) / totalArea;
      const h = W * scale * share * (rooms.length > 4 ? 2 : 1);
      const rowH = Math.min(h, W * scale - cursor);
      if (rowH <= 1) return;
      const on = picked === r.name;
      out.push(
        <g key={r.name + i} onClick={() => onPick?.(on ? null : r.name)} style={{ cursor: 'pointer' }}>
          <rect
            x={ox}
            y={oy + cursor}
            width={L * scale}
            height={rowH}
            fill={on ? `${theme.accent}22` : dark ? '#2B303A' : '#FBFCFD'}
            stroke={on ? theme.accent : theme.line}
            strokeWidth={on ? 2 : 1}
          />
          <text x={ox + 10} y={oy + cursor + 18} fontSize={12} fill={theme.text}>
            {r.name}
          </text>
          <text x={ox + 10} y={oy + cursor + 34} fontSize={11} fill={`${theme.text}99`}>
            {r.area} м²
          </text>
        </g>,
      );
      cursor += rowH;
    });
    if (!out.length) {
      out.push(
        <rect
          key="empty"
          x={cx - (L * scale) / 2}
          y={cy - (W * scale) / 2}
          width={L * scale}
          height={W * scale}
          fill="none"
          stroke={theme.line}
          strokeWidth={1.5}
          strokeDasharray="6 4"
        />,
      );
    }
    return out;
  };

  const box = () => {
    const h = floors * 3;
    const p = [
      iso(0, 0, 0), iso(L, 0, 0), iso(L, W, 0), iso(0, W, 0),
      iso(0, 0, h), iso(L, 0, h), iso(L, W, h), iso(0, W, h),
    ];
    const poly = (pts: { x: number; y: number }[], fill: string, op = 1) => (
      <polygon
        points={pts.map((q) => `${q.x},${q.y}`).join(' ')}
        fill={fill}
        fillOpacity={op}
        stroke={theme.line}
        strokeWidth={1}
      />
    );
    const wallA = dark ? '#2E343F' : '#E9EDF2';
    const wallB = dark ? '#262B34' : '#DFE5EC';
    const roof = dark ? '#39414E' : '#F2F5F8';
    const slabs: JSX.Element[] = [];
    for (let f = 1; f < floors; f++) {
      const z = f * 3;
      const a = iso(0, 0, z);
      const b = iso(L, 0, z);
      const c = iso(L, W, z);
      const d = iso(0, W, z);
      slabs.push(
        <polyline
          key={`s${f}`}
          points={`${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y} ${a.x},${a.y}`}
          fill="none"
          stroke={theme.line}
          strokeWidth={0.8}
          opacity={0.7}
        />,
      );
    }
    return (
      <g>
        {poly([p[0], p[1], p[5], p[4]], wallA)}
        {poly([p[1], p[2], p[6], p[5]], wallB)}
        {poly([p[4], p[5], p[6], p[7]], roof)}
        {slabs}
      </g>
    );
  };

  return (
    <div
      ref={wrapRef}
      className="relative h-full w-full overflow-hidden"
      style={{ background: theme.bg, cursor: drag.current ? 'grabbing' : 'grab' }}
      onPointerDown={(e) => {
        drag.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
        (e.target as Element).setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        setPan({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y });
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onWheel={(e) => {
        setZoom((z) => Math.min(3, Math.max(0.4, z - e.deltaY * 0.0012)));
      }}
    >
      <svg width={size.w} height={size.h} className="block">
        {lines}
        {mode === '3d' ? box() : planCells()}
      </svg>

      <div className="pointer-events-none absolute bottom-3 left-3 text-[0.7rem]" style={{ color: `${theme.text}88` }}>
        {variant ? `${variant.name} · ${L}×${W} м · ${floors} эт.` : 'Вариант не выбран — попросите архитектора'}
      </div>

      <div className="absolute bottom-3 right-3 flex gap-1.5">
        {[
          { t: '−', f: () => setZoom((z) => Math.max(0.4, z - 0.2)) },
          { t: '+', f: () => setZoom((z) => Math.min(3, z + 0.2)) },
          { t: '⟳', f: () => { setZoom(1); setPan({ x: 0, y: 0 }); } },
        ].map((b) => (
          <button
            key={b.t}
            type="button"
            onClick={b.f}
            className="flex h-9 w-9 items-center justify-center text-[0.9rem]"
            style={{ background: theme.panel, color: theme.text, border: `1px solid ${theme.line}`, boxShadow: theme.shadow }}
          >
            {b.t}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Canvas;
