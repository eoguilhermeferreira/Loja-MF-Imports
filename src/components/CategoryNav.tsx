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

  const loop = [...categories, ...categories];

  return (
    <section className="py-10 md:py-14">
      <h2 className="container-mf font-display text-2xl font-semibold text-brand-text md:text-3xl">
        Compre por categoria
      </h2>
      <div className="group/marquee relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_2rem,black_calc(100%-2rem),transparent)]">
        <div className="flex w-max animate-marquee gap-3 group-hover/marquee:[animation-play-state:paused] md:gap-4">
          {loop.map((cat, i) => {
            const Icon = ICONS[cat.icon ?? ""] ?? ShoppingBag;
            return (
              <Link
                key={`${cat.id}-${i}`}
                href={`/categoria/${cat.slug}`}
                aria-hidden={i >= categories.length}
                tabIndex={i >= categories.length ? -1 : undefined}
                className="group flex shrink-0 items-center gap-2.5 rounded-full border border-brand-border bg-white py-2.5 pr-5 pl-2.5 text-center transition-all hover:border-brand-primary hover:shadow-md hover:shadow-brand-primary/10"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white">
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
                </span>
                <span className="whitespace-nowrap text-[13px] font-medium text-brand-text">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
