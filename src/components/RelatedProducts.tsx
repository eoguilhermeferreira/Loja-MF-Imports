import { ProductGrid } from "@/components/ProductGrid";
import type { ProductWithRelations } from "@/lib/queries";

export function RelatedProducts({ products }: { products: ProductWithRelations[] }) {
  if (products.length === 0) return null;

  return (
    <section className="container-mf border-t border-brand-border py-12 md:py-16">
      <h2 className="mb-7 font-display text-2xl font-semibold text-brand-text">
        Você também pode gostar
      </h2>
      <ProductGrid products={products} />
    </section>
  );
}
