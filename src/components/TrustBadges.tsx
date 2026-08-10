import { Truck, CreditCard } from "lucide-react";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";
import { BENEFITS } from "@/config/store";

const ICONS = [Truck, CreditCard, WhatsappIcon];

export function TrustBadges() {
  return (
    <section className="border-y border-brand-border bg-brand-tint/50">
      <div className="container-mf grid grid-cols-1 gap-6 py-10 sm:grid-cols-3 sm:gap-4">
        {BENEFITS.map((benefit, i) => {
          const Icon = ICONS[i];
          return (
            <div key={benefit.title} className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-primary shadow-sm">
                <Icon className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <div>
                <p className="text-sm font-semibold text-brand-text">{benefit.title}</p>
                <p className="mt-0.5 text-xs text-brand-muted">{benefit.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
