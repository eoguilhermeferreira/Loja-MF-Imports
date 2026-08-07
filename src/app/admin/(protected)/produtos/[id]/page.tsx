import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/queries";
import { ProductForm } from "@/components/admin/ProductForm";
import { BackButton } from "@/components/BackButton";
import type { ProductWithRelations } from "@/lib/queries";

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, categories] = await Promise.all([
    supabase
      .from("products")
      .select("*, category:categories(*), images:product_images(*), variations:product_variations(*)")
      .eq("id", id)
      .maybeSingle(),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="flex flex-col gap-6">
      <BackButton label="Voltar" />
      <h1 className="font-display text-2xl font-semibold text-brand-text">Editar produto</h1>
      <ProductForm
        product={product as unknown as ProductWithRelations}
        categories={categories}
      />
    </div>
  );
}
