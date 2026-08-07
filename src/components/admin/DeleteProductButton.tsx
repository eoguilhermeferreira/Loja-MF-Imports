"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteProductAction } from "@/app/admin/actions";

export function DeleteProductButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Excluir este produto? Essa ação não pode ser desfeita.")) return;
    const formData = new FormData();
    formData.set("id", id);
    startTransition(() => {
      deleteProductAction(formData);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      aria-label="Excluir produto"
      className="text-brand-muted hover:text-red-500 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" strokeWidth={1.75} />
    </button>
  );
}
