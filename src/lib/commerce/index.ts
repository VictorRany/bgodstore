import "server-only";
import { cache } from "react";
import { categories as localCategories } from "@/data/categories";
import { products as localProducts } from "@/data/products";
import { demoProducts } from "@/data/demo-products";
import type { Category, Product } from "@/lib/types";
import { isShopifyEnabled, shopifyGetProducts } from "./shopify";

/**
 * Ponto único de acesso ao catálogo.
 * - Com a Shopify configurada (SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_ACCESS_TOKEN),
 *   produtos, preços e estoque vêm da Storefront API.
 * - Sem ela, usa os arquivos em src/data (catálogo local / demonstração).
 */
export const getProducts = cache(async (): Promise<Product[]> => {
  if (isShopifyEnabled()) {
    try {
      return await shopifyGetProducts();
    } catch (error) {
      console.error("[commerce] Falha ao buscar produtos na Shopify:", error);
      return [];
    }
  }
  return process.env.DEMO_CATALOG === "1" ? [...localProducts, ...demoProducts] : localProducts;
});

export async function getProduct(slug: string) {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getCategories(): Promise<Category[]> {
  return localCategories;
}

export async function getCategory(slug: string) {
  return (await getCategories()).find((c) => c.slug === slug) ?? null;
}

export async function getFeatured() {
  const all = await getProducts();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, 8);
}

export async function getNewArrivals() {
  const all = await getProducts();
  return all.filter((p) => p.isNew).slice(0, 8);
}

export async function isDemoCatalog() {
  return (await getProducts()).some((p) => p.demo);
}
