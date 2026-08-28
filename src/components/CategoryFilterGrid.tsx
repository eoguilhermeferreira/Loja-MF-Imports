"use client";

import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/ProductGrid";
import type { CategorySection } from "@/lib/queries";

export function CategoryFilterGrid({ sections }: { sections: CategorySection[] }) {
  const [activeId, setActiveId] = useState<string | "all">("all");

  const allProducts = useMemo(() => sections.flatMap((s) => s.products), [sections]);
  const activeProducts =
    activeId === "all"
      ? allProducts
      : sections.find((s) => s.category.id === activeId)?.products ?? [];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveId("all")}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            activeId === "all"
              ? "border-brand-primary bg-brand-primary text-white"
              : "border-brand-border text-brand-text hover:border-brand-primary"
          }`}
        >
          Todos
        </button>
        {sections.map((section) => (
          <button
            key={section.category.id}
            type="button"
            onClick={() => setActiveId(section.category.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeId === section.category.id
                ? "border-brand-primary bg-brand-primary text-white"
                : "border-brand-border text-brand-text hover:border-brand-primary"
            }`}
          >
            {section.category.name}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <ProductGrid products={activeProducts} />
      </div>
    </div>
  );
}
