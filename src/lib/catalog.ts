import type { Product } from "./types";
import { normalize } from "./format";

export type SortKey = "relevancia" | "novidades" | "menor-preco" | "maior-preco";

export interface CatalogQuery {
  q?: string;
  category?: string;
  size?: string;
  availableOnly?: boolean;
  sort?: SortKey;
}

/** Busca, filtros e ordenação — funções puras, compartilhadas entre servidor e testes. */
export function filterProducts(list: Product[], query: CatalogQuery): Product[] {
  const q = query.q ? normalize(query.q) : "";
  let result = list.filter((p) => {
    if (query.category && p.category !== query.category) return false;
    if (query.size && !p.variants.some((v) => v.size === query.size)) return false;
    if (query.availableOnly && !p.variants.some((v) => v.available)) return false;
    if (q) {
      const haystack = normalize([p.name, p.brand, p.category, ...(p.tags ?? [])].join(" "));
      if (!q.split(/\s+/).every((term) => haystack.includes(term))) return false;
    }
    return true;
  });

  const price = (p: Product) => p.price ?? Number.POSITIVE_INFINITY;
  switch (query.sort) {
    case "novidades":
      result = [...result].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
      break;
    case "menor-preco":
      result = [...result].sort((a, b) => price(a) - price(b));
      break;
    case "maior-preco":
      result = [...result].sort((a, b) => {
        const pa = a.price ?? -1;
        const pb = b.price ?? -1;
        return pb - pa;
      });
      break;
  }
  return result;
}

export function availableSizes(list: Product[]) {
  const seen = new Set<string>();
  for (const p of list) for (const v of p.variants) if (v.size) seen.add(v.size);
  return [...seen];
}

export function isSoldOut(product: Product) {
  return !product.variants.some((v) => v.available);
}
