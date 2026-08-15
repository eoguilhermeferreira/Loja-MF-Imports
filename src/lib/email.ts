import { Resend } from "resend";
import { STORE_INFO } from "@/config/store";
import { formatPrice } from "@/lib/format";
import type { Enums } from "@/types/database.types";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "MF Imports <onboarding@resend.dev>";

type OrderItemSummary = {
  name: string;
  quantity: number;
  unitPrice: number;
};

type EmailContent = {
  subject: string;
  heading: string;
  lead: string;
  detail: string | null;
};

function firstName(customerName: string) {
  return customerName.trim().split(" ")[0] || customerName;
}

function orderReceivedContent(customerName: string, orderNumber: number): EmailContent {
  return {
    subject: `Recebemos seu pedido #${orderNumber}`,
    heading: "Recebemos seu pedido!",
    lead: `Olá, ${firstName(customerName)}! A MF Imports agradece muito a sua preferência.`,
    detail: `Já recebemos o seu pedido #${orderNumber} por aqui. O pagamento ainda está pendente — assim que ele for confirmado, avisamos você por e-mail e já colocamos o pedido em preparação.`,
  };
}

function paymentStatusContent(
  customerName: string,
  orderNumber: number,
  paymentStatus: Enums<"payment_status_enum">
): EmailContent | null {
  const name = firstName(customerName);

  if (paymentStatus === "pago") {
    return {
      subject: `Pagamento confirmado - Pedido #${orderNumber}`,
      heading: "Pagamento confirmado! ✅",
      lead: `Olá, ${name}! Seu pagamento do pedido #${orderNumber} foi aprovado com sucesso.`,
      detail: `A partir de agora é só aguardar — já vamos começar a preparar o seu pedido com todo cuidado.`,
    };
  }

  if (paymentStatus === "falhou") {
    return {
      subject: `Pagamento não aprovado - Pedido #${orderNumber}`,
      heading: "Seu pagamento não foi aprovado",
      lead: `Olá, ${name}! Infelizmente não conseguimos confirmar o pagamento do seu pedido #${orderNumber}.`,
      detail: `Tente novamente ou fale com a gente pelo WhatsApp (${STORE_INFO.whatsapp}) que resolvemos rapidinho.`,
    };
  }

  if (paymentStatus === "reembolsado") {
    return {
      subject: `Pedido #${orderNumber} reembolsado`,
      heading: "Pagamento reembolsado",
      lead: `Olá, ${name}! O pagamento do seu pedido #${orderNumber} foi reembolsado.`,
      detail: `Se tiver qualquer dúvida, fale com a gente pelo WhatsApp (${STORE_INFO.whatsapp}).`,
    };
  }

  return null;
}

function deliveryStatusContent(
  customerName: string,
  orderNumber: number,
  deliveryStatus: Enums<"delivery_status_enum">,
  trackingUrl: string | null
): EmailContent | null {
  const name = firstName(customerName);

  if (deliveryStatus === "preparando") {
    return {
      subject: `Seu pedido #${orderNumber} está sendo preparado`,
      heading: "Preparando seu pedido",
      lead: `Olá, ${name}! Seu pedido #${orderNumber} está sendo preparado com carinho pela nossa equipe.`,
      detail: `Assim que ele for enviado, você recebe outro e-mail com o código de rastreio.`,
    };
  }

  if (deliveryStatus === "enviado") {
    return {
      subject: `Seu pedido #${orderNumber} foi enviado! 📦`,
      heading: "Seu pedido está a caminho!",
      lead: `Olá, ${name}! Seu pedido #${orderNumber} já saiu daqui e está a caminho do seu endereço.`,
      detail: trackingUrl
        ? `Código de rastreio: <a href="${trackingUrl}" style="color:#7c3aed;font-weight:600;">${trackingUrl}</a>`
        : null,
    };
  }

  if (deliveryStatus === "entregue") {
    return {
      subject: `Pedido #${orderNumber} entregue`,
      heading: "Pedido entregue!",
      lead: `Olá, ${name}! Seu pedido #${orderNumber} consta como entregue.`,
      detail: `Esperamos que você aproveite muito! Qualquer coisa, é só chamar a gente no WhatsApp.`,
    };
  }

  if (deliveryStatus === "cancelado") {
    return {
      subject: `Pedido #${orderNumber} cancelado`,
      heading: "Pedido cancelado",
      lead: `Olá, ${name}. Seu pedido #${orderNumber} foi cancelado.`,
      detail: `Se você não esperava por isso, fale com a gente pelo WhatsApp (${STORE_INFO.whatsapp}) que já te ajudamos.`,
    };
  }

  return null;
}

