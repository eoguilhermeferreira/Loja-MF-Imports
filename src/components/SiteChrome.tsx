import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsappButton } from "@/components/WhatsappButton";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsappButton />
    </>
  );
}
