import type { Metadata } from "next";
import { Catalog, type SearchParams } from "@/components/shop/Catalog";
import { PageHeader } from "@/components/layout/PageHeader";
import { getCategories, getProducts } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "Loja",
  description: "Todos os produtos da BGOD Store — moda masculina de alto padrão.",
  alternates: { canonical: "/loja" },
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const [params, products, categories] = await Promise.all([searchParams, getProducts(), getCategories()]);
  const q = typeof params.q === "string" ? params.q : undefined;

  return (
    <div className="px-gutter mx-auto max-w-[1600px]">
      <PageHeader
        crumbs={[{ href: "/", label: "Início" }, { label: "Loja" }]}
        title={q ? "Busca" : "Loja"}
        accent={q ? `“${q}”` : "coleção completa"}
      />
      <Catalog products={products} categories={categories} searchParams={params} />
    </div>
  );
}
