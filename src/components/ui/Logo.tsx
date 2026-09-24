type Props = { size?: number; className?: string; tone?: 'brand' | 'light' | 'dark' };

const R = 3.1;
const PETALS = [0, 60, 120, 180, 240, 300].map((a) => ({
  cx: 12 + R * Math.cos((a * Math.PI) / 180),
  cy: 12 + R * Math.sin((a * Math.PI) / 180),
}));

/** Логотип: равносторонний шестиугольник с узором «Цветок жизни». */
const Logo = ({ size = 34, className = '', tone = 'brand' }: Props) => {
  const fill = tone === 'brand' ? '#2f6df6' : tone === 'light' ? '#ffffff' : '#0f1d2e';
  const ink = tone === 'light' ? '#0f1d2e' : '#ffffff';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      role="img"
      aria-label="ЦИФРА"
    >
      <polygon points="12,1.2 21.35,6.6 21.35,17.4 12,22.8 2.65,17.4 2.65,6.6" fill={fill} />
      <g fill="none" stroke={ink} strokeWidth="0.75" opacity="0.92">
        <circle cx="12" cy="12" r={R} />
        {PETALS.map((p) => (
          <circle key={`${p.cx}-${p.cy}`} cx={p.cx} cy={p.cy} r={R} />
        ))}
      </g>
    </svg>
  );
};

export default Logo;
