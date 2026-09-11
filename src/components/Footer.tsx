import Link from "next/link";
import { Mail, MapPin, Truck, CreditCard } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";
import { STORE_INFO, AGENCY_CREDIT } from "@/config/store";
import { Logo } from "@/components/Logo";
import { getCategories } from "@/lib/queries";

const PAYMENT_ICONS = [
  { file: "pix.svg", alt: "Pix" },
  { file: "visa.svg", alt: "Visa" },
  { file: "mastercard.svg", alt: "Mastercard" },
  { file: "elo.svg", alt: "Elo" },
  { file: "hipercard.svg", alt: "Hipercard" },
  { file: "amex.svg", alt: "American Express" },
  { file: "boleto.svg", alt: "Boleto" },
] as const;

export async function Footer() {
  const categories = await getCategories();

  return (
    <footer className="mt-20 bg-brand-black text-white/70">
      <div className="border-b border-white/10">
        <div className="container-mf grid grid-cols-1 gap-6 py-8 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <Truck className="h-6 w-6 shrink-0 text-brand-primary-light" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-semibold text-brand-primary-light">Envio para todo o Brasil</p>
              <p className="text-xs text-brand-primary-light/60">Com rastreio do pedido</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 shrink-0 text-brand-primary-light" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-semibold text-brand-primary-light">Parcele em até 12x</p>
              <p className="text-xs text-brand-primary-light/60">Pix, cartão ou boleto</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <WhatsappIcon className="h-6 w-6 shrink-0 text-brand-primary-light" />
            <div>
              <p className="text-sm font-semibold text-brand-primary-light">Suporte via WhatsApp</p>
              <p className="text-xs text-brand-primary-light/60">Atendimento direto e rápido</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-mf grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo dark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            Loja de variedades com curadoria própria: perfumes, tênis, celulares, cremes,
            relógios, fones e acessórios importados com qualidade e confiança.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href={STORE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-full border border-white/15 p-2 hover:border-brand-primary-light hover:text-brand-primary-light"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="rounded-full border border-white/15 p-2 hover:border-brand-primary-light hover:text-brand-primary-light"
            >
              <WhatsappIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            Categorias
          </p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link href={`/categoria/${cat.slug}`} className="hover:text-brand-primary-light">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            Loja
          </p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            <li>
              <Link href="/produtos" className="hover:text-brand-primary-light">
                Todos os produtos
              </Link>
            </li>
            <li>
              <Link href="/carrinho" className="hover:text-brand-primary-light">
                Meu carrinho
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            Contato
          </p>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary-light" strokeWidth={1.75} />
              {STORE_INFO.address}
            </li>
            <li>
              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-brand-primary-light"
              >
                <WhatsappIcon className="h-4 w-4 shrink-0 text-brand-primary-light" />
                {STORE_INFO.whatsapp}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${STORE_INFO.email}`}
                className="flex items-center gap-2 hover:text-brand-primary-light"
              >
                <Mail className="h-4 w-4 shrink-0 text-brand-primary-light" strokeWidth={1.75} />
                {STORE_INFO.email}
              </a>
            </li>
            <li>
              <a
                href={STORE_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-brand-primary-light"
              >
                <InstagramIcon className="h-4 w-4 shrink-0 text-brand-primary-light" />
                {STORE_INFO.instagram}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-mf flex flex-col items-center gap-4 py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            Formas de pagamento
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {PAYMENT_ICONS.map((icon) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={icon.file}
                src={`/payment-icons/${icon.file}`}
                alt={icon.alt}
                className="h-8 w-auto"
              />
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="container-mf py-6 text-center text-xs text-white/40 leading-relaxed">
          <p>© {new Date().getFullYear()}, {STORE_INFO.name}</p>
          <p>
            É vedada qualquer reprodução total ou parcial, nos termos da Lei nº 9.610/98.
            Todos os direitos reservados.
          </p>
          <p>{STORE_INFO.address}</p>
          <p>{STORE_INFO.ownerName}</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-mf flex flex-col items-center gap-2 py-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            Desenvolvido por
          </p>
          <a
            href={AGENCY_CREDIT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={AGENCY_CREDIT.name}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/nodex-logo-footer.png"
              alt={AGENCY_CREDIT.name}
              className="h-16 w-auto opacity-70 transition-opacity hover:opacity-100"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
