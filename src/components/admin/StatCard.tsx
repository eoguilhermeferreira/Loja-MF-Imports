import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-brand-border bg-white p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand-primary">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand-muted">{label}</p>
        <p className="mt-0.5 font-display text-xl font-semibold text-brand-text">{value}</p>
      </div>
    </div>
  );
}
