"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";
import { SearchBar } from "@/components/SearchBar";
import { Logo } from "@/components/Logo";
import { STORE_INFO } from "@/config/store";
import type { CategoryWithChildren } from "@/lib/queries";

export function HeaderMobileMenu({ categories }: { categories: CategoryWithChildren[] }) {
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="block border-b border-brand-border/70 py-3 text-[15px] font-semibold text-brand-text hover:text-brand-primary"
              >
                Início
              </Link>

              <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-muted">
                Categorias
              </p>
              <ul className="flex flex-col">
                {categories.map((cat) => {
                  const hasChildren = cat.children.length > 0;
                  const isExpanded = expandedId === cat.id;
                  return (
                    <li key={cat.id} className="border-b border-brand-border/70">
                      {hasChildren ? (
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : cat.id)}
                          className="flex w-full items-center justify-between py-3 text-[15px] font-medium text-brand-text hover:text-brand-primary"
                        >
                          {cat.name}
                          <ChevronDown
                            className={`h-4 w-4 text-brand-muted transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            strokeWidth={1.75}
                          />
                        </button>
                      ) : (
                        <Link
                          href={`/categoria/${cat.slug}`}
                          onClick={() => setOpen(false)}
                          className="block py-3 text-[15px] font-medium text-brand-text hover:text-brand-primary"
                        >
                          {cat.name}
                        </Link>
                      )}

                      {hasChildren && isExpanded && (
                        <ul className="flex flex-col pb-2 pl-4">
                          {cat.children.map((child) => (
                            <li key={child.id}>
                              <Link
                                href={`/categoria/${cat.slug}`}
                                onClick={() => setOpen(false)}
                                className="block py-2 text-sm text-brand-muted hover:text-brand-primary"
                              >
                                {child.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex flex-col gap-3 border-t border-brand-border px-5 py-5">
              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-brand-text"
              >
                <WhatsappIcon className="h-4 w-4 text-brand-primary" />
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
