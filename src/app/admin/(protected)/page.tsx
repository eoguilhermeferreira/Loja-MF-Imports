import Link from "next/link";
import { DollarSign, ClipboardList, AlertTriangle, PackageSearch } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/admin/StatCard";
import { formatPrice } from "@/lib/format";

const LOW_STOCK_THRESHOLD = 5;

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [paidOrders, pendingOrders, lowStockProducts, recentOrders] = await Promise.all([
    supabase.from("orders").select("total").eq("payment_status", "pago"),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("payment_status", "pendente"),
    supabase
      .from("products")
      .select("id, name, code, stock")
      .eq("is_active", true)
      .lte("stock", LOW_STOCK_THRESHOLD)
      .order("stock", { ascending: true })
      .limit(6),
    supabase
      .from("orders")
      .select("id, order_number, customer_name, total, payment_status, delivery_status, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const revenue = (paidOrders.data ?? []).reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-2xl font-semibold text-brand-text">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Faturamento (pago)" value={formatPrice(revenue)} icon={DollarSign} />
        <StatCard
          label="Pedidos pagos"
          value={String(paidOrders.data?.length ?? 0)}
          icon={ClipboardList}
        />
        <StatCard
          label="Pagamentos pendentes"
          value={String(pendingOrders.count ?? 0)}
          icon={PackageSearch}
        />
        <StatCard
          label="Estoque baixo"
          value={String(lowStockProducts.data?.length ?? 0)}
          icon={AlertTriangle}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-brand-border bg-white p-5">
          <h2 className="mb-4 font-display text-lg font-semibold text-brand-text">
            Pedidos recentes
          </h2>
          <div className="flex flex-col divide-y divide-brand-border">
            {(recentOrders.data ?? []).map((order) => (
              <Link
                key={order.id}
                href={`/admin/pedidos/${order.id}`}
                className="flex items-center justify-between py-3 text-sm hover:text-brand-primary"
              >
                <div>
                  <p className="font-medium text-brand-text">
                    #{order.order_number} · {order.customer_name}
                  </p>
                  <p className="text-xs text-brand-muted">
                    {order.payment_status} · {order.delivery_status}
                  </p>
                </div>
                <span className="font-display font-semibold">{formatPrice(order.total)}</span>
              </Link>
            ))}
            {(recentOrders.data ?? []).length === 0 && (
              <p className="py-6 text-center text-sm text-brand-muted">Nenhum pedido ainda.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-brand-border bg-white p-5">
          <h2 className="mb-4 font-display text-lg font-semibold text-brand-text">
            Estoque baixo
          </h2>
          <div className="flex flex-col divide-y divide-brand-border">
            {(lowStockProducts.data ?? []).map((product) => (
              <Link
                key={product.id}
                href={`/admin/produtos/${product.id}`}
                className="flex items-center justify-between py-3 text-sm hover:text-brand-primary"
              >
                <div>
                  <p className="font-medium text-brand-text">{product.name}</p>
                  <p className="text-xs text-brand-muted">Cód. {product.code}</p>
                </div>
                <span className="font-semibold text-red-500">{product.stock} un.</span>
              </Link>
            ))}
            {(lowStockProducts.data ?? []).length === 0 && (
              <p className="py-6 text-center text-sm text-brand-muted">Estoque saudável.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
