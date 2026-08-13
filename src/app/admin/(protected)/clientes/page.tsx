import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DeleteCustomerButton } from "@/components/admin/DeleteCustomerButton";

export default async function AdminClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("customers")
    .select("id, name, phone, email")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%`);
  }

  const { data: customers } = await query;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-brand-text">Clientes</h1>
        <Link
          href="/admin/clientes/novo"
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-dark"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Novo cliente
        </Link>
      </div>

      <form className="relative max-w-sm">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nome, telefone ou e-mail..."
          className="input-mf w-full pl-10"
        />
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
      </form>

      <div className="overflow-x-auto rounded-2xl border border-brand-border bg-white">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-brand-border text-left text-xs font-semibold uppercase tracking-wide text-brand-muted">
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Telefone</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(customers ?? []).map((customer) => (
              <tr key={customer.id} className="border-b border-brand-border last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/clientes/${customer.id}`}
                    className="font-medium text-brand-text hover:text-brand-primary"
                  >
                    {customer.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-brand-muted">{customer.phone ?? "—"}</td>
                <td className="px-4 py-3 text-brand-muted">{customer.email ?? "—"}</td>
                <td className="px-4 py-3 text-right">
                  <DeleteCustomerButton id={customer.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(customers ?? []).length === 0 && (
          <p className="py-10 text-center text-sm text-brand-muted">Nenhum cliente encontrado.</p>
        )}
      </div>
    </div>
  );
}
