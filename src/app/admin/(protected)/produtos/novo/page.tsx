import { getCategories } from "@/lib/queries";
import { ProductForm } from "@/components/admin/ProductForm";
import { BackButton } from "@/components/BackButton";

export default async function NovoProdutoPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-6">
      <BackButton label="Voltar" />
      <h1 className="font-display text-2xl font-semibold text-brand-text">Novo produto</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
