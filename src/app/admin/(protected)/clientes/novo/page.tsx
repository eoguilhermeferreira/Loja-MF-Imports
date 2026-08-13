import { CustomerForm } from "@/components/admin/CustomerForm";
import { BackButton } from "@/components/BackButton";

export default function NovoClientePage() {
  return (
    <div className="flex flex-col gap-6">
      <BackButton label="Voltar" />
      <h1 className="font-display text-2xl font-semibold text-brand-text">Novo cliente</h1>
      <CustomerForm />
    </div>
  );
}
