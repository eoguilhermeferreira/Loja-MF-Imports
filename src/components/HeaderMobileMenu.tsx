"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { SearchBar } from "@/components/SearchBar";
import { Logo } from "@/components/Logo";
import { STORE_INFO } from "@/config/store";
import type { Category } from "@/lib/queries";

export function HeaderMobileMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-label="Abrir menu"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-full p-2 text-brand-black hover:bg-brand-tint lg:hidden"
      >
        <Menu className="h-6 w-6" strokeWidth={1.75} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-brand-border px-5 py-4">
              <Logo />
              <button
                aria-label="Fechar menu"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 hover:bg-brand-tint"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="px-5 py-4">
              <SearchBar />
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-2">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-muted">
                Categorias
              </p>
              <ul className="flex flex-col">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/categoria/${cat.slug}`}
                      onClick={() => setOpen(false)}
                      className="block border-b border-brand-border/70 py-3 text-[15px] font-medium text-brand-text hover:text-brand-primary"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-col gap-3 border-t border-brand-border px-5 py-5">
              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-brand-text"
              >
                <MessageCircle className="h-4 w-4 text-brand-primary" strokeWidth={1.75} />
                {STORE_INFO.whatsapp}
              </a>
              <a
                href={STORE_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-brand-text"
              >
                <InstagramIcon className="h-4 w-4 text-brand-primary" />
                {STORE_INFO.instagram}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
