"use client";

import { useState, useTransition } from "react";
import { Search, MessageCircle, X } from "lucide-react";
import { searchProductsForAdmin } from "@/app/admin/actions";
import { formatPrice } from "@/lib/format";

type ProductResult = {
  id: string;
  name: string;
  slug: string;
  price: number;
  promo_price: number | null;
  description: string | null;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mf-imports.vercel.app";

function buildMessage(customerName: string, product: ProductResult) {
  const price = formatPrice(product.promo_price ?? product.price);
  const link = `${SITE_URL}/produto/${product.slug}`;
  const lines = [
    `Olá, ${customerName}! 👋`,
    "",
    "Olha esse produto que separei pra você na MF Imports:",
    "",
    `🛍️ ${product.name}`,
    `💰 ${price}`,
  ];
  if (product.description) {
    lines.push("", `Produto: ${product.description}`);
  }
  lines.push("", `🛒 Confira aqui: ${link}`);
  return lines.join("\n");
}

export function WhatsAppSendCustomer({
  customerName,
  customerPhone,
}: {
  customerName: string;
  customerPhone: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductResult[]>([]);
  const [selected, setSelected] = useState<ProductResult | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function runSearch(value: string) {
    setQuery(value);
    startTransition(async () => {
      const data = await searchProductsForAdmin(value);
      setResults(data as ProductResult[]);
    });
  }

  function pickProduct(product: ProductResult) {
    setSelected(product);
    setMessage(buildMessage(customerName, product));
  }

  function reset() {
    setOpen(false);
    setSelected(null);
    setQuery("");
    setResults([]);
    setMessage("");
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          runSearch("");
        }}
        className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-95"
      >
        <MessageCircle className="h-4 w-4" strokeWidth={2} />
        Enviar produto pelo WhatsApp
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-brand-border bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-brand-text">
          Enviar produto pelo WhatsApp
        </h2>
        <button
          type="button"
          onClick={reset}
          aria-label="Fechar"
          className="rounded-full p-1.5 text-brand-muted hover:bg-brand-tint"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      {!customerPhone && (
        <p className="mb-4 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Este cliente não tem telefone cadastrado. Adicione um número para poder enviar pelo
          WhatsApp.
        </p>
      )}

      {!selected ? (
        <div>
          <div className="relative">
            <input
              autoFocus
              value={query}
              onChange={(e) => runSearch(e.target.value)}
              placeholder="Buscar produto por nome ou código..."
              className="input-mf w-full pl-10"
            />
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
          </div>
          <div className="mt-3 flex flex-col divide-y divide-brand-border">
            {isPending && <p className="py-4 text-center text-sm text-brand-muted">Buscando...</p>}
            {!isPending && results.length === 0 && (
              <p className="py-4 text-center text-sm text-brand-muted">Nenhum produto encontrado.</p>
            )}
            {!isPending &&
              results.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => pickProduct(product)}
                  className="flex items-center justify-between gap-3 py-3 text-left hover:text-brand-primary"
                >
                  <span className="text-sm font-medium text-brand-text">{product.name}</span>
                  <span className="shrink-0 text-sm font-semibold text-brand-muted">
                    {formatPrice(product.promo_price ?? product.price)}
                  </span>
                </button>
              ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-xl bg-brand-tint px-4 py-3">
            <span className="text-sm font-medium text-brand-text">{selected.name}</span>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-xs font-semibold text-brand-primary hover:text-brand-primary-dark"
            >
              Trocar produto
            </button>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-brand-text">
              Mensagem (você pode editar antes de enviar)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              className="input-mf w-full"
            />
          </div>

          <a
            href={
              customerPhone
                ? `https://wa.me/${customerPhone}?text=${encodeURIComponent(message)}`
                : undefined
            }
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!customerPhone}
            onClick={(e) => {
              if (!customerPhone) e.preventDefault();
            }}
            className={`inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white ${
              customerPhone
                ? "bg-[#25D366] hover:brightness-95"
                : "cursor-not-allowed bg-brand-border"
            }`}
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2} />
            Enviar no WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
