import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { CheckoutPageContent } from "@/components/CheckoutPageContent";

export const metadata: Metadata = { title: "Finalizar compra" };

export default function CheckoutPage() {
  return (
    <SiteChrome>
      <CheckoutPageContent />
    </SiteChrome>
  );
}
