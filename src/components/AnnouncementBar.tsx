"use client";

import { useEffect, useState } from "react";
import { Truck, CreditCard } from "lucide-react";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";

const MESSAGES = [
  { text: "Envio para todo o Brasil", Icon: Truck },
  { text: "Parcelamos no cartão", Icon: CreditCard },
  { text: "Suporte via WhatsApp", Icon: WhatsappIcon },
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const { text, Icon } = MESSAGES[index];

  return (
    <span key={index} className="animate-fade-in inline-flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
      {text}
    </span>
  );
}
