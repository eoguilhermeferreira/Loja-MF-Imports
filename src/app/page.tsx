import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { BannerCarousel } from "@/components/BannerCarousel";
import { CategoryNav } from "@/components/CategoryNav";
import { ProductSection } from "@/components/ProductSection";
import { ProductCoverflow } from "@/components/ProductCoverflow";
import { EditorialBanner } from "@/components/EditorialBanner";
import { TrustBadges } from "@/components/TrustBadges";
import { WhatsappCta } from "@/components/WhatsappCta";
import {
  getActiveBanners,
  getCategories,
  getFeaturedProducts,
  getNewProducts,
  getPromoProducts,
} from "@/lib/queries";

export default async function Home() {
  const [banners, categories, featured, promo, novidades] = await Promise.all([
    getActiveBanners(),
    getCategories(),
    getFeaturedProducts(8),
    getPromoProducts(8),
    getNewProducts(8),
  ]);

  return (
    <SiteChrome>
      <BannerCarousel banners={banners} />
      <CategoryNav categories={categories} />

      <ProductSection
        title="Mais vendidos"
        subtitle="Os favoritos dos nossos clientes"
        products={featured}
        href="/produtos"
      />

      <EditorialBanner
        eyebrow="Perfumaria importada"
        title="Fragrâncias que marcam presença"
        description="Seleção de perfumes importados com alta fixação e notas exclusivas, direto para você sentir a diferença desde o primeiro borrifo."
        href="/categoria/perfumes"
        hrefLabel="Ver perfumes"
        image="https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1200&q=80"
      />

      {novidades.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container-mf mb-2 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-brand-text md:text-3xl">
                Novidades
              </h2>
              <p className="mt-1.5 text-sm text-brand-muted">Acabou de chegar na MF Imports</p>
            </div>
            <Link
              href="/produtos"
              className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-primary hover:text-brand-primary-dark sm:inline-flex"
            >
              Ver todos
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
          <ProductCoverflow products={novidades} />
        </section>
      )}

      {promo.length > 0 && (
        <ProductSection
          title="Ofertas da semana"
          subtitle="Aproveite enquanto durar o estoque"
          products={promo}
          href="/produtos"
        />
      )}

      <TrustBadges />

      <EditorialBanner
        eyebrow="Tecnologia com procedência"
        title="Celulares e fones com garantia real"
        description="Trabalhamos com fornecedores selecionados para garantir autenticidade, suporte e a melhor experiência em cada compra."
        href="/categoria/celulares"
        hrefLabel="Ver eletrônicos"
        image="https://images.unsplash.com/photo-1580910051074-3eb694886505?w=1200&q=80"
        reverse
      />

      <WhatsappCta />
    </SiteChrome>
  );
}
