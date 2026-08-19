import { NextRequest, NextResponse } from "next/server";
import { Payment } from "mercadopago";
import { mercadoPagoClient } from "@/lib/mercadopago";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPaymentStatusEmail } from "@/lib/email";
import type { Enums } from "@/types/database.types";

function mapPaymentStatus(status?: string): Enums<"payment_status_enum"> | null {
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

async function handleNotification(req: NextRequest) {
  const url = new URL(req.url);
  let paymentId: string | null = url.searchParams.get("data.id") || url.searchParams.get("id");
  const topic = url.searchParams.get("type") || url.searchParams.get("topic");

  const body = await req.json().catch(() => null);
  if (body?.data?.id) paymentId = String(body.data.id);
  const bodyTopic = body?.type || body?.topic;

  if ((topic && topic !== "payment") || (bodyTopic && bodyTopic !== "payment")) {
    return NextResponse.json({ ok: true });
  }
  if (!paymentId) return NextResponse.json({ ok: true });

  const payment = await new Payment(mercadoPagoClient).get({ id: paymentId });
  const orderId = payment.external_reference;
  const status = mapPaymentStatus(payment.status);
  if (!orderId || !status) return NextResponse.json({ ok: true });

  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .update({ payment_status: status, mercadopago_payment_id: String(paymentId) })
    .eq("id", orderId)
    .select("order_number, customer_name, customer_email")
    .single();

  if (order) {
    try {
      await sendPaymentStatusEmail({
        to: order.customer_email,
        customerName: order.customer_name,
        orderNumber: order.order_number,
        paymentStatus: status,
      });
    } catch (err) {
      console.error("Falha ao enviar e-mail de status do pagamento:", err);
    }
  }

  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  return handleNotification(req);
}

export async function GET(req: NextRequest) {
  return handleNotification(req);
}
