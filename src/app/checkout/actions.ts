"use server";

import { createClient } from "@/lib/supabase/server";
import { sendOrderReceivedEmail } from "@/lib/email";

type CheckoutItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variationLabel: string | null;
  variationValue: string | null;
};

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

  const items: CheckoutItem[] = JSON.parse(itemsRaw || "[]");
  if (items.length === 0) throw new Error("Carrinho vazio.");

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
      shipping_cost: 0,
      total: subtotal,
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
      total: subtotal,
    });
  } catch (err) {
    console.error("Falha ao enviar e-mail de pedido recebido:", err);
  }

  return { orderNumber: order.order_number };
}
