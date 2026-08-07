import { MessageCircle } from "lucide-react";
import { STORE_INFO } from "@/config/store";

export function WhatsappButton() {
  return (
    <a
      href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(
        STORE_INFO.whatsappMessage
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" strokeWidth={2} fill="white" />
    </a>
  );
}
