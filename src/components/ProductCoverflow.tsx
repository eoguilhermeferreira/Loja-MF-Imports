"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice, discountPercent } from "@/lib/format";
import type { ProductWithRelations } from "@/lib/queries";

const STEP_INTERVAL = 3500;
const RESUME_DELAY = 2000;

export function ProductCoverflow({ products }: { products: ProductWithRelations[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeIndexRef = useRef(products.length);
  const pausedRef = useRef(false);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dotIndex, setDotIndex] = useState(0);

  const loop = [...products, ...products, ...products];

  const scrollToIndex = useCallback((index: number) => {
    const el = itemRefs.current[index];
    const track = trackRef.current;
    if (!el || !track) return;
    const trackRect = track.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const offset = elRect.left + elRect.width / 2 - trackRect.left - trackRect.width / 2;
    track.scrollBy({ left: offset, behavior: "smooth" });
  }, []);

  const updateStyles = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const containerRect = track.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;
    const maxDist = containerRect.width / 2.1;

    let closestIndex = activeIndexRef.current;
    let closestDist = Infinity;

    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const dist = Math.abs(cardCenter - centerX);
      const t = Math.min(dist / maxDist, 1);
      const scale = 1 - t * 0.32;
      const opacity = 1 - t * 0.7;
      const blur = t * 3.5;
      el.style.transform = `scale(${scale})`;
      el.style.opacity = String(Math.max(opacity, 0.25));
      el.style.filter = blur > 0.05 ? `blur(${blur}px)` : "none";
      el.style.zIndex = String(Math.round((1 - t) * 10) + 1);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    });
    activeIndexRef.current = closestIndex;
    setDotIndex(((closestIndex % products.length) + products.length) % products.length);
  }, [products.length]);

  // Keep the visible window inside the middle copy so every card always has
  // real neighbors on both sides (fixes edge cards never reaching full focus).
  const normalize = useCallback(() => {
    const track = trackRef.current;
    if (!track || products.length === 0) return;
    const setWidth = track.scrollWidth / 3;
    if (track.scrollLeft < setWidth * 0.5) {
      track.scrollLeft += setWidth;
    } else if (track.scrollLeft > setWidth * 1.5) {
      track.scrollLeft -= setWidth;
    }
  }, [products.length]);

  useLayoutEffect(() => {
    if (products.length === 0) return;
    scrollToIndexInstant(products.length);
    function scrollToIndexInstant(index: number) {
      const el = itemRefs.current[index];
      const track = trackRef.current;
      if (!el || !track) return;
      const trackRect = track.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const offset = elRect.left + elRect.width / 2 - trackRect.left - trackRect.width / 2;
      track.scrollLeft += offset;
    }
    // run styling pass after the initial jump settles
    requestAnimationFrame(updateStyles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || products.length === 0) return;

    let rafId: number | null = null;
    function onScroll() {
      normalize();
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        updateStyles();
        rafId = null;
      });
    }

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateStyles);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateStyles);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [normalize, updateStyles, products.length]);

  useEffect(() => {
    if (products.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function armTimer() {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
      autoTimerRef.current = setTimeout(() => {
        if (!pausedRef.current) {
          scrollToIndex(activeIndexRef.current + 1);
        }
        armTimer();
      }, STEP_INTERVAL);
    }

    armTimer();
    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, [scrollToIndex, products.length]);

  function pause() {
    pausedRef.current = true;
  }

  function resume() {
    pausedRef.current = false;
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    autoTimerRef.current = setTimeout(function armAgain() {
      if (!pausedRef.current) {
        scrollToIndex(activeIndexRef.current + 1);
      }
      autoTimerRef.current = setTimeout(armAgain, STEP_INTERVAL);
    }, RESUME_DELAY);
  }

  if (products.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onTouchStart={pause}
        onTouchEnd={resume}
        onTouchCancel={resume}
        onPointerDown={pause}
        onPointerUp={resume}
        onPointerLeave={resume}
        onPointerCancel={resume}
        onWheel={resume}
        className="flex items-start gap-5 overflow-x-auto px-[21vw] py-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-[32%] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: "x mandatory", touchAction: "pan-x" }}
      >
        {loop.map((product, i) => {
          const primaryImage = product.images[0]?.url ?? null;
          const hasPromo = product.promo_price != null && product.promo_price < product.price;
          return (
            <div
              key={`${product.id}-${i}`}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="shrink-0 transition-[filter] duration-150 ease-out"
              style={{ width: "min(56vw, 260px)", scrollSnapAlign: "center" }}
            >
              <Link href={`/produto/${product.slug}`} className="flex flex-col items-center text-center">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-brand-tint shadow-lg shadow-black/5">
                  {primaryImage && (
                    <Image
                      src={primaryImage}
                      alt={product.name}
                      fill
                      sizes="300px"
                      className="object-cover"
                      draggable={false}
                    />
                  )}
                  {hasPromo && (
                    <span className="absolute left-3 top-3 rounded-full bg-brand-black px-2.5 py-1 text-[11px] font-semibold text-white">
                      -{discountPercent(product.price, product.promo_price!)}%
                    </span>
                  )}
                </div>
                {product.brand && (
                  <span className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-primary">
                    {product.brand}
                  </span>
                )}
                <h3 className="mt-1.5 line-clamp-2 text-sm font-medium leading-snug text-brand-text">
                  {product.name}
                </h3>
                <div className="mt-1.5 flex items-baseline gap-2">
                  {hasPromo ? (
                    <>
                      <span className="font-display text-base font-semibold text-brand-primary-dark">
                        {formatPrice(product.promo_price!)}
                      </span>
                      <span className="text-xs text-brand-muted line-through">
                        {formatPrice(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="font-display text-base font-semibold text-brand-text">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {products.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => {
              pause();
              scrollToIndex(activeIndexRef.current - 1);
              resume();
            }}
            className="absolute left-2 top-[38%] z-20 -translate-y-1/2 rounded-full border border-brand-border bg-white/90 p-2.5 shadow-md backdrop-blur-sm transition-colors hover:bg-white md:left-6"
          >
            <ChevronLeft className="h-5 w-5 text-brand-text" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="Próximo"
            onClick={() => {
              pause();
              scrollToIndex(activeIndexRef.current + 1);
              resume();
            }}
            className="absolute right-2 top-[38%] z-20 -translate-y-1/2 rounded-full border border-brand-border bg-white/90 p-2.5 shadow-md backdrop-blur-sm transition-colors hover:bg-white md:right-6"
          >
            <ChevronRight className="h-5 w-5 text-brand-text" strokeWidth={2} />
          </button>

          <div className="mt-2 flex items-center justify-center gap-1.5">
            {products.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir para item ${i + 1}`}
                onClick={() => {
                  pause();
                  scrollToIndex(products.length + i);
                  resume();
                }}
                className={`h-1.5 rounded-full transition-all ${
                  i === dotIndex ? "w-5 bg-brand-primary" : "w-1.5 bg-brand-border"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
