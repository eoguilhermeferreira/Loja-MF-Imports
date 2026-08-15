"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sendOrderStatusEmail } from "@/lib/email";
import type { Enums } from "@/types/database.types";

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uniqueProductSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  name: string,
  excludeId?: string
) {
  const base = slugify(name);
  let slug = base;
  let suffix = 1;

  while (true) {
    let query = supabase.from("products").select("id").eq("slug", slug);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return slug;
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
}

async function uploadImages(
  supabase: Awaited<ReturnType<typeof createClient>>,
  bucket: string,
  files: File[]
) {
  const urls: string[] = [];
  for (const file of files) {
    if (!file || file.size === 0) continue;
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

export async function saveProductAction(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string | null;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const categoryId = (formData.get("category_id") as string) || null;
  const brand = (formData.get("brand") as string) || null;
  const price = Number(formData.get("price"));
  const promoPriceRaw = formData.get("promo_price") as string;
  const promoPrice = promoPriceRaw ? Number(promoPriceRaw) : null;
  const stock = Number(formData.get("stock") || 0);
  const weightGrams = Number(formData.get("weight_grams") || 200);
  const isActive = formData.get("is_active") === "on";
  const homeSectionRaw = (formData.get("home_section") as string) || null;
  const homeSection = homeSectionRaw as "mais_vendidos" | "novidades" | "ofertas" | null;

  const variationLabels = formData.getAll("variation_label") as string[];
  const variationValues = formData.getAll("variation_value") as string[];
  const variationStocks = formData.getAll("variation_stock") as string[];

  const newImages = formData.getAll("images") as File[];
  const removedImageIds = (formData.get("removed_image_ids") as string) || "";

  let productId = id;

  if (productId) {
    const { error } = await supabase
      .from("products")
      .update({
        name,
        description,
        category_id: categoryId,
        brand,
        price,
        promo_price: promoPrice,
        stock,
        weight_grams: weightGrams,
        is_active: isActive,
        home_section: homeSection,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId);
    if (error) throw new Error(error.message);
  } else {
    const slug = await uniqueProductSlug(supabase, name);
    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        description,
        category_id: categoryId,
        brand,
        price,
        promo_price: promoPrice,
        stock,
        weight_grams: weightGrams,
        is_active: isActive,
        home_section: homeSection,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    productId = data.id;
  }

  if (removedImageIds) {
    const ids = removedImageIds.split(",").filter(Boolean);
    if (ids.length > 0) {
      await supabase.from("product_images").delete().in("id", ids);
    }
  }

  if (newImages.length > 0) {
    const urls = await uploadImages(supabase, "product-images", newImages);
    const { data: existing } = await supabase
      .from("product_images")
      .select("display_order")
      .eq("product_id", productId)
      .order("display_order", { ascending: false })
      .limit(1);
    let nextOrder = (existing?.[0]?.display_order ?? -1) + 1;
    await supabase.from("product_images").insert(
      urls.map((url) => ({ product_id: productId, url, display_order: nextOrder++ }))
    );
  }

  await supabase.from("product_variations").delete().eq("product_id", productId);
  const variationRows = variationLabels
    .map((label, i) => ({
      product_id: productId,
      label: label?.trim(),
      value: variationValues[i]?.trim(),
      stock: Number(variationStocks[i] || 0),
    }))
    .filter((v) => v.label && v.value);
  if (variationRows.length > 0) {
    await supabase.from("product_variations").insert(variationRows);
  }

  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  redirect("/admin/produtos");
}

export async function deleteProductAction(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
}

export async function updateCategoryImageAction(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const file = formData.get("image") as File;

  if (file && file.size > 0) {
    const urls = await uploadImages(supabase, "category-images", [file]);
    await supabase.from("categories").update({ image_url: urls[0] }).eq("id", id);
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/");
}

export async function clearCategoryImageAction(categoryId: string) {
  const supabase = await createClient();
  await supabase.from("categories").update({ image_url: null }).eq("id", categoryId);
  revalidatePath("/admin/categorias");
  revalidatePath("/");
}

export async function saveBannerAction(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string | null;
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const buttonLabel = (formData.get("button_label") as string) || null;
  const buttonLink = (formData.get("button_link") as string) || null;
  const displayOrder = Number(formData.get("display_order") || 0);
  const isActive = formData.get("is_active") === "on";
  const image = formData.get("image") as File;

  let imageUrl = formData.get("existing_image_url") as string | null;
  if (image && image.size > 0) {
    const urls = await uploadImages(supabase, "banner-images", [image]);
    imageUrl = urls[0];
  }

  if (!imageUrl) throw new Error("Imagem do banner é obrigatória.");

  if (id) {
    const { error } = await supabase
      .from("banners")
      .update({
        title,
        description,
        button_label: buttonLabel,
        button_link: buttonLink,
        display_order: displayOrder,
        is_active: isActive,
        image_url: imageUrl,
      })
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("banners").insert({
      title,
      description,
      button_label: buttonLabel,
      button_link: buttonLink,
      display_order: displayOrder,
      is_active: isActive,
      image_url: imageUrl,
    });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function deleteBannerAction(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  await supabase.from("banners").delete().eq("id", id);
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export async function saveCustomerAction(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string | null;
  const name = formData.get("name") as string;
  const phoneRaw = (formData.get("phone") as string) || "";
  const phone = phoneRaw ? onlyDigits(phoneRaw) : null;
  const email = (formData.get("email") as string)?.trim() || null;
  const cpfRaw = (formData.get("cpf") as string) || "";
  const cpf = cpfRaw ? onlyDigits(cpfRaw) : null;
  const cepRaw = (formData.get("cep") as string) || "";
  const cep = cepRaw ? onlyDigits(cepRaw) : null;
  const street = (formData.get("street") as string)?.trim() || null;
  const addressNumber = (formData.get("address_number") as string)?.trim() || null;
  const complement = (formData.get("complement") as string)?.trim() || null;
  const neighborhood = (formData.get("neighborhood") as string)?.trim() || null;
  const city = (formData.get("city") as string)?.trim() || null;
  const state = (formData.get("state") as string)?.trim() || null;

  const addressFields = {
    cep,
    street,
    address_number: addressNumber,
    complement,
    neighborhood,
    city,
    state,
  };

  if (id) {
    const { error } = await supabase
      .from("customers")
      .update({ name, phone, email, cpf, ...addressFields, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/clientes");
    revalidatePath(`/admin/clientes/${id}`);
    redirect(`/admin/clientes/${id}`);
  } else {
    const { data, error } = await supabase
      .from("customers")
      .insert({ name, phone, email, cpf, ...addressFields })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    revalidatePath("/admin/clientes");
    redirect(`/admin/clientes/${data.id}`);
  }
}

export async function searchProductsForAdmin(query: string) {
  const supabase = await createClient();
  let request = supabase
    .from("products")
    .select("id, name, slug, price, promo_price, description")
    .order("created_at", { ascending: false })
    .limit(8);

  if (query.trim()) {
    request = request.or(`name.ilike.%${query}%,code.ilike.%${query}%`);
  }

  const { data } = await request;
  return data ?? [];
}

export async function deleteCustomerAction(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  await supabase.from("customers").delete().eq("id", id);
  revalidatePath("/admin/clientes");
  redirect("/admin/clientes");
}

export async function updateOrderStatusAction(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const paymentStatus = formData.get("payment_status") as Enums<"payment_status_enum">;
  const deliveryStatus = formData.get("delivery_status") as Enums<"delivery_status_enum">;
  const trackingUrl = (formData.get("tracking_url") as string) || null;

  const [{ data: previous }, { data: orderItems }] = await Promise.all([
    supabase
      .from("orders")
      .select("payment_status, delivery_status, customer_email, customer_name, order_number, total")
      .eq("id", id)
      .single(),
    supabase.from("order_items").select("product_name, quantity, unit_price").eq("order_id", id),
  ]);

  const { error } = await supabase
    .from("orders")
    .update({
      payment_status: paymentStatus,
      delivery_status: deliveryStatus,
      tracking_url: trackingUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  const statusChanged =
    previous &&
    (previous.payment_status !== paymentStatus || previous.delivery_status !== deliveryStatus);

  if (statusChanged && previous) {
    try {
      await sendOrderStatusEmail({
        to: previous.customer_email,
        customerName: previous.customer_name,
        orderNumber: previous.order_number,
        paymentStatus,
        deliveryStatus,
        trackingUrl,
        items: (orderItems ?? []).map((item) => ({
          name: item.product_name,
          quantity: item.quantity,
          unitPrice: item.unit_price,
        })),
        total: previous.total,
      });
    } catch (err) {
      console.error("Falha ao enviar e-mail de status do pedido:", err);
    }
  }

  revalidatePath(`/admin/pedidos/${id}`);
  revalidatePath("/admin/pedidos");
}
