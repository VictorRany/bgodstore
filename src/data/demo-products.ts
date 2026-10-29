import type { Product, ProductVariant } from "@/lib/types";

/**
 * Itens FICTÍCIOS com preço, só para testar carrinho e checkout em desenvolvimento.
 * Ativados com DEMO_CATALOG=1 — nunca habilite em produção.
 */
const sizes = (prefix: string, soldOut: string[] = []): ProductVariant[] =>
  ["P", "M", "G", "GG"].map((size) => ({ id: `${prefix}-${size}`, size, available: !soldOut.includes(size) }));

const demo = (n: number, name: string, category: string, price: number, soldOut: string[] = []): Product => ({
  id: `demo-${n}`,
  slug: `demo-${n}`,
  name,
  category,
  description: "Item fictício para testes do carrinho. Não está à venda.",
  price,
  images: [],
  variants: sizes(`demo-${n}`, soldOut),
  demo: true,
});

export const demoProducts: Product[] = [
  demo(1, "Teste — Polo", "polos", 29990, ["GG"]),
  demo(2, "Teste — Camiseta", "camisetas", 19990),
  demo(3, "Teste — Short", "shorts-e-conjuntos", 17990, ["P"]),
];
