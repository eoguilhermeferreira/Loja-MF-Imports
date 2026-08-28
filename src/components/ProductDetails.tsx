"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Check, X } from "lucide-react";
import { formatPrice, discountPercent } from "@/lib/format";
import { useCart } from "@/components/CartProvider";
import type { ProductWithRelations } from "@/lib/queries";

type PendingAction = "cart" | "buy" | null;

export function ProductDetails({ product }: { product: ProductWithRelations }) {
  const { addItem } = useCart();
  const router = useRouter();

  // O produto só suporta uma dimensão de variação por vez (ex: só Cor, ou só
  // Tamanho). Se o cadastro tiver rótulos diferentes por engano, usamos
  // apenas o primeiro grupo em vez de exigir uma seleção "impossível" de
  // vários grupos ao mesmo tempo.
  const variationGroup = useMemo(() => {
    if (product.variations.length === 0) return null;
    const label = product.variations[0].label;
    return [label, product.variations.filter((v) => v.label === label)] as const;
  }, [product.variations]);

  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const hasVariations = !!variationGroup;
  const allSelected = !hasVariations || selectedValue != null;
  const selectedVariation =
    variationGroup && selectedValue
      ? variationGroup[1].find((v) => v.value === selectedValue)
      : null;

  const stock = hasVariations ? (selectedVariation ? selectedVariation.stock : product.stock) : product.stock;
  const hasPromo = product.promo_price != null && product.promo_price < product.price;
  const price = hasPromo ? product.promo_price! : product.price;
  const canAdd =
    product.is_active &&
    (!hasVariations || (!!selectedVariation && selectedVariation.stock > 0));

  function pickValue(value: string) {
    setSelectedValue((current) => (current === value ? null : value));
  }

  function doAddToCart() {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0]?.url ?? null,
        price,
        variationLabel: variationGroup?.[0] ?? null,
        variationValue: selectedValue,
      },
      quantity
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  function doBuyNow() {
    doAddToCart();
    router.push("/carrinho");
  }

  function runPendingAction(action: PendingAction) {
    if (action === "cart") doAddToCart();
    if (action === "buy") doBuyNow();
  }

  function handleClick(action: "cart" | "buy") {
    if (!product.is_active) return;
    if (hasVariations && !allSelected) {
      setPendingAction(action);
      setPickerOpen(true);
      return;
    }
    if (!canAdd) return;
    runPendingAction(action);
  }

  function closePicker() {
    setPickerOpen(false);
    setPendingAction(null);
  }

  function confirmPicker() {
    if (!allSelected || !selectedVariation || selectedVariation.stock <= 0) return;
    setPickerOpen(false);
    if (pendingAction) runPendingAction(pendingAction);
    setPendingAction(null);
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
        <div className="text-xs text-brand-muted">
          {!product.is_active ? (
            "Produto indisponível no momento"
          ) : stock > 0 ? (
            <>
              {stock} em estoque
              {hasVariations && selectedVariation && (
                <>
                  {" "}
                  · {variationGroup![0]}: {selectedValue}{" "}
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="font-semibold text-brand-primary hover:text-brand-primary-dark"
                  >
                    Trocar
                  </button>
                </>
              )}
            </>
          ) : (
            "Sem estoque"
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => handleClick("cart")}
          disabled={!product.is_active}
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
          onClick={() => handleClick("buy")}
          disabled={!product.is_active}
          className="flex-1 rounded-full bg-brand-primary px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:bg-brand-border"
        >
          Comprar agora
        </button>
      </div>

      {pickerOpen && variationGroup && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closePicker} />
          <div className="relative z-10 w-full max-w-sm rounded-t-2xl border border-brand-border bg-white p-5 shadow-2xl sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-brand-text">
                Escolha uma opção
              </h2>
              <button
                type="button"
                onClick={closePicker}
                aria-label="Fechar"
                className="rounded-full p-1.5 text-brand-muted hover:bg-brand-tint"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            <div className="mb-5">
              <p className="mb-2.5 text-sm font-semibold text-brand-text">{variationGroup[0]}</p>
              <div className="flex flex-wrap gap-2">
                {variationGroup[1].map((opt) => {
                  const isSelected = selectedValue === opt.value;
                  const outOfStock = opt.stock <= 0;
                  return (
                    <button
                      key={opt.id}
                      disabled={outOfStock}
                      onClick={() => pickValue(opt.value)}
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

            <p className="mb-4 text-xs text-brand-muted">
              {!allSelected
                ? "Selecione uma opção para continuar."
                : selectedVariation && selectedVariation.stock > 0
                  ? `${selectedVariation.stock} em estoque`
                  : "Sem estoque nessa opção."}
            </p>

            <button
              type="button"
              onClick={confirmPicker}
              disabled={!allSelected || !selectedVariation || selectedVariation.stock <= 0}
              className="w-full rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:bg-brand-border"
            >
              {pendingAction === "buy"
                ? "Comprar agora"
                : pendingAction === "cart"
                  ? "Adicionar ao carrinho"
                  : "Confirmar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
