import type { ProductImage } from "@/lib/types";

/**
 * Mídias de campanha. Arquivos em /public/images/... — use somente fotos próprias
 * da BGOD ou com licença de uso comercial. Campos `undefined` mostram um espaço reservado.
 */
export const media: {
  hero?: ProductImage;
  /** Vídeo de campanha opcional para o hero (mp4/webm, sem áudio, < 6 MB). */
  heroVideo?: string;
  editorial?: ProductImage & { position?: string };
  institutional?: ProductImage;
  /** Fotos do Instagram exibidas na galeria (ordem de exibição). */
  gallery: (ProductImage & { href?: string })[];
} = {
  // O hero usa a coroa 3D sobre preto; preencha para usar foto/vídeo de campanha por trás.
  hero: undefined,
  heroVideo: undefined,
  editorial: {
    src: "/images/campanha/summer-2026-praia.jpg",
    alt: "Coleção Summer 2026 — modelo com camisa e short claros na praia",
    position: "50% 38%",
  },
  institutional: {
    src: "/images/campanha/summer-2026-chapeu.jpg",
    alt: "Modelo de chapéu e camisa azul-clara à beira-mar",
  },
  gallery: [
    { src: "/images/produtos/polo-lacoste-friso-listrado-1.jpg", alt: "Polos Lacoste com friso listrado" },
    { src: "/images/produtos/camiseta-lacoste-logo-classico-1.jpg", alt: "Camisetas Lacoste logo clássico" },
    { src: "/images/produtos/polo-boss-ziper-1.jpg", alt: "Polos BOSS com zíper" },
    { src: "/images/produtos/camiseta-lacoste-sport-club-1.jpg", alt: "Camisetas Lacoste Sport Club" },
    { src: "/images/produtos/polo-lacoste-gola-contraste-4.jpg", alt: "Polos Lacoste gola contraste" },
    { src: "/images/produtos/conjunto-lacoste-2.jpg", alt: "Conjunto Lacoste camiseta e short" },
  ],
};
