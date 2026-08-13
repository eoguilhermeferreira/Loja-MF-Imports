import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CustomerForm } from "@/components/admin/CustomerForm";
import { WhatsAppSendCustomer } from "@/components/admin/WhatsAppSendCustomer";
import { BackButton } from "@/components/BackButton";

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!customer) notFound();

  return (
    <div className="flex flex-col gap-6">
      <BackButton label="Voltar" />
      <h1 className="font-display text-2xl font-semibold text-brand-text">{customer.name}</h1>

      <WhatsAppSendCustomer customerName={customer.name} customerPhone={customer.phone} />

      <CustomerForm customer={customer} />
    </div>
  );
}
