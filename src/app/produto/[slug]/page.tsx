import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteChrome } from "@/components/SiteChrome";
import { BackButton } from "@/components/BackButton";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductDetails } from "@/components/ProductDetails";
import { RelatedProducts } from "@/components/RelatedProducts";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.name ?? "Produto" };
}

export default async function ProdutoPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.category_id, product.id, 4);

  return (
    <SiteChrome>
      <div className="container-mf py-6 md:py-10">
        <BackButton label="Voltar" />
        <div className="mt-5 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery
            images={product.images}
            productName={product.name}
            unavailable={!product.is_active}
          />
          <ProductDetails product={product} />
        </div>
      </div>
      <RelatedProducts products={related} />
    </SiteChrome>
  );
}
