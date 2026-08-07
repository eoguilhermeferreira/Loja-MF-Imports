import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductGrid } from "@/components/ProductGrid";
import type { ProductWithRelations } from "@/lib/queries";

export function ProductSection({
  title,
  subtitle,
  products,
  href,
  hrefLabel = "Ver todos",
}: {
  title: string;
  subtitle?: string;
  products: ProductWithRelations[];
  href?: string;
  hrefLabel?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="container-mf py-12 md:py-16">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-brand-text md:text-3xl">
            {title}
          </h2>
          {subtitle && <p className="mt-1.5 text-sm text-brand-muted">{subtitle}</p>}
        </div>
        {href && (
          <Link
            href={href}
            className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-primary hover:text-brand-primary-dark sm:inline-flex"
          >
            {hrefLabel}
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        )}
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
