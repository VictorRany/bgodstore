import { describe, expect, it } from "vitest";
import { addLine, buildOrderMessage, hasUnpriced, itemCount, MAX_QTY, setQuantity, subtotal } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import type { CartLine } from "@/lib/types";

const line = (variantId: string, unitPrice: number | null, quantity = 1): CartLine => ({
  productId: "p",
  slug: "p",
  variantId,
  name: `Item ${variantId}`,
  size: "M",
  unitPrice,
  quantity,
});

describe("carrinho", () => {
  it("soma quantidades da mesma variante em vez de duplicar a linha", () => {
    const lines = addLine(addLine([], line("a", 1000)), line("a", 1000, 2));
    expect(lines).toHaveLength(1);
    expect(lines[0].quantity).toBe(3);
  });

  it("limita a quantidade máxima por item", () => {
    const lines = addLine([line("a", 1000, MAX_QTY)], line("a", 1000, 5));
    expect(lines[0].quantity).toBe(MAX_QTY);
    expect(setQuantity(lines, "a", 99)[0].quantity).toBe(MAX_QTY);
  });

  it("remove a linha quando a quantidade chega a zero", () => {
    expect(setQuantity([line("a", 1000)], "a", 0)).toEqual([]);
  });

  it("calcula subtotal e total de itens", () => {
    const lines = [line("a", 1990, 2), line("b", 5000)];
    expect(subtotal(lines)).toBe(8980);
    expect(itemCount(lines)).toBe(3);
  });

  it("monta a mensagem de pedido para o WhatsApp com produto, tamanho e link", () => {
    const msg = buildOrderMessage([{ ...line("a", 1990, 2), brand: "Lacoste", slug: "polo-x" }], formatPrice, {
      siteUrl: "https://bgod.store",
      contact: { name: "Ana", location: "Recife / PE" },
    });
    expect(msg).toContain("*Lacoste Item a*");
    expect(msg).toContain("Tamanho: M · Qtd: 2");
    expect(msg).toContain("https://bgod.store/produto/polo-x");
    expect(msg).toContain("Subtotal:");
    expect(msg).toContain("envio para todo o Brasil");
    expect(msg).toContain("Entrega em: Recife / PE");
  });

  it("trata itens sem preço como 'a confirmar'", () => {
    const lines = [line("a", null), line("b", 5000)];
    expect(hasUnpriced(lines)).toBe(true);
    expect(subtotal(lines)).toBe(5000);
    const msg = buildOrderMessage([line("a", null)], formatPrice);
    expect(msg).toContain("valor a confirmar");
    expect(msg).toContain("Valores: a confirmar com o atendimento");
  });
});
