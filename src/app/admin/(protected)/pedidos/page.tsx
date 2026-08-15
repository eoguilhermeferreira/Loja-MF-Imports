import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";

const PAYMENT_LABELS: Record<string, string> = {
  pendente: "Pendente",
  pago: "Pago",
  falhou: "Falhou",
  reembolsado: "Reembolsado",
};

const DELIVERY_LABELS: Record<string, string> = {
  recebido: "Recebido",
  preparando: "Preparando",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export default async function AdminPedidosPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold text-brand-text">Pedidos</h1>

      <div className="overflow-x-auto rounded-2xl border border-brand-border bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-brand-border text-left text-xs font-semibold uppercase tracking-wide text-brand-muted">
              <th className="px-4 py-3">Pedido</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Pagamento</th>
              <th className="px-4 py-3">Entrega</th>
              <th className="px-4 py-3">Data</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((order) => (
              <tr key={order.id} className="border-b border-brand-border last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/pedidos/${order.id}`}
                    className="font-medium text-brand-text hover:text-brand-primary"
                  >
                    #{order.order_number}
                  </Link>
                </td>
                <td className="px-4 py-3">{order.customer_name}</td>
                <td className="px-4 py-3 font-semibold">{formatPrice(order.total)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      order.payment_status === "pago"
                        ? "bg-green-100 text-green-700"
                        : order.payment_status === "falhou"
                          ? "bg-red-100 text-red-700"
                          : "bg-brand-tint text-brand-muted"
                    }`}
                  >
                    {PAYMENT_LABELS[order.payment_status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-brand-muted">
                  {DELIVERY_LABELS[order.delivery_status]}
                </td>
                <td className="px-4 py-3 text-brand-muted">
                  {new Date(order.created_at).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(orders ?? []).length === 0 && (
          <p className="py-10 text-center text-sm text-brand-muted">Nenhum pedido ainda.</p>
        )}
      </div>
    </div>
  );
}
