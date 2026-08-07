import type { Metadata } from "next";
import Link from "next/link";
import { Clock } from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = { title: "Pagamento pendente" };

export default function CheckoutPendentePage() {
  return (
    <SiteChrome>
      <div className="container-mf flex flex-col items-center gap-4 py-24 text-center">
        <Clock className="h-14 w-14 text-brand-primary" strokeWidth={1.3} />
        <h1 className="font-display text-2xl font-semibold text-brand-text md:text-3xl">
          Pagamento em análise
        </h1>
        <p className="max-w-sm text-sm text-brand-muted">
          Seu pagamento está sendo processado. Assim que for aprovado, avisaremos por e-mail.
        </p>
        <Link
          href="/produtos"
          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white hover:bg-brand-primary-dark"
        >
          Continuar comprando
        </Link>
      </div>
    </SiteChrome>
  );
}
