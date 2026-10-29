import "server-only";
import type { Product } from "@/lib/types";

/**
 * Adaptador Shopify Storefront API.
 * O token fica só no servidor (sem prefixo NEXT_PUBLIC_), nunca vai ao navegador.
 */
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION ?? "2025-07";

export function isShopifyEnabled() {
  return Boolean(domain && token);
}

async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token!,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Shopify ${res.status}`);
  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (json.errors || !json.data) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const toCents = (amount: string) => Math.round(parseFloat(amount) * 100);

interface ShopifyProductNode {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  productType: string;
  description: string;
  tags: string[];
  createdAt: string;
  priceRange: { minVariantPrice: { amount: string } };
  compareAtPriceRange: { maxVariantPrice: { amount: string } };
  images: { nodes: { url: string; altText: string | null; width: number; height: number }[] };
  variants: {
    nodes: {
      id: string;
      availableForSale: boolean;
      price: { amount: string };
      selectedOptions: { name: string; value: string }[];
    }[];
  };
}

const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id handle title vendor productType description tags createdAt
        priceRange { minVariantPrice { amount } }
        compareAtPriceRange { maxVariantPrice { amount } }
        images(first: 6) { nodes { url altText width height } }
        variants(first: 30) {
          nodes {
            id availableForSale
            price { amount }
            selectedOptions { name value }
          }
        }
      }
    }
  }
`;

const NEW_WINDOW_MS = 1000 * 60 * 60 * 24 * 30;

export async function shopifyGetProducts(): Promise<Product[]> {
  const data = await storefront<{ products: { nodes: ShopifyProductNode[] } }>(PRODUCTS_QUERY, { first: 100 });
  return data.products.nodes.map((node) => {
    const compare = toCents(node.compareAtPriceRange.maxVariantPrice.amount);
    const price = toCents(node.priceRange.minVariantPrice.amount);
    const option = (v: ShopifyProductNode["variants"]["nodes"][number], names: string[]) =>
      v.selectedOptions.find((o) => names.includes(o.name.toLowerCase()))?.value;
    return {
      id: node.id,
      slug: node.handle,
      name: node.title,
      brand: node.vendor || undefined,
      // A categoria vem do "Tipo de produto" na Shopify — use os mesmos slugs de src/data/categories.ts.
      category: node.productType.toLowerCase(),
      description: node.description,
      price,
      compareAtPrice: compare > price ? compare : null,
      images: node.images.nodes.map((img) => ({
        src: img.url,
        alt: img.altText ?? node.title,
        width: img.width,
        height: img.height,
      })),
      variants: node.variants.nodes.map((v) => ({
        id: v.id,
        size: option(v, ["tamanho", "size"]),
        color: option(v, ["cor", "color"]),
        available: v.availableForSale,
        price: toCents(v.price.amount),
      })),
      tags: node.tags,
      isNew: Date.now() - new Date(node.createdAt).getTime() < NEW_WINDOW_MS,
      featured: node.tags.includes("destaque"),
    } satisfies Product;
  });
}

const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { checkoutUrl }
      userErrors { message }
    }
  }
`;

/** Cria um carrinho na Shopify e devolve a URL do checkout oficial (pagamento real é feito lá). */
export async function shopifyCreateCheckout(lines: { merchandiseId: string; quantity: number }[]) {
  const data = await storefront<{
    cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] };
  }>(CART_CREATE, { lines });
  if (!data.cartCreate.cart) {
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join("; ") || "Falha no checkout");
  }
  return data.cartCreate.cart.checkoutUrl;
}
