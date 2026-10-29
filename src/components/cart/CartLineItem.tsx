"use client";

import Link from "next/link";
import { Media } from "@/components/ui/Media";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";
import { MAX_QTY } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import type { CartLine } from "@/lib/types";
import { useCart } from "@/store/cart";

export function CartLineItem({ line, compact = false }: { line: CartLine; compact?: boolean }) {
  const update = useCart((s) => s.update);
  const remove = useCart((s) => s.remove);

  return (
    <li className="flex gap-4 py-5">
      <Link href={`/produto/${line.slug}`} className={`shrink-0 ${compact ? "w-20" : "w-24 md:w-32"}`}>
        <Media image={line.image} label={line.name} sizes="128px" className="aspect-[4/5]" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {line.brand && <p className="eyebrow mb-1 text-[9px]">{line.brand}</p>}
            <Link href={`/produto/${line.slug}`} className="block truncate text-sm uppercase tracking-wider hover:underline">
              {line.name}
            </Link>
            <p className="mt-1 text-xs text-silver">
              {[line.size && `Tamanho ${line.size}`, line.color].filter(Boolean).join(" · ")}
            </p>
          </div>
          <p className="shrink-0 text-sm text-bone/85">
            {line.unitPrice == null ? <span className="text-silver">A consultar</span> : formatPrice(line.unitPrice * line.quantity)}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center border hairline" role="group" aria-label={`Quantidade de ${line.name}`}>
            <button
              type="button"
              className="grid h-8 w-8 place-items-center hover:bg-graphite"
              aria-label="Diminuir quantidade"
              onClick={() => update(line.variantId, line.quantity - 1)}
            >
              <MinusIcon width={14} height={14} />
            </button>
            <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
              {line.quantity}
            </span>
            <button
              type="button"
              className="grid h-8 w-8 place-items-center hover:bg-graphite disabled:opacity-30"
              aria-label="Aumentar quantidade"
              disabled={line.quantity >= MAX_QTY}
              onClick={() => update(line.variantId, line.quantity + 1)}
            >
              <PlusIcon width={14} height={14} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => remove(line.variantId)}
            className="text-[11px] uppercase tracking-[0.2em] text-steel underline-offset-4 hover:text-bone hover:underline"
          >
            Remover
          </button>
        </div>
      </div>
    </li>
  );
}
