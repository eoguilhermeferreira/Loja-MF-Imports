export function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function discountPercent(price: number, promoPrice: number): number {
  return Math.round(((price - promoPrice) / price) * 100);
}
