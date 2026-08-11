import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

export type Category = Tables<"categories">;
export type CategoryWithChildren = Category & { children: Category[] };
export type Banner = Tables<"banners">;
export type ProductVariation = Tables<"product_variations">;
export type ProductImage = Tables<"product_images">;

export type ProductWithRelations = Tables<"products"> & {
  category: Category | null;
  images: ProductImage[];
  variations: ProductVariation[];
};

const PRODUCT_SELECT = `*, category:categories(*), images:product_images(*), variations:product_variations(*)`;

export async function getCategories(): Promise<CategoryWithChildren[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });
  const all = (data ?? []) as Category[];
  const topLevel = all.filter((c) => !c.parent_id);
  return topLevel.map((c) => ({
    ...c,
    children: all.filter((child) => child.parent_id === c.id),
  }));
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

export async function getCategoryChildren(parentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("parent_id", parentId)
    .order("display_order", { ascending: true });
  return (data ?? []) as Category[];
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

async function getProductsByHomeSection(section: "mais_vendidos" | "novidades" | "ofertas", limit: number) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("home_section", section)
    .order("created_at", { ascending: false })
    .limit(limit);
  return withImagesOrdered((data ?? []) as unknown as ProductWithRelations[]);
}

export async function getFeaturedProducts(limit = 8) {
  return getProductsByHomeSection("mais_vendidos", limit);
}

export async function getNewProducts(limit = 8) {
  return getProductsByHomeSection("novidades", limit);
}

export async function getPromoProducts(limit = 8) {
  return getProductsByHomeSection("ofertas", limit);
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

export async function getProductsByCategoryId(categoryId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("category_id", categoryId)
    .order("created_at", { ascending: false });

  return withImagesOrdered((data ?? []) as unknown as ProductWithRelations[]);
}

export async function getProductsByCategorySlug(slug: string) {
  const category = await getCategoryBySlug(slug);
  if (!category) return [];
  return getProductsByCategoryId(category.id);
}

export type CategorySection = { category: Category; products: ProductWithRelations[] };

export async function getCategoryPageData(slug: string) {
  const category = await getCategoryBySlug(slug);
  if (!category) return null;

  const children = category.parent_id ? [] : await getCategoryChildren(category.id);

  if (children.length > 0) {
    const sections: CategorySection[] = await Promise.all(
      children.map(async (child) => ({
        category: child,
        products: await getProductsByCategoryId(child.id),
      }))
    );
    return { category, sections, products: null as ProductWithRelations[] | null };
  }

  const products = await getProductsByCategoryId(category.id);
  return { category, sections: null as CategorySection[] | null, products };
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
