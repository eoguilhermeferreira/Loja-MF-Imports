"use client";

import { useRef, useState } from "react";
import { saveCustomerAction } from "@/app/admin/actions";
import type { Tables } from "@/types/database.types";

type Customer = Tables<"customers">;

export function CustomerForm({ customer }: { customer?: Customer }) {
  const streetRef = useRef<HTMLInputElement>(null);
  const neighborhoodRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLInputElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);
  const [cepStatus, setCepStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleCepBlur(e: React.FocusEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "");
    if (digits.length !== 8) return;

    setCepStatus("loading");
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (data.erro) {
        setCepStatus("error");
        return;
      }
      if (streetRef.current && !streetRef.current.value) streetRef.current.value = data.logradouro ?? "";
      if (neighborhoodRef.current && !neighborhoodRef.current.value)
        neighborhoodRef.current.value = data.bairro ?? "";
      if (cityRef.current) cityRef.current.value = data.localidade ?? "";
      if (stateRef.current) stateRef.current.value = data.uf ?? "";
      setCepStatus("idle");
      numberRef.current?.focus();
    } catch {
      setCepStatus("error");
    }
  }

  return (
    <form action={saveCustomerAction} className="flex flex-col gap-6">
      {customer && <input type="hidden" name="id" value={customer.id} />}

      <section className="grid grid-cols-1 gap-4 rounded-2xl border border-brand-border bg-white p-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-brand-text">Nome completo</label>
          <input name="name" required defaultValue={customer?.name} className="input-mf w-full" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-text">Telefone / WhatsApp</label>
          <input
            name="phone"
            placeholder="14996136527"
            defaultValue={customer?.phone ?? ""}
            className="input-mf w-full"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-text">E-mail</label>
          <input
            name="email"
            type="email"
            defaultValue={customer?.email ?? ""}
            className="input-mf w-full"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-text">CPF</label>
          <input name="cpf" defaultValue={customer?.cpf ?? ""} className="input-mf w-full" />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 rounded-2xl border border-brand-border bg-white p-5 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-brand-text">
            CEP {cepStatus === "loading" && <span className="text-brand-muted">(buscando...)</span>}
            {cepStatus === "error" && <span className="text-red-500">(CEP não encontrado)</span>}
          </label>
          <input
            name="cep"
            defaultValue={customer?.cep ?? ""}
            onBlur={handleCepBlur}
            placeholder="00000-000"
            className="input-mf w-full"
          />
        </div>
        <div className="sm:col-span-2" />
        <div className="sm:col-span-3">
          <label className="mb-1.5 block text-sm font-medium text-brand-text">Rua</label>
          <input
            ref={streetRef}
            name="street"
            defaultValue={customer?.street ?? ""}
            className="input-mf w-full"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-text">Número</label>
          <input
            ref={numberRef}
            name="address_number"
            defaultValue={customer?.address_number ?? ""}
            className="input-mf w-full"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-brand-text">Complemento</label>
          <input
            name="complement"
            defaultValue={customer?.complement ?? ""}
            className="input-mf w-full"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-brand-text">Bairro</label>
          <input
            ref={neighborhoodRef}
            name="neighborhood"
            defaultValue={customer?.neighborhood ?? ""}
            className="input-mf w-full"
          />
        </div>
        <div className="sm:col-span-3">
          <label className="mb-1.5 block text-sm font-medium text-brand-text">Cidade</label>
          <input
            ref={cityRef}
            name="city"
            defaultValue={customer?.city ?? ""}
            className="input-mf w-full"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-text">Estado</label>
          <input
            ref={stateRef}
            name="state"
            maxLength={2}
            placeholder="SP"
            defaultValue={customer?.state ?? ""}
            className="input-mf w-full uppercase"
          />
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-full bg-brand-primary px-8 py-3 text-sm font-semibold text-white hover:bg-brand-primary-dark"
        >
          Salvar cliente
        </button>
      </div>
    </form>
  );
}
