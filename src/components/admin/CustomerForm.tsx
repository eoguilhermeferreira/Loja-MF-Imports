"use client";

import { saveCustomerAction } from "@/app/admin/actions";
import type { Tables } from "@/types/database.types";

type Customer = Tables<"customers">;

export function CustomerForm({ customer }: { customer?: Customer }) {
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
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-brand-text">Endereço</label>
          <textarea
            name="address"
            rows={3}
            defaultValue={customer?.address ?? ""}
            className="input-mf w-full"
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
