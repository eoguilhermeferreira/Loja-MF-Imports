import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";

export default function NotFound() {
  return (
    <SiteChrome>
      <div className="container-mf flex flex-col items-center gap-4 py-24 text-center">
        <span className="font-display text-6xl font-semibold text-brand-primary">404</span>
        <h1 className="font-display text-2xl font-semibold text-brand-text">
          Página não encontrada
        </h1>
        <p className="max-w-sm text-sm text-brand-muted">
          O conteúdo que você procura não existe ou foi removido.
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white hover:bg-brand-primary-dark"
        >
          Voltar para a loja
        </Link>
      </div>
    </SiteChrome>
  );
}
