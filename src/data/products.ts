import type { Product } from "@/lib/types";

/**
 * CATÁLOGO DA BGOD
 * ------------------------------------------------------------------
 * Montado a partir das fotos publicadas em @bgod.store. Nomes descrevem
 * apenas o que aparece nas fotos. Preços, tamanhos e estoque ainda NÃO
 * foram informados pela loja — por isso `price: null` ("Sob consulta").
 *
 * Para completar um produto:
 *  - `price`: valor em centavos (ex.: R$ 349,90 → 34990).
 *  - `variants`: um item por tamanho/cor, com `available` indicando estoque.
 *    Ex.: [{ id: "polo-x-P", size: "P", available: true }, …]
 *  - `description` / `details`: composição, modelagem etc.
 * Fotos ficam em /public/images/produtos/.
 */

const DESCRIPTION =
  "Consulte cores, tamanhos e valores com o atendimento da BGOD. Envio para todo o Brasil.";

const photos = (slug: string, count: number, alt: string) =>
  Array.from({ length: count }, (_, i) => ({
    src: `/images/produtos/${slug}-${i + 1}.jpg`,
    alt: `${alt}${count > 1 ? ` — foto ${i + 1}` : ""}`,
  }));

/** Enquanto a loja não informar tamanhos, cada produto tem uma variante única "sob consulta". */
const single = (slug: string) => [{ id: `${slug}-unico`, available: true }];

function product(p: Omit<Product, "id" | "images" | "variants" | "description" | "price"> & {
  photos: number;
  alt: string;
  description?: string;
  price?: number | null;
}): Product {
  const { photos: count, alt, ...rest } = p;
  return {
    id: p.slug,
    description: DESCRIPTION,
    price: null,
    images: photos(p.slug, count, alt),
    variants: single(p.slug),
    ...rest,
  };
}

