export type CategorySlug = string;

export interface ProductImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ProductVariant {
  id: string;
  /** Tamanho (P, M, G, 40, 42…). */
  size?: string;
  color?: string;
  available: boolean;
  /** Preço em centavos; se ausente, usa o preço do produto. */
  price?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  category: CategorySlug;
  description: string;
  details?: string[];
  /** Preço em centavos (BRL). `null` = preço sob consulta. */
  price: number | null;
  compareAtPrice?: number | null;
  images: ProductImage[];
  variants: ProductVariant[];
  /** Cores que aparecem nas fotos — o cliente indica a preferida no pedido. */
  colors?: string[];
  tags?: string[];
  isNew?: boolean;
  featured?: boolean;
  /** Marca o item como dado de demonstração (não é produto real da loja). */
  demo?: boolean;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  /** Grade de tamanhos que o cliente pode escolher como preferência (estoque confirmado no atendimento). */
  sizes?: string[];
  image?: ProductImage;
}

export interface CartLine {
  productId: string;
  slug: string;
  variantId: string;
  name: string;
  brand?: string;
  size?: string;
  color?: string;
  /** Centavos; `null` quando o produto é "sob consulta". */
  unitPrice: number | null;
  image?: ProductImage;
  quantity: number;
}
