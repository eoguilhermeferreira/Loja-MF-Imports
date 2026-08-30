"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";
import { createOrderAction, calculateShippingAction } from "@/app/checkout/actions";
import { PaymentBrickForm } from "@/components/checkout/PaymentBrickForm";
import type { ShippingOption } from "@/lib/shipping";

const PAYMENT_METHODS = [
  { value: "pix", label: "Pix" },
  { value: "cartao_credito", label: "Cartão de crédito" },
  { value: "cartao_debito", label: "Cartão de débito" },
  { value: "boleto", label: "Boleto" },
] as const;

type PaymentMethod = (typeof PAYMENT_METHODS)[number]["value"];

type OrderInfo = { orderId: string; orderNumber: number; total: number; email: string };

export function CheckoutPageContent() {
  const router = useRouter();
  const { items, subtotal, isHydrated, clearCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const streetRef = useRef<HTMLInputElement>(null);
  const bairroRef = useRef<HTMLInputElement>(null);
  const cidadeRef = useRef<HTMLInputElement>(null);
  const estadoRef = useRef<HTMLInputElement>(null);
  const numeroRef = useRef<HTMLInputElement>(null);
  const [cepStatus, setCepStatus] = useState<"idle" | "loading" | "error">("idle");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShippingId, setSelectedShippingId] = useState<number | null>(null);
  const [shippingStatus, setShippingStatus] = useState<"idle" | "loading" | "error">("idle");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);

  const selectedShipping = shippingOptions.find((o) => o.id === selectedShippingId) ?? null;
  const shippingCost = selectedShipping?.price ?? 0;

  async function fetchShipping(digits: string) {
    setShippingStatus("loading");
    setShippingOptions([]);
    setSelectedShippingId(null);
    try {
      const options = await calculateShippingAction(
        digits,
        items.map((item) => ({ productId: item.productId, quantity: item.quantity }))
      );
      if (options.length === 0) {
        setShippingStatus("error");
        return;
      }
      setShippingOptions(options);
      setSelectedShippingId(options[0].id);
      setShippingStatus("idle");
    } catch {
      setShippingStatus("error");
    }
  }

  async function handleCepBlur(e: React.FocusEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "");
    if (digits.length !== 8) return;

    setCepStatus("loading");
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (data.erro) {
        setCepStatus("error");
        return;
      }
      if (streetRef.current) streetRef.current.value = data.logradouro ?? "";
      if (bairroRef.current) bairroRef.current.value = data.bairro ?? "";
      if (cidadeRef.current) cidadeRef.current.value = data.localidade ?? "";
      if (estadoRef.current) estadoRef.current.value = data.uf ?? "";
      setCepStatus("idle");
      numeroRef.current?.focus();
      fetchShipping(digits);
    } catch {
      setCepStatus("error");
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!selectedShipping) {
      setError("Selecione uma opção de frete antes de continuar.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set(
      "items",
      JSON.stringify(
        items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          variationLabel: item.variationLabel,
          variationValue: item.variationValue,
        }))
      )
    );
    formData.set("shipping_cost", String(selectedShipping.price));
    formData.set(
      "shipping_method",
      `${selectedShipping.company} ${selectedShipping.name}`.trim()
    );

    startTransition(async () => {
      try {
        const result = await createOrderAction(formData);
        setOrderInfo(result);
      } catch {
        setError("Não foi possível confirmar seu pedido. Tente novamente.");
      }
    });
  }

  if (orderInfo) {
    return (
      <div className="container-mf py-10 md:py-14">
        <h1 className="font-display text-2xl font-semibold text-brand-text md:text-3xl">
          Pagamento
        </h1>
        <p className="mt-1.5 text-sm text-brand-muted">
          Pedido #{orderInfo.orderNumber} — {formatPrice(orderInfo.total)}
        </p>
        <div className="mt-8 max-w-xl">
          <PaymentBrickForm
            orderId={orderInfo.orderId}
            amount={orderInfo.total}
            email={orderInfo.email}
            paymentMethod={paymentMethod}
            onApproved={() => {
              clearCart();
              router.push("/checkout/sucesso");
            }}
            onPending={() => {
              clearCart();
              router.push("/checkout/pendente");
            }}
          />
        </div>
      </div>
    );
  }

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

      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <section>
            <h2 className="font-display text-lg font-semibold text-brand-text">
              Seus dados
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                name="name"
                required
                placeholder="Nome completo"
                className="input-mf sm:col-span-2"
              />
              <input name="email" required type="email" placeholder="E-mail" className="input-mf" />
              <input name="phone" required placeholder="WhatsApp / Telefone" className="input-mf" />
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-brand-text">
              Endereço de entrega
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
              <input
                name="cep"
                required
                placeholder="CEP"
                onBlur={handleCepBlur}
                className="input-mf sm:col-span-1"
              />
              <input
                ref={streetRef}
                name="street"
                required
                placeholder="Rua"
                className="input-mf sm:col-span-3"
              />
              <input
                ref={numeroRef}
                name="number"
                required
                placeholder="Número"
                className="input-mf sm:col-span-1"
              />
              <input name="complement" placeholder="Complemento" className="input-mf sm:col-span-1" />
              <input
                ref={bairroRef}
                name="bairro"
                required
                placeholder="Bairro"
                className="input-mf sm:col-span-2"
              />
              <input
                ref={cidadeRef}
                name="cidade"
                required
                placeholder="Cidade"
                className="input-mf sm:col-span-2"
              />
              <input
                ref={estadoRef}
                name="estado"
                required
                placeholder="Estado"
                className="input-mf sm:col-span-2"
              />
              {cepStatus === "loading" && (
                <p className="text-xs text-brand-muted sm:col-span-4">Buscando endereço...</p>
              )}
              {cepStatus === "error" && (
                <p className="text-xs text-red-500 sm:col-span-4">CEP não encontrado.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-brand-text">
              Frete
            </h2>
            <div className="mt-4 flex flex-col gap-2.5">
              {shippingStatus === "loading" && (
                <p className="text-xs text-brand-muted">Calculando opções de frete...</p>
              )}
              {shippingStatus === "error" && (
                <p className="text-xs text-red-500">
                  Não foi possível calcular o frete para esse CEP. Confira o CEP informado.
                </p>
              )}
              {shippingStatus === "idle" && shippingOptions.length === 0 && (
                <p className="text-xs text-brand-muted">
                  Informe o CEP acima para ver as opções de frete.
                </p>
              )}
              {shippingOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-brand-border px-4 py-3 text-sm font-medium text-brand-text has-[:checked]:border-brand-primary has-[:checked]:bg-brand-tint"
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping_option"
                      checked={selectedShippingId === option.id}
                      onChange={() => setSelectedShippingId(option.id)}
                      className="accent-[var(--color-brand-primary)]"
                    />
                    <span>
                      {option.company} {option.name}
                      <span className="block text-xs font-normal text-brand-muted">
                        Até {option.deliveryTime} dias úteis
                      </span>
                    </span>
                  </span>
                  <span className="shrink-0">{formatPrice(option.price)}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-brand-text">
              Pagamento
            </h2>
            <div className="mt-4 flex flex-col gap-2.5">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.value}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-brand-border px-4 py-3 text-sm font-medium text-brand-text has-[:checked]:border-brand-primary has-[:checked]:bg-brand-tint"
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={() => setPaymentMethod(method.value)}
                    className="accent-[var(--color-brand-primary)]"
                  />
                  {method.label}
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
            <span>{selectedShipping ? formatPrice(shippingCost) : "A calcular"}</span>
          </div>
          <div className="mt-3 flex justify-between border-t border-brand-border pt-3 text-base font-semibold text-brand-text">
            <span>Total</span>
            <span>{formatPrice(subtotal + shippingCost)}</span>
          </div>

          <button
            type="submit"
            disabled={isPending || !selectedShipping}
            className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-full bg-brand-primary px-6 py-3.5 text-sm font-semibold text-white hover:bg-brand-primary-dark disabled:opacity-60"
          >
            <Lock className="h-4 w-4" strokeWidth={2} />
            {isPending ? "Confirmando..." : "Confirmar pedido"}
          </button>

          {error && <p className="mt-4 text-xs text-red-500">{error}</p>}
        </div>
      </form>
    </div>
  );
}
