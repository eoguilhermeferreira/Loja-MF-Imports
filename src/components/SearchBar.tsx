"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

export function SearchBar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/produtos?q=${encodeURIComponent(q)}` : "/produtos");
  }

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar perfumes, tênis, celulares..."
        className="w-full rounded-full border border-brand-border bg-brand-tint py-2.5 pl-11 pr-4 text-base text-brand-text placeholder:text-brand-muted focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-colors sm:text-sm"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted"
      >
        <Search className="h-4 w-4" strokeWidth={2} />
      </button>
    </form>
  );
}
