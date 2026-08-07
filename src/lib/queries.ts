import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

export type Category = Tables<"categories">;
export type Banner = Tables<"banners">;
export type ProductVariation = Tables<"product_variations">;
export type ProductImage = Tables<"product_images">;

export type ProductWithRelations = Tables<"products"> & {
  category: Category | null;
  images: ProductImage[];
  variations: ProductVariation[];
};

const PRODUCT_SELECT = `*, category:categories(*), images:product_images(*), variations:product_variations(*)`;

export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });
  return (data ?? []) as Category[];
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data as Category | null;
}

export async function getActiveBanners() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  return (data ?? []) as Banner[];
}

async function withImagesOrdered(products: ProductWithRelations[]) {
  return products.map((p) => ({
    ...p,
    images: [...p.images].sort((a, b) => a.display_order - b.display_order),
  }));
}

export async function getFeaturedProducts(limit = 8) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("is_featured", true)
    .limit(limit);
  return withImagesOrdered((data ?? []) as unknown as ProductWithRelations[]);
}

export async function getNewProducts(limit = 8) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return withImagesOrdered((data ?? []) as unknown as ProductWithRelations[]);
}

export async function getPromoProducts(limit = 8) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .not("promo_price", "is", null)
    .limit(limit);
  return withImagesOrdered((data ?? []) as unknown as ProductWithRelations[]);
}

export async function getAllActiveProducts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return withImagesOrdered((data ?? []) as unknown as ProductWithRelations[]);
}

export async function getProductsByCategorySlug(slug: string) {
  const category = await getCategoryBySlug(slug);
  if (!category) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("category_id", category.id)
    .order("created_at", { ascending: false });

  return withImagesOrdered((data ?? []) as unknown as ProductWithRelations[]);
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (!data) return null;
  const product = data as unknown as ProductWithRelations;
  product.images = [...product.images].sort(
    (a, b) => a.display_order - b.display_order
  );
  return product;
}

export async function getRelatedProducts(categoryId: string | null, excludeId: string, limit = 4) {
  if (!categoryId) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("category_id", categoryId)
    .neq("id", excludeId)
    .limit(limit);
  return withImagesOrdered((data ?? []) as unknown as ProductWithRelations[]);
}

export async function searchProducts(query: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .ilike("name", `%${query}%`)
    .limit(20);
  return withImagesOrdered((data ?? []) as unknown as ProductWithRelations[]);
}
