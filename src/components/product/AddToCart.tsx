"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { InstagramIcon, WhatsappIcon } from "@/components/ui/icons";
import { site } from "@/data/site";
import type { CartLine, Product } from "@/lib/types";
import { useCart } from "@/store/cart";
import { buildOrderMessage } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

/**
 * Escolha de tamanho/cor + duas saídas:
 *  - "Pedir no WhatsApp": abre a conversa já com a peça, o tamanho e o link.
 *  - "Adicionar à sacola": junta várias peças para mandar tudo numa mensagem só.
 * Quando o produto não tem tamanhos cadastrados, usa a grade da categoria como
 * preferência do cliente — o estoque é confirmado no atendimento.
 */
export function AddToCart({
  product,
  sizeOptions = [],
  whatsapp,
  siteUrl,
}: {
  product: Product;
  sizeOptions?: string[];
  whatsapp: string | null;
  siteUrl: string;
}) {
  const add = useCart((s) => s.add);
  const stockSizes = product.variants.filter((v) => v.size);
  const usesStock = stockSizes.length > 0;
  const sizes = usesStock
    ? stockSizes.map((v) => ({ label: v.size!, available: v.available, id: v.id }))
    : sizeOptions.map((s) => ({ label: s, available: true, id: `${product.id}-${s}` }));

  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);

  const soldOut = !product.variants.some((v) => v.available);
  const selected = sizes.find((s) => s.label === size);
  const variant = usesStock ? product.variants.find((v) => v.id === selected?.id) : product.variants[0];
  const price = variant?.price ?? product.price;

  function buildLine(): CartLine | null {
    if (sizes.length > 0 && !selected) {
      setError(true);
      return null;
    }
    return {
      productId: product.id,
      slug: product.slug,
      variantId: [selected?.id ?? product.variants[0]?.id ?? product.id, color].filter(Boolean).join("|"),
      name: product.name,
      brand: product.brand,
      size: selected?.label,
      color: color ?? undefined,
      unitPrice: price,
      image: product.images[0],
      quantity: 1,
    };
  }

  function onAdd() {
    const line = buildLine();
    if (!line) return;
    add(line);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function onWhatsapp() {
    const line = buildLine();
    if (!line) return;
    const text = buildOrderMessage([line], formatPrice, { siteUrl });
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  const chip = (on: boolean) =>
    `relative h-12 border text-sm transition-colors duration-300 ${
      on ? "border-bone bg-bone text-ink" : "border-bone/20 hover:border-bone/70"
    } disabled:cursor-not-allowed disabled:text-bone/25`;

  return (
    <div className="space-y-7">
      {sizes.length > 0 && (
        <fieldset>
          <legend className="mb-3 flex w-full items-center justify-between">
            <span className="eyebrow">{usesStock ? "Tamanho" : "Seu tamanho"}</span>
            {size && <span className="text-xs text-silver">Selecionado: {size}</span>}
          </legend>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
            {sizes.map((s) => (
              <button
                key={s.id}
                type="button"
                disabled={!s.available}
                aria-pressed={size === s.label}
                aria-label={`Tamanho ${s.label}${s.available ? "" : " — esgotado"}`}
                onClick={() => {
                  setSize(s.label);
                  setError(false);
                }}
                className={chip(size === s.label)}
              >
                {s.label}
                {!s.available && (
                  <span aria-hidden className="absolute left-1/2 top-1/2 h-px w-[70%] -translate-x-1/2 -rotate-[24deg] bg-bone/25" />
                )}
              </button>
            ))}
          </div>
          {error && (
            <p role="alert" className="mt-3 text-xs text-bone">
              Escolha um tamanho para continuar.
            </p>
          )}
        </fieldset>
      )}

      {product.colors && product.colors.length > 0 && (
        <fieldset>
          <legend className="mb-3 flex w-full items-center justify-between">
            <span className="eyebrow">Cor</span>
            <span className="text-xs text-silver">{color ?? "Opcional"}</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={color === c}
                onClick={() => setColor(color === c ? null : c)}
                className={`${chip(color === c)} h-10 px-4 text-xs`}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {soldOut ? (
        <Button disabled className="w-full">
          Esgotado
        </Button>
      ) : (
        <div className="space-y-3">
          {whatsapp ? (
            <Button onClick={onWhatsapp} className="w-full">
              <WhatsappIcon width={16} height={16} /> Pedir no WhatsApp
            </Button>
          ) : (
            <Button href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="w-full">
              <InstagramIcon width={16} height={16} /> Pedir pelo Instagram
            </Button>
          )}
          <Button onClick={onAdd} variant="outline" className="w-full">
            <motion.span key={added ? "ok" : "add"} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              {added ? "Adicionado à sacola ✓" : price != null ? `Adicionar à sacola — ${formatPrice(price)}` : "Adicionar à sacola"}
            </motion.span>
          </Button>
          <p className="text-xs leading-relaxed text-steel">
            {price == null
              ? "Valor, cor e disponibilidade são confirmados no atendimento. "
              : "Disponibilidade confirmada no atendimento. "}
            Enviamos para todo o Brasil — o frete é combinado na conversa.
          </p>
        </div>
      )}
    </div>
  );
}
