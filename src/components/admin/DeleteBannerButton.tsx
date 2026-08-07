"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteBannerAction } from "@/app/admin/actions";

export function DeleteBannerButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Excluir este banner?")) return;
    const formData = new FormData();
    formData.set("id", id);
    startTransition(() => {
      deleteBannerAction(formData);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      aria-label="Excluir banner"
      className="text-brand-muted hover:text-red-500 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" strokeWidth={1.75} />
    </button>
  );
}
