"use client";

import { useEffect, useState } from "react";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { AlertCircle, Check, Copy, FileText, Loader2 } from "lucide-react";
import { submitPaymentAction, getOrderPaymentStatusAction } from "@/app/checkout/actions";

let mpInitialized = false;

type PaymentMethod = "pix" | "cartao_credito" | "cartao_debito" | "boleto";

type PixData = { qrCode: string; qrCodeBase64: string };
type BoletoData = { url: string | null; barcode: string | null; digitableLine: string | null };

export function PaymentBrickForm({
  orderId,
  amount,
  email,
  paymentMethod,
  onApproved,
  onPending,
}: {
  orderId: string;
  amount: number;
  email: string;
  paymentMethod: PaymentMethod;
  onApproved: () => void;
  onPending: () => void;
}) {
  const [ready, setReady] = useState(false);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [boletoData, setBoletoData] = useState<BoletoData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
    if (publicKey && !mpInitialized) {
      initMercadoPago(publicKey, { locale: "pt-BR" });
      mpInitialized = true;
    }
  }, []);

  useEffect(() => {
    if (!pixData) return;
    const interval = setInterval(async () => {
      const status = await getOrderPaymentStatusAction(orderId);
      if (status === "pago") {
        clearInterval(interval);
        onApproved();
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [pixData, orderId, onApproved]);

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponível — usuário pode selecionar o texto manualmente
    }
  }

  if (pixData) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-brand-border p-6 text-center">
        <p className="text-sm font-semibold text-brand-text">Escaneie o QR code ou copie o código</p>
        <div className="h-56 w-56 overflow-hidden rounded-xl border border-brand-border bg-white p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/png;base64,${pixData.qrCodeBase64}`}
            alt="QR code Pix"
            className="h-full w-full object-contain"
          />
        </div>
        <button
          type="button"
          onClick={() => copyToClipboard(pixData.qrCode)}
          className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand-black px-6 py-3 text-sm font-semibold text-brand-black hover:bg-brand-black hover:text-white"
        >
          {copied ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Copy className="h-4 w-4" strokeWidth={2} />}
          {copied ? "Código copiado!" : "Copiar código Pix"}
        </button>
        <p className="flex items-center gap-1.5 text-xs text-brand-muted">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Aguardando confirmação do pagamento...
        </p>
      </div>
    );
  }

  if (boletoData) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-brand-border p-6 text-center">
        <FileText className="h-10 w-10 text-brand-primary" strokeWidth={1.5} />
        <p className="text-sm font-semibold text-brand-text">Seu boleto foi gerado</p>
        <p className="text-xs text-brand-muted">
          Assim que o pagamento for confirmado (pode levar até 2 dias úteis), você recebe um e-mail.
        </p>
        {boletoData.url && (
          <a
            href={boletoData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white hover:bg-brand-primary-dark"
          >
            Ver boleto / Imprimir
          </a>
        )}
        {boletoData.digitableLine && (
          <button
            type="button"
            onClick={() => copyToClipboard(boletoData.digitableLine!)}
            className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand-black px-6 py-3 text-sm font-semibold text-brand-black hover:bg-brand-black hover:text-white"
          >
            {copied ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Copy className="h-4 w-4" strokeWidth={2} />}
            {copied ? "Código copiado!" : "Copiar código de barras"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {errorMessage && (
        <p className="flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2.5 text-xs text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2} />
          {errorMessage}
        </p>
      )}
      {!ready && (
        <p className="flex items-center gap-1.5 text-xs text-brand-muted">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Carregando formulário de pagamento...
        </p>
      )}
      <Payment
        initialization={{ amount, payer: { email } }}
        customization={{
          paymentMethods: {
            creditCard: paymentMethod === "cartao_credito" ? "all" : [],
            debitCard: paymentMethod === "cartao_debito" ? "all" : [],
            ticket: paymentMethod === "boleto" ? "all" : [],
            bankTransfer: paymentMethod === "pix" ? "all" : [],
            atm: [],
            mercadoPago: [],
          },
        }}
        onReady={() => setReady(true)}
        onError={(error) => {
          console.error("Erro no formulário de pagamento:", error);
          setErrorMessage("Não foi possível carregar o formulário de pagamento. Recarregue a página.");
        }}
        onSubmit={async ({ formData }) => {
          setErrorMessage(null);
          const result = await submitPaymentAction(orderId, formData as unknown as Record<string, unknown>);

          if (!result.ok) {
            setErrorMessage(result.message);
            throw new Error(result.message);
          }

          if (result.pixQrCode && result.pixQrCodeBase64) {
            setPixData({ qrCode: result.pixQrCode, qrCodeBase64: result.pixQrCodeBase64 });
            return;
          }

          if (result.boletoUrl || result.boletoDigitableLine) {
            setBoletoData({
              url: result.boletoUrl,
              barcode: result.boletoBarcode,
              digitableLine: result.boletoDigitableLine,
            });
            return;
          }

          if (result.status === "approved") {
            onApproved();
            return;
          }

          if (result.status === "rejected") {
            setErrorMessage("Pagamento recusado. Verifique os dados do cartão ou tente outro meio de pagamento.");
            throw new Error("rejected");
          }

          onPending();
        }}
      />
    </div>
  );
}
