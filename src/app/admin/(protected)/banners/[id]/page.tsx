import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BannerForm } from "@/components/admin/BannerForm";
import { BackButton } from "@/components/BackButton";

export default async function EditarBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: banner } = await supabase.from("banners").select("*").eq("id", id).maybeSingle();

  if (!banner) notFound();

  return (
    <div className="flex flex-col gap-6">
      <BackButton label="Voltar" />
      <h1 className="font-display text-2xl font-semibold text-brand-text">Editar banner</h1>
      <BannerForm banner={banner} />
    </div>
  );
}
