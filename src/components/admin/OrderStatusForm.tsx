"use client";

import { useState } from "react";
import { updateOrderStatusAction } from "@/app/admin/actions";
import type { Enums } from "@/types/database.types";

const PAYMENT_OPTIONS: Enums<"payment_status_enum">[] = [
  "pendente",
  "pago",
  "falhou",
  "reembolsado",
];

const DELIVERY_OPTIONS: Enums<"delivery_status_enum">[] = [
  "recebido",
  "preparando",
  "enviado",
  "entregue",
  "cancelado",
];

export function OrderStatusForm({
  orderId,
  paymentStatus,
  deliveryStatus,
  trackingUrl,
}: {
  orderId: string;
  paymentStatus: Enums<"payment_status_enum">;
  deliveryStatus: Enums<"delivery_status_enum">;
  trackingUrl: string | null;
}) {
  const [saved, setSaved] = useState(false);
  const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState(deliveryStatus);

  return (
    <form
      action={async (formData) => {
        await updateOrderStatusAction(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }}
      className="flex flex-col gap-4"
    >
      <input type="hidden" name="id" value={orderId} />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-text">
          Status de pagamento
        </label>
        <select name="payment_status" defaultValue={paymentStatus} className="input-mf w-full">
          {PAYMENT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-text">
          Status de entrega
        </label>
        <select
          name="delivery_status"
          value={selectedDeliveryStatus}
          onChange={(e) => setSelectedDeliveryStatus(e.target.value as Enums<"delivery_status_enum">)}
          className="input-mf w-full"
        >
          {DELIVERY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {selectedDeliveryStatus === "enviado" && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-text">
            Código / link de rastreio
          </label>
          <input
            name="tracking_url"
            defaultValue={trackingUrl ?? ""}
            placeholder="https://rastreamento.correios..."
            className="input-mf w-full"
          />
        </div>
      )}

      <button
        type="submit"
        className="rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white hover:bg-brand-primary-dark"
      >
        {saved ? "Salvo!" : "Atualizar pedido"}
      </button>
    </form>
  );
}
