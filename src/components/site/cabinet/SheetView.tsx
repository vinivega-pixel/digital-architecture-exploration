import type { Project } from '@/data/cabinet';

/** Планировка внутри листа — своя для каждого типа объекта. */
const Plan = ({ kind }: { kind: Project['sheet']['plan'] }) => {
  const line = { stroke: '#7d8aa0', strokeWidth: 1.4, fill: 'none' } as const;
  const thin = { stroke: '#9aa6ba', strokeWidth: 0.8, fill: 'none' } as const;

  if (kind === 'school')
    return (
      <g>
        <rect x="14" y="16" width="230" height="86" {...line} />
        <path d="M14 58h230M74 16v86M134 16v86M194 16v86" {...thin} />
        <rect x="26" y="66" width="36" height="26" {...thin} />
        <rect x="86" y="66" width="36" height="26" {...thin} />
        <rect x="146" y="66" width="36" height="26" {...thin} />
        <rect x="206" y="66" width="28" height="26" {...thin} />
        <path d="M44 102v6M104 102v6M164 102v6" stroke="#7d8aa0" strokeWidth="1.4" />
      </g>
    );

  if (kind === 'house')
    return (
      <g>
        <rect x="34" y="18" width="190" height="84" {...line} />
        <path d="M34 62h94M128 18v84M128 40h96" {...thin} />
        <rect x="46" y="26" width="30" height="26" {...thin} />
        <rect x="88" y="26" width="30" height="26" {...thin} />
        <path d="M140 52h74v46h-74z" {...thin} />
        <path d="M224 40h22v62h-22z" {...thin} />
        <path d="M78 102v6M170 102v6" stroke="#7d8aa0" strokeWidth="1.4" />
      </g>
    );

  return (
    <g>
      <rect x="20" y="16" width="218" height="86" {...line} />
      <path d="M129 16v86M20 60h109M129 52h109" {...thin} />
      <rect x="32" y="24" width="40" height="28" {...thin} />
      <rect x="82" y="24" width="36" height="28" {...thin} />
      <rect x="32" y="68" width="40" height="26" {...thin} />
      <rect x="82" y="68" width="36" height="26" {...thin} />
      <rect x="141" y="60" width="44" height="34" {...thin} />
      <rect x="195" y="60" width="32" height="34" {...thin} />
      <path d="M60 102v6M180 102v6" stroke="#7d8aa0" strokeWidth="1.4" />
    </g>
  );
};

/** Лист документации в рамке по ГОСТ 2.104 с планом этажа. */
const SheetView = ({ sheet, project }: { sheet: Project['sheet']; project: string }) => (
  <div className="overflow-hidden rounded-lg border border-white/10 bg-[#f4f5f7]">
    <svg viewBox="0 0 300 168" className="block w-full" role="img" aria-label={`Лист ${sheet.code} — ${sheet.name}`}>
      <rect x="0" y="0" width="300" height="168" fill="#f4f5f7" />
      <rect x="5" y="4" width="290" height="160" fill="none" stroke="#5c6879" strokeWidth="1.2" />
      <rect x="14" y="8" width="277" height="152" fill="none" stroke="#5c6879" strokeWidth="0.6" />

      <g transform="translate(22, 14)">
        <Plan kind={sheet.plan} />
      </g>

      {/* Штамп по ГОСТ 2.104 */}
      <g transform="translate(110, 118)">
        <rect x="0" y="0" width="181" height="42" fill="#fff" stroke="#5c6879" strokeWidth="0.9" />
        <path
          d="M0 11h181M0 22h181M0 32h181M56 0v42M130 0v42M155 32v10"
          stroke="#5c6879"
          strokeWidth="0.6"
          fill="none"
        />
        <text x="4" y="8" fontSize="5" fill="#3d4757">
          {sheet.code}
        </text>
        <text x="60" y="8" fontSize="5" fill="#3d4757">
          {project}
        </text>
        <text x="4" y="19" fontSize="5" fill="#3d4757">
          Разраб. {sheet.author}
        </text>
        <text x="60" y="19" fontSize="5.2" fill="#1f2937">
          {sheet.name}
        </text>
        <text x="4" y="29" fontSize="5" fill="#3d4757">
          Н. контр. Титова Л. П.
        </text>
        <text x="60" y="29" fontSize="5" fill="#3d4757">
          М {sheet.scale}
        </text>
        <text x="133" y="29" fontSize="5" fill="#3d4757">
          Стадия Р
        </text>
        <text x="133" y="40" fontSize="5" fill="#3d4757">
          Лист 1
        </text>
        <text x="158" y="40" fontSize="5" fill="#3d4757">
          Листов 34
        </text>
      </g>
    </svg>
  </div>
);

export default SheetView;
