import Link from "next/link";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { getCategories } from "@/lib/queries";
import { Logo } from "@/components/Logo";
import { SearchBar } from "@/components/SearchBar";
import { CartLink } from "@/components/CartLink";
import { HeaderMobileMenu } from "@/components/HeaderMobileMenu";

export async function Header() {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="bg-brand-black text-white">
        <div className="container-mf flex h-8 items-center justify-center text-xs md:h-9">
          <span className="inline-flex items-center text-white/80">
            <AnnouncementBar />
          </span>
        </div>
      </div>

      <div className="border-b border-brand-border">
        <div className="container-mf flex items-center gap-4 py-3.5 md:py-4">
          <div className="flex flex-1 items-center">
            <HeaderMobileMenu categories={categories} />
          </div>
          <Link href="/" className="shrink-0">
            <Logo />
          </Link>
          <div className="flex flex-1 items-center justify-end gap-3">
            <div className="hidden lg:block">
              <SearchBar className="max-w-md" />
            </div>
            <CartLink />
          </div>
        </div>
        <div className="lg:hidden container-mf pb-3">
          <SearchBar />
        </div>
      </div>

      <nav className="hidden border-b border-brand-border bg-brand-tint/60 lg:block">
        <div className="container-mf flex items-center gap-7 py-2.5 text-[13px] font-medium">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              className="text-brand-text/80 transition-colors hover:text-brand-primary"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/produtos"
            className="ml-auto text-brand-primary hover:text-brand-primary-dark"
          >
            Ver tudo
          </Link>
        </div>
      </nav>
    </header>
  );
}
