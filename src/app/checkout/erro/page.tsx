import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { STORE_INFO } from "@/config/store";

export const metadata: Metadata = { title: "Erro no pagamento" };

export default function CheckoutErroPage() {
  return (
    <SiteChrome>
      <div className="container-mf flex flex-col items-center gap-4 py-24 text-center">
        <XCircle className="h-14 w-14 text-brand-primary" strokeWidth={1.3} />
        <h1 className="font-display text-2xl font-semibold text-brand-text md:text-3xl">
          Não foi possível concluir o pagamento
        </h1>
        <p className="max-w-sm text-sm text-brand-muted">
          Verifique os dados informados e tente novamente, ou fale com a gente pelo WhatsApp.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/carrinho"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white hover:bg-brand-primary-dark"
          >
            Tentar novamente
          </Link>
          <a
            href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-border px-6 py-3 text-sm font-semibold text-brand-text hover:border-brand-primary"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </SiteChrome>
  );
}
