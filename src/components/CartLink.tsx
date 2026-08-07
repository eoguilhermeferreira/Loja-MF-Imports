"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/CartProvider";

export function CartLink({ dark = false }: { dark?: boolean }) {
  const { totalItems, isHydrated } = useCart();

  return (
    <Link
      href="/carrinho"
      aria-label="Ver carrinho"
      className={`relative inline-flex items-center justify-center rounded-full p-2 transition-colors ${
        dark ? "text-brand-white hover:bg-white/10" : "text-brand-black hover:bg-brand-tint"
      }`}
    >
      <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
      {isHydrated && totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-primary px-1 text-[10px] font-bold leading-none text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}
