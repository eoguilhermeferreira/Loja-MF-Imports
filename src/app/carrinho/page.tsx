import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { CartPageContent } from "@/components/CartPageContent";

export const metadata: Metadata = { title: "Carrinho" };

export default function CarrinhoPage() {
  return (
    <SiteChrome>
      <CartPageContent />
    </SiteChrome>
  );
}
