import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";
import { BackButton } from "@/components/BackButton";
import { DeleteOrderButton } from "@/components/admin/DeleteOrderButton";

export default async function AdminPedidoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: order }, { data: items }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).maybeSingle(),
    supabase.from("order_items").select("*").eq("order_id", id),
  ]);

  if (!order) notFound();

  const address = order.shipping_address as Record<string, string>;

  return (
    <div className="flex flex-col gap-6">
      <BackButton label="Voltar" />
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-brand-text">
          Pedido #{order.order_number}
        </h1>
        <DeleteOrderButton id={order.id} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section className="rounded-2xl border border-brand-border bg-white p-5">
            <h2 className="mb-3 font-display text-lg font-semibold text-brand-text">Cliente</h2>
            <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-brand-muted">Nome</dt>
                <dd className="font-medium text-brand-text">{order.customer_name}</dd>
              </div>
              <div>
                <dt className="text-brand-muted">E-mail</dt>
                <dd className="font-medium text-brand-text">{order.customer_email}</dd>
              </div>
              <div>
                <dt className="text-brand-muted">Telefone</dt>
                <dd className="font-medium text-brand-text">{order.customer_phone}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-brand-border bg-white p-5">
            <h2 className="mb-3 font-display text-lg font-semibold text-brand-text">
              Endereço de entrega
            </h2>
            <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {Object.entries(address ?? {}).map(([key, value]) => (
                <div key={key}>
                  <dt className="capitalize text-brand-muted">{key}</dt>
                  <dd className="font-medium text-brand-text">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-brand-border bg-white p-5">
            <h2 className="mb-3 font-display text-lg font-semibold text-brand-text">
              Itens do pedido
            </h2>
            <div className="flex flex-col divide-y divide-brand-border">
              {(items ?? []).map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium text-brand-text">
                      {item.quantity}x {item.product_name}
                    </p>
                    {item.variation_label && (
                      <p className="text-xs text-brand-muted">
                        {item.variation_label}: {item.variation_value}
                      </p>
                    )}
                  </div>
                  <span className="font-semibold">
                    {formatPrice(item.unit_price * item.quantity)}
                  </span>
                </div>
              ))}
              {(items ?? []).length === 0 && (
                <p className="py-4 text-sm text-brand-muted">Nenhum item registrado.</p>
              )}
            </div>
            <div className="mt-4 flex flex-col gap-1 border-t border-brand-border pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-muted">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Frete</span>
                <span>{formatPrice(order.shipping_cost)}</span>
              </div>
              <div className="flex justify-between font-display text-base font-semibold text-brand-text">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </section>
        </div>

        <section className="h-fit rounded-2xl border border-brand-border bg-white p-5">
          <h2 className="mb-4 font-display text-lg font-semibold text-brand-text">Status</h2>
          <OrderStatusForm
            orderId={order.id}
            paymentStatus={order.payment_status}
            deliveryStatus={order.delivery_status}
            trackingUrl={order.tracking_url}
          />
        </section>
      </div>
    </div>
  );
}
