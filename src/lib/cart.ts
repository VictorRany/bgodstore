import type { CartLine } from "./types";

/** Regras do carrinho como funções puras (testadas em tests/cart.test.ts). */
export const MAX_QTY = 10;

export function addLine(lines: CartLine[], line: CartLine): CartLine[] {
  const existing = lines.find((l) => l.variantId === line.variantId);
  if (existing) {
    return lines.map((l) =>
      l.variantId === line.variantId ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + line.quantity) } : l,
    );
  }
  return [...lines, { ...line, quantity: Math.min(MAX_QTY, Math.max(1, line.quantity)) }];
}

export function setQuantity(lines: CartLine[], variantId: string, quantity: number): CartLine[] {
  if (quantity <= 0) return lines.filter((l) => l.variantId !== variantId);
  return lines.map((l) => (l.variantId === variantId ? { ...l, quantity: Math.min(MAX_QTY, quantity) } : l));
}

/** Soma só os itens com preço definido. */
export function subtotal(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + (l.unitPrice ?? 0) * l.quantity, 0);
}

/** Há itens "sob consulta" (sem preço cadastrado)? */
export function hasUnpriced(lines: CartLine[]) {
  return lines.some((l) => l.unitPrice == null);
}

export function itemCount(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}

export interface OrderContact {
  name?: string;
  location?: string;
}

/**
 * Mensagem de pedido para o WhatsApp da loja: produto, marca, tamanho,
 * quantidade, link da peça e dados para o frete.
 */
export function buildOrderMessage(
  lines: CartLine[],
  format: (cents: number) => string,
  { siteUrl, contact }: { siteUrl?: string; contact?: OrderContact } = {},
) {
  const items = lines.flatMap((l, i) => {
    const title = [l.brand, l.name].filter(Boolean).join(" ");
    const variant = [l.size && `Tamanho: ${l.size}`, l.color && `Cor: ${l.color}`, `Qtd: ${l.quantity}`]
      .filter(Boolean)
      .join(" · ");
    const price = l.unitPrice == null ? "valor a confirmar" : format(l.unitPrice * l.quantity);
    return [
      `${i + 1}. *${title}*`,
      `   ${variant} — ${price}`,
      ...(siteUrl ? [`   ${siteUrl}/produto/${l.slug}`] : []),
    ];
  });

  const total = hasUnpriced(lines)
    ? subtotal(lines) > 0
      ? `Subtotal parcial: ${format(subtotal(lines))} + itens a confirmar`
      : "Valores: a confirmar com o atendimento"
    : `Subtotal: ${format(subtotal(lines))}`;

  const who = [
    contact?.name && `Nome: ${contact.name}`,
    contact?.location && `Entrega em: ${contact.location}`,
  ].filter(Boolean) as string[];

  return [
    "Olá, BGOD! Tenho interesse nestas peças:",
    "",
    ...items,
    "",
    total,
    "Frete: a combinar (envio para todo o Brasil)",
    ...(who.length ? ["", ...who] : []),
  ].join("\n");
}
