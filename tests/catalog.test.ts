import { describe, expect, it } from "vitest";
import { availableSizes, filterProducts, isSoldOut } from "@/lib/catalog";
import { formatPrice, normalize } from "@/lib/format";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import type { Product } from "@/lib/types";

const p = (over: Partial<Product>): Product => ({
  id: over.slug ?? "x",
  slug: "x",
  name: "Produto",
  category: "polos",
  description: "",
  price: 10000,
  images: [],
  variants: [{ id: "v", size: "M", available: true }],
  ...over,
});

const list = [
  p({ slug: "a", name: "Polo Gola Contraste", brand: "Lacoste", price: 30000, isNew: true }),
  p({ slug: "b", name: "Camiseta Paris", category: "camisetas", price: 20000, variants: [{ id: "v", size: "G", available: false }] }),
  p({ slug: "c", name: "Boné", category: "bones", price: null }),
];

describe("busca e filtros", () => {
  it("busca sem acentos e por marca", () => {
    expect(filterProducts(list, { q: "lacoste polo" }).map((x) => x.slug)).toEqual(["a"]);
    expect(filterProducts(list, { q: "bone" }).map((x) => x.slug)).toEqual(["c"]);
  });

  it("filtra por categoria, tamanho e disponibilidade", () => {
    expect(filterProducts(list, { category: "camisetas" })).toHaveLength(1);
    expect(filterProducts(list, { size: "G" }).map((x) => x.slug)).toEqual(["b"]);
    expect(filterProducts(list, { availableOnly: true }).map((x) => x.slug)).toEqual(["a", "c"]);
  });

  it("ordena por preço deixando 'sob consulta' por último", () => {
    expect(filterProducts(list, { sort: "menor-preco" }).map((x) => x.slug)).toEqual(["b", "a", "c"]);
    expect(filterProducts(list, { sort: "maior-preco" }).map((x) => x.slug)).toEqual(["a", "b", "c"]);
  });

  it("utilitários", () => {
    expect(isSoldOut(list[1])).toBe(true);
    expect(availableSizes(list)).toEqual(["M", "G"]);
    expect(normalize("  Boné ")).toBe("bone");
    expect(formatPrice(null)).toBe("Sob consulta");
    expect(formatPrice(34990).replace(/\s/g, " ")).toBe("R$ 349,90");
  });
});

describe("integridade do catálogo", () => {
  it("slugs únicos e categorias válidas", () => {
    const slugs = products.map((x) => x.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const valid = new Set(categories.map((c) => c.slug));
    for (const product of products) expect(valid.has(product.category)).toBe(true);
  });

  it("todo produto tem foto com texto alternativo e ao menos uma variante", () => {
    for (const product of products) {
      expect(product.images.length).toBeGreaterThan(0);
      for (const img of product.images) expect(img.alt.length).toBeGreaterThan(5);
      expect(product.variants.length).toBeGreaterThan(0);
    }
  });
});
