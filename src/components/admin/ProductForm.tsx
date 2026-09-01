"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { saveProductAction } from "@/app/admin/actions";
import { ImageDropzone } from "@/components/admin/ImageDropzone";
import type { CategoryWithChildren, ProductWithRelations } from "@/lib/queries";

type VariationOption = { value: string; stock: number };

const HOME_SECTIONS = [
  { value: "", label: "Nenhum (não aparece na tela inicial)" },
  { value: "mais_vendidos", label: "Mais vendidos" },
  { value: "novidades", label: "Novidades" },
  { value: "ofertas", label: "Ofertas da semana" },
] as const;

export function ProductForm({
  product,
  categories,
}: {
  product?: ProductWithRelations;
  categories: CategoryWithChildren[];
}) {
  const [existingImages, setExistingImages] = useState(product?.images ?? []);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [variationLabel, setVariationLabel] = useState(product?.variations[0]?.label ?? "");
  const [variationOptions, setVariationOptions] = useState<VariationOption[]>(
    product?.variations.map((v) => ({ value: v.value, stock: v.stock })) ?? []
  );

  function removeExistingImage(id: string) {
    setExistingImages((imgs) => imgs.filter((i) => i.id !== id));
    setRemovedIds((ids) => [...ids, id]);
  }

  function handleNewImages(files: File[]) {
    setNewImagePreviews(files.map((f) => URL.createObjectURL(f)));
  }

  function addVariationOption() {
    setVariationOptions((v) => [...v, { value: "", stock: 0 }]);
  }

  function updateVariationOption(index: number, field: keyof VariationOption, value: string) {
    setVariationOptions((v) =>
      v.map((row, i) =>
        i === index ? { ...row, [field]: field === "stock" ? Number(value) : value } : row
      )
    );
  }

  function removeVariationOption(index: number) {
    setVariationOptions((v) => v.filter((_, i) => i !== index));
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
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-brand-text">Categoria</label>
          <select
            name="category_id"
            defaultValue={product?.category_id ?? ""}
            className="input-mf w-full"
          >
            <option value="">Sem categoria</option>
            {categories.map((cat) =>
              cat.children.length > 0 ? (
                <optgroup key={cat.id} label={cat.name}>
                  {cat.children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </optgroup>
              ) : (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              )
            )}
          </select>
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
        <div className="col-span-2 sm:col-span-4">
          <label className="mb-1.5 block text-sm font-medium text-brand-text">
            Aparece na tela inicial em
          </label>
          <select
            name="home_section"
            defaultValue={product?.home_section ?? ""}
            className="input-mf w-full sm:w-64"
          >
            {HOME_SECTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="rounded-2xl border border-brand-border bg-white p-5">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-brand-text">
            Variações (opcional)
          </h2>
          <button
            type="button"
            onClick={addVariationOption}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-primary hover:text-brand-primary-dark"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Adicionar {variationLabel.trim() ? variationLabel.trim().toLowerCase() : "opção"}
          </button>
        </div>
        <p className="mb-4 text-xs text-brand-muted">
          Use quando o cliente precisa escolher entre cor, tamanho, numeração etc. O{" "}
          <b>preço fica só lá em cima</b> — aqui embaixo é só o nome de cada opção e o estoque
          dela.
        </p>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-brand-text">
            Que tipo de opção é? (ex: Cor, Tamanho, Numeração)
          </label>
          <input
            placeholder="Ex: Cor"
            value={variationLabel}
            onChange={(e) => setVariationLabel(e.target.value)}
            className="input-mf w-full sm:w-72"
          />
          <p className="mt-1 text-xs text-brand-muted">
            Um produto só tem um tipo de opção por vez (ex: só Cor, ou só Tamanho — não os dois
            juntos).
          </p>
        </div>

        {variationOptions.length > 0 && (
          <div className="mb-1.5 flex gap-2 px-0.5 text-xs font-semibold text-brand-muted">
            <span className="flex-1 min-w-[140px]">
              {variationLabel.trim() || "Nome da opção"} (não é o preço)
            </span>
            <span className="w-36">Estoque dessa opção</span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {variationOptions.map((row, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <input type="hidden" name="variation_label" value={variationLabel} />
              <input
                placeholder={
                  variationLabel.trim() ? `Ex: ${variationLabel.trim() === "Cor" ? "Preto" : "40"}` : "Ex: Preto"
                }
                value={row.value}
                onChange={(e) => updateVariationOption(i, "value", e.target.value)}
                name="variation_value"
                className="input-mf flex-1 min-w-[140px]"
              />
              <input
                placeholder="Estoque"
                type="number"
                min="0"
                value={row.stock}
                onChange={(e) => updateVariationOption(i, "stock", e.target.value)}
                name="variation_stock"
                className="input-mf w-36"
              />
              <button
                type="button"
                onClick={() => removeVariationOption(i)}
                className="text-brand-muted hover:text-red-500"
                aria-label="Remover opção"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          ))}
          {variationOptions.length === 0 && (
            <p className="text-xs text-brand-muted">
              Nenhuma opção adicionada. Clique em &quot;Adicionar&quot; acima se este produto tiver
              cor, tamanho ou outra escolha.
            </p>
          )}
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
          <div className="h-24 w-24">
            <ImageDropzone name="images" multiple onFiles={handleNewImages} />
          </div>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-brand-muted">
          Ideal: 1200 x 1200px (imagem quadrada). A primeira foto é a capa do produto.
        </p>
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
