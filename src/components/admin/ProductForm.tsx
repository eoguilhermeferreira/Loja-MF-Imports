"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { saveProductAction } from "@/app/admin/actions";
import type { Category, ProductWithRelations } from "@/lib/queries";

type VariationRow = { label: string; value: string; stock: number };

export function ProductForm({
  product,
  categories,
}: {
  product?: ProductWithRelations;
  categories: Category[];
}) {
  const [existingImages, setExistingImages] = useState(product?.images ?? []);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [variations, setVariations] = useState<VariationRow[]>(
    product?.variations.map((v) => ({ label: v.label, value: v.value, stock: v.stock })) ?? []
  );

  function removeExistingImage(id: string) {
    setExistingImages((imgs) => imgs.filter((i) => i.id !== id));
    setRemovedIds((ids) => [...ids, id]);
  }

  function handleNewImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setNewImagePreviews(files.map((f) => URL.createObjectURL(f)));
  }

  function addVariation() {
    setVariations((v) => [...v, { label: "", value: "", stock: 0 }]);
  }

  function updateVariation(index: number, field: keyof VariationRow, value: string) {
    setVariations((v) =>
      v.map((row, i) =>
        i === index ? { ...row, [field]: field === "stock" ? Number(value) : value } : row
      )
    );
  }

  function removeVariation(index: number) {
    setVariations((v) => v.filter((_, i) => i !== index));
  }

  return (
    <form action={saveProductAction} className="flex flex-col gap-8">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="removed_image_ids" value={removedIds.join(",")} />

      <section className="grid grid-cols-1 gap-4 rounded-2xl border border-brand-border bg-white p-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-brand-text">Nome</label>
          <input
            name="name"
            required
            defaultValue={product?.name}
            className="input-mf w-full"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-brand-text">Descrição</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={product?.description ?? ""}
            className="input-mf w-full"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-text">Categoria</label>
          <select
            name="category_id"
            defaultValue={product?.category_id ?? ""}
            className="input-mf w-full"
          >
            <option value="">Sem categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-text">Marca</label>
          <input name="brand" defaultValue={product?.brand ?? ""} className="input-mf w-full" />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 rounded-2xl border border-brand-border bg-white p-5 sm:grid-cols-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-text">Preço (R$)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product?.price}
            className="input-mf w-full"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-text">Preço promo.</label>
          <input
            name="promo_price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.promo_price ?? ""}
            className="input-mf w-full"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-text">
            Estoque geral
          </label>
          <input
            name="stock"
            type="number"
            min="0"
            defaultValue={product?.stock ?? 0}
            className="input-mf w-full"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-text">Peso (g)</label>
          <input
            name="weight_grams"
            type="number"
            min="0"
            defaultValue={product?.weight_grams ?? 300}
            className="input-mf w-full"
          />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-brand-text">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={product?.is_active ?? true}
            className="accent-[var(--color-brand-primary)]"
          />
          Ativo na loja
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-brand-text">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={product?.is_featured ?? false}
            className="accent-[var(--color-brand-primary)]"
          />
          Destaque (mais vendidos)
        </label>
      </section>

      <section className="rounded-2xl border border-brand-border bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-brand-text">
            Variações (opcional)
          </h2>
          <button
            type="button"
            onClick={addVariation}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-primary hover:text-brand-primary-dark"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Adicionar
          </button>
        </div>
        <p className="mb-4 text-xs text-brand-muted">
          Ex: Numeração/40, Volume/100ml, Armazenamento/128GB, Cor/Preto. Deixe vazio se o
          produto não tiver variações.
        </p>
        <div className="flex flex-col gap-3">
          {variations.map((row, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <input
                placeholder="Rótulo (ex: Numeração)"
                value={row.label}
                onChange={(e) => updateVariation(i, "label", e.target.value)}
                name="variation_label"
                className="input-mf flex-1 min-w-[140px]"
              />
              <input
                placeholder="Valor (ex: 40)"
                value={row.value}
                onChange={(e) => updateVariation(i, "value", e.target.value)}
                name="variation_value"
                className="input-mf flex-1 min-w-[100px]"
              />
              <input
                placeholder="Estoque"
                type="number"
                min="0"
                value={row.stock}
                onChange={(e) => updateVariation(i, "stock", e.target.value)}
                name="variation_stock"
                className="input-mf w-24"
              />
              <button
                type="button"
                onClick={() => removeVariation(i)}
                className="text-brand-muted hover:text-red-500"
                aria-label="Remover variação"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-brand-border bg-white p-5">
        <h2 className="mb-3 font-display text-lg font-semibold text-brand-text">Imagens</h2>
        <div className="flex flex-wrap gap-3">
          {existingImages.map((img) => (
            <div key={img.id} className="relative h-24 w-24 overflow-hidden rounded-xl bg-brand-tint">
              <Image src={img.url} alt="" fill sizes="96px" className="object-cover" />
              <button
                type="button"
                onClick={() => removeExistingImage(img.id)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
                aria-label="Remover imagem"
              >
                <X className="h-3 w-3" strokeWidth={2.5} />
              </button>
            </div>
          ))}
          {newImagePreviews.map((src, i) => (
            <div key={i} className="relative h-24 w-24 overflow-hidden rounded-xl bg-brand-tint">
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </div>
          ))}
        </div>
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleNewImages}
          className="mt-4 text-sm text-brand-text"
        />
      </section>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="rounded-full bg-brand-primary px-8 py-3 text-sm font-semibold text-white hover:bg-brand-primary-dark"
        >
          Salvar produto
        </button>
      </div>
    </form>
  );
}
