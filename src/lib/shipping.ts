import { SHIPPING_ORIGIN_CEP } from "@/config/store";

export type ShippingOption = {
  id: number;
  name: string;
  company: string;
  price: number;
  deliveryTime: number;
};

type ShippingItem = {
  weightGrams: number;
  quantity: number;
};

const MELHOR_ENVIO_URL = "https://melhorenvio.com.br/api/v2/me/shipment/calculate";

// Produtos não têm dimensões cadastradas, então usamos uma caixa padrão
// e variamos apenas o peso somado do carrinho.
const DEFAULT_DIMENSIONS = { width: 16, height: 11, length: 20 };

// Transportadoras exibidas no checkout, na ordem de preferência da loja.
const ALLOWED_COMPANIES = ["Loggi", "Correios", "Jadlog"];
const MAX_OPTIONS_PER_COMPANY = 2;

export async function calculateShipping(
  destinationCep: string,
  items: ShippingItem[]
): Promise<ShippingOption[]> {
  const token = process.env.MELHOR_ENVIO_TOKEN;
  if (!token) {
    throw new Error("MELHOR_ENVIO_TOKEN não configurada.");
  }

  const totalGrams = items.reduce((sum, item) => sum + item.weightGrams * item.quantity, 0);
  const weightKg = Math.max(totalGrams / 1000, 0.1);

  const res = await fetch(MELHOR_ENVIO_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "MF Imports (mfimportsavare@gmail.com)",
    },
    body: JSON.stringify({
      from: { postal_code: SHIPPING_ORIGIN_CEP },
      to: { postal_code: destinationCep.replace(/\D/g, "") },
      products: [
        {
          id: "carrinho",
          width: DEFAULT_DIMENSIONS.width,
          height: DEFAULT_DIMENSIONS.height,
          length: DEFAULT_DIMENSIONS.length,
          weight: weightKg,
          insurance_value: 0,
          quantity: 1,
        },
      ],
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Melhor Envio respondeu ${res.status}`);
  }

  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Resposta inesperada do Melhor Envio.");
  }

  const options: ShippingOption[] = data
    .filter((option) => !option.error && option.price)
    .map((option) => ({
      id: option.id,
      name: option.name,
      company: option.company?.name ?? "",
      price: Number(option.price),
      deliveryTime: Number(option.delivery_time),
    }))
    .filter((option) => ALLOWED_COMPANIES.includes(option.company))
    .sort((a, b) => a.price - b.price);

  const countByCompany = new Map<string, number>();
  const limited = options.filter((option) => {
    const count = countByCompany.get(option.company) ?? 0;
    if (count >= MAX_OPTIONS_PER_COMPANY) return false;
    countByCompany.set(option.company, count + 1);
    return true;
  });

  return limited.sort((a, b) => a.price - b.price);
}
