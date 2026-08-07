function BagMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="6" y="14" width="30" height="28" rx="6" fill="var(--color-brand-primary-light)" />
      <path
        d="M15 16v-2a6 6 0 0 1 12 0v2"
        stroke="var(--color-brand-white)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <rect x="12" y="18" width="30" height="24" rx="7" fill="var(--color-brand-black)" />
      <text
        x="27"
        y="35"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="700"
        fontSize="15"
        fill="var(--color-brand-primary-light)"
      >
        MF
      </text>
    </svg>
  );
}

export function Logo({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <BagMark className="h-9 w-9 shrink-0" />
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
  return <BagMark className={className} />;
}
