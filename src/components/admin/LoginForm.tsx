"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <input
        type="email"
        required
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-mf"
        autoComplete="username"
      />
      <input
        type="password"
        required
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-mf"
        autoComplete="current-password"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark disabled:opacity-60"
      >
        <Lock className="h-4 w-4" strokeWidth={2} />
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
