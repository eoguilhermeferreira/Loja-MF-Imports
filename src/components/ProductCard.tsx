import Image from "next/image";
import Link from "next/link";
import { formatPrice, discountPercent } from "@/lib/format";
import type { ProductWithRelations } from "@/lib/queries";

export function ProductCard({ product }: { product: ProductWithRelations }) {
  const primaryImage = product.images[0]?.url ?? null;
  const secondaryImage = product.images[1]?.url ?? null;
  const hasPromo = product.promo_price != null && product.promo_price < product.price;
  const isNew =
    Date.now() - new Date(product.created_at).getTime() < 1000 * 60 * 60 * 24 * 21;
  const isUnavailable = !product.is_active;

  return (
    <Link href={`/produto/${product.slug}`} className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-tint">
        {primaryImage && (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 50vw"
            className={`object-cover transition-opacity duration-500 ${
              isUnavailable ? "grayscale" : secondaryImage ? "group-hover:opacity-0" : ""
            }`}
          />
        )}
        {secondaryImage && !isUnavailable && (
          <Image
            src={secondaryImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 50vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {isUnavailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50">
            <span className="-rotate-12 rounded-md border-2 border-brand-black bg-white/90 px-4 py-1 text-xs font-bold uppercase tracking-wider text-brand-black">
              Indisponível
            </span>
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {hasPromo && !isUnavailable && (
            <span className="rounded-full bg-brand-black px-2.5 py-1 text-[11px] font-semibold text-white">
              -{discountPercent(product.price, product.promo_price!)}%
            </span>
          )}
          {isNew && !hasPromo && !isUnavailable && (
            <span className="rounded-full bg-brand-primary px-2.5 py-1 text-[11px] font-semibold text-white">
              Novo
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-0.5">
        {product.brand && (
          <span className="text-[11px] font-medium uppercase tracking-wide text-brand-muted">
            {product.brand}
          </span>
        )}
        <h3 className="line-clamp-2 text-[15px] font-medium leading-snug text-brand-text">
          {product.name}
        </h3>
        <div className="mt-1 flex items-baseline gap-2">
          {hasPromo ? (
            <>
              <span className="font-display text-lg font-semibold text-brand-primary-dark">
                {formatPrice(product.promo_price!)}
              </span>
              <span className="text-sm text-brand-muted line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="font-display text-lg font-semibold text-brand-text">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
