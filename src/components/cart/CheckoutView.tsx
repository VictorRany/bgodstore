"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { InstagramIcon, WhatsappIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/Media";
import { OrderSummary } from "./CartView";
import { useCart } from "@/store/cart";
import { buildOrderMessage, hasUnpriced } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { useMounted } from "@/lib/use-mounted";

/**
 * Finalização. Este site NUNCA processa pagamento diretamente:
 * - WhatsApp configurado → abre a conversa com o pedido completo (fluxo principal da BGOD).
 * - Shopify configurada → cria o carrinho na Shopify e redireciona ao checkout oficial
 *   (só para pedidos em que todos os itens têm preço).
 */
export function CheckoutView({
  shopify,
  whatsapp,
  siteUrl,
  instagramUrl,
}: {
  shopify: boolean;
  whatsapp: string | null;
  siteUrl: string;
  instagramUrl: string;
}) {
  const lines = useCart((s) => s.lines);
  const mounted = useMounted();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!mounted) return <div className="h-64 animate-pulse bg-graphite/40" aria-busy="true" />;

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-start gap-6 border-t hairline py-20">
        <p className="font-serif text-4xl italic text-bone/80">Não há itens para finalizar.</p>
        <Button href="/loja" variant="outline">
          Explorar a loja
        </Button>
      </div>
    );
  }

  async function payWithShopify() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })) }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Não foi possível iniciar o pagamento.");
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível iniciar o pagamento.");
      setLoading(false);
    }
  }

  const message = buildOrderMessage(lines, formatPrice, {
    siteUrl,
    contact: { name: name.trim() || undefined, location: location.trim() || undefined },
  });
  const waHref = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}` : null;
  const canPayOnline = shopify && !hasUnpriced(lines);

  const field =
    "h-12 w-full border-b border-bone/25 bg-transparent text-base placeholder:text-bone/25 focus:border-bone focus:outline-none";

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="space-y-14 lg:col-span-8">
        <section aria-label="Itens do pedido">
          <h2 className="eyebrow mb-4 text-bone">Seu pedido</h2>
          <ul className="divide-y divide-bone/10 border-y hairline">
            {lines.map((l) => (
              <li key={l.variantId} className="flex items-center gap-4 py-4">
                <Media image={l.image} label={l.name} sizes="64px" className="aspect-[4/5] w-16 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm uppercase tracking-wider">
                    {[l.brand, l.name].filter(Boolean).join(" · ")}
                  </p>
                  <p className="text-xs text-silver">
                    {[l.size && `Tam. ${l.size}`, l.color, `Qtd. ${l.quantity}`].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <p className="text-sm tabular-nums">
                  {l.unitPrice == null ? <span className="text-silver">A consultar</span> : formatPrice(l.unitPrice * l.quantity)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="dados-titulo">
          <h2 id="dados-titulo" className="eyebrow mb-2 text-bone">
            Para calcular o frete
          </h2>
          <p className="mb-6 text-sm text-silver">Opcional — vai junto na mensagem e agiliza o atendimento.</p>
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="eyebrow text-[9px]">Seu nome</span>
              <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={80} className={field} placeholder="Nome" />
            </label>
            <label className="block">
              <span className="eyebrow text-[9px]">Cidade / UF ou CEP</span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                autoComplete="postal-code"
                maxLength={80}
                className={field}
                placeholder="Ex.: Recife / PE"
              />
            </label>
          </div>
        </section>
      </div>

      <OrderSummary>
        {waHref && (
          <Button href={waHref} target="_blank" rel="noopener noreferrer" className="w-full">
            <WhatsappIcon width={16} height={16} /> Enviar pedido no WhatsApp
          </Button>
        )}
        {canPayOnline && (
          <Button onClick={payWithShopify} disabled={loading} variant={waHref ? "outline" : "solid"} className="w-full">
            {loading ? "Redirecionando…" : "Pagar online"}
          </Button>
        )}
        {!waHref && (
          <Button href={instagramUrl} target="_blank" rel="noopener noreferrer" variant={canPayOnline ? "outline" : "solid"} className="w-full">
            <InstagramIcon width={16} height={16} /> Finalizar pelo Instagram
          </Button>
        )}
        {error && (
          <p role="alert" className="text-xs text-bone">
            {error}
          </p>
        )}
        <p className="text-[11px] leading-relaxed text-steel">
          A equipe confirma estoque, valores, frete e forma de pagamento com você. Enviamos para todo o Brasil. Este site
          não coleta dados de pagamento.
        </p>
      </OrderSummary>
    </div>
  );
}
