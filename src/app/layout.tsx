import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import { STORE_INFO } from "@/config/store";
import { CartProvider } from "@/components/CartProvider";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: `${STORE_INFO.name} — ${STORE_INFO.tagline}`,
    template: `%s | ${STORE_INFO.name}`,
  },
  description:
    "MF Imports: perfumes, tênis, celulares, cremes, relógios, fones e acessórios importados com curadoria, procedência garantida e entrega para todo o Brasil.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-white text-brand-text">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
