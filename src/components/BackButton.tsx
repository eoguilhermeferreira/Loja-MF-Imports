"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton({ label = "Voltar" }: { label?: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-muted hover:text-brand-primary"
    >
      <ArrowLeft className="h-4 w-4" strokeWidth={2} />
      {label}
    </button>
  );
}