export const products: Product[] = [
  // ── Polos ───────────────────────────────────────────────
  product({
    slug: "polo-lacoste-gola-contraste",
    name: "Polo Gola Contraste",
    brand: "Lacoste",
    category: "polos",
    photos: 4,
    alt: "Polos Lacoste com gola e friso em cor contrastante",
    details: ["Gola e punhos com friso contrastante", "Diversas combinações de cor nas fotos"],
    isNew: true,
    featured: true,
  }),
  product({
    slug: "polo-lacoste-texturizada",
    colors: ["Branco", "Verde-sálvia"],
    name: "Polo Texturizada",
    brand: "Lacoste",
    category: "polos",
    photos: 3,
    alt: "Polo Lacoste de tecido texturizado em branco e verde-sálvia",
    details: ["Tecido com textura canelada", "Fotos em branco e verde-sálvia"],
    featured: true,
  }),
  product({
    slug: "polo-lacoste-friso-listrado",
    colors: ["Marinho", "Creme", "Azul-claro", "Grafite"],
    name: "Polo Friso Listrado",
    brand: "Lacoste",
    category: "polos",
    photos: 2,
    alt: "Polos Lacoste com listras na gola e na lateral",
    details: ["Listras na gola e no acabamento", "Fotos em marinho, creme, azul-claro e grafite"],
    isNew: true,
    featured: true,
  }),
  product({
    slug: "polo-lacoste-essencial",
    name: "Polo Essencial",
    brand: "Lacoste",
    category: "polos",
    photos: 2,
    alt: "Polos Lacoste lisas em várias cores",
    details: ["Modelo liso com logo bordado", "Várias cores nas fotos"],
  }),
  product({
    slug: "polo-lacoste-logo-bordado",
    name: "Polo Logo Bordado",
    brand: "Lacoste",
    category: "polos",
    photos: 1,
    alt: "Polos Lacoste em tons pastel com logo bordado no peito",
    details: ["Coleção Summer 2026", "Tons pastel nas fotos"],
    isNew: true,
  }),
  product({
    slug: "polo-boss-monograma",
    name: "Polo Monograma",
    brand: "BOSS",
    category: "polos",
    photos: 2,
    alt: "Polos BOSS com padronagem de monograma",
    details: ["Padronagem de monograma em relevo"],
    featured: true,
  }),
  product({
    slug: "polo-boss-ziper",
    colors: ["Verde", "Preto", "Branco"],
    name: "Polo Zíper",
    brand: "BOSS",
    category: "polos",
    photos: 1,
    alt: "Polos BOSS com fechamento em zíper em verde, preto e branco",
    details: ["Fechamento com zíper", "Fotos em verde, preto e branco"],
  }),
  product({
    slug: "polo-calvin-klein-jeans",
    colors: ["Rosa", "Azul-claro", "Preto"],
    name: "Polo",
    brand: "Calvin Klein Jeans",
    category: "polos",
    photos: 1,
    alt: "Polos Calvin Klein Jeans em rosa, azul e preto",
    details: ["Fotos em rosa, azul-claro e preto"],
  }),
  product({
    slug: "polo-faixa-tricolor",
    name: "Polo Faixa Tricolor",
    category: "polos",
    photos: 1,
    alt: "Polos pretas com faixa vermelha, branca e azul nos ombros",
    details: ["Faixa tricolor nos ombros e mangas"],
  }),

  // ── Camisetas ───────────────────────────────────────────
  product({
    slug: "camiseta-lacoste-sport-club",
    name: "Camiseta Sport Club",
    brand: "Lacoste",
    category: "camisetas",
    photos: 2,
    alt: "Camisetas Lacoste Sport Club com estampa gráfica",
    isNew: true,
    featured: true,
  }),
  product({
    slug: "camiseta-lacoste-paris",
    name: "Camiseta Paris",
    brand: "Lacoste",
    category: "camisetas",
    photos: 1,
    alt: "Camisetas Lacoste Paris com logo em relevo",
    details: ["Escrita Lacoste Paris no peito"],
  }),
  product({
    slug: "camiseta-lacoste-logo-classico",
    name: "Camiseta Logo Clássico",
    brand: "Lacoste",
    category: "camisetas",
    photos: 1,
    alt: "Camisetas Lacoste com logo grande e crocodilo",
  }),
  product({
    slug: "camiseta-lacoste-roland-garros",
    name: "Camiseta Roland Garros",
    brand: "Lacoste",
    category: "camisetas",
    photos: 1,
    alt: "Camisetas Lacoste com estampa Roland Garros Club",
  }),
  product({
    slug: "camiseta-lacoste-gola-contraste",
    name: "Camiseta Gola Contraste",
    brand: "Lacoste",
    category: "camisetas",
    photos: 1,
    alt: "Camisetas Lacoste com gola em listras contrastantes",
  }),
  product({
    slug: "camiseta-lacoste-tennis",
    name: "Camiseta Tennis",
    brand: "Lacoste",
    category: "camisetas",
    photos: 2,
    alt: "Camisetas Lacoste com emblema de quadra de tênis",
  }),

  // ── Shorts & Conjuntos ──────────────────────────────────
  product({
    slug: "conjunto-lacoste",
    name: "Conjunto Camiseta + Short",
    brand: "Lacoste",
    category: "shorts-e-conjuntos",
    photos: 5,
    alt: "Conjuntos Lacoste de camiseta e short",
    isNew: true,
    featured: true,
  }),
  product({
    slug: "short-lacoste",
    name: "Short",
    brand: "Lacoste",
    category: "shorts-e-conjuntos",
    photos: 2,
    alt: "Shorts Lacoste em várias cores",
  }),

  // ── Bonés ───────────────────────────────────────────────
  product({
    slug: "bone-lacoste",
    name: "Boné",
    brand: "Lacoste",
    category: "bones",
    photos: 1,
    alt: "Bonés Lacoste pretos com logo",
    featured: true,
  }),
];
