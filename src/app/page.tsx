import { SiteChrome } from "@/components/SiteChrome";
import { BannerCarousel } from "@/components/BannerCarousel";
import { CategoryNav } from "@/components/CategoryNav";
import { ProductSection } from "@/components/ProductSection";
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

      {promo.length > 0 && (
        <ProductSection
          title="Ofertas da semana"
          subtitle="Aproveite enquanto durar o estoque"
          products={promo}
          href="/produtos"
        />
      )}

      <ProductSection
        title="Novidades"
        subtitle="Acabou de chegar na MF Imports"
        products={novidades}
        href="/produtos"
      />

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
