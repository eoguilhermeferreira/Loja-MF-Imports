"use client";

import { useState } from "react";
import Link from "next/link";
import { Info, Lock } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";

export function CheckoutPageContent() {
  const { items, subtotal, isHydrated } = useCart();
  const [showNotice, setShowNotice] = useState(false);

  if (isHydrated && items.length === 0) {
    return (
      <div className="container-mf flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-brand-text">
          Seu carrinho está vazio
        </h1>
        <Link
          href="/produtos"
          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white hover:bg-brand-primary-dark"
        >
          Ver produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="container-mf py-10 md:py-14">
      <h1 className="font-display text-2xl font-semibold text-brand-text md:text-3xl">
        Finalizar compra
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShowNotice(true);
        }}
        className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3"
      >
        <div className="flex flex-col gap-8 lg:col-span-2">
          <section>
            <h2 className="font-display text-lg font-semibold text-brand-text">
              Seus dados
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input required placeholder="Nome completo" className="input-mf sm:col-span-2" />
              <input required type="email" placeholder="E-mail" className="input-mf" />
              <input required placeholder="WhatsApp / Telefone" className="input-mf" />
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-brand-text">
              Endereço de entrega
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
              <input required placeholder="CEP" className="input-mf sm:col-span-1" />
              <input required placeholder="Rua" className="input-mf sm:col-span-3" />
              <input required placeholder="Número" className="input-mf sm:col-span-1" />
              <input placeholder="Complemento" className="input-mf sm:col-span-1" />
              <input required placeholder="Bairro" className="input-mf sm:col-span-2" />
              <input required placeholder="Cidade" className="input-mf sm:col-span-2" />
              <input required placeholder="Estado" className="input-mf sm:col-span-2" />
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-brand-text">
              Pagamento
            </h2>
            <div className="mt-4 flex flex-col gap-2.5">
              {["Pix", "Cartão de crédito", "Cartão de débito", "Boleto"].map((method, i) => (
                <label
                  key={method}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-brand-border px-4 py-3 text-sm font-medium text-brand-text has-[:checked]:border-brand-primary has-[:checked]:bg-brand-tint"
                >
                  <input type="radio" name="payment" defaultChecked={i === 0} className="accent-[var(--color-brand-primary)]" />
                  {method}
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="h-fit rounded-2xl border border-brand-border p-6">
          <h2 className="font-display text-lg font-semibold text-brand-text">
            Resumo do pedido
          </h2>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-brand-text/80">
            {items.map((item) => (
              <li
                key={`${item.productId}-${item.variationValue ?? ""}`}
                className="flex justify-between gap-3"
              >
                <span className="line-clamp-1">
                  {item.quantity}x {item.name}
                </span>
                <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-brand-border pt-4 text-sm text-brand-text/80">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-1 flex justify-between text-sm text-brand-text/80">
            <span>Frete</span>
            <span>A calcular</span>
          </div>
          <div className="mt-3 flex justify-between border-t border-brand-border pt-3 font-display text-base font-semibold text-brand-text">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <button
            type="submit"
            className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-full bg-brand-primary px-6 py-3.5 text-sm font-semibold text-white hover:bg-brand-primary-dark"
          >
            <Lock className="h-4 w-4" strokeWidth={2} />
            Confirmar pedido
          </button>

          {showNotice && (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-brand-tint p-3 text-xs text-brand-text/80">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" strokeWidth={1.75} />
              O pagamento online está sendo configurado. Fale com a gente no WhatsApp para
              concluir seu pedido agora mesmo.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
