import { Resend } from "resend";
import { STORE_INFO } from "@/config/store";
import type { Enums } from "@/types/database.types";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "MF Imports <onboarding@resend.dev>";

function buildStatusEmail({
  customerName,
  orderNumber,
  paymentStatus,
  deliveryStatus,
  trackingUrl,
}: {
  customerName: string;
  orderNumber: number;
  paymentStatus: Enums<"payment_status_enum">;
  deliveryStatus: Enums<"delivery_status_enum">;
  trackingUrl: string | null;
}) {
  const greeting = `Olá, ${customerName}!`;

  if (paymentStatus === "falhou") {
    return {
      subject: `Pagamento não aprovado - Pedido #${orderNumber}`,
      html: `<p>${greeting}</p><p>Infelizmente seu pagamento do pedido <strong>#${orderNumber}</strong> não foi aprovado.</p><p>Tente novamente ou entre em contato pelo WhatsApp (${STORE_INFO.whatsapp}) que a gente te ajuda.</p>`,
    };
  }

  if (deliveryStatus === "enviado") {
    return {
      subject: `Seu pedido #${orderNumber} foi enviado! 📦`,
      html: `<p>${greeting}</p><p>Seu pedido <strong>#${orderNumber}</strong> já foi enviado.</p>${
        trackingUrl
          ? `<p>Código/link de rastreio: <a href="${trackingUrl}">${trackingUrl}</a></p>`
          : ""
      }`,
    };
  }

  if (deliveryStatus === "entregue") {
    return {
      subject: `Pedido #${orderNumber} entregue`,
      html: `<p>${greeting}</p><p>Seu pedido <strong>#${orderNumber}</strong> consta como entregue. Esperamos que aproveite! Qualquer coisa é só chamar no WhatsApp.</p>`,
    };
  }

  if (deliveryStatus === "cancelado") {
    return {
      subject: `Pedido #${orderNumber} cancelado`,
      html: `<p>${greeting}</p><p>Seu pedido <strong>#${orderNumber}</strong> foi cancelado. Se não esperava por isso, fale com a gente no WhatsApp (${STORE_INFO.whatsapp}).</p>`,
    };
  }

  if (paymentStatus === "pago" && deliveryStatus === "recebido") {
    return {
      subject: `Pagamento confirmado - Pedido #${orderNumber}`,
      html: `<p>${greeting}</p><p>Seu pagamento do pedido <strong>#${orderNumber}</strong> foi confirmado. Recebemos seu pedido e já vamos começar a preparar!</p>`,
    };
  }

  if (paymentStatus === "pendente" && deliveryStatus === "recebido") {
    return {
      subject: `Recebemos seu pedido #${orderNumber}`,
      html: `<p>${greeting}</p><p>A MF Imports agradece a sua escolha! Recebemos seu pedido <strong>#${orderNumber}</strong>.</p><p>O pagamento ainda está pendente — assim que confirmarmos, avisamos por aqui e já colocamos seu pedido em preparação.</p>`,
    };
  }

  if (deliveryStatus === "preparando") {
    return {
      subject: `Seu pedido #${orderNumber} está sendo preparado`,
      html: `<p>${greeting}</p><p>Seu pedido <strong>#${orderNumber}</strong> está sendo preparado pela nossa equipe.</p>`,
    };
  }

  return {
    subject: `Atualização do pedido #${orderNumber}`,
    html: `<p>${greeting}</p><p>Seu pedido <strong>#${orderNumber}</strong> teve uma atualização de status.</p>`,
  };
}

export async function sendOrderStatusEmail(params: {
  to: string;
  customerName: string;
  orderNumber: number;
  paymentStatus: Enums<"payment_status_enum">;
  deliveryStatus: Enums<"delivery_status_enum">;
  trackingUrl: string | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY não configurada — e-mail de status do pedido não enviado.");
    return;
  }

  const { subject, html } = buildStatusEmail(params);
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject,
    html,
  });

  if (error) {
    console.error("Falha ao enviar e-mail de status do pedido:", error);
  }
}
