import Link from "next/link";
import Image from "next/image";
import { Plus, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function AdminProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("id, name, code, price, promo_price, stock, is_active, images:product_images(url, display_order)")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(`name.ilike.%${q}%,code.ilike.%${q}%`);
  }

  const { data: products } = await query;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-brand-text">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-dark"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Novo produto
        </Link>
      </div>

      <form className="relative max-w-sm">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nome ou código..."
          className="input-mf w-full pl-10"
        />
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
      </form>

      <div className="overflow-x-auto rounded-2xl border border-brand-border bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-brand-border text-left text-xs font-semibold uppercase tracking-wide text-brand-muted">
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Estoque</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((product) => {
              const cover = [...(product.images ?? [])].sort(
                (a, b) => a.display_order - b.display_order
              )[0];
              return (
                <tr key={product.id} className="border-b border-brand-border last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/produtos/${product.id}`}
                      className="flex items-center gap-3 font-medium text-brand-text hover:text-brand-primary"
                    >
                      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-brand-tint">
                        {cover && (
                          <Image src={cover.url} alt="" fill sizes="40px" className="object-cover" />
                        )}
                      </span>
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-brand-muted">{product.code}</td>
                  <td className="px-4 py-3">
                    {product.promo_price ? (
                      <>
                        <span className="font-semibold">{formatPrice(product.promo_price)}</span>{" "}
                        <span className="text-xs text-brand-muted line-through">
                          {formatPrice(product.price)}
                        </span>
                      </>
                    ) : (
                      formatPrice(product.price)
                    )}
                  </td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        product.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-brand-tint text-brand-muted"
                      }`}
                    >
                      {product.is_active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteProductButton id={product.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(products ?? []).length === 0 && (
          <p className="py-10 text-center text-sm text-brand-muted">Nenhum produto encontrado.</p>
        )}
      </div>
    </div>
  );
}
