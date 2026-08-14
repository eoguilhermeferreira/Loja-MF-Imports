"use client";

import { useState } from "react";
import { saveBannerAction } from "@/app/admin/actions";
import { ImageDropzone } from "@/components/admin/ImageDropzone";
import type { Banner } from "@/lib/queries";

export function BannerForm({ banner }: { banner?: Banner }) {
  const [preview, setPreview] = useState<string | null>(banner?.image_url ?? null);
  const [existingUrl, setExistingUrl] = useState<string | null>(banner?.image_url ?? null);

  return (
    <form action={saveBannerAction} className="flex flex-col gap-6">
      {banner && <input type="hidden" name="id" value={banner.id} />}
      <input type="hidden" name="existing_image_url" value={existingUrl ?? ""} />

      <section className="grid grid-cols-1 gap-4 rounded-2xl border border-brand-border bg-white p-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-brand-text">Título</label>
          <input name="title" required defaultValue={banner?.title} className="input-mf w-full" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-brand-text">Descrição</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={banner?.description ?? ""}
            className="input-mf w-full"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-text">
            Texto do botão
          </label>
          <input
            name="button_label"
            defaultValue={banner?.button_label ?? ""}
            className="input-mf w-full"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-text">
            Link do botão
          </label>
          <input
            name="button_link"
            placeholder="/categoria/perfumes"
            defaultValue={banner?.button_link ?? ""}
            className="input-mf w-full"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-text">Ordem</label>
          <input
            name="display_order"
            type="number"
            defaultValue={banner?.display_order ?? 0}
            className="input-mf w-full"
          />
        </div>
        <label className="flex items-center gap-2 self-end text-sm font-medium text-brand-text">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={banner?.is_active ?? true}
            className="accent-[var(--color-brand-primary)]"
          />
          Ativo
        </label>
      </section>

      <section className="rounded-2xl border border-brand-border bg-white p-5">
        <h2 className="mb-3 font-display text-lg font-semibold text-brand-text">Imagem</h2>
        <div className="max-w-xs">
          <ImageDropzone
            name="image"
            preview={preview}
            onFiles={(files) => {
              const file = files[0];
              if (!file) return;
              setPreview(URL.createObjectURL(file));
            }}
            onRemove={() => {
              setPreview(null);
              setExistingUrl(null);
            }}
          />
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-full bg-brand-primary px-8 py-3 text-sm font-semibold text-white hover:bg-brand-primary-dark"
        >
          Salvar banner
        </button>
      </div>
    </form>
  );
}
