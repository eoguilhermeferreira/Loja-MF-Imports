import type { MetadataRoute } from "next";
import { getAllActiveProducts, getCategories } from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [products, categories] = await Promise.all([getAllActiveProducts(), getCategories()]);

  return [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/produtos`, changeFrequency: "daily", priority: 0.9 },
    ...categories.map((c) => ({
      url: `${siteUrl}/categoria/${c.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...products.map((p) => ({
      url: `${siteUrl}/produto/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
