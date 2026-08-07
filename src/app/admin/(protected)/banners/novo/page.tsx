import { BannerForm } from "@/components/admin/BannerForm";
import { BackButton } from "@/components/BackButton";

export default function NovoBannerPage() {
  return (
    <div className="flex flex-col gap-6">
      <BackButton label="Voltar" />
      <h1 className="font-display text-2xl font-semibold text-brand-text">Novo banner</h1>
      <BannerForm />
    </div>
  );
}
