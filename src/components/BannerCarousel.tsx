"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Banner } from "@/lib/queries";

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className="relative overflow-hidden bg-brand-black">
      <div className="relative aspect-[16/10] w-full sm:aspect-[21/9] lg:aspect-[3/1]">
        {banners.map((banner, i) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Image
              src={banner.image_url}
              alt={banner.title}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="container-mf absolute inset-0 flex flex-col justify-end pb-8 sm:justify-center sm:pb-0">
              <div className="max-w-md">
                <h2 className="font-display text-2xl font-semibold text-white sm:text-4xl">
                  {banner.title}
                </h2>
                {banner.description && (
                  <p className="mt-2.5 text-sm text-white/80 sm:text-base">
                    {banner.description}
                  </p>
                )}
                {banner.button_label && banner.button_link && (
                  <Link
                    href={banner.button_link}
                    className="mt-5 inline-flex items-center rounded-full bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark"
                  >
                    {banner.button_label}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur transition-colors hover:bg-white/25 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          <button
            onClick={next}
            aria-label="Próximo"
            className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur transition-colors hover:bg-white/25 sm:flex"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2} />
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
            {banners.map((banner, i) => (
              <button
                key={banner.id}
                aria-label={`Ir para o slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
