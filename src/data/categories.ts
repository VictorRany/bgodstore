import type { Category } from "@/lib/types";

/**
 * Categorias identificadas nas publicações de @bgod.store.
 * Ajuste nomes e ordem conforme o catálogo oficial.
 *
 * `sizes` é a grade que o cliente escolhe como preferência quando o produto ainda
 * não tem tamanhos cadastrados — a disponibilidade é confirmada no WhatsApp.
 */
const APPAREL = ["P", "M", "G", "GG"];
export const categories: Category[] = [
  {
    slug: "polos",
    name: "Polos",
    description: "Do social ao casual — polos Lacoste, BOSS e Calvin Klein.",
    sizes: APPAREL,
  },
  {
    slug: "camisetas",
    name: "Camisetas",
    description: "Camisetas com logos, bordados e golas contrastantes.",
    sizes: APPAREL,
  },
  {
    slug: "shorts-e-conjuntos",
    name: "Shorts & Conjuntos",
    description: "Shorts e combinações prontas de camiseta + short.",
    sizes: APPAREL,
  },
  {
    slug: "bones",
    name: "Bonés",
    description: "Bonés para fechar o visual.",
  },
];
