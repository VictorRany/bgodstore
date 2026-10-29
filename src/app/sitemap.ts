import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/commerce";
import { policies } from "@/data/policies";
import { site } from "@/data/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const url = (path: string) => `${site.url}${path}`;
  return [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    { url: url("/loja"), changeFrequency: "daily", priority: 0.9 },
    ...categories.map((c) => ({ url: url(`/categoria/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products
      .filter((p) => !p.demo)
      .map((p) => ({
        url: url(`/produto/${p.slug}`),
        changeFrequency: "weekly" as const,
        priority: 0.7,
        images: p.images.slice(0, 1).map((i) => (i.src.startsWith("http") ? i.src : url(i.src))),
      })),
    ...policies.map((p) => ({ url: url(`/politicas/${p.slug}`), changeFrequency: "monthly" as const, priority: 0.3 })),
  ];
}
