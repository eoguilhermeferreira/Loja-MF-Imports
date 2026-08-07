import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DeleteBannerButton } from "@/components/admin/DeleteBannerButton";

export default async function AdminBannersPage() {
  const supabase = await createClient();
  const { data: banners } = await supabase
    .from("banners")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-brand-text">Banners</h1>
        <Link
          href="/admin/banners/novo"
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-dark"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Novo banner
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {(banners ?? []).map((banner) => (
          <div
            key={banner.id}
            className="flex items-center gap-4 rounded-2xl border border-brand-border bg-white p-4"
          >
            <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-brand-tint">
              <Image src={banner.image_url} alt="" fill sizes="112px" className="object-cover" />
            </div>
            <div className="flex-1">
              <Link
                href={`/admin/banners/${banner.id}`}
                className="font-medium text-brand-text hover:text-brand-primary"
              >
                {banner.title}
              </Link>
              <p className="text-xs text-brand-muted">
                Ordem {banner.display_order} · {banner.is_active ? "Ativo" : "Inativo"}
              </p>
            </div>
            <DeleteBannerButton id={banner.id} />
          </div>
        ))}
        {(banners ?? []).length === 0 && (
          <p className="py-10 text-center text-sm text-brand-muted">Nenhum banner cadastrado.</p>
        )}
      </div>
    </div>
  );
}
