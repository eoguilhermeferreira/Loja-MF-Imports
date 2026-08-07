# MF Imports

Loja virtual da MF Imports — perfumes, tênis, celulares, cremes, acessórios, relógios e fones.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Supabase (banco de dados + auth + storage)
- Mercado Pago, Melhor Envio e Resend (fase 2 — integrações de pagamento, frete e e-mail)

## Desenvolvimento

```bash
npm install
npm run dev
```

Copie `.env.local.example` para `.env.local` e preencha as chaves do Supabase (já configuradas
neste ambiente) e, quando disponíveis, as chaves de Mercado Pago, Melhor Envio e Resend.

## Status

- **Fase 1 (concluída):** identidade visual, storefront completo (home, produtos, categoria,
  produto, carrinho) com dados reais no Supabase.
- **Fase 2 (a fazer):** checkout com pagamento real (Mercado Pago), cálculo de frete (Melhor
  Envio) e e-mails transacionais (Resend).
- **Fase 3 (a fazer):** painel administrativo (produtos, categorias, banners, pedidos).
