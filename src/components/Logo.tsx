import Image from "next/image";

export function Logo({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo.png"
        alt="MF Imports"
        width={44}
        height={44}
        className="h-11 w-11 shrink-0"
        priority
      />
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
