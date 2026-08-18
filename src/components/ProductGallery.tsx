"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/queries";

export function ProductGallery({
  images,
  productName,
  unavailable = false,
}: {
  images: ProductImage[];
  productName: string;
  unavailable?: boolean;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {images.length > 1 && (
        <div className="flex gap-2.5 sm:flex-col">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              aria-label={`Ver imagem ${i + 1}`}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border transition-colors sm:h-20 sm:w-20 ${
                i === active ? "border-brand-primary" : "border-brand-border"
              }`}
            >
              <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="relative aspect-square w-full flex-1 overflow-hidden rounded-2xl bg-brand-tint">
        {current && (
          <Image
            src={current.url}
            alt={productName}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className={`object-cover ${unavailable ? "grayscale" : ""}`}
          />
        )}
        {unavailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50">
            <span className="-rotate-12 rounded-md border-2 border-brand-black bg-white/90 px-5 py-1.5 text-sm font-bold uppercase tracking-wider text-brand-black">
              Indisponível
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
