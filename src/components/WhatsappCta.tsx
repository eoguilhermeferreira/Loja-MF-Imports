import { MessageCircle } from "lucide-react";
import { STORE_INFO } from "@/config/store";

export function WhatsappCta() {
  return (
    <section className="container-mf pb-16 pt-4 md:pb-20">
      <div className="flex flex-col items-center gap-5 rounded-3xl bg-gradient-to-br from-brand-primary to-brand-primary-dark px-6 py-12 text-center text-white sm:px-10">
        <MessageCircle className="h-9 w-9" strokeWidth={1.5} />
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
          Ficou com alguma dúvida?
        </h2>
        <p className="max-w-md text-sm text-white/85">
          Fale direto com a equipe MF Imports pelo WhatsApp e receba atendimento
          personalizado para escolher o produto ideal.
        </p>
        <a
          href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(
            STORE_INFO.whatsappMessage
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-brand-primary-dark transition-transform hover:scale-105"
        >
          <MessageCircle className="h-4 w-4" strokeWidth={2} />
          Chamar no WhatsApp
        </a>
      </div>
    </section>
  );
}
