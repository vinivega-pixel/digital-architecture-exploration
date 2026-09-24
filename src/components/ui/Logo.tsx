type Props = { size?: number; className?: string; tone?: 'brand' | 'light' | 'dark' };

const L = 9;
const K = 0.72;
const ANGLES = [-90, -30, 30, 90, 150, 210];

const petal = (deg: number) => {
  const a = (deg * Math.PI) / 180;
  const x = 12 + L * Math.cos(a);
  const y = 12 + L * Math.sin(a);
  const r = L * K;
  return `M12 12 A ${r} ${r} 0 0 1 ${x.toFixed(3)} ${y.toFixed(3)} A ${r} ${r} 0 0 1 12 12 Z`;
};

const TONES = {
  brand: { line: '#7d9fd6', petal: 'rgba(125,159,214,.16)' },
  light: { line: '#8fb4ff', petal: 'rgba(143,180,255,.18)' },
  dark: { line: '#5b7fb8', petal: 'rgba(91,127,184,.14)' },
} as const;

/** Логотип: контурный шестиугольник с узором «Цветок жизни». */
const Logo = ({ size = 34, className = '', tone = 'brand' }: Props) => {
  const c = TONES[tone];

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} role="img" aria-label="ЦИФРА">
      <polygon
        points="12,1.6 21,6.8 21,17.2 12,22.4 3,17.2 3,6.8"
        fill="none"
        stroke={c.line}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <g fill={c.petal} stroke={c.line} strokeWidth="1.15" strokeLinejoin="round">
        {ANGLES.map((a) => (
          <path key={a} d={petal(a)} />
        ))}
      </g>
    </svg>
  );
};

export default Logo;
