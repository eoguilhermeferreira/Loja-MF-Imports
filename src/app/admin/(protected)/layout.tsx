import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderKanban,
  GalleryHorizontal,
  ClipboardList,
  Users,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/Logo";
import { logoutAction } from "@/app/admin/actions";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: FolderKanban },
  { href: "/admin/banners", label: "Banners", icon: GalleryHorizontal },
  { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: adminProfile } = await supabase
    .from("admin_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminProfile) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-brand-tint">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-brand-border bg-white md:flex">
        <div className="border-b border-brand-border px-5 py-5">
          <Logo />
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-text/80 hover:bg-brand-tint hover:text-brand-primary"
            >
              <item.icon className="h-4.5 w-4.5" strokeWidth={1.75} />
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction} className="border-t border-brand-border p-3">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-muted hover:bg-brand-tint hover:text-red-500"
          >
            <LogOut className="h-4.5 w-4.5" strokeWidth={1.75} />
            Sair
          </button>
        </form>
      </aside>

      <div className="flex-1">
        <header className="border-b border-brand-border bg-white md:hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <Logo />
            <form action={logoutAction}>
              <button type="submit" className="text-sm font-medium text-brand-muted">
                Sair
              </button>
            </form>
          </div>
          <nav className="flex gap-4 overflow-x-auto px-5 pb-3 text-sm font-medium text-brand-text/80">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="shrink-0 hover:text-brand-primary">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
