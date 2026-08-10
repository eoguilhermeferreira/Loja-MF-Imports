"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Envio para todo o Brasil",
  "Parcelamos no cartão",
  "Suporte via WhatsApp",
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="inline-block h-4 overflow-hidden align-middle">
      <span key={index} className="animate-fade-in inline-block">
        {MESSAGES[index]}
      </span>
    </span>
  );
}
