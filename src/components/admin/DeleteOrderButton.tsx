"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteOrderAction } from "@/app/admin/actions";

export function DeleteOrderButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Excluir este pedido? Essa ação não pode ser desfeita.")) return;
    const formData = new FormData();
    formData.set("id", id);
    startTransition(() => {
      deleteOrderAction(formData);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      aria-label="Excluir pedido"
      className="text-brand-muted hover:text-red-500 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" strokeWidth={1.75} />
    </button>
  );
}
