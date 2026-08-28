import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteChrome } from "@/components/SiteChrome";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryFilterGrid } from "@/components/CategoryFilterGrid";
import { getCategoryBySlug, getCategoryPageData } from "@/lib/queries";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return { title: category?.name ?? "Categoria" };
}

export default async function CategoriaPage({ params }: Params) {
  const { slug } = await params;
  const data = await getCategoryPageData(slug);
  if (!data) notFound();
  const { category, sections, products } = data;

  const totalCount = sections
    ? sections.reduce((sum, s) => sum + s.products.length, 0)
    : (products?.length ?? 0);

  return (
    <SiteChrome>
      <div className="container-mf py-10 md:py-14">
        <h1 className="font-display text-2xl font-semibold text-brand-text md:text-3xl">{category.name}</h1>
        <p className="mt-1.5 text-sm text-brand-muted">
          {totalCount} {totalCount === 1 ? "produto" : "produtos"}
        </p>

        {sections ? (
          <div className="mt-8">
            <CategoryFilterGrid sections={sections} />
          </div>
        ) : (
          <div className="mt-8">
            <ProductGrid products={products ?? []} />
          </div>
        )}
      </div>
    </SiteChrome>
  );
}
