import { Suspense } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ShopFilters } from "./ShopFilters";
import { Button } from "@/components/ui/Button";
import { availableSizes, filterProducts, type SortKey } from "@/lib/catalog";
import type { Category, Product } from "@/lib/types";

export type SearchParams = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Listagem filtrável compartilhada por /loja e /categoria/[slug]. */
export function Catalog({
  products,
  categories,
  searchParams,
  fixedCategory,
}: {
  products: Product[];
  categories: Category[];
  searchParams: SearchParams;
  fixedCategory?: string;
}) {
  const result = filterProducts(products, {
    q: one(searchParams.q),
    category: fixedCategory ?? one(searchParams.categoria),
    size: one(searchParams.tamanho),
    availableOnly: one(searchParams.disponivel) === "1",
    sort: one(searchParams.sort) as SortKey | undefined,
  });
  const base = fixedCategory ? products.filter((p) => p.category === fixedCategory) : products;

  return (
    <>
      <Suspense>
        <ShopFilters categories={categories} sizes={availableSizes(base)} showCategory={!fixedCategory} total={result.length} />
      </Suspense>
      <div className="mt-12">
        {result.length > 0 ? (
          <ProductGrid products={result} priorityCount={4} />
        ) : (
          <div className="flex flex-col items-start gap-6 border-t hairline py-20">
            <p className="font-serif text-4xl italic text-bone/80">
              {products.length === 0 ? "O catálogo está sendo atualizado." : "Nenhuma peça encontrada."}
            </p>
            <p className="max-w-md text-sm text-silver">
              {products.length === 0
                ? "Volte em breve ou fale com a gente pelo atendimento."
                : "Tente outro termo de busca ou remova alguns filtros."}
            </p>
            <Button href={fixedCategory ? `/categoria/${fixedCategory}` : "/loja"} variant="outline">
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
