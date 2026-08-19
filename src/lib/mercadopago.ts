import { MercadoPagoConfig } from "mercadopago";
import type { Enums } from "@/types/database.types";

export const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export function mapMercadoPagoStatus(status?: string): Enums<"payment_status_enum"> | null {
  switch (status) {
    case "approved":
      return "pago";
    case "rejected":
    case "cancelled":
      return "falhou";
    case "refunded":
    case "charged_back":
      return "reembolsado";
    default:
      return null;
  }
}
