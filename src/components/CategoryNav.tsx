import Link from "next/link";
import {
  Sparkles,
  Footprints,
  Smartphone,
  Droplet,
  Gem,
  Watch,
  Headphones,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/lib/queries";

const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  footprints: Footprints,
  smartphone: Smartphone,
  droplet: Droplet,
  gem: Gem,
  watch: Watch,
  headphones: Headphones,
};

export function CategoryNav({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="container-mf py-10 md:py-14">
      <h2 className="font-display text-2xl font-semibold text-brand-text md:text-3xl">
        Compre por categoria
      </h2>
      <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-7 md:gap-4">
        {categories.map((cat) => {
          const Icon = ICONS[cat.icon ?? ""] ?? ShoppingBag;
          return (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              className="group flex flex-col items-center gap-2.5 rounded-2xl border border-brand-border bg-white p-4 text-center transition-all hover:-translate-y-0.5 hover:border-brand-primary hover:shadow-md hover:shadow-brand-primary/10"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-tint text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white">
                <Icon className="h-5.5 w-5.5" strokeWidth={1.6} />
              </span>
              <span className="text-[13px] font-medium text-brand-text">{cat.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
