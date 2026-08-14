"use client";

import { useRef, useState, useTransition } from "react";
import { updateCategoryImageAction, clearCategoryImageAction } from "@/app/admin/actions";
import { ImageDropzone } from "@/components/admin/ImageDropzone";

export function CategoryImageUpload({
  categoryId,
  currentImageUrl,
}: {
  categoryId: string;
  currentImageUrl: string | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState(currentImageUrl);
  const [, startTransition] = useTransition();

  return (
    <form ref={formRef} action={updateCategoryImageAction} className="flex items-center gap-4">
      <input type="hidden" name="id" value={categoryId} />
      <div className="w-28">
        <ImageDropzone
          name="image"
          preview={preview}
          hint="Ideal: 800 x 800px"
          onFiles={(files) => {
            const file = files[0];
            if (!file) return;
            setPreview(URL.createObjectURL(file));
            formRef.current?.requestSubmit();
          }}
          onRemove={() => {
            setPreview(null);
            startTransition(() => {
              clearCategoryImageAction(categoryId);
            });
          }}
        />
      </div>
    </form>
  );
}
