import { getCategories } from "@/lib/queries";
import { CategoryImageUpload } from "@/components/admin/CategoryImageUpload";

export default async function AdminCategoriasPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold text-brand-text">Categorias</h1>
      <p className="text-sm text-brand-muted">
        Categorias são fixas no catálogo. Aqui você só pode atualizar a foto de capa de cada uma.
      </p>

      <div className="flex flex-col gap-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between rounded-2xl border border-brand-border bg-white p-4"
          >
            <span className="font-medium text-brand-text">{cat.name}</span>
            <CategoryImageUpload categoryId={cat.id} currentImageUrl={cat.image_url} />
          </div>
        ))}
      </div>
    </div>
  );
}
