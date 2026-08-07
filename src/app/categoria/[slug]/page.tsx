import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteChrome } from "@/components/SiteChrome";
import { ProductGrid } from "@/components/ProductGrid";
import { getCategoryBySlug, getProductsByCategorySlug } from "@/lib/queries";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return { title: category?.name ?? "Categoria" };
}

export default async function CategoriaPage({ params }: Params) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProductsByCategorySlug(slug);

  return (
    <SiteChrome>
      <div className="container-mf py-10 md:py-14">
        <h1 className="font-display text-2xl font-semibold text-brand-text md:text-3xl">
          {category.name}
        </h1>
        <p className="mt-1.5 text-sm text-brand-muted">
          {products.length} {products.length === 1 ? "produto" : "produtos"}
        </p>
        <div className="mt-8">
          <ProductGrid products={products} />
        </div>
      </div>
    </SiteChrome>
  );
}
