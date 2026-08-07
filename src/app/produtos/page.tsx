import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { ProductGrid } from "@/components/ProductGrid";
import { getAllActiveProducts, searchProducts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Todos os produtos",
};

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const products = q ? await searchProducts(q) : await getAllActiveProducts();

  return (
    <SiteChrome>
      <div className="container-mf py-10 md:py-14">
        <h1 className="font-display text-2xl font-semibold text-brand-text md:text-3xl">
          {q ? `Resultados para "${q}"` : "Todos os produtos"}
        </h1>
        <p className="mt-1.5 text-sm text-brand-muted">
          {products.length} {products.length === 1 ? "produto encontrado" : "produtos encontrados"}
        </p>
        <div className="mt-8">
          <ProductGrid products={products} />
        </div>
      </div>
    </SiteChrome>
  );
}
