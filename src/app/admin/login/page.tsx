import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Login admin" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-brand-tint px-4">
      <Logo />
      <div className="w-full max-w-sm rounded-2xl border border-brand-border bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center font-display text-xl font-semibold text-brand-text">
          Painel administrativo
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
