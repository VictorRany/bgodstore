"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CartLineItem } from "./CartLineItem";
import { useCart } from "@/store/cart";
import { hasUnpriced, itemCount, subtotal } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { useMounted } from "@/lib/use-mounted";

export function CartView() {
  const lines = useCart((s) => s.lines);
  const mounted = useMounted();

  if (!mounted) return <div className="h-64 animate-pulse bg-graphite/40" aria-busy="true" />;

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-start gap-6 border-t hairline py-20">
        <p className="font-serif text-4xl italic text-bone/80">Sua sacola está vazia.</p>
        <Button href="/loja" variant="outline">
          Explorar a loja
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <ul className="divide-y divide-bone/10 border-y hairline lg:col-span-8">
        {lines.map((l) => (
          <CartLineItem key={l.variantId} line={l} />
        ))}
      </ul>
      <OrderSummary>
        <Button href="/checkout" className="w-full">
          Finalizar pedido
        </Button>
        <Link href="/loja" className="block text-center text-[11px] uppercase tracking-[0.2em] text-silver hover:text-bone">
          Continuar comprando
        </Link>
      </OrderSummary>
    </div>
  );
}

/** Texto do total considerando itens "sob consulta". */
export function totalLabel(lines: Parameters<typeof subtotal>[0]) {
  const value = subtotal(lines);
  if (!hasUnpriced(lines)) return formatPrice(value);
  return value > 0 ? `${formatPrice(value)} + a consultar` : "A consultar";
}

export function OrderSummary({ children }: { children?: React.ReactNode }) {
  const lines = useCart((s) => s.lines);
  return (
    <aside aria-label="Resumo do pedido" className="h-fit space-y-5 border hairline p-6 lg:sticky lg:top-24 lg:col-span-4">
      <h2 className="eyebrow text-bone">Resumo</h2>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-silver">Itens</dt>
          <dd className="tabular-nums">{itemCount(lines)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-silver">Frete</dt>
          <dd className="text-right text-silver">Todo o Brasil · combinado no atendimento</dd>
        </div>
      </dl>
      <div className="flex items-baseline justify-between border-t hairline pt-5">
        <span className="eyebrow">Total parcial</span>
        <span className="text-xl tabular-nums">{totalLabel(lines)}</span>
      </div>
      {children}
    </aside>
  );
}
