"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  Footprints,
  Smartphone,
  Droplet,
  Gem,
  Watch,
  Headphones,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/lib/queries";

const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  footprints: Footprints,
  smartphone: Smartphone,
  droplet: Droplet,
  gem: Gem,
  watch: Watch,
  headphones: Headphones,
};

const RESUME_DELAY = 1500;

export function CategoryNav({ categories }: { categories: Category[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || categories.length === 0) return;
    track.scrollLeft = track.scrollWidth / 3;
  }, [categories.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || categories.length === 0) return;

    function normalize() {
      if (!track) return;
      // Não mexe no scrollLeft enquanto o usuário está tocando/arrastando:
      // alterar a posição durante um gesto de toque ativo trava o momentum
      // scroll nativo do iOS/Android.
      if (pausedRef.current) return;
      const setWidth = track.scrollWidth / 3;
      if (track.scrollLeft < setWidth * 0.5) {
        track.scrollLeft += setWidth;
      } else if (track.scrollLeft > setWidth * 1.5) {
        track.scrollLeft -= setWidth;
      }
    }

    track.addEventListener("scroll", normalize, { passive: true });
    return () => track.removeEventListener("scroll", normalize);
  }, [categories.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || categories.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frameId: number;

    function step() {
      if (track && !pausedRef.current) {
        track.scrollLeft += 0.6;
      }
      frameId = requestAnimationFrame(step);
    }

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [categories.length]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  if (categories.length === 0) return null;

  const loop = [...categories, ...categories, ...categories];

  function pause() {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  }

  function scheduleResume() {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_DELAY);
  }

  return (
    <section className="py-10 md:py-14">
      <h2 className="container-mf font-display text-2xl font-semibold text-brand-text md:text-3xl">
        Compre por categoria
      </h2>
      <div
        ref={trackRef}
        onTouchStart={pause}
        onTouchEnd={scheduleResume}
        onTouchCancel={scheduleResume}
        onPointerDown={pause}
        onPointerUp={scheduleResume}
        onPointerLeave={scheduleResume}
        onPointerCancel={scheduleResume}
        onWheel={scheduleResume}
        className="mt-6 flex gap-3 overflow-x-auto px-5 [-ms-overflow-style:none] [mask-image:linear-gradient(to_right,transparent,black_2rem,black_calc(100%-2rem),transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-4 md:px-8"
        style={{ touchAction: "pan-x", WebkitOverflowScrolling: "touch" }}
      >
        {loop.map((cat, i) => {
          const Icon = ICONS[cat.icon ?? ""] ?? ShoppingBag;
          const isMiddleCopy = i >= categories.length && i < categories.length * 2;
          return (
            <Link
              key={`${cat.id}-${i}`}
              href={`/categoria/${cat.slug}`}
              aria-hidden={!isMiddleCopy}
              tabIndex={isMiddleCopy ? undefined : -1}
              draggable={false}
              className="group flex shrink-0 items-center gap-2.5 rounded-full border border-brand-border bg-white py-2.5 pr-5 pl-2.5 text-center transition-all hover:border-brand-primary hover:shadow-md hover:shadow-brand-primary/10"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white">
                <Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
              </span>
              <span className="whitespace-nowrap text-[13px] font-medium text-brand-text">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
