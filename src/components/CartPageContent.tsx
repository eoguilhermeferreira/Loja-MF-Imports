"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";

export function CartPageContent() {
  const { items, updateQuantity, removeItem, subtotal, isHydrated } = useCart();

  if (isHydrated && items.length === 0) {
    return (
      <div className="container-mf flex flex-col items-center gap-4 py-24 text-center">
        <ShoppingBag className="h-12 w-12 text-brand-muted" strokeWidth={1.2} />
        <h1 className="font-display text-2xl font-semibold text-brand-text">
          Seu carrinho está vazio
        </h1>
        <p className="max-w-sm text-sm text-brand-muted">
          Explore nosso catálogo e encontre perfumes, tênis, celulares e muito mais.
        </p>
        <Link
          href="/produtos"
          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white hover:bg-brand-primary-dark"
        >
          Ver produtos
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-mf py-10 md:py-14">
      <h1 className="font-display text-2xl font-semibold text-brand-text md:text-3xl">
        Meu carrinho
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="flex flex-col divide-y divide-brand-border lg:col-span-2">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variationValue ?? ""}`}
              className="flex gap-4 py-5 first:pt-0"
            >
              <Link
                href={`/produto/${item.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-tint"
              >
                {item.image && (
                  <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                )}
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={`/produto/${item.slug}`}
                    className="text-sm font-medium text-brand-text hover:text-brand-primary"
                  >
                    {item.name}
                  </Link>
                  {item.variationLabel && (
                    <p className="mt-0.5 text-xs text-brand-muted">
                      {item.variationLabel}: {item.variationValue}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-brand-border">
                    <button
                      aria-label="Diminuir quantidade"
                      onClick={() =>
                        updateQuantity(item.productId, item.variationValue, item.quantity - 1)
                      }
                      className="p-2 text-brand-text hover:text-brand-primary"
                    >
                      <Minus className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      aria-label="Aumentar quantidade"
                      onClick={() =>
                        updateQuantity(item.productId, item.variationValue, item.quantity + 1)
                      }
                      className="p-2 text-brand-text hover:text-brand-primary"
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-base font-semibold text-brand-text">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      aria-label="Remover item"
                      onClick={() => removeItem(item.productId, item.variationValue)}
                      className="text-brand-muted hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-brand-border p-6">
          <h2 className="font-display text-lg font-semibold text-brand-text">Resumo</h2>
          <div className="mt-4 flex justify-between text-sm text-brand-text/80">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-1.5 text-xs text-brand-muted">
            Frete calculado na próxima etapa
          </p>
          <Link
            href="/checkout"
            className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-full bg-brand-primary px-6 py-3.5 text-sm font-semibold text-white hover:bg-brand-primary-dark"
          >
            Finalizar compra
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  );
}
