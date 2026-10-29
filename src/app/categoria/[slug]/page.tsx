import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Catalog, type SearchParams } from "@/components/shop/Catalog";
import { PageHeader } from "@/components/layout/PageHeader";
import { getCategories, getCategory, getProducts } from "@/lib/commerce";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> };

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategory((await params).slug);
  if (!category) return {};
  return {
    title: category.name,
    description: `${category.name} na BGOD Store. ${category.description}`,
    alternates: { canonical: `/categoria/${category.slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const [category, products, categories, sp] = await Promise.all([getCategory(slug), getProducts(), getCategories(), searchParams]);
  if (!category) notFound();

  return (
    <div className="px-gutter mx-auto max-w-[1600px]">
      <PageHeader
        crumbs={[{ href: "/", label: "Início" }, { href: "/loja", label: "Loja" }, { label: category.name }]}
        title={category.name}
      >
        <p className="mt-6 max-w-md text-sm text-silver">{category.description}</p>
      </PageHeader>
      <Catalog products={products} categories={categories} searchParams={sp} fixedCategory={category.slug} />
    </div>
  );
}
