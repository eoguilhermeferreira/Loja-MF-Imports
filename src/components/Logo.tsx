const RHINESTONE_COUNT = 40;
const OUTER_R = 92;
const RING_R = 82;
const CENTER = 100;

function rhinestoneRing() {
  return Array.from({ length: RHINESTONE_COUNT }).map((_, i) => {
    const angle = (i / RHINESTONE_COUNT) * Math.PI * 2;
    const cx = CENTER + Math.cos(angle) * RING_R;
    const cy = CENTER + Math.sin(angle) * RING_R;
    return <circle key={i} cx={cx} cy={cy} r={3.1} fill="url(#mfGem)" />;
  });
}

function BadgeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 210"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mfBand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c9a8ee" />
          <stop offset="50%" stopColor="#9b5de5" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <radialGradient id="mfGem" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#f3ebfc" />
          <stop offset="55%" stopColor="#b98ae8" />
          <stop offset="100%" stopColor="#6d28d9" />
        </radialGradient>
        <linearGradient id="mfBagGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a8ee" />
          <stop offset="100%" stopColor="#9b5de5" />
        </linearGradient>
      </defs>

      {/* hanging tag / handle */}
      <path
        d="M84 18c0-11 7-18 16-18s16 7 16 18v26H84V18Z"
        fill="none"
        stroke="url(#mfBagGrad)"
        strokeWidth="7"
      />
      <path
        d="M70 34h60c6 0 10 5 9 11l-6 34H67l-6-34c-1-6 3-11 9-11Z"
        fill="url(#mfBagGrad)"
      />

      {/* outer rhinestone ring */}
      <circle cx={CENTER} cy="118" r={OUTER_R} fill="none" stroke="#9b5de5" strokeWidth="1" opacity="0.4" />
      <g transform="translate(0 -12)">{rhinestoneRing()}</g>

      {/* inner metallic rings */}
      <circle cx={CENTER} cy="106" r="70" fill="#ffffff" stroke="url(#mfBand)" strokeWidth="2.5" />
      <circle cx={CENTER} cy="106" r="64" fill="none" stroke="url(#mfBand)" strokeWidth="1" opacity="0.5" />

      {/* black panel with MF */}
      <rect x="34" y="80" width="132" height="62" rx="20" fill="#121114" />
      <text
        x={CENTER}
        y="128"
        textAnchor="middle"
        fontFamily="var(--font-display, Georgia, serif)"
        fontWeight="700"
        fontSize="46"
        fill="url(#mfBand)"
      >
        MF
      </text>

      {/* IMPORTS band */}
      <text
        x={CENTER}
        y="160"
        textAnchor="middle"
        fontFamily="var(--font-display, Georgia, serif)"
        fontWeight="600"
        fontSize="15"
        letterSpacing="4"
        fill="#3d2c55"
      >
        IMPORTS
      </text>
      <line x1="46" y1="156" x2="66" y2="156" stroke="#3d2c55" strokeWidth="1.5" opacity="0.6" />
      <line x1="134" y1="156" x2="154" y2="156" stroke="#3d2c55" strokeWidth="1.5" opacity="0.6" />

      {/* bottom flourish + gem */}
      <path
        d="M60 172c14 8 26 8 40 0 14 8 26 8 40 0"
        fill="none"
        stroke="url(#mfBand)"
        strokeWidth="1.5"
        opacity="0.7"
      />
      <path d={`M${CENTER} 168l6 8-6 8-6-8z`} fill="url(#mfGem)" />
    </svg>
  );
}

export function Logo({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <BadgeMark className="h-11 w-11 shrink-0" />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-xl font-semibold tracking-tight ${
            dark ? "text-brand-white" : "text-brand-black"
          }`}
        >
          MF Imports
        </span>
        <span
          className={`text-[10px] font-semibold uppercase tracking-[0.25em] ${
            dark ? "text-brand-primary-light" : "text-brand-primary"
          }`}
        >
          Variedades
        </span>
      </span>
    </span>
  );
}

export function LogoMark({ className = "" }: { className?: string }) {
  return <BadgeMark className={className} />;
}
