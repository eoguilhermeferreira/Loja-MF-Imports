"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { updateCategoryImageAction } from "@/app/admin/actions";

export function CategoryImageUpload({
  categoryId,
  currentImageUrl,
}: {
  categoryId: string;
  currentImageUrl: string | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState(currentImageUrl);

  return (
    <form
      ref={formRef}
      action={updateCategoryImageAction}
      className="flex items-center gap-4"
    >
      <input type="hidden" name="id" value={categoryId} />
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-brand-tint">
        {preview && <Image src={preview} alt="" fill sizes="64px" className="object-cover" />}
      </div>
      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-brand-border px-4 py-2 text-xs font-semibold text-brand-text hover:border-brand-primary">
        <Upload className="h-3.5 w-3.5" strokeWidth={2} />
        Trocar foto
        <input
          type="file"
          name="image"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setPreview(URL.createObjectURL(file));
              formRef.current?.requestSubmit();
            }
          }}
        />
      </label>
    </form>
  );
}
