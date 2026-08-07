import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function EditorialBanner({
  eyebrow,
  title,
  description,
  href,
  hrefLabel,
  image,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  hrefLabel: string;
  image: string;
  reverse?: boolean;
}) {
  return (
    <section className="container-mf py-10 md:py-14">
      <div
        className={`flex flex-col overflow-hidden rounded-3xl bg-brand-black lg:flex-row ${
          reverse ? "lg:flex-row-reverse" : ""
        }`}
      >
        <div className="relative aspect-[16/9] w-full lg:aspect-auto lg:w-1/2">
          <Image src={image} alt={title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="flex w-full flex-col justify-center px-7 py-10 lg:w-1/2 lg:px-14">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-primary-light">
            {eyebrow}
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold text-white sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">{description}</p>
          <Link
            href={href}
            className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/25 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:border-brand-primary-light hover:text-brand-primary-light"
          >
            {hrefLabel}
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
