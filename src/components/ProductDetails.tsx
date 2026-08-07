"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { formatPrice, discountPercent } from "@/lib/format";
import { useCart } from "@/components/CartProvider";
import type { ProductWithRelations } from "@/lib/queries";

export function ProductDetails({ product }: { product: ProductWithRelations }) {
  const { addItem } = useCart();
  const router = useRouter();

  const groups = useMemo(() => {
    const map = new Map<string, typeof product.variations>();
    for (const v of product.variations) {
      const list = map.get(v.label) ?? [];
      list.push(v);
      map.set(v.label, list);
    }
    return Array.from(map.entries());
  }, [product.variations]);

  const [selected, setSelected] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const allSelected = groups.every(([label]) => selected[label]);
  const selectedVariation =
    groups.length === 1
      ? product.variations.find(
          (v) => v.label === groups[0][0] && v.value === selected[groups[0][0]]
        )
      : null;

  const stock = groups.length > 0 ? selectedVariation?.stock ?? 0 : product.stock;
  const hasPromo = product.promo_price != null && product.promo_price < product.price;
  const price = hasPromo ? product.promo_price! : product.price;
  const canAdd = groups.length === 0 || (allSelected && stock > 0);

  function handleAddToCart() {
    if (!canAdd) return;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0]?.url ?? null,
        price,
        variationLabel: groups[0]?.[0] ?? null,
        variationValue: groups[0] ? selected[groups[0][0]] : null,
      },
      quantity
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  function handleBuyNow() {
    handleAddToCart();
    router.push("/carrinho");
  }

  return (
    <div className="flex flex-col">
      {product.brand && (
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
          {product.brand}
        </span>
      )}
      <h1 className="mt-1 font-display text-2xl font-semibold text-brand-text sm:text-3xl">
        {product.name}
      </h1>
      <p className="mt-1 text-xs text-brand-muted">Cód. {product.code}</p>

      <div className="mt-4 flex items-baseline gap-3">
        {hasPromo ? (
          <>
            <span className="font-display text-3xl font-semibold text-brand-primary-dark">
              {formatPrice(product.promo_price!)}
            </span>
            <span className="text-base text-brand-muted line-through">
              {formatPrice(product.price)}
            </span>
            <span className="rounded-full bg-brand-black px-2.5 py-1 text-xs font-semibold text-white">
              -{discountPercent(product.price, product.promo_price!)}%
            </span>
          </>
        ) : (
          <span className="font-display text-3xl font-semibold text-brand-text">
            {formatPrice(product.price)}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-brand-muted">
        ou 12x de {formatPrice(price / 12)} sem juros
      </p>

      {product.description && (
        <p className="mt-6 text-sm leading-relaxed text-brand-text/80">{product.description}</p>
      )}

      {groups.map(([label, options]) => (
        <div key={label} className="mt-6">
          <p className="mb-2.5 text-sm font-semibold text-brand-text">{label}</p>
          <div className="flex flex-wrap gap-2">
            {options.map((opt) => {
              const isSelected = selected[label] === opt.value;
              const outOfStock = opt.stock <= 0;
              return (
                <button
                  key={opt.id}
                  disabled={outOfStock}
                  onClick={() => setSelected((s) => ({ ...s, [label]: opt.value }))}
                  className={`min-w-11 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors ${
                    outOfStock
                      ? "cursor-not-allowed border-brand-border text-brand-muted/50 line-through"
                      : isSelected
                        ? "border-brand-primary bg-brand-primary text-white"
                        : "border-brand-border text-brand-text hover:border-brand-primary"
                  }`}
                >
                  {opt.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-7 flex items-center gap-4">
        <div className="flex items-center rounded-xl border border-brand-border">
          <button
            aria-label="Diminuir quantidade"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-3 text-brand-text hover:text-brand-primary"
          >
            <Minus className="h-4 w-4" strokeWidth={2} />
          </button>
          <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
          <button
            aria-label="Aumentar quantidade"
            onClick={() => setQuantity((q) => Math.min(stock || 99, q + 1))}
            className="p-3 text-brand-text hover:text-brand-primary"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
        <p className="text-xs text-brand-muted">
          {groups.length > 0 && !allSelected
            ? "Selecione uma opção"
            : stock > 0
              ? `${stock} em estoque`
              : "Sem estoque"}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleAddToCart}
          disabled={!canAdd}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-brand-black px-6 py-3.5 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-black hover:text-white disabled:cursor-not-allowed disabled:border-brand-border disabled:text-brand-muted disabled:hover:bg-transparent"
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4" strokeWidth={2.5} /> Adicionado
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" strokeWidth={2} /> Adicionar ao carrinho
            </>
          )}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!canAdd}
          className="flex-1 rounded-full bg-brand-primary px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:bg-brand-border"
        >
          Comprar agora
        </button>
      </div>
    </div>
  );
}