function renderEmailHtml({
  heading,
  lead,
  detail,
  orderNumber,
  items,
  total,
}: {
  heading: string;
  lead: string;
  detail: string | null;
  orderNumber: number;
  items?: OrderItemSummary[];
  total?: number;
}) {
  const itemsRows = (items ?? [])
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e9e1f2;font-size:14px;color:#1c1a1f;">
            ${item.quantity}x ${item.name}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #e9e1f2;font-size:14px;color:#1c1a1f;text-align:right;white-space:nowrap;">
            ${formatPrice(item.unitPrice * item.quantity)}
          </td>
        </tr>`
    )
    .join("");

  const itemsBlock =
    items && items.length > 0
      ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
        <tr>
          <td colspan="2" style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#726c7a;padding-bottom:8px;">
            Pedido #${orderNumber}
          </td>
        </tr>
        ${itemsRows}
        ${
          typeof total === "number"
            ? `<tr>
                 <td style="padding-top:12px;font-size:15px;font-weight:700;color:#1c1a1f;">Total</td>
                 <td style="padding-top:12px;font-size:15px;font-weight:700;color:#1c1a1f;text-align:right;">${formatPrice(total)}</td>
               </tr>`
            : ""
        }
      </table>`
      : "";

  return `<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;padding:0;background:#f7f3fc;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3fc;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e9e1f2;">
            <tr>
              <td style="background:#9b5de5;padding:24px 28px;">
                <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:0.02em;">MF Imports</span>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 12px;font-size:20px;color:#1c1a1f;">${heading}</h1>
                <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#1c1a1f;">${lead}</p>
                ${detail ? `<p style="margin:0;font-size:14px;line-height:1.6;color:#1c1a1f;">${detail}</p>` : ""}
                ${itemsBlock}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px;background:#f7f3fc;border-top:1px solid #e9e1f2;">
                <p style="margin:0 0 4px;font-size:12px;color:#726c7a;">MF Imports</p>
                <p style="margin:0 0 4px;font-size:12px;color:#726c7a;">${STORE_INFO.address}</p>
                <p style="margin:0 0 4px;font-size:12px;color:#726c7a;">WhatsApp: ${STORE_INFO.whatsapp}</p>
                <p style="margin:0;font-size:12px;color:#726c7a;">${STORE_INFO.email}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

async function dispatchEmail(
  to: string,
  content: EmailContent,
  orderNumber: number,
  items?: OrderItemSummary[],
  total?: number
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY não configurada — e-mail do pedido não enviado.");
    return;
  }

  const html = renderEmailHtml({
    heading: content.heading,
    lead: content.lead,
    detail: content.detail,
    orderNumber,
    items,
    total,
  });

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: content.subject,
    html,
  });

  if (error) {
    console.error("Falha ao enviar e-mail do pedido:", error);
  }
}

type OrderEmailBase = {
  to: string;
  customerName: string;
  orderNumber: number;
  items?: OrderItemSummary[];
  total?: number;
};

export async function sendOrderReceivedEmail(params: OrderEmailBase) {
  await dispatchEmail(
    params.to,
    orderReceivedContent(params.customerName, params.orderNumber),
    params.orderNumber,
    params.items,
    params.total
  );
}

export async function sendPaymentStatusEmail(
  params: OrderEmailBase & { paymentStatus: Enums<"payment_status_enum"> }
) {
  const content = paymentStatusContent(params.customerName, params.orderNumber, params.paymentStatus);
  if (!content) return;
  await dispatchEmail(params.to, content, params.orderNumber, params.items, params.total);
}

export async function sendDeliveryStatusEmail(
  params: OrderEmailBase & {
    deliveryStatus: Enums<"delivery_status_enum">;
    trackingUrl: string | null;
  }
) {
  const content = deliveryStatusContent(
    params.customerName,
    params.orderNumber,
    params.deliveryStatus,
    params.trackingUrl
  );
  if (!content) return;
  await dispatchEmail(params.to, content, params.orderNumber, params.items, params.total);
}
