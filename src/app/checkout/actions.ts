"use server";

import { Preference } from "mercadopago";
import { createClient } from "@/lib/supabase/server";
import { sendOrderReceivedEmail } from "@/lib/email";
import { calculateShipping, type ShippingOption } from "@/lib/shipping";
import { mercadoPagoClient } from "@/lib/mercadopago";

type CheckoutItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variationLabel: string | null;
  variationValue: string | null;
};

export async function calculateShippingAction(
  cep: string,
  items: { productId: string; quantity: number }[]
): Promise<ShippingOption[]> {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) throw new Error("CEP inválido.");
  if (items.length === 0) return [];

  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("id, weight_grams")
    .in(
      "id",
      items.map((item) => item.productId)
    );

  if (error) throw new Error(error.message);

  const weightByProduct = new Map(products.map((p) => [p.id, p.weight_grams]));
  const shippingItems = items.map((item) => ({
    weightGrams: weightByProduct.get(item.productId) ?? 200,
    quantity: item.quantity,
  }));

  return calculateShipping(digits, shippingItems);
}

export async function createOrderAction(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const cep = (formData.get("cep") as string) || "";
  const street = (formData.get("street") as string) || "";
  const number = (formData.get("number") as string) || "";
  const complement = (formData.get("complement") as string) || "";
  const bairro = (formData.get("bairro") as string) || "";
  const cidade = (formData.get("cidade") as string) || "";
  const estado = (formData.get("estado") as string) || "";
  const paymentMethod = formData.get("payment_method") as
    | "pix"
    | "cartao_credito"
    | "cartao_debito"
    | "boleto";
  const itemsRaw = formData.get("items") as string;
  const shippingCost = Number(formData.get("shipping_cost") || 0);
  const shippingMethod = (formData.get("shipping_method") as string) || null;

  const items: CheckoutItem[] = JSON.parse(itemsRaw || "[]");
  if (items.length === 0) throw new Error("Carrinho vazio.");
  if (!shippingMethod || shippingCost <= 0) throw new Error("Selecione uma opção de frete.");

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + shippingCost;

  const shippingAddress = {
    CEP: cep,
    Rua: street,
    Número: number,
    Complemento: complement,
    Bairro: bairro,
    Cidade: cidade,
    Estado: estado,
  };

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      shipping_address: shippingAddress,
      subtotal,
      shipping_cost: shippingCost,
      shipping_method: shippingMethod,
      total,
      payment_method: paymentMethod,
    })
    .select("id, order_number")
    .single();

  if (error) throw new Error(error.message);

  const { error: itemsError } = await supabase.from("order_items").insert(
    items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      variation_label: item.variationLabel,
      variation_value: item.variationValue,
    }))
  );
  if (itemsError) throw new Error(itemsError.message);

  try {
    await sendOrderReceivedEmail({
      to: email,
      customerName: name,
      orderNumber: order.order_number,
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
      total,
    });
  } catch (err) {
    console.error("Falha ao enviar e-mail de pedido recebido:", err);
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

  const preference = await new Preference(mercadoPagoClient).create({
    body: {
      items: [
        ...items.map((item) => ({
          id: item.productId,
          title: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: "BRL",
        })),
        {
          id: "frete",
          title: `Frete (${shippingMethod})`,
          quantity: 1,
          unit_price: shippingCost,
          currency_id: "BRL",
        },
      ],
      payer: { name, email },
      external_reference: order.id,
      back_urls: {
        success: `${siteUrl}/checkout/sucesso`,
        pending: `${siteUrl}/checkout/pendente`,
        failure: `${siteUrl}/checkout/erro`,
      },
      auto_return: "approved",
      notification_url: `${siteUrl}/api/webhooks/mercadopago`,
    },
  });

  return { orderNumber: order.order_number, checkoutUrl: preference.init_point };
}
